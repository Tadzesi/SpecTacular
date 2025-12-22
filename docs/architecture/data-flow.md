# Data Flow

This page documents the key data flows and workflows in SpecTacular.

## Project Initialization Flow

The complete flow from CLI installation to first spec.

```mermaid
sequenceDiagram
    participant User
    participant CLI
    participant FileSystem
    participant VSCode
    participant Extension
    participant Webview

    User->>CLI: spectacular init --name "MyProject"
    CLI->>CLI: Extract embedded templates
    CLI->>CLI: Apply variable substitution
    CLI->>FileSystem: Create .spectacular/
    CLI->>FileSystem: Create .claude/commands/
    CLI->>FileSystem: Create specs/
    CLI->>FileSystem: Write CLAUDE.md
    CLI->>User: ✓ Initialized successfully

    User->>VSCode: Open project
    VSCode->>Extension: Activate (detects .spectacular/)
    Extension->>FileSystem: Watch specs/**/*.md
    Extension->>User: Show dashboard icon

    User->>Extension: Click "Open Dashboard"
    Extension->>Webview: Create WebviewPanel
    Extension->>Webview: Send config message
    Webview->>Extension: Ready message
    Webview->>User: Display dashboard
```

## File Editing Workflow

Complete cycle from opening a file to saving edits.

```mermaid
sequenceDiagram
    participant User
    participant VSCode
    participant Extension
    participant FileSystem
    participant Webview
    participant TipTap

    Note over User,TipTap: 1. Open File
    User->>VSCode: Open spec file in editor
    VSCode->>Extension: onDidChangeActiveTextEditor
    Extension->>Extension: Check if markdown in specs/
    Extension->>Webview: selectFile message
    Webview->>Extension: readFile command
    Extension->>FileSystem: fs.readFile(path)
    FileSystem-->>Extension: File content
    Extension->>Webview: fileContent message

    Note over User,TipTap: 2. Parse & Display
    Webview->>Webview: extractFrontmatter()
    Webview->>Webview: Preprocess: #status/done → <StatusTag>
    Webview->>Webview: Preprocess: [[link]] → <Wikilink>
    Webview->>TipTap: setContent(html)
    TipTap-->>User: Display in editor

    Note over User,TipTap: 3. Edit Content
    User->>TipTap: Type changes
    TipTap->>Webview: onUpdate event
    Webview->>Webview: Serialize to markdown
    Webview->>Webview: Compare with original
    Webview->>Webview: Mark as modified
    Webview-->>User: Show modified indicator (●)

    Note over User,TipTap: 4. Save Changes
    User->>Webview: Ctrl+S
    Webview->>Webview: getMarkdown() from TipTap
    Webview->>Webview: Postprocess: <StatusTag> → #status/done
    Webview->>Webview: Postprocess: <Wikilink> → [[link]]
    Webview->>Webview: Prepend frontmatter
    Webview->>Extension: saveFile command
    Extension->>FileSystem: fs.writeFile(path, content)
    FileSystem-->>Extension: Success
    Extension->>Webview: fileSaved message
    Webview->>Webview: Clear modified flag
    Webview-->>User: Clear modified indicator
```

## Task Status Auto-Update Flow

Automatic status updates when acceptance criteria are checked.

```mermaid
sequenceDiagram
    participant User
    participant VSCode
    participant FileSystem
    participant TaskStatusService
    participant Extension

    User->>VSCode: Edit task-01.md
    User->>VSCode: Check last acceptance criteria ✓
    User->>VSCode: Save file (Ctrl+S)

    VSCode->>FileSystem: Write file
    FileSystem->>TaskStatusService: onDidSaveTextDocument event

    TaskStatusService->>TaskStatusService: Check if task file
    TaskStatusService->>TaskStatusService: Parse frontmatter
    TaskStatusService->>TaskStatusService: Find acceptance criteria section
    TaskStatusService->>TaskStatusService: Count checkboxes

    alt All criteria checked
        TaskStatusService->>TaskStatusService: Set status: done
        TaskStatusService->>FileSystem: Update task file frontmatter
        TaskStatusService->>FileSystem: Find parent tasks.md
        TaskStatusService->>FileSystem: Update status tag in table
        TaskStatusService->>VSCode: Show status bar notification
        VSCode-->>User: "Task status updated to: done"
    else Some unchecked
        TaskStatusService->>TaskStatusService: Check if was 'done'
        alt Was done
            TaskStatusService->>TaskStatusService: Set status: pending
            TaskStatusService->>FileSystem: Update files
            TaskStatusService->>VSCode: Show notification
        else
            TaskStatusService->>TaskStatusService: No change
        end
    end
```

## File Watching Flow

Real-time updates from external file changes (e.g., git pull).

```mermaid
sequenceDiagram
    participant Git
    participant FileSystem
    participant FileWatcher
    participant Extension
    participant Webview

    Note over Git,Webview: External File Change
    Git->>FileSystem: git pull (updates multiple files)
    FileSystem->>FileWatcher: onChange events (rapid)

    FileWatcher->>FileWatcher: Debounce timer (300ms)
    Note over FileWatcher: Wait for changes to settle...

    FileWatcher->>Extension: Debounced onChange
    Extension->>FileSystem: Read updated file
    FileSystem-->>Extension: New content

    alt File currently open in webview
        Extension->>Webview: fileChange message
        Webview->>Webview: Check if modified locally

        alt Has local modifications
            Webview->>Webview: Show conflict indicator
            Webview->>User: "File changed on disk. Reload?"
            User->>Webview: Choose action
        else No local modifications
            Webview->>Webview: Reload content
            Webview-->>User: Display updated content
        end
    else File not currently open
        Extension->>Extension: Cache change
        Note over Extension: Will load on next open
    end
```

## AI Workflow Pipeline

Specification-driven development workflow using AI commands.

```mermaid
graph TB
    START([User: New Feature Request])

    START --> SPEC[/spec: Create Specification]
    SPEC --> SPEC_FILE[specs/###-feature/spec.md]

    SPEC_FILE --> PLAN[/plan: Create Implementation Plan]
    PLAN --> PLAN_FILE[specs/###-feature/plan.md]

    PLAN_FILE --> TASKS[/tasks: Break Down into Tasks]
    TASKS --> TASKS_FILE[specs/###-feature/tasks.md]
    TASKS --> TASK_FILES[specs/###-feature/task-01.md<br/>task-02.md, ...]

    TASK_FILES --> IMPLEMENT[/implement: Code Implementation]
    IMPLEMENT --> CODE[Source Code Changes]

    CODE --> VALIDATE[/validate: Review & Test]
    VALIDATE --> DECISION{All Valid?}

    DECISION -->|Yes| DONE([Feature Complete])
    DECISION -->|No| IMPLEMENT

    style START fill:#e2e8f0
    style SPEC fill:#4a9eff,color:#fff
    style PLAN fill:#68d391,color:#000
    style TASKS fill:#f6ad55,color:#000
    style IMPLEMENT fill:#fc8181,color:#fff
    style VALIDATE fill:#9f7aea,color:#fff
    style DONE fill:#48bb78,color:#fff
```

## Configuration Loading Flow

How configuration is loaded and merged.

```mermaid
graph TB
    START([Extension Activates])

    START --> GLOBAL{Global Config<br/>Exists?}
    GLOBAL -->|Yes| LOAD_GLOBAL[Load ~/.spectacular/config.json]
    GLOBAL -->|No| DEFAULT_GLOBAL[Use Default Global Config]

    LOAD_GLOBAL --> PROJECT{Project Config<br/>Exists?}
    DEFAULT_GLOBAL --> PROJECT

    PROJECT -->|Yes| LOAD_PROJECT[Load .spectacular/config/project.json]
    PROJECT -->|No| DEFAULT_PROJECT[Use Default Project Config]

    LOAD_PROJECT --> MERGE[Merge Configs<br/>Project Overrides Global]
    DEFAULT_PROJECT --> MERGE

    MERGE --> PACKAGE{package.json<br/>Exists?}
    PACKAGE -->|Yes| DETECT_TECH[Detect Tech Stack]
    PACKAGE -->|No| SKIP_DETECT[Skip Detection]

    DETECT_TECH --> FINAL[Final Configuration]
    SKIP_DETECT --> FINAL

    FINAL --> SEND[Send to Webview]
    SEND --> READY[Webview Ready]

    style START fill:#e2e8f0
    style FINAL fill:#68d391,color:#000
    style READY fill:#48bb78,color:#fff
```

## State Management

### Extension Host State

**Persistent:**
- Global configuration (`~/.spectacular/config.json`)
- Workspace state (VS Code `workspaceState`)

**Runtime:**
- File watcher instances
- Dashboard panel instance (singleton)
- Modified files tracking
- Navigation history

### Webview State

**Persisted (via `vscodeApi.setState()`):**
```typescript
{
  currentFile: string | null;
  modifiedFiles: [string, string][]; // Map entries
  navigationHistory: string[];
  historyIndex: number;
}
```

**Runtime (React state):**
```typescript
{
  rootPath: string | null;
  fileContent: string;
  isLoading: boolean;
  error: string | null;
  theme: 'light' | 'dark';
  isWatching: boolean;
}
```

## Error Propagation

### Extension → Webview

```typescript
try {
  const content = await fs.readFile(filePath, 'utf8');
  panel.webview.postMessage({
    type: 'fileContent',
    data: { path: filePath, content }
  });
} catch (error) {
  panel.webview.postMessage({
    type: 'error',
    data: {
      message: `Failed to read file: ${error.message}`,
      code: 'READ_ERROR',
      path: filePath
    }
  });
}
```

### Webview → User

```typescript
useEffect(() => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'error') {
      setError(event.data.data.message);
      // Show error in UI
      toast.error(event.data.data.message);
    }
  };

  window.addEventListener('message', handleMessage);
  return () => window.removeEventListener('message', handleMessage);
}, []);
```

## Performance Optimizations

### Debouncing

| Operation | Delay | Reason |
|-----------|-------|--------|
| File watcher | 300ms | Batch rapid changes (git pull) |
| Search input | 500ms | Reduce search queries |
| Auto-save (disabled) | N/A | Manual save only (Ctrl+S) |

### Lazy Loading

| Resource | Strategy |
|----------|----------|
| File tree | Load on demand (expand folder) |
| File content | Load when selected |
| Markdown rendering | Render visible content only |
| Images | Lazy load images in preview |

### Caching

| Data | Cache Location | Invalidation |
|------|----------------|--------------|
| File tree | Extension host memory | File watcher events |
| File content | Webview state | File change events |
| Rendered markdown | TipTap document | Content change |
| Configuration | Extension host | Config file change |

## Next Steps

- [CLI Architecture](./cli) - CLI tool details
- [Extension Architecture](./extension) - Extension host architecture
- [Webview Architecture](./webview) - React UI architecture
- [Message Protocol](./message-protocol) - Communication details
- [Overview](./index) - System overview
