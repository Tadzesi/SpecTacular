# Session Management Adapter

**Version:** 1.0
**Parent Library:** `.claude/library/prompt-perfection-core.md`
**Purpose:** Domain-specific adaptation for session save/load commands

---

## Overview

This adapter extends the core Phase 0 flow for session management commands (`/session-end`, `/session-start`).

It adds session-specific completeness criteria and clarification patterns.

---

## When to Use This Adapter

Use this adapter when the command's purpose is:
- **Saving session context** (capturing work for future sessions)
- **Loading session context** (resuming work from previous sessions)
- **Managing work state** (tracking WIP, decisions, next steps)

---

## Extended Completeness Criteria

In addition to the universal 6 criteria, check for:

### For Session End (Save Context)

- [ ] **Capture Scope:** What to save (all/specific feature/decisions only)
- [ ] **Priority Level:** What matters most (critical decisions/all changes/WIP)
- [ ] **Branch Context:** Which feature/branch this session relates to
- [ ] **Completeness Status:** What's done vs. what remains
- [ ] **Next Session Focus:** What to work on next time

### For Session Start (Load Context)

- [ ] **Work Focus:** What to work on today (resume/new feature/review)
- [ ] **Context Filter:** What context to load (last session/all/specific feature)
- [ ] **Time Scope:** How far back to load (recent/this week/all sessions)
- [ ] **Information Need:** What info is needed (pending tasks/decisions/full history)
- [ ] **Branch Context:** Which feature/branch to resume

---

## Session-Specific Clarification Questions

### For Session End

**Default Assumption Check:**
First, ask if default behavior is acceptable:

```markdown
**Session End Options:**

Would you like to:
- `full` - Comprehensive session capture (default) - saves everything
- `feature` - Focus on specific feature or decision
- `minimal` - Just next steps and blockers
- `custom` - Let me specify what to capture
```

**If user selects "feature" or "custom", ask:**

```markdown
🚨 **Critical:**
1. Which feature or component should I prioritize in the summary?
   - Why I'm asking: Large sessions have many topics; focusing helps next session
   - Example: "Focus on the authentication changes" or "Just the API refactoring"

2. What's the single most important thing to remember for next session?
   - Why I'm asking: Ensures critical context isn't buried in details
   - Example: "The decision to use JWT tokens" or "The pending database migration"

⚠️ **Important:**
3. Should I exclude any work-in-progress items?
   - Why I'm asking: Sometimes experimental code shouldn't be documented yet
   - You can skip this if you want everything captured

💡 **Optional:**
4. Is there a specific format or structure you prefer for the summary?
   - Why I'm asking: Can tailor output to your workflow
   - Default: Uses comprehensive 10-section format
```

### For Session Start

**Default Assumption Check:**

```markdown
**Session Start Options:**

What are you working on today?
- `resume` - Continue recent work (default) - loads last session
- `feature` - Switch to different feature/branch
- `review` - Review all decisions and history
- `fresh` - New task with minimal context
```

**If user selects "feature" or "review", ask:**

```markdown
🚨 **Critical:**
1. Which feature or branch are you working on?
   - Why I'm asking: Helps me filter relevant context
   - Example: "feature/user-authentication" or "Continuing payment integration"

2. What do you need to know to start working?
   - Why I'm asking: Loads the right level of detail
   - Options: "Pending tasks" / "Recent decisions" / "Full history"

⚠️ **Important:**
3. How far back should I load context?
   - Why I'm asking: Prevents information overload
   - Options: "Last session" / "This week" / "All sessions for this feature"

💡 **Optional:**
4. Are there specific decisions or patterns you want to recall?
   - Why I'm asking: Can highlight relevant insights
   - Example: "Why we chose Redis" or "The error handling pattern we agreed on"
```

---

## Perfected Prompt Format for Sessions

### Session End

```markdown
**✨ Perfected Session Capture Intent:**

**Goal:** Capture session context for [specific purpose]

**Context:**
- Current Branch: [branch name from git]
- Session Duration: [start time - end time]
- Work Type: [implementation/planning/debugging/refactoring]

**Capture Scope:**
- Focus: [Full session / Feature X / Decisions about Y / Minimal]
- Include: [Decisions / Code changes / Problems solved / All]
- Exclude: [Experimental code / None]

**Priority:**
- Most Important: [Critical item to remember]
- Secondary: [Important context]
- Low Priority: [Nice-to-have details]

**Completeness Status:**
- Completed: [What was finished]
- In Progress: [What's partially done]
- Blocked: [What's waiting]
- Next Steps: [What to do next session]

**Expected Result:**
Next session should be able to:
- [Capability 1: e.g., "Resume authentication implementation without ramp-up"]
- [Capability 2: e.g., "Understand why JWT was chosen over sessions"]
- [Capability 3: e.g., "Know which tests are failing and why"]

**Format:** Comprehensive 10-section summary appended to `.claude/memory/sessions.md`
```

### Session Start

```markdown
**✨ Perfected Session Load Intent:**

**Goal:** Load context to [resume work / start new feature / review decisions]

**Context:**
- Current Branch: [branch name from git]
- Last Session: [date/time]
- Work History: [sessions count] sessions available

**Load Scope:**
- Focus: [Resume recent / Feature X / Full review / Fresh start]
- Time Range: [Last session / This week / All sessions / Specific dates]
- Information Type: [Pending tasks / Recent decisions / Full context / Background only]

**Work Focus Today:**
- Primary Task: [What to work on]
- Related Context: [What decisions/patterns to recall]
- Blockers to Address: [If any known blockers]

**Expected Result:**
After loading context, I should:
- [Capability 1: e.g., "Know where I left off in authentication"]
- [Capability 2: e.g., "Understand the current architecture decisions"]
- [Capability 3: e.g., "Have pending tasks prioritized"]

**Format:** Organized summary with active work, pending steps, recent decisions, and filtered context
```

---

## Validation Rules

### Session End Validation

Before capturing, verify:

1. **Git Status Available**
   ```bash
   git status
   git branch
   ```
   - Current branch should be known
   - Changed files should be tracked

2. **Session Has Content**
   - At least one of: decisions made / code changes / problems solved / features implemented
   - If empty session, ask: "This session appears to have no changes. Still want to save? (yes/no)"

3. **Next Steps Defined**
   - If work is incomplete, must have at least one next step
   - If no next steps, ask: "What should be done next session?"

4. **Critical Decisions Captured**
   - If architectural or technical decisions were made, ensure they're in "Decisions Made" section
   - Ask: "Were there any important decisions I should highlight?"

### Session Start Validation

Before loading, verify:

1. **Memory File Exists**
   - Check for `.claude/memory/sessions.md`
   - If missing: "No session history found. Start with fresh context? (yes/no)"

2. **Git Branch Context**
   ```bash
   git branch --show-current
   ```
   - Know current branch
   - Can filter sessions by branch if multiple exist

3. **Scope Matches Available Data**
   - If user asks for "feature X" sessions, verify they exist
   - If user asks for "last week", check date range has sessions
   - If no matching sessions, inform and ask for alternative scope

4. **Not Overloading Context**
   - If "all sessions" requested and there are >10 sessions, warn:
     "Loading all 25 sessions may be overwhelming. Recommended: load last 5 or filter by feature. Proceed with all? (yes/no)"

---

## Session-Specific Enhancements

### Smart Defaults (After 3+ Sessions)

Track patterns in `.claude/memory/session-patterns.md`:

```markdown
## Session Capture Patterns

- User preference: Full session capture (last 5 sessions)
- Typical session focus: Implementation work
- Common next steps: "Run tests" / "Update documentation"

## Session Load Patterns

- User preference: Resume recent (last 5 sessions)
- Typical filter: Last session only
- Common focus: Pending tasks first
```

**Apply Smart Defaults:**
```markdown
💡 **Smart Default Detected:**

Based on your last 5 sessions, you typically:
- Capture: Full session
- Load: Last session only

Apply these defaults? (yes/no/modify)
```

### Git Integration

**Session End:**
- Auto-detect current branch: `git branch --show-current`
- List changed files: `git status --short`
- Include in context: Recent commits

**Session Start:**
- Filter sessions by current branch
- Warn if switching branches: "You were on feature/auth but now on main. Load cross-branch context? (yes/no)"

### Time-Aware Context

**Session End:**
- Auto-timestamp: Current date/time
- Calculate session duration if start time known

**Session Start:**
- Show "last active" dates
- Highlight stale context: "Last session was 2 weeks ago. Full refresh recommended? (yes/no)"

---

## Integration Example

### /session-end Command Using Session Adapter

```markdown
# /session-end - Enhanced with Phase 0

## Phase 0: Prompt Perfection

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Session (from `.claude/library/adapters/session-adapter.md`)

**Extended Criteria:**
- Capture Scope
- Priority Level
- Branch Context
- Completeness Status
- Next Session Focus

**Process:**
1. Run Initial Analysis (Step 0.1)
2. Detect git context automatically (branch, changed files)
3. Run Completeness Check with session criteria (Step 0.2)
4. Ask session-specific clarification questions (Step 0.3)
5. Structure perfected capture intent (Step 0.4-0.5)
6. Get user approval (Step 0.6)

## Phase 1: Generate Session Summary

**After approval, generate summary based on perfected intent:**

[Use capture scope, priority, and focus from Phase 0]
[Apply 10-section comprehensive format]
[Append to .claude/memory/sessions.md]
[Show summary of what was captured]
```

### /session-start Command Using Session Adapter

```markdown
# /session-start - Enhanced with Phase 0

## Phase 0: Prompt Perfection

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Session (from `.claude/library/adapters/session-adapter.md`)

**Extended Criteria:**
- Work Focus
- Context Filter
- Time Scope
- Information Need
- Branch Context

**Process:**
1. Run Initial Analysis (Step 0.1)
2. Detect git context automatically (branch)
3. Check for .claude/memory/sessions.md
4. Run Completeness Check with session criteria (Step 0.2)
5. Ask session-specific clarification questions (Step 0.3)
6. Structure perfected load intent (Step 0.4-0.5)
7. Get user approval (Step 0.6)

## Phase 1: Load Filtered Context

**After approval, load and present context based on perfected intent:**

[Filter sessions by scope, time range, and focus]
[Present: Active WIP, Pending Steps, Recent Decisions, Filtered Context]
[Highlight based on work focus]
[Ask: "What would you like to work on today?"]
```

---

## Benefits of Session Adapter

### Solves Current Problems

❌ **Before (No Phase 0):**
- Session-end captures everything indiscriminately
- Session-start loads all sessions → information overload
- No user control over scope or focus
- Implicit assumptions about what matters

✅ **After (With Session Adapter):**
- User controls capture scope (full/feature/minimal)
- Filtered loading based on work focus
- Explicit priorities and focus areas
- Smart defaults after pattern detection

### User Experience Improvements

✅ **Faster startup:** Load only relevant context
✅ **Targeted summaries:** Save what matters
✅ **Branch-aware:** Context filtered by feature
✅ **Time-aware:** Highlight fresh vs. stale info
✅ **Pattern learning:** Remembers preferences

### Developer Experience Improvements

✅ **Consistent UX:** Same Phase 0 flow as other commands
✅ **Less code:** Reuse core library + adapter
✅ **Easy maintenance:** Update adapter once, both commands benefit
✅ **Clear architecture:** Separation of concerns

---

## Version History

**v1.0 (2024-12-19):**
- Initial release
- Session end criteria and patterns
- Session start criteria and patterns
- Git integration guidelines
- Smart defaults framework

---

## Related Files

- **Core Library:** `.claude/library/prompt-perfection-core.md`
- **This Adapter:** `.claude/library/adapters/session-adapter.md`
- **Commands Using This:**
  - `.claude/commands/session-end.md`
  - `.claude/commands/session-start.md`
- **Session Memory:** `.claude/memory/sessions.md`
- **Session Patterns:** `.claude/memory/session-patterns.md`

---

**This adapter ensures zero-ambiguity session management in Claude Code.**
