---
description: Launch the SpecTacular Dashboard - task monitor and specification viewer
---

## Purpose

This command launches the **SpecTacular Dashboard**, an Electron-based application for:
- Real-time monitoring of specification files
- Visual task progress tracking
- Markdown preview with status tags and wikilinks

## Instructions

Launch the SpecTacular Dashboard using the CLI command, pointing to the `specs` folder:

```bash
spectacular dashboard --path "./specs"
```

If the user provides a specific path argument, pass it to the command instead:

```bash
spectacular dashboard --path "$ARGUMENTS"
```

The CLI will automatically find the dashboard from:
1. Project config (`.spectacular/config.json`)
2. Global config (`%LOCALAPPDATA%\spectacular\config.json`)
3. Default install location
4. Development locations

If not found, guide the user to configure it:
```bash
spectacular dashboard --set-exe "C:\path\to\SpecTacular.exe" --global
```

## Dashboard Features

When launched, the dashboard provides:
- **File Tree Navigation**: Browse specs/ folder structure
- **Live Preview**: Real-time markdown rendering with hot reload
- **Status Tags**: Visual indicators for task status (#status/done, #status/in-progress, etc.)
- **Wikilinks**: Navigate between linked markdown files
- **Theme Support**: Dark/light mode toggle

## User Input

```text
$ARGUMENTS
```

## Path Resolution

- By default, use `--path "./specs"` to monitor the specs folder
- If the user provides a specific path argument, use that path instead
- The path is relative to the current working directory
