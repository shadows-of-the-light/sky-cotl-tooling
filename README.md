# Sky Tooling

Sky Tooling is a Visual Studio Code extension that provides support for Sky: Children of the Light localization files. This extension can not be used for any other purpose and is not affiliated with thatgamecompany. Cheating or modding the game is prohibited by the [Terms of Service](https://thatgamecompany.helpshift.com/hc/en/17-sky-children-of-the-light/faq/460-eula-terms-of-service/). This extension is only meant to be used for finding and reporting bugs in the game.

## Dear thatgamecompany

I'm a curious Sky players who loves all of your games. I'm also a programmer and I love to tinker with things. Yes, I may have peeked into the game files, but I have no intention of cheating or hacking. (Even if I wanted to, I couldn't. I have no experience in decompilation or game modding.) As a thank you for making such a beautiful game and working so hard this year, I want to give you this tool that I made so that you can use it to make the game even better for everyone. This VSCode extension provides features which are not found in Apple's or other localization tools. You broke 2 Guinness records, you brought together more people than ever before, you gave a completely new home for us and yet again you made us feel not alone. So I think you deserve help from the community, because you helped us so much. I hope you will find this tool useful and I hope it will help you to make the game even better. Thank you for everything!

## Features

- Support for Sky: Children of the Light localization files
  - Syntax highlighting and text decorations for formatting tags
  - Text completion (tags, icons, buttons, keys, etc.)
  - Error checking (invalid lines, duplicate keys, XML tags mismatch, etc.)
  - Quick fixes for some of the errors (invalid lines, duplicate keys, etc.)
  - Inlay hints (new line, some icons, etc.)
  - Text alignment for easier language editing
- Start the game quickly from Visual Studio Code (only works if you have the game installed on Steam)

## Building the extension

Requirements

- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en/)
- VSCode extension CLI manager: `npm install -g @vscode/vsce`

To build the extension, clone the repository and run the `compile` and `buildDistributable` npm scripts or run the following command in the root directory of the repository:

```
tsc -p ./
vsce package
```
