import * as vscode from 'vscode';

type WorkspaceType = 'general' | 'localization';

function loadLocalizationKeys(callback: (keys: string[]) => void) {
    const openedFolder = vscode.workspace.workspaceFolders?.[0];
    if (skyWorkspace.getType() !== 'localization' || !openedFolder) {
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

    update(context: vscode.ExtensionContext) {
        const openedFolder = vscode.workspace.workspaceFolders?.[0];
        if (!openedFolder) {
            return;
        }
        vscode.workspace.fs.readDirectory(openedFolder.uri)
            .then((files) => {
                this.type = files.every(([name, type]) => {
                    return type === vscode.FileType.Directory && name.endsWith('.lproj');
                }) ? 'localization' : 'general';

                loadLocalizationKeys(keys => this.localizationKeys = keys );

            });
    }

    getType(): WorkspaceType {
        return this.type;
    }
}

const skyWorkspace = new SkyWorkspace();

export default skyWorkspace;