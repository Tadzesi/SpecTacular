# Claude Commands Library - Project Memory

This file aggregates project-specific memory and context using Claude Code's native @ import system.

---

## Memory Imports

Load persistent context from memory files:

- Session history: @.claude/memory/sessions.md
- Project profile: @.claude/memory/project-profile.md
- Learning patterns: @.claude/memory/prompt-patterns.md
- Project knowledge: @.claude/memory/project-knowledge.md
- Architecture context: @.claude/memory/architectural-context.md
- Pending observations: @.claude/memory/observations.md

---

## Rules Imports

Load path-specific rules automatically:

- Technical patterns: @.claude/rules/technical-patterns.md
- Command conventions: @.claude/rules/command-conventions.md
- Library standards: @.claude/rules/library-standards.md

---

## Quick Reference

**Commands Available:**
- `/prompt` - Quick prompt cleanup (2s)
- `/prompt-hybrid` - Intelligent perfection with agents (2-30s)
- `/prompt-technical` - Technical analysis (5-30s)
- `/prompt-research` - Deep multi-agent research (60-180s)
- `/prompt-article` - Article wizard
- `/prompt-article-readme` - README generator
- `/session-start` - Load session context
- `/session-end` - Save session context
- `/reflect` - Skill improvement analysis

**Configuration:**
- Complexity rules: @.claude/config/complexity-rules.json
- Agent templates: @.claude/config/agent-templates.json
- Learning config: @.claude/config/learning-config.json
- AI Fluency: @.claude/config/ai-fluency.json

---

## Project Conventions

**File Naming:**
- Commands: kebab-case (prompt-technical.md)
- Config: kebab-case JSON (complexity-rules.json)
- Library: kebab-case (prompt-perfection-core.md)

**Version Format:**
- Use semantic versioning (v4.2.0)
- Include date in version history (YYYY-MM-DD)
- Current version: 4.2.0 (AI Fluency Framework)

**Terminology:**
- "Explore Agent" (not ExploreAgent)
- "Complexity Score" (not just Score)
- "Phase 0" for prompt perfection stage

---

## Active Context

This section is updated by /session-end:

**Last Session:** See @.claude/memory/sessions.md
**Active Work:** Check session memory for current tasks
**Pending Items:** Review observations.md for unresolved items
