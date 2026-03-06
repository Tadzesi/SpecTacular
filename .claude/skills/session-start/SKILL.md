---
name: session-start
description: Load accumulated context from all previous sessions. Use at the beginning of a new work session to restore full project context, see what was done previously, what is in progress, and what the next steps are. Combines project-profile.md with sessions.md history.
disable-model-invocation: true
---

# /session-start - Load Session Context

Load full project context from all memory files to restore continuity.

---

## Load All Memory Sources

Read in order:

1. `.claude/memory/project-profile.md` - Project facts and structure
2. `.claude/memory/sessions.md` - All session history
3. `.claude/memory/prompt-patterns.md` - Learned patterns (if exists)
4. `.claude/memory/project-knowledge.md` - Knowledge graph (if populated)
5. `.claude/memory/observations.md` - Pending observations (if exists)

---

## Present Session Context

```
SESSION CONTEXT LOADED
Project: Claude Commands Library (claude-ideas) v4.2.0
Date: [current date]
Branch: [current git branch]

PROJECT PROFILE
[Key facts from project-profile.md - one line each]
- Stack: Node.js, VitePress, Markdown commands
- Platform: Windows 11, bash
- Commands: 9 slash commands in .claude/commands/ + skills in .claude/skills/
- Style: Plain text terminal, kebab-case, bilingual

RECENT SESSION HISTORY
[Last 3 sessions from sessions.md - key points only]

Session [date]:
- Worked on: [what]
- Completed: [what]
- Next steps: [what was planned]

ACTIVE WORK IN PROGRESS
[From most recent session's "Active Work" section]
- Current task: [if any]
- Uncommitted changes: [if any noted]
- Blockers: [if any]

NEXT STEPS (from last session)
[List from last session's Next Steps section]

LEARNED PATTERNS
[From prompt-patterns.md if relevant patterns exist]

PENDING OBSERVATIONS
[From observations.md if any pending]

---
Context loaded. Ready to continue work.
What would you like to work on today?
```

---

## After Loading

Suggest continuing with:
- Pending next steps from last session
- Any uncommitted work mentioned
- Running `/session-end` at the end of this session to save context

---

**Load all context: /session-start**
