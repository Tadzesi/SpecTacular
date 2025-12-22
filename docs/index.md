---
layout: home

hero:
  name: "SpecTacular"
  text: "Specification-Driven Development"
  tagline: "CLI tool + VS Code extension for managing markdown specifications with AI-assisted workflows"
  image:
    src: /logo.svg
    alt: SpecTacular Logo
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started/
    - theme: alt
      text: View on GitHub
      link: https://github.com/Tadzesi/SpecTacular

features:
  - icon: 📁
    title: Unified File Tree
    details: Browse all spec files in a navigable sidebar with real-time filesystem watching
  - icon: 🔗
    title: Wikilink Navigation
    details: Click [[links]] to jump between documents instantly
  - icon: ✅
    title: Visual Status Tags
    details: Status tags like #status/done render as colored badges for instant visibility
  - icon: 🎨
    title: WYSIWYG Editor
    details: Rich text editing with TipTap - tables, task lists, formatting without leaving markdown
  - icon: 🤖
    title: AI-Assisted Workflows
    details: Integrated Claude Code commands for specification pipeline (spec → plan → tasks → implement → validate)
  - icon: 🔄
    title: Auto Task Status
    details: Task status updates automatically when acceptance criteria are checked
  - icon: 🌓
    title: Dark/Light Themes
    details: Comfortable viewing in any environment with theme switching
  - icon: ⚡
    title: Real-Time Updates
    details: Files update automatically when changed on disk with smart debouncing
---

## Why SpecTacular?

Managing software specifications across multiple markdown files can be challenging:
- **Fragmented documentation** - Specs, plans, and tasks spread across many files
- **No visual hierarchy** - Plain text editors don't show document relationships
- **Manual navigation** - Jumping between linked files is tedious
- **No status visibility** - Task completion states buried in text

SpecTacular solves these problems with a powerful CLI scaffolding tool and an integrated VS Code extension.

## Quick Start

::: code-group

```powershell [Install CLI]
# One-liner installation
irm https://raw.githubusercontent.com/Tadzesi/SpecTacular/master/spectacular-cli/installer/install.ps1 | iex

# Verify
spectacular --version
```

```bash [Initialize Project]
# Scaffold a new spec-driven project
cd your-project
spectacular init --name "MyProject" --tech "Node.js, TypeScript"

# Opens project structure with AI workflow commands
```

```bash [Install VS Code Extension]
# Download from GitHub releases
# https://github.com/Tadzesi/SpecTacular/releases

# Install via command line
code --install-extension spectacular-dashboard-1.6.4.vsix
```

:::

## Architecture

SpecTacular consists of two main components:

```mermaid
graph LR
    USER((Developer))

    USER -->|spectacular init| CLI[.NET 8 CLI Tool]
    USER -->|Open in VS Code| EXT[VS Code Extension]

    CLI -->|scaffolds| PROJECT[Project Structure]
    EXT -->|edits/previews| PROJECT

    style CLI fill:#4a9eff,color:#fff
    style EXT fill:#68d391,color:#000
    style PROJECT fill:#f6ad55,color:#000
```

**CLI Tool:** Scaffolds projects with templates, AI workflow commands, and configuration
**VS Code Extension:** Rich markdown preview, WYSIWYG editing, tree view, auto-status updates

[Learn more about the architecture →](/architecture/)

## What's Next?

<div class="vp-doc" style="margin-top: 2rem;">

**For Users:**
- [Installation Guide](/getting-started/) - Set up CLI and VS Code extension
- [CLI Commands](/guide/cli/commands) - Learn `init`, `update`, and more
- [Extension Features](/guide/extension/features) - Dashboard, tree view, WYSIWYG editor
- [Workflow Guide](/guide/workflows/specification-pipeline) - AI-assisted spec pipeline

**For Developers:**
- [Architecture Overview](/architecture/) - System design and component diagrams
- [Development Setup](/development/setup) - Build CLI and extension from source
- [Contributing Guide](/development/contributing) - How to contribute to SpecTacular
- [API Reference](/api/extension/) - Extension and webview API documentation

</div>
