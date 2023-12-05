import * as vscode from 'vscode';

let status: vscode.StatusBarItem;

export function activateStatusDisplay(context: vscode.ExtensionContext) {
    status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    status.text = 'Sky Tooling';
    status.tooltip = 'Sky Tooling';
}

export function updateStatus(text?: string, tooltip?: vscode.MarkdownString | string) {
    status.text = text ?? "⛅";
    status.tooltip = tooltip;
    status.show();
}

export function hideStatus() {
    status.hide();
    status.text = '';
    status.tooltip = undefined;
}
