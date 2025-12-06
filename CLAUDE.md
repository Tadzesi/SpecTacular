# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

SpecTacular is a markdown specification viewer - an Electron desktop application for previewing and monitoring markdown specification files with real-time filesystem watching.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Desktop**: Electron 28
- **Styling**: Tailwind CSS with dark/light theme support
- **File Watching**: chokidar for cross-platform filesystem monitoring
- **Markdown**: react-markdown with remark-gfm and syntax highlighting

## Development Commands

```bash
cd spectacular-dashboard
npm install
npm run dev      # Development mode with hot reload
npm run build    # Production build
npm run test     # Run tests with vitest
npm run lint     # Lint TypeScript files
```

## Architecture

### Electron Main Process (`electron/`)
- `main.ts` - Application entry, IPC handlers, window management
- `preload.ts` - Context bridge API exposure to renderer
- `fileWatcher.ts` - chokidar-based filesystem monitoring

### React Renderer (`src/`)
- **Components**: File tree navigation, markdown preview, theme toggle
- **Hooks**: `useFileTree`, `useFileWatcher`, `useNavigationHistory`, `useTheme`
- **Contexts**: Theme provider with localStorage persistence

### IPC Communication
Renderer communicates with main process via `window.electronAPI` exposed through preload script. File operations and watching are handled in main process.

## Project Structure

```
spectacular-dashboard/    # Main Electron + React application
├── electron/            # Main process code
├── src/                 # React renderer code
│   ├── components/      # UI components
│   ├── hooks/           # Custom React hooks
│   ├── contexts/        # React context providers
│   └── types/           # TypeScript interfaces

.spectacular/
├── memory/constitution.md   # Non-negotiable project principles
├── scripts/powershell/      # Automation scripts
└── templates/               # Document templates for specs

specs/<###-feature-name>/    # Per-feature artifacts
├── spec.md                  # Feature specification
├── plan.md                  # Implementation plan
└── tasks.md                 # Task checklist

.claude/tasks/               # Task notes (wikilink graph)
```

## Core Principles (from Constitution)

1. **Task Completion is Non-Negotiable** - Build must pass, tests must pass
2. **Simple Steps Over Complex Workflows** - Use pipeline commands when possible
3. **Validation Before Completion** - Always run `/organizer.5-validate`
4. **Production-Ready Defaults** - No placeholder code in completed work
