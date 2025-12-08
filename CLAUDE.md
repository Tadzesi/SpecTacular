# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Current Version: 1.1.2**

## Overview

SpecTacular is a specification-driven development toolkit consisting of:
- **spectacular-cli**: Command-line tool for scaffolding and managing SpecTacular projects
- **spectacular-dashboard**: Electron desktop application for previewing and monitoring markdown specification files with real-time filesystem watching

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Desktop**: Electron 28
- **Styling**: Tailwind CSS with dark/light theme support
- **File Watching**: chokidar for cross-platform filesystem monitoring
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

### Dashboard (spectacular-dashboard/)
```bash
cd spectacular-dashboard
npm install
npm run dev      # Development mode with hot reload
npm run build    # Production build (creates release/win-unpacked/)
npm run test     # Run tests with vitest
npm run lint     # Lint TypeScript files
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

### Dashboard - Electron Main Process (`spectacular-dashboard/electron/`)
- `main.ts` - Application entry, native menu bar, IPC handlers, window management
- `preload.ts` - Context bridge API exposure to renderer
- `fileWatcher.ts` - chokidar-based filesystem monitoring

Key features:
- Native menu bar with File > Select Folder (Ctrl+O)
- Parses `--path` argument for initial folder to monitor
- Sends `folder-selected` IPC event when folder changes

### Dashboard - React Renderer (`spectacular-dashboard/src/`)
- **Components**: File tree navigation, markdown preview, theme toggle, path display
- **Hooks**: `useFileTree`, `useFileWatcher`, `useNavigationHistory`, `useTheme`
- **Contexts**: Theme provider with localStorage persistence

### IPC Communication
Renderer communicates with main process via `window.electronAPI` exposed through preload script. Key events:
- `get-config` - Returns current root path and watch status
- `get-file-tree` - Returns file tree for specified path
- `folder-selected` - Sent from native menu when folder is selected
- `file-change` - Sent when monitored files change

## Project Structure

```
spectacular-cli/              # .NET CLI tool
├── Spectacular.Cli/         # Main CLI project
│   ├── Commands/            # CLI commands (init, dashboard, update)
│   ├── Services/            # Business logic
│   └── Resources/templates/ # Embedded scaffolding templates
└── Spectacular.Cli.Tests/   # Unit tests

spectacular-dashboard/        # Electron + React application
├── electron/                # Main process code
├── src/                     # React renderer code
│   ├── components/          # UI components
│   ├── hooks/               # Custom React hooks
│   ├── contexts/            # React context providers
│   └── types/               # TypeScript interfaces
└── release/                 # Built artifacts
    └── win-unpacked/        # Unpacked Windows build

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