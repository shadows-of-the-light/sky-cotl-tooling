import * as vscode from 'vscode';

export function startLocalizationCodeActionsProvider(context: vscode.ExtensionContext) {
    const localizationCodeActions = vscode.languages.registerCodeActionsProvider('sky-localization', {
        provideCodeActions(document, range, context, token) {
            const lines = document.getText().split('\n');
            const diagnostics = context.diagnostics.filter((diagnostic) => diagnostic.source === 'sky-localization');
            const actions: (vscode.CodeAction | null)[] = diagnostics.map((diagnostic) => {
                switch (diagnostic.code) {
                    case 'sky-localization-first-line-comment':
                        const action = new vscode.CodeAction('Add comment to first line', vscode.CodeActionKind.QuickFix);
                        action.edit = new vscode.WorkspaceEdit();
                        action.edit.insert(document.uri, new vscode.Position(0, 0), '/* Hey! ^^ */\n');
                        action.diagnostics = [diagnostic];
                        return action;
                    case 'sky-localization-last-line-empty':
                        const action2 = new vscode.CodeAction('Add empty line to last line', vscode.CodeActionKind.QuickFix);
                        action2.edit = new vscode.WorkspaceEdit();
                        action2.edit.insert(document.uri, new vscode.Position(lines.length - 1, lines[lines.length - 1].length), '\n');
                        action2.diagnostics = [diagnostic];
                        return action2;
                    case 'sky-localization-line-not-string':
                        // replace line with this: "key_name" = "Value";
                        const action3 = new vscode.CodeAction('Fix line', vscode.CodeActionKind.QuickFix);
                        action3.edit = new vscode.WorkspaceEdit();
                        action3.edit.replace(document.uri, diagnostic.range, `"key_name" = "Value";`);
                        action3.diagnostics = [diagnostic];
                        return action3;
                }
                return null;
            });
            return actions.filter((action) => action !== null) as vscode.CodeAction[];
        },
    });
    context.subscriptions.push(localizationCodeActions);
}