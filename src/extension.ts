import * as vscode from 'vscode';
import { startLocalizationDiagnosticsProvider } from './localization/diagnostics';
import { startLocalizationCodeActionsProvider } from './localization/codeActions';
import { startLocalizationDecorationsProvider } from './localization/decorations';
import { startLocalizationHoverProvider } from './localization/hoverProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Sky tooling extension is now active!');

    startLocalizationCodeActionsProvider(context);
    startLocalizationDecorationsProvider();
    startLocalizationDiagnosticsProvider(context);
    startLocalizationHoverProvider(context);
}

export function deactivate() {}
