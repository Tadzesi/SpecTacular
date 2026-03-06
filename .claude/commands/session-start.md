# Session Start - Load Memory with Phase 0

Load comprehensive context from previous sessions to continue work with full project knowledge.

This command uses **Phase 0 prompt perfection** to ensure you load exactly the context you need - no more, no less.

---

## Phase 0: Prompt Perfection

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Session (from `.claude/library/adapters/session-adapter.md`)

### Step 0.1: Initial Analysis

**Detected Language:** English
**Prompt Type:** Session Management (Load Context)
**Core Intent:** Load previous session context to resume work

### Step 0.2: Completeness Check

Verify the following session-specific criteria:

**Universal Criteria:**
- [ ] **Goal:** Load context to resume work (auto-filled)
- [ ] **Context:** Git branch, last session date (will auto-detect)
- [ ] **Scope:** What to load (need to ask user)
- [ ] **Requirements:** Format and sections (use organized summary)
- [ ] **Constraints:** None (optional)
- [ ] **Expected Result:** Ready to work with full context (auto-filled)

**Session-Specific Criteria:**
- [ ] **Work Focus:** What to work on today
- [ ] **Context Filter:** What context to load (all/recent/specific)
- [ ] **Time Scope:** How far back to load
- [ ] **Information Need:** What info is needed
- [ ] **Branch Context:** Which feature/branch to resume (auto-detect from git)

### Step 0.3: Clarification

**Ask user for load scope:**

```markdown
**Session Start - What Are You Working On?**

Choose how to load context:

1. **Resume Recent Work** (Recommended)
   - Load only the last session
   - Quick startup, focused context
   - Best for: Continuing where you left off

2. **Switch Context**
   - Load sessions for specific feature or branch
   - Useful for: Starting work on different feature

3. **Full Review**
   - Load all sessions with comprehensive history
   - Useful for: Getting full project overview

4. **Fresh Start**
   - Minimal context, just project background
   - Useful for: Starting completely new work

Select: 1, 2, 3, or 4
```

**If user selects "Switch Context" (option 2), ask:**
```markdown
Which feature or branch are you working on?
Example: "feature/user-authentication" or "payment integration"
```

**If user selects "Full Review" (option 3), warn:**
```markdown
⚠️ You have [X] sessions in history.

Loading all sessions may be overwhelming. Recommendations:
- Last 5 sessions (1 week of work)
- Last 10 sessions (2 weeks of work)
- All [X] sessions (comprehensive but large)

Select: 5, 10, or all
```

**Always ask:**
```markdown
What's your focus today?
- Pending tasks (resume TODOs)
- Blocked items (address blockers)
- Recent decisions (review context)
- New implementation (start fresh with background)

This helps me prioritize what to show first.
```

### Step 0.4-0.5: Structure Perfected Load Intent

After gathering responses, create:

```markdown
**✨ Perfected Session Load Intent:**

**Goal:** Load context to [resume work / switch to feature X / review all / start fresh]

**Context:**
- Current Branch: [from git]
- Last Session: [date/time]
- Sessions Available: [count]

**Load Scope:**
- Focus: [Resume recent / Feature X / Full review / Fresh start]
- Time Range: [Last session / Last N sessions / All sessions]
- Information Type: [Pending tasks / Recent decisions / Full context / Background only]

**Work Focus Today:**
- Primary: [What to work on]
- Priority: [Pending tasks / Blocked items / New work]

**Expected Result:**
After loading, I will:
- Know where I left off
- Have clear next steps
- Understand recent decisions and context

**Format:** Organized summary with active work, pending steps, filtered sessions
```

### Step 0.6: Approval Gate

```markdown
⏸️ **Ready to Load Context - Awaiting Approval**

**Summary:**
- Load: [Last session / Feature X / All sessions / Minimal]
- Focus: [What you're working on]
- Priority: [Pending tasks / Decisions / etc.]

After approval, I will:
1. Read session history from .claude/memory/sessions.md
2. Filter by your scope (time range, feature, branch)
3. Present organized summary prioritized by your focus
4. Highlight active work and next steps

**Reply with:**
- `y` or `yes` — Load context with this configuration
- `n` or `no` — Cancel
- `modify [changes]` — Adjust the load scope
```

**Wait for user approval before proceeding.**

---

## Phase 1: Load and Present Filtered Context

**After user approves, proceed with context loading based on perfected intent.**

### Step 1.1: Auto-Detect Git Context

Gather context automatically:

```bash
# Current branch
git branch --show-current

# Compare with sessions (if sessions tagged with branch)
```

### Step 1.2: Read and Filter Sessions

Read `.claude/memory/sessions.md`

**Apply filters based on load scope:**

**If "Resume Recent":**
- Load: Last 1 session only
- Prioritize: Active WIP, Next Steps

**If "Switch Context" (Feature X):**
- Load: All sessions tagged with feature/branch X
- Prioritize: Recent decisions for that feature, current WIP

**If "Full Review" (N sessions):**
- Load: Last N sessions (or all if user chose)
- Aggregate: Combine all User Preferences, Project Structure Notes
- Prioritize: Cumulative context

**If "Fresh Start":**
- Load: Only Project Structure Notes and Tech Stack from latest session
- Prioritize: Background info, no task details

### Step 1.3: Detect Branch Context Mismatch

If user switched branches:

```markdown
⚠️ **Branch Context Mismatch**

Current branch: `[current]`
Last session branch: `[previous]`

You switched from [previous branch] to [current branch].

Would you like to:
- Load sessions for current branch (`[current]`)
- Load sessions for previous branch (`[previous]`)
- Load sessions from both branches

This ensures you get relevant context for your current work.
```

### Step 1.4: Aggregate Cumulative Sections

**For Full Review or multi-session loads:**

Combine across sessions:
- **User Preferences & Patterns:** Merge all unique preferences
- **Project Structure Notes:** Combine all structure insights
- **Technical Stack & Architecture:** Build complete tech understanding
- **Key Insights:** Collect all insights, deduplicate similar ones

### Step 1.5: Present Organized Summary

Output format based on work focus:

```markdown
🔄 **Session Context Loaded**

[If branch mismatch detected, show warning first]

---

## 📌 Active Work In Progress

[From most recent session with WIP]

**Current Task:** [What was in progress]
**Files:** [Where work was happening]
**Last Location:** [File path and line number if available]
**Status:** [Ready to continue / Blocked / Needs review]

[If blockers exist:]
**⚠️ Blockers:**
- [Blocker 1]
- [Blocker 2]

---

## ✅ Pending Next Steps

[Aggregate all uncompleted TODOs from loaded sessions, sorted by priority]

**High Priority:**
- [ ] [Critical next step with file path]

**Normal Priority:**
- [ ] [Next step]
- [ ] [Next step]

**Low Priority:**
- [ ] [Nice-to-have task]

[If no pending steps:]
**No pending tasks.** Ready for new work.

---

## 🎯 Recent Session Summary

[If load scope = "Last session"]
**Last Session:** [Date] - [Branch]
[2-3 sentence summary from "Context for Next Session"]

[If load scope = "Feature X"]
**Sessions for [Feature X]:** [Count] sessions
[Summary of progress on this feature]

[If load scope = "Full Review"]
**Total Sessions:** [Count]
**Date Range:** [First] to [Last]
[High-level overview of work progression]

**Key Decisions to Remember:**
- [Important decision 1]
- [Important decision 2]

[If priority items exist from sessions:]
**⭐ Priority Items:**
- [Priority from recent session]

**Features Status:**
- ✅ [Complete feature]
- 🔨 [In progress feature]
- ⏸️ [Blocked feature]

---

## 🏗️ Project Context

[Aggregated from all loaded sessions]

**Tech Stack:** [Technologies with versions]
**Architecture:** [Patterns and structure]

**Important Locations:**
- [Key directory/file]: [Purpose]
- [Another path]: [Purpose]

---

## 💡 User Preferences & Patterns

[Accumulated from all loaded sessions, deduplicated]

**Coding Style:**
- [Preference 1]
- [Preference 2]

**Workflow:**
- [Preference 1]
- [Preference 2]

**Tools & Approaches:**
- [Preference 1]

---

## 📚 Key Insights Library

[Most important insights from loaded sessions]

**Codebase Understanding:**
- [Critical insight 1]
- [Critical insight 2]

**Performance:**
- [Performance insight]

**Best Practices:**
- [Practice learned]

---

## 📊 Session History

**Sessions Loaded:** [Count] of [Total available]
**Filter Applied:** [Description of filter]
**Current Branch:** [branch name]
**Last Active:** [date of most recent session]

[If many sessions not loaded:]
**💡 Tip:** [X] older sessions available. Use `/session-start` with "Full Review" to see complete history.

---

**What would you like to work on today?**
```

### Step 1.6: Adaptive Presentation

**Prioritize based on work focus:**

**If focus = "Pending tasks":**
- Show "Pending Next Steps" first
- Highlight actionable items
- De-emphasize decisions/insights

**If focus = "Blocked items":**
- Show blockers prominently
- Include context about why blocked
- Suggest recent decisions that might help

**If focus = "Recent decisions":**
- Show "Key Decisions" section expanded
- Include rationale from sessions
- Reference related features/files

**If focus = "New implementation":**
- Show Project Context and Insights first
- Minimize WIP and pending tasks
- Focus on architecture and patterns

---

## Advanced Features

### Smart Defaults (After 3+ Sessions)

If user has established a pattern:

```markdown
💡 **Pattern Detected:**

Your last 5 sessions used: Resume Recent (last session only)

Apply this default automatically? (yes/no)
- Yes: Skip scope questions, load last session
- No: Ask me every time (current behavior)
```

### Stale Context Warning

If last session is old:

```markdown
⏰ **Stale Context Warning**

Last session was [X] days ago ([date]).

Context may be outdated. Recommendations:
- Review "Recent Decisions" to refresh memory
- Check if files changed significantly (git log)
- Consider a fresh project overview

Proceed with loading? (yes/no/fresh)
```

### Empty History Handling

If no sessions found:

```markdown
📭 **No Session History Found**

`.claude/memory/sessions.md` doesn't exist or is empty.

This is your first session! Would you like to:
- `start` - Start working with fresh context
- `explain` - Learn about session memory system
- `cancel` - Exit
```

### Cross-Branch Context

If sessions span multiple branches:

```markdown
🌳 **Multi-Branch History Detected**

Sessions available for:
- `main`: [X] sessions
- `feature/auth`: [Y] sessions
- `feature/payment`: [Z] sessions

Current branch: `[current]`

Load:
- `current` - Sessions for current branch only (recommended)
- `all` - Sessions from all branches
- `[branch name]` - Sessions for specific branch
```

---

## Rules for High-Quality Context Loading

1. **Respect user's filter** - Don't show more than requested
2. **Prioritize actionable items** - Next steps and blockers come first
3. **Aggregate intelligently** - Combine cumulative sections, don't duplicate
4. **Branch-aware** - Filter by branch when appropriate
5. **Time-aware** - Show dates, highlight stale context
6. **Focus-driven** - Present sections in order matching user's work focus
7. **Scannable format** - Use clear headings and emojis
8. **Handle edge cases:**
   - Empty history gracefully
   - Branch mismatches explicitly
   - Large histories with warnings
9. **End with action prompt** - "What would you like to work on today?"

---

## Troubleshooting

**Issue:** Too much information loaded
**Solution:** Use "Resume Recent" instead of "Full Review", or filter by feature

**Issue:** Can't find sessions for current branch
**Solution:** Check if sessions are tagged with branch. If not, load recent sessions regardless of branch

**Issue:** Context feels outdated
**Solution:** Highlight the "Last Active" date. If >1 week old, suggest fresh project review

**Issue:** User doesn't know what they worked on
**Solution:** Show features and decisions first, then ask work focus

**Issue:** No .claude/memory/sessions.md file
**Solution:** Explain this is first session, offer to start fresh or show how to use session memory

---

## Integration with Session End

This command loads summaries created by `/session-end`.

**Best Practice Workflow:**
1. End session: `/session-end` → Save context
2. [Time passes]
3. Start session: `/session-start` → Load context (with Phase 0 filtering)
4. Resume work efficiently

**Branch Filtering:**
Sessions saved with branch tags can be filtered when loading:
- Work on `feature/auth` → Only load `feature/auth` sessions
- Switch to `main` → Get warning, choose context source

---

## Examples

### Example 1: Resume Recent

```
User: /session-start

Claude: [Phase 0 questions]
What are you working on? 1, 2, 3, or 4

User: 1

Claude: What's your focus today?

User: Pending tasks

Claude: [Shows perfected intent]

User: y

Claude: 🔄 Session Context Loaded
Active WIP: Authentication implementation
Pending: 2 tasks
[Shows last session context focused on tasks]
```

### Example 2: Switch Context

```
User: /session-start

Claude: [Phase 0 questions]

User: 2

Claude: Which feature?

User: payment integration

Claude: What's your focus?

User: Recent decisions

Claude: [Shows perfected intent]

User: y

Claude: 🔄 Session Context Loaded
Loaded 3 sessions for payment integration
Key Decision: Using Stripe API with webhook validation
[Shows payment-related context, decisions highlighted]
```

### Example 3: Full Review

```
User: /session-start

Claude: [Phase 0 questions]

User: 3

Claude: ⚠️ You have 15 sessions. Load 5, 10, or all?

User: 5

Claude: What's your focus?

User: Review context

Claude: [Shows perfected intent]

User: y

Claude: 🔄 Session Context Loaded
Sessions: Last 5 (1 week of work)
[Shows aggregated context with all decisions, insights, preferences]
```

### Example 4: Branch Mismatch

```
User: /session-start

Claude: [Auto-detects branch switch]

⚠️ Branch Context Mismatch
Current: main
Last session: feature/auth

Load sessions for: current, previous, or both?

User: current

Claude: [Continues with Phase 0]
[Loads only main branch sessions]
```

---

## Version History

**v2.0 (2024-12-19):**
- ✨ Added Phase 0 prompt perfection
- ✨ User-controlled load scope and filtering
- ✨ Branch-aware context loading
- ✨ Stale context detection
- ✨ Work focus prioritization
- Enhanced with session adapter

**v1.0 (Previous):**
- Basic context loading
- Loaded all sessions
- No filtering or prioritization

---

**Ready to load your context with perfect clarity? Just type: `/session-start`**
