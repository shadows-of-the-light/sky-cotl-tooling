import * as vscode from 'vscode';

// General decorations
const decorationBoldTags = vscode.window.createTextEditorDecorationType({
    fontWeight: 'bold',
});
const decorationStringParams = vscode.window.createTextEditorDecorationType({
    backgroundColor: 'rgba(0, 92, 255, .1)',
});
// Inlay hints
const decorationCandleInlayHints = vscode.window.createTextEditorDecorationType({
    after: {
        contentText: '🕯',
        color: 'rgba(192, 192, 192, .8)',
    }
});
const decorationHeartInlayHints = vscode.window.createTextEditorDecorationType({
    after: {
        contentText: '♥',
        color: 'rgba(255, 0, 0, .5)',
    }
});
const decorationNewLineInlayHints = vscode.window.createTextEditorDecorationType({
    after: {
        contentText: '↵',
        color: 'rgba(128, 128, 128, .8)',
    }
});
// Value alignment
const decorationValueAlignment = vscode.window.createTextEditorDecorationType({
    after: {
        contentText: '.',
        color: 'rgba(128, 128, 128, .2)',
    }
});

function addDecorations(document: vscode.TextDocument, decoration: vscode.TextEditorDecorationType, regex: RegExp) {
    const text = document.getText();
    const ranges: vscode.Range[] = [];
    let match;
    while ((match = regex.exec(text))) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        ranges.push(new vscode.Range(startPos, endPos));
    }
    vscode.window.activeTextEditor?.setDecorations(decoration, ranges);
}

function alighValues(document: vscode.TextDocument) {
    // "key1" =           "value1";
    // "key2_a" =         "value2";
    // "key2_b" =         "value3";
    // "key3_something" = "value4";
    // "key4" =           "value5";
    const lines = document.getText().split('\n');
    const maxKeyLength = Math.max(...lines.map((line) => line.indexOf(' =')));
    const ranges: vscode.Range[] = [];
    lines.forEach((line, index) => {
        const indexOfValue = line.indexOf(' =');
        if (indexOfValue !== -1) {
            const spaceToAdd = maxKeyLength - indexOfValue;
            for (let i = 0; i < spaceToAdd; i++) {
                ranges.push(new vscode.Range(index, indexOfValue, index, indexOfValue + 1));
            }
        }
    });
    vscode.window.activeTextEditor?.setDecorations(decorationValueAlignment, ranges);
}

function updateDecorations(document: vscode.TextDocument) {
    const config = vscode.workspace.getConfiguration('skyTooling');
    // Bold tags
    addDecorations(
        document,
        decorationBoldTags,
        /<b>(.*?)<\/b>/g
    );
    // String params
    addDecorations(
        document,
        decorationStringParams,
        /{{\d+}}/g
    );
    // Inlay hints
    if (config.get('localizationInlayHints')) {
        // Candle inlay hints
        addDecorations(
            document,
            decorationCandleInlayHints,
            /<candle\/>/g
        );
        // Heart inlay hints
        addDecorations(
            document,
            decorationHeartInlayHints,
            /<heart\/>/g
        );
        // New line inlay hints
        addDecorations(
            document,
            decorationNewLineInlayHints,
            /\\n/g
        );
    }
    // Value alignment
    if (config.get('localizationAlignValues')) {
        alighValues(document);
    }
}

export default function provideLocalizationDecorations() {
    const activeEditor = vscode.window.activeTextEditor;

    activeEditor?.document.languageId === 'sky-localization' && updateDecorations(activeEditor.document);

    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor?.document.languageId === 'sky-localization') {
            updateDecorations(editor.document);
        }
    });
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document.languageId === 'sky-localization' && activeEditor?.document === event.document) {
            updateDecorations(event.document);
        }
    });
}