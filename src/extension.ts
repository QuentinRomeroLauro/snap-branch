import * as vscode from 'vscode';
import { GitMonitor } from './gitMonitor';
import { ConfigurationManager } from './configurationManager';
import { StatusBarManager } from './statusBar';

export function activate(context: vscode.ExtensionContext) {
    console.log('Branch Workspace Manager extension is now active');

    const configManager = new ConfigurationManager(context);
    const gitMonitor = new GitMonitor();
    const statusBar = new StatusBarManager(configManager);

    let isAutoSwitchEnabled = true;

    // Initialize status bar with current branch
    const currentBranch = gitMonitor.getCurrentBranch();
    statusBar.updateBranch(currentBranch);

    // Monitor branch changes
    const branchChangeDisposable = gitMonitor.onBranchChange(async (newBranch: string) => {
        const config = configManager.getExtensionConfig();
        
        if (isAutoSwitchEnabled && config.autoRestore) {
            await configManager.restoreConfiguration(newBranch);
        }
        
        statusBar.updateBranch(newBranch);
        
        vscode.window.setStatusBarMessage(
            `Switched to branch: ${newBranch}`,
            2000
        );
    });

    // Register commands
    const saveConfigCommand = vscode.commands.registerCommand(
        'branchWorkspaceManager.saveConfig',
        async () => {
            const currentBranch = gitMonitor.getCurrentBranch();
            if (!currentBranch) {
                vscode.window.showWarningMessage('No Git branch detected');
                return;
            }
            
            await configManager.saveCurrentConfiguration(currentBranch);
            statusBar.updateBranch(currentBranch);
        }
    );

    const restoreConfigCommand = vscode.commands.registerCommand(
        'branchWorkspaceManager.restoreConfig',
        async () => {
            const currentBranch = gitMonitor.getCurrentBranch();
            if (!currentBranch) {
                vscode.window.showWarningMessage('No Git branch detected');
                return;
            }
            
            await configManager.restoreConfiguration(currentBranch);
        }
    );

    const showConfigsCommand = vscode.commands.registerCommand(
        'branchWorkspaceManager.showConfigs',
        async () => {
            const allConfigs = await configManager.getAllBranchConfigurations();
            const configEntries = Object.entries(allConfigs);
            
            if (configEntries.length === 0) {
                vscode.window.showInformationMessage('No branch configurations found');
                return;
            }

            const items = configEntries.map(([branchName, config]) => ({
                label: branchName,
                description: `Saved ${new Date(config.timestamp).toLocaleString()}`,
                detail: `${config.openFiles.length} files, ${Object.keys(config.workspaceSettings).length} settings`,
                branchName
            }));

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select a branch configuration to restore or manage',
                canPickMany: false
            });

            if (selected) {
                const action = await vscode.window.showQuickPick([
                    { label: 'Restore Configuration', action: 'restore' },
                    { label: 'Delete Configuration', action: 'delete' },
                    { label: 'Switch to Branch (if exists)', action: 'switch' }
                ], {
                    placeHolder: `What would you like to do with ${selected.branchName}?`
                });

                if (action?.action === 'restore') {
                    await configManager.restoreConfiguration(selected.branchName);
                } else if (action?.action === 'delete') {
                    const confirmed = await vscode.window.showWarningMessage(
                        `Delete configuration for branch "${selected.branchName}"?`,
                        'Delete',
                        'Cancel'
                    );
                    if (confirmed === 'Delete') {
                        await configManager.deleteBranchConfiguration(selected.branchName);
                        statusBar.updateBranch(gitMonitor.getCurrentBranch());
                    }
                } else if (action?.action === 'switch') {
                    vscode.window.showInformationMessage(
                        `Use Git commands to switch to branch: ${selected.branchName}`
                    );
                }
            }
        }
    );

    const deleteConfigCommand = vscode.commands.registerCommand(
        'branchWorkspaceManager.deleteConfig',
        async () => {
            const currentBranch = gitMonitor.getCurrentBranch();
            if (!currentBranch) {
                vscode.window.showWarningMessage('No Git branch detected');
                return;
            }

            const confirmed = await vscode.window.showWarningMessage(
                `Delete configuration for current branch "${currentBranch}"?`,
                'Delete',
                'Cancel'
            );

            if (confirmed === 'Delete') {
                await configManager.deleteBranchConfiguration(currentBranch);
                statusBar.updateBranch(currentBranch);
            }
        }
    );

    const toggleCommand = vscode.commands.registerCommand(
        'branchWorkspaceManager.toggle',
        async () => {
            isAutoSwitchEnabled = !isAutoSwitchEnabled;
            statusBar.setEnabled(isAutoSwitchEnabled);
            
            const status = isAutoSwitchEnabled ? 'enabled' : 'disabled';
            vscode.window.showInformationMessage(
                `Branch workspace auto-switching ${status}`
            );
        }
    );

    // Register all disposables
    context.subscriptions.push(
        branchChangeDisposable,
        saveConfigCommand,
        restoreConfigCommand,
        showConfigsCommand,
        deleteConfigCommand,
        toggleCommand,
        gitMonitor,
        configManager,
        statusBar
    );

    // Show welcome message on first activation
    const isFirstActivation = context.globalState.get('branchWorkspaceManager.firstActivation', true);
    if (isFirstActivation) {
        context.globalState.update('branchWorkspaceManager.firstActivation', false);
        
        if (gitMonitor.isGitRepository()) {
            vscode.window.showInformationMessage(
                'Branch Workspace Manager is now active! Your workspace configurations will be automatically managed per Git branch.',
                'Show Commands'
            ).then(selection => {
                if (selection === 'Show Commands') {
                    vscode.commands.executeCommand('workbench.action.showCommands')
                        .then(() => {
                            vscode.commands.executeCommand('workbench.action.quickOpen', '>Branch Workspace');
                        });
                }
            });
        } else {
            vscode.window.showInformationMessage(
                'Branch Workspace Manager is active but no Git repository detected in current workspace.'
            );
        }
    }

    return {
        gitMonitor,
        configManager,
        statusBar
    };
}

export function deactivate() {
    console.log('Branch Workspace Manager extension is now deactivated');
}
