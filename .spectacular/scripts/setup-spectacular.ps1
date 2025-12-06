<#
.SYNOPSIS
    Sets up task planning structure with SpecTacular workflow for a project.

.DESCRIPTION
    Creates the complete folder structure, templates, PowerShell scripts,
    and Claude Code slash commands for Markdown task planning
    AND the SpecTacular feature development pipeline.

.PARAMETER ProjectPath
    Target project path. Defaults to current directory.

.PARAMETER ProjectName
    Name of the project (used in index file).

.PARAMETER TechStack
    Technology stack (e.g., "ASP.NET Core, React, SQL Server")

.EXAMPLE
    ./setup-spectacular.notesner.ps1 -ProjectPath "C:\Projects\MyApp" -ProjectName "MyApp" -TechStack "ASP.NET Core 8, React 18, SQL Server 2022"
#>

param(
    [string]$ProjectPath = (Get-Location).Path,
    [string]$ProjectName = (Split-Path $ProjectPath -Leaf),
    [string]$TechStack = "ASP.NET Core, React, SQL Server"
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "[..] $msg" -ForegroundColor Cyan }
function Write-Warn { param($msg) Write-Host "[!!] $msg" -ForegroundColor Yellow }

Write-Host "`n=== SpecTacular Setup ===" -ForegroundColor Magenta
Write-Info "Project: $ProjectName"
Write-Info "Path: $ProjectPath"
Write-Info "Tech: $TechStack"

# Create directories
$directories = @(
    ".claude/tasks",
    ".claude/commands",
    ".spectacular/templates",
    ".spectacular/memory",
    ".spectacular/scripts/powershell",
    ".spectacular/dashboard",
    "specs"
)

foreach ($dir in $directories) {
    $fullPath = Join-Path $ProjectPath $dir
    if (!(Test-Path $fullPath)) {
        New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
        Write-Success "Created: $dir"
    } else {
        Write-Warn "Exists: $dir"
    }
}

# ============================================================================
# DASHBOARD INSTALLATION
# ============================================================================

$dashboardDir = Join-Path $ProjectPath ".spectacular/dashboard"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$sourceDir = Split-Path -Parent $scriptDir

# Copy dashboard files from source
$dashboardSource = Join-Path $sourceDir "dashboard"
if (Test-Path $dashboardSource) {
    # Copy dist folder
    $distSource = Join-Path $dashboardSource "dist"
    $distDest = Join-Path $dashboardDir "dist"
    if (Test-Path $distSource) {
        Copy-Item -Path $distSource -Destination $distDest -Recurse -Force
        Write-Success "Copied: dashboard/dist"
    }

    # Copy dist-electron folder
    $electronSource = Join-Path $dashboardSource "dist-electron"
    $electronDest = Join-Path $dashboardDir "dist-electron"
    if (Test-Path $electronSource) {
        Copy-Item -Path $electronSource -Destination $electronDest -Recurse -Force
        Write-Success "Copied: dashboard/dist-electron"
    }
} else {
    Write-Warn "Dashboard source not found at: $dashboardSource"
}

# Create package.json with dependencies for running electron
$dashboardPackageJson = @'
{
  "name": "spectacular-dashboard",
  "version": "1.0.0",
  "description": "SpecTacular Dashboard - Preview and monitor markdown specification files",
  "main": "dist-electron/main.cjs",
  "scripts": {
    "start": "electron ."
  },
  "dependencies": {
    "chokidar": "^3.5.3"
  }
}
'@

$dashboardPackagePath = Join-Path $dashboardDir "package.json"
Set-Content -Path $dashboardPackagePath -Value $dashboardPackageJson -Encoding UTF8
Write-Success "Created: .spectacular/dashboard/package.json"

# Install dashboard dependencies
Write-Info "Installing dashboard dependencies..."
Push-Location $dashboardDir
try {
    npm install --silent 2>&1 | Out-Null
    Write-Success "Installed: dashboard dependencies"
} catch {
    Write-Warn "Failed to install dependencies. Run 'npm install' in .spectacular/dashboard/"
}
Pop-Location

# ============================================================================
# TASK PLANNER FILES
# ============================================================================

# Create task template
$taskTemplate = @"
---
type: task
status: pending
priority: P2
created: {{date}}
parent: [[index]]
tags: [task]
---

# {{title}}

## Description

<!-- What needs to be done -->

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Technical Notes

<!-- Implementation details, constraints, decisions -->

## Links

- Parent: [[index]]
- Related: <!-- [[other-task]] -->
- Blocked by: <!-- [[dependency]] -->

"@

$taskTemplatePath = Join-Path $ProjectPath ".spectacular/templates/task-template.md"
Set-Content -Path $taskTemplatePath -Value $taskTemplate -Encoding UTF8
Write-Success "Created: .spectacular/templates/task-template.md"

# Create index template
$indexTemplate = @"
---
type: index
created: $(Get-Date -Format "yyyy-MM-dd")
project: $ProjectName
tech: $TechStack
---

# $ProjectName - Task Index

## Overview

<!-- Project description -->

## Tech Stack

$($TechStack -split ',' | ForEach-Object { "- $($_.Trim())" } | Out-String)

## Tasks

### Active

<!-- [[task-name]] - Description -->

### Pending

<!-- [[task-name]] - Description -->

### Completed

<!-- [[task-name]] - Description -->

## Architecture Notes

<!-- Key decisions, patterns, constraints -->

## Links

- [[backlog]]
- [[decisions]]

"@

$indexPath = Join-Path $ProjectPath ".claude/tasks/index.md"
Set-Content -Path $indexPath -Value $indexTemplate -Encoding UTF8
Write-Success "Created: .claude/tasks/index.md"

# Create backlog template
$backlogTemplate = @"
---
type: backlog
created: $(Get-Date -Format "yyyy-MM-dd")
parent: [[index]]
---

# Backlog

## High Priority (P1)

<!-- [[task-name]] - Description -->

## Medium Priority (P2)

<!-- [[task-name]] - Description -->

## Low Priority (P3)

<!-- [[task-name]] - Description -->

## Ideas / Future

<!-- Unrefined ideas -->

"@

$backlogPath = Join-Path $ProjectPath ".claude/tasks/backlog.md"
Set-Content -Path $backlogPath -Value $backlogTemplate -Encoding UTF8
Write-Success "Created: .claude/tasks/backlog.md"

# Create decisions log
$decisionsTemplate = @"
---
type: decisions
created: $(Get-Date -Format "yyyy-MM-dd")
parent: [[index]]
---

# Architecture Decisions

## ADR-001: [Decision Title]

**Status**: Proposed | Accepted | Deprecated | Superseded

**Context**: <!-- Why is this decision needed? -->

**Decision**: <!-- What was decided? -->

**Consequences**: <!-- What are the implications? -->

**Related**: <!-- [[task-name]] -->

---

<!-- Add more ADRs below -->

"@

$decisionsPath = Join-Path $ProjectPath ".claude/tasks/decisions.md"
Set-Content -Path $decisionsPath -Value $decisionsTemplate -Encoding UTF8
Write-Success "Created: .claude/tasks/decisions.md"

# Create spectacular.notes slash command
$spectacularNotesCommand = @'
---
description: Open Task planner for editing and reviewing task notes
---

[PERSONA] Task planning specialist. Expert in wikilink graphs and task decomposition.

[CONTEXT]
- VS Code for task management
- All task notes live in `.claude/tasks/` folder
- Wikilink format: [[note-name]] or [[folder/note-name]]
- Only EDIT existing Markdown files, never create new ones without explicit user request

[TASK]
Plan and review project subtasks through connected Markdown notes. Show relationships, propose changes, wait for approval.

[WORKFLOW]
1. Ask which subtask or note we're working on
2. Read the file from `.claude/tasks/`
3. Display 2-level local graph (see format below)
4. Propose changes in diff format
5. Wait for: APPROVE | CHANGE | REJECT | SKIP
6. Only after APPROVE -> apply changes to the file

[GRAPH FORMAT]
```
Current: [[note-name]]
-- Links to: [[a]], [[b]]
-- Linked from: [[x]], [[y]]
-- 2nd level: [[a]]->[[c]], [[x]]<-[[z]]
```

[APPROVAL COMMANDS]
| Command | Action |
|---------|--------|
| APPROVE | Apply changes, show confirmation |
| CHANGE  | User provides corrections, revise diff |
| REJECT  | Discard changes, ask what to do instead |
| SKIP    | Move to next subtask, no changes made |

[CONSTRAINTS]
- Never reference a file unless it exists in `.claude/tasks/`
- Never implement code - planning and note editing only
- If unsure about a file or link -> ask, don't guess
- One subtask at a time
- Preserve existing frontmatter (YAML between --- markers)

[START]
Ask: Which subtask or note in `.claude/tasks/` are we working on?
Then read the file, show its 2-level graph, and wait.
'@

$spectacularNotesPath = Join-Path $ProjectPath ".claude/commands/spectacular.notes.md"
[System.IO.File]::WriteAllText($spectacularNotesPath, $spectacularNotesCommand)
Write-Success "Created: .claude/commands/spectacular.notes.md"

# Create spectacular.dashboard slash command
$spectacularDashboardCommand = @'
---
description: Launch the SpecTacular Dashboard to preview and monitor spec files
---

## Purpose

Launch the SpecTacular Dashboard - an Electron application for previewing and monitoring markdown specification files in real-time.

## Prerequisites

- Node.js must be installed
- Electron must be available (will be installed if missing)

## Execution

Run this command from the project root:

```bash
cd .spectacular/dashboard && npx electron .
```

Or if electron is installed globally:

```bash
cd .spectacular/dashboard && electron .
```

## Features

- **File Tree Sidebar**: Browse markdown files in the specs folder
- **Markdown Preview**: Full rendering with syntax highlighting
- **Real-time Watching**: Automatic detection of file changes
- **Dark/Light Theme**: Toggle with localStorage persistence
- **Navigation History**: Back/forward navigation

## Notes

- The dashboard monitors the `specs/` folder by default
- You can select a different folder from within the application
- Press Ctrl+C in the terminal to close the dashboard
'@

$spectacularDashboardPath = Join-Path $ProjectPath ".claude/commands/spectacular.dashboard.md"
[System.IO.File]::WriteAllText($spectacularDashboardPath, $spectacularDashboardCommand)
Write-Success "Created: .claude/commands/spectacular.dashboard.md"

# ============================================================================
# SPECTACULAR SLASH COMMANDS
# ============================================================================

# spectacular.quick.md
$spectacularQuickCommand = @'
---
description: (ALL) Orchestrates the full pipeline - spec, plan, tasks, implement, validate - in one command.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

This command **orchestrates** the complete simplified pipeline:

```
/spectacular.1-spec -> /spectacular.2-plan -> /spectacular.3-tasks -> /spectacular.4-implement -> /spectacular.5-validate
```

Each step is a separate command that can also be run independently.

## Pipeline Steps

Execute each step in order. Report progress after each step.

### Step 1: Spec (`/spectacular.1-spec`)

**Goal**: Create feature branch and specification

1. Generate branch name (2-4 words from description)
2. Find next feature number (check specs/, branches)
3. Run: `.spectacular/scripts/powershell/create-new-feature.ps1 -Json`
4. Write simplified spec.md

**Output**: Branch name, spec file path

### Step 2: Plan (`/spectacular.2-plan`)

**Goal**: Generate technical implementation plan

1. Run: `.spectacular/scripts/powershell/setup-plan.ps1 -Json`
2. Write plan.md with tech stack and project structure

**Output**: Plan file path

### Step 3: Tasks (`/spectacular.3-tasks`)

**Goal**: Create actionable task list from spec and plan

1. Read spec.md and plan.md
2. Write tasks.md with checkbox format

**Output**: Tasks file path, task count

### Step 4: Implement (`/spectacular.4-implement`)

**Goal**: Execute each task

For each task in tasks.md:
1. Mark in_progress in TodoWrite
2. Execute the task
3. Mark complete in both TodoWrite AND tasks.md

### Step 5: Validate (`/spectacular.5-validate`)

**Goal**: Verify implementation is production-ready

Run validation checks:
1. Tasks: All marked [x] in tasks.md
2. Build: Run appropriate build command
3. Tests: Run appropriate test command

## Final Report

After all steps complete, report:
- Feature name and branch
- Files created/modified
- Validation status
'@

$spectacularQuickPath = Join-Path $ProjectPath ".claude/commands/spectacular.0-quick.md"
[System.IO.File]::WriteAllText($spectacularQuickPath, $spectacularQuickCommand)
Write-Success "Created: .claude/commands/spectacular.0-quick.md"

# spectacular.spec.md
$spectacularSpecCommand = @'
---
description: (1/5) Create feature branch and specification document.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Create a **simplified specification** for straightforward features. This is step 1 of the pipeline:

```
/spectacular.1-spec -> /spectacular.2-plan -> /spectacular.3-tasks -> /spectacular.4-implement -> /spectacular.5-validate
```

## Workflow

### 1. Generate Branch Name

- Extract 2-4 word short name from description
- Use action-noun format (e.g., "add-health-check", "fix-login-bug")

### 2. Find Next Feature Number

Check specs/ directories for highest existing number. Use N + 1.

### 3. Create Feature Directory

Run:
```powershell
.spectacular/scripts/powershell/create-new-feature.ps1 -Json -Number [N] -ShortName "[name]" "[description]"
```

### 4. Write Simplified Spec

Create `spec.md` with:
- Summary (1 paragraph)
- User story with acceptance criteria
- 3-5 requirements
- Success criteria

### 5. Report Completion

Output branch name, spec file path, and next step: `/spectacular.2-plan`
'@

$spectacularSpecPath = Join-Path $ProjectPath ".claude/commands/spectacular.1-spec.md"
[System.IO.File]::WriteAllText($spectacularSpecPath, $spectacularSpecCommand)
Write-Success "Created: .claude/commands/spectacular.1-spec.md"

# spectacular.plan.md
$spectacularPlanCommand = @'
---
description: (2/5) Generate technical implementation plan from spec.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Workflow

1. **Setup**: Run `.spectacular/scripts/powershell/setup-plan.ps1 -Json` and parse JSON for paths.

2. **Load context**: Read feature spec and constitution.

3. **Write plan.md**: Fill technical context, project structure, and architecture decisions.

4. **Report**: Output plan file path and suggest next step: `/spectacular.3-tasks`
'@

$spectacularPlanPath = Join-Path $ProjectPath ".claude/commands/spectacular.2-plan.md"
[System.IO.File]::WriteAllText($spectacularPlanPath, $spectacularPlanCommand)
Write-Success "Created: .claude/commands/spectacular.2-plan.md"

# spectacular.tasks.md
$spectacularTasksCommand = @'
---
description: (3/5) Generate actionable task list from spec and plan.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## CRITICAL REQUIREMENTS

⚠️ **This command MUST create the following structure:**

```
specs/<feature>/
├── tasks.md           # Index file with status table and links
└── tasks/             # Subdirectory containing individual task files
    ├── 01-setup.md
    ├── 02-implement.md
    └── ...
```

**FAILURE CRITERIA** - Your output is INVALID if:
- The `tasks/` subdirectory does not exist
- Individual task files are not created in `tasks/`
- `tasks.md` is just a flat checklist without links to task files

## Workflow

1. **Setup**: Run `.spectacular/scripts/powershell/check-prerequisites.ps1 -Json` and parse paths.

2. **Load design documents**: Read plan.md (required) and spec.md (required for user stories).

3. **Create tasks directory**:
   - Create `tasks/` subdirectory inside the feature folder
   - Example: If FEATURE_DIR is `specs/001-todo-app/`, create `specs/001-todo-app/tasks/`
   - Use: `mkdir -p "${FEATURE_DIR}/tasks"`

4. **Generate individual task files**:
   - For EACH task, create a SEPARATE `.md` file in the `tasks/` subdirectory
   - File naming: `NN-[short-name].md` (e.g., `01-html.md`, `02-css.md`)
   - Each file MUST follow the "Task File Structure" template below

5. **Generate tasks.md index**:
   - Create `tasks.md` in the feature folder (NOT in tasks/ subdirectory)
   - This is an INDEX file that LINKS to all task files in `tasks/`
   - Must include status table and task flow diagram
   - Must follow the "Index File (tasks.md)" template below

6. **Verify structure**: Confirm that:
   - `tasks/` subdirectory exists and contains `.md` files
   - `tasks.md` exists with links to files in `tasks/`

7. **Report**: Output tasks file path, task count, and next step: `/spectacular.4-implement`

## Task File Naming

Use short, descriptive names:
- `01-html.md` - NOT `task-01-create-html.md`
- `02-css.md` - NOT `task-02-add-styles.md`
- `03-state.md` - NOT `task-03-implement-state.md`

## Task File Structure

Each task file (`tasks/NN-name.md`):

```markdown
---
type: task
status: pending
phase: [setup|implementation|validation]
created: [DATE]
---

# Task NN: [Title]

## Navigation

- **Task List**: [tasks.md](../tasks.md)
- **Previous**: [NN-1-name](./NN-1-name.md) (if not first)
- **Next**: [NN+1-name](./NN+1-name.md) (if not last)

---

## Description

[What needs to be done]

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Files

- `path/to/file.ts` - [description]

## Implementation Notes

[Any relevant details from plan.md]

---

#task/[phase] #status/pending
```

## Index File (tasks.md)

```markdown
---
type: tasks
status: draft
created: [DATE]
---

# Tasks: [Feature Name]

**Branch**: `[branch-name]`

## Navigation

- **Previous**: [plan.md](./plan.md)
- **Next**: [validation.md](./validation.md) (after implementation)

---

## Task Flow

[Show workflow diagram with parallel branches using ASCII art]

**For sequential tasks:**
```
[01-html] → [02-css] → [03-state] → [04-render] → [05-validate]
```

**For parallel tasks (converging):**
```
[01-html] → [02-css] ─┐
                      ├→ [04-lists] → [05-todos] → [06-render] → [07-validate]
          [03-state] ─┘
```

---

## Phase 1: Setup

| Task | Description | Status |
|------|-------------|--------|
| [01-name](./tasks/01-name.md) | Description | #status/pending |

## Phase 2: Implementation

| Task | Description | Status |
|------|-------------|--------|
| [02-name](./tasks/02-name.md) | Description | #status/pending |

## Phase 3: Validation

| Task | Description | Status |
|------|-------------|--------|
| [NN-validate](./tasks/NN-validate.md) | Verify acceptance criteria | #status/pending |

---

## Progress Summary

| Phase | Total | Done | Remaining |
|-------|-------|------|-----------|
| Setup | X | 0 | X |
| Implementation | Y | 0 | Y |
| Validation | Z | 0 | Z |
| **Total** | **N** | **0** | **N** |

#status/draft
```

## Task Flow Diagram Rules

1. **Use short names in brackets**: `[01-html]` not `[task-01-create-html-structure]`
2. **Use arrows for sequence**: `→`
3. **Use ASCII art for parallel branches**:
   - `─┐` to start a parallel branch going down
   - `─┘` to end a parallel branch going up
   - `├→` for merge point continuing right

4. **Parallel tasks** are tasks that:
   - Modify different files
   - Have no dependencies on each other
   - Can be executed simultaneously

5. **Show dependencies visually**: Tasks that must complete before others converge at merge points
'@

$spectacularTasksPath = Join-Path $ProjectPath ".claude/commands/spectacular.3-tasks.md"
[System.IO.File]::WriteAllText($spectacularTasksPath, $spectacularTasksCommand)
Write-Success "Created: .claude/commands/spectacular.3-tasks.md"

# spectacular.implement.md
$spectacularImplementCommand = @'
---
description: (4/5) Execute all tasks defined in tasks.md one by one.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Workflow

1. Run `.spectacular/scripts/powershell/check-prerequisites.ps1 -Json -RequireTasks -IncludeTasks`

2. Load tasks.md and implementation context from plan.md

3. Execute tasks one by one:
   - Mark task in_progress in TodoWrite
   - Execute the task (create files, write code)
   - Mark complete in both TodoWrite AND tasks.md [x]
   - Move to next task

4. Rules:
   - One task at a time
   - Mark complete immediately after finishing
   - No placeholder or TODO code

5. Report: List of files created/modified

6. Suggest next step: `/spectacular.5-validate`
'@

$spectacularImplementPath = Join-Path $ProjectPath ".claude/commands/spectacular.4-implement.md"
[System.IO.File]::WriteAllText($spectacularImplementPath, $spectacularImplementCommand)
Write-Success "Created: .claude/commands/spectacular.4-implement.md"

# spectacular.validate.md
$spectacularValidateCommand = @'
---
description: (5/5) Validate implementation is complete - tasks, build, and tests pass.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Validate that a feature implementation is **production-ready**. This is the final step of the pipeline.

## Validation Checks

### 1. Task Completion Check

Read `tasks.md` and verify all tasks marked [x].

### 2. Build Check

Detect and run build command (npm, dotnet, cargo, go, etc.).

### 3. Test Check

Detect and run test command if available.

## Execution

Run:
```powershell
.spectacular/scripts/powershell/validate-implementation.ps1 -Json
```

## Output

Report pass/fail for each check. If all pass, feature is ready for production.
'@

$spectacularValidatePath = Join-Path $ProjectPath ".claude/commands/spectacular.5-validate.md"
[System.IO.File]::WriteAllText($spectacularValidatePath, $spectacularValidateCommand)
Write-Success "Created: .claude/commands/spectacular.5-validate.md"

# ============================================================================
# POWERSHELL SCRIPTS
# ============================================================================

# common.ps1
$commonPs1 = @'
#!/usr/bin/env pwsh
# Common PowerShell functions

function Get-RepoRoot {
    try {
        $result = git rev-parse --show-toplevel 2>$null
        if ($LASTEXITCODE -eq 0) {
            return $result
        }
    } catch {}
    return (Resolve-Path (Join-Path $PSScriptRoot "../../..")).Path
}

function Get-CurrentBranch {
    if ($env:SPECIFY_FEATURE) {
        return $env:SPECIFY_FEATURE
    }
    try {
        $result = git rev-parse --abbrev-ref HEAD 2>$null
        if ($LASTEXITCODE -eq 0) {
            return $result
        }
    } catch {}

    $repoRoot = Get-RepoRoot
    $specsDir = Join-Path $repoRoot "specs"

    if (Test-Path $specsDir) {
        $latestFeature = ""
        $highest = 0
        Get-ChildItem -Path $specsDir -Directory | ForEach-Object {
            if ($_.Name -match '^(\d{3})-') {
                $num = [int]$matches[1]
                if ($num -gt $highest) {
                    $highest = $num
                    $latestFeature = $_.Name
                }
            }
        }
        if ($latestFeature) { return $latestFeature }
    }
    return "main"
}

function Test-HasGit {
    try {
        git rev-parse --show-toplevel 2>$null | Out-Null
        return ($LASTEXITCODE -eq 0)
    } catch { return $false }
}

function Test-FeatureBranch {
    param([string]$Branch, [bool]$HasGit = $true)
    if (-not $HasGit) {
        Write-Warning "[specify] Warning: Git repository not detected; skipped branch validation"
        return $true
    }
    if ($Branch -notmatch '^[0-9]{3}-') {
        Write-Output "ERROR: Not on a feature branch. Current branch: $Branch"
        return $false
    }
    return $true
}

function Get-FeatureDir {
    param([string]$RepoRoot, [string]$Branch)
    Join-Path $RepoRoot "specs/$Branch"
}

function Get-FeaturePathsEnv {
    $repoRoot = Get-RepoRoot
    $currentBranch = Get-CurrentBranch
    $hasGit = Test-HasGit
    $featureDir = Get-FeatureDir -RepoRoot $repoRoot -Branch $currentBranch

    [PSCustomObject]@{
        REPO_ROOT      = $repoRoot
        CURRENT_BRANCH = $currentBranch
        HAS_GIT        = $hasGit
        FEATURE_DIR    = $featureDir
        FEATURE_SPEC   = Join-Path $featureDir 'spec.md'
        IMPL_PLAN      = Join-Path $featureDir 'plan.md'
        TASKS          = Join-Path $featureDir 'tasks.md'
        RESEARCH       = Join-Path $featureDir 'research.md'
        DATA_MODEL     = Join-Path $featureDir 'data-model.md'
        QUICKSTART     = Join-Path $featureDir 'quickstart.md'
        CONTRACTS_DIR  = Join-Path $featureDir 'contracts'
    }
}

function Test-FileExists {
    param([string]$Path, [string]$Description)
    if (Test-Path -Path $Path -PathType Leaf) {
        Write-Output "  [OK] $Description"
        return $true
    } else {
        Write-Output "  [--] $Description"
        return $false
    }
}

function Test-DirHasFiles {
    param([string]$Path, [string]$Description)
    if ((Test-Path -Path $Path -PathType Container) -and (Get-ChildItem -Path $Path -ErrorAction SilentlyContinue | Where-Object { -not $_.PSIsContainer } | Select-Object -First 1)) {
        Write-Output "  [OK] $Description"
        return $true
    } else {
        Write-Output "  [--] $Description"
        return $false
    }
}
'@

$commonPs1Path = Join-Path $ProjectPath ".spectacular/scripts/powershell/common.ps1"
Set-Content -Path $commonPs1Path -Value $commonPs1 -Encoding UTF8
Write-Success "Created: .spectacular/scripts/powershell/common.ps1"

# create-new-feature.ps1
$createNewFeaturePs1 = @'
#!/usr/bin/env pwsh
# Create a new feature
[CmdletBinding()]
param(
    [switch]$Json,
    [string]$ShortName,
    [int]$Number = 0,
    [switch]$Help,
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$FeatureDescription
)
$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Host "Usage: ./create-new-feature.ps1 [-Json] [-ShortName <name>] [-Number N] <feature description>"
    exit 0
}

if (-not $FeatureDescription -or $FeatureDescription.Count -eq 0) {
    Write-Error "Usage: ./create-new-feature.ps1 [-Json] [-ShortName <name>] <feature description>"
    exit 1
}

$featureDesc = ($FeatureDescription -join ' ').Trim()

function Find-RepositoryRoot {
    param([string]$StartDir, [string[]]$Markers = @('.git', '.spectacular'))
    $current = Resolve-Path $StartDir
    while ($true) {
        foreach ($marker in $Markers) {
            if (Test-Path (Join-Path $current $marker)) { return $current }
        }
        $parent = Split-Path $current -Parent
        if ($parent -eq $current) { return $null }
        $current = $parent
    }
}

function Get-HighestNumberFromSpecs {
    param([string]$SpecsDir)
    $highest = 0
    if (Test-Path $SpecsDir) {
        Get-ChildItem -Path $SpecsDir -Directory | ForEach-Object {
            if ($_.Name -match '^(\d+)') {
                $num = [int]$matches[1]
                if ($num -gt $highest) { $highest = $num }
            }
        }
    }
    return $highest
}

function Get-HighestNumberFromBranches {
    $highest = 0
    try {
        $branches = git branch -a 2>$null
        if ($LASTEXITCODE -eq 0) {
            foreach ($branch in $branches) {
                $cleanBranch = $branch.Trim() -replace '^\*?\s+', '' -replace '^remotes/[^/]+/', ''
                if ($cleanBranch -match '^(\d+)-') {
                    $num = [int]$matches[1]
                    if ($num -gt $highest) { $highest = $num }
                }
            }
        }
    } catch {}
    return $highest
}

function ConvertTo-CleanBranchName {
    param([string]$Name)
    return $Name.ToLower() -replace '[^a-z0-9]', '-' -replace '-{2,}', '-' -replace '^-', '' -replace '-$', ''
}

function Get-BranchName {
    param([string]$Description)
    $stopWords = @('i', 'a', 'an', 'the', 'to', 'for', 'of', 'in', 'on', 'at', 'by', 'with', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall', 'this', 'that', 'these', 'those', 'my', 'your', 'our', 'their', 'want', 'need', 'add', 'get', 'set')
    $cleanName = $Description.ToLower() -replace '[^a-z0-9\s]', ' '
    $words = $cleanName -split '\s+' | Where-Object { $_ }
    $meaningfulWords = @()
    foreach ($word in $words) {
        if ($stopWords -contains $word) { continue }
        if ($word.Length -ge 3) { $meaningfulWords += $word }
    }
    if ($meaningfulWords.Count -gt 0) {
        $maxWords = if ($meaningfulWords.Count -eq 4) { 4 } else { 3 }
        return ($meaningfulWords | Select-Object -First $maxWords) -join '-'
    } else {
        $result = ConvertTo-CleanBranchName -Name $Description
        return [string]::Join('-', (($result -split '-') | Where-Object { $_ } | Select-Object -First 3))
    }
}

$fallbackRoot = (Find-RepositoryRoot -StartDir $PSScriptRoot)
if (-not $fallbackRoot) {
    Write-Error "Error: Could not determine repository root."
    exit 1
}

try {
    $repoRoot = git rev-parse --show-toplevel 2>$null
    if ($LASTEXITCODE -eq 0) { $hasGit = $true } else { throw "Git not available" }
} catch {
    $repoRoot = $fallbackRoot
    $hasGit = $false
}

Set-Location $repoRoot

$specsDir = Join-Path $repoRoot 'specs'
New-Item -ItemType Directory -Path $specsDir -Force | Out-Null

if ($ShortName) {
    $branchSuffix = ConvertTo-CleanBranchName -Name $ShortName
} else {
    $branchSuffix = Get-BranchName -Description $featureDesc
}

if ($Number -eq 0) {
    if ($hasGit) {
        try { git fetch --all --prune 2>$null | Out-Null } catch {}
        $highestBranch = Get-HighestNumberFromBranches
        $highestSpec = Get-HighestNumberFromSpecs -SpecsDir $specsDir
        $Number = [Math]::Max($highestBranch, $highestSpec) + 1
    } else {
        $Number = (Get-HighestNumberFromSpecs -SpecsDir $specsDir) + 1
    }
}

$featureNum = ('{0:000}' -f $Number)
$branchName = "$featureNum-$branchSuffix"

if ($hasGit) {
    try { git checkout -b $branchName | Out-Null } catch { Write-Warning "Failed to create git branch: $branchName" }
} else {
    Write-Warning "[specify] Warning: Git repository not detected; skipped branch creation for $branchName"
}

$featureDir = Join-Path $specsDir $branchName
New-Item -ItemType Directory -Path $featureDir -Force | Out-Null

$template = Join-Path $repoRoot '.spectacular/templates/spec-template.md'
$specFile = Join-Path $featureDir 'spec.md'
if (Test-Path $template) {
    Copy-Item $template $specFile -Force
} else {
    New-Item -ItemType File -Path $specFile | Out-Null
}

$env:SPECIFY_FEATURE = $branchName

if ($Json) {
    [PSCustomObject]@{
        BRANCH_NAME = $branchName
        SPEC_FILE = $specFile
        FEATURE_NUM = $featureNum
        HAS_GIT = $hasGit
    } | ConvertTo-Json -Compress
} else {
    Write-Output "BRANCH_NAME: $branchName"
    Write-Output "SPEC_FILE: $specFile"
    Write-Output "FEATURE_NUM: $featureNum"
    Write-Output "HAS_GIT: $hasGit"
}
'@

$createNewFeaturePath = Join-Path $ProjectPath ".spectacular/scripts/powershell/create-new-feature.ps1"
Set-Content -Path $createNewFeaturePath -Value $createNewFeaturePs1 -Encoding UTF8
Write-Success "Created: .spectacular/scripts/powershell/create-new-feature.ps1"

# check-prerequisites.ps1
$checkPrerequisitesPs1 = @'
#!/usr/bin/env pwsh
# Consolidated prerequisite checking script
[CmdletBinding()]
param(
    [switch]$Json,
    [switch]$RequireTasks,
    [switch]$IncludeTasks,
    [switch]$PathsOnly,
    [switch]$Help
)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Output "Usage: check-prerequisites.ps1 [-Json] [-RequireTasks] [-IncludeTasks] [-PathsOnly]"
    exit 0
}

. "$PSScriptRoot/common.ps1"

$paths = Get-FeaturePathsEnv

if (-not (Test-FeatureBranch -Branch $paths.CURRENT_BRANCH -HasGit:$paths.HAS_GIT)) { exit 1 }

if ($PathsOnly) {
    if ($Json) {
        [PSCustomObject]@{
            REPO_ROOT    = $paths.REPO_ROOT
            BRANCH       = $paths.CURRENT_BRANCH
            FEATURE_DIR  = $paths.FEATURE_DIR
            FEATURE_SPEC = $paths.FEATURE_SPEC
            IMPL_PLAN    = $paths.IMPL_PLAN
            TASKS        = $paths.TASKS
        } | ConvertTo-Json -Compress
    } else {
        Write-Output "REPO_ROOT: $($paths.REPO_ROOT)"
        Write-Output "BRANCH: $($paths.CURRENT_BRANCH)"
        Write-Output "FEATURE_DIR: $($paths.FEATURE_DIR)"
    }
    exit 0
}

if (-not (Test-Path $paths.FEATURE_DIR -PathType Container)) {
    Write-Output "ERROR: Feature directory not found: $($paths.FEATURE_DIR)"
    Write-Output "Run /spectacular.1-spec first to create the feature structure."
    exit 1
}

if (-not (Test-Path $paths.IMPL_PLAN -PathType Leaf)) {
    Write-Output "ERROR: plan.md not found in $($paths.FEATURE_DIR)"
    Write-Output "Run /spectacular.2-plan first to create the implementation plan."
    exit 1
}

if ($RequireTasks -and -not (Test-Path $paths.TASKS -PathType Leaf)) {
    Write-Output "ERROR: tasks.md not found in $($paths.FEATURE_DIR)"
    Write-Output "Run /spectacular.3-tasks first to create the task list."
    exit 1
}

$docs = @()
if (Test-Path $paths.RESEARCH) { $docs += 'research.md' }
if (Test-Path $paths.DATA_MODEL) { $docs += 'data-model.md' }
if ((Test-Path $paths.CONTRACTS_DIR) -and (Get-ChildItem -Path $paths.CONTRACTS_DIR -ErrorAction SilentlyContinue | Select-Object -First 1)) { $docs += 'contracts/' }
if (Test-Path $paths.QUICKSTART) { $docs += 'quickstart.md' }
if ($IncludeTasks -and (Test-Path $paths.TASKS)) { $docs += 'tasks.md' }

if ($Json) {
    [PSCustomObject]@{
        FEATURE_DIR = $paths.FEATURE_DIR
        AVAILABLE_DOCS = $docs
    } | ConvertTo-Json -Compress
} else {
    Write-Output "FEATURE_DIR:$($paths.FEATURE_DIR)"
    Write-Output "AVAILABLE_DOCS: $($docs -join ', ')"
}
'@

$checkPrerequisitesPath = Join-Path $ProjectPath ".spectacular/scripts/powershell/check-prerequisites.ps1"
Set-Content -Path $checkPrerequisitesPath -Value $checkPrerequisitesPs1 -Encoding UTF8
Write-Success "Created: .spectacular/scripts/powershell/check-prerequisites.ps1"

# setup-plan.ps1
$setupPlanPs1 = @'
#!/usr/bin/env pwsh
# Setup implementation plan for a feature
[CmdletBinding()]
param([switch]$Json, [switch]$Help)

$ErrorActionPreference = 'Stop'

if ($Help) {
    Write-Output "Usage: ./setup-plan.ps1 [-Json]"
    exit 0
}

. "$PSScriptRoot/common.ps1"

$paths = Get-FeaturePathsEnv

if (-not (Test-FeatureBranch -Branch $paths.CURRENT_BRANCH -HasGit $paths.HAS_GIT)) { exit 1 }

New-Item -ItemType Directory -Path $paths.FEATURE_DIR -Force | Out-Null

$template = Join-Path $paths.REPO_ROOT '.spectacular/templates/plan-template.md'
if (Test-Path $template) {
    Copy-Item $template $paths.IMPL_PLAN -Force
} else {
    New-Item -ItemType File -Path $paths.IMPL_PLAN -Force | Out-Null
}

if ($Json) {
    [PSCustomObject]@{
        FEATURE_SPEC = $paths.FEATURE_SPEC
        IMPL_PLAN = $paths.IMPL_PLAN
        SPECS_DIR = $paths.FEATURE_DIR
        BRANCH = $paths.CURRENT_BRANCH
        HAS_GIT = $paths.HAS_GIT
    } | ConvertTo-Json -Compress
} else {
    Write-Output "FEATURE_SPEC: $($paths.FEATURE_SPEC)"
    Write-Output "IMPL_PLAN: $($paths.IMPL_PLAN)"
    Write-Output "SPECS_DIR: $($paths.FEATURE_DIR)"
    Write-Output "BRANCH: $($paths.CURRENT_BRANCH)"
}
'@

$setupPlanPath = Join-Path $ProjectPath ".spectacular/scripts/powershell/setup-plan.ps1"
Set-Content -Path $setupPlanPath -Value $setupPlanPs1 -Encoding UTF8
Write-Success "Created: .spectacular/scripts/powershell/setup-plan.ps1"

# validate-implementation.ps1
$validateImplementationPs1 = @'
#!/usr/bin/env pwsh
# Validate implementation completeness
param(
    [switch]$Json,
    [switch]$SkipTests,
    [switch]$SkipBuild,
    [switch]$RequireClean
)

. "$PSScriptRoot\common.ps1"

$result = @{
    success = $true
    checks = @{
        tasks = @{ status = "pending"; message = "" }
        build = @{ status = "pending"; message = "" }
        tests = @{ status = "pending"; message = "" }
        git = @{ status = "pending"; message = "" }
    }
    summary = ""
}

$paths = Get-FeaturePathsEnv
$repoRoot = $paths.REPO_ROOT
$tasksFile = $paths.TASKS

# Check 1: Tasks
if (Test-Path $tasksFile) {
    $tasksContent = Get-Content $tasksFile -Raw
    $incomplete = [regex]::Matches($tasksContent, '- \[ \]').Count
    $complete = [regex]::Matches($tasksContent, '- \[x\]', 'IgnoreCase').Count
    $total = $incomplete + $complete

    if ($incomplete -eq 0 -and $total -gt 0) {
        $result.checks.tasks.status = "pass"
        $result.checks.tasks.message = "All $total tasks complete"
    } elseif ($total -eq 0) {
        $result.checks.tasks.status = "warn"
        $result.checks.tasks.message = "No tasks found"
    } else {
        $result.checks.tasks.status = "fail"
        $result.checks.tasks.message = "$incomplete of $total tasks incomplete"
        $result.success = $false
    }
} else {
    $result.checks.tasks.status = "skip"
    $result.checks.tasks.message = "No tasks.md file found"
}

# Check 2: Build
if (-not $SkipBuild) {
    $buildCmd = $null
    if (Test-Path "$repoRoot\package.json") { $buildCmd = "npm"; $buildArgs = @("run", "build") }
    elseif (Test-Path "$repoRoot\*.csproj") { $buildCmd = "dotnet"; $buildArgs = @("build") }
    elseif (Test-Path "$repoRoot\Cargo.toml") { $buildCmd = "cargo"; $buildArgs = @("build") }
    elseif (Test-Path "$repoRoot\go.mod") { $buildCmd = "go"; $buildArgs = @("build", "./...") }

    if ($buildCmd) {
        try {
            Push-Location $repoRoot
            & $buildCmd $buildArgs 2>&1 | Out-Null
            $buildExitCode = $LASTEXITCODE
            Pop-Location
            if ($buildExitCode -eq 0) {
                $result.checks.build.status = "pass"
                $result.checks.build.message = "Build successful ($buildCmd)"
            } else {
                $result.checks.build.status = "fail"
                $result.checks.build.message = "Build failed"
                $result.success = $false
            }
        } catch {
            $result.checks.build.status = "fail"
            $result.checks.build.message = "Build error: $_"
            $result.success = $false
        }
    } else {
        $result.checks.build.status = "skip"
        $result.checks.build.message = "No build system found"
    }
} else {
    $result.checks.build.status = "skip"
    $result.checks.build.message = "Skipped"
}

# Check 3: Tests
if (-not $SkipTests) {
    $testCmd = $null
    if (Test-Path "$repoRoot\package.json") {
        $pkg = Get-Content "$repoRoot\package.json" | ConvertFrom-Json
        if ($pkg.scripts.test) { $testCmd = "npm"; $testArgs = @("test") }
    }
    elseif (Test-Path "$repoRoot\*.csproj") { $testCmd = "dotnet"; $testArgs = @("test") }

    if ($testCmd) {
        try {
            Push-Location $repoRoot
            & $testCmd $testArgs 2>&1 | Out-Null
            $testExitCode = $LASTEXITCODE
            Pop-Location
            if ($testExitCode -eq 0) {
                $result.checks.tests.status = "pass"
                $result.checks.tests.message = "Tests passed ($testCmd)"
            } else {
                $result.checks.tests.status = "fail"
                $result.checks.tests.message = "Tests failed"
                $result.success = $false
            }
        } catch {
            $result.checks.tests.status = "fail"
            $result.checks.tests.message = "Test error: $_"
            $result.success = $false
        }
    } else {
        $result.checks.tests.status = "skip"
        $result.checks.tests.message = "No test system found"
    }
} else {
    $result.checks.tests.status = "skip"
    $result.checks.tests.message = "Skipped"
}

# Check 4: Git
if ($RequireClean -and (Test-HasGit)) {
    Push-Location $repoRoot
    $gitStatus = git status --porcelain 2>&1
    Pop-Location
    if ([string]::IsNullOrWhiteSpace($gitStatus)) {
        $result.checks.git.status = "pass"
        $result.checks.git.message = "Working directory clean"
    } else {
        $result.checks.git.status = "fail"
        $result.checks.git.message = "Uncommitted changes"
        $result.success = $false
    }
} else {
    $result.checks.git.status = "skip"
    $result.checks.git.message = "Clean check not required"
}

# Summary
$passCount = ($result.checks.Values | Where-Object { $_.status -eq "pass" }).Count
$failCount = ($result.checks.Values | Where-Object { $_.status -eq "fail" }).Count
$skipCount = ($result.checks.Values | Where-Object { $_.status -eq "skip" }).Count

if ($result.success) {
    $result.summary = "READY: $passCount passed, $skipCount skipped"
} else {
    $result.summary = "NOT READY: $failCount failed, $passCount passed"
}

if ($Json) {
    $result | ConvertTo-Json -Depth 10
} else {
    Write-Host "`n=== Validation Results ===" -ForegroundColor Cyan
    foreach ($check in $result.checks.GetEnumerator()) {
        $name = $check.Key.PadRight(10)
        $status = $check.Value.status
        $message = $check.Value.message
        switch ($status) {
            "pass" { Write-Host "  $name [PASS] $message" -ForegroundColor Green }
            "fail" { Write-Host "  $name [FAIL] $message" -ForegroundColor Red }
            "warn" { Write-Host "  $name [WARN] $message" -ForegroundColor Yellow }
            "skip" { Write-Host "  $name [SKIP] $message" -ForegroundColor Gray }
        }
    }
    Write-Host ""
    if ($result.success) { Write-Host $result.summary -ForegroundColor Green }
    else { Write-Host $result.summary -ForegroundColor Red }
}

if (-not $result.success) { exit 1 }
'@

$validateImplementationPath = Join-Path $ProjectPath ".spectacular/scripts/powershell/validate-implementation.ps1"
Set-Content -Path $validateImplementationPath -Value $validateImplementationPs1 -Encoding UTF8
Write-Success "Created: .spectacular/scripts/powershell/validate-implementation.ps1"

# ============================================================================
# TEMPLATES
# ============================================================================

# spec-template.md
$specTemplate = @'
# Feature Specification: [FEATURE NAME]

**Feature Branch**: `[###-feature-name]`
**Created**: [DATE]
**Status**: Draft

## Summary

[One paragraph describing what this feature does and why]

## User Story

**As a** [user type]
**I want** [goal]
**So that** [benefit]

### Acceptance Criteria

1. Given [context], when [action], then [result]
2. Given [context], when [action], then [result]

## Requirements

- REQ-1: [First requirement - must be testable]
- REQ-2: [Second requirement]
- REQ-3: [Third requirement]

## Success Criteria

- [Measurable outcome 1]
- [Measurable outcome 2]

## Notes

- [Any assumptions or constraints]
'@

$specTemplatePath = Join-Path $ProjectPath ".spectacular/templates/spec-template.md"
Set-Content -Path $specTemplatePath -Value $specTemplate -Encoding UTF8
Write-Success "Created: .spectacular/templates/spec-template.md"

# plan-template.md
$planTemplate = @'
# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE]

## Summary

[Brief description of technical approach]

## Technical Context

**Language/Version**: [e.g., Python 3.11, C# 12]
**Primary Dependencies**: [e.g., FastAPI, ASP.NET Core]
**Storage**: [e.g., PostgreSQL, SQL Server]
**Testing**: [e.g., pytest, xUnit]

## Project Structure

```text
src/
+-- models/
+-- services/
+-- api/
tests/
```

## Key Components

- [Component 1]: [Purpose]
- [Component 2]: [Purpose]
'@

$planTemplatePath = Join-Path $ProjectPath ".spectacular/templates/plan-template.md"
Set-Content -Path $planTemplatePath -Value $planTemplate -Encoding UTF8
Write-Success "Created: .spectacular/templates/plan-template.md"

# tasks-template.md
$tasksTemplate = @'
# Tasks: [FEATURE NAME]

**Branch**: [###-feature-name]
**Created**: [DATE]

## Setup

- [ ] T001 Create project structure
- [ ] T002 Install dependencies

## Implementation

- [ ] T003 Create data models in src/models/
- [ ] T004 Implement service in src/services/
- [ ] T005 Add API endpoint in src/api/

## Validation

- [ ] T006 Build succeeds
- [ ] T007 Tests pass
- [ ] T008 Manual testing complete
'@

$tasksTemplatePath = Join-Path $ProjectPath ".spectacular/templates/tasks-template.md"
Set-Content -Path $tasksTemplatePath -Value $tasksTemplate -Encoding UTF8
Write-Success "Created: .spectacular/templates/tasks-template.md"

# constitution.md
$constitutionMd = @"
# $ProjectName Constitution

## Core Principles

### I. Task Completion is Non-Negotiable

Every task must be verifiably complete before marking done:
- Build must succeed without errors
- Tests must pass (if tests exist)
- Task status synced in both tasks.md AND TodoWrite

### II. Simple Steps Over Complex Workflows

Prefer straightforward approaches:
- Use ``/spectacular.0-quick`` for simple features
- Task format should be plain checkboxes
- Each step should be independently verifiable

### III. Validation Before Completion

No feature is "done" until validated:
- Run ``validate-implementation.ps1`` before marking complete
- Build + Test + Task completion = minimum bar

### IV. Production-Ready Defaults

Every implementation targets production:
- No placeholder or TODO code in completed tasks
- Error handling included by default
- Security considerations addressed

## Tech Stack

$($TechStack -split ',' | ForEach-Object { "- $($_.Trim())" } | Out-String)

**Version**: 1.0.0 | **Ratified**: $(Get-Date -Format "yyyy-MM-dd")
"@

$constitutionPath = Join-Path $ProjectPath ".spectacular/memory/constitution.md"
Set-Content -Path $constitutionPath -Value $constitutionMd -Encoding UTF8
Write-Success "Created: .spectacular/memory/constitution.md"

# ============================================================================
# CLAUDE.md
# ============================================================================

$claudeMd = @"
# $ProjectName

## Overview

Task planning project using Markdown notes with SpecTacular workflow.

## Tech Stack

$($TechStack -split ',' | ForEach-Object { "- $($_.Trim())" } | Out-String)

---

## Quick Start - SpecTacular Pipeline

``````
/spectacular.1-spec -> /spectacular.2-plan -> /spectacular.3-tasks -> /spectacular.4-implement -> /spectacular.5-validate
``````

### Run All Steps at Once

``````
/spectacular.0-quick add a health check endpoint
``````

### Run Steps Individually

``````
/spectacular.1-spec add a health check endpoint    # Step 1: Create spec
/spectacular.2-plan                                 # Step 2: Generate plan
/spectacular.3-tasks                                # Step 3: Create task list
/spectacular.4-implement                            # Step 4: Execute tasks
/spectacular.5-validate                             # Step 5: Verify complete
``````

---

## All Commands

### SpecTacular Pipeline (Feature Development)

| Step | Command | Purpose |
|------|---------|---------|
| 0 | ``/spectacular.0-quick <description>`` | Run steps 1-5 in sequence |
| 1 | ``/spectacular.1-spec <description>`` | Create branch + simplified spec |
| 2 | ``/spectacular.2-plan`` | Generate technical plan |
| 3 | ``/spectacular.3-tasks`` | Create task list |
| 4 | ``/spectacular.4-implement`` | Execute tasks one by one |
| 5 | ``/spectacular.5-validate`` | Verify build + tests pass |

### Dashboard & Tools

| Command | Description |
|---------|-------------|
| ``/spectacular.dashboard`` | Launch SpecTacular Dashboard (spec viewer) |
| ``/spectacular.notes`` | Open Task planner (edit/review task notes) |

---

## Structure

``````
.claude/
+-- tasks/           # Task notes (wikilink graph)
|   +-- index.md     # Main entry point
|   +-- backlog.md   # Prioritized backlog
|   +-- decisions.md # Architecture decisions
+-- commands/        # Slash command definitions
    +-- spectacular.*.md

.spectacular/
+-- dashboard/               # SpecTacular Dashboard app
+-- memory/constitution.md   # Non-negotiable principles
+-- scripts/powershell/      # Automation scripts
+-- templates/               # Document templates

specs/<###-feature-name>/    # Per-feature artifacts
+-- spec.md                  # What to build
+-- plan.md                  # How to build it
+-- tasks.md                 # Step-by-step tasks
``````

---

## Core Principles (from Constitution)

1. **Task Completion is Non-Negotiable** - Build must pass, tests must pass
2. **Simple Steps Over Complex Workflows** - Use pipeline commands when possible
3. **Validation Before Completion** - Always run ``/spectacular.5-validate``
4. **Production-Ready Defaults** - No placeholder code in completed work
"@

$claudeMdPath = Join-Path $ProjectPath "CLAUDE.md"
Set-Content -Path $claudeMdPath -Value $claudeMd -Encoding UTF8
Write-Success "Created: CLAUDE.md"

Write-Host "`n=== Setup Complete ===" -ForegroundColor Green
Write-Host @"

Next steps:
1. Open project in VS Code
2. Run: /spectacular.dashboard     (Launch spec viewer)
3. Run: /spectacular.0-quick <feature description>

Files created:
- .claude/tasks/              (Task notes)
- .claude/commands/           (Slash commands: spectacular.*)
- .spectacular/dashboard/     (SpecTacular Dashboard app)
- .spectacular/scripts/       (Automation scripts)
- .spectacular/templates/     (Document templates)
- .spectacular/memory/        (Constitution)
- specs/                      (Feature artifacts)
- CLAUDE.md

"@ -ForegroundColor Cyan

# Self-delete this setup script
$scriptPath = $MyInvocation.MyCommand.Path
if ($scriptPath) {
    Remove-Item -Path $scriptPath -Force
    Write-Info "Setup script removed: $scriptPath"
}
