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

export function provideLocalizationCodeActions(context: vscode.ExtensionContext) {
    const localizationCodeActions = vscode.languages.registerCodeActionsProvider('sky-localization', {
        provideCodeActions(document, range, context, token) {
            const lines = document.getText().split('\n');
            const diagnostics = context.diagnostics.filter((diagnostic) => diagnostic.source === 'sky-localization');
            const actions: vscode.CodeAction[] = diagnostics.map((diagnostic) => {
                if (diagnostic.code === 'sky-localization-last-line-empty') {
                    const actionAddEmptyLineToEnd = createQuickFix('Add empty line to last line', [diagnostic]);
                    actionAddEmptyLineToEnd.edit?.insert(document.uri, new vscode.Position(lines.length - 1, lines[lines.length - 1].length), '\n');
                    const actionRemoveLastLineContent = createQuickFix('Remove content from last line', [diagnostic]);
                    actionRemoveLastLineContent.edit?.delete(document.uri, new vscode.Range(lines.length - 1, 0, lines.length - 1, lines[lines.length - 1].length));
                    return [actionAddEmptyLineToEnd, actionRemoveLastLineContent];
                }
                if (diagnostic.code === 'sky-localization-line-not-string') {
                    const actionRemoveLine = createQuickFix('Remove line', [diagnostic]);
                    actionRemoveLine.edit?.delete(document.uri, new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.start.line + 1, 0));
                    return [actionRemoveLine];
                }
                if (diagnostic.code === 'sky-localization-key-with-spaces') {
                    const actionReplaceSpaceWithUnderscore = createQuickFix('Replace spaces with underscore', [diagnostic]);
                    const oldKey = lines[diagnostic.range.start.line].split('=')[0].trim();
                    const newKey = oldKey.replace(' ', '_');
                    actionReplaceSpaceWithUnderscore.edit?.replace(document.uri, diagnostic.range, newKey);
                    return [actionReplaceSpaceWithUnderscore];
                }
                if (diagnostic.code === 'sky-localization-duplicate-key') {
                    const actionRemoveLine = createQuickFix('Remove line', [diagnostic]);
                    actionRemoveLine.edit?.delete(document.uri, new vscode.Range(diagnostic.range.start.line, 0, diagnostic.range.start.line + 1, 0));
                    return [actionRemoveLine];
                }
                return [];
            }).flat();
            return actions.filter((action) => action !== null) as vscode.CodeAction[];
        },
    });
    context.subscriptions.push(localizationCodeActions);
}