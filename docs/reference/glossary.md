# Glossary

Definitions of key terms used throughout SpecTacular documentation.

## A

**Acceptance Criteria**
: Checklist items (`- [ ]`) in task files that define when a task is complete. When all criteria are checked, the task status automatically updates to `done`.

**Agent**
: In AI context, refers to Claude Code or Cursor AI assistants that execute workflow commands.

**Architecture**
: The structural design of the SpecTacular system, including CLI, extension, and webview components.

## C

**CLI (Command-Line Interface)**
: The `spectacular` executable that scaffolds projects and manages configuration.

**Component**
: A distinct part of the system (CLI Tool, VS Code Extension, React Webview).

**Configuration**
: Settings stored in JSON files (global: `~/.spectacular/config.json`, project: `.spectacular/config/project.json`).

**CSP (Content Security Policy)**
: Browser security feature that restricts what resources a webview can load.

## D

**Dashboard**
: The main webview panel in VS Code showing markdown preview and WYSIWYG editor.

**Debouncing**
: Delaying action execution until after rapid events settle (e.g., 300ms for file watching).

**Dependency**
: A requirement that must be met before work can begin (specified in specs and tasks).

## E

**Embedded Resource**
: Template files compiled into the CLI executable for deployment.

**Extension Host**
: The Node.js environment in VS Code where the extension runs, with access to file system and VS Code API.

## F

**Feature**
: A user-facing capability documented in specification files.

**File Watcher**
: VS Code API that monitors file system changes and triggers updates.

**Frontmatter**
: YAML metadata at the top of markdown files (between `---` delimiters).

## G

**Git**
: Version control system used for managing SpecTacular source code and user projects.

**GitHub Pages**
: Static site hosting service used for SpecTacular documentation.

**Glob Pattern**
: Wildcard pattern for matching files (e.g., `**/*.md` matches all markdown files).

## I

**Init Command**
: `spectacular init` command that scaffolds a new project structure.

## M

**Markdown**
: Lightweight markup language used for all SpecTacular documentation files.

**Mermaid**
: Diagramming syntax embedded in markdown, used extensively in architecture documentation.

**Message Protocol**
: Communication pattern between extension host and webview using `postMessage` API.

**Modified Indicator**
: Visual indicator (●) showing files with unsaved changes.

## P

**Pipeline**
: The 5-stage workflow: spec → plan → tasks → implement → validate.

**Plan**
: Implementation plan breaking down a specification into phases (created with `/plan` command).

**postMessage**
: Web API for communication between extension host and webview.

**Provider**
: VS Code pattern for implementing tree views, decorations, and webviews.

## S

**Scaffolding**
: Generating project structure and files from templates (done by CLI `init` command).

**Singleton**
: Design pattern ensuring only one instance exists (used for DashboardPanel, VersionCheckService).

**Spec (Specification)**
: Detailed document describing a feature or requirement (created with `/spec` command).

**Status Tag**
: Markdown syntax for visual status indicators: `#status/done`, `#status/pending`, etc.

## T

**Task**
: Atomic unit of work with acceptance criteria (created with `/tasks` command).

**Task Status Service**
: Extension service that automatically updates task status based on checked criteria.

**Template**
: Markdown file with variable placeholders used for scaffolding.

**Template Variable**
: Placeholder in templates (e.g., `{{PROJECT_NAME}}`) replaced during scaffolding.

**TipTap**
: ProseMirror-based editor used for WYSIWYG markdown editing in the webview.

**Tree Provider**
: VS Code API for displaying hierarchical data (used for Specs Tree View).

## V

**Variable Substitution**
: Replacing template variables (`{{VAR}}`) with actual values during scaffolding.

**VitePress**
: Static site generator used for SpecTacular documentation.

**VS Code Extension**
: The `spectacular-dashboard` extension providing rich markdown preview and editing.

## W

**Webview**
: Browser-like environment in VS Code for displaying custom HTML/React UI.

**WebviewPanel**
: VS Code API for creating editor panels with custom content.

**Wikilink**
: Double-bracket syntax for internal document links: `[[filename]]`.

**WYSIWYG (What You See Is What You Get)**
: Visual editor where formatting appears as it will in the final output.

## Y

**YAML**
: Data serialization format used for frontmatter in markdown files.

---

## Related Pages

- [Architecture Overview](/architecture/) - System design
- [CLI Commands](/guide/cli/commands) - CLI reference
- [Extension Features](/guide/extension/features) - Extension capabilities
- [Workflows](/guide/workflows/specification-pipeline) - Pipeline documentation
