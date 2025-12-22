# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.6.1] - 2025-12-13

### Added

- **Architecture Documentation** - Comprehensive `ARCHITECTURE.md` file for NotebookLM schema generation:
  - Complete system overview with Mermaid diagrams
  - CLI and VS Code extension component documentation
  - Message protocol specification between extension and webview
  - Data flow diagrams for all major operations
  - Technology stack reference
  - Key files reference with dependencies
  - Configuration reference
  - Diagram index for quick navigation

### Fixed

- Synchronized version numbers across all components (CLI, VS Code extension, CLAUDE.md)

## [1.6.0] - 2025-12-13

### Added

- **WYSIWYG Markdown Editor** - New rich text editor in VS Code extension:
  - TipTap-based editor with formatting toolbar
  - Bold, italic, headings, lists, and blockquotes
  - Table support with resizable columns
  - Task list checkboxes with nested support
  - Status tags (`#status/done`) and wikilinks (`[[link]]`) preserved
  - YAML frontmatter automatically preserved during editing
  - Placeholder text for empty documents

- **Automatic Task Status Management** - TaskStatusService for intelligent status tracking:
  - Monitors task files in `tasks/` folders for changes
  - Parses YAML frontmatter and acceptance criteria checkboxes
  - Automatically updates task status to "done" when all acceptance criteria are checked
  - Updates the main `tasks.md` table with new status tags
  - Status bar notifications when task status changes

- **Version Check & Update Notification** - VersionCheckService for update awareness:
  - Checks GitHub releases API for latest version on startup
  - Shows notification when newer version is available
  - Version badge displayed in dashboard header
  - One-click button to view release page

- **Navigation Improvements** - Enhanced header UI:
  - Back/forward navigation buttons
  - Folder selection button
  - Current path display
  - Version badge with update indicator

### Changed

- **Improved Task Status Tracking in Pipeline Commands** - CLI commands now properly update:
  - Status tags in `tasks.md` table (`#status/pending` → `#status/in-progress` → `#status/done`)
  - YAML frontmatter in individual task files (`status: pending` → `status: done`)
  - Acceptance criteria checkboxes (`- [ ]` → `- [x]`)
  - Progress summary table in `tasks.md`
  - Applied same fixes to both Claude Code (`.md`) and Cursor (`.mdc`) command files

### Fixed

- Fixed mismatch between pipeline command instructions and actual file format (checkbox vs status tags)

## [1.4.0] - 2025-12-09

### Removed

- **Electron Dashboard** (`spectacular-dashboard`) - Removed in favor of VS Code extension for significant size reduction:
  - Electron app was ~200MB unpacked vs ~2MB for VS Code extension
  - All functionality now available in VS Code extension
  - Users with existing Electron installations can delete `~/.spectacular/dashboard/`

### Changed

- Project now has two components: CLI and VS Code Extension
- Updated CLAUDE.md to remove Electron references

## [1.3.0] - 2025-12-09

### Added

- **VS Code Extension** (`spectacular-vscode`) - Full dashboard functionality as a VS Code extension:
  - Activity bar icon with SpecTacular branding for quick access
  - Welcome view with buttons to open dashboard in editor panel
  - Dashboard opens in full editor panel (not sidebar) for optimal viewing
  - Auto-detection of project folders: tries `specs` first, then `.spectacular`
  - Real-time file watching via VS Code FileSystemWatcher API
  - Theme integration with VS Code (automatically matches light/dark mode)
  - Navigation history with back/forward buttons in header
  - Mouse back/forward button support (Mouse Button 3/4)
  - Keyboard navigation shortcuts (Alt+Left for back, Alt+Right for forward)
  - Path breadcrumb with copy-to-clipboard functionality
  - Loading states and error handling
  - Modified file indicators
  - Markdown file tree view (`.md` and `.markdown` files)
  - Recursive folder scanning starting from workspace root
  - Status tags and wikilinks in read-only mode
  - Syntax highlighting for code blocks
  - Frontmatter metadata display
  - Custom WebviewPanel for markdown preview
  - DashboardViewProvider for sidebar integration (future)
  - SpecsTreeProvider for file tree navigation
  - FileDecorationProvider for modified file indicators

## [1.2.0] - 2025-12-08

### Added

- **CLI Update Command** - Self-updating capability:
  - `spectacular update` downloads latest release from GitHub
  - `spectacular update --check` only checks for updates without installing
  - Automatic version comparison using semantic versioning
  - Downloads and replaces current executable
  - Updates PATH environment variable if needed
  - 5-second timeout for GitHub API requests

- **Version Check in Init** - Shows update notification during project initialization:
  - Checks for updates when running `spectacular init`
  - Displays available version if update exists
  - Non-blocking; doesn't interrupt initialization

### Changed

- Installer now includes version checking on every run
- Improved error messages for network-related failures

## [1.1.0] - 2025-12-07

### Added

- **Language Support** - Multi-language project initialization:
  - `--language` option for `spectacular init`
  - Supports English (`en`) and Slovak (`sk`)
  - Language-specific templates and prompts
  - Default language: English

- **AI Tool Selection** - Choose which AI assistant to scaffold for:
  - `--tool` option with values: `claude`, `cursor`, or `both` (default)
  - Filters generated commands based on selection
  - Claude Code: `.claude/commands/*.md`
  - Cursor: `.cursor/rules/*.mdc`

### Changed

- Interactive prompts for missing `--tool` and `--language` options
- Updated CLAUDE.md template with language-specific instructions

## [1.0.0] - 2025-12-06

### Added

- **CLI Tool** (`spectacular`) - Project scaffolding:
  - `spectacular init` command for initializing projects
  - `--name` option for project name
  - `--tech` option for technology stack (comma-separated)
  - `--path` option for target directory
  - `--force` option to overwrite existing files
  - Template variable substitution: `{{PROJECT_NAME}}`, `{{TECH_STACK}}`, `{{DATE}}`
  - Embedded templates compiled into executable

- **Project Structure** - Scaffolded files and folders:
  - `.spectacular/` - Configuration, templates, prompts, scripts
  - `.claude/commands/` - Claude Code slash commands
  - `.cursor/rules/` - Cursor AI rules
  - `specs/` - Specification files directory
  - `CLAUDE.md` - AI assistant project instructions

- **AI Workflow Commands** - Pipeline for specification-driven development:
  - `0-quick.md` - Full pipeline orchestration
  - `1-spec.md` - Specification creation
  - `2-plan.md` - Implementation planning
  - `3-tasks.md` - Task breakdown
  - `4-implement.md` - Implementation guidance
  - `5-validate.md` - Validation and review

- **Templates** - Markdown templates for specs, plans, and tasks:
  - `spec-template.md` - Standard specification
  - `spec-foam-template.md` - Foam-style specification
  - `plan-template.md` - Implementation plan
  - `task-template.md` - Individual task
  - `task-foam-template.md` - Foam-style task
  - `tasks-template.md` - Task checklist
  - `feature-template.md` - Feature template

- **Configuration** - Global and project-level settings:
  - Global config: `~/.spectacular/config.json`
  - Project config: `.spectacular/config/project.json`
  - ConfigService for loading/saving configuration

- **Installation** - PowerShell installer:
  - One-liner installation: `irm <url> | iex`
  - Installs to `~/.spectacular/bin/`
  - Updates user PATH environment variable
  - No admin privileges required
  - Broadcasts PATH changes to running processes

### Technical Details

- Built with .NET 8
- System.CommandLine for CLI parsing
- Single-file executable deployment
- Self-contained with embedded resources
- Windows x64 target (win-x64)

---

## Version History

| Version | Release Date | Major Changes |
|---------|--------------|---------------|
| 1.6.1 | 2025-12-13 | Architecture documentation |
| 1.6.0 | 2025-12-13 | WYSIWYG editor, auto task status |
| 1.4.0 | 2025-12-09 | Removed Electron dashboard |
| 1.3.0 | 2025-12-09 | VS Code extension added |
| 1.2.0 | 2025-12-08 | Self-updating CLI |
| 1.1.0 | 2025-12-07 | Multi-language, AI tool selection |
| 1.0.0 | 2025-12-06 | Initial release |

## Links

- [GitHub Repository](https://github.com/Tadzesi/SpecTacular)
- [Latest Release](https://github.com/Tadzesi/SpecTacular/releases/latest)
- [Issue Tracker](https://github.com/Tadzesi/SpecTacular/issues)
