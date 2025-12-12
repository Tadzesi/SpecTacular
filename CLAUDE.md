# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Current Version: 1.4.1**

## Overview

SpecTacular is a specification-driven development toolkit consisting of:
- **spectacular-cli**: Command-line tool for scaffolding and managing SpecTacular projects
- **spectacular-vscode**: VS Code extension for previewing and monitoring markdown specification files with real-time file watching

> **Note:** The Electron desktop dashboard (`spectacular-dashboard`) was removed in v1.4.0 to reduce distribution size. The VS Code extension now provides all dashboard functionality with better IDE integration.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **VS Code Extension**: VS Code Extension API + React Webview
- **Styling**: Tailwind CSS with dark/light theme support
- **File Watching**: VS Code FileSystemWatcher
- **Markdown**: react-markdown with remark-gfm and syntax highlighting

## Development Commands

### CLI (spectacular-cli/)
```bash
cd spectacular-cli/Spectacular.Cli
dotnet build                    # Build CLI
dotnet test                     # Run tests
dotnet publish -c Release -r win-x64 -o ../publish/win-x64  # Publish for Windows

# Install locally after publishing
cd ../installer
.\install.ps1 -Local
```

### VS Code Extension (spectacular-vscode/)
```bash
cd spectacular-vscode
npm install
npm run compile          # Build extension and webview
npm run watch            # Development mode with hot reload
npm run package          # Create .vsix package for distribution

# Install for development (run as Administrator)
.\install-dev.ps1        # Creates symlink to VS Code extensions folder
```

## Architecture

### CLI (spectacular-cli/)
- `Commands/` - CLI command implementations (init, dashboard, update)
- `Services/` - Business logic (ScaffoldService, ConfigService, TemplateService)
- `Resources/templates/` - Embedded template files for scaffolding

Key features:
- Uses System.Text.Json source generators for AOT/trimming compatibility
- Single-file executable with self-contained runtime
- Embedded resource templates for project scaffolding

### VS Code Extension (spectacular-vscode/)
- `src/extension.ts` - Extension entry point, commands, active editor listener
- `src/DashboardPanel.ts` - WebviewPanel manager, file operations, message handling
- `src/SpecsTreeProvider.ts` - Custom TreeDataProvider for filtered specs tree view
- `src/FileDecorationProvider.ts` - File decoration for modified indicators
- `src/fileOperations.ts` - File tree building, markdown file filtering
- `webview/` - React application (preview-only layout)

Key features:
- **Native VS Code Integration** - Uses VS Code's explorer for primary navigation
- **Filtered Specs Tree** - Custom tree view showing only `specs/` or `.spectacular/` folders
- **Auto-Preview** - `onDidChangeActiveTextEditor` listener automatically previews markdown files
- **File Decorations** - Modified files show dot indicator via FileDecorationProvider
- Auto-reveals specs folder on startup
- Dashboard opens in editor panel (full-width preview)
- Auto-detects `specs` folder first, then `.spectacular` folder
- Real-time file watching via VS Code FileSystemWatcher
- Theme integration with VS Code (light/dark mode)
- Navigation history with back/forward buttons
- Recent files dropdown in header
- Mouse back/forward button support (Mouse Button 3/4)
- Keyboard navigation (Alt+Left/Right)

### VS Code Extension Message Protocol
Webview communicates with extension via `postMessage`. Key messages:
- `ready` - Webview signals it's ready to receive config
- `readFile` - Request file content
- `selectFile` - Extension tells webview to display a file (from editor change)
- `config` - Extension sends initial configuration
- `fileContent` - Extension sends file content
- `fileChange` - Extension notifies of file changes

## Project Structure

```
spectacular-cli/              # .NET CLI tool
├── Spectacular.Cli/         # Main CLI project
│   ├── Commands/            # CLI commands (init, dashboard, update)
│   ├── Services/            # Business logic
│   └── Resources/templates/ # Embedded scaffolding templates
└── Spectacular.Cli.Tests/   # Unit tests

spectacular-vscode/           # VS Code extension
├── src/                     # Extension source code
│   ├── extension.ts         # Entry point, commands
│   ├── DashboardPanel.ts    # Webview panel manager
│   ├── SpecsTreeProvider.ts # Specs tree view provider
│   ├── FileDecorationProvider.ts # File modification indicators
│   └── fileOperations.ts    # File tree operations
├── webview/                 # React webview application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── types/           # TypeScript interfaces
│   └── dist/                # Built webview assets
├── dist/                    # Built extension
├── resources/               # Extension icons
└── package.json             # Extension manifest

# Scaffolded project structure (created by `spectacular init`):
.spectacular/
├── memory/constitution.md   # Non-negotiable project principles
├── scripts/powershell/      # Automation scripts
└── templates/               # Document templates for specs

.claude/
├── commands/                # Claude Code slash commands
│   └── spectacular.*.md     # Pipeline commands (0-quick through 5-validate)
└── tasks/                   # Task notes (wikilink graph)

specs/<###-feature-name>/    # Per-feature artifacts
├── spec.md                  # Feature specification
├── plan.md                  # Implementation plan
└── tasks.md                 # Task checklist
```

## Markdown Features

### Status Tags
The markdown renderer supports visual status tags that display as icons:

| Tag | Icon | Description |
|-----|------|-------------|
| `#status/done` | ✓ (green) | Task completed |
| `#status/complete` | ✓ (green) | Feature/phase complete |
| `#status/pending` | ○ (gray) | Not yet started |
| `#status/in-progress` | ◐ (blue) | Currently in progress |
| `#status/blocked` | ⊘ (red) | Blocked by dependency |
| `#status/skipped` | → (gray) | Intentionally skipped |

Usage in tasks.md tables:
```markdown
| Task | Description | Status |
|------|-------------|--------|
| [[task-01]] | Setup project | #status/done |
| [[task-02]] | Implement feature | #status/in-progress |
```

### Wikilinks
The renderer supports `[[wikilink]]` syntax for navigation between markdown files.

### Task Links
Links matching `task-\d+` pattern show a copy button on hover.

## Core Principles (from Constitution)

1. **Task Completion is Non-Negotiable** - Build must pass, tests must pass
2. **Simple Steps Over Complex Workflows** - Use pipeline commands when possible
3. **Validation Before Completion** - Always run `/organizer.5-validate`
4. **Production-Ready Defaults** - No placeholder code in completed work
- This project also contains custom solution for generating task, plan etc.
- When changes are made, then publish application.
