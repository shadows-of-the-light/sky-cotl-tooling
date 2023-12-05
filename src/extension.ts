import * as vscode from 'vscode';
import provideLocalizationDiagnostics from './localization/diagnosticsProvider';
import provideLocalizationCodeActions from './localization/codeActionsProvider';
import provideLocalizationDecorations from './localization/decorationsProvider';
import provideLocalizationHover from './localization/hoverProvider';
import provideLocalizationCompletionItems from './localization/completionItemsProvider';
import provideLocalizationDocumentSymbols from './localization/documentSymbolsProvider';
import skyWorkspace from './workspace/SkyWorkspace';
import activateCommands from './commands';
import { activateStatusDisplay } from './status';

export function activate(context: vscode.ExtensionContext) {
    console.log('Sky tooling extension is now active!');
    
    activateStatusDisplay(context);

    context.subscriptions.push(
        vscode.workspace.onDidChangeWorkspaceFolders(() => {
            skyWorkspace.update(context);
        }),
        vscode.workspace.onDidSaveTextDocument(e => {
            const isBaseFileChanged = e.fileName.includes('Base.lproj\\Localizable.strings');
            if (isBaseFileChanged) {
                skyWorkspace.update(context, true);
            }
        })
    );
    skyWorkspace.update(context);

    provideLocalizationCodeActions(context);
    provideLocalizationDecorations();
    provideLocalizationDiagnostics(context);
    provideLocalizationDocumentSymbols(context);
    provideLocalizationHover(context);
    provideLocalizationCompletionItems(context);

    activateCommands(context);
}

export function deactivate() { }
