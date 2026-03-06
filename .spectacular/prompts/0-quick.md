---
name: 0-quick
description: (ALL) Orchestrates the full pipeline - spec, plan, tasks, implement, validate - in one command.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

This command **orchestrates** the complete simplified pipeline:

```
1-spec -> 2-plan -> 3-tasks -> 4-implement -> 5-validate
```

Each step is a separate command that can also be run independently.

## Pipeline Steps

Execute each step in order. Report progress after each step.

### Step 1: Spec (`1-spec`)

**Goal**: Create feature branch and specification

1. Generate branch name (2-4 words from description)
2. Find next feature number (check specs/, branches)
3. Run: `.spectacular/scripts/powershell/create-new-feature.ps1 -Json`
4. Write simplified spec.md

**Output**: Branch name, spec file path

### Step 2: Plan (`2-plan`)

**Goal**: Generate technical implementation plan

1. Run: `.spectacular/scripts/powershell/setup-plan.ps1 -Json`
2. Write plan.md with tech stack and project structure

**Output**: Plan file path

### Step 3: Tasks (`3-tasks`)

**Goal**: Generate individual subtask files with acceptance criteria

1. AI analysis: optimal task breakdown, dependency ordering, risk flags
2. Create `tasks/NN-name.md` for each task with YAML frontmatter + acceptance criteria
3. Create `tasks.md` as index with status overview

**Output**: Task files list, critical path, task count

### Step 4: Implement (`4-implement`)

**Goal**: Execute each task through prepare→implement→validate gate

For each task:
1. TaskCreate → register all tasks upfront for progress visibility
2. TaskUpdate → in_progress
3. **PREPARE**: Read task file, analyze codebase, state approach
4. **IMPLEMENT**: Execute with tight focus (task scope only)
5. **VALIDATE**: Check every acceptance criterion explicitly — PASS or FAIL
6. If any criterion FAILS: fix and re-validate before continuing
7. If BLOCKED: stop pipeline, report reason
8. Check all criteria checkboxes → TaskUpdate → completed
9. Display progress: N/TOTAL complete

### Step 5: Validate (`5-validate`)

**Goal**: Full pipeline validation + AI feature review

1. Check all tasks complete (status: done in frontmatter)
2. Build passes
3. Tests pass
4. AI spec compliance check (re-read spec.md acceptance criteria)
5. AI feature review: quality assessment + recommendations

## Final Report

After all steps complete, report:
- Feature name and branch
- Files created/modified
- Validation summary (tasks/build/tests/spec)
- AI review and next step recommendations
