import * as vscode from 'vscode';
import skyWorkspace from '../workspace/SkyWorkspace';

export default function provideLocalizationCompletionItems(context: vscode.ExtensionContext) {
    vscode.workspace.onDidChangeTextDocument(event => {
        const changes = event.contentChanges[0];
        if (['<', '{', '\n', '\r', '\r\n'].includes(changes.text)) {
            vscode.commands.executeCommand('editor.action.triggerSuggest');
        }
    });
    
    context.subscriptions.push(
        vscode.languages.registerCompletionItemProvider({ language: 'sky-localization' },
            {
                provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
                    const documentText = document.getText();
                    const currentLine = document.lineAt(position.line);

                    const isOpeningTag = currentLine.text.substring(0, position.character).endsWith('<');
                    if (isOpeningTag) {
                        const boldText = new vscode.CompletionItem('Bold text', vscode.CompletionItemKind.Text);
                        boldText.insertText = new vscode.SnippetString('b>$1</b>$0');
                        const warningText = new vscode.CompletionItem('Warning text', vscode.CompletionItemKind.Text);
                        warningText.insertText = new vscode.SnippetString('warning>$1</warning>$0');

                        const iconAscendedCandle = new vscode.CompletionItem('Icon: Ascended candle', vscode.CompletionItemKind.Constant);
                        iconAscendedCandle.insertText = new vscode.SnippetString('prestige/>');
                        const iconCandle = new vscode.CompletionItem('Icon: Candle', vscode.CompletionItemKind.Constant);
                        iconCandle.insertText = new vscode.SnippetString('candle/>');
                        const iconCape = new vscode.CompletionItem('Icon: Cape', vscode.CompletionItemKind.Constant);
                        iconCape.insertText = new vscode.SnippetString('cape/>');
                        const iconHeart = new vscode.CompletionItem('Icon: Heart', vscode.CompletionItemKind.Constant);
                        iconHeart.insertText = new vscode.SnippetString('heart/>');
                        const iconHint = new vscode.CompletionItem('Icon: Hint', vscode.CompletionItemKind.Constant);
                        iconHint.insertText = new vscode.SnippetString('hinticon/>');
                        const iconSeasonCandle = new vscode.CompletionItem('Icon: Season candle', vscode.CompletionItemKind.Constant);
                        iconSeasonCandle.insertText = new vscode.SnippetString('scandle/>');
                        const iconSeasonHeart = new vscode.CompletionItem('Icon: Season heart', vscode.CompletionItemKind.Constant);
                        iconSeasonHeart.insertText = new vscode.SnippetString('sheart/>');
                        const iconSeasonPendant = new vscode.CompletionItem('Icon: Season pendant', vscode.CompletionItemKind.Constant);
                        iconSeasonPendant.insertText = new vscode.SnippetString('spendant/>');
                        const iconWingBuff = new vscode.CompletionItem('Icon: Wing buff', vscode.CompletionItemKind.Constant);
                        iconWingBuff.insertText = new vscode.SnippetString('wingbuff/>');

                        const button = new vscode.CompletionItem('Button', vscode.CompletionItemKind.Reference);
                        button.insertText = new vscode.SnippetString('button type=\\"$1\\"/>$0');

                        return [
                            boldText, warningText, iconAscendedCandle, iconCandle,
                            iconCape, iconHeart, iconHint, iconSeasonCandle,
                            iconSeasonHeart, iconSeasonPendant, button, iconWingBuff,
                        ];
                    }

                    const isStartingVariable = currentLine.text.substring(0, position.character).endsWith('{');
                    if (isStartingVariable) {
                        const inlineVar1 = new vscode.CompletionItem('Inline variable 1', vscode.CompletionItemKind.Variable);
                        inlineVar1.insertText = new vscode.SnippetString('{1}}');
                        const inlineVar2 = new vscode.CompletionItem('Inline variable 2', vscode.CompletionItemKind.Variable);
                        inlineVar2.insertText = new vscode.SnippetString('{2}}');
                        const inlineVar3 = new vscode.CompletionItem('Inline variable 3', vscode.CompletionItemKind.Variable);
                        inlineVar3.insertText = new vscode.SnippetString('{3}}');
                        return [inlineVar1, inlineVar2, inlineVar3];
                    }

                    if (currentLine.text.trim() === '') {
                        const keys = skyWorkspace.localizationKeys.sort();
                        const items = keys.map(key => {
                            const item = new vscode.CompletionItem(key, vscode.CompletionItemKind.Constant);
                            item.insertText = new vscode.SnippetString(`"${key}" = "$0";`);
                            return item;
                        });
                        return items;
                    }

                    const isInButton = currentLine.text.substring(0, position.character).endsWith('button type=\\"');
                    if (isInButton) {
                        const buttonTypes = [
                            'menu_toggle', 'look', 'emote_menu', 'flight_toggle',
                            'activate', 'jump_fly', 'move', 'fly_up', 'fly_down',
                            'currency', 'menu_cancel', 'menu_next', 'menu_prev',
                            'shout', 'note_layout', 'menu_confirm', 'util_menu',
                        ].sort();
                        const inlineVar1 = new vscode.CompletionItem('Inline variable 1', vscode.CompletionItemKind.Variable);
                        inlineVar1.insertText = new vscode.SnippetString('{{1}}');
                        const inlineVar2 = new vscode.CompletionItem('Inline variable 2', vscode.CompletionItemKind.Variable);
                        inlineVar2.insertText = new vscode.SnippetString('{{2}}');
                        const inlineVar3 = new vscode.CompletionItem('Inline variable 3', vscode.CompletionItemKind.Variable);
                        inlineVar3.insertText = new vscode.SnippetString('{{3}}');
                        return [
                            ...buttonTypes.map(type => new vscode.CompletionItem(type, vscode.CompletionItemKind.Constant)),
                            inlineVar1, inlineVar2, inlineVar3,
                        ];
                    }

                    return [];
                }
            }
        )
    );
}