# Extension Features

Detailed documentation of all SpecTacular VS Code Extension features.

## Dashboard Features

### Markdown Preview

Rich markdown rendering with enhanced features:

**Standard Markdown:**
- Headings (H1-H6)
- Bold, italic, strikethrough
- Ordered and unordered lists
- Blockquotes
- Horizontal rules
- Inline code and code blocks
- Links and images
- Tables

**Enhanced Features:**
- ✅ Status tags rendered as colored badges
- ✅ Wikilinks clickable navigation
- ✅ YAML frontmatter display
- ✅ Mermaid diagrams (if added to markdown)
- ✅ Task list checkboxes
- ✅ Syntax highlighting for 100+ languages

### WYSIWYG Editor

Visual editing powered by TipTap:

**Formatting Toolbar:**
- Bold (`Ctrl+B`)
- Italic (`Ctrl+I`)
- Strikethrough
- Inline code
- Headings (H1-H6)
- Bullet list
- Ordered list
- Task list
- Blockquote
- Horizontal rule
- Link
- Code block

**Advanced Features:**
- Table editor with resize
- Nested task lists
- Undo/Redo (`Ctrl+Z` / `Ctrl+Shift+Z`)
- Frontmatter preservation
- Status tag preservation
- Wikilink preservation

## Tree View Features

### File Navigation

**Specs Tree View:**
- Hierarchical folder structure
- Markdown files only (`.md`, `.markdown`)
- Expandable/collapsible folders
- Click to open in dashboard
- Right-click context menu

**Filtering:**
- Shows only markdown files
- Hides: `node_modules`, `dist`, `build`, `out`
- Shows: `.spectacular` folder
- Custom filters via settings

**Indicators:**
- Modified files: `●` indicator
- Status badges: Visual file status
- Folder badges: Status aggregation

### File Operations

**Supported:**
- Open file in dashboard
- Reveal in VS Code explorer
- Reveal in tree view
- Copy file path

**Context Menu:**
- Open in Dashboard
- Open in Editor
- Reveal in Explorer
- Copy Path

## Auto Task Status

### Automatic Status Updates

**Trigger:** Saving a task file with `type: task` in frontmatter

**Detection:**
1. File path contains `/tasks/`
2. File extension is `.md`
3. Frontmatter has `type: task`
4. Acceptance criteria section exists

**Logic:**
```
IF all checkboxes checked:
  → Set status: done
ELSE IF was previously done:
  → Set status: pending
ELSE:
  → No change
```

**Updates:**
- Task file frontmatter
- Parent `tasks.md` table
- Status bar notification

### Example

**Before Save:**
```markdown
---
type: task
status: pending
---

# Implement Login

## Acceptance Criteria
- [x] Create login form
- [x] Add validation
- [x] Connect to API
```

**After Save:**
```markdown
---
type: task
status: done  # ← Automatically updated!
---

# Implement Login

## Acceptance Criteria
- [x] Create login form
- [x] Add validation
- [x] Connect to API
```

## File Watching

### Real-Time Updates

**Monitors:**
- All markdown files in workspace
- External file changes (git pull, etc.)
- File creation/deletion
- File modifications

**Debouncing:**
- 300ms delay to batch rapid changes
- Prevents excessive updates
- Configurable via settings

**Conflict Detection:**

When file changes externally while you have local edits:

```
┌─────────────────────────────────┐
│ ⚠️  File Changed on Disk        │
│                                 │
│ The file has been modified      │
│ externally. You have unsaved    │
│ changes.                        │
│                                 │
│ [Reload]  [Keep Mine]  [Diff]   │
└─────────────────────────────────┘
```

### Watch Configuration

```json
{
  "spectacular.fileWatch.enabled": true,
  "spectacular.fileWatch.debounceDelay": 300,
  "spectacular.fileWatch.exclude": [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**"
  ]
}
```

## Navigation Features

### History Navigation

**Back/Forward:**
- Back button: `Alt+Left` or Mouse Button 4
- Forward button: `Alt+Right` or Mouse Button 5
- Breadcrumb trail in header

**History Tracking:**
- Remembers last 50 files
- Persisted across reloads
- Workspace-specific

### Breadcrumb

**Path Display:**
```
📁 specs / 001-auth / authentication-spec.md  📋
```

**Features:**
- Click to copy full path
- Shows file location
- Relative to workspace root

## Theme Integration

### Automatic Theme Matching

The dashboard automatically matches VS Code theme:

**Light Themes:**
- Light background
- Dark text
- Blue accents

**Dark Themes:**
- Dark background
- Light text
- Brighter accents

**Custom Themes:**
- Respects VS Code CSS variables
- Inherits color scheme
- Maintains readability

### Theme Settings

```json
{
  "spectacular.dashboard.theme": "auto",  // auto | light | dark
  "workbench.colorTheme": "Dark+ (default dark)"
}
```

## Version Check

### Update Notifications

**Automatic Checks:**
- On extension activation
- Every 24 hours (configurable)
- Manual: Command Palette → Check for Updates

**Notification:**
```
┌─────────────────────────────────┐
│ ℹ️  Update Available            │
│                                 │
│ SpecTacular v1.7.0 is available │
│ You have: v1.6.6                │
│                                 │
│ [View Release]  [Dismiss]       │
└─────────────────────────────────┘
```

**Version Badge:**

Displays in dashboard header:
```
v1.6.6  ← Current version
v1.7.0 Available ⬆️  ← When update exists
```

## Status Tag Rendering

### Visual Badges

| Markdown | Rendered | Color |
|----------|----------|-------|
| `#status/done` | 🟢 Done | Green |
| `#status/complete` | 🟢 Complete | Green |
| `#status/pending` | ⚪ Pending | Gray |
| `#status/in-progress` | 🔵 In Progress | Blue |
| `#status/blocked` | 🔴 Blocked | Red |
| `#status/skipped` | ⏭️ Skipped | Gray |

### Custom Status Tags

Define custom tags in settings:

```json
{
  "spectacular.statusTags.custom": {
    "review": {
      "label": "In Review",
      "color": "#9f7aea",
      "icon": "eye"
    },
    "approved": {
      "label": "Approved",
      "color": "#48bb78",
      "icon": "check-circle"
    }
  }
}
```

## Wikilink Features

### Syntax

```markdown
[[filename]]              → Link to file in same directory
[[path/to/file]]          → Relative path from current file
[[../other/file]]         → Parent directory navigation
[[/specs/file]]           → Absolute from workspace root
```

### Auto-Completion

When typing `[[`:

```
[[
  ↓
┌─────────────────────────┐
│ 📄 authentication-spec  │
│ 📄 database-setup       │
│ 📄 task-01             │
│ 📁 ../plans/           │
└─────────────────────────┘
```

**Features:**
- File name suggestions
- Folder navigation
- Fuzzy search
- Recently used files

### Click Behavior

**Click:** Opens linked file in dashboard
**Ctrl+Click:** Opens in new editor
**Alt+Click:** Reveals in tree view

## Frontmatter Support

### YAML Parsing

Automatic parsing and display of frontmatter:

```markdown
---
type: spec
status: pending
priority: high
assignee: @username
tags: [authentication, security]
created: 2024-12-22
---
```

**Displayed as:**
```
┌─────────────────────────────────┐
│ Type: spec                      │
│ Status: pending                 │
│ Priority: high                  │
│ Assignee: @username             │
│ Tags: authentication, security  │
│ Created: 2024-12-22             │
└─────────────────────────────────┘
```

### Preservation

**During WYSIWYG Editing:**
1. Frontmatter extracted before editing
2. Stored separately in memory
3. Not part of editor content
4. Prepended on save

**This ensures:**
- ✅ Frontmatter never lost
- ✅ No accidental edits
- ✅ Always valid YAML
- ✅ Preserved across sessions

## Performance Features

### Optimization Strategies

**Lazy Loading:**
- Load file content on demand
- Don't load entire tree upfront
- Load images lazily

**Caching:**
- Cache file content in memory
- Cache rendered markdown
- Cache file tree structure

**Debouncing:**
- Batch file system events
- Delay search queries
- Throttle scroll events

**Memory Management:**
- Dispose unused webview panels
- Clear old history entries
- Release file watchers on close

### Performance Metrics

Typical usage:
- Memory: 20-30 MB
- CPU: <1% idle, 5-10% active editing
- Startup: <500ms
- File open: <100ms
- Save: <50ms

## Next Steps

- [Keyboard Shortcuts](./keyboard-shortcuts) - Complete shortcut reference
- [Configuration](/getting-started/configuration) - Customize settings
- [Workflows](/guide/workflows/specification-pipeline) - AI workflow guide
- [Architecture](/architecture/extension) - Extension architecture
