---
name: prompt-hybrid
description: Intelligent prompt perfection with automatic complexity detection and agent assistance. Use for complex tasks involving multiple command files, library changes, pattern detection across the codebase, or when you need codebase analysis. Automatically determines if an agent is needed. Knows the project structure without needing to be told.
argument-hint: "[complex task or multi-file change description]"
---

# /prompt-hybrid - Intelligent Prompt Perfection (Project-Aware + Agents)

Transform any prompt using complexity detection, agent assistance, and full project context.
This skill ALWAYS loads project knowledge first so users never need to repeat project info.

This skill uses the **Unified Library System** with **Hybrid Intelligence** and **Project Memory**.

---

## STARTUP: Load Project Context (ALWAYS FIRST)

Before any analysis, load known facts:

1. Read `.claude/memory/project-profile.md` (full project knowledge)
2. Read recent sessions from `.claude/memory/sessions.md` (last 3 entries)
3. Read `.claude/memory/prompt-patterns.md` (learned patterns if exists)

Display loaded context:

```
PROJECT CONTEXT LOADED

Project: Claude Commands Library (claude-ideas) v4.2.0
Stack: Node.js, VitePress, Markdown commands, JSON config
Commands: 9 commands in .claude/commands/ + 9 in .claude/skills/
Library: prompt-perfection-core.md v1.5 + 5 adapters + intelligence + orchestration
Config: 8 JSON config files in .claude/config/
Memory: project-profile.md, sessions.md, prompt-patterns.md
Language: Bilingual (Slovak/English)

Recent work: [from sessions.md - brief summary]
Learned patterns: [from prompt-patterns.md if relevant]
```

---

## Phase 0: Prompt Perfection with Hybrid Intelligence

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Technical with Hybrid Intelligence + Project Memory

---

### Enhanced Step 0.1: Initial Analysis + Complexity Detection

**Standard analysis:**
- Language (Slovak / English)
- Prompt type
- Core intent

**Then complexity detection** using `.claude/config/complexity-rules.json`:

**Complexity Triggers (weights):**
- Multi-file scope (5): affects multiple commands, library + commands, etc.
- Architecture questions (7): "how does", "where is", "what handles"
- Pattern detection (6): "existing pattern", "like other commands", "consistent with"
- Feasibility check (4): "is it possible", "can we add", "will this work"
- Implementation planning (3): "implement", "build", "create", "add functionality"
- Cross-cutting (4): changes to core library, Phase 0 flow, all commands
- Refactoring (5): "refactor", "restructure", "reorganize"

**Project-specific scoring notes:**
- Changes to `prompt-perfection-core.md` = automatic +7 (architecture question)
- Changes affecting all commands = automatic +5 (multi-file scope)
- New command creation = +3 (implementation) + check for pattern alignment

**Decision:**
- 0-4: Simple path (no agent)
- 5-9: Ask user ("Moderate complexity. Use agent for codebase analysis? yes/no")
- 10+: Complex path (spawn agent automatically)
- 15+: Very High (multi-agent verification)

---

### Project-Aware Completeness Check

Using loaded project-profile.md, only check for task-specific unknowns:

**Already known (never ask again):**
- Project structure, file paths, conventions
- Tech stack, platform, preferences
- Existing command architecture

**Ask only for:**
- Specific goal of THIS task
- Which specific command/library file
- Task-specific requirements or constraints

---

### Agent-Enhanced Flow (when complexity >= 10)

When spawning an agent for codebase analysis:

```
SPAWNING EXPLORE AGENT

Task: Analyze [relevant part of codebase]
Looking for: [patterns, existing implementations, conventions]
Starting from: [project-profile.md gives base context]
Agent will check: [specific directories based on task]
```

Agent explores `.claude/commands/`, `.claude/library/`, `.claude/config/`
to find existing patterns, implementations, and conventions.

Agent returns:
- Files affected
- Existing patterns to follow
- Technical feasibility
- Recommended approach

---

### Enhanced Perfect Prompt Output

```
PERFECTED PROMPT (Agent-Enhanced)

Goal: [one clear sentence]

Context (project auto-loaded):
- Project: Claude Commands Library v4.2.0
- Environment: Windows 11, bash, Node.js
- Architecture: Library-based Phase 0 pattern
- Agent findings: [what the agent discovered]

Scope:
- Files to modify: [with .claude/ paths]
- Library sections: [if core library involved]
- Commands affected: [downstream impact]
- Config files: [if JSON config changes needed]

Requirements:
1. [Requirement]
2. Follow pattern from: [file found by agent]
3. Use existing utility: [utility found by agent]

Constraints:
- Backwards compatible with existing commands
- Core library changes require testing all commands
- [Task-specific constraints]

Expected Result: [success description]
Verify: .\tests\validate-library-references.ps1

Technical Validation (Agent):
- Feasibility: [assessment]
- Pattern alignment: [details]
- Downstream impact: [which commands affected]

Agent Recommendations: [key findings]
```

---

## Version History

**v3.0 (2026-03-03):**
- Converted to Skills format with YAML frontmatter
- STARTUP section loads project context before any analysis
- Project-specific complexity scoring annotations
- Agent output contextualized to project structure
- Session-aware recommendations

**v4.1 (2026-01-20):** AI Fluency Delegation Assessment
**v4.0 (2026-01-01):** Predictive Intelligence
**v2.0 (2024-12-20):** Unified library system
**v1.0 (2024-12-15):** Initial release

---

**For complex, multi-file project changes: /prompt-hybrid [your task]**
