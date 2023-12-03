import * as vscode from 'vscode';
import { provideLocalizationDiagnostics } from './localization/diagnosticsProvider';
import { provideLocalizationCodeActions } from './localization/codeActionsProvider';
import { provideLocalizationDecorations } from './localization/decorationsProvider';
import { provideLocalizationHover } from './localization/hoverProvider';
import { provideLocalizationCompletionItems } from './localization/completionItemsProvider';
import { provideLocalizationDocumentSymbols } from './localization/documentSymbolsProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Sky tooling extension is now active!');

    provideLocalizationCodeActions(context);
    provideLocalizationDecorations();
    provideLocalizationDiagnostics(context);
    provideLocalizationDocumentSymbols(context);
    provideLocalizationHover(context);
    provideLocalizationCompletionItems(context);
}

export function deactivate() {}
