# VS Code Extension Overview

The SpecTacular Dashboard is a VS Code extension that provides rich markdown preview, WYSIWYG editing, and specification management.

**Extension ID:** `spectacular-dashboard`
**Current Version:** 1.6.4

## Features

### 📊 Markdown Dashboard

Preview specifications with enhanced rendering:

- **Status tags** - `#status/done`, `#status/pending` render as colored badges
- **Wikilinks** - `[[filename]]` clickable navigation between documents
- **Syntax highlighting** - Code blocks with language detection
- **Frontmatter display** - YAML metadata shown prominently
- **Tables** - Rich table rendering
- **Task lists** - Checkbox support with visual indicators
- **Images** - Embedded image support

### ✏️ WYSIWYG Editor

Rich text editing powered by TipTap:

- **Formatting toolbar** - Bold, italic, headings, lists
- **Tables** - Create and edit tables visually
- **Task lists** - Add checkboxes with a click
- **Links** - Insert markdown links
- **Code blocks** - Syntax highlighted editing
- **Frontmatter preservation** - YAML metadata maintained
- **Custom extensions** - Status tags and wikilinks preserved

### 📁 Specs Tree View

Navigate specification files in the sidebar:

- **Hierarchical view** - Folder structure
- **Markdown files only** - Filters `.md` and `.markdown`
- **Click to open** - Opens file in dashboard
- **Status indicators** - Visual status badges
- **Modified indicators** - Shows unsaved changes (●)

### 🔄 Auto Task Status

Automatic status updates based on acceptance criteria:

- **Checkbox monitoring** - Detects when all criteria are checked
- **Status updates** - Automatically sets `status: done`
- **Table updates** - Updates parent `tasks.md` table
- **Notifications** - Status bar notifications on change

### ⚡ Real-Time Watching

File system monitoring with debouncing:

- **External changes** - Detects git pull, file edits
- **Debounced updates** - 300ms delay to batch changes
- **Conflict detection** - Warns when local changes exist
- **Automatic reload** - Refreshes unmodified files

### 🎨 Theme Integration

Matches VS Code theme automatically:

- **Light mode** - Clean, readable light theme
- **Dark mode** - Eye-friendly dark theme
- **Automatic switching** - Follows VS Code theme changes
- **Custom styling** - Tailwind CSS for consistency

## Installation

See [Installation Guide](/getting-started/#step-2-install-vs-code-extension) for detailed instructions.

**Quick install:**

1. Download VSIX from [GitHub Releases](https://github.com/Tadzesi/SpecTacular/releases/latest)
2. In VS Code: Extensions → `...` → Install from VSIX
3. Reload VS Code

## Getting Started

### Open the Dashboard

1. Click the **SpecTacular icon** in the Activity Bar (left sidebar)
2. Click **"Open Dashboard"** in the welcome view
3. Dashboard opens in editor panel

**Keyboard shortcut:** Configure in VS Code settings

### Navigate Files

**Via Tree View:**
1. Expand folders in Specs Tree
2. Click file to open
3. Status badges show completion state

**Via Wikilinks:**
1. Click `[[filename]]` in preview
2. Jumps to linked document
3. Works with relative paths

**Via Editor:**
1. Open markdown file in VS Code editor
2. Dashboard auto-previews file
3. Shows real-time updates

### Edit Files

**WYSIWYG Mode:**
1. Open file in dashboard
2. Click **Edit** button
3. Use formatting toolbar
4. Save with `Ctrl+S`

**Text Mode:**
1. Edit in VS Code editor
2. Dashboard updates automatically
3. Preserves all markdown syntax

### Manage Tasks

**Create Task:**
```markdown
---
type: task
status: pending
---

# Task Title

## Acceptance Criteria
- [ ] First criterion
- [ ] Second criterion
- [ ] Third criterion
```

**Auto-Status:**
1. Check all criteria: `- [x]`
2. Save file
3. Status automatically updates to `done`
4. Parent `tasks.md` table updates

## Configuration

Configure the extension in VS Code settings (`Ctrl+,`):

### Dashboard Settings

```json
{
  "spectacular.dashboard.theme": "auto",
  "spectacular.dashboard.showTreeView": true,
  "spectacular.dashboard.autoSave": false
}
```

### File Watching

```json
{
  "spectacular.fileWatch.enabled": true,
  "spectacular.fileWatch.debounceDelay": 300,
  "spectacular.fileWatch.exclude": [
    "**/node_modules/**",
    "**/.git/**"
  ]
}
```

### Status Tags

```json
{
  "spectacular.statusTags.enabled": true,
  "spectacular.statusTags.colors": {
    "done": "#68d391",
    "pending": "#4a9eff",
    "blocked": "#f56565",
    "in-progress": "#f6ad55"
  }
}
```

## Commands

Access via Command Palette (`Ctrl+Shift+P`):

| Command | Description |
|---------|-------------|
| `Spectacular: Open Dashboard` | Open dashboard panel |
| `Spectacular: Open Dashboard to Side` | Open beside current editor |
| `Spectacular: Refresh Tree` | Refresh specs tree view |
| `Spectacular: Reveal in Tree` | Highlight current file in tree |
| `Spectacular: Reveal Specs Folder` | Open specs folder in explorer |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save current file |
| `Alt+Left` | Navigate back |
| `Alt+Right` | Navigate forward |
| Mouse Button 4 | Navigate back |
| Mouse Button 5 | Navigate forward |

## Status Tags

Visual indicators for task and feature status:

| Tag | Display | Use For |
|-----|---------|---------|
| `#status/done` | 🟢 Green checkmark | Completed tasks |
| `#status/complete` | 🟢 Green checkmark | Finished features |
| `#status/pending` | ⚪ Gray circle | Not started |
| `#status/in-progress` | 🔵 Blue half-circle | Currently working |
| `#status/blocked` | 🔴 Red X | Blocked items |
| `#status/skipped` | ⏭️ Gray arrow | Intentionally skipped |

## Wikilinks

Link between documents using double brackets:

```markdown
See the [[implementation-plan]] for details.
Related: [[task-01-setup]], [[task-02-implement]]

# Relative paths
Depends on: [[../database-setup/schema]]
```

## Frontmatter Support

YAML frontmatter is automatically preserved:

```markdown
---
type: spec
status: pending
created: 2024-12-22
priority: high
assignee: @username
---

# Specification Title
```

The extension:
- ✅ Displays frontmatter prominently
- ✅ Preserves during WYSIWYG editing
- ✅ Uses for status tracking
- ✅ Validates YAML syntax

## Troubleshooting

### Extension not activating

**Solution:** Check that your workspace contains:
- `.spectacular/` directory, OR
- Files in `specs/` directory

The extension activates when either is detected.

### Dashboard not showing files

**Solution:**
1. Check Specs Tree view for files
2. Verify files have `.md` or `.markdown` extension
3. Refresh tree view (Ctrl+Shift+P → Refresh Tree)

### File watching not working

**Solution:**
1. Check file watching is enabled in settings
2. Verify workspace folder is open (not single file)
3. Check VS Code file watcher limits:
   ```json
   {
     "files.watcherExclude": {
       "**/node_modules/**": false
     }
   }
   ```

### WYSIWYG editor not loading

**Solution:**
1. Check browser console: View → Developer Tools
2. Look for CSP errors or script errors
3. Try opening in read-only mode first
4. Reload VS Code window

### Status not auto-updating

**Solution:**
1. Verify file is in `tasks/` directory
2. Check frontmatter has `type: task`
3. Ensure acceptance criteria section exists
4. Check all criteria use checkbox format: `- [ ]` or `- [x]`

## Advanced Features

### Custom Themes

Create custom CSS for dashboard:

1. Create `.vscode/spectacular.css` in workspace
2. Extension loads custom styles
3. Use VS Code CSS variables

Example:
```css
:root {
  --status-done: #10b981;
  --status-pending: #3b82f6;
}
```

### Integration with Claude Code

The extension works seamlessly with Claude Code:

1. Use `/spec` command to create specifications
2. Edit in WYSIWYG editor
3. Use `/tasks` to break down specs
4. Status updates automatically
5. Navigate via wikilinks

### File Tree Filters

Customize which files appear in tree:

```json
{
  "spectacular.tree.include": [
    "**/*.md",
    "**/*.markdown"
  ],
  "spectacular.tree.exclude": [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**"
  ]
}
```

## Performance Tips

### Large Workspaces

For workspaces with many files:

1. **Exclude unnecessary folders** in file watcher
2. **Disable auto-preview** for faster navigation
3. **Use tree view** instead of file explorer
4. **Close unused tabs** to free memory

### Memory Usage

The extension is lightweight:
- Dashboard: ~10-20MB
- File watching: ~5MB
- Tree view: ~2-5MB

Total: ~20-30MB typical

## Next Steps

- [Extension Features](./features) - Detailed feature documentation
- [Keyboard Shortcuts](./keyboard-shortcuts) - Complete shortcut reference
- [Architecture](/architecture/extension) - Extension architecture details
- [Workflows](/guide/workflows/specification-pipeline) - AI workflow guide
