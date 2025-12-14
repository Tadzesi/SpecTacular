# SpecTacular

![SpecTacular Dashboard](images/ArchitectureOfSpecTacular.jpeg)

A specification-driven development toolkit with a VS Code extension for previewing and monitoring markdown specification files with real-time filesystem watching.

## Why SpecTacular?

Managing software specifications across multiple markdown files can be challenging:

- **Fragmented documentation** - Specs, plans, and tasks spread across many files
- **No visual hierarchy** - Plain text editors don't show document relationships
- **Manual navigation** - Jumping between linked files is tedious
- **No status visibility** - Task completion states buried in text

SpecTacular solves these problems by providing:

- **Unified file tree** - Browse all spec files in a navigable sidebar
- **Real-time watching** - Files update automatically when changed on disk
- **Wikilink navigation** - Click `[[links]]` to jump between documents
- **Visual status tags** - `#status/done`, `#status/pending` render as colored icons
- **Dark/light themes** - Comfortable viewing in any environment
- **Syntax highlighting** - Code blocks with language-aware formatting

## What's New in v1.6.3

### Bug Fixes

- **Fixed Markdown Nested List Rendering** - Sub-items (1.1., 1.2., etc.) now render correctly in both VS Code preview and SpecTacular Dashboard
- **Fixed Ordered List Numbers** - List numbers now display properly in the Dashboard viewer
- **Updated CLI Templates** - All templates now use proper markdown nested list syntax (`- 1.1.` instead of `1.1.`)
- **Updated AI Prompts** - Formatting instructions updated to generate correctly formatted markdown

### Template Changes

Templates now generate sub-items with `-` prefix for proper markdown rendering:
```markdown
1. Main step
   - 1.1. Sub-step (renders correctly)
   - 1.2. Another sub-step
```

---

## What's New in v1.6.0

### VS Code Extension

- **WYSIWYG Markdown Editor** - Rich text editing with TipTap:
  - Toolbar with formatting buttons (bold, italic, headings, lists)
  - Table support with resizing
  - Task list checkboxes
  - Status tags and wikilinks preserved
  - YAML frontmatter handling

- **Automatic Task Status Management**:
  - Monitors task files for changes
  - Auto-updates status to "done" when all acceptance criteria checked
  - Updates main `tasks.md` table automatically
  - Status bar notifications

- **Version Check & Update Notification**:
  - Checks GitHub for latest releases
  - Shows notification when updates available
  - Version badge in header with update button

### CLI

- **Improved Task Status Tracking** - Pipeline commands now properly update:
  - Status tags in `tasks.md` table (`#status/pending` → `#status/done`)
  - YAML frontmatter in task files (`status: pending` → `status: done`)
  - Acceptance criteria checkboxes (`- [ ]` → `- [x]`)

## Quick Start

### Step 1: Install the CLI

**One-liner installation (PowerShell):**

```powershell
irm https://raw.githubusercontent.com/Tadzesi/SpecTacular/master/spectacular-cli/installer/install.ps1 | iex
```

**Verify installation:**

```bash
spectacular --version
```

### Step 2: Install VS Code Extension

The SpecTacular Dashboard is available as a VS Code extension (VSIX file).

**Download:** [spectacular-dashboard-1.6.3.vsix](https://github.com/Tadzesi/SpecTacular/releases/download/v1.6.3/spectacular-dashboard-1.6.3.vsix)

**Installation:**

1. Download the VSIX file from the link above
2. Open VS Code and press `Ctrl+Shift+X` (Extensions)
3. Click the `...` menu (top-right) → **Install from VSIX...**
4. Select the downloaded `.vsix` file

**Or via command line:**
```bash
# Download and install
curl -L -o spectacular-dashboard.vsix https://github.com/Tadzesi/SpecTacular/releases/download/v1.6.3/spectacular-dashboard-1.6.3.vsix
code --install-extension spectacular-dashboard.vsix
```

### Step 3: Initialize Your Project

```bash
cd your-project
spectacular init --name "MyProject" --tech "Node.js, TypeScript"
```

This creates:
- `.spectacular/` - Templates, scripts, and configuration
- `.claude/commands/` - AI workflow slash commands
- `specs/` - Directory for feature specifications
- `CLAUDE.md` - Project instructions for Claude Code

### Step 4: Use the Dashboard

1. Click the **SpecTacular icon** in VS Code's Activity Bar (left sidebar)
2. Click **"Open Dashboard"** to view your specs
3. Browse files using VS Code's explorer or the Specs Tree view
4. Click `[[wikilinks]]` to navigate between documents
5. View status tags like `#status/done` as visual icons

## CLI Reference

### Commands

```bash
spectacular init      # Initialize SpecTacular in current directory
spectacular dashboard # Show VS Code extension info
spectacular --version # Show version
spectacular --help    # Show help
spectacular update    # Update to latest version
```

### Options

```bash
spectacular init --name "ProjectName"     # Set project name
spectacular init --tech "Python, FastAPI" # Set tech stack
spectacular init --path /other/folder     # Initialize different directory
spectacular init --force                  # Overwrite existing files
```

### Build from Source

```powershell
git clone https://github.com/Tadzesi/SpecTacular.git
cd SpecTacular/spectacular-cli/Spectacular.Cli
dotnet publish -c Release -r win-x64 -o ../publish/win-x64
cd ../installer
.\install.ps1 -Local
```

### Uninstall

```powershell
~/.spectacular/bin/uninstall.ps1
```

## Markdown Features

### Status Tags

Visual indicators for task and feature status:

| Tag | Display | Use For |
|-----|---------|---------|
| `#status/done` | Green checkmark | Completed tasks |
| `#status/complete` | Green checkmark | Finished features |
| `#status/pending` | Gray circle | Not started |
| `#status/in-progress` | Blue half-circle | Currently working |
| `#status/blocked` | Red X | Blocked items |
| `#status/skipped` | Gray arrow | Intentionally skipped |

### Wikilinks

Link between documents using double brackets:

```markdown
See the [[implementation-plan]] for details.
Related: [[task-01-setup]], [[task-02-implement]]
```

### Task Links

Links matching `task-\d+` patterns show a copy button on hover for easy reference.

## Project Structure

```
spectacular/
├── spectacular-cli/          # .NET CLI tool for scaffolding
│   ├── Spectacular.Cli/      # Main CLI project
│   └── installer/            # Installation scripts
├── spectacular-vscode/       # VS Code extension
│   ├── src/                  # Extension host code
│   └── webview/              # React webview (dashboard UI)
│       ├── src/components/   # UI components
│       ├── src/hooks/        # Custom React hooks
│       └── src/contexts/     # Theme context
├── .spectacular/             # Configuration and templates
│   ├── examples/             # Example spec files
│   └── templates/            # Document templates
└── images/                   # Project images
```

## Recommended Spec Structure

Organize your specifications in feature folders:

```
specs/
├── 001-user-authentication/
│   ├── spec.md              # Feature specification
│   ├── plan.md              # Implementation plan
│   ├── tasks.md             # Task checklist with status
│   └── tasks/
│       ├── 01-setup.md      # Individual task details
│       └── 02-implement.md
├── 002-dashboard-ui/
│   └── ...
```

## Specification Documents

The pipeline generates structured markdown documents that work together:

### spec.md - Feature Specification

Defines **what** to build:

```markdown
# Feature Specification: User Authentication

## Summary
One paragraph describing the feature and its purpose.

## User Story
**As a** user
**I want** to log in with my credentials
**So that** I can access my personal dashboard

### Acceptance Criteria
1. Given valid credentials, when I submit, then I am logged in
2. Given invalid credentials, when I submit, then I see an error

## Requirements
- REQ-1: Support email/password authentication
- REQ-2: Passwords must be hashed with bcrypt
- REQ-3: Session expires after 24 hours

## Success Criteria
- All acceptance criteria pass
- No security vulnerabilities
```

### plan.md - Implementation Plan

Defines **how** to build it:

```markdown
# Implementation Plan: User Authentication

## Technical Context
**Language**: TypeScript 5.0
**Framework**: Express.js
**Database**: PostgreSQL
**Testing**: Jest

## Project Structure
src/
├── models/User.ts
├── services/AuthService.ts
├── controllers/AuthController.ts
└── middleware/authMiddleware.ts

## Key Components
- **AuthService**: Handles credential validation and session management
- **AuthController**: Express route handlers for /login, /logout
- **authMiddleware**: JWT token verification
```

### tasks.md - Task Checklist

Tracks **progress** with status tags:

```markdown
# Tasks: User Authentication

## Phase 1: Setup
| Task | Description | Status |
|------|-------------|--------|
| [[01-setup]] | Create project structure | #status/done |
| [[02-models]] | Define User model | #status/in-progress |

## Phase 2: Implementation
| Task | Description | Status |
|------|-------------|--------|
| [[03-service]] | Implement AuthService | #status/pending |
| [[04-controller]] | Add API endpoints | #status/pending |

## Progress Summary
| Phase | Total | Done | Remaining |
|-------|-------|------|-----------|
| Setup | 2 | 1 | 1 |
| Implementation | 2 | 0 | 2 |
```

### Individual Task Files

Detailed instructions for each task:

```markdown
# Task 01: Project Setup

## Objective
Create the initial project structure and install dependencies.

## Steps
1. Initialize npm project
2. Install dependencies: express, bcrypt, jsonwebtoken
3. Create directory structure

## Acceptance Criteria
- [ ] package.json exists with dependencies
- [ ] Directory structure matches plan.md

## Notes
- Use exact versions for reproducibility
```

## AI-Assisted Workflow Commands

SpecTacular includes workflow commands for AI coding assistants (Claude Code, Cursor) that automate the spec-to-implementation pipeline.

### Available Commands

| Command | Description |
|---------|-------------|
| `0-quick` | Full pipeline: spec → plan → tasks → implement → validate |
| `1-spec` | Create feature branch and specification document |
| `2-plan` | Generate technical implementation plan |
| `3-tasks` | Create actionable task list from spec and plan |
| `4-implement` | Execute tasks one by one |
| `5-validate` | Verify build passes and all tasks complete |

### Using with Claude Code

Commands are stored in `.claude/commands/` and invoked with slash commands:

```bash
# Run the full pipeline
/spectacular.0-quick Add user authentication with OAuth

# Or run individual steps
/spectacular.1-spec Add dark mode toggle
/spectacular.2-plan
/spectacular.3-tasks
/spectacular.4-implement
/spectacular.5-validate
```

### Using with Cursor

Commands are stored in `.cursor/rules/` as `.mdc` files. Reference them in chat:

```
@spectacular-0-quick Add user authentication with OAuth

# Or individual steps
@spectacular-1-spec Add dark mode toggle
@spectacular-2-plan
```

### Pipeline Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌───────────┐     ┌──────────┐
│ 1-spec  │ ──► │ 2-plan  │ ──► │ 3-tasks │ ──► │4-implement│ ──► │5-validate│
└─────────┘     └─────────┘     └─────────┘     └───────────┘     └──────────┘
     │               │               │                │                 │
     ▼               ▼               ▼                ▼                 ▼
  spec.md        plan.md        tasks.md         Code changes      Build + Tests
  + branch                      + status tags
```

### Command Files Location

```
.claude/commands/           # Claude Code slash commands
├── spectacular.0-quick.md
├── spectacular.1-spec.md
├── spectacular.2-plan.md
├── spectacular.3-tasks.md
├── spectacular.4-implement.md
└── spectacular.5-validate.md

.cursor/rules/              # Cursor rule files
├── spectacular-0-quick.mdc
├── spectacular-1-spec.mdc
├── spectacular-2-plan.mdc
├── spectacular-3-tasks.mdc
├── spectacular-4-implement.mdc
└── spectacular-5-validate.mdc

.spectacular/prompts/       # Source prompts (used to generate above)
├── 0-quick.md
├── 1-spec.md
└── ...
```

### Generating Commands

Use the PowerShell script to regenerate commands from source prompts:

```powershell
.spectacular/scripts/powershell/generate-commands.ps1
```

This copies prompts to both `.claude/commands/` and `.cursor/rules/` with appropriate formatting.

## Tech Stack

- **CLI**: .NET 8 (C#)
- **VS Code Extension**: TypeScript + VS Code Extension API
- **Dashboard Webview**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Markdown**: react-markdown + remark-gfm

## Development

### CLI

```bash
cd spectacular-cli/Spectacular.Cli
dotnet build                    # Build CLI
dotnet test                     # Run tests
dotnet publish -c Release -r win-x64 -o ../publish/win-x64  # Publish
```

### VS Code Extension

```bash
cd spectacular-vscode
npm install
npm run dev        # Development mode with hot reload
npm run compile    # Build extension
npm run package    # Create VSIX installer
```

## License

MIT
