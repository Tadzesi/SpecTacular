# SpecTacular

![SpecTacular Dashboard](images/SpecTacular.png)

A markdown specification viewer - an Electron desktop application for previewing and monitoring markdown specification files with real-time filesystem watching.

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

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/spectacular.git
cd spectacular

# Install dependencies
cd spectacular-dashboard
npm install

# Run in development mode
npm run dev
```

### Build for Production

```bash
# Full build with installer
npm run build

# The installer will be created at:
# release/SpecTacular Setup 1.0.0.exe (Windows)
```

## Usage

1. **Launch SpecTacular** - Run the application
2. **Open a folder** - Select a directory containing your markdown specs
3. **Browse files** - Use the sidebar file tree to navigate
4. **Click wikilinks** - `[[document-name]]` links navigate between files
5. **Track status** - Status tags like `#status/done` display as visual icons

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
├── spectacular-dashboard/    # Main Electron + React application
│   ├── electron/            # Main process (IPC, file watching)
│   ├── src/                 # React renderer
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── contexts/        # Theme context
│   └── release/             # Built installers
├── .spectacular/            # Configuration and templates
│   ├── examples/            # Example spec files
│   └── templates/           # Document templates
└── images/                  # Project images
```

## Recommended Spec Structure

Organize your specifications in feature folders:

```
specs/
├── 001-user-authentication/
│   ├── spec.md              # Feature specification
│   ├── plan.md              # Implementation plan
│   ├── tasks.md             # Task checklist with status
│   └── task-01-setup.md     # Individual task details
├── 002-dashboard-ui/
│   └── ...
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

- **Frontend**: React 18 + TypeScript + Vite
- **Desktop**: Electron 28
- **Styling**: Tailwind CSS
- **File Watching**: chokidar
- **Markdown**: react-markdown + remark-gfm

## Development

```bash
# Development with hot reload
npm run dev

# Run tests
npm run test

# Lint code
npm run lint

# Build only Vite (no Electron)
npm run build:vite
```

## License

MIT
