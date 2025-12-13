# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Current Version: 1.6.1**

## Overview

SpecTacular is a specification-driven development toolkit consisting of:
- **spectacular-cli**: .NET 8 CLI tool for scaffolding and managing SpecTacular projects
- **spectacular-vscode**: VS Code extension with React webview for previewing markdown specification files

## Development Commands

### CLI (spectacular-cli/)
```bash
cd spectacular-cli/Spectacular.Cli
dotnet build                    # Build CLI
dotnet test                     # Run tests (from spectacular-cli/)
dotnet publish -c Release -r win-x64 -o ../publish/win-x64  # Publish for Windows

# Install locally after publishing
cd ../installer
.\install.ps1 -Local
```

### VS Code Extension (spectacular-vscode/)
```bash
cd spectacular-vscode
npm install
npm run compile          # Build extension + webview
npm run watch            # Dev mode with hot reload (runs concurrently)
npm run lint             # Lint extension TypeScript
npm run package          # Create .vsix package

# Webview development (spectacular-vscode/webview/)
cd webview
npm run build            # Build webview for production
npm run dev              # Vite dev server
npm run lint             # Lint React code
npm run test             # Run vitest

# Install extension for development (run as Administrator)
.\install-dev.ps1        # Creates symlink to VS Code extensions folder
```

## Architecture

### CLI (spectacular-cli/)
- `Commands/` - CLI command implementations (init, dashboard, update)
- `Services/` - Business logic (ScaffoldService, ConfigService, TemplateService)
- `Resources/templates/` - Embedded template files for scaffolding

Key features:
- Uses System.Text.Json source generators for AOT/trimming compatibility
- Single-file executable with self-contained runtime (`PublishSingleFile`, `SelfContained`)
- Embedded resource templates (`EmbeddedResource`) for project scaffolding

### VS Code Extension (spectacular-vscode/)
Extension host (`src/`):
- `extension.ts` - Entry point, commands, `onDidChangeActiveTextEditor` listener for auto-preview
- `DashboardPanel.ts` - WebviewPanel manager, file operations, message handling
- `SpecsTreeProvider.ts` - TreeDataProvider for filtered specs tree view
- `FileDecorationProvider.ts` - File decoration for modified indicators
- `TaskStatusService.ts` - Parses task files and tracks status changes
- `fileOperations.ts` - File tree building, markdown file filtering

Webview (`webview/src/`):
- `App.tsx` - Main app component with navigation state
- `components/ContentArea.tsx` - Markdown preview with TipTap editor
- `components/MarkdownRenderer.tsx` - Renders markdown with status tags, wikilinks, syntax highlighting
- `components/editor/` - TipTap-based markdown editor components
- `vscodeApi.ts` - VS Code API wrapper for webview-to-extension communication

Key behaviors:
- Auto-preview: When user opens a markdown file in specs/, dashboard updates to show it
- Folder detection: Checks for `specs/` first, then `.spectacular/`
- File watching: Debounced (300ms default, configurable via `spectacular.watchDebounceMs`)

### Webview-Extension Message Protocol
Messages from webview to extension (`command` field):
- `ready` - Webview initialized, requests config
- `readFile` - Request file content by path
- `saveFile` / `saveAllFiles` - Save edited content
- `startWatching` / `stopWatching` - Control file watcher
- `copyToClipboard` - Copy text to clipboard
- `revealInTree` - Reveal file in specs tree view

Messages from extension to webview (`type` field):
- `config` - Initial configuration (rootPath, theme, workspaceFolders)
- `selectFile` - Display a file (triggered by active editor change)
- `fileContent` - File content response
- `fileChange` - File modified on disk
- `themeChange` - VS Code theme changed

## Scaffolded Project Structure
Created by `spectacular init`:
```
.spectacular/
├── memory/constitution.md   # Non-negotiable project principles
├── scripts/powershell/      # Automation scripts (create-new-feature.ps1, setup-plan.ps1)
└── templates/               # Document templates for specs

.claude/commands/            # Claude Code slash commands
└── spectacular.*.md         # Pipeline commands (0-quick through 5-validate)

.cursor/rules/               # Cursor rule files
└── spectacular-*.mdc        # Same pipeline commands for Cursor

specs/<###-feature-name>/    # Per-feature artifacts
├── spec.md                  # Feature specification
├── plan.md                  # Implementation plan
└── tasks.md                 # Task checklist with status tags
```

## Markdown Features

The webview's MarkdownRenderer supports:
- **Status tags**: `#status/done`, `#status/pending`, `#status/in-progress`, `#status/blocked`, `#status/skipped` render as colored icons
- **Wikilinks**: `[[filename]]` syntax creates navigable links between markdown files
- **Task links**: Links matching `task-\d+` pattern show a copy button on hover
- **Syntax highlighting**: Code blocks with language-aware formatting via react-syntax-highlighter

## AI Pipeline Commands

The scaffolded project includes pipeline commands for spec-driven development:

| Command | Purpose |
|---------|---------|
| `0-quick` | Full pipeline: spec → plan → tasks → implement → validate |
| `1-spec` | Create feature branch and specification |
| `2-plan` | Generate technical implementation plan |
| `3-tasks` | Create actionable task list |
| `4-implement` | Execute tasks one by one |
| `5-validate` | Verify build passes and all tasks complete |

Scripts in `.spectacular/scripts/powershell/`:
- `create-new-feature.ps1 -Json` - Creates branch and spec folder
- `setup-plan.ps1 -Json` - Sets up plan.md
- `generate-commands.ps1` - Regenerates commands from `.spectacular/prompts/`

## Publishing

After making changes to either component:
```bash
# CLI: Publish and install locally
cd spectacular-cli/Spectacular.Cli
dotnet publish -c Release -r win-x64 -o ../publish/win-x64
cd ../installer && .\install.ps1 -Local

# Extension: Package and install
cd spectacular-vscode
npm run compile && npm run package
# Then install the .vsix file in VS Code
```
