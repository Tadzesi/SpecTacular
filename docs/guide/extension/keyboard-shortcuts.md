# Keyboard Shortcuts

Complete reference for all keyboard shortcuts in the SpecTacular VS Code Extension.

## Editor Shortcuts

### Formatting

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+B` | **Bold** | WYSIWYG editor |
| `Ctrl+I` | *Italic* | WYSIWYG editor |
| `Ctrl+U` | <u>Underline</u> | WYSIWYG editor |
| `Ctrl+Shift+X` | ~~Strikethrough~~ | WYSIWYG editor |
| `Ctrl+E` | `Inline code` | WYSIWYG editor |

### Headings

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+Alt+1` | Heading 1 | WYSIWYG editor |
| `Ctrl+Alt+2` | Heading 2 | WYSIWYG editor |
| `Ctrl+Alt+3` | Heading 3 | WYSIWYG editor |
| `Ctrl+Alt+4` | Heading 4 | WYSIWYG editor |
| `Ctrl+Alt+5` | Heading 5 | WYSIWYG editor |
| `Ctrl+Alt+6` | Heading 6 | WYSIWYG editor |
| `Ctrl+Alt+0` | Paragraph (remove heading) | WYSIWYG editor |

### Lists

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+Shift+8` | Bullet list | WYSIWYG editor |
| `Ctrl+Shift+7` | Numbered list | WYSIWYG editor |
| `Ctrl+Shift+9` | Task list (checkboxes) | WYSIWYG editor |
| `Tab` | Indent list item | WYSIWYG editor |
| `Shift+Tab` | Outdent list item | WYSIWYG editor |

### Blocks

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+Shift+B` | Blockquote | WYSIWYG editor |
| `Ctrl+Alt+C` | Code block | WYSIWYG editor |
| `Ctrl+Shift+H` | Horizontal rule | WYSIWYG editor |

### Editing

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+Z` | Undo | WYSIWYG editor |
| `Ctrl+Y` | Redo | WYSIWYG editor |
| `Ctrl+Shift+Z` | Redo (alternative) | WYSIWYG editor |
| `Ctrl+A` | Select all | WYSIWYG editor |
| `Ctrl+C` | Copy | WYSIWYG editor |
| `Ctrl+X` | Cut | WYSIWYG editor |
| `Ctrl+V` | Paste | WYSIWYG editor |

## File Operations

### Saving

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+S` | Save current file | Dashboard |
| `Ctrl+Shift+S` | Save all modified files | Dashboard |
| `Ctrl+K S` | Save without formatting | Dashboard |

### Navigation

| Shortcut | Action | Context |
|----------|--------|---------|
| `Alt+Left` | Navigate back | Dashboard |
| `Alt+Right` | Navigate forward | Dashboard |
| `Ctrl+P` | Quick open file | VS Code |
| `Ctrl+Tab` | Switch between open files | VS Code |

### Mouse Shortcuts

| Action | Shortcut | Context |
|--------|----------|---------|
| Navigate back | Mouse Button 4 | Dashboard |
| Navigate forward | Mouse Button 5 | Dashboard |
| Open link | Click | Preview mode |
| Open in new tab | `Ctrl+Click` | Preview mode |

## Dashboard Commands

### Via Command Palette (`Ctrl+Shift+P`)

| Command | Shortcut | Description |
|---------|----------|-------------|
| `Spectacular: Open Dashboard` | - | Open dashboard panel |
| `Spectacular: Open Dashboard to Side` | - | Open beside current editor |
| `Spectacular: Refresh Tree` | `Ctrl+Shift+R`* | Refresh specs tree |
| `Spectacular: Reveal in Tree` | - | Highlight file in tree |
| `Spectacular: Reveal Specs Folder` | - | Open specs in explorer |

*Configurable in VS Code keybindings

## Tree View Shortcuts

| Shortcut | Action | Context |
|----------|--------|---------|
| `Enter` | Open file in dashboard | Tree view |
| `Space` | Toggle folder expand/collapse | Tree view |
| `Arrow Down` | Next item | Tree view |
| `Arrow Up` | Previous item | Tree view |
| `Arrow Right` | Expand folder | Tree view |
| `Arrow Left` | Collapse folder | Tree view |

## Search and Find

| Shortcut | Action | Context |
|----------|--------|---------|
| `Ctrl+F` | Find in current file | Dashboard |
| `Ctrl+H` | Find and replace | WYSIWYG editor |
| `Ctrl+Shift+F` | Search in all files | VS Code |
| `F3` | Find next | Dashboard |
| `Shift+F3` | Find previous | Dashboard |

## Custom Keybindings

### Configure Your Own

Open VS Code keybindings (`Ctrl+K Ctrl+S`) and search for "spectacular":

```json
{
  "key": "ctrl+alt+s",
  "command": "spectacular.openDashboard",
  "when": "!inDebugMode"
},
{
  "key": "ctrl+alt+t",
  "command": "spectacular.refreshTree"
},
{
  "key": "ctrl+alt+r",
  "command": "spectacular.revealInTree",
  "when": "editorFocus"
}
```

### Recommended Custom Shortcuts

**Quick Dashboard Access:**
```json
{
  "key": "ctrl+k ctrl+d",
  "command": "spectacular.openDashboard"
}
```

**Toggle Edit/Preview:**
```json
{
  "key": "ctrl+k ctrl+e",
  "command": "spectacular.toggleEditMode"
}
```

**Save All Specs:**
```json
{
  "key": "ctrl+k ctrl+s",
  "command": "spectacular.saveAll"
}
```

## Editor Mode Shortcuts

### Switching Modes

| Action | How To |
|--------|--------|
| Enter edit mode | Click "Edit" button or `Ctrl+E`* |
| Exit edit mode | Click "Preview" button or `Esc` |
| Toggle mode | Click mode toggle or `Ctrl+Shift+E`* |

*If configured in keybindings

## Table Editing

### In WYSIWYG Editor

| Shortcut | Action |
|----------|--------|
| `Tab` | Move to next cell |
| `Shift+Tab` | Move to previous cell |
| `Enter` | Move to cell below |
| `Ctrl+Shift+D` | Delete row |
| `Ctrl+Shift+R` | Add row below |
| `Ctrl+Shift+C` | Add column right |

## Advanced Shortcuts

### Developer Tools

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+I` | Open DevTools (webview) |
| `Ctrl+R` | Reload webview |
| `F12` | Open DevTools (extension) |

### Extension Debugging

| Shortcut | Action |
|----------|--------|
| `F5` | Start debugging extension |
| `Ctrl+Shift+F5` | Restart debugging |
| `Shift+F5` | Stop debugging |

## Markdown-Specific Shortcuts

### Special Characters

| Shortcut | Inserts | Context |
|----------|---------|---------|
| `Ctrl+K [[` | `[[wikilink]]` | Any |
| `Ctrl+K #` | `#status/` | Any |
| `Ctrl+K >` | Blockquote | Any |
| `Ctrl+K -` | Horizontal rule | Any |

### Frontmatter

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+Y` | Show/hide frontmatter |
| `Ctrl+K Ctrl+F` | Format frontmatter |

## Multi-Cursor Editing

| Shortcut | Action |
|----------|--------|
| `Alt+Click` | Add cursor |
| `Ctrl+Alt+Down` | Add cursor below |
| `Ctrl+Alt+Up` | Add cursor above |
| `Ctrl+D` | Select next occurrence |
| `Ctrl+Shift+L` | Select all occurrences |
| `Esc` | Remove extra cursors |

## Workspace Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K Ctrl+O` | Open folder |
| `Ctrl+K F` | Close folder |
| `Ctrl+,` | Open settings |
| `Ctrl+Shift+P` | Command palette |

## Tips for Efficiency

### Workflow Shortcuts

**Quick Spec Creation:**
1. `Ctrl+Shift+P` → Type "new file"
2. Save in `specs/` directory
3. `Ctrl+Shift+P` → "Open Dashboard"

**Fast Navigation:**
1. `Ctrl+P` → Type file name
2. `Enter` to open
3. Auto-previews in dashboard

**Bulk Editing:**
1. `Ctrl+Shift+F` → Search across files
2. `Ctrl+Shift+H` → Replace across files
3. Review in dashboard

### Custom Workflow

Create a keybinding sequence for common tasks:

```json
{
  "key": "ctrl+k s 1",
  "command": "runCommands",
  "args": {
    "commands": [
      "spectacular.openDashboard",
      "spectacular.refreshTree",
      "workbench.action.files.save"
    ]
  }
}
```

## Cheat Sheet

### Most Used Shortcuts

**Essential:**
- `Ctrl+S` - Save
- `Alt+Left/Right` - Navigate history
- `Ctrl+B/I` - Bold/Italic
- `Ctrl+Z/Y` - Undo/Redo

**Dashboard:**
- `Ctrl+Shift+P` → "spectacular" - All commands
- `Ctrl+P` - Quick open file
- `Ctrl+F` - Find in file

**Editing:**
- `Ctrl+Alt+1-6` - Headings
- `Ctrl+Shift+8/7` - Lists
- `Tab/Shift+Tab` - Indent/Outdent

### Print This Cheat Sheet

```markdown
# SpecTacular Shortcuts Cheat Sheet

**Formatting:**
Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+E (Code)

**Navigation:**
Alt+Left (Back), Alt+Right (Forward)

**Headings:**
Ctrl+Alt+1-6 (H1-H6)

**Lists:**
Ctrl+Shift+8 (Bullets), Ctrl+Shift+7 (Numbers)

**Save:**
Ctrl+S (Save), Ctrl+Shift+S (Save All)

**Commands:**
Ctrl+Shift+P (Command Palette)
```

## Platform Differences

### macOS

Replace `Ctrl` with `Cmd` for most shortcuts:
- `Cmd+B` - Bold
- `Cmd+S` - Save
- `Cmd+Z` - Undo

Replace `Alt` with `Option`:
- `Option+Left` - Navigate back

### Linux

Most shortcuts work as documented (Ctrl-based).

## Next Steps

- [Extension Features](./features) - Detailed feature documentation
- [Configuration](/getting-started/configuration) - Customize shortcuts
- [Workflows](/guide/workflows/specification-pipeline) - AI workflow guide
