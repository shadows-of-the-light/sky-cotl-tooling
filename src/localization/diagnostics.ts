import * as vscode from 'vscode';

export function startLocalizationDiagnosticsProvider(context: vscode.ExtensionContext) {
    const localizationDiagnositcs = vscode.languages.createDiagnosticCollection('sky-localization');
    context.subscriptions.push(localizationDiagnositcs);
    localizationDiagnositcs.set(vscode.window.activeTextEditor?.document.uri ?? vscode.Uri.parse(''), [
        new vscode.Diagnostic(new vscode.Range(0, 0, 0, 0), 'Starting...', vscode.DiagnosticSeverity.Information),
    ]);

    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.strings');
    fileWatcher.onDidChange((uri) => {
        const document = vscode.workspace.textDocuments.find((doc) => doc.uri.toString() === uri.toString());
        const text = document?.getText() ?? '';
        let diagnostics: vscode.Diagnostic[] = [];

        const lines = text.split('\n');
        if (!lines[0].match(`/\\*.*\\*/`)) {
            const range = new vscode.Range(0, 0, 0, lines[0].length);
            const diagnostic = new vscode.Diagnostic(range, 'First line must be a comment', vscode.DiagnosticSeverity.Error);
            diagnostics.push(diagnostic);
        }
        if (lines[lines.length - 1] !== '') {
            const range = new vscode.Range(lines.length - 1, 0, lines.length - 1, lines[lines.length - 1].length);
            const diagnostic = new vscode.Diagnostic(range, 'Last line must be empty', vscode.DiagnosticSeverity.Error);
            diagnostics.push(diagnostic);
        }
        for (let i = 1; i < lines.length - 1; i++) {
            const line = lines[i];
            if (!line.match(`"[\\w\\d_]*" = ".*";`)) {
                const range = new vscode.Range(i, 0, i, line.length);
                const diagnostic = new vscode.Diagnostic(range, 'Line must be a string, formatted like this: "key_name" = "Value";', vscode.DiagnosticSeverity.Error);
                diagnostics.push(diagnostic);
            }
        }


        localizationDiagnositcs.set(uri, diagnostics);
    });
    context.subscriptions.push(fileWatcher);
}