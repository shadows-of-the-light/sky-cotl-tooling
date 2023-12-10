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

class Language {
    name: string;
    strings: { key: string, value: string }[] = [];

    constructor(name: string) {
        this.name = name;
    }
}

export class SkyWorkspace {
    type: WorkspaceType = 'general';
    database: Language[] = [];

    constructor(context: vscode.ExtensionContext | undefined = undefined) {
        if (context) {
            this.update(context);
        }
    }

    updateDatabase(baseCallback: () => void = () => {}) {
        const openedFolder = vscode.workspace.workspaceFolders?.[0];
        if (skyWorkspace.type !== 'localization' || !openedFolder) {
            return [];
        }

        vscode.workspace.fs.readDirectory(openedFolder.uri)
            .then((files) => {
                this.database = files
                    .filter(([name, type]) => type === vscode.FileType.Directory && name.endsWith('.lproj'))
                    .map(([name, type]) => new Language(name.slice(0, -6)));
                
                this.database.forEach((language) => {
                    vscode.workspace.fs.readFile(vscode.Uri.file(openedFolder.uri.fsPath + '/' + language.name + '.lproj/Localizable.strings'))
                        .then((contents) => {
                            const lines = contents
                                .toString()
                                .split('\n')
                                .filter((line) => line.startsWith('"') && line.includes('='));
                            const strings = lines.map((line) => {
                                const key = line.split('=')[0].trim().slice(1, -1);
                                const value = line.split('=')[1].trim().slice(1, -2);
                                return { key, value };
                            });
                            language.strings = strings;
                            if (language.name === 'Base') {
                                baseCallback();
                            }
                        });
                });
            });
    }

    update(context: vscode.ExtensionContext, isSilent: boolean = false) {
        const openedFolder = vscode.workspace.workspaceFolders?.[0];
        if (!openedFolder) {
            return;
        }
        vscode.workspace.fs.readDirectory(openedFolder.uri)
            .then((files) => {
                this.type = files
                    .filter(([name, type]) => type === vscode.FileType.Directory)
                    .every(([name, type]) => {
                        return name.endsWith('.lproj');
                    }) ? 'localization' : 'general';

                if (this.type === 'general') {
                    hideStatus();
                }

                if (this.type === 'localization') {
                    this.updateDatabase(() => {
                        const keys = this.database.find((language) => language.name === 'Base')?.strings.map((string) => string.key) ?? [];
                        if (!isSilent) {
                            vscode.window.showInformationMessage(`Sky language folder detected and found ${keys.length} strings.`);
                        }
                        const statusContent = new vscode.MarkdownString(
                            `### Sky Tooling: localization workspace\n\n${this.database.length} languages.\n\n` +
                            `\`${keys.length}\` strings found in the base language.\n\n---\n\n` +
                            `✨ key auto-completion active\n\n---\n\n` +
                            `✨ invalid key detection active\n\n---\n\n` +
                            `✨ hover to see all translations active`
                        );
                        updateStatus(undefined, statusContent);
                    });
                }

            });
    }
}

const skyWorkspace = new SkyWorkspace();

export default skyWorkspace;