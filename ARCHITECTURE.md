# SpecTacular Architecture Documentation

**Version:** 1.6.3
**Purpose:** Comprehensive architecture documentation for NotebookLM schema generation

---

## 1. System Overview

SpecTacular is a specification-driven development toolkit consisting of two main components:

```mermaid
graph TB
    subgraph "SpecTacular Ecosystem"
        subgraph CLI["spectacular-cli<br/>.NET 8 CLI Tool"]
            CLI1[Project Scaffolding]
            CLI2[Template Management]
            CLI3[CLI Updates]
            CLI4[Configuration Storage]
        end

        subgraph EXT["spectacular-vscode<br/>VS Code Extension"]
            EXT1[Markdown Preview Dashboard]
            EXT2[WYSIWYG Editor - TipTap]
            EXT3[Specs Tree View]
            EXT4[Task Status Automation]
        end
    end

    CLI -->|scaffolds| PROJECT[Scaffolded Project]
    EXT -->|edits/previews| PROJECT

    style CLI fill:#4a9eff,color:#fff
    style EXT fill:#68d391,color:#000
    style PROJECT fill:#f6ad55,color:#000
```

### Component Relationship

```mermaid
graph LR
    USER((Developer))

    USER -->|"spectacular init"| CLI[CLI Tool]
    USER -->|"Open in VS Code"| EXT[VS Code Extension]

    CLI -->|creates| SPECS[specs/ folder]
    CLI -->|creates| CLAUDE[.claude/ commands]
    CLI -->|creates| SPECTACULAR[.spectacular/ config]

    EXT -->|reads/writes| SPECS
    EXT -->|uses| CLAUDE
    EXT -->|uses| SPECTACULAR

    style USER fill:#e2e8f0,stroke:#4a5568
    style CLI fill:#4a9eff,color:#fff
    style EXT fill:#68d391,color:#000
```

---

## 2. CLI Architecture (spectacular-cli)

### 2.1 Component Diagram

```mermaid
graph TB
    subgraph Entry["Entry Point"]
        PROG[Program.cs<br/>System.CommandLine Router]
    end

    subgraph Commands["Commands Layer"]
        INIT[InitCommand<br/>--name, --tech, --path<br/>--tool, --language, --force]
        UPDATE[UpdateCommand<br/>--check]
        DASH[DashboardCommand<br/>Info Display]
    end

    subgraph Services["Services Layer"]
        SCAFFOLD[ScaffoldService<br/>Extract templates<br/>Apply variables<br/>Write files]
        TEMPLATE[TemplateService<br/>Variable substitution<br/>VAR → value]
        CONFIG[ConfigService<br/>Global config<br/>Project config<br/>Path resolution]
    end

    subgraph External["External Dependencies"]
        HTTP[HttpClient<br/>GitHub API]
        FS[File System<br/>Embedded Resources]
    end

    PROG --> INIT
    PROG --> UPDATE
    PROG --> DASH

    INIT --> SCAFFOLD
    SCAFFOLD --> TEMPLATE
    SCAFFOLD --> CONFIG
    SCAFFOLD --> FS

    UPDATE --> HTTP
    UPDATE --> FS

    style PROG fill:#4a9eff,color:#fff
    style INIT fill:#68d391,color:#000
    style UPDATE fill:#68d391,color:#000
    style DASH fill:#68d391,color:#000
    style SCAFFOLD fill:#f6ad55,color:#000
    style TEMPLATE fill:#f6ad55,color:#000
    style CONFIG fill:#f6ad55,color:#000
```

### 2.2 Commands

| Command | File | Purpose | Options |
|---------|------|---------|---------|
| `init` | InitCommand.cs | Scaffold new project | `--name`, `--tech`, `--path`, `--force`, `--tool`, `--language` |
| `update` | UpdateCommand.cs | Check/install updates | `--check` |
| `dashboard` | DashboardCommand.cs | Show extension info | None |

### 2.3 Services

| Service | File | Responsibility |
|---------|------|----------------|
| ScaffoldService | ScaffoldService.cs | Extract embedded templates, apply variables, write files |
| TemplateService | TemplateService.cs | Replace `{{PLACEHOLDER}}` with values |
| ConfigService | ConfigService.cs | Load/save config (global + project level) |

### 2.4 Template Variables

| Variable | Value Source | Example |
|----------|--------------|---------|
| `{{PROJECT_NAME}}` | --name option or directory name | "MyProject" |
| `{{TECH_STACK}}` | --tech option | "ASP.NET Core, React" |
| `{{TECH_STACK_LIST}}` | Formatted tech stack | "- ASP.NET Core\n- React" |
| `{{DATE}}` | Current date | "2024-01-15" |
| `{{LANGUAGE}}` | --language option | "English" |

### 2.5 Configuration Files

```mermaid
graph TB
    subgraph Global["Global Configuration"]
        GPATH["%LOCALAPPDATA%\spectacular\"]
        GCONF[config.json]
        GPATH --> GCONF
    end

    subgraph Project["Project Configuration"]
        PPATH["&lt;project&gt;\.spectacular\"]
        PCONF[config.json]
        PPATH --> PCONF
    end

    CONFIG[ConfigService] -->|loads/saves| GCONF
    CONFIG -->|loads/saves| PCONF
    CONFIG -->|priority| PCONF

    style GCONF fill:#4a9eff,color:#fff
    style PCONF fill:#68d391,color:#000
```

**Config Schema:**
```json
{
  "DashboardPath": "string | null"
}
```

### 2.6 Embedded Resources Structure

```mermaid
graph TB
    subgraph Resources["Resources/templates/"]
        subgraph Claude[".claude/"]
            CC[commands/]
            CT[tasks/]
            CC --> CC0[spectacular.0-quick.md]
            CC --> CC1[spectacular.1-spec.md]
            CC --> CC2[spectacular.2-plan.md]
            CC --> CC3[spectacular.3-tasks.md]
            CC --> CC4[spectacular.4-implement.md]
            CC --> CC5[spectacular.5-validate.md]
            CT --> CTB[backlog.md]
            CT --> CTD[decisions.md]
            CT --> CTI[index.md]
        end

        subgraph Cursor[".cursor/rules/"]
            CR0[spectacular-0-quick.mdc]
            CR1[spectacular-1-spec.mdc]
            CR2[spectacular-2-plan.mdc]
            CR3[spectacular-3-tasks.mdc]
            CR4[spectacular-4-implement.mdc]
            CR5[spectacular-5-validate.mdc]
        end

        subgraph Spectacular[".spectacular/"]
            SM[memory/constitution.md]
            SS[scripts/powershell/]
            ST[templates/]
        end

        ROOT[CLAUDE.md]
    end

    style Claude fill:#4a9eff,color:#fff
    style Cursor fill:#68d391,color:#000
    style Spectacular fill:#f6ad55,color:#000
```

### 2.7 Init Command Flow

```mermaid
sequenceDiagram
    participant User
    participant InitCommand
    participant ScaffoldService
    participant TemplateService
    participant ConfigService
    participant FileSystem

    User->>InitCommand: spectacular init --name MyProject

    InitCommand->>InitCommand: Parse CLI arguments
    InitCommand->>User: Prompt: AI tool? (Claude/Cursor/Both)
    User->>InitCommand: Select tool
    InitCommand->>User: Prompt: Language preference?
    User->>InitCommand: Select language

    InitCommand->>ScaffoldService: ScaffoldAsync(path, name, tech, tool, lang)

    loop For each embedded template
        ScaffoldService->>ScaffoldService: Load embedded resource
        ScaffoldService->>ScaffoldService: Filter by AI tool
        ScaffoldService->>TemplateService: ApplyVariables(content, vars)
        TemplateService-->>ScaffoldService: Processed content
        ScaffoldService->>FileSystem: Write file
    end

    ScaffoldService->>FileSystem: Create specs/ directory
    ScaffoldService-->>InitCommand: Return created/skipped lists

    InitCommand->>ConfigService: ResolveDashboardPath()
    InitCommand->>ConfigService: SaveGlobalConfig()

    InitCommand->>User: Display summary
```

---

## 3. VS Code Extension Architecture (spectacular-vscode)

### 3.1 High-Level Architecture

```mermaid
graph TB
    subgraph VSCode["VS Code Extension Host"]
        EXT[extension.ts<br/>Entry Point]
        DP[DashboardPanel<br/>Webview Manager]
        STP[SpecsTreeProvider<br/>TreeDataProvider]
        FDP[FileDecorationProvider<br/>Modified Indicators]
        TSS[TaskStatusService<br/>Auto Status Update]
        FO[fileOperations.ts<br/>File Tree Builder]
        VCS[VersionCheckService<br/>Update Checker]
    end

    subgraph Webview["React Webview"]
        APP[App.tsx<br/>Main State]
        CA[ContentArea<br/>Editor Wrapper]
        WE[WysiwygEditor<br/>TipTap Editor]
        MR[MarkdownRenderer<br/>Read-only View]
        API[vscodeApi.ts<br/>Message Bridge]
        TB[EditorToolbar<br/>Formatting]
    end

    EXT --> DP
    EXT --> STP
    EXT --> FDP
    EXT --> TSS
    EXT --> VCS
    DP --> FO

    DP <-->|postMessage API| API
    API --> APP
    APP --> CA
    CA --> WE
    CA --> MR
    WE --> TB

    style VSCode fill:#4a9eff,color:#fff
    style Webview fill:#68d391,color:#000
```

### 3.2 Extension Host Components

#### 3.2.1 extension.ts (Entry Point)

**Activation Events:**
- Extension loaded
- Command executed

**Registered Commands:**

| Command ID | Handler | Purpose |
|------------|---------|---------|
| `spectacular.openDashboard` | Opens dashboard panel | Main dashboard view |
| `spectacular.openDashboardToSide` | Opens beside editor | Side-by-side editing |
| `spectacular.openSpecFile` | Opens file in dashboard | Tree item click |
| `spectacular.refreshTree` | Refreshes tree view | Manual refresh |
| `spectacular.revealSpecs` | Shows specs in explorer | Navigate to folder |
| `spectacular.revealInTree` | Highlights file in tree | Called from webview |
| `spectacular.copyToClipboard` | Copies text | Welcome items |

**Event Listeners:**

| Event | Handler | Purpose |
|-------|---------|---------|
| `onDidChangeActiveTextEditor` | Auto-preview markdown | Show file when opened |
| `createFileSystemWatcher('**/*.md')` | File change detection | Refresh on changes |
| `onDidSaveTextDocument` | Clear modification flag | Update decorations |

#### 3.2.2 DashboardPanel.ts

**Singleton Pattern:** `DashboardPanel.currentPanel`

**Responsibilities:**
- Create/manage WebviewPanel
- Handle message passing
- File operations (read/save)
- File watching with debounce

**Key Methods:**

| Method | Purpose |
|--------|---------|
| `createOrShow()` | Factory method for panel |
| `showFile(filePath)` | Display file in preview |
| `notifyFileChange(filePath)` | Notify webview of disk change |
| `_sendConfig()` | Send initial config to webview |
| `_handleMessage(message)` | Process webview commands |

#### 3.2.3 SpecsTreeProvider.ts

**Implements:** `vscode.TreeDataProvider<TreeItem>`

**Tree Item Types:**

| Type | Purpose | Icon |
|------|---------|------|
| `SpecsTreeItem` | File or folder | Folder/File icon |
| `WelcomeTreeItem` | Empty state message | Info icon |

**Filtering Rules:**
- Shows only markdown files (.md, .markdown)
- Shows folders containing markdown files
- Hides: node_modules, dist, build, out
- Shows: .spectacular folder

#### 3.2.4 FileDecorationProvider.ts

**Purpose:** Visual indicators for modified files

**Decoration:**
```typescript
{
  badge: '●',
  color: 'gitDecoration.modifiedResourceForeground',
  tooltip: 'Modified'
}
```

#### 3.2.5 TaskStatusService.ts

**Purpose:** Automatic task status updates based on acceptance criteria

```mermaid
graph TB
    subgraph Detection["Task File Detection"]
        D1[Path contains /tasks/]
        D2[Extension is .md]
        D3[Frontmatter has type: task]
    end

    subgraph Logic["Status Logic"]
        L1{All criteria checked?}
        L2{Was status 'done'?}
        L1 -->|Yes| DONE[status: done]
        L1 -->|No| L2
        L2 -->|Yes| PENDING[status: pending]
        L2 -->|No| NOCHANGE[No change]
    end

    subgraph Updates["Updates"]
        U1[Task file frontmatter]
        U2[Main tasks.md table]
    end

    D1 --> D2 --> D3 --> L1
    DONE --> U1
    PENDING --> U1
    U1 --> U2

    style DONE fill:#68d391,color:#000
    style PENDING fill:#f6ad55,color:#000
```

#### 3.2.6 fileOperations.ts

**Functions:**

| Function | Purpose |
|----------|---------|
| `buildFileTree(rootPath)` | Build FileNode tree recursively |
| `readFileContent(filePath)` | Read file as UTF-8 string |
| `isMarkdownFile(filename)` | Check .md/.markdown extension |
| `normalizePath(filePath)` | Convert to forward slashes |

**FileNode Interface:**
```typescript
interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  expanded?: boolean;
  children?: FileNode[];
  lastModified?: number;
}
```

### 3.3 Message Protocol

```mermaid
graph LR
    subgraph Extension["Extension Host"]
        EH[DashboardPanel]
    end

    subgraph Messages["postMessage API"]
        direction TB
        TO_WV["Extension → Webview<br/>{type, data}"]
        TO_EXT["Webview → Extension<br/>{command, ...params}"]
    end

    subgraph Webview["React Webview"]
        WV[vscodeApi.ts]
    end

    EH -->|config, selectFile, fileContent<br/>fileChange, fileSaved, error| TO_WV
    TO_WV --> WV

    WV -->|ready, readFile, saveFile<br/>copyToClipboard, revealInTree| TO_EXT
    TO_EXT --> EH
```

#### Messages: Extension → Webview

| Type | Data | Trigger |
|------|------|---------|
| `config` | `{ rootPath, isWatching, theme, workspaceFolders, versionInfo }` | Ready, theme change |
| `selectFile` | `filePath: string` | Active editor change |
| `fileContent` | `{ path, content }` | readFile response |
| `fileChange` | `{ type, path, timestamp }` | File system watcher |
| `fileSaved` | `{ path, success }` | Save completed |
| `allFilesSaved` | `{ results: [...] }` | Save all completed |
| `watchingStarted` | - | Watcher started |
| `watchingStopped` | - | Watcher stopped |
| `folderSelected` | `path: string` | Directory selected |
| `themeChange` | `'dark' \| 'light'` | VS Code theme changed |
| `error` | `{ message }` | Error occurred |

#### Commands: Webview → Extension

| Command | Data | Purpose |
|---------|------|---------|
| `ready` | - | Webview initialized |
| `readFile` | `{ path }` | Request file content |
| `saveFile` | `{ path, content }` | Save single file |
| `saveAllFiles` | `{ files: [...] }` | Save multiple files |
| `startWatching` | `{ rootPath }` | Begin watching |
| `stopWatching` | - | Stop watching |
| `setWatching` | `{ enabled }` | Toggle watching |
| `selectDirectory` | - | Open folder picker |
| `openExternal` | `{ url }` | Open in browser |
| `copyToClipboard` | `{ text }` | Copy to clipboard |
| `revealInTree` | `{ path }` | Reveal in tree view |

### 3.4 Message Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant VSCode as VS Code Editor
    participant Ext as Extension Host
    participant WV as Webview (React)

    Note over User,WV: 1. User opens markdown file
    User->>VSCode: Open file in editor
    VSCode->>Ext: onDidChangeActiveTextEditor
    Ext->>Ext: Check isMarkdownFile && isInSpecsFolder
    Ext->>WV: postMessage({type: 'selectFile', data: path})
    WV->>Ext: postMessage({command: 'readFile', path})
    Ext->>Ext: Read file from disk
    Ext->>WV: postMessage({type: 'fileContent', data: {path, content}})
    WV->>WV: Display in WysiwygEditor

    Note over User,WV: 2. User edits file
    User->>WV: Edit content
    WV->>WV: TipTap onUpdate
    WV->>WV: Serialize to markdown
    WV->>WV: Compare with original
    WV->>WV: Update modifiedFiles Map
    WV->>WV: Show modified indicator

    Note over User,WV: 3. User saves file
    User->>WV: Ctrl+S
    WV->>Ext: postMessage({command: 'saveFile', path, content})
    Ext->>Ext: fs.writeFile()
    Ext->>WV: postMessage({type: 'fileSaved', data: {path, success}})
    WV->>WV: Remove from modifiedFiles
    WV->>WV: Clear modified indicator
```

---

## 4. Webview Architecture (React App)

### 4.1 Component Hierarchy

```mermaid
graph TB
    subgraph App["App.tsx (Main State)"]
        STATE[State: rootPath, selectedFile<br/>fileContent, modifiedFiles<br/>isLoading, error]
    end

    subgraph ContentArea["ContentArea.tsx"]
        BREAD[Breadcrumb.tsx<br/>Path + Copy]
        EDITOR[WysiwygEditor.tsx]
    end

    subgraph WysiwygEditor["WysiwygEditor Components"]
        TOOLBAR[EditorToolbar.tsx<br/>Formatting Controls]
        TIPTAP[TipTap Editor]
    end

    subgraph Extensions["TipTap Extensions"]
        EXT1[StarterKit]
        EXT2[Link]
        EXT3[Image]
        EXT4[Table + Row/Cell/Header]
        EXT5[TaskList + TaskItem]
        EXT6[Typography]
        EXT7[Markdown]
        EXT8[StatusTag - Custom]
        EXT9[Wikilink - Custom]
    end

    subgraph Preview["Alternative View"]
        MR[MarkdownRenderer.tsx<br/>Read-only Preview]
    end

    App --> ContentArea
    ContentArea --> BREAD
    ContentArea --> EDITOR
    EDITOR --> TOOLBAR
    EDITOR --> TIPTAP
    TIPTAP --> Extensions
    App --> Preview

    style App fill:#4a9eff,color:#fff
    style EXT8 fill:#f6ad55,color:#000
    style EXT9 fill:#f6ad55,color:#000
```

### 4.2 State Management (App.tsx)

| State | Type | Purpose |
|-------|------|---------|
| `rootPath` | `string \| null` | Root directory path |
| `selectedFile` | `string \| null` | Current file path |
| `fileContent` | `string` | Current file content |
| `isLoading` | `boolean` | Loading indicator |
| `error` | `string \| null` | Error message |
| `isReady` | `boolean` | Extension initialized |
| `isWatching` | `boolean` | File watching active |
| `recentFiles` | `RecentFile[]` | Recently opened (max 10) |
| `modifiedFiles` | `Map<string, ModifiedFile>` | Unsaved changes |
| `versionInfo` | `VersionInfo \| null` | Extension version |

### 4.3 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save current file |
| `Ctrl+Shift+S` | Save all modified files |
| `Alt+Left` | Navigate back |
| `Alt+Right` | Navigate forward |
| `Mouse Button 3` | Navigate back |
| `Mouse Button 4` | Navigate forward |

### 4.4 Custom TipTap Extensions

#### StatusTag Extension

```mermaid
graph LR
    subgraph Input["Markdown Input"]
        MD["#status/done"]
    end

    subgraph Process["Preprocessing"]
        PRE[preprocessMarkdown]
    end

    subgraph Editor["TipTap Node"]
        NODE["&lt;span data-type='status-tag'<br/>data-status='done'&gt;"]
    end

    subgraph Output["Postprocessing"]
        POST[postprocessToMarkdown]
    end

    subgraph Final["Markdown Output"]
        OUT["#status/done"]
    end

    MD --> PRE --> NODE --> POST --> OUT
```

**Supported Values:**

| Status | Display | Icon Color |
|--------|---------|------------|
| `done` | Done | Green |
| `complete` | Complete | Green |
| `pending` | Pending | Gray |
| `in-progress` | In Progress | Blue |
| `blocked` | Blocked | Red |
| `skipped` | Skipped | Gray |

#### Wikilink Extension

**Markdown Syntax:**
- `[[filename]]` → Link to filename.md
- `[[path/to/file]]` → Relative path
- `[[target|Display Text]]` → Custom label

**Path Resolution:**
```
Current file: /specs/feature-a/spec.md
Wikilink: [[../feature-b/spec]]
Resolved: /specs/feature-b/spec.md
```

### 4.5 Markdown Serialization Flow

```mermaid
graph TB
    subgraph Loading["Loading Content"]
        L1[Raw Markdown from file]
        L2[extractFrontmatter]
        L3[preprocessMarkdown]
        L4[TipTap Editor]

        L1 -->|"---yaml---"| L2
        L2 -->|"Store in frontmatterRef"| L3
        L3 -->|"#status/done → span<br/>[[link]] → span"| L4
        L4 -->|"Parse to ProseMirror"| L5[Editor Document]
    end

    subgraph Saving["Saving Content"]
        S1[Editor Document]
        S2[getMarkdown]
        S3[postprocessToMarkdown]
        S4[Reattach frontmatter]
        S5[Final Markdown]

        S1 --> S2
        S2 -->|"Serialize"| S3
        S3 -->|"span → #status/done<br/>span → [[link]]"| S4
        S4 -->|"Prepend YAML"| S5
    end

    style L1 fill:#4a9eff,color:#fff
    style L5 fill:#68d391,color:#000
    style S1 fill:#68d391,color:#000
    style S5 fill:#4a9eff,color:#fff
```

### 4.6 Navigation History

**Hook:** `useNavigationHistory()`

```mermaid
stateDiagram-v2
    [*] --> Empty: Initial
    Empty --> HasHistory: pushHistory(path)
    HasHistory --> HasHistory: pushHistory(path)
    HasHistory --> CanGoBack: index > 0
    HasHistory --> CanGoForward: index < length-1
    CanGoBack --> HasHistory: goBack()
    CanGoForward --> HasHistory: goForward()
```

**Operations:**

| Function | Behavior |
|----------|----------|
| `pushHistory(path)` | Add path, truncate forward history |
| `goBack()` | Return path at index-1 |
| `goForward()` | Return path at index+1 |
| `canGoBack` | index > 0 |
| `canGoForward` | index < history.length - 1 |

---

## 5. Scaffolded Project Structure

Created by `spectacular init`:

```mermaid
graph TB
    subgraph Root["Project Root"]
        CLAUDE[".claude/"]
        CURSOR[".cursor/"]
        SPECTACULAR[".spectacular/"]
        SPECS["specs/"]
        CLAUDEMD["CLAUDE.md"]
    end

    subgraph ClaudeDir[".claude/ Contents"]
        CC["commands/"]
        CT["tasks/"]
        CC --> CC0["spectacular.0-quick.md"]
        CC --> CC1["spectacular.1-spec.md"]
        CC --> CC2["spectacular.2-plan.md"]
        CC --> CC3["spectacular.3-tasks.md"]
        CC --> CC4["spectacular.4-implement.md"]
        CC --> CC5["spectacular.5-validate.md"]
    end

    subgraph SpecDir[".spectacular/ Contents"]
        SC["config.json"]
        SM["memory/constitution.md"]
        SS["scripts/powershell/"]
        ST["templates/"]
    end

    subgraph SpecsDir["specs/ Contents"]
        SF["###-feature-name/"]
        SF --> SFS["spec.md"]
        SF --> SFP["plan.md"]
        SF --> SFT["tasks.md"]
        SF --> SFTD["tasks/task-##-name.md"]
    end

    CLAUDE --> ClaudeDir
    SPECTACULAR --> SpecDir
    SPECS --> SpecsDir

    style CLAUDE fill:#4a9eff,color:#fff
    style SPECTACULAR fill:#f6ad55,color:#000
    style SPECS fill:#68d391,color:#000
```

### 5.1 AI Pipeline Commands

```mermaid
graph LR
    subgraph Pipeline["AI Development Pipeline"]
        P0["0-quick<br/>Full Pipeline"]
        P1["1-spec<br/>Create Spec"]
        P2["2-plan<br/>Generate Plan"]
        P3["3-tasks<br/>Create Tasks"]
        P4["4-implement<br/>Execute"]
        P5["5-validate<br/>Verify"]
    end

    IDEA((Feature Idea)) --> P1
    P1 -->|spec.md| P2
    P2 -->|plan.md| P3
    P3 -->|tasks.md| P4
    P4 -->|Code Changes| P5
    P5 -->|Build/Test| DONE((Complete))

    P0 -.->|orchestrates| P1
    P0 -.->|orchestrates| P2
    P0 -.->|orchestrates| P3
    P0 -.->|orchestrates| P4
    P0 -.->|orchestrates| P5

    style P0 fill:#e2e8f0,stroke:#4a5568
    style IDEA fill:#4a9eff,color:#fff
    style DONE fill:#68d391,color:#000
```

| Stage | Command | Input | Output |
|-------|---------|-------|--------|
| 0 | `0-quick` | Feature description | Complete implementation |
| 1 | `1-spec` | Feature idea | `spec.md` |
| 2 | `2-plan` | `spec.md` | `plan.md` |
| 3 | `3-tasks` | `plan.md` | `tasks.md` + task files |
| 4 | `4-implement` | Tasks | Code changes |
| 5 | `5-validate` | Implementation | Build/test results |

### 5.2 Task File Format

```yaml
---
type: task
status: pending
created: 2024-01-15
---

# Task Title

## Description
Task description here.

## Acceptance Criteria
- [ ] First criterion
- [ ] Second criterion
- [x] Completed criterion

## Notes
Additional notes.
```

**Status Auto-Update Logic:**

```mermaid
graph TD
    CHECK{All acceptance<br/>criteria checked?}
    WASDONE{Was status<br/>'done'?}

    CHECK -->|Yes| DONE["Set status: done"]
    CHECK -->|No| WASDONE
    WASDONE -->|Yes| PENDING["Set status: pending"]
    WASDONE -->|No| NOCHANGE["No change"]

    style DONE fill:#68d391,color:#000
    style PENDING fill:#f6ad55,color:#000
    style NOCHANGE fill:#e2e8f0,stroke:#4a5568
```

---

## 6. Data Flow Diagrams

### 6.1 Project Initialization Flow

```mermaid
flowchart TD
    START([User runs: spectacular init]) --> PARSE[Parse CLI arguments]
    PARSE --> TOOL{AI Tool<br/>specified?}
    TOOL -->|No| PROMPT1[Prompt: Claude/Cursor/Both?]
    TOOL -->|Yes| LANG
    PROMPT1 --> LANG{Language<br/>specified?}
    LANG -->|No| PROMPT2[Prompt: Language preference?]
    LANG -->|Yes| SCAFFOLD
    PROMPT2 --> SCAFFOLD

    SCAFFOLD[ScaffoldService.ScaffoldAsync] --> LOAD[Load embedded resources<br/>31 template files]
    LOAD --> FILTER[Filter by AI tool selection]
    FILTER --> APPLY[Apply template variables<br/>PROJECT, TECH, DATE]
    APPLY --> WRITE[Write files to disk]
    WRITE --> MKDIR[Create specs/ directory]
    MKDIR --> CONFIG[Save dashboard path config]
    CONFIG --> SUMMARY[Display summary<br/>Created/Skipped files]
    SUMMARY --> END([Done])

    style START fill:#4a9eff,color:#fff
    style END fill:#68d391,color:#000
    style SCAFFOLD fill:#f6ad55,color:#000
```

### 6.2 Task Status Update Flow

```mermaid
flowchart TD
    START([User checks acceptance criterion]) --> SAVE[User saves file]
    SAVE --> WATCH[FileSystemWatcher detects change]
    WATCH --> PROCESS[TaskStatusService.processTaskFileChange]

    PROCESS --> ISTASK{Is task file?<br/>/tasks/*.md}
    ISTASK -->|No| END1([Return - not a task])
    ISTASK -->|Yes| PARSE[Parse task file]

    PARSE --> EXTRACT[Extract frontmatter<br/>type, status]
    EXTRACT --> CRITERIA[Find Acceptance Criteria section]
    CRITERIA --> CHECK{All criteria<br/>checked?}

    CHECK -->|Yes| SETDONE[newStatus = 'done']
    CHECK -->|No| WASDONE{Was status<br/>'done'?}
    WASDONE -->|Yes| SETPENDING[newStatus = 'pending']
    WASDONE -->|No| END2([Return - no change])

    SETDONE --> CHANGED{Status changed?}
    SETPENDING --> CHANGED

    CHANGED -->|No| END3([Return])
    CHANGED -->|Yes| UPDATE1[Update task file frontmatter]
    UPDATE1 --> FINDMAIN[Find main tasks.md]
    FINDMAIN --> UPDATE2[Update tasks.md table<br/>#status/pending → #status/done]
    UPDATE2 --> NOTIFY[Show notification]
    NOTIFY --> END4([Done])

    style START fill:#4a9eff,color:#fff
    style SETDONE fill:#68d391,color:#000
    style SETPENDING fill:#f6ad55,color:#000
```

### 6.3 Complete System Data Flow

```mermaid
flowchart TB
    subgraph User["User Actions"]
        U1[Run CLI init]
        U2[Open VS Code]
        U3[Edit specs]
        U4[Save files]
    end

    subgraph CLI["CLI Tool"]
        C1[ScaffoldService]
        C2[TemplateService]
        C3[ConfigService]
    end

    subgraph Extension["VS Code Extension"]
        E1[extension.ts]
        E2[DashboardPanel]
        E3[SpecsTreeProvider]
        E4[TaskStatusService]
    end

    subgraph Webview["React Webview"]
        W1[App.tsx]
        W2[WysiwygEditor]
        W3[vscodeApi]
    end

    subgraph FileSystem["File System"]
        F1[.spectacular/]
        F2[.claude/]
        F3[specs/]
    end

    U1 --> C1
    C1 --> C2 --> F1
    C1 --> F2
    C1 --> F3
    C1 --> C3

    U2 --> E1
    E1 --> E2
    E1 --> E3
    E3 -->|reads| F3

    E2 <-->|postMessage| W3
    W3 --> W1 --> W2

    U3 --> W2
    W2 -->|content| W1

    U4 --> W1
    W1 -->|saveFile| W3
    W3 -->|postMessage| E2
    E2 -->|writes| F3

    E2 -->|notifies| E4
    E4 -->|updates| F3

    style User fill:#e2e8f0,stroke:#4a5568
    style CLI fill:#4a9eff,color:#fff
    style Extension fill:#68d391,color:#000
    style Webview fill:#f6ad55,color:#000
```

---

## 7. Technology Stack

### CLI (spectacular-cli)

| Layer | Technology |
|-------|------------|
| Runtime | .NET 8 |
| CLI Framework | System.CommandLine 2.0-beta4 |
| JSON | System.Text.Json (source generators) |
| Packaging | Single-file, self-contained executable |
| Updates | GitHub Releases API |

### Extension (spectacular-vscode)

| Layer | Technology |
|-------|------------|
| Extension Host | VS Code Extension API |
| Build | TypeScript, esbuild |
| Webview | React 18, Vite |
| Editor | TipTap 2 (ProseMirror) |
| Styling | Tailwind CSS |
| Markdown | react-markdown, remark-gfm |
| Syntax Highlighting | react-syntax-highlighter |
| Testing | Vitest |

### Technology Relationships

```mermaid
graph TB
    subgraph CLI["CLI Stack"]
        NET[.NET 8]
        CMD[System.CommandLine]
        JSON[System.Text.Json]
        NET --> CMD --> JSON
    end

    subgraph Extension["Extension Stack"]
        VSCODE[VS Code API]
        TS[TypeScript]
        ESBUILD[esbuild]
        VSCODE --> TS --> ESBUILD
    end

    subgraph Webview["Webview Stack"]
        REACT[React 18]
        VITE[Vite]
        TIPTAP[TipTap 2]
        TAILWIND[Tailwind CSS]
        REACT --> VITE
        REACT --> TIPTAP
        REACT --> TAILWIND
    end

    Extension <-->|postMessage| Webview

    style CLI fill:#4a9eff,color:#fff
    style Extension fill:#68d391,color:#000
    style Webview fill:#f6ad55,color:#000
```

### Message Protocol

| Direction | Format |
|-----------|--------|
| Extension → Webview | `{ type: string, data?: unknown }` |
| Webview → Extension | `{ command: string, ...params }` |

---

## 8. Key Files Reference

### CLI Files

| File | Path | Purpose |
|------|------|---------|
| Program.cs | Spectacular.Cli/Program.cs | Entry point |
| InitCommand.cs | Spectacular.Cli/Commands/InitCommand.cs | Init command |
| UpdateCommand.cs | Spectacular.Cli/Commands/UpdateCommand.cs | Update command |
| ScaffoldService.cs | Spectacular.Cli/Services/ScaffoldService.cs | Template extraction |
| TemplateService.cs | Spectacular.Cli/Services/TemplateService.cs | Variable substitution |
| ConfigService.cs | Spectacular.Cli/Services/ConfigService.cs | Configuration |

### Extension Files

| File | Path | Purpose |
|------|------|---------|
| extension.ts | src/extension.ts | Extension entry |
| DashboardPanel.ts | src/DashboardPanel.ts | Webview manager |
| SpecsTreeProvider.ts | src/SpecsTreeProvider.ts | Tree view |
| FileDecorationProvider.ts | src/FileDecorationProvider.ts | Decorations |
| TaskStatusService.ts | src/TaskStatusService.ts | Task automation |
| fileOperations.ts | src/fileOperations.ts | File utilities |

### Webview Files

| File | Path | Purpose |
|------|------|---------|
| App.tsx | webview/src/App.tsx | Main component |
| vscodeApi.ts | webview/src/vscodeApi.ts | VS Code bridge |
| ContentArea.tsx | webview/src/components/ContentArea.tsx | Editor wrapper |
| WysiwygEditor.tsx | webview/src/components/editor/WysiwygEditor.tsx | TipTap editor |
| EditorToolbar.tsx | webview/src/components/editor/EditorToolbar.tsx | Formatting toolbar |
| MarkdownRenderer.tsx | webview/src/components/MarkdownRenderer.tsx | Preview renderer |
| StatusTag.ts | webview/src/components/editor/extensions/StatusTag.ts | Status extension |
| Wikilink.ts | webview/src/components/editor/extensions/Wikilink.ts | Wikilink extension |

### File Dependencies

```mermaid
graph LR
    subgraph CLI["CLI Dependencies"]
        PC[Program.cs] --> IC[InitCommand.cs]
        PC --> UC[UpdateCommand.cs]
        IC --> SS[ScaffoldService.cs]
        SS --> TS[TemplateService.cs]
        SS --> CS[ConfigService.cs]
    end

    subgraph Extension["Extension Dependencies"]
        EXT[extension.ts] --> DP[DashboardPanel.ts]
        EXT --> STP[SpecsTreeProvider.ts]
        EXT --> TSS[TaskStatusService.ts]
        DP --> FO[fileOperations.ts]
    end

    subgraph Webview["Webview Dependencies"]
        APP[App.tsx] --> CA[ContentArea.tsx]
        CA --> WE[WysiwygEditor.tsx]
        WE --> TB[EditorToolbar.tsx]
        WE --> ST[StatusTag.ts]
        WE --> WL[Wikilink.ts]
        APP --> API[vscodeApi.ts]
    end
```

---

## 9. Configuration Reference

### VS Code Settings

| Setting | Default | Purpose |
|---------|---------|---------|
| `spectacular.watchDebounceMs` | 300 | File change debounce (ms) |
| `spectacular.autoOpen` | false | Auto-open dashboard on startup |
| `spectacular.autoPreview` | true | Auto-preview on file open |

### CLI Configuration

**Global config:** `%LOCALAPPDATA%\spectacular\config.json`
```json
{
  "DashboardPath": "C:\\path\\to\\dashboard.exe"
}
```

**Project config:** `.spectacular\config.json`
```json
{
  "DashboardPath": null
}
```

---

## 10. Glossary

| Term | Definition |
|------|------------|
| **Specs** | Specification documents in markdown format |
| **Dashboard** | VS Code webview for previewing/editing specs |
| **Pipeline** | Sequential AI commands (1-spec → 2-plan → 3-tasks → 4-implement → 5-validate) |
| **Status Tag** | Inline markdown syntax (`#status/done`) for task status |
| **Wikilink** | Double-bracket links (`[[filename]]`) for navigation |
| **Task File** | Markdown file with frontmatter and acceptance criteria |
| **Frontmatter** | YAML metadata at start of markdown files (`---...---`) |
| **Constitution** | Project principles document in `.spectacular/memory/` |

---

## 11. Diagram Index

Quick reference to all Mermaid diagrams in this document:

| Section | Diagram | Type | Description |
|---------|---------|------|-------------|
| 1 | System Overview | graph TB | High-level ecosystem |
| 1 | Component Relationship | graph LR | CLI + Extension relationship |
| 2.1 | CLI Components | graph TB | Commands and services |
| 2.5 | Configuration Files | graph TB | Config file locations |
| 2.6 | Embedded Resources | graph TB | Template file structure |
| 2.7 | Init Command Flow | sequenceDiagram | Initialization sequence |
| 3.1 | Extension Architecture | graph TB | VS Code extension components |
| 3.2.5 | Task Status Logic | graph TB | Status detection flow |
| 3.3 | Message Protocol | graph LR | Extension ↔ Webview messages |
| 3.4 | Message Flow | sequenceDiagram | Complete message sequence |
| 4.1 | Component Hierarchy | graph TB | React component tree |
| 4.4 | StatusTag Flow | graph LR | Markdown ↔ HTML conversion |
| 4.5 | Serialization Flow | graph TB | Load/save content flow |
| 4.6 | Navigation History | stateDiagram-v2 | History state machine |
| 5 | Project Structure | graph TB | Scaffolded file tree |
| 5.1 | AI Pipeline | graph LR | Development pipeline |
| 5.2 | Status Update Logic | graph TD | Auto-status decision tree |
| 6.1 | Init Flow | flowchart TD | Complete init process |
| 6.2 | Task Status Flow | flowchart TD | Task update process |
| 6.3 | System Data Flow | flowchart TB | Complete system overview |
| 7 | Technology Stack | graph TB | Tech relationships |
| 8 | File Dependencies | graph LR | Source file dependencies |

---

*End of Architecture Documentation*
