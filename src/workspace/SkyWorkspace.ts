import * as vscode from 'vscode';
import { hideStatus, updateStatus } from '../status';

type WorkspaceType = 'general' | 'localization';

function loadLocalizationKeys(callback: (keys: string[]) => void) {
    const openedFolder = vscode.workspace.workspaceFolders?.[0];
    if (skyWorkspace.type !== 'localization' || !openedFolder) {
        return [];
    }

    vscode.workspace.fs.readFile(vscode.Uri.file(openedFolder.uri.fsPath + '/Base.lproj/Localizable.strings'))
        .then((contents) => {
            const lines = contents
                .toString()
                .split('\n')
                .filter((line) => line.startsWith('"') && line.includes('='));
            const keys = lines.map((line) => line.split('=')[0].trim().slice(1, -1));
            callback(keys);
        });
}

export class SkyWorkspace {
    type: WorkspaceType = 'general';
    localizationKeys: string[] = [];

    constructor(context: vscode.ExtensionContext | undefined = undefined) {
        if (context) {
            this.update(context);
        }
    }

    update(context: vscode.ExtensionContext, isSilent: boolean = false) {
        const openedFolder = vscode.workspace.workspaceFolders?.[0];
        if (!openedFolder) {
            return;
        }
        vscode.workspace.fs.readDirectory(openedFolder.uri)
            .then((files) => {
                this.type = files.every(([name, type]) => {
                    return type === vscode.FileType.Directory && name.endsWith('.lproj');
                }) ? 'localization' : 'general';

                if (this.type === 'general') {
                    hideStatus();
                }

                loadLocalizationKeys(keys => {
                    this.localizationKeys = keys;
                    if (!isSilent) {
                        vscode.window.showInformationMessage(`Sky language folder detected and found ${keys.length} strings.`);
                    }
                    const statusContent = new vscode.MarkdownString(`### Localization workspace\n\n\`${keys.length}\` strings found in the base language.\n\n---\n\n✨ key auto-completion active\n\n---\n\n✨ invalid key detection active`);
                    updateStatus(undefined, statusContent);
                });

            });
    }
}

const skyWorkspace = new SkyWorkspace();

export default skyWorkspace;