import * as vscode from 'vscode';
import { ConfigurationManager } from './configurationManager';

export class StatusBarManager {
    private statusBarItem: vscode.StatusBarItem;
    private configManager: ConfigurationManager;
    private currentBranch: string | undefined;
    private isEnabled: boolean = true;

    constructor(configManager: ConfigurationManager) {
        this.configManager = configManager;
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            100
        );
        this.statusBarItem.command = 'branchWorkspaceManager.showConfigs';
        this.updateVisibility();
    }

    public updateBranch(branchName: string | undefined): void {
        this.currentBranch = branchName;
        this.updateStatusBar();
    }

    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
        this.updateStatusBar();
    }

    private async updateStatusBar(): Promise<void> {
        const config = this.configManager.getExtensionConfig();
        
        if (!config.showStatusBar) {
            this.statusBarItem.hide();
            return;
        }

        if (!this.currentBranch) {
            this.statusBarItem.text = "$(git-branch) No Git branch";
            this.statusBarItem.tooltip = "No Git repository found";
            this.statusBarItem.show();
            return;
        }

        // Check if configuration exists for current branch
        const branchConfig = await this.configManager.getAllBranchConfigurations();
        const hasConfig = this.currentBranch in branchConfig;
        
        const icon = this.isEnabled ? "$(git-branch)" : "$(debug-pause)";
        const configIndicator = hasConfig ? "●" : "○";
        
        this.statusBarItem.text = `${icon} ${this.currentBranch} ${configIndicator}`;
        
        let tooltip = `Current branch: ${this.currentBranch}\n`;
        tooltip += hasConfig ? "Configuration saved" : "No configuration saved";
        tooltip += this.isEnabled ? "" : "\nAuto-switching disabled";
        tooltip += "\n\nClick to manage configurations";
        
        this.statusBarItem.tooltip = tooltip;
        this.statusBarItem.show();
    }

    private updateVisibility(): void {
        const config = this.configManager.getExtensionConfig();
        if (config.showStatusBar) {
            this.updateStatusBar();
        } else {
            this.statusBarItem.hide();
        }
    }

    public dispose(): void {
        this.statusBarItem.dispose();
    }
}
