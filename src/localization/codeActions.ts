import * as vscode from 'vscode';

export function startLocalizationCodeActionsProvider(context: vscode.ExtensionContext) {
    const localizationCodeActions = vscode.languages.registerCodeActionsProvider('sky-localization', {
        provideCodeActions(document, range, context, token) {
            const diagnostics = context.diagnostics.filter((diagnostic) => diagnostic.source === 'sky-localization');
            const actions = diagnostics.map((diagnostic) => {
                const action = new vscode.CodeAction('Fix localization error', vscode.CodeActionKind.QuickFix);
                action.diagnostics = [diagnostic];
                action.edit = new vscode.WorkspaceEdit();
                action.edit.replace(document.uri, diagnostic.range, '');
                return action;
            });
            return actions;
        },
    });
    context.subscriptions.push(localizationCodeActions);
}