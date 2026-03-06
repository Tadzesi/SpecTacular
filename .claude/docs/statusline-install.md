# Claude Code Statusline Installation Guide

Enhanced statusline for Claude Code with icons, colors, and comprehensive metrics.

## What You Get

```
■ claude-ideas | ⎇ main | ████████░░ 45.2% | ● 27k/200k | ▶ 89.2k/15.6k | ◆ 3.2s (+1.1s)
```

Components:
- **■ Folder name** - Current working directory (cyan)
- **⎇ Git branch** - Current branch (green)
- **Progress bar** - Visual context usage (color-coded: green/yellow/orange/red)
- **● Context** - Current context tokens / max size
- **▶ Total** - Cumulative session tokens (input/output)
- **◆ API duration** - Global cumulative time with delta (+last call)

## Prerequisites

- Windows 10/11
- PowerShell 5.1 or later (pre-installed on Windows)
- Claude Code CLI installed

## Installation Methods

### Method 1: One-Line Install (Recommended)

Run this command in PowerShell - no need to clone the repository:

```powershell
iwr -useb https://raw.githubusercontent.com/Tadzesi/claude-ideas/main/install-claude-statusline.ps1 | iex
```

Then restart Claude Code.

### Method 2: Download and Run

1. Download the installer:
   ```powershell
   Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Tadzesi/claude-ideas/main/install-claude-statusline.ps1" -OutFile "install-claude-statusline.ps1"
   ```

2. Run the installer:
   ```powershell
   .\install-claude-statusline.ps1
   ```

3. Restart Claude Code

### Method 3: From Cloned Repository

If you already have the repository cloned:

```powershell
cd claude-ideas
.\install-claude-statusline.ps1
```

### Method 4: Manual Installation

1. Create the `.claude` directory in your user profile (if it doesn't exist):
   ```powershell
   New-Item -ItemType Directory -Path "$env:USERPROFILE\.claude" -Force
   ```

2. Download `statusline.ps1` to your `.claude` directory:
   ```powershell
   Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Tadzesi/claude-ideas/main/.claude/scripts/statusline.ps1" -OutFile "$env:USERPROFILE\.claude\statusline.ps1"
   ```

3. Create or edit `settings.json` in your `.claude` directory:
   ```powershell
   notepad "$env:USERPROFILE\.claude\settings.json"
   ```

4. Add this configuration (or merge with existing settings):
   ```json
   {
     "statusLine": {
       "type": "command",
       "command": "powershell.exe -NoProfile -ExecutionPolicy Bypass -File C:\\Users\\YOUR_USERNAME\\.claude\\statusline.ps1"
     }
   }
   ```

   **Important:** Replace `YOUR_USERNAME` with your actual Windows username.

5. Restart Claude Code

## Verification

After restarting Claude Code, you should see the statusline at the bottom of the terminal.

To verify the installation:
```powershell
# Check if statusline.ps1 exists
Test-Path "$env:USERPROFILE\.claude\statusline.ps1"

# Check if settings.json has statusLine configured
Get-Content "$env:USERPROFILE\.claude\settings.json"
```

## Updating

To update to the latest version, simply run the installer again:

```powershell
iwr -useb https://raw.githubusercontent.com/Tadzesi/claude-ideas/main/install-claude-statusline.ps1 | iex
```

Or with Force flag (skips confirmation):

```powershell
.\install-claude-statusline.ps1 -Force
```

## Uninstallation

Download and run the installer with the `-Uninstall` flag:

```powershell
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Tadzesi/claude-ideas/main/install-claude-statusline.ps1" -OutFile "install-claude-statusline.ps1"
.\install-claude-statusline.ps1 -Uninstall
```

Or manually remove the `statusLine` section from `settings.json`.

## Color Coding

The context progress bar changes color based on usage:
- **Green** - 0-50% (plenty of room)
- **Yellow** - 50-75% (moderate usage)
- **Orange** - 75-90% (getting full)
- **Red** - 90%+ (near limit)

## Troubleshooting

### Statusline not appearing
1. Ensure Claude Code is restarted after installation
2. Check that `settings.json` has correct path (double backslashes in JSON)
3. Verify PowerShell execution policy allows script execution

### Context shows "---%" on first load
This is normal before the first API call. After sending your first message, the context percentage will appear.

### Download fails
1. Check your internet connection
2. Try accessing the URL directly in a browser
3. If behind a proxy, configure PowerShell proxy settings

### State file location
The script stores API duration state in:
```
~\.claude\.statusline-state.json
```
This file is automatically created and can be safely deleted to reset cumulative time.

## Files

| File | Location | Purpose |
|------|----------|---------|
| `install-claude-statusline.ps1` | Repository root | Installer script |
| `statusline.ps1` | `.claude\scripts\` | Source statusline script |
| `statusline.ps1` | `~\.claude\` | Installed script (user home) |
| `settings.json` | `~\.claude\` | Claude Code configuration |
| `.statusline-state.json` | `~\.claude\` | API duration state |

## Backup

The installer automatically creates timestamped backup files before overwriting:
- `statusline.ps1.backup-YYYYMMDD-HHMMSS`
- `settings.json.backup-YYYYMMDD-HHMMSS`

To restore:
```powershell
# List backups
Get-ChildItem "$env:USERPROFILE\.claude\*.backup*"

# Restore specific backup
Copy-Item "$env:USERPROFILE\.claude\statusline.ps1.backup-XXXXXXXX-XXXXXX" "$env:USERPROFILE\.claude\statusline.ps1" -Force
```
