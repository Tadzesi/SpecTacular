---
name: reflect
description: Analyze the current session for patterns, inefficiencies, and improvement opportunities. Proposes improvements to command files, library components, and project-profile.md based on what was observed. Run after a productive session to capture learnings.
disable-model-invocation: true
---

# /reflect - Skill Reflection and Improvement

Analyze this session and propose improvements to commands, library, and memory files.

---

## Step 1: Session Analysis

Review the conversation for:

1. **Repeated questions** - What did the user have to explain multiple times?
   → These should be added to project-profile.md

2. **Friction points** - Where did the workflow feel slow or repetitive?
   → Candidates for automation or better defaults

3. **Missing context** - What info was missing that the project profile should have?
   → Update project-profile.md

4. **Command improvements** - Did any command behave unexpectedly?
   → Propose command file edits

5. **Pattern detection** - Any recurring patterns in prompts?
   → Add to prompt-patterns.md

6. **Library gaps** - Was any Phase 0 step inadequate?
   → Propose library improvements

---

## Step 2: Generate Observations

For each finding, create a structured observation:

```
OBSERVATION [N]: [Category]

Issue: [What happened]
Impact: [Why this matters]
Root cause: [Why it happened]

Proposed fix:
- File: [which file to change]
- Change: [what to change]
- Rationale: [why this helps]
```

---

## Step 3: Propose Changes

Present proposals grouped by file:

**project-profile.md updates:**
- [Fact to add to the profile]

**Command file improvements:**
- [Command]: [specific improvement]

**Library improvements:**
- [Library file]: [specific improvement]

**Config updates:**
- [Config file]: [what to adjust]

---

## Step 4: Save to Observations

Append confirmed observations to `.claude/memory/observations.md`:

```markdown
## [Date] - Session Observations

[List of confirmed observations with proposed fixes]
```

---

## Step 5: Offer to Apply

For each proposal, ask:
"Apply this change now? (yes/no/later)"

If yes, apply the change immediately.
If later, it stays in observations.md for next session.

---

**Reflect on session: /reflect**
