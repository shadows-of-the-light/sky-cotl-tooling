import * as vscode from 'vscode';

function getTagHover(line: string, position: vscode.Position): vscode.Hover | null {
    const tagStart = line.substring(0, position.character).lastIndexOf('<');
    const tagEnd = line.substring(position.character).indexOf('>');
    const tag = line.substring(tagStart, position.character + tagEnd + 1);

    let message = '';
    switch (tag.replace('</', '<')) {
        case '<b>':
            message = 'Bold text';
            break;
        case '<candle/>':
            message = '🕯';
            break;
        case '<heart/>':
            message = '❤';
            break;
        case '<hinticon/>':
            message = '❓';
            break;
        default:
            if (tag.endsWith('/>')) {
                message = 'Icon';
            }
            else if (tag.startsWith('<button')) {
                message = 'Button display';
            }
            break;
    }

    if (message) {
        return new vscode.Hover(message);
    }

    return null;
}

export function provideLocalizationHover(context: vscode.ExtensionContext) {
    const localizationHover = vscode.languages.registerHoverProvider('sky-localization', {
        provideHover(document, position, token) {
            const lineAtPos = document.lineAt(position);

            if (
                lineAtPos.text.substring(position.character, position.character + 2) === '\\n' ||
                lineAtPos.text.substring(position.character - 1, position.character + 1) === '\\n' ||
                lineAtPos.text.substring(position.character - 2, position.character) === '\\n'
            ) {
                return new vscode.Hover('"\\n" New line');
            }

            const tagHover = getTagHover(lineAtPos.text, position);
            if (tagHover) { return tagHover; }

            return null;
        },
    });
    context.subscriptions.push(localizationHover);
}