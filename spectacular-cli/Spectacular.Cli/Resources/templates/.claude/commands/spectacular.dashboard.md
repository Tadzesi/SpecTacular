---
description: Open the SpecTacular Dashboard - task monitor and specification viewer
---

## Purpose

This command opens the **SpecTacular Dashboard** VS Code extension for:
- Real-time monitoring of specification files
- Visual task progress tracking
- Markdown preview with status tags and wikilinks

## Instructions

The SpecTacular Dashboard is now a VS Code extension. To open it:

1. **If VS Code is open**: Press `Ctrl+Shift+P` and run:
   ```
   SpecTacular: Open Dashboard
   ```

2. **Or click** the SpecTacular icon in VS Code's Activity Bar (left sidebar)

3. **Or from command palette**: Search for "SpecTacular" commands

## Installing the Extension

If the extension is not installed:

1. Open VS Code Extensions (`Ctrl+Shift+X`)
2. Search for "SpecTacular Dashboard"
3. Click Install

Or install from VSIX:
```bash
code --install-extension spectacular-dashboard-1.4.0.vsix
```

## Dashboard Features

When opened, the dashboard provides:
- **File Tree Navigation**: Browse specs/ folder structure via VS Code's native explorer
- **Live Preview**: Real-time markdown rendering with hot reload
- **Status Tags**: Visual indicators for task status (#status/done, #status/in-progress, etc.)
- **Wikilinks**: Navigate between linked markdown files
- **Theme Support**: Automatically matches VS Code's theme (dark/light)
- **Navigation History**: Back/forward buttons, mouse button 3/4 support

## User Input

```text
$ARGUMENTS
```

## Path Resolution

- The extension auto-detects `specs/` or `.spectacular/` folders in your workspace
- Configure a custom path via VS Code settings: `spectacular.defaultRootFolder`
