# Installation and Testing Guide

## Quick Start

### 1. Test the Extension (Development Mode)

```bash
# Navigate to the extension directory
cd snap-branch

# Install dependencies (if not already done)
npm install

# Compile TypeScript to JavaScript
npm run compile

# Open in VS Code for testing
code .
```

In VS Code:
1. Press `F5` to launch Extension Development Host
2. A new VS Code window will open with the extension loaded
3. Open a Git repository in that window to test the extension

### 2. Install as VSIX Package

```bash
# Install VS Code Extension Manager (if not installed)
npm install -g vsce

# Package the extension
vsce package

# Install the generated .vsix file
code --install-extension snap-branch-1.0.0.vsix
```

## Testing the Extension

### Basic Functionality Test

1. **Open a Git Repository**
   - Create or open a folder with a Git repository
   - The status bar should show your current branch

2. **Setup Initial Configuration**
   - Open some files
   - Adjust workspace settings (theme, font size, etc.)
   - Your configuration will be automatically saved when you switch branches

3. **Switch Branches**
   - Use `git checkout` or VS Code's Git integration to switch branches
   - The extension automatically saves your current configuration and restores the new branch's configuration
   - No manual intervention required!

4. **Manual Commands (Optional)**
   - While configurations are saved automatically, you can still use manual commands via Command Palette (`Ctrl+Shift+P`):
     - `Snap Branch: Save Current Workspace Configuration` (manual save)
     - `Snap Branch: Show All Branch Configurations`
     - `Snap Branch: Restore Workspace Configuration`
     - `Snap Branch: Toggle Auto Branch Configuration`

### Advanced Testing

1. **Multiple Branches**
   - Create several branches
   - Configure different workspace settings for each
   - Test switching between them - configurations save and restore automatically

2. **Settings Verification**
   - Open Settings (`Ctrl+,`)
   - Search for "Snap Branch"
   - Test different configuration options

3. **Error Handling**
   - Test in non-Git directories
   - Test with corrupted configurations
   - Test rapid branch switching

## Extension Structure

```
snap-branch/
├── package.json          # Extension manifest
├── tsconfig.json         # TypeScript configuration
├── README.md             # User documentation
├── INSTALL.md            # This file
├── src/                  # Source code
│   ├── extension.ts      # Main extension entry point
│   ├── gitMonitor.ts     # Git branch monitoring
│   ├── configurationManager.ts  # Config save/restore logic
│   ├── statusBar.ts      # Status bar UI
│   └── types.ts          # TypeScript interfaces
└── dist/                 # Compiled JavaScript
    ├── extension.js      # Main compiled file
    └── ...              # Other compiled files
```

## Development

### Making Changes

1. Edit TypeScript files in `src/`
2. Compile: `npm run compile`
3. Test: Press `F5` in VS Code
4. For continuous development: `npm run watch`

### Debugging

1. Set breakpoints in TypeScript source files
2. Press `F5` to start debugging
3. Check "Output" panel > "Snap Branch" for logs
4. Use VS Code Developer Tools for additional debugging

## Troubleshooting

### Common Issues

1. **"Git extension not found"**
   - Ensure Git extension is enabled in VS Code
   - Restart VS Code

2. **"No Git repository"**
   - Ensure you're in a folder with a `.git` directory
   - Initialize Git: `git init`

3. **Compilation errors**
   - Check TypeScript version: `npm list typescript`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

4. **Extension not loading**
   - Check VS Code version (requires 1.74.0+)
   - Look for errors in Developer Console (`Help > Toggle Developer Tools`)

### Getting Help

1. Check the Output panel for error messages
2. Enable VS Code Developer Tools for debugging
3. Check VS Code's extension logs
4. Create issues with detailed error messages

## Publishing (for maintainers)

```bash
# Login to Visual Studio Marketplace
vsce login <publisher-name>

# Publish extension
vsce publish

# Or publish specific version
vsce publish 1.0.1
```

Remember to update version in `package.json` before publishing.
