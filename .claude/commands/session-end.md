# Session End - Memory Capture with Phase 0

Generate a comprehensive session summary and append it to `.claude/memory/sessions.md`.

This command uses **Phase 0 prompt perfection** to ensure you capture exactly what matters for your next session.

---

## Phase 0: Prompt Perfection

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Session (from `.claude/library/adapters/session-adapter.md`)

### Step 0.1: Initial Analysis

**Detected Language:** English
**Prompt Type:** Session Management (Save Context)
**Core Intent:** Capture session context for future resumption

### Step 0.2: Completeness Check

Verify the following session-specific criteria:

**Universal Criteria:**
- [ ] **Goal:** Save session context (auto-filled)
- [ ] **Context:** Current branch, session duration, work type (will auto-detect)
- [ ] **Scope:** What to capture (need to ask user)
- [ ] **Requirements:** Format and sections (use comprehensive template)
- [ ] **Constraints:** None (optional)
- [ ] **Expected Result:** Next session can resume without ramp-up (auto-filled)

**Session-Specific Criteria:**
- [ ] **Capture Scope:** What to save (all/specific feature/decisions only)
- [ ] **Priority Level:** What matters most
- [ ] **Branch Context:** Which feature/branch (auto-detect from git)
- [ ] **Completeness Status:** What's done vs. remains
- [ ] **Next Session Focus:** What to work on next time

### Step 0.3: Clarification

**Ask user for capture scope:**

```markdown
**Session End - What Should I Capture?**

Choose how to save this session:

1. **Full Session** (Recommended)
   - Comprehensive capture of everything
   - All decisions, code changes, problems solved, insights
   - Best for: Regular session endings

2. **Feature Focus**
   - Concentrate on specific feature or component
   - Useful for: Multi-topic sessions where one feature matters most

3. **Key Decisions Only**
   - Just architectural and technical decisions
   - Useful for: Planning or design sessions

4. **Minimal**
   - Only next steps and blockers
   - Useful for: Quick checkpoint saves

Select: 1, 2, 3, or 4
```

**If user selects "Feature Focus" (option 2), ask:**
```markdown
Which feature or component should I prioritize?
Example: "Focus on authentication changes" or "Just the API refactoring"
```

**Always ask (regardless of selection):**
```markdown
What's the single most important thing to remember for next session?
This ensures critical context isn't buried in details.
```

**Optional question:**
```markdown
Should I exclude any work-in-progress or experimental code? (yes/no/specify)
```

### Step 0.4-0.5: Structure Perfected Capture Intent

After gathering responses, create:

```markdown
**✨ Perfected Session Capture Intent:**

**Goal:** Capture session context for [resuming work / specific feature / decisions]

**Context:**
- Current Branch: [from git]
- Session Type: [implementation/planning/debugging/refactoring]
- Changed Files: [from git status]

**Capture Scope:**
- Focus: [Full / Feature X / Decisions / Minimal]
- Priority: [Most important thing to remember]
- Exclude: [None / Experimental code / Specify]

**Expected Result:**
Next session will:
- Resume work without ramp-up time
- Understand context and decisions
- Have clear next steps

**Format:** Comprehensive 10-section summary appended to `.claude/memory/sessions.md`
```

### Step 0.6: Approval Gate

```markdown
⏸️ **Ready to Capture Session - Awaiting Approval**

**Summary:**
- Scope: [Full / Focused on X / Decisions only / Minimal]
- Priority: [Key thing to remember]
- Format: Comprehensive 10-section summary

After approval, I will:
1. Analyze the current session
2. Generate summary based on your scope
3. Append to .claude/memory/sessions.md
4. Extract facts to project profile (for memory recall)
5. Show confirmation of what was saved

**Reply with:**
- `y` or `yes` — Capture session with this configuration
- `n` or `no` — Cancel
- `modify [changes]` — Adjust the capture scope
```

**Wait for user approval before proceeding.**

---

## Phase 1: Generate Enhanced Summary

**After user approves, proceed with session capture based on perfected intent.**

### Step 1.1: Auto-Detect Git Context

Gather context automatically:

```bash
# Current branch
git branch --show-current

# Changed files
git status --short

# Recent commits (if applicable)
git log --oneline -3
```

### Step 1.2: Analyze Session

Review the current session for:
- Decisions made
- Code changes (files modified/created/deleted)
- Features implemented or in progress
- Problems solved
- Technical insights
- User preferences discovered
- Active work in progress
- Project structure learnings

**Apply capture scope filter:**
- If "Feature Focus": Prioritize that feature, mention others briefly
- If "Decisions Only": Focus on "Decisions Made" section, summarize rest
- If "Minimal": Focus on "Active WIP" and "Next Steps" only
- If "Full": Capture all sections comprehensively

### Step 1.3: Generate Summary Using Template

Use the comprehensive 10-section format:

```markdown
---

## Session: [DATE] | [BRANCH/FEATURE]

[If Feature Focus: **Primary Focus: [Feature Name]**]

### Decisions Made
- **[Decision]**: [Rationale and trade-offs considered]
[Only include if scope allows - skip for "Minimal"]

### Code Changes
- **[File/Component]**: [What changed and why]
- Include: new files, modified files, deleted files
[Filtered by feature focus if applicable]

### Features Implemented
- **[Feature Name]**: [Status: Complete/In Progress/Blocked] - [Brief description]
[Prioritize focused feature if specified]

### Problems Solved
- **[Problem]**: [Root cause] → [Solution applied]
[Only include if scope allows]

### Technical Stack & Architecture
- **[Technology/Pattern]**: [Why chosen, how used in project]
[Only new items from this session]
[Skip for "Minimal" scope]

### Key Insights
- **[Insight]**: [Why this matters for the project]
[Codebase understanding, performance discoveries, best practices]
[Skip for "Minimal" scope]

### User Preferences & Patterns
- **[Preference/Pattern]**: [Description]
[Coding style, preferred approaches, workflow preferences]
[Only new preferences discovered this session]
[Skip for "Minimal" scope]

### Active Work In Progress
- **Current task**: [What you're in the middle of]
- **Uncommitted changes**: [Files with pending changes]
- **Current file location**: [Where you left off - file path, line number if relevant]
- **Blockers**: [Anything preventing progress]
[Always include - this is critical for resumption]

### Project Structure Notes
- **[Component/Directory]**: [Purpose and organization]
[Only new or clarified items from this session]
[Skip for "Minimal" scope]

### Next Steps
- [ ] [Actionable TODO for next session - be specific]
- [ ] [Include file paths and methods if applicable]
[Always include - essential for next session]

**⭐ PRIORITY:** [The single most important thing to remember - from user input]

### Context for Next Session
[2-3 sentences: What was I working on? What state is it in? What should I focus on next?]
[Always include - critical summary]

### Diligence Summary *(AI Fluency - NEW v2.1)*
**AI-Assisted Content Requiring Verification:**
- [Code/content generated by AI that human should verify before deployment]
- [Include file paths and specific sections]

**Transparency Notes:**
- [What was AI-generated vs human-written]
- [Any assumptions made by AI that need validation]

**Deployment Checklist:**
- [ ] [Specific verification needed before using AI output]
- [ ] [Testing required for AI-generated code]
- [ ] [Review needed for AI recommendations]

[Only include if AI-generated content exists - skip if purely human work]

---
```

**Apply Priority Highlighting:**
If user specified "most important thing", ensure it's:
1. Mentioned in relevant section
2. Highlighted in "PRIORITY" line
3. Referenced in "Context for Next Session"

### Step 1.4: Append to Memory

Append the generated summary to `.claude/memory/sessions.md`

### Step 1.5: Extract Facts to Project Profile (NEW v3.0)

**Purpose:** Extract structured facts from the session and save them to the project profile for memory recall in future sessions.

**Process:**

1. **Check if profile exists:** Read `.claude/memory/project-profile.md`
   - If it does not exist: Ask user "I can create a project profile to remember facts (tech stack, infrastructure, preferences) between sessions. Create one? (yes/no)"
   - If user declines: skip this step
   - If it does exist or user approves creation: continue

2. **Scan session for extractable facts** in these categories:
   - **Infrastructure:** Servers, databases, cloud providers, CI/CD, Docker, hosting
   - **Tech Stack:** Languages, frameworks, libraries, versions, package managers
   - **Deployment:** Environments, URLs, deploy processes, staging/production
   - **Project Structure:** Key directories, entry points, config file locations
   - **User Preferences:** Coding style, naming conventions, preferred tools, workflow habits
   - **Workflows:** Build commands, test commands, deploy steps, common tasks

3. **Read existing profile** and merge new facts:
   - Do not duplicate facts already in the profile
   - Update facts that have changed (e.g., version upgrade)
   - Append new facts under the appropriate section header
   - Use simple `key: value` format (one fact per line, prefixed with `- `)

4. **Write updated profile** to `.claude/memory/project-profile.md`

5. **Show extraction summary:**
```markdown
**Profile Updated:**
- New facts: [count]
- Updated facts: [count]
- Categories: [list of sections that changed]
```

**If no facts were discovered this session:**
```markdown
**Profile:** No new facts to extract this session.
```

### Step 1.6: Confirm Completion

Show comprehensive confirmation:

```markdown
✅ **Session Saved to Memory**

**Captured:**
- Decisions: [count] [or "Focus: decisions only" or "Skipped: minimal scope"]
- Code Changes: [count] files [or "Filtered to: feature X"]
- Features: [count] ([X] complete, [Y] in progress) [or "Focus: feature X"]
- Problems Solved: [count] [or "Skipped"]
- Technical Notes: [count] [or "Skipped"]
- Insights: [count] [or "Skipped"]
- Preferences: [count] new patterns [or "Skipped"]
- WIP: [status description] ← **Always captured**
- Next Steps: [count] pending ← **Always captured**
- Diligence: [count] items needing verification ← **(AI Fluency NEW)**

**Priority Item:** [User's most important thing]

**Session Scope:** [Full / Feature-focused / Decisions only / Minimal]
**Session State:** [One-liner about overall progress]

**File:** `.claude/memory/sessions.md`

---

Run `/session-start` next time to load full context.
```

---

## Advanced Features

### Smart Defaults (After 3+ Sessions)

If user has established a pattern, offer:

```markdown
💡 **Pattern Detected:**

Your last 5 sessions used: [Full session capture]

Apply this default automatically? (yes/no)
- Yes: Skip scope questions, use your preference
- No: Ask me every time (current behavior)
```

### Git Branch Awareness

If working on feature branch:
```markdown
**Branch Context:** feature/user-authentication

Summary will be tagged with branch name for easy filtering during /session-start
```

### Session Duration Tracking

If session start time is known:
```markdown
**Session Duration:** 2 hours 15 minutes
```

### Empty Session Detection

If no significant changes detected:
```markdown
⚠️ **Empty Session Detected**

This session appears to have:
- No code changes
- No decisions made
- No problems solved

Still want to save? (yes/no)
- Yes: Save minimal context (good for checkpoint)
- No: Cancel session save
```

---

## Rules for High-Quality Summaries

1. **Be comprehensive but concise** - Include all relevant context, avoid verbosity
2. **Focus on WHY, not just WHAT** - Capture reasoning behind decisions
3. **Prioritize resumability** - Information should enable quick restart
4. **Apply user's scope** - Respect full/feature/decisions/minimal choice
5. **Highlight priority** - Ensure user's "most important thing" is prominent
6. **Skip empty sections** - Don't include sections with no content
7. **Always include critical sections:**
   - Active Work In Progress (mandatory)
   - Next Steps (mandatory if work remains)
   - Context for Next Session (mandatory)
   - Priority Item (mandatory - from user input)
8. **Be specific with paths** - Include file paths, line numbers, component names
9. **Filter intelligently** - Feature-focus doesn't mean ignore other work, just prioritize

---

## Troubleshooting

**Issue:** User unsure which scope to choose
**Solution:** Recommend "Full Session" unless:
- They only worked on one feature → "Feature Focus"
- They only made planning decisions → "Decisions Only"
- They want quick checkpoint → "Minimal"

**Issue:** "Most important thing" is unclear
**Solution:** Ask: "If you could only remember ONE thing next session, what would it be?"

**Issue:** Too much work-in-progress to capture
**Solution:** Suggest: "Commit or stash some changes first, then save session"

**Issue:** Git context not available
**Solution:** Manual input: Ask user for branch name and changed files

---

## Integration with Session Start

This command creates session summaries that `/session-start` will load.

**Best Practice Workflow:**
1. End session: `/session-end` → Capture context
2. [Time passes, work on other things]
3. Start session: `/session-start` → Load context
4. Resume work with full context

**Tagged by Branch:**
Sessions are tagged with git branch, allowing `/session-start` to filter:
- "Load sessions for current branch only"
- "Load sessions for all branches"

---

## Examples

### Example 1: Full Session

```
User: /session-end

Claude: [Phase 0 questions]
Choose scope: 1, 2, 3, or 4

User: 1

Claude: What's the most important thing to remember?

User: We decided to use JWT tokens for authentication

Claude: [Shows perfected intent, waits for approval]

User: y

Claude: ✅ Session Saved
Captured: 3 decisions, 7 files, 2 features (1 complete, 1 in progress)...
Priority: JWT tokens decision
```

### Example 2: Feature Focus

```
User: /session-end

Claude: [Phase 0 questions]

User: 2

Claude: Which feature?

User: Focus on payment integration

Claude: What's most important to remember?

User: Stripe API keys need to be in environment variables

Claude: [Shows perfected intent]

User: y

Claude: ✅ Session Saved
Scope: Feature-focused (payment integration)
Priority: Stripe API keys in env vars
```

### Example 3: Minimal

```
User: /session-end

Claude: [Phase 0 questions]

User: 4

Claude: What's most important?

User: Still debugging the login timeout issue

Claude: [Shows perfected intent]

User: y

Claude: ✅ Session Saved (Minimal)
Captured: WIP (login timeout debugging), 2 next steps
Priority: Login timeout issue ongoing
```

---

## Version History

**v3.0 (2026-02-06):**
- Added Step 1.5: Extract Facts to Project Profile
- Session facts are now saved to `.claude/memory/project-profile.md`
- First run prompts user to opt in to project profile
- Merged facts avoid duplication with existing profile entries

**v2.1 (2026-01-20):**
- Diligence Summary section (AI Fluency Framework)
- Tracks AI-assisted content requiring verification
- Transparency notes for human vs AI work
- Deployment checklist for AI outputs
- Aligned with Anthropic's AI Fluency 4Ds

**v2.0 (2024-12-19):**
- Added Phase 0 prompt perfection
- User-controlled capture scope
- Priority highlighting
- Git branch awareness
- Enhanced with session adapter

**v1.0 (Previous):**
- Basic session capture
- Fixed 10-section format
- No user customization

---

**Ready to save your session with perfect clarity? Just type: `/session-end`**
