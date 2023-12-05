import * as vscode from 'vscode';

export default function provideLocalizationDocumentSymbols(context: vscode.ExtensionContext) {
    const localizationDocumentSymbolProvider = vscode.languages.registerDocumentSymbolProvider('sky-localization', {
        provideDocumentSymbols(document, token) {
            if (!document.fileName.endsWith('.strings')) { return []; }

            const lines = document.getText().split('\n').map((line) => line.trim());
            const keys = lines.filter((line) => line.startsWith('"')).map((line) => line.split('=')[0].trim().replace(/"/g, ''));
            const segmentedKeys = keys.map((key) => key.split('_'));
            // unique list first segment of each key
            const keysFirstSegments = segmentedKeys
                .map((key, index) => ({ key: key[0], lineNumber: index + 1 }))
                .filter((key, index, self) => self.findIndex((k) => k.key === key.key) === index);

            return keysFirstSegments.map((key) => {
                const range = new vscode.Range(new vscode.Position(key.lineNumber, 0), new vscode.Position(key.lineNumber, key.key.length));
                const children = segmentedKeys.filter((segmentedKey) => segmentedKey[0] === key.key);
                const symbol = new vscode.DocumentSymbol(key.key, `(${children.length})`, vscode.SymbolKind.String, range, range);
                symbol.children = children.map((child) => {
                    const childIndex = children.indexOf(child);
                    const childRange = new vscode.Range(new vscode.Position(key.lineNumber + childIndex, 0), new vscode.Position(key.lineNumber + childIndex, child.join('_').length));
                    return new vscode.DocumentSymbol(child[1], '', vscode.SymbolKind.String, childRange, childRange);
                });
                return symbol;
            });
        },
    });
    context.subscriptions.push(localizationDocumentSymbolProvider);
}
