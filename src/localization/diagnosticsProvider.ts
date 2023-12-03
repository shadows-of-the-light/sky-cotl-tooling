import * as vscode from 'vscode';

export function provideLocalizationDiagnostics(context: vscode.ExtensionContext) {
    const localizationDiagnositcs = vscode.languages.createDiagnosticCollection('sky-localization');
    context.subscriptions.push(localizationDiagnositcs);

    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.strings');
    fileWatcher.onDidChange((uri) => {
        const document = vscode.workspace.textDocuments.find((doc) => doc.uri.toString() === uri.toString());
        const text = document?.getText() ?? '';
        let diagnostics: vscode.Diagnostic[] = [];

        const lines = text.split('\n');
        // Last line must be empty
        if (lines[lines.length - 1] !== '') {
            const range = new vscode.Range(lines.length - 1, 0, lines.length - 1, lines[lines.length - 1].length);
            const diagnostic = new vscode.Diagnostic(range, 'Last line must be empty', vscode.DiagnosticSeverity.Error);
            diagnostic.code = 'sky-localization-last-line-empty';
            diagnostics.push(diagnostic);
        }
        // Rules for all other lines
        for (let i = 1; i < lines.length - 1; i++) {
            const line = lines[i];
            // Lines must be strings
            if (!line.match(`"[\\w\\d_]*" = ".*";`)) {
                const range = new vscode.Range(i, 0, i, line.length);
                const diagnostic = new vscode.Diagnostic(range, 'Only the last line should be empty. Line must be a string, formatted like this: "key_name" = "Value";', vscode.DiagnosticSeverity.Error);
                diagnostic.code = 'sky-localization-line-not-string';
                diagnostics.push(diagnostic);
            }
            // Key can't contain spaces
            if (line.includes('=') && line.split('=')[0].trim().includes(' ')) {
                const range = new vscode.Range(i, 0, i, line.indexOf('=') - 1);
                const diagnostic = new vscode.Diagnostic(range, 'Key can\'t contain spaces', vscode.DiagnosticSeverity.Error);
                diagnostic.code = 'sky-localization-key-with-spaces';
                diagnostics.push(diagnostic);
            }
        }
        // Every opening tag must have a closing tag
        lines.forEach((line, index) => {
            const openingTags = line.match(/<(\w+|a href=\\".+?\\")>/g) ?? [];
            const closingTags = line.match(/<\/\w+>/g) ?? [];
            const indexOfValue = line.indexOf('=') + 2;
            if (openingTags?.length > closingTags?.length) {
                const range = new vscode.Range(index, indexOfValue, index, line.length);
                const diagnostic = new vscode.Diagnostic(range, 'Opening tag without closing tag', vscode.DiagnosticSeverity.Error);
                diagnostics.push(diagnostic);
            }
            else if (openingTags?.length < closingTags?.length) {
                const range = new vscode.Range(index, indexOfValue, index, line.length);
                const diagnostic = new vscode.Diagnostic(range, 'Closing tag without opening tag', vscode.DiagnosticSeverity.Error);
                diagnostics.push(diagnostic);
            }
        });

        diagnostics = diagnostics.map((diagnostic) => {
            diagnostic.source = 'sky-localization';
            return diagnostic;
        });

        localizationDiagnositcs.set(uri, diagnostics);
    });
    context.subscriptions.push(fileWatcher);
}