import * as vscode from 'vscode';

function createQuickFix(
    title: string,
    diagnostics: vscode.Diagnostic[] = [],
): vscode.CodeAction {
    const action = new vscode.CodeAction(title, vscode.CodeActionKind.QuickFix);
    action.diagnostics = diagnostics;
    action.edit = new vscode.WorkspaceEdit();
    return action;
}

export function startLocalizationCodeActionsProvider(context: vscode.ExtensionContext) {
    const localizationCodeActions = vscode.languages.registerCodeActionsProvider('sky-localization', {
        provideCodeActions(document, range, context, token) {
            const lines = document.getText().split('\n');
            const diagnostics = context.diagnostics.filter((diagnostic) => diagnostic.source === 'sky-localization');
            const actions: vscode.CodeAction[] = diagnostics.map((diagnostic) => {
                if (diagnostic.code === 'sky-localization-first-line-comment') {
                    const action = createQuickFix('Add comment to first line', [diagnostic]);
                    action.edit?.insert(document.uri, new vscode.Position(0, 0), '/* Hey! ^^ */\n');
                    return [action];
                }
                if (diagnostic.code === 'sky-localization-last-line-empty') {
                    const action = createQuickFix('Add empty line to last line', [diagnostic]);
                    action.edit?.insert(document.uri, new vscode.Position(lines.length - 1, lines[lines.length - 1].length), '\n');
                    return [action];
                }
                if (diagnostic.code === 'sky-localization-line-not-string') {
                    const actionNewString = createQuickFix('Insert new string', [diagnostic]);
                    actionNewString.edit?.replace(document.uri, diagnostic.range, `"key_name" = "Value";`);
                    const actionRemoveLine = createQuickFix('Remove line', [diagnostic]);
                    actionRemoveLine.edit?.delete(document.uri, diagnostic.range);
                    return [actionNewString];
                }
                if (diagnostic.code === 'sky-localization-key-with-spaces') {
                    const action = createQuickFix('Replace spaces with underscore', [diagnostic]);
                    const oldKey = lines[diagnostic.range.start.line].split('=')[0].trim();
                    const newKey = oldKey.replace(' ', '_');
                    action.edit?.replace(document.uri, diagnostic.range, newKey);
                    return [action];
                }
                return [];
            }).flat();
            return actions.filter((action) => action !== null) as vscode.CodeAction[];
        },
    });
    context.subscriptions.push(localizationCodeActions);
}