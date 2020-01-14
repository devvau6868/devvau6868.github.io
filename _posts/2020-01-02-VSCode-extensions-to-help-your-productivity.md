---
layout: post
title: VSCode extensions to help your productivity
date: 2020-01-02 20:00:00 +0700
description: Visual Studio Code extensions to help your productivity
img: vscode-extension.gif # Add image post (optional)
tags: [VSCode, Extensions] # add tag
---
 
Microsoft have made some amazing contributions to the dev community, Visual Studio Code in particular. I recently [made the switch to VSCodium](https://dev.to/misterf/why-and-how-you-should-to-migrate-from-visual-studio-code-to-vscodium-j7d) but this doesn't stop me from using all the same extensions as before.

I'm going to share some extensions I use to make my experience more productive and helpful. Hopefully there will be something useful for you to add to you setup.

# Project level extensions
## [Gistpad](https://marketplace.visualstudio.com/items?itemName=vsls-contrib.gistfs)

> ...manage GitHub Gists entirely within the editor. You can open, create, delete, fork, star and clone gists, and then seamlessly begin editing files as if they were local...

I've gone through my fair share of third party apps to manage my gists, this is a welcome addition to vscode.

![gistpad animation](https://i.giphy.com/media/VEscdYfDUljw5eDMZc/giphy.gif)

## [TODO Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)

> This extension quickly searches (using ripgrep) your workspace for comment tags like TODO and FIXME, and displays them in a tree view in the explorer pane. Clicking a TODO within the tree will open the file and put the cursor on the line containing the TODO.

This is really helpful when working in a team or on projects you pick and drop over time.

![screenshot](https://res.cloudinary.com/practicaldev/image/fetch/s--iNcMLghs--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://raw.githubusercontent.com/Gruntfuggly/todo-tree/master/resources/screenshot.png)

## [Gitlens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)

> GitLens supercharges the Git capabilities built into Visual Studio Code. It helps you to visualize code authorship at a glance via Git blame annotations and code lens, seamlessly navigate and explore Git repositories, gain valuable insights via powerful comparison commands, and so much more.

![gitlens preview](https://res.cloudinary.com/practicaldev/image/fetch/s--SxsPx3NQ--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://raw.githubusercontent.com/eamodio/vscode-gitlens/master/images/docs/gitlens-preview.gif)

## [Project Manager](https://marketplace.visualstudio.com/items?itemName=alefragnani.project-manager)

> ...helps you to easily access your projects, no matter where they are located... You can define your own Favorite projects, or choose for auto-detect VSCode projects, Git, Mercurial and SVN repositories or any folder.

![project manager sidebar](https://res.cloudinary.com/practicaldev/image/fetch/s--0eEIgL5T--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://raw.githubusercontent.com/alefragnani/vscode-project-manager/master/images/vscode-project-manager-side-bar.gif)

# Code level extensions
## [Tech Debt Tracker](https://marketplace.visualstudio.com/items?itemName=Stepsize.tech-debt-tracker)

> Inline debt ratings, the debt ratings tree, and the function metrics keep quality front of mind. Every function is analysed live & locally to help you write clean code and identify code that needs to be improved.

Tech Debt Tracker sends anonymous analytics back to the publisher, which you can turn off from settings if you need to.

What I particulary like about this extension is the inline debt rating at the top of your file.

![screenshot](https://res.cloudinary.com/practicaldev/image/fetch/s--ciH6NrsN--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://user-images.githubusercontent.com/4775299/70737178-3be98d00-1d12-11ea-9a47-410938197352.png)

## [Code Complexity](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-codemetrics)
Computes complexity in TypeScript / JavaScript / Lua files. It's not a standard metric, but it is a close approximation of Cyclomatic complexity.

Just like the previous extension, this puts a handy inline notice at the top of the file.

![screenshot](https://res.cloudinary.com/practicaldev/image/fetch/s--n4l3u7Xz--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://raw.githubusercontent.com/kisstkondoros/codemetrics/master/images/metric_details.png)

## [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)

> This extension will display inline in the editor the size of the imported package. The extension utilizes webpack with babili-webpack-plugin in order to detect the imported size.

# UI level enhancements
## [Bracket Pair Colorizer 2](https://marketplace.visualstudio.com/items?itemName=CoenraadS.bracket-pair-colorizer-2)

> This extension allows matching brackets to be identified with colours. The user can define which tokens to match, and which colours to use.

![screenshot](https://res.cloudinary.com/practicaldev/image/fetch/s--_Bdo-Tmc--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://raw.githubusercontent.com/CoenraadS/BracketPair/develop/images/example.png)

## [Indented Block Highlighting](https://marketplace.visualstudio.com/items?itemName=byi8220.indented-block-highlighting)

> Highlights the intented area that contains the cursor.

This might be a little overkill, but I like it combined with Bracket Pair Colorizer.

![demo](https://res.cloudinary.com/practicaldev/image/fetch/s--cKek039A--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://raw.githubusercontent.com/byi8220/indented-block-highlighting/master/usage.gif)

## [Indenticator](https://marketplace.visualstudio.com/items?itemName=SirTori.indenticator)

> Visually highlights the current indent depth

![demo](https://res.cloudinary.com/practicaldev/image/fetch/s--T_J01r-O--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://raw.githubusercontent.com/SirTori/indenticator/master/img/demo.gif)

## [Image Preview](https://marketplace.visualstudio.com/items?itemName=kisstkondoros.vscode-gutter-preview)
This handy extension allows you to see image previews in the gutter or on hover.

![screenshot](https://res.cloudinary.com/practicaldev/image/fetch/s--WKAjCwwo--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://raw.githubusercontent.com/kisstkondoros/gutter-preview/master/images/sample.png)

There are plenty more extensions, but these are the ones I enjoy using. Hopefully there is something new here for you or you can suggest something, I'm always looking for ways to make my development experience better!