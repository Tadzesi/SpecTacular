# Installation

Get started with SpecTacular in minutes. Install the CLI tool and VS Code extension to enable specification-driven development.

## Prerequisites

- **Windows** (Linux/macOS support coming soon)
- **PowerShell** 5.1 or later
- **.NET 8 Runtime** (auto-installed by CLI installer)
- **VS Code** (for the dashboard extension)
- **Node.js** 18+ (optional, for development)

## Step 1: Install CLI

The SpecTacular CLI tool scaffolds spec-driven projects with templates and AI workflow commands.

### One-Liner Installation (Recommended)

```powershell
irm https://raw.githubusercontent.com/Tadzesi/SpecTacular/master/spectacular-cli/installer/install.ps1 | iex
```

This PowerShell script:
- Downloads the latest release from GitHub
- Installs to `~/.spectacular/bin/`
- Adds to your user PATH (no admin required)
- Broadcasts environment variable changes

### Verify Installation

```bash
spectacular --version
# Output: 1.6.4
```

### Manual Installation

If you prefer manual installation:

1. Download `spectacular.exe` from [GitHub Releases](https://github.com/Tadzesi/SpecTacular/releases/latest)
2. Place in a directory (e.g., `C:\Tools\spectacular\`)
3. Add that directory to your PATH environment variable

### Build from Source

```powershell
git clone https://github.com/Tadzesi/SpecTacular.git
cd SpecTacular/spectacular-cli/Spectacular.Cli
dotnet publish -c Release -r win-x64 -o ../publish/win-x64
cd ../installer
.\install.ps1 -Local
```

## Step 2: Install VS Code Extension

The SpecTacular Dashboard extension provides rich markdown preview and editing.

### Install from Release (Recommended)

1. Download the latest VSIX: [spectacular-dashboard-1.6.4.vsix](https://github.com/Tadzesi/SpecTacular/releases/download/v1.6.4/spectacular-dashboard-1.6.4.vsix)

2. **Install via VS Code:**
   - Open VS Code
   - Press `Ctrl+Shift+X` (Extensions view)
   - Click the `...` menu (top-right) → **Install from VSIX...**
   - Select the downloaded `.vsix` file
   - Reload VS Code when prompted

3. **Or via command line:**
   ```bash
   code --install-extension spectacular-dashboard-1.6.4.vsix
   ```

### Build from Source

```bash
git clone https://github.com/Tadzesi/SpecTacular.git
cd SpecTacular/spectacular-vscode

# Install dependencies
npm install

# Build extension and webview
npm run compile

# Package as VSIX
npm run package

# Install
code --install-extension spectacular-dashboard-1.6.4.vsix
```

## Step 3: Initialize Your Project

Navigate to your project directory and initialize:

```bash
cd your-project
spectacular init --name "MyProject" --tech "Node.js, TypeScript"
```

This creates:
- `.spectacular/` - Templates, scripts, and configuration
- `.claude/commands/` - AI workflow slash commands for Claude Code
- `.cursor/rules/` - AI workflow rules for Cursor
- `specs/` - Directory for feature specifications
- `CLAUDE.md` - Project instructions for AI assistants

## Next Steps

- [Quick Start Guide](./quick-start) - Create your first specification
- [Configuration](./configuration) - Customize SpecTacular for your workflow
- [CLI Commands](/guide/cli/commands) - Learn all available commands
- [Extension Features](/guide/extension/features) - Explore the VS Code dashboard

## Troubleshooting

### CLI not found after installation

**Solution:** Restart your terminal or run:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Extension not activating

**Solution:** Check that you have a `.spectacular/` directory in your workspace. The extension activates when this is detected.

### PowerShell execution policy error

**Solution:** Run PowerShell as administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Uninstall

If you need to uninstall SpecTacular:

```powershell
~/.spectacular/bin/uninstall.ps1
```

Need more help? [Open an issue on GitHub](https://github.com/Tadzesi/SpecTacular/issues)
