# Project Profile

**Version:** 2.0
**Last Updated:** 2026-03-03
**Purpose:** Structured fact store for memory recall across sessions - populated automatically

---

## Project Identity

**Name:** Claude Commands Library (claude-ideas)
**Version:** 4.2.0
**Repository:** https://github.com/Tadzesi/claude-ideas
**License:** MIT
**Live Docs:** https://tadzesi.github.io/claude-ideas/
**Author:** Tadzesi (marti)
**Language preference:** Slovak/English (bilingual - user writes in Slovak, code/docs in English)

**Purpose:** A collection of reusable slash commands for Claude Code that enhance prompt engineering, content creation, and session management. Commands use a library-based architecture where a shared core (Phase 0) handles prompt analysis/perfection, and domain-specific adapters customize behavior.

---

## Tech Stack

- **Runtime:** Node.js (ES modules, `"type": "module"`)
- **Package manager:** npm
- **Documentation:** VitePress 1.6.4 + Vue 3.5.26
- **Language:** Markdown (command files), JSON (config files), JavaScript (docs build)
- **Version control:** Git, main branch: `main`
- **CI/CD:** GitHub Actions auto-deploys docs to GitHub Pages on push to main
- **Shell:** PowerShell (Windows 11 Pro) + bash via Git for Windows

---

## Infrastructure

- **Platform:** Windows 11 Pro 10.0.26200
- **Shell:** bash (Git for Windows) - use Unix paths in commands
- **Node version:** Current LTS
- **Docs build output:** `docs/.vitepress/dist/`
- **GitHub Pages:** Auto-deploys from main branch via `.github/workflows/deploy-docs.yml`

---

## Project Structure

```
claude-ideas/
├── CLAUDE.md                    # Top-level project instructions
├── .claude/
│   ├── CLAUDE.md               # Memory imports + quick reference
│   ├── commands/               # Slash command definitions (OLD format, still works)
│   │   ├── prompt.md           # /prompt - Quick prompt cleanup
│   │   ├── prompt-hybrid.md    # /prompt-hybrid - Intelligent + agents
│   │   ├── prompt-technical.md # /prompt-technical - Technical analysis
│   │   ├── prompt-research.md  # /prompt-research - Multi-agent research
│   │   ├── prompt-article.md   # /prompt-article - Article wizard
│   │   ├── prompt-article-readme.md # /prompt-article-readme - README generator
│   │   ├── session-start.md    # /session-start - Load context
│   │   ├── session-end.md      # /session-end - Save context
│   │   ├── reflect.md          # /reflect - Skill improvement
│   │   └── example-custom-command.md
│   ├── library/               # Shared core library
│   │   ├── prompt-perfection-core.md  # Canonical Phase 0 (v1.5)
│   │   ├── adapters/          # Domain adapters (technical, article, session, etc.)
│   │   ├── intelligence/      # Predictive intelligence components
│   │   ├── orchestration/     # Multi-agent orchestration
│   │   └── agents/            # Specialized agent definitions
│   ├── config/                # JSON configuration files
│   │   ├── complexity-rules.json
│   │   ├── agent-templates.json
│   │   ├── cache-config.json
│   │   ├── learning-config.json
│   │   ├── ai-fluency.json
│   │   └── predictive-intelligence.json
│   ├── memory/                # Persistent memory files
│   │   ├── project-profile.md  # THIS FILE - structured project facts
│   │   ├── sessions.md         # Session history (written by /session-end)
│   │   ├── prompt-patterns.md  # Learning system patterns
│   │   ├── project-knowledge.md # Persistent knowledge graph
│   │   ├── architectural-context.md # Architecture understanding
│   │   └── observations.md    # Pending observations from /reflect
│   ├── rules/                 # Path-scoped rules
│   │   ├── command-conventions.md
│   │   ├── library-standards.md
│   │   └── technical-patterns.md
│   └── docs/                  # Internal docs (release notes, roadmap, comparisons)
├── docs/                      # VitePress documentation site
│   ├── .vitepress/config.ts   # VitePress configuration
│   └── *.md                   # Documentation pages
├── tests/                     # Validation scripts
│   └── validate-library-references.ps1
├── install-claude-commands.ps1 # Installer script
└── package.json
```

---

## Core Architecture

**Library-Based Pattern:**
```
User Input -> Phase 0 (prompt-perfection-core.md) -> Domain Adapter -> Command Logic
```

**Phase 0 Steps (canonical, in prompt-perfection-core.md v1.5):**
- 0.1: Initial Analysis (language, type, intent)
- 0.11: Quick Delegation Check (AI Fluency)
- 0.12: Interaction Mode Detection (Automation/Augmentation/Agency)
- 0.15: Predictive Intelligence (optional)
- 0.2: Completeness Check + Memory Recall (reads project-profile.md)
- 0.3: Clarification Questions (skips what profile already knows)
- 0.4: Correction & Structuring
- 0.5: Output Perfect Prompt
- 0.6: Approval Gate
- 0.7: Post-Execution Evaluation

**Complexity Scoring (prompt-hybrid.md):**
- 0-4: Simple (inline validation)
- 5-9: Moderate (ask user if agent needed)
- 10+: Complex (spawn agent)
- 15+: Very High (multi-agent verification)

---

## Commands

| Command | File | Purpose | Speed |
|---------|------|---------|-------|
| `/prompt` | commands/prompt.md | Quick prompt cleanup, LITE intelligence | ~2s |
| `/prompt-hybrid` | commands/prompt-hybrid.md | Full complexity detection, agent spawning | 2-30s |
| `/prompt-technical` | commands/prompt-technical.md | Technical analysis + code scaffolding | 5-30s |
| `/prompt-research` | commands/prompt-research.md | Deep multi-agent research | 60-180s |
| `/prompt-article` | commands/prompt-article.md | Interactive article wizard | Interactive |
| `/prompt-article-readme` | commands/prompt-article-readme.md | README generator | ~30s |
| `/session-start` | commands/session-start.md | Load accumulated session context | 2-5s |
| `/session-end` | commands/session-end.md | Save 10-section comprehensive session | 5-10s |
| `/reflect` | commands/reflect.md | Analyze session, propose improvements | 5-15s |

---

## User Preferences

- **Terminal output:** PLAIN TEXT ONLY - no markdown headers, emojis, or tables
- **List style:** Simple dashes, UPPERCASE for emphasis
- **Line length:** Max 80 characters
- **Language:** Bilingual (Slovak input, English output for code/docs)
- **Commit messages:** Detailed multi-line with Co-Authored-By attribution
- **Enhancement approach:** Systematic analysis → design → implementation → documentation
- **Approval workflow:** Appreciates Phase 0 prompt perfection with clarifying questions
- **Documentation style:** Detailed explanations with concrete examples
- **File naming:** kebab-case for everything
- **Version format:** Semantic (v4.2.0) with dates (YYYY-MM-DD)
- **NEVER commit to git** unless explicitly asked
- **NEVER auto-run install scripts** without confirmation

---

## Workflows

### Development Workflow
1. Edit command/library files in `.claude/commands/` or `.claude/library/`
2. Run `.\tests\validate-library-references.ps1` to verify references
3. Build docs: `npm run docs:build`
4. Commit and push to main (auto-deploys docs)

### Installing Commands to Another Project
```powershell
.\install-claude-commands.ps1
.\install-claude-commands.ps1 -InstallPath "C:\target" -Force
```

### Testing
```powershell
.\tests\validate-library-references.ps1 -Verbose
```

### Key Conventions
- Core library changes affect ALL commands - test multiple after changes
- Adapters extend core, never modify core for domain needs
- New features should be optional and backwards compatible
- Never commit `.claude/cache/` (agent result cache)
- Preserve `.claude/memory/` files during updates (user data)

---

## Session History Summary

- v1.0: Initial session memory system (Dec 2024)
- v2.0: Enhanced session format, 10 sections, smart filtering (Dec 2024)
- v3.0: Unified Library System, Phase 0 standardization (Dec 2024)
- v4.0: Predictive Intelligence System (Jan 2026)
- v4.1: AI Fluency Framework integration (Jan 2026)
- v4.2: Memory Recall System, project-profile.md (Feb 2026)

---

## Known Issues / Gotchas

- `project-profile.md` and `architectural-context.md` have been empty templates until v2.0 of this file
- Commands use old `.claude/commands/` format (new: `.claude/skills/`) - both work but skills have more features
- Sessions.md accumulates indefinitely - may need archiving after many sessions
- Windows PowerShell used for build/test commands, bash for Claude Code interactions

---

## Related Projects

The author (marti/Tadzesi) works on multiple projects at `C:\Projects\development\`:
- `lab463-com-*`: Web projects (LinkVault, SignalFinder, VinneGPT, DocuMind)
- `claude-ideas`: This project (Claude Commands Library)
- `Geodetics`, `StanoPribula`: Other development projects
