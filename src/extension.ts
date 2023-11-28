import * as vscode from 'vscode';
import { startLocalizationDiagnosticsProvider } from './localization/diagnostics';
import { startLocalizationCodeActionsProvider } from './localization/codeActions';
import { startLocalizationDecorationsProvider } from './localization/decorations';
import { startLocalizationHoverProvider } from './localization/hoverProvider';
import { startLocalizationCompletionProvider } from './localization/completion';
import { startLocalizationDocumentSymbolProvider } from './localization/documentSymbol';

export function activate(context: vscode.ExtensionContext) {
    console.log('Sky tooling extension is now active!');

    startLocalizationCodeActionsProvider(context);
    startLocalizationDecorationsProvider();
    startLocalizationDiagnosticsProvider(context);
    startLocalizationDocumentSymbolProvider(context);
    startLocalizationHoverProvider(context);
    startLocalizationCompletionProvider(context);
}

export function deactivate() {}
