---
layout: post
title: Why you should migrate from VSCode to VSCodium
date: 2020-01-05 00:00:00 +0300
description: Why and how you should migrate from Visual Studio Code to VSCodium
img: vscodium.png # Add image post (optional)
tags: [VSCode, VSCodium] # add tag
---
In this tutorial we'll go over why you should make the switch, and how you can retain all of your extensions when you do make the switch. It won't take more than a couple of minutes to do the actual change!

# The problem with Visual Studio Code
Visual Studio code is without a doubt [the most used](https://2019.stateofjs.com/other-tools/#text_editors) Code editor (for front end developers at least). It definitely provides a lot of helpful extensions of which there have been umpteen posts about.

![text editors](https://res.cloudinary.com/practicaldev/image/fetch/s--GSHJpZx0--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://2019.stateofjs.com/images/captures/text_editors.png)

## So why would I suggest you uninstall it for something else?
Whilst Microsoft’s vscode source code is open source (MIT-licensed), the product available for download (Visual Studio Code) is licensed under this [not-FLOSS license](https://code.visualstudio.com/license) and contains telemetry/tracking.

> ...may collect information about you and your use of the software, and send that to Microsoft... You may opt-out of many of these scenarios, but not all...

Microsoft insist this is for bug tracking and so on, which may well be true. But you never know what else the data could end up being used for in the hands of someone unscrupulous.

You can turn [off telemetry reporting](https://code.visualstudio.com/docs/getstarted/telemetry#_disable-telemetry-reporting) in Visual Studio Code, but there are plenty of opportunities for Microsoft to add other features in, which may slip past your attention.

Run this command in your terminal and check your output
```bash
code --telemetry
```
Not great, lets change it.

# VSCodium
> VSCodium ... is not a fork. This is a repository of scripts to automatically build Microsoft's vscode repository into freely-licensed binaries with a community-driven default configuration.

This means we don't have to go through the hassle of building each version ourselves, everything is done for us and the best part is we get these binaries **under the MIT license. Telemetry is completely disabled**.

Moreover, the editor itself looks and functions exactly the same, you won't miss a thing!

![vscodium logo](https://res.cloudinary.com/practicaldev/image/fetch/s--XyP_pYce--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://i.imgur.com/nuKSg5v.png)

That's a pretty simple and compelling argument.

![same but different](https://i.giphy.com/media/C6JQPEUsZUyVq/giphy.gif)

# How to install VSCodium and keep all your extensions and settings

This is the easy part. I will focus upon macOS, but these instructions are pretty simple to amend to other platforms.

*updated to include settings*

Make sure you have [Homebrew](https://brew.sh/) installed:
```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
## 1. Export all your installed extensions
First export all of your installed extensions into a text file (amend the output path as you see fit)
```bash
code --list-extensions | tee ~/vscode-extensions.txt
```
This will output all of your extensions to `~/vscode-extensions.txt` and list them out in your terminal for you to see.

## 2. Export your settings
Export any custom keybindings and user settings you have as default.
```bash
cp ~/Library/Application\ Support/Code/User/settings.json ~/vscode-settings.json

cp ~/Library/Application\ Support/Code/User/keybindings.json ~/vscode-keybindings.json
```
## 3. Uninstall Visual Studio Code
We use the force argument so that nothing gets left behind that would clash or interrupt VSCodium's install.
```bash
brew cask uninstall --force visual-studio-code
```
## 4. Install VSCodium
```bash
brew cask install vscodium
```

## 5. Reinstall your extensions for VSCodium
Because VSCodium has the same command line tools, we invoke them the same was as before
```bash
xargs -n1 code --install-extension < ~/vscode-extensions.txt
```
This went through the file and executed code `--install-extension` on each line individually.

You should have seen the output in your terminal.

If you get a `DeprecationWarning: Buffer()...` warning, you don't need to worry, it's related to Yarn and can be resolved with yarn `global add yarn`

## 6. Import your settings
```bash
mv ~/vscode-settings.json ~/Library/Application\ Support/VSCodium/User/settings.json

mv ~/vscode-keybindings.json ~/Library/Application\ Support/VSCodium/User/keybindings.json
```
Now you should be set and ready to go, the only thing you should notice is the logo is different. Everything else will work, feel and function the same as before.

Happy coding devs!