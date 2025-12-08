# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.1] - 2025-12-08

### Changed

- **Simplified Installation** - Both CLI and Dashboard now install to the same directory (`~/.spectacular/bin/`)
- **Direct Dashboard Execution** - `SpectacularDashboard` can now be run directly from command line (in PATH)
- **Optimized Installer** - Cleaner, more efficient installation script with better error handling
- **Streamlined Downloads** - CLI exe and Dashboard zip downloaded separately for faster installation

### Fixed

- Fixed ConfigService to look for dashboard in correct location (`~/.spectacular/bin/`)

## [1.2.0] - 2025-12-08

### Added

- **Bundled Dashboard Installation** - Installer now downloads and installs both CLI and Dashboard automatically
- **Dashboard Version Display** - Application version is now shown in the dashboard header
- **`-NoDashboard` Flag** - New installer parameter to skip dashboard installation if desired

### Changed

- Dashboard executable renamed to `SpectacularDashboard.exe` for clarity
- Dashboard installs to `~/.spectacular/dashboard/` alongside CLI
- `spectacular dashboard --install` now provides clearer guidance when dashboard is missing
- ConfigService updated with `GetDashboardInstallDir()` method for consistent path resolution

## [1.1.4] - 2025-12-08

### Fixed

- **PATH Duplicate Prevention** - Fixed installer PATH handling to prevent duplicate entries:
  - Replace `-notlike` wildcard check with accurate path entry comparison
  - Split PATH by semicolon and use `-contains` for exact matching
  - Check session PATH before updating to prevent duplicates in current session

## [1.1.3] - 2025-12-08

### Fixed

- **Complete CLM Compatibility** - Additional fixes for PowerShell Constrained Language Mode:
  - Replace `[Environment]::Is64BitOperatingSystem` with `$env:PROCESSOR_ARCHITECTURE`
  - Replace `[System.IO.Path]::ChangeExtension()` with string `-replace` operator
  - Replace `[Environment]::GetEnvironmentVariable/SetEnvironmentVariable` with registry cmdlets
  - All .NET static method calls now use CLM-compatible alternatives

## [1.1.2] - 2025-12-08

### Fixed

- **Installer Constrained Language Mode Compatibility** - Fixed installer script to work in PowerShell Constrained Language Mode (CLM) environments:
  - Replaced `New-Object System.Net.WebProxy` with `-Proxy` parameter splatting
  - Replaced `New-Object System.Net.WebClient` with `Invoke-WebRequest`
  - These changes allow the installer to work in corporate environments with security policies

## [1.1.1] - 2025-12-07

### Changed

- **Task Generation Structure** - `3-tasks` command now creates individual task files:
  - Creates `tasks/` subfolder with separate `.md` files for each task
  - `tasks.md` serves as overview with status table and links to individual tasks
  - Tasks numbered with 2-digit prefix (01-setup.md, 02-models.md, etc.)
- **Fixed Installer** - Corrected GitHub repository configuration (`Tadzesi/SpecTacular`)
- **Fixed Remote Execution** - Installer now properly handles `irm | iex` piped execution

## [1.1.0] - 2025-12-07

### Added

- **Environment Variable Broadcast** - Installer now broadcasts `WM_SETTINGCHANGE` to notify other applications of PATH changes, so new terminals pick up the CLI immediately without requiring a system restart
- **Improved Installation Documentation** - README includes comprehensive installation guide with:
  - One-liner PowerShell installation
  - Local build and install instructions
  - Verification steps
  - Uninstall instructions

### Changed

- Version bump to 1.1.0 for both CLI and Dashboard
- Updated development commands in CLAUDE.md with correct paths

## [1.0.0] - 2025-12-07

### Added

- **SpecTacular CLI** - .NET 8 command-line tool for scaffolding projects:
  - `spectacular init` - Initialize SpecTacular workflow in any directory
  - `spectacular --version` - Display version information
  - `spectacular update` - Self-update to latest version
  - Options: `--name`, `--tech`, `--path`, `--force`
- **PowerShell One-Liner Installer** - Install CLI with single command
- **Uninstaller Script** - Clean removal of CLI and PATH entries
- **Template Variable Substitution** - Dynamic placeholders in scaffolded files:
  - `{{PROJECT_NAME}}` - Project name
  - `{{TECH_STACK}}` - Technology stack
  - `{{DATE}}` - Current date
  - `{{TECH_STACK_LIST}}` - Formatted bullet list
- **Embedded Resources** - All templates bundled in single executable
- **Proxy Support** - Installer respects `HTTP_PROXY`/`HTTPS_PROXY` environment variables
- **User-Level PATH** - No admin privileges required for installation

## [0.1.0] - 2025-12-06

### Added

- Initial release of SpecTacular markdown specification viewer
- Electron desktop application with React 18 + TypeScript + Vite
- Real-time filesystem watching with chokidar
- Markdown rendering with react-markdown and remark-gfm
- Syntax highlighting for code blocks
- Dark/light theme support with localStorage persistence
- File tree navigation with expand/collapse functionality
- Breadcrumb navigation
- Navigation history (back/forward)
- Wikilink support (`[[link]]` syntax)
- Status tag visualization with icons:
  - `#status/done` - checkmark (green)
  - `#status/complete` - checkmark (green)
  - `#status/pending` - circle (gray)
  - `#status/in-progress` - half-circle (blue)
  - `#status/blocked` - blocked icon (red)
  - `#status/skipped` - arrow (gray)
- Task link copy button on hover for `task-\d+` patterns
- Resizable sidebar panel
- Cross-platform support (Windows, macOS, Linux)
- **AI-Assisted Specification Pipeline** - Automated workflow for generating specs, plans, and tasks:
  - `0-quick` - Full pipeline orchestration (spec → plan → tasks → implement → validate)
  - `1-spec` - Create feature branch and specification document
  - `2-plan` - Generate technical implementation plan from spec
  - `3-tasks` - Create actionable task list with status tracking
  - `4-implement` - Execute tasks one by one with progress tracking
  - `5-validate` - Verify build passes and all tasks complete
- **Specification Document Templates**:
  - `spec.md` - Feature specification with user stories and acceptance criteria
  - `plan.md` - Technical implementation plan with tech stack and architecture
  - `tasks.md` - Task checklist with phases, status tags, and progress summary
  - Individual task files with detailed implementation notes
- **Claude Code Integration** - Slash commands in `.claude/commands/`
- **Cursor Integration** - Rule files in `.cursor/rules/`
- PowerShell automation scripts:
  - `create-new-feature.ps1` - Initialize feature directory structure
  - `setup-plan.ps1` - Generate plan file scaffolding
  - `validate-implementation.ps1` - Verify tasks, build, and tests pass
  - `generate-commands.ps1` - Sync prompts to Claude/Cursor command files
- Example healthcheck specification template

[Unreleased]: https://github.com/Tadzesi/SpecTacular/compare/v1.2.1...HEAD
[1.2.1]: https://github.com/Tadzesi/SpecTacular/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/Tadzesi/SpecTacular/compare/v1.1.4...v1.2.0
[1.1.4]: https://github.com/Tadzesi/SpecTacular/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/Tadzesi/SpecTacular/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/Tadzesi/SpecTacular/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/Tadzesi/SpecTacular/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Tadzesi/SpecTacular/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Tadzesi/SpecTacular/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/Tadzesi/SpecTacular/releases/tag/v0.1.0
