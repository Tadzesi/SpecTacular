---
name: prompt
description: Transform any prompt into an unambiguous, executable format. Use when the user wants to refine or perfect a prompt, clarify a vague request, or ensure a task is well-specified before execution. Works with full project context - knows the project structure, tech stack, and session history so the user does not have to repeat this information.
argument-hint: "[your prompt or task description]"
---

# /prompt - Prompt Perfection (Project-Aware)

Transform any prompt into an unambiguous, executable format using full project context.
This skill ALWAYS loads project knowledge first so users never need to repeat project info.

This skill uses the **Unified Library System** with **Project Memory Integration**.

---

## STARTUP: Load Project Context (ALWAYS FIRST)

**Before any analysis, load known facts from memory:**

1. Read `.claude/memory/project-profile.md`
2. Read last 3 sessions from `.claude/memory/sessions.md` (for recent history)
3. Read `.claude/memory/prompt-patterns.md` if it exists (for learned patterns)

**Display what you know:**

```
PROJECT CONTEXT LOADED

Project: Claude Commands Library (claude-ideas) v4.2.0
Stack: Node.js, VitePress, Markdown commands, JSON config
Structure: .claude/commands/ (skills), .claude/library/ (core), .claude/memory/ (state)
Language: Bilingual (Slovak input OK, English output)
Output style: Plain text, max 80 chars, no markdown emojis

[If sessions.md has recent entries, show:]
Recent activity: [brief summary of last session work]
Learned patterns: [any relevant patterns from prompt-patterns.md]
```

**Skip asking about anything already in the profile.**
Only ask for information genuinely missing from the profile.

---

## Phase 0: Prompt Perfection

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Project-Aware (reads project-profile.md, skips known facts)

---

### Step 0.1: Initial Analysis

Examine the user's input and detect:
- Language (Slovak / English) - both accepted
- Prompt type (Question | Task | Bug Fix | Code Review | Feature | Config | Docs | Other)
- Core intent (what the user ultimately wants)
- Whether this is about THIS project or a different project

**If the user's prompt is about a different project**, ask:
"This looks like it's for [detected project]. Should I use context from that project instead, or proceed with claude-ideas project context?"

### Step 0.2: Project-Aware Completeness Check

Using facts already loaded from `project-profile.md`, evaluate which of the 6 criteria are already known:

**Already known from project profile (do NOT ask again):**
- Context: Node.js, VitePress, Windows 11, Git, GitHub Pages
- Tech Stack: Markdown commands, JSON config, ES modules
- Project structure: .claude/commands/, library/, memory/, config/
- User preferences: plain text output, kebab-case, bilingual, no auto-commit
- Code conventions: library-based architecture, Phase 0 pattern, adapters

**Still check (may be prompt-specific):**
- [ ] **Goal:** Clear desired outcome for THIS specific task
- [ ] **Scope:** Which specific files, commands, or components
- [ ] **Requirements:** Specific needs beyond defaults
- [ ] **Constraints:** Any special limitations for this task
- [ ] **Expected Result:** How to verify success

**Session-aware check:**
- Has this task been attempted before? (check sessions.md)
- Is there relevant context from previous sessions?
- Are there learned patterns that apply?

**Show pre-filled context:**
```
WHAT I ALREADY KNOW (from project profile):
- Environment: Windows 11, bash (Git for Windows)
- Stack: Node.js/ES modules, VitePress docs, Markdown command files
- Architecture: Library-based, Phase 0 pattern, .claude/commands/ + .claude/library/
- Preferences: Plain text terminal output, kebab-case files, bilingual OK
- Recent work: [from sessions.md if relevant]

WHAT I STILL NEED FOR THIS TASK:
[Only list genuinely missing items]
```

### Step 0.3: Targeted Clarification

Ask ONLY for genuinely missing information. Do not ask what the profile already answers.

**Priority order:**

**CRITICAL (must have before proceeding):**
- Anything about the specific Goal if unclear
- Exact scope (which command file? which library section?)

**IMPORTANT (ask if relevant):**
- Specific requirements that go beyond project defaults
- Success criteria for this specific task

**OPTIONAL (skip if not relevant):**
- Constraints beyond project conventions
- Performance or compatibility edge cases

**When multiple valid approaches exist:**
Present options clearly:

```
APPROACHES FOR THIS TASK:

Option 1: [Name] - [brief description]
  Pros: [advantages]  Cons: [disadvantages]
  Best when: [use case]

Option 2: [Name] - [brief description]
  Pros: [advantages]  Cons: [disadvantages]
  Best when: [use case]

RECOMMENDED: Option [X]
Reason: [why this fits the project conventions best]

Select: 1, 2, or describe your preference
```

**Project-specific option guidance:**
- Changes to `.claude/library/prompt-perfection-core.md` affect ALL commands
- Changes to `.claude/commands/` affect only that command
- New features should be optional and backwards compatible
- See `.claude/docs/comparisons.md` for decision trees

### Step 0.4: Correction & Structuring

Corrections to make:
1. Fix grammar/spelling (preserve technical terms EXACTLY)
2. Add project context that was implicit (file paths, command names)
3. Clarify scope using project conventions
4. Reference existing patterns where applicable

**Project-specific conventions to apply:**
- File paths: `.claude/commands/`, `.claude/library/`, `.claude/memory/`
- Command names: kebab-case, matching existing pattern
- Version references: semantic (v4.2.0), with dates

### Step 0.5: Output Perfect Prompt

```
PERFECTED PROMPT

Goal: [One clear sentence]

Context (from project profile):
- Project: Claude Commands Library v4.2.0
- Environment: Windows 11, bash, Node.js/VitePress
- Architecture: Library-based, Phase 0 pattern
- Relevant conventions: [project-specific rules that apply]
[Add any additional context specific to this task]

Scope:
- Files to modify: [list with .claude/ paths]
- Files to create: [list]
- Commands affected: [list of /commands that will change]
- Library sections affected: [if core library changes]

Requirements:
1. [First specific requirement]
2. [Second specific requirement]
[Follow existing patterns in: file.md (reference)]

Constraints:
- Follow project conventions in .claude/rules/
- Maintain backwards compatibility
- [Task-specific constraints]
Or: None beyond project defaults

Expected Result:
[Clear description of success]
Verify with: [specific test command or check]
Run: .\tests\validate-library-references.ps1 [if library refs change]

Changes Made:
- [List of corrections]
- Project context auto-filled from project-profile.md
- [Session history noted if relevant]
```

### Step 0.6: Approval Gate

```
PERFECTED PROMPT READY

Type: [prompt type]
Goal: [brief summary]
Scope: [files/commands affected]
Project context: Auto-loaded from profile
Confidence: [High/Medium]

Approve?
- y / yes - Execute this perfected prompt
- n / no  - Cancel
- modify [description] - Adjust the prompt
- explain [part] - Explain a decision
- options - Show alternative approaches
```

Wait for response. Never proceed automatically.

---

## Execution

After approval:

```
PROMPT PERFECTED AND APPROVED

What next?
- If this was a question: I can answer it now with full context
- If this was a task: I can begin implementation
- If this was planning: I can create an implementation plan
- If this was a code review: I can analyze the specified files
```

---

## Project-Specific Tips (shown when relevant)

When the task involves:

**Editing commands:** Reference `.claude/rules/command-conventions.md` for structure
**Editing core library:** All Phase 0 steps in `.claude/library/prompt-perfection-core.md`
**Adding features:** Check `.claude/config/` for relevant JSON configs
**Testing changes:** Run `.\tests\validate-library-references.ps1`
**Documentation:** VitePress docs in `docs/`, internal docs in `.claude/docs/`

---

## Session Learning

After each successful prompt perfection:
- Note any new project facts discovered to update `project-profile.md`
- Record patterns in `prompt-patterns.md` if a pattern is detected
- Suggest updating `project-profile.md` if new permanent facts are found

---

## Version History

**v3.0 (2026-03-03):**
- Converted to Skills format with YAML frontmatter
- STARTUP section: loads project-profile.md and sessions.md first
- Displays loaded context so user knows what is pre-filled
- Only asks for genuinely missing information
- Project-specific guidance for scope, options, and conventions
- Session-aware: references recent work from sessions.md

**v2.1 (2026-01-20):**
- AI Fluency alignment (Common Mistakes, AI Limitations)

**v2.0 (2024-12-19):**
- Migrated to unified library system

**v1.0:**
- Standalone Phase 0 implementation

---

## When to Use /prompt vs Other Commands

Use `/prompt` when:
- Quick tasks, simple prompts
- Single command or small scope change
- You want prompt cleanup without codebase exploration

Use `/prompt-hybrid` when:
- Complex tasks needing codebase exploration
- Multi-file or multi-command scope
- Pattern detection across the project needed

Use `/prompt-technical` when:
- Architecture decisions needed
- Code scaffolding or implementation options
- Best practices guidance for technical choices

---

**Project-aware prompt perfection - type: /prompt [your task]**
