---
layout: post
title: Build a chat app with Laravel and Vue
date: 2020-01-01 00:00:00 +0300
description: Build a chat app with Laravel and Vue
img: laravel-vue.png # Add image post (optional)
tags: [Laravel, Vue] # add tag
---

It's been a while since I wrote about Laravel and thought I should do something fun with it. In this tutorial, I will show you how to build a web-based chat application using Laravel and Vue.js quickly. With a simple step by step guide, you will be able to create a system that supports user authentication and authorization before participating in a chat session.

Due to the fact that Laravel is shipped with Vue.js by default, It is very easy to build single-page applications, handle frontend logic by creating [Vue components](https://vuejs.org/v2/guide/components.html) and use them like you would use a regular HTML tag inside the blade template of Laravel.

To make this chat application fully functional, you will leverage CometChat chat infrastructure to enhance the sharing of instant messages.

# What we will build
At the end of this tutorial, you would have built a system that will allow users to send and receive messages in realtime, as shown below:

![](https://paper-attachments.dropbox.com/s_D634BB25EFFC0EAA9BC956CCBF00962894D99381865724A63C8FE9C72B11A92B_1576004249041_ezgif.com-video-to-gif+2.gif)


To join a chat session, a user will have to provide a unique `username` and `password` as credentials during the registration process, afterward, such user will be created on CometChat as well. This means when registering a new user within your application, the details of such users will be saved in your local database first and then sent to the CometChat server using its [REST API](https://prodocs.cometchat.com/reference). Laravel will be used to build a backend API needed for these processes and make provisions of endpoints for Vue.js on the frontend.

If you would love to try out the working demo for this tutorial, you can download the complete source code [here on GitHub](https://github.com/christiannwamba/lara-chat-app).

# Prerequisites
Before proceeding, this tutorial assumes you have:

> **Essential Reading**: [Learn React from Scratch! (2020 Edition)](https://bit.ly/2TtV1sA)


* A PHP development environment setup.
* Git installed on your computer. Follow this [link to download](https://git-scm.com/) Git if otherwise
* A global [installation of composer](https://getcomposer.org/download/), which will be used to install all dependencies for the project.
    * Note: Homebrew users can install composer by running brew install composer##


# CometChat?
CometChat is a developer platform that allows you to easily integrate chat features and building a realtime chat widget for a new or existing web and mobile application. It is a developer tool that makes implementing features such as;

* Group chat
* One on One chat
* Typing indicators
* Read and delivered indicators
* and a whole lot more, easy to craft.

You can read more about CometChat here on Comet’s [official website](https://www.cometchat.com/).

# CometChat’s authentication flow
It is compulsory that one must be authenticated as a user before you can make use of infrastructure made available by CometChat.

As proof of concept or to test a demo application, you can make use of the sample users that are being generated automatically for every new application created on CometChat. But for a production-ready application, it is advisable to take it a step further by making use of our REST API to programmatically create unique users, as you would see later in the tutorial.

Once a user is in place, authenticating such a user to CometChat, is as simple as calling the `CometChat.login()` the method from the JavaScript SDK. Before this method can work properly, you can either use the user’s UID and the auth-only secret key as a parameter for the `CometChat.login()` , or you can generate a unique auth token on CometChat via its REST API and use the generated token as they require a parameter.

For the purpose of this tutorial, you will learn how to use the auth token for authenticating a user.

# Creating an authentication server using Laravel
While CometChat can handle the login process of users from your application, It is important to note that CometChat SDK can only maintain the session of the logged-in user within the SDK and will not be able to handle user authentication for your application. So here, you will build an authentication server using Laravel.

# Setting up the Laravel application
The get started easily, you are going to set up a group chat application on top of a Laravel 5.8 application on [GitHub](https://github.com/christiannwamba/lara-chat-app-starter). This starter template already contains the required assets, stylesheet, and a couple of dependencies for the app.

You will be making use of Git to clone this repository and gradually add more code to make it fully functional.

To begin, from the terminal in your machine, navigate to your preferred project directory and run the following command to clone the starter template from GitHub:

{% highlight bash %}
// Clone repository
git clone https://github.com/christiannwamba/lara-chat-app-starter.git
{% endhighlight %}
Next, move into the newly created project:

{% highlight bash %}
cd lara-chat-app-starter
{% endhighlight %}

and install all the dependencies for Laravel using composer by running the following command:
{% highlight bash %}
composer install
{% endhighlight %}

Now, create a `.env` file and then copy the content of `.env.example` into it:
{% highlight bash %}
// create a .env file
touch .env

// update its content
cp .env.example .env
{% endhighlight %}

Generate a key for your project using the `artisan` command:
{% highlight bash %}
php artisan key:generate
{% endhighlight %}

Once you are done, the next step is to create a connection to your database. To achieve that, open the `.env` file and update the `DB_DATABASE`, `DB_USERNAME` and `DB_PASSWORD` values with the appropriate contents.

> 💡 To avoid running into any error, ensure that you have created a database before running the next command.

After successfully completing this basic setup, you can now proceed to generate the database structure for your application using the following command:
{% highlight bash %}
php artisan migrate
{% endhighlight %}

The preceding command will run the migration file located in `database/migrations/` with a file name that looks like this `2014_10_12_000000_create_users_table.php` and create a `Users\` table with the appropriate fields.

# Creating routes
In chronological order, what you want to achieve with the backend of this application is to create endpoints with the purpose of handling three different functionalities:

* Registering a user
* Logging in user into your application
* Saving a unique auth token for each user.

Since the intention is to build the backend as an API that will be consumed by Vue.js (Frontend), it is absolutely fine to make use of the routes specifically created for that purpose by Laravel. First, open the `routes/web.php` file and ensure that the content in it is the same as what you have below. Otherwise, update its content with:
{% highlight php %}
// routes/web.php

Route::get('/{any}', function () {
    return view('layouts.master');
})->where('any','.*');
{% endhighlight %}

The code snippet above was used to register a route that can respond to all HTTP verbs. This is ideal for this application as all the routing will be handled by Vue.js, and Laravel will only render a single master layout view named `layouts.master`. You will create this file in a bit. Next, in `routes/api.php`, add the following routes to the list:

{% highlight php %}
// routes/web.php
Route::post('/register', 'UserController@register')->middleware('guest');
Route::post('/login', 'UserController@login')->middleware('guest');
Route::post('/update/token', 'UserController@updateToken');
{% endhighlight %}

# Create the User Controller
From your terminal, ensure that you are still within the root directory of the application and run the following command that will create a new `UserController`:

{% highlight bash %}
php artisan make:controller UserController
{% endhighlight %}

You will see the following output in the terminal:
{% highlight bash %}
Controller created successfully
{% endhighlight %}

This will automatically generate a new file named `UserController.php` located in `app/Http/UserController.php`. Inside this controller class, you will add the following methods to match your project routes: `register`, `login`, `updateToken`.

Register a user Here, you will implement the logic to register a user for your application. Open the newly created `app/Http/Controllers/UserController.php` and update its content with the following:
{% highlight php %}
// app/Http/Controllers/UserController.php
<?php
namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

    public function register(Request $request) {
        $username = $request->get('username');
        $password = $request->get('password');

        if ($this->checkIfUserExist($username)) {
            return response()->json([
                'message' => 'User already exist'
            ], 500);
        } else {
            $password = bcrypt($password);
            User::create([
                'username' => $username,
                'password' => $password
            ]);
            return response()->json(true);
        }
    }

    private function checkIfUserExist($username) {
        $user = User::where('username', $username)->first();

        if ($user) {
            return $user;
        } else {
            return false;
        }
    }
}
{% endhighlight %}

The method above uses Laravel’s [Request method](https://github.com/christiannwamba/lara-chat-app-starter) to obtain the `username` and `password` of a particular user. And then, there is a check carried out to note if such a user exists in the database by calling a private method `checkIfUserExist()`, which will either return the `User` object if it exist or `false` if otherwise.

**Authenticate the user within the application** Now add the `login()` to handle the authentication of users within the application:

{% highlight php %}
public function login(Request $request) {
    $username = $request->get('username');
    $password = $request->get('password');

    $user = $this->checkIfUserExist($username);

    if ($user) {
        $confirmPassword = Hash::check($password, $user->password);
        return response()->json([
            'status' => $confirmPassword,
            'token' => $user->authToken
        ]);
    } else {
        return response()->json([
            'message' => "Invalid credentials"
        ], 500);
    }
}
{% endhighlight %}

Here, after grabbing the `username` and `password` of a particular user, you checked if the user exists in your project’s database. If found, you will confirm to ensure that the password hash matches the one that was provided by the user and then returns the auth token that was generated for the user during the registration process.

**Save Users’ token in the database** One of the approaches to authenticate users in CometChat is by calling the `CometChat.login()` and passing a generated `token` to it as an argument. CometChat already made a provision to [generate that on the fly through the REST API](https://prodocs.cometchat.com/reference) without much hassle. You will do that once you start the implementation of the frontend logic. To save the generated token for each user, add the following method to the `UserController`:

{% highlight php %}
public function updateToken(Request $request) {
    $username = $request->get('uid');
    $token = $request->get('token');

    User::where('username', $username)->update([
        'authToken' => $token
    ]);
}
{% endhighlight %}

This will receive the generated `Auth token` for the user by CometChat and use Laravel eloquent to update the Database with the value.

# Create the master layout
Ensure that the file located in `resources/views/layouts/master.blade.php` contains the following contents:

{% highlight php %}
<!-- resources/views/layouts/master.blade.php -->
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <title>Laravel Chat Application</title>
</head>
<body>
<div id="app">
    <App />
</div>

<script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
{% endhighlight %}

This is a basic HTML template with a link to the stylesheet and JavaScript file for the application. Also, a custom HTML tag `<App />` representing the markup to render the AppComponent in the `resources/js/App.vue` files. The `AppComponent` is the entry point of the Vue.js application. More about this later in the tutorial.

Now that you are done setting up the contents required for the Backend, you can now proceed to create the structure for the frontend of the application.

# Getting started with the frontend
Earlier, you started this project by downloading a starter template from GitHub. As mentioned, it contains some dependencies that you need to install for this application before you can proceed. You have already installed the dependencies for the Backend and now open another terminal from your project’s directory and run the following command to install the dependencies for the frontend using NPM:
{% highlight bash %}
// install dependencies 
npm install
{% endhighlight %}

Here is a list of some of the dependencies that will be installed from your `package.json` file:

* `vue`: Vue.js for building a single page application.
* `axios`: A promise-based HTTP client for the browser
* `@cometchat-pro/chat`: This is the JavaScript SDK for CometChat
* `vue-router`: This is the official router for Vue.js

**Create a CometChat account** To be able to use and integrate CometChat into your application, you need to create an account. Head over to [CometChat website](https://www.cometchat.com/) and [create a free CometChat Pro account](https://app.cometchat.io/register). Once you fill all the required information, you will have a trial account set up for you immediately. Now, proceed to your [CometChat dashboard](https://app.cometchat.io/apps), then add a new app by choosing the stable version of CometChat SDK (v2) and select your preferred region, as it will be used as it will be required when initializing CometChat within your project, I have selected `Europe` for this tutorial. Next, enter a name for your app, then click on the `+` sign and wait for a couple of seconds for your new app to be created.

![](https://paper-attachments.dropbox.com/s_96FD57C7C08D425EDE7D65AA10E29003B8F42BCE9C0BD7735B040319CCB0D742_1575376156013_app-comet.png)

Once your application is successfully created, click on **Explore** to open it and then go to the **API Keys** tab, copy both your **APP ID** and **API Key** (with full access scope) and save it somewhere. Also, by default, CometChat will automatically create a group with a unique GUID for your app. Click on **Groups** tab to access it and copy it as well.

Next, back in your Laravel application, open the `.env` file and locate these variables:
{% highlight bash %}
MIX_COMMETCHAT_API_KEY=YOUR_COMMETCHAT_API_KEY
MIX_COMMETCHAT_APP_ID=YOUR_COMMETCHAT_APP_ID
MIX_COMMETCHAT_GUID=YOUR_COMMETCHAT_GUID
{% endhighlight %}

Replace the `YOUR_COMMETCHAT_API_KEY, YOUR_COMMETCHAT_APP_ID, YOUR_COMMETCHAT_GUID` placeholder with the appropriate credentials as obtained from your CometChat dashboard. With that out of the way, you can now start setting up the group chat.

# Initialize CometChat
It is recommended by CometChat that your application must call the `init()` method from the JavaScript SDK once your app starts. This will enable your app to communicate with the CometChat server easily. To achieve that, navigate to `resources/js/App.vue` file and update the script section with the following code:

{% highlight javascript %}
// resources/js/App.vue

<script>
    import { CometChat } from "@cometchat-pro/chat";
    export default {
        created() {
            this.initializeApp();
        },

        methods: {
            initializeApp() {
                let appID = process.env.MIX_COMMETCHAT_APP_ID;

                let cometChatSettings = new CometChat.AppSettingsBuilder()
                    .subscribePresenceForAllUsers()
                    .setRegion("eu")
                    .build();

                CometChat.init(appID, cometChatSettings).then(
                    () => {
                        console.log("Initialization completed successfully");
                    },
                    error => {
                        console.log("Initialization failed with error:", error);
                    }
                );
            }
        }
    };
</script>
{% endhighlight %}
Here, you initialise CometChat with your unique APP_ID and REGION.

> 💡 If you chose the US as your region, write setRegion(“us”) instead of setRegion(“eu”) as did above

# Register and create a new user
The approach for this application is to register a user into your application and immediately create the same user programmatically in CometChat. You will achieve all these by using the REST API provided by CometChat once the registration process is successful within your application.

To begin, you will create a new folder named `views` within `resources/js` folder. And within the newly created folder, create a new file and call it `Register.vue`. Open it and update its `<template></template>` section with the following content:

{% highlight vue %}
// resources/js/views/Register.vue
<template>
    <div class="login-page">
        <div class="login">
            <div class="register-container auth-container">
                <div class="register-image-column">
                    <div class="image-holder">
                        <img src="../../assets/login-illustration.svg" alt="">
                    </div>
                </div>

                <div class="register-form-column">
                    <form v-on:submit.prevent="registerAppUser">
                        <h3>Create an Account</h3>
                        <div class="form-wrapper">
                            <label for="username">Username</label>
                            <input type="text" name="username" id="username" v-model="username" placeholder="Enter your username" class="form-control" required>
                        </div>

                        <div class="form-wrapper">
                            <label for="password">Password</label>
                            <input type="password" name="password" id="password" v-model="password" placeholder="Enter your password" class="form-control" required>
                        </div>

                        <div class="form-wrapper">
                            <label for="password_confirmation">Confirm Password</label>
                            <input type="password" name="password_confirmation" id="password_confirmation" v-model="password_confirmation" placeholder="Re-enter password" class="form-control" required>
                        </div>
                        <button type="submit">SIGN UP &nbsp;&nbsp;<span v-if="showSpinner" class="fa fa-spin fa-spinner"></span> </button>
                    </form>

                    <div class="text-center m-t-50 link-reg">
                        <p v-on:click="redirectToLogin">Do you have an account?  <span>Log in</span></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
{% endhighlight %}

The code snippet above contains input fields that will be used to obtain the `username`, `password`, and `password_confirmation` of a user during the registration process. The HTML form will call a method named `registerAppUser()` once submitted.

Now, within the `<script></script>` section of the Register Component, paste the following code:

{% highlight javascript %}
// resources/js/views/Register.vue

<script>
    export default {
        data() {
            return {
                username: "",
                password: '',
                password_confirmation: '',
                showSpinner: false,
            };
        },
        methods: {
            registerAppUser() {
                if (this.username && this.password && this.password_confirmation) {
                    if (this.password && this.password_confirmation) {
                        let userData = {
                            username: this.username,
                            password: this.password,
                            password_confirmation: this.password_confirmation
                        };

                        axios.post(`http://localhost:8000/api/register`, userData)
                            .then(response => {
                                if (response.data) {
                                    this.createUserOnCometChat(this.username);
                                }
                            }).catch(error => {
                            alert(error.response.data.message);
                        })
                    }
                }
            },
            redirectToLogin() {
                this.$router.push({name: 'login'})
            }
        }
    };
</script>
{% endhighlight %}

Above, you defined the properties and corresponding initial values within the data option and then created the `registerAppUser()` method. This method obtained the `username` and `password` of a user and used `axios` to send it to the backend (Laravel). Once the user’s details are saved successfully, the backend API will return a successful response.

If the registration process was successful, a new method to programmatically create the user on CometChat would be called.

**Create a user on CometChat**

Add the following method to create the user on CometChat:
{% highlight javascript %}
// resources/js/views/Register.vue

async createUserOnCometChat(username) {
    let url = `https://api-eu.cometchat.io/v2.0/users`;
    let data = {
        uid: username,
        name: `${username} sample`,
        avatar: 'https://data-eu.cometchat.io/assets/images/avatars/captainamerica.png',
    };

    try {
        const userResponse = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                appid: process.env.MIX_COMMETCHAT_APP_ID,
                apikey: process.env.MIX_COMMETCHAT_API_KEY,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data),
        });
        const userJson = await userResponse.json();

        console.log('New User', userJson);
        this.createAuthTokenAndSaveForUser(username);
        this.redirectToLogin();
    } catch (error) {
        console.log('Error', error);
    }
}
{% endhighlight %}

This method takes the username of the registered user after a successful sign-up process and passes it along with a custom name to CometChat Create User API. After the user has been created successfully, another method to create an auth via the CometChat API for the new user was also invoked.

**Creating a new CometChat auth token** Add the method below to create an auth token for the user and the token in your database once the process is completed:
{% highlight javascript %}
// resources/js/views/Register.vue

async createAuthTokenAndSaveForUser(uid) {
    let url = `https://api-eu.cometchat.io/v2.0/users/${uid}/auth_tokens`;

    try {
        const tokenResponse = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                appid: process.env.MIX_COMMETCHAT_APP_ID,
                apikey: process.env.MIX_COMMETCHAT_API_KEY,
                'Content-Type': 'application/json'
            }),
        });
        const tokenJSON = await tokenResponse.json();
        this.addUserToAGroup(uid);
        this.sendTokenToServer(tokenJSON.data.authToken, tokenJSON.data.uid);
    } catch (error) {
        console.log('Error Token', error);
    }

}
{% endhighlight %}

**Add user to a group** CometChat has already created members for the default group for your application automatically. So, before users that are created through your Laravel application can participate in a chat session, they need to be added as a member. Use the following method to add users of your application to a group:

{% highlight javascript %}
// resources/js/views/Register.vue

async addUserToAGroup(uid) {
    let url = `https://api-eu.cometchat.io/v2.0/groups/${process.env.MIX_COMMETCHAT_GUID}/members`;
    let data = {
        "participants":[uid]
    };

    try {
        const groupResponse = await fetch(url, {
            method: 'POST',
            headers: new Headers({
                appid: process.env.MIX_COMMETCHAT_APP_ID,
                apikey: process.env.MIX_COMMETCHAT_API_KEY,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data),
        });
        const groupJson = await groupResponse.json();

        console.log('Added to group', groupJson);
    } catch (error) {
        console.log('Error', error);
    }
},
{% endhighlight %}

**Save AuthToken in database** Having generated an `AuthToken` for your app users on CometChat, you need to save the token in the database for that particular user. With this in place, the token can be retrieved as part of the user's details when authenticating the user within your application. Add the method below for that purpose:

{% highlight javascript %}
// resources/js/views/Register.vue

sendTokenToServer(token, uid) {
    axios.post(`http://localhost:8000/api/update/token`, {token, uid})
        .then(response => {
            console.log("Token updated successfully", response);
        }).catch(error => {
        alert(error.response.data.message);
    })
}
{% endhighlight %}

# Authenticating users
Since you can now register users, create such users on CometChat and add them as a member of a particular group through your application, you will now proceed to authenticate users within your application and also on CometChat.

To begin, create a new file within `resources/js/views` folder and name it `Login.vue`. Open the newly created file and update the `<template></template>` section with the following code:

{% highlight javascript %}
// resources/js/views/Login.vue

<template>
    <div class="login-page">
        <div class="login">
            <div class="login-container auth-container">
                <div class="login-form-column">
                    <form v-on:submit.prevent="authLoginAppUser">
                        <h3>Hello!</h3>
                        <div class="form-wrapper">
                            <label>Username</label>
                            <input type="text" name="username" id="username" v-model="username" placeholder="Enter your username" class="form-control" required>
                        </div>

                        <div class="form-wrapper">
                            <label for="password">Password</label>
                            <input type="password" name="password" id="password" v-model="password" placeholder="******" class="form-control" required>
                        </div>
                        <button type="submit">LOG IN &nbsp;&nbsp;<span v-if="showSpinner" class="fa fa-spin fa-spinner"></span> </button>
                    </form>

                    <div class="text-center m-t-50 link-reg">
                        <p v-on:click="redirectToRegister">Don't have an account? <span>Register</span></p>
                    </div>
                </div>

                <div class="login-image-column">
                    <div class="image-holder">
                        <img src="../../assets/login-illustration.svg" alt="">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
{% endhighlight %}
Here, the HTML form will receive the inputted value for the `username` and `password` of a user and send it to be processed by the `authLoginAppUser()` method once the form is submitted. Next, use the content below to update the `<script></script>` section of the Login component:
{% highlight vue %}
// resources/js/views/Login.vue
<script>
    import { CometChat } from "@cometchat-pro/chat";
    export default {
        data() {
            return {
                username: "",
                password: '',
                showSpinner: false,
                token: '',
            };
        },
        methods: {
            authLoginAppUser() {
                let userData = {
                    username: this.username,
                    password: this.password
                };

                if (this.username && this.password) {
                    axios.post(`http://localhost:8000/api/login`, userData).then(response => {
                        this.logUserInToCometChat(response.data.token)
                    }).catch(error => {
                        alert(error.response.data.message);
                        console.log(error.response.data.message);
                    })
                } else {
                    alert('Please check your credentials');
                }
            },
            redirectToRegister() {
                this.$router.push({name: 'register'});
            }
        }
    };
</script>
{% endhighlight %}

The `authLoginAppUser()` method will receive the `username` and `password` of a user and use axios to post it to the backend API for authentication. If the credential inputted by the user is correct, the `authToken` generated for such user during the registration process will be retrieved and returned as part of the JSON response for further usage.

The returned `authToken` will now be used to log the user in on CometChat. Add the following method, immediately after the `authLoginAppUser` for that purpose:

{% highlight javascript %}
logUserInToCometChat(token) {
    this.showSpinner = true;
    CometChat.login(token).then(
        () => {
            this.showSpinner = false;
            console.log("successfully login user");
            this.$router.push({
                name: 'chat',
                params: {username: this.username, authenticated: true}
            });
        },
        error => {
            this.showSpinner = false;
            alert("Whops. Something went wrong. This commonly happens when you enter a username that doesn't exist. Check the console for more information");
          this.$router.push({
              name: 'login',
              params: {username: this.username, authenticated: true}
          });
            console.log("Login failed with error:", error.code);
        }
    );
},
{% endhighlight %}

Here, you called the `login()` method from CometChat SDK and passed the `authToken` of the user to it as a parameter. Once the user has been authenticated successfully, you will redirect the user to the Chat page by using Vue Router, which handles navigation for the application. Otherwise, a prompt with the appropriate message of why the process failed will be displayed, and the user will be redirected back to the login page.

# The chat view
Create a new file named `Chat.vue` within the `resources/js/views` and update the `<template></template>` section with the following content:

{% highlight javascript %}
// resources/js/views/Chat.vue

<template>
    <div class="booker">
        <nav-bar :name="this.username" :avatar="this.avatar" />
        <div class="chat">
            <div class="container">
                <div class="msg-header">
                    <div class="active">
                        <h5>#General</h5>
                    </div>
                </div>

                <div class="chat-page">
                    <div class="msg-inbox">
                        <div class="chats" id="chats">
                            <div class="msg-page" id="msg-page">

                                <div
                                    v-if="loadingMessages"
                                    class="loading-messages-container"
                                >
                                    <spinner :size="100"/>
                                    <span class="loading-text">
                            Loading Messages
                          </span>
                                </div>
                                <div class="text-center img-fluid empty-chat" v-else-if="!groupMessages.length" >
                                    <div class="empty-chat-holder">
                                        <img src="../../assets/empty-state.svg" class="img-res" alt="empty chat image">
                                    </div>

                                    <div>
                                        <h2> No new message? </h2>
                                        <h6 class="empty-chat-sub-title">
                                            Send your first message below.
                                        </h6>
                                    </div>
                                </div>

                                <div v-else>
                                    <div v-for="message in groupMessages" v-bind:key="message.id">
                                        <div class="received-chats" v-if="message.sender.uid !== uid">
                                            <div class="received-chats-img">
                                                <img v-bind:src="message.sender.avatar" alt="" class="avatar">
                                            </div>

                                            <div class="received-msg">
                                                <div class="received-msg-inbox">
                                                    <p><span>{{ message.sender.uid }}</span><br>{{ message.data.text }}</p>
                                                </div>
                                            </div>
                                        </div>


                                        <div class="outgoing-chats" v-else>
                                            <div class="outgoing-chats-msg">
                                                <p>{{ message.data.text }}</p>
                                            </div>

                                            <div class="outgoing-chats-img">
                                                <img v-bind:src="message.sender.avatar" alt="" class="avatar">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="msg-bottom">
                        <form class="message-form" v-on:submit.prevent="sendGroupMessage">
                            <div class="input-group">
                                <input type="text" class="form-control message-input" placeholder="Type something" v-model="chatMessage" required>
                                <spinner
                                    v-if="sendingMessage"
                                    class="sending-message-spinner"
                                    :size="30"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
{% endhighlight %}

The chat view will house all the logic required to interact with the CometChat API to implement the chat functionality, which is the core feature of your application. Here, we will get the details of the logged-in user, implement a method to send and receive messages from a group chat, and also fetch all previous messages sent by a user.

Here, once a user is authenticated and redirected to the chat page, you will receive the user details and display the unique username, avatar, and also an empty chat page for users who just joined a new group with no previous messages.

Also included is a form with an input field that will be used by a user to send a message to a group. The form will be processed by a method that will be implemented later in this section named `sendGroupMessage()`.

Get the logged in user details You will retrieve the details of the currently logged in user by calling a method named `getLoggedInUser()`. This will return a [User](https://prodocs.cometchat.com/docs/js-appendix#section-user) object containing all the information related to the logged-in user. Begin by adding this `<script>` section to this component. Place the contents below within the `Chat.vue` immediately after the closing tag of the `<template>` section:

{% highlight javascript %}
// resources/js/views/Chat.vue

<script>
    import { CometChat } from "@cometchat-pro/chat";
    import NavBar from "../components/NavBar.vue";
    import Spinner from "../components/Spinner.vue";

    export default {
        name: "home",
        components: {
            NavBar,
            Spinner
        },
        data() {
            return {
                username: "",
                avatar: "",
                uid: "",
                sendingMessage: false,
                chatMessage: "",
                loggingOut: false,
                groupMessages: [],
                loadingMessages: false
            };
        },
        created() {
            this.getLoggedInUser();
        },
        methods: {
            getLoggedInUser() {
                CometChat.getLoggedinUser().then(
                    user => {
                        this.username = user.name;
                        this.avatar = user.avatar;
                        this.uid = user.uid;
                    },
                    error => {
                        this.$router.push({
                            name: "homepage"
                        });
                        console.log(error);
                    }
                );
            },
        }
    };
</script>
{% endhighlight %}

Once the details of the currently authenticated user are retrieved, the name, the avatar (if any), and unique user Id will also be updated. Otherwise, the user will be redirected to the login page

**Send new messages** Add the method below to implement the logic to send a new message to CometChat server during a group chat session:

{% highlight javascript %}
sendGroupMessage() {
    this.sendingMessage = true;
    var receiverID = process.env.MIX_COMMETCHAT_GUID;
    var messageText = this.chatMessage;
    var receiverType = CometChat.RECEIVER_TYPE.GROUP;

    var textMessage = new CometChat.TextMessage(
        receiverID,
        messageText,
        receiverType
    );

    CometChat.sendMessage(textMessage).then(
        message => {
            console.log("Message sent successfully:", message);
            this.chatMessage = "";
            this.sendingMessage = false;
            this.$nextTick(() => {
                this.scrollToBottom()
            })
        },
        error => {
            console.log("Message sending failed with error:", error);
        }
    );
}
{% endhighlight %}

Here, you called the `sendMessage()` method and passed a constructed `TextMessage()` to it. The `TextMessage` class constructor takes the `GUID`, messageText and receiverType as parameters. **Receive incoming messages and Fetch** previous messages Lastly, add the following method to receive real-time incoming messages posted to a group by its participants:
{% highlight javascript %}
export default {
    ...
    mounted() {
        this.loadingMessages = true
        var listenerID = "UNIQUE_LISTENER_ID";

        const messagesRequest = new CometChat.MessagesRequestBuilder()
            .setLimit(100)
            .build()
        messagesRequest.fetchPrevious().then(
            messages => {
                console.log("Message list fetched:", messages);
                console.log("this.groupMessages", this.groupMessages)
                this.groupMessages = [
                    ...this.groupMessages,
                    ...messages
                ];
                this.loadingMessages = false
                this.$nextTick(() => {
                    this.scrollToBottom();
                })
            },
            error => {
                console.log("Message fetching failed with error:", error);
            }
        );

        CometChat.addMessageListener(
            listenerID,
            new CometChat.MessageListener({
                onTextMessageReceived: textMessage => {
                    console.log("Text message received successfully", textMessage);
                    // Handle text message
                    console.log(this.groupMessages)
                    this.groupMessages = [
                        ...this.groupMessages,
                        textMessage
                    ];
                    this.loadingMessages = false
                    this.$nextTick(() => {
                        this.scrollToBottom();
                    })
                }
            })
        );
    }
};
{% endhighlight %}

An event listener that takes a unique listenerID as a parameter was registered to listen for messages when your app is running. Lastly, once a user logs in, the `MessagesRequestBuilder` will be used to fetch any previous messages from the group and update the view with it.

# Update the router
Now, in order to render a component for each given path, you will update the generated router file within the project. Open the router file located in `.resources/js/routes.js` and replace its content with the following:
{% highlight vue %}
// resources/js/routes.js

import Vue from 'vue';
import VueRouter from "vue-router";
import Login from './views/Login';
import Register from "./views/Register";
import Chat from "./views/Chat";

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'homepage',
            redirect: 'login'
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/chat',
            name: 'chat',
            component: Chat,
        },
        {
            path: '*',
            name: 'Not found',
            redirect: 'login'
        }
    ]
})
{% endhighlight %}
You successfully map each route within your application to the respective component that will handle the logic. This is a basic format of configuring Vue Router for a Vue.js application.

# Configure the entry point
Navigate to `resources/js/app.js` and confirm that its content is the same as what you have below. If otherwise, feel free to update its content with this:
{% highlight javascript %}
// resources/js/app.js

require('./bootstrap');

window.Vue = require('vue');
import VueRouter from "vue-router";
import App from './App.vue';
import routes from "./routes";


Vue.use(VueRouter);

const app = new Vue({
    el: '#app',
    router: routes,
    components: {App}
});
{% endhighlight %}

Here, you imported Vue, Vue Router library, and the routes file. You then proceeded to create a Vue instance and pass both the router and application components to it.

# Test the application
If you have followed the tutorial up until now, well done! You have successfully built a group chat application with authentication using Laravel and Vue.js. To test all the implementation and be certain that it works as designed, open two different terminals, and ensure that you are within the project’s directory. Run the backend application from one of the terminals using the following command:
{% highlight bash %}
php artisan serve
{% endhighlight %}

This will start the application on the default port 8000. Next, to start the frontend application, use npm as shown here:
{% highlight bash %}
npm run watch
{% endhighlight %}

The preceding command will compile all the Vue.js project and continue running the app in watch mode for changes to any relevant files. Now, navigate to [http://localhost:8000](http://localhost:8000), to view the application in your browser:

![](https://paper-attachments.dropbox.com/s_96FD57C7C08D425EDE7D65AA10E29003B8F42BCE9C0BD7735B040319CCB0D742_1575390323033_homepage.png)

Register a user Click on the Register link to register a new user.


![](https://paper-attachments.dropbox.com/s_96FD57C7C08D425EDE7D65AA10E29003B8F42BCE9C0BD7735B040319CCB0D742_1575390716846_ezgif.com-video-to-gif.gif)

Once the registration process is successful, the user will both be created within your application and also on CometChat. You can log in into your [CometChat dashboard](https://app.cometchat.io/apps) and click on the Users tab to view the newly created users. Login and start a chat session Immediately after registration, you will be redirected to the Login page. Input the appropriate credential and start a chat session:
![](https://paper-attachments.dropbox.com/s_96FD57C7C08D425EDE7D65AA10E29003B8F42BCE9C0BD7735B040319CCB0D742_1575391098289_ezgif.com-video-to-gif+1.gif)

# Conclusion
In this tutorial, you built a chat application using Laravel and Vue.js. I hope that this gives you a proper understanding of how seamless it is to combine these tools to build an awesome chat experience. As you must have noticed, this application can actually be improved on, and I will leave that for you to enhance.

You can also clone the completed app from [Github](https://github.com/christiannwamba/lara-chat-app) if you want to have a reference.