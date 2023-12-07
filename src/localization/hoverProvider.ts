import * as vscode from 'vscode';
import skyWorkspace from '../workspace/SkyWorkspace';

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

export default function provideLocalizationHover(context: vscode.ExtensionContext) {
    const localizationHover = vscode.languages.registerHoverProvider('sky-localization', {
        provideHover(document, position, token) {
            const lineAtPos = document.lineAt(position);

            // New line
            if (
                lineAtPos.text.substring(position.character, position.character + 2) === '\\n' ||
                lineAtPos.text.substring(position.character - 1, position.character + 1) === '\\n' ||
                lineAtPos.text.substring(position.character - 2, position.character) === '\\n'
            ) {
                return new vscode.Hover('"\\n" New line');
            }

            // Tag
            const tagHover = getTagHover(lineAtPos.text, position);
            if (tagHover) { return tagHover; }

            // Key usage
            if (skyWorkspace.type === 'localization' && position.character < lineAtPos.text.indexOf('=')) {
                const key = lineAtPos.text.split('=')[0].trim().slice(1, -1);
                const strings = skyWorkspace.database
                    .map((language) => {
                        return {
                            language: language,
                            value: language.strings.find((string) => string.key === key)
                        };
                    })
                    .filter((string) => string);
                if (strings.length > 0) {
                    const message = strings.map((string) => `**${string.language.name}:** ${string.value?.value}`).join('\n\n---\n\n');
                    return new vscode.Hover(message);
                }
            }

            return null;
        },
    });
    context.subscriptions.push(localizationHover);
}