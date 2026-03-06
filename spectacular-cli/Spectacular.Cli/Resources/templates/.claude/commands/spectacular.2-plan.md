---
description: (2/5) Generate technical implementation plan from spec.
---

## User Input

```text
$ARGUMENTS
```

## Pre-Processing (REQUIRED)

Before executing this command:
1. **Detect Language**: Identify the language of the user's input
2. **Fix Typos**: Correct any spelling or grammatical errors to understand intent
3. **Clarify Intent**: If the request is ambiguous, ask for clarification
4. **Respond in User's Language**: Use the language from CLAUDE.md preferences or the prompt language

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Generate a **technical implementation plan** from the specification. This is step 2 of the pipeline:

```
1-spec -> 2-plan -> 3-tasks -> 4-implement -> 5-validate
```

## Workflow

### 1. Locate Current Feature

Find the active feature directory in specs/ (check current branch or most recent).

### 2. Read Specification

Load and analyze `spec.md` to understand requirements.

### 3. Setup Plan File

Run:
```powershell
.spectacular/scripts/powershell/setup-plan.ps1 -Json
```

### 3.5. AI Deep Analysis (Before Writing Plan)

Before writing the plan, actively investigate the codebase:
- **Read existing similar implementations** — find analogous functionality. How does it work?
  What patterns should new code follow?
- **Identify reusable code** — what can be extended vs. rewritten from scratch?
- **Evaluate alternatives** — if 2-3 viable approaches exist, state the tradeoffs and recommend one.
- **Check for breaking changes** — will this affect existing functionality?
- **Find the minimal change set** — what is the smallest correct implementation?

Output a recommendation block:
```
PLANNING ANALYSIS
Similar existing code: [files/patterns]
Recommended approach: [chosen option and why]
Alternatives considered: [briefly]
Breaking change risk: [yes/no + detail]
Minimal change set: [key files only]
```

### 4. Write Implementation Plan

Create `plan.md` with:

#### Tech Stack Analysis
- Technologies, frameworks, libraries needed (only what's actually required)
- Dependencies to add — justify each one

#### Project Structure
- Exact files to create (with paths)
- Exact files to modify (with reason)
- Files explicitly NOT to touch (boundary definition)

#### Implementation Approach
- Chosen strategy (from analysis above, with rationale)
- Key design decisions and why
- Integration points and interfaces

#### Risk Assessment
- Technical challenges ranked by severity
- Dependencies and their constraints
- Mitigation strategy for each risk

## Markdown Formatting

When generating plan.md, use hierarchical numbering with proper nested list syntax:
- Main steps: `1.`, `2.`, `3.`
- Sub-steps: Use `-` prefix: `- 1.1.`, `- 1.2.`, `- 2.1.`
- Sub-sub-steps: Use `-` prefix: `- 1.1.1.`, `- 1.1.2.` (if needed)

**IMPORTANT**: Sub-items MUST use `-` prefix for proper markdown rendering in VS Code preview.

### 5. Report Completion

Output plan file path, the chosen approach (from 3.5 analysis), and next step: `/spectacular.3-tasks`
