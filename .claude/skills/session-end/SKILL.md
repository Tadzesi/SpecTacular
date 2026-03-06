---
name: session-end
description: Save comprehensive session context to memory files at the end of a work session. Captures decisions, code changes, features implemented, problems solved, and next steps. Updates project-profile.md with any new permanent facts discovered.
disable-model-invocation: true
---

# /session-end - Save Session Context

Capture comprehensive context to ensure zero information loss between sessions.

---

## Step 1: Gather Session Data

Review the current conversation and identify:

1. **Decisions Made** - Architectural and technical choices with rationale
2. **Code Changes** - Files modified, created, or deleted with purpose
3. **Features Implemented** - Status (Complete / In Progress / Blocked)
4. **Problems Solved** - Root cause and solution applied
5. **Technical Stack Changes** - Any new tools, patterns, frameworks discovered
6. **Key Insights** - Codebase discoveries and understanding
7. **User Preferences** - Any new preferences or patterns detected
8. **Active Work In Progress** - Current task, files, blockers
9. **Next Steps** - Actionable TODOs with specifics
10. **Context for Next Session** - Quick summary for resuming

---

## Step 2: Check for Profile Updates

Before writing session summary, check if any NEW permanent facts were discovered:

**Update project-profile.md if:**
- New user preference discovered
- New project convention identified
- Tech stack changed
- New important file or directory found
- Architectural decision made that affects all work
- New workflow or command discovered

If updates needed, edit `.claude/memory/project-profile.md` first.

---

## Step 3: Write Session Entry

Append to `.claude/memory/sessions.md`:

```markdown
---

## Session: [YYYY-MM-DD] | [git branch]

### Decisions Made
- **[Decision]**: [what was decided] - [rationale]

### Code Changes
- **[file path]**: [what changed and why]

### Features Implemented
- **[Feature]**: [Complete / In Progress / Blocked] - [brief description]

### Problems Solved
- **[Problem]**: [root cause] → [solution applied]

### Technical Stack & Architecture
- [Any new patterns, tools, or architectural insights]

### Key Insights
- [Important discoveries about the codebase or project]

### User Preferences & Patterns
- [Any new preferences detected this session]

### Active Work In Progress
- **Current task**: [what is being worked on]
- **Files in progress**: [list]
- **Uncommitted changes**: [yes/no - what]
- **Blockers**: [any blockers]

### Next Steps
- [ ] [Specific actionable TODO]
- [ ] [Specific actionable TODO]

### Context for Next Session
[2-3 sentence summary of where things stand and what to do next]
```

---

## Step 4: Update Prompt Patterns (if applicable)

If a new prompt pattern was detected (3+ similar requests), append to `.claude/memory/prompt-patterns.md`.

---

## Step 5: Confirm Save

```
SESSION SAVED

Date: [date]
Sections captured: [count]
Profile updates: [yes/no - what changed]
Pattern updates: [yes/no]

Summary: [one sentence of what was accomplished]
Next session: Run /session-start to restore this context.
```

---

**Save session context: /session-end**
