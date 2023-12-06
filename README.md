# Sky Tooling

Sky Tooling is a Visual Studio Code extension that provides support for Sky: Children of the Light localization files. This extension can not be used for any other purpose and is not affiliated with thatgamecompany. Cheating or modding the game is prohibited by the [Terms of Service](https://thatgamecompany.helpshift.com/hc/en/17-sky-children-of-the-light/faq/460-eula-terms-of-service/). This extension is only meant to be used for finding and reporting bugs in the game and it's not providing support for opening or editing binary files. This extension simply finds problems in a text file which can be opened with any other text editor. This repository is not containing any game files. To use this extension, you need to have the game installed on your computer from a legal source.

## Dear thatgamecompany

I'm a curious Sky player who loves all of your games. I'm also a programmer and I love to tinker with things. Yes, I may have peeked into the game files, but I have no intention of cheating or hacking. (Even if I wanted to, I couldn't. I have no experience in decompilation or game modding.) As a thank you for making such a beautiful game and working so hard this year, I want to give you this tool that I made so that you can use it to make the game even better for everyone, no matter what language they speak. This VSCode extension provides features which are not found in Apple's or other localization tools. You broke 2 Guinness records, you brought together more people than ever before, you gave a completely new home for us and yet again you made us feel not alone. So I think you deserve help from the community, because you helped us so much. I hope you will find this tool useful and I hope it will help you to make the game even better. Thank you for everything!

## Features

- Support for Sky: Children of the Light localization files
  - Syntax highlighting and text decoration for formatting tags
  - Text completion (tags, icons, buttons, keys, etc.)
  - Error checking (invalid lines, duplicate keys, XML tags mismatch, etc.)
  - Quick fixes for some of the errors (invalid lines, duplicate keys, etc.)
  - Inlay hints (new line, some icons, etc.)
  - Text alignment for easier language editing
  - Outline view for easier navigation
- Start the game quickly from Visual Studio Code (only works if you have the game installed on Steam)

### Planned features if thatgamecompany approves this extension

- Warnings for missing translations
- Customizable text decoration for formatting tags (for example making the text in `<1>these tags</1>` blue)
- Customizable icons (for example telling the extension that there is a new icon in the game and it should be added to the completion list and which emoji to use for it in the inlay hints)

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

## Installation

After building the extension, you can install it by opening the Extensions view in VSCode (`Ctrl+Shift+X`) and clicking on the `...` button. Then select `Install from VSIX...` and select the generated `.vsix` file.

## Usage

Open any folder which contains Sky localization files. The extension will automatically activate and provide the features listed above. For the best experience and to enable all features, you should open Sky's languages folder: `Sky Children of the Light (Demo)\data\Strings`. If you opened the right folder, you will see a small cloud ⛅ icon in the bottom left corner of the VSCode window. Hovering over it will show you the extra features which are enabled only in this folder.

### Customization

The following features can be customized in the VSCode settings. You can open the settings by pressing `Ctrl+,` or by clicking on the gear icon in the bottom left corner of the VSCode window. These settings will be in the `Extensions/Sky Tooling` section.

| Setting                   | Description                                              |
| ------------------------- | -------------------------------------------------------- |
| `localizationAlignValues` | Align values in localization files into the same column. |
| `localizationInlayHints`  | Show inlay hints for localization files.                 |
