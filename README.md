# Branch Workspace Manager

A VS Code extension that automatically saves and restores workspace configurations per Git branch. Perfect for developers who work on multiple features and want different settings, open files, and layouts for each branch.

## Features

- 🔄 **Automatic Branch Detection**: Monitors Git branch changes and automatically switches configurations
- 💾 **Workspace Configuration Storage**: Saves open files, editor layout, and workspace settings per branch
- 🎛️ **Configurable Behavior**: Control what gets saved/restored (files, settings, layout)
- 📊 **Status Bar Integration**: Shows current branch and configuration status
- 🚀 **Manual Management**: Commands to manually save, restore, and manage configurations

## How It Works

1. **Automatic Mode**: When you switch Git branches, the extension automatically:
   - Saves your current workspace configuration to the previous branch
   - Restores the workspace configuration for the new branch (if one exists)

2. **Manual Mode**: Use commands to manually save and restore configurations:
   - `Branch Workspace: Save Current Workspace Configuration`
   - `Branch Workspace: Restore Workspace Configuration for Current Branch`

## What Gets Saved

For each branch, the extension can save:

- **Open Files**: List of currently open files in the editor
- **Editor Layout**: Active editor and visible editors
- **Workspace Settings**: Key settings like font size, theme, rulers, exclusions, etc.

## Configuration

Open VS Code settings and search for "Branch Workspace Manager":

| Setting | Default | Description |
|---------|---------|-------------|
| `branchWorkspaceManager.autoSave` | `true` | Automatically save workspace configuration when switching branches |
| `branchWorkspaceManager.autoRestore` | `true` | Automatically restore workspace configuration when switching branches |
| `branchWorkspaceManager.includeOpenFiles` | `true` | Include open files in workspace configuration |
| `branchWorkspaceManager.includeEditorLayout` | `true` | Include editor layout in workspace configuration |
| `branchWorkspaceManager.showStatusBar` | `true` | Show branch configuration status in status bar |

## Commands

Access these commands via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Branch Workspace: Save Current Workspace Configuration** - Manually save current workspace state
- **Branch Workspace: Restore Workspace Configuration for Current Branch** - Manually restore configuration
- **Branch Workspace: Show All Branch Configurations** - View and manage all saved configurations
- **Branch Workspace: Delete Configuration for Current Branch** - Remove configuration for current branch
- **Branch Workspace: Toggle Auto Branch Configuration** - Enable/disable automatic switching

## Status Bar

The status bar shows:
- Current Git branch name
- Configuration indicator: `●` (saved) or `○` (not saved)
- Auto-switching status

Click the status bar item to open the configuration management interface.

## Usage Examples

### Feature Development Workflow

1. **Main Branch**: Keep a clean workspace with only essential files
   ```
   git checkout main
   # Extension automatically restores main branch configuration
   ```

2. **Feature Branch**: Work with specific files and settings for the feature
   ```
   git checkout -b feature/new-auth
   # Configure workspace as needed (open relevant files, adjust settings)
   # Extension automatically saves configuration when you switch away
   ```

3. **Bug Fix**: Quick context switch with appropriate debugging setup
   ```
   git checkout hotfix/bug-123
   # Extension restores previous bug fix workspace or creates new one
   ```

### Settings Per Branch

Different branches might need different configurations:

- **Frontend branches**: Light theme, smaller font, CSS files open
- **Backend branches**: Dark theme, larger font, API documentation open
- **Documentation branches**: Markdown preview, spell check enabled

## Installation

### From Source

1. Clone or download this repository
2. Install dependencies: `npm install`
3. Compile TypeScript: `npm run compile`
4. Press `F5` in VS Code to launch extension development host
5. Or package with `vsce package` and install the `.vsix` file

### From Marketplace

*(Coming soon - will be published to VS Code Marketplace)*

## Requirements

- VS Code 1.74.0 or higher
- Git repository in workspace
- Git extension enabled (built-in)

## Known Limitations

- Only works with Git repositories
- Editor layout restoration is simplified (basic active/visible editor tracking)
- Some VS Code settings may not be fully restored due to API limitations
- Large numbers of open files may impact performance

## Troubleshooting

### Extension Not Working

1. Ensure you're in a Git repository
2. Check that the Git extension is enabled
3. Open Output panel and select "Branch Workspace Manager" for logs

### Configurations Not Saving

1. Check extension settings (auto-save enabled?)
2. Verify workspace has write permissions
3. Try manual save command first

### Branch Changes Not Detected

1. Ensure Git operations are done through VS Code or terminal
2. Check if Git extension is detecting branch changes
3. Try refreshing the workspace

## Contributing

Contributions welcome! Please read the contributing guidelines and submit pull requests.

## License

MIT License - see LICENSE file for details.

## Changelog

### 1.0.0

- Initial release
- Automatic branch detection and configuration switching
- Manual configuration management commands
- Status bar integration
- Configurable behavior settings
