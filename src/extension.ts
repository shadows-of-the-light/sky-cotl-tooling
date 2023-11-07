import * as vscode from 'vscode';
import { startLocalizationDiagnosticsProvider } from './localization/diagnostics';
import { startLocalizationCodeActionsProvider } from './localization/codeActions';

export function activate(context: vscode.ExtensionContext) {
    console.log('Sky tooling extension is now active!');

    startLocalizationDiagnosticsProvider(context);
    startLocalizationCodeActionsProvider(context);
}

export function deactivate() {}
