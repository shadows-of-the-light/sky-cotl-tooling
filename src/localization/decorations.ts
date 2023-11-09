import * as vscode from 'vscode';

const stringParamDecoration = vscode.window.createTextEditorDecorationType({
    /*borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: 'rgba(0, 128, 255, .5)',*/
    backgroundColor: 'rgba(0, 92, 255, .2)'
});

function updateDecorations(document: vscode.TextDocument) {
    const text = document.getText();
    const stringParamRanges: vscode.Range[] = [];
    const stringParamRegex = /{{\d+}}/g;
    let match;
    while ((match = stringParamRegex.exec(text))) {
        const startPos = document.positionAt(match.index);
        const endPos = document.positionAt(match.index + match[0].length);
        stringParamRanges.push(new vscode.Range(startPos, endPos));
    }
    vscode.window.activeTextEditor?.setDecorations(stringParamDecoration, stringParamRanges);
}

export function startLocalizationDecorationsProvider() {
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