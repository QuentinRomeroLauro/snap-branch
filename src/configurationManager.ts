import * as vscode from 'vscode';
import { BranchConfiguration, ExtensionConfig } from './types';

export class ConfigurationManager {
    private context: vscode.ExtensionContext;
    private outputChannel: vscode.OutputChannel;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.outputChannel = vscode.window.createOutputChannel('Snap Branch');
    }

    public async saveCurrentConfiguration(branchName: string): Promise<void> {
        try {
            const config = await this.getCurrentWorkspaceConfiguration();
            const branchConfig: BranchConfiguration = {
                branchName,
                timestamp: Date.now(),
                openFiles: config.openFiles,
                editorLayout: config.editorLayout,
                workspaceSettings: config.workspaceSettings
            };

            await this.storeBranchConfiguration(branchName, branchConfig);
            this.outputChannel.appendLine(`Saved configuration for branch: ${branchName}`);
            
            vscode.window.showInformationMessage(
                `Workspace configuration saved for branch: ${branchName}`,
                'Show Configs'
            ).then(selection => {
                if (selection === 'Show Configs') {
                    vscode.commands.executeCommand('snapBranch.showConfigs');
                }
            });
        } catch (error) {
            this.outputChannel.appendLine(`Error saving configuration: ${error}`);
            vscode.window.showErrorMessage(`Failed to save configuration: ${error}`);
        }
    }

    public async saveCurrentConfigurationQuietly(branchName: string): Promise<void> {
        try {
            const config = await this.getCurrentWorkspaceConfiguration();
            const branchConfig: BranchConfiguration = {
                branchName,
                timestamp: Date.now(),
                openFiles: config.openFiles,
                editorLayout: config.editorLayout,
                workspaceSettings: config.workspaceSettings
            };

            await this.storeBranchConfiguration(branchName, branchConfig);
            this.outputChannel.appendLine(`Auto-saved configuration for branch: ${branchName}`);
        } catch (error) {
            this.outputChannel.appendLine(`Error auto-saving configuration: ${error}`);
        }
    }

    public async restoreConfiguration(branchName: string): Promise<void> {
        try {
            const branchConfig = await this.getBranchConfiguration(branchName);
            if (!branchConfig) {
                this.outputChannel.appendLine(`No configuration found for branch: ${branchName}`);
                return;
            }

            await this.applyConfiguration(branchConfig);
            this.outputChannel.appendLine(`Restored configuration for branch: ${branchName}`);
            
            vscode.window.showInformationMessage(
                `Workspace configuration restored for branch: ${branchName}`
            );
        } catch (error) {
            this.outputChannel.appendLine(`Error restoring configuration: ${error}`);
            vscode.window.showErrorMessage(`Failed to restore configuration: ${error}`);
        }
    }

    private async getCurrentWorkspaceConfiguration(): Promise<{
        openFiles: string[];
        editorLayout: any;
        workspaceSettings: { [key: string]: any };
    }> {
        const extensionConfig = this.getExtensionConfig();
        
        // Get open files
        const openFiles: string[] = [];
        if (extensionConfig.includeOpenFiles) {
            vscode.workspace.textDocuments.forEach(doc => {
                if (!doc.isUntitled && doc.uri.scheme === 'file') {
                    openFiles.push(doc.uri.fsPath);
                }
            });
        }

        // Get editor layout (simplified)
        const editorLayout = extensionConfig.includeEditorLayout ? {
            activeEditor: vscode.window.activeTextEditor?.document.uri.fsPath,
            visibleEditors: vscode.window.visibleTextEditors.map(editor => editor.document.uri.fsPath)
        } : undefined;

        // Get workspace settings only if explicitly enabled (non-intrusive by default)
        const workspaceSettings: { [key: string]: any } = {};
        if (extensionConfig.includeWorkspaceSettings) {
            const config = vscode.workspace.getConfiguration();
            
            // Store some common settings that users might want to vary by branch
            const settingsToSave = [
                'editor.fontSize',
                'editor.wordWrap',
                'editor.minimap.enabled',
                'workbench.colorTheme',
                'files.exclude',
                'search.exclude',
                'editor.rulers',
                'problems.decorations.enabled'
            ];

            settingsToSave.forEach(setting => {
                const value = config.get(setting);
                if (value !== undefined) {
                    workspaceSettings[setting] = value;
                }
            });
        }

        return {
            openFiles,
            editorLayout,
            workspaceSettings
        };
    }

    private async applyConfiguration(branchConfig: BranchConfiguration): Promise<void> {
        const extensionConfig = this.getExtensionConfig();

        // Only restore workspace settings if explicitly enabled (non-intrusive by default)
        if (extensionConfig.includeWorkspaceSettings && branchConfig.workspaceSettings) {
            const config = vscode.workspace.getConfiguration();
            for (const [key, value] of Object.entries(branchConfig.workspaceSettings)) {
                try {
                    await config.update(key, value, vscode.ConfigurationTarget.Workspace);
                } catch (error) {
                    this.outputChannel.appendLine(`Failed to update setting ${key}: ${error}`);
                }
            }
        }

        // Restore open files
        if (extensionConfig.includeOpenFiles && branchConfig.openFiles.length > 0) {
            // Close all current editors first
            await vscode.commands.executeCommand('workbench.action.closeAllEditors');
            
            // Open the saved files
            for (const filePath of branchConfig.openFiles) {
                try {
                    const uri = vscode.Uri.file(filePath);
                    await vscode.window.showTextDocument(uri, { preview: false });
                } catch (error) {
                    this.outputChannel.appendLine(`Failed to open file ${filePath}: ${error}`);
                }
            }
        }

        // Restore editor layout (basic implementation)
        if (extensionConfig.includeEditorLayout && branchConfig.editorLayout?.activeEditor) {
            try {
                const uri = vscode.Uri.file(branchConfig.editorLayout.activeEditor);
                await vscode.window.showTextDocument(uri);
            } catch (error) {
                this.outputChannel.appendLine(`Failed to restore active editor: ${error}`);
            }
        }
    }

    private async storeBranchConfiguration(branchName: string, config: BranchConfiguration): Promise<void> {
        const key = `branchConfig_${branchName}`;
        await this.context.workspaceState.update(key, config);
    }

    private async getBranchConfiguration(branchName: string): Promise<BranchConfiguration | undefined> {
        const key = `branchConfig_${branchName}`;
        return this.context.workspaceState.get<BranchConfiguration>(key);
    }

    public async getAllBranchConfigurations(): Promise<{ [branchName: string]: BranchConfiguration }> {
        const configs: { [branchName: string]: BranchConfiguration } = {};
        const keys = this.context.workspaceState.keys();
        
        for (const key of keys) {
            if (key.startsWith('branchConfig_')) {
                const branchName = key.substring('branchConfig_'.length);
                const config = this.context.workspaceState.get<BranchConfiguration>(key);
                if (config) {
                    configs[branchName] = config;
                }
            }
        }
        
        return configs;
    }

    public async deleteBranchConfiguration(branchName: string): Promise<void> {
        const key = `branchConfig_${branchName}`;
        await this.context.workspaceState.update(key, undefined);
        this.outputChannel.appendLine(`Deleted configuration for branch: ${branchName}`);
        vscode.window.showInformationMessage(`Configuration deleted for branch: ${branchName}`);
    }

    public getExtensionConfig(): ExtensionConfig {
        const config = vscode.workspace.getConfiguration('snapBranch');
        return {
            autoSave: config.get('autoSave', true),
            autoRestore: config.get('autoRestore', true),
            includeOpenFiles: config.get('includeOpenFiles', true),
            includeEditorLayout: config.get('includeEditorLayout', true),
            showStatusBar: config.get('showStatusBar', true),
            includeWorkspaceSettings: config.get('includeWorkspaceSettings', false)
        };
    }

    public dispose(): void {
        this.outputChannel.dispose();
    }
}
