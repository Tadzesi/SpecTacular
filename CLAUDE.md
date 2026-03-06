# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SpecTacular is a specification-driven development toolkit with two independent components:

1. **`spectacular-cli/`** — .NET 8 CLI tool (`spectacular`) for scaffolding spec-driven projects
2. **`spectacular-vscode/`** — VS Code extension providing a markdown dashboard/editor webview

These components are versioned and released independently. Current versions: CLI v1.7.0, Extension v1.6.6.

## Build Commands

### VS Code Extension

All commands run from `spectacular-vscode/`:

```bash
npm install                  # Install extension host dependencies
npm run compile              # Build both extension host + webview (production)
npm run watch                # Watch mode: extension host + webview concurrently
npm run lint                 # ESLint on src/
npm run package              # Create .vsix installer (requires vsce)
```

The webview is a separate npm workspace at `spectacular-vscode/webview/`:

```bash
cd spectacular-vscode/webview
npm install                  # Install webview dependencies
npm run build                # tsc + vite build (outputs to webview/dist/)
npm run dev                  # Vite dev server (standalone, without extension)
npm run test                 # Run vitest tests
```

### CLI (.NET 8)

```bash
cd spectacular-cli/Spectacular.Cli
dotnet build                 # Build CLI
dotnet test --project ../Spectacular.Cli.Tests   # Run tests
dotnet publish -c Release -r win-x64 -o ../publish/win-x64  # Publish single-file exe
```

### Install dev VSIX locally

```powershell
spectacular-vscode/install-dev.ps1
```

## Architecture

### VS Code Extension (`spectacular-vscode/`)

The extension has two separate build pipelines:

**Extension host** (`src/` → `dist/extension.js` via esbuild):
- `extension.ts` — activation, command registration, file watchers, wires everything together
- `DashboardPanel.ts` — manages the singleton `WebviewPanel`, handles message passing with the webview
- `SpecsTreeProvider.ts` — `TreeDataProvider` for the "Spec Files" sidebar tree; discovers `specs/` or `.spectacular/` folders
- `TaskStatusService.ts` — singleton that watches task files (`/tasks/*.md`) and auto-updates YAML frontmatter `status:` when all acceptance criteria checkboxes are checked
- `FileDecorationProvider.ts` — adds unsaved-change decorations in the tree view
- `VersionCheckService.ts` — checks GitHub releases for updates on activation

**Webview** (`webview/src/` → `webview/dist/` via Vite):
- React 18 SPA communicating with the extension host via `vscodeApi.ts` message passing
- `App.tsx` — root component; owns state for selected file, recent files, navigation history, modified files, and watch status
- `components/ContentArea.tsx` — switches between `MarkdownRenderer` (preview) and TipTap WYSIWYG editor
- `components/MarkdownRenderer.tsx` — renders markdown with react-markdown + remark-gfm; handles `#status/` tags (rendered as colored icons) and `[[wikilinks]]` (navigable links)
- `hooks/useNavigationHistory.ts` — back/forward navigation stack
- Keyboard shortcuts: `Ctrl+S` (save), `Alt+Left/Right` (navigate), mouse buttons 3/4 (navigate)

**Message protocol** between extension host and webview (via `postMessage`):
- Extension → webview: `config`, `fileContent`, `fileChange`, `selectFile`, `folderSelected`, `fileSaved`, `allFilesSaved`, `watchingStarted`, `watchingStopped`, `error`
- Webview → extension: `ready`, `readFile`, `saveFile`, `saveAllFiles`, `setWatching`, `revealInTree`, `openExternal`

The extension detects a SpecTacular project by looking for `specs/` or `.spectacular/` folders. The tree view root and dashboard root default to whichever exists.

### CLI (`spectacular-cli/`)

- `Spectacular.Cli/` — main project, targets .NET 8, published as a self-contained single-file Windows executable
- Uses `System.CommandLine` (beta4) for command parsing
- Commands: `InitCommand` and `UpdateCommand` in `Commands/`
- Templates embedded as `EmbeddedResource` from `Resources/templates/` — these are copied to the target project on `spectacular init`
- `Spectacular.Cli.Tests/` — xunit test project (currently no test files committed)

## Key Conventions

- **Versioning**: CLI (`Spectacular.Cli.csproj` `<Version>`) and extension (`package.json` `"version"`) are versioned independently. When releasing both together, bump both manually.
- **Specs root discovery**: Both the extension tree view and dashboard auto-detect `specs/` first, then `.spectacular/` as fallback.
- **Status tags**: `#status/done`, `#status/pending`, `#status/in-progress`, `#status/blocked`, `#status/skipped`, `#status/complete` — rendered visually in the dashboard.
- **Wikilinks**: `[[filename]]` syntax links between markdown files; resolved relative to the current file's directory.
- **Task auto-status**: Files inside any `tasks/` subfolder with YAML frontmatter get their `status:` field auto-updated by `TaskStatusService` when all `- [x]` acceptance criteria are checked.
- The webview build output (`webview/dist/`) and extension build output (`dist/`) are committed to the repo so the VSIX can be packaged without a build step.
