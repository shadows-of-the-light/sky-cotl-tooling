import * as vscode from 'vscode';

export default function activateCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('skyTooling.startSkyOnSteam', () => {
            vscode.env.openExternal(vscode.Uri.parse('steam://rungameid/2325290'));
        }),
        vscode.commands.registerCommand('skyTooling.startSkyOnSteamDemo', () => {
            vscode.env.openExternal(vscode.Uri.parse('steam://rungameid/2563970'));
        }),
    );
}