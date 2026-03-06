---
name: 2-plan
description: (2/5) Generate technical implementation plan from spec.
---

## User Input

```text
$ARGUMENTS
```

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

### 4. AI Deep Analysis (Before Writing Plan)

Before writing the plan, actively investigate:
- **Read existing similar implementations** in the codebase — how does analogous functionality work?
- **Identify reusable code** — what can be extended vs. rewritten?
- **Find the minimal change set** — what is the smallest correct implementation?
- **Evaluate alternatives** — are there 2-3 viable approaches? State the tradeoffs and recommend one.
- **Check for breaking changes** — will this affect existing functionality?

Output a recommendation block:
```
PLANNING ANALYSIS
Similar existing code: [files/patterns]
Recommended approach: [chosen option and why]
Alternatives considered: [briefly]
Breaking change risk: [yes/no + detail]
Minimal change set: [key files only]
```

### 5. Write Implementation Plan

Create `plan.md` with:

#### Tech Stack Analysis
- Technologies, frameworks, libraries needed (only what's actually required)
- Dependencies to add (if any) — justify each one

#### Project Structure
- Exact files to create (with paths)
- Exact files to modify (with reason)
- Files to NOT touch (explicit boundary)

#### Implementation Approach
- Chosen strategy (from analysis above)
- Key design decisions with rationale
- Integration points and interfaces

#### Risk Assessment
- Technical challenges ranked by severity
- Dependencies and their constraints
- Mitigation strategy for each risk

### 6. Report Completion

Output plan file path and next step: `3-tasks`
