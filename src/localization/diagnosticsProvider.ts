import * as vscode from 'vscode';
import skyWorkspace from '../workspace/SkyWorkspace';

export default function provideLocalizationDiagnostics(context: vscode.ExtensionContext) {
    const localizationDiagnositcs = vscode.languages.createDiagnosticCollection('sky-localization');
    context.subscriptions.push(localizationDiagnositcs);

    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*.strings');
    fileWatcher.onDidChange((uri) => {
        const document = vscode.workspace.textDocuments.find((doc) => doc.uri.toString() === uri.toString());
        const text = document?.getText() ?? '';
        let diagnostics: vscode.Diagnostic[] = [];

        const lines = text.split('\n');
        const keys = lines
            .filter((line) => line.startsWith('"') && line.includes('='))
            .map((line) => line.split('=')[0].trim().replace(/"/g, ''));

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
        // Duplicate keys
        const duplicateKeys = keys.filter((key, index) => keys.indexOf(key) !== index);
        duplicateKeys.forEach((key) => {
            const index = keys.indexOf(key) + 1;
            const range = new vscode.Range(index, 0, index, lines[index].length);
            const diagnostic = new vscode.Diagnostic(range, 'Duplicate key', vscode.DiagnosticSeverity.Warning);
            diagnostic.code = 'sky-localization-duplicate-key';
            diagnostic.tags = [vscode.DiagnosticTag.Unnecessary];
            diagnostics.push(diagnostic);
        });
        // Localization workspace specific rules
        if (skyWorkspace.type === 'localization') {
            // Invalid keys
            const baseKeys = skyWorkspace.database.find((language) => language.name === 'Base')?.strings.map((string) => string.key) ?? [];
            keys.forEach((key, index) => {
                if (!baseKeys.includes(key)) {
                    const range = new vscode.Range(index, 0, index, lines[index].length);
                    const diagnostic = new vscode.Diagnostic(range, 'Invalid key. Key is not in the base language yet.', vscode.DiagnosticSeverity.Warning);
                    diagnostic.code = 'sky-localization-invalid-key';
                    diagnostics.push(diagnostic);
                }
            });
            // Missing translations
            const missingKeys = skyWorkspace.getCommonKeys().filter((key) => !keys.includes(key));
            missingKeys.forEach((key) => {
                const index = lines.length - 1;
                const range = new vscode.Range(index, 0, index, lines[index].length);
                const diagnostic = new vscode.Diagnostic(range, `Missing translation for key "${key}"`, vscode.DiagnosticSeverity.Warning);
                diagnostic.code = 'sky-localization-missing-translation';
                diagnostics.push(diagnostic);
            });
        }

        diagnostics = diagnostics.map((diagnostic) => {
            diagnostic.source = 'sky-localization';
            return diagnostic;
        });

        localizationDiagnositcs.set(uri, diagnostics);
    });
    context.subscriptions.push(fileWatcher);
}