<div align="center">
  <img src="logo.png" alt="Snap Branch Logo" width="200" />
</div>

## 🫰 Snap Branch: automatic workspace switching for Git branches


A VS Code extension that automatically saves and restores workspace configurations per Git branch. As AI allows developers to context switch faster, reducing cognitively load of switching contexts helps developers to work faster.

<div align="center">

[![Install from VS Code Marketplace](https://img.shields.io/badge/Install-VS%20Code%20Marketplace-blue?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=QuentinRomeroLauro.snap-branch)

</div>

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
   - `Snap Branch: Save Current Workspace Configuration`
   - `Snap Branch: Restore Workspace Configuration for Current Branch`

## What Gets Saved

For each branch, the extension can save:

- **Open Files**: List of currently open files in the editor
- **Editor Layout**: Active editor and visible editors
- **Workspace Settings**: Key settings like font size, theme, rulers, exclusions, etc.

## Configuration

Open VS Code settings and search for "Snap Branch":

| Setting | Default | Description |
|---------|---------|-------------|
| `snapBranch.autoSave` | `true` | Automatically save workspace configuration when switching branches |
| `snapBranch.autoRestore` | `true` | Automatically restore workspace configuration when switching branches |
| `snapBranch.includeOpenFiles` | `true` | Include open files in workspace configuration |
| `snapBranch.includeEditorLayout` | `true` | Include editor layout in workspace configuration |
| `snapBranch.showStatusBar` | `true` | Show branch configuration status in status bar |

## Commands

Access these commands via Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

- **Snap Branch: Save Current Workspace Configuration** - Manually save current workspace state
- **Snap Branch: Restore Workspace Configuration for Current Branch** - Manually restore configuration
- **Snap Branch: Show All Branch Configurations** - View and manage all saved configurations
- **Snap Branch: Delete Configuration for Current Branch** - Remove configuration for current branch
- **Snap Branch: Toggle Auto Branch Configuration** - Enable/disable automatic switching

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



## Requirements

- VS Code 1.74.0 or higher
- Git repository in workspace
- Git extension enabled (built-in)

## Contributing

Contributions welcome! Please submit a pull requests.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Changelog

### 1.0.0

- Initial release
- Automatic branch detection and configuration switching
- Manual configuration management commands
- Status bar integration
- Configurable behavior settings
