# SpecTacular

A professional Electron desktop application for previewing and monitoring markdown specification files with real-time filesystem watching.

## Features

- **File Tree Sidebar**: Collapsible folder structure showing markdown files
- **Markdown Preview**: Full markdown rendering with syntax highlighting for code blocks
- **Real-time Watching**: Automatic detection of file changes with visual indicators
- **Dark/Light Theme**: Toggle with localStorage persistence
- **Resizable Sidebar**: Drag to resize (200-500px range)
- **Navigation History**: Back/forward navigation with multiple input methods

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Desktop**: Electron 28
- **Bundler**: Vite with vite-plugin-electron
- **Styling**: Tailwind CSS
- **File Watching**: chokidar
- **Markdown**: react-markdown + remark-gfm + react-syntax-highlighter

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts the Vite dev server with hot module replacement and launches the Electron app.

### Production Build

```bash
npm run build
```

Builds the React app and Electron main/preload scripts, then packages with electron-builder.

## Navigation

| Input | Action |
|-------|--------|
| Click file in sidebar | Open file |
| Click folder in sidebar | Expand/collapse |
| Arrow Up/Down | Move focus in file tree |
| Arrow Left/Right | Collapse/expand focused folder |
| Enter | Open focused file or toggle folder |
| Alt + Left/Right | Navigate back/forward |
| Mouse Back/Forward buttons | Navigate back/forward |
| Click markdown link | Navigate to linked file |

## Project Structure

```
spectacular-app/
├── electron/
│   ├── main.ts           # Electron main process, IPC handlers
│   ├── preload.ts        # Context bridge API exposure
│   └── fileWatcher.ts    # chokidar file watcher
├── src/
│   ├── components/
│   │   ├── Header.tsx         # App header with navigation buttons
│   │   ├── Sidebar.tsx        # File tree container
│   │   ├── FileTree.tsx       # Tree component with keyboard navigation
│   │   ├── FileTreeItem.tsx   # Individual tree node
│   │   ├── ContentArea.tsx    # Main content panel
│   │   ├── MarkdownRenderer.tsx # Markdown to HTML renderer
│   │   ├── ResizeHandle.tsx   # Draggable sidebar resize handle
│   │   └── ThemeToggle.tsx    # Dark/light theme switcher
│   ├── hooks/
│   │   ├── useFileTree.ts     # File tree state management
│   │   ├── useFileWatcher.ts  # File watching hook
│   │   ├── useNavigationHistory.ts # Back/forward navigation history
│   │   └── useTheme.ts        # Theme context consumer hook
│   ├── contexts/
│   │   └── ThemeContext.tsx   # Theme provider
│   ├── types/
│   │   └── index.ts           # TypeScript interfaces
│   └── utils/
│       ├── fileIcons.tsx      # File type icons
│       └── pathUtils.ts       # Path manipulation utilities
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── tsconfig.node.json
```

## Configuration

The app monitors the `specs/` directory by default. This can be changed by selecting a different directory through the app or modifying the `DEFAULT_SPECS_PATH` in `electron/main.ts`.

## License

MIT
