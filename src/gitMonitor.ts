import * as vscode from 'vscode';
import { GitAPI, GitRepository } from './types';

export class GitMonitor {
    private gitAPI: GitAPI | undefined;
    private currentBranch: string | undefined;
    private disposables: vscode.Disposable[] = [];
    private onBranchChangeEmitter = new vscode.EventEmitter<string>();
    
    public readonly onBranchChange = this.onBranchChangeEmitter.event;

    constructor() {
        this.initializeGitAPI();
    }

    private async initializeGitAPI(): Promise<void> {
        try {
            const gitExtension = vscode.extensions.getExtension('vscode.git');
            if (!gitExtension) {
                vscode.window.showWarningMessage('Git extension not found. Branch monitoring disabled.');
                return;
            }

            if (!gitExtension.isActive) {
                await gitExtension.activate();
            }

            this.gitAPI = gitExtension.exports.getAPI(1);
            
            if (this.gitAPI) {
                this.setupBranchMonitoring();
                this.currentBranch = this.getCurrentBranch();
            }
        } catch (error) {
            console.error('Failed to initialize Git API:', error);
            vscode.window.showErrorMessage('Failed to initialize Git monitoring');
        }
    }

    private setupBranchMonitoring(): void {
        if (!this.gitAPI) return;

        // Monitor repository changes
        const repository = this.getRepository();
        if (repository) {
            const disposable = repository.state.onDidChange(() => {
                const newBranch = this.getCurrentBranch();
                if (newBranch && newBranch !== this.currentBranch) {
                    const oldBranch = this.currentBranch;
                    this.currentBranch = newBranch;
                    this.onBranchChangeEmitter.fire(newBranch);
                    console.log(`Branch changed from ${oldBranch} to ${newBranch}`);
                }
            });
            this.disposables.push(disposable);
        }

        // Monitor for new repositories
        if (this.gitAPI.repositories) {
            // Check periodically for new repositories (when workspace folders change)
            const intervalDisposable = vscode.workspace.onDidChangeWorkspaceFolders(() => {
                setTimeout(() => this.setupBranchMonitoring(), 1000);
            });
            this.disposables.push(intervalDisposable);
        }
    }

    public getCurrentBranch(): string | undefined {
        const repository = this.getRepository();
        if (repository && repository.state.HEAD) {
            return repository.state.HEAD.name;
        }
        return undefined;
    }

    public getRepository(): GitRepository | null {
        if (!this.gitAPI || !this.gitAPI.repositories.length) {
            return null;
        }

        // Get the repository for the current workspace
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (workspaceFolder && this.gitAPI.getRepository) {
            return this.gitAPI.getRepository(workspaceFolder.uri);
        }

        // Fallback to first repository
        return this.gitAPI.repositories[0] || null;
    }

    public isGitRepository(): boolean {
        return this.getRepository() !== null;
    }

    public dispose(): void {
        this.disposables.forEach(d => d.dispose());
        this.onBranchChangeEmitter.dispose();
    }
}
