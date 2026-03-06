# SpecTacular Dashboard - VS Code Extension

A VS Code extension for viewing and monitoring markdown specification files with real-time file watching. Part of the SpecTacular specification-driven development toolkit.

## Features

- **Native VS Code Integration** - Uses VS Code's explorer for file navigation
- **Filtered Specs Tree** - Custom tree view showing only `specs/` or `.spectacular/` folders
- **Auto-Preview** - Opening a markdown file in VS Code automatically shows preview in dashboard
- **Full Editor Panel** - Dashboard opens in the editor area for optimal viewing space
- **Smart Folder Detection** - Automatically detects `specs` folder, falls back to `.spectacular`
- **Auto-Reveal** - Specs folder is revealed in explorer on startup
- **Real-time File Watching** - Monitors file changes and updates automatically
- **File Decorations** - Modified files show visual indicator in explorer
- **Theme Integration** - Automatically matches VS Code's light/dark theme
- **Navigation History** - Back/forward navigation with multiple input methods:
  - Header buttons
  - Mouse back/forward buttons (Mouse Button 3/4)
  - Keyboard shortcuts (Alt+Left, Alt+Right)
- **Recent Files** - Quick access dropdown for recently viewed files
- **Markdown Features**:
  - **Nested List Support** - Properly renders hierarchical nested lists (fixed in v1.6.6)
  - Status tags with visual icons (`#status/done`, `#status/pending`, etc.)
  - Wikilink support (`[[link]]` syntax)
  - Syntax highlighting for code blocks
  - GFM (GitHub Flavored Markdown) support
  - CommonMark-compliant rendering with `marked` library

## Installation

### Option 1: Install from Release (End Users)

1. Download the latest VSIX from [GitHub Releases](https://github.com/Tadzesi/SpecTacular/releases)
2. Install in VS Code:
   - Open VS Code
   - Press `Ctrl+Shift+X` (Extensions view)
   - Click "..." menu → "Install from VSIX..."
   - Select the downloaded `.vsix` file
   - Reload VS Code when prompted

Or via command line:
```bash
code --install-extension spectacular-dashboard-1.6.6.vsix
```

### Option 2: Build from Source

1. Build the extension:
   ```bash
   cd spectacular-vscode
   npm install
   npm run compile
   npm run package
   ```

2. Install the generated VSIX:
   ```bash
   code --install-extension spectacular-dashboard-1.6.6.vsix
   ```

### Option 3: Development Mode (For Contributors)

For active development with hot reload, run as Administrator:

```powershell
cd spectacular-vscode
npm install
npm run compile

# Create symlink to VS Code extensions folder
.\install-dev.ps1
```

This creates a symbolic link from the VS Code extensions folder to your development directory, allowing you to test changes immediately. After running this:

1. Reload VS Code (`Ctrl+Shift+P` → "Developer: Reload Window")
2. Run `npm run watch` for hot reload during development

## Usage

### Quick Start
1. Click the SpecTacular icon in the Activity Bar (left sidebar)
2. Use the **Spec Files** tree to browse and click on markdown files
3. Or simply open any markdown file in `specs/` or `.spectacular/` from VS Code's explorer
4. The dashboard panel automatically shows the preview

### How It Works
- **Spec Files Tree**: Shows only markdown files in `specs/` or `.spectacular/` folders
- **Auto-Preview**: When you open a markdown file from specs folders (via explorer, tree, or any method), the dashboard automatically shows its preview
- **Native Explorer**: Use VS Code's native file explorer for full file operations (rename, delete, create)
- **File Decorations**: Modified files show a dot indicator in both the explorer and tree view

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+S` | Open Dashboard |
| `Alt+Left` | Navigate Back |
| `Alt+Right` | Navigate Forward |

### Mouse Navigation

- **Mouse Button 3** (back button) - Navigate back
- **Mouse Button 4** (forward button) - Navigate forward

## Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `spectacular.autoOpenOnStartup` | `false` | Auto-open dashboard when SpecTacular project detected |
| `spectacular.watchDebounceMs` | `300` | Debounce time for file watcher events |
| `spectacular.defaultRootFolder` | `""` | Default root folder (relative to workspace) |

## Status Tags

The markdown renderer supports visual status tags:

| Tag | Icon | Color |
|-----|------|-------|
| `#status/done` | ✓ | Green |
| `#status/complete` | ✓ | Green |
| `#status/pending` | ○ | Gray |
| `#status/in-progress` | ◐ | Blue |
| `#status/blocked` | ⊘ | Red |
| `#status/skipped` | → | Gray |

## Development

```bash
# Install dependencies
npm install
cd webview && npm install && cd ..

# Build everything
npm run compile

# Watch mode (extension + webview)
npm run watch

# Build extension only
npm run compile:extension

# Build webview only
npm run compile:webview

# Create VSIX package
npm run package
```

## Architecture

```
spectacular-vscode/
├── src/                           # Extension host source
│   ├── extension.ts               # Entry point, commands, file watchers
│   ├── DashboardPanel.ts          # Singleton WebviewPanel manager
│   ├── SpecsTreeProvider.ts       # Custom tree view for specs folders
│   ├── FileDecorationProvider.ts  # File modification indicators in explorer
│   ├── TaskStatusService.ts       # Auto-updates task YAML status on checkbox change
│   ├── VersionCheckService.ts     # Checks GitHub releases for updates on activation
│   └── fileOperations.ts          # File tree building and content reading
├── webview/                       # React webview app (separate npm workspace)
│   └── src/
│       ├── App.tsx                # Root component: file state, navigation, save/watch
│       ├── vscodeApi.ts           # Message passing layer (postMessage to/from extension)
│       ├── components/
│       │   ├── ContentArea.tsx    # Switches between MarkdownRenderer and WysiwygEditor
│       │   ├── MarkdownRenderer.tsx # Preview: react-markdown + status tags + wikilinks
│       │   └── editor/            # WYSIWYG editor (TipTap + marked + custom extensions)
│       ├── hooks/                 # useNavigationHistory, useTheme, useFileTree, etc.
│       ├── contexts/              # ThemeContext
│       └── types/                 # Shared TypeScript types
├── resources/                     # Icons
└── dist/                          # Built extension output
```

### Key Components

- **SpecsTreeProvider**: `TreeDataProvider` showing filtered view of `specs/` or `.spectacular/` folders
- **TaskStatusService**: Watches `tasks/*.md` files; when all acceptance criteria checkboxes are checked, auto-updates YAML frontmatter `status:` to `done`
- **VersionCheckService**: Checks GitHub releases on activation and shows update notification
- **FileDecorationProvider**: Adds visual indicators for unsaved files in the tree view
- **DashboardPanel**: Singleton `WebviewPanel` showing the markdown preview; handles bidirectional message passing with the webview

## License

MIT
