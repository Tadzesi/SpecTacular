# SpecTacular Dashboard

A professional Electron desktop application for previewing and monitoring markdown specification files with real-time filesystem watching.

## Features

- **Native Menu Bar**: File, Edit, View, Window, Help menus with keyboard shortcuts
- **Select Folder**: Choose any folder to monitor via File > Select Folder (Ctrl+O)
- **File Tree Sidebar**: Collapsible folder structure showing markdown files
- **Path Display**: Current monitored folder path shown in header
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

## Command Line Usage

Launch the dashboard with a specific folder to monitor:

```bash
spectacular dashboard
# or
SpecTacular.exe --path "C:\path\to\your\specs"
```

The `--path` argument specifies the folder to monitor. If not provided, defaults to `./specs` in the current working directory.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+O | Select folder to monitor |
| Alt+F4 | Exit application |
| Ctrl+R | Reload |
| Ctrl+Shift+R | Force reload |
| Ctrl+Shift+I | Toggle developer tools |
| Ctrl+0 | Reset zoom |
| Ctrl++ | Zoom in |
| Ctrl+- | Zoom out |
| F11 | Toggle fullscreen |

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

The app monitors the folder specified by the `--path` command line argument, or defaults to `./specs` in the current working directory.

To change the monitored folder at runtime:
1. Use **File > Select Folder...** (Ctrl+O) from the menu bar
2. Browse to the desired folder containing markdown files
3. The file tree and path display will update automatically

## License

MIT
