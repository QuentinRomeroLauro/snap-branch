import * as vscode from 'vscode';

export interface BranchConfiguration {
    branchName: string;
    timestamp: number;
    openFiles: string[];
    editorLayout?: any;
    workspaceSettings: { [key: string]: any };
}

export interface ExtensionConfig {
    autoSave: boolean;
    autoRestore: boolean;
    includeOpenFiles: boolean;
    includeEditorLayout: boolean;
    showStatusBar: boolean;
    includeWorkspaceSettings: boolean;
}

export interface GitRepository {
    state: {
        HEAD?: {
            name?: string;
        };
        onDidChange: vscode.Event<void>;
    };
}

export interface GitAPI {
    repositories: GitRepository[];
    getRepository(uri: vscode.Uri): GitRepository | null;
}
