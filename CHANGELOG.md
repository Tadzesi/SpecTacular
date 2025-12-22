# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.6.5] - 2025-12-22

### Fixed

- **Markdown List Rendering (Proper Solution)** - Installed `@tailwindcss/typography` plugin to enable professional markdown typography:
  - Installed `@tailwindcss/typography` v0.5.19 in VS Code extension webview
  - Configured typography plugin in `webview/tailwind.config.js`
  - `prose` and `prose-invert` classes now function correctly
  - Numbered lists render with proper indentation, visual hierarchy, and styling
  - Nested lists display with appropriate sub-numbering styles (decimal, lower-alpha, lower-roman)
  - Dark mode typography inversion works correctly
  - Consistent rendering across all markdown content matching VS Code preview
- **Added Comprehensive Test File** - Created `.spectacular/examples/list-rendering-test.md`:
  - 14 test cases covering simple lists, nested lists, mixed formats
  - Tests integration with status tags, wikilinks, code blocks
  - Includes verification steps and expected results

### Technical Details

- **Root Cause**: Previous v1.6.3 fix used CSS workarounds, but `prose` class had no effect without typography plugin
- **Impact**: Professional typographic styling now applied to all markdown content (lists, headings, blockquotes, tables)
- **Files Modified**:
  - `spectacular-vscode/webview/package.json` - Added `@tailwindcss/typography` to devDependencies
  - `spectacular-vscode/webview/tailwind.config.js` - Registered typography plugin
  - `.spectacular/examples/list-rendering-test.md` - New comprehensive test file
- **Backward Compatibility**: All existing functionality preserved (status tags, wikilinks, WYSIWYG editor, code highlighting)

## [1.6.4] - 2025-12-14

### Removed

- **Dashboard CLI Command** - Removed `spectacular dashboard` command from CLI:
  - Dashboard functionality fully migrated to VS Code extension
  - Simplified CLI to focus on project scaffolding
  - Removed `DashboardPath` from ConfigService
  - Users should use VS Code extension for dashboard functionality

### Changed

- Cleaned up CLI codebase by removing dashboard-related code

## [1.6.3] - 2025-12-14

### Fixed

- **Markdown Nested List Rendering (Initial Fix)** - CSS workaround for list display issues:
  - Added explicit `list-style-type` for ordered/unordered lists
  - Added `display: list-item` for proper list rendering
  - Fixed ordered list numbers not displaying in dashboard viewer

### Changed

- **Template Markdown Formatting** - Updated CLI templates to use hybrid nested list syntax:
  - Changed sub-items from `1.1.` to `- 1.1.` for better VS Code preview compatibility
  - Updated templates: `plan-template.md`, `spec-template.md`, `task-template.md`
  - Updated AI prompts: `spectacular.0-quick.md`, `spectacular.2-plan.md`
  - Updated `CLAUDE.md` with corrected markdown formatting standards

### Added

- **PowerShell Feature Management Scripts** - New automation scripts in `.spectacular/scripts/powershell/`:
  - Feature creation and branch management
  - Spec and plan generation helpers
  - Validation scripts for implementation checking

### Note

- This version used CSS workarounds; v1.6.5 provides the proper solution with `@tailwindcss/typography` plugin

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
  - Folder selection dialog to change root directory
  - All markdown features from Electron dashboard (status tags, wikilinks, syntax highlighting)
  - Resizable sidebar panel for file tree navigation
  - File modification indicators
  - Configurable settings: `spectacular.autoOpenOnStartup`, `spectacular.watchDebounceMs`, `spectacular.defaultRootFolder`

### Changed

- Updated CLAUDE.md to document VS Code extension architecture and development commands
- Project now has three components: CLI, Electron Dashboard, and VS Code Extension

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

[Unreleased]: https://github.com/Tadzesi/SpecTacular/compare/v1.6.5...HEAD
[1.6.5]: https://github.com/Tadzesi/SpecTacular/compare/v1.6.4...v1.6.5
[1.6.4]: https://github.com/Tadzesi/SpecTacular/compare/v1.6.3...v1.6.4
[1.6.3]: https://github.com/Tadzesi/SpecTacular/compare/v1.6.1...v1.6.3
[1.6.1]: https://github.com/Tadzesi/SpecTacular/compare/v1.6.0...v1.6.1
[1.6.0]: https://github.com/Tadzesi/SpecTacular/compare/v1.4.1...v1.6.0
[1.4.0]: https://github.com/Tadzesi/SpecTacular/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/Tadzesi/SpecTacular/compare/v1.2.1...v1.3.0
[1.2.1]: https://github.com/Tadzesi/SpecTacular/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/Tadzesi/SpecTacular/compare/v1.1.4...v1.2.0
[1.1.4]: https://github.com/Tadzesi/SpecTacular/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/Tadzesi/SpecTacular/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/Tadzesi/SpecTacular/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/Tadzesi/SpecTacular/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/Tadzesi/SpecTacular/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/Tadzesi/SpecTacular/compare/v0.1.0...v1.0.0
[0.1.0]: https://github.com/Tadzesi/SpecTacular/releases/tag/v0.1.0
