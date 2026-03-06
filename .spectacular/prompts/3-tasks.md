---
name: 3-tasks
description: (3/5) Generate actionable task list with individual subtask files and acceptance criteria.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Generate an **actionable task list** where each subtask is a self-contained file with explicit
acceptance criteria. This is step 3 of the pipeline:

```
1-spec -> 2-plan -> 3-tasks -> 4-implement -> 5-validate
```

## Workflow

### 1. Locate Current Feature

Find the active feature directory in `specs/`.

### 2. Read Artifacts

Load and analyze:
- `spec.md` — What to build (acceptance criteria, requirements, user story)
- `plan.md` — How to build it (tech stack, affected files, approach)

### 3. AI Analysis: Optimal Task Breakdown

Before generating tasks, actively analyze:

- **Existing codebase patterns** — Read relevant existing files from `plan.md`'s project structure.
  How does similar functionality already work? What patterns should new tasks follow?
- **Dependency ordering** — Which tasks block others? What must be done first?
- **Risk identification** — Which tasks are highest risk? Flag them explicitly.
- **Task sizing** — Each task must be completable and verifiable in one focused session.
  If a task seems too large, split it. If two tasks are trivially sequential, merge them.
- **Best practice recommendation** — For each phase, recommend the industry-standard approach
  given the detected tech stack.

Output a brief analysis summary before generating task files:
```
TASK BREAKDOWN ANALYSIS
- Detected stack: [from plan.md]
- Total tasks: N
- Critical path: task-01 → task-03 → task-05
- Highest risk: task-04 (reason)
- Recommended approach: [brief]
```

### 4. Create Individual Subtask Files

Create the `tasks/` directory inside the feature folder.

For each task, create `tasks/NN-short-name.md` with this format:

```markdown
---
type: task
status: pending
created: YYYY-MM-DD
---

# Task NN: [Short Name]

## Objective

One clear sentence describing what this task accomplishes.

## Context

Why this task exists and how it fits into the larger feature.
Reference relevant files from plan.md.

## Implementation Notes

Specific guidance: which files to modify, which patterns to follow,
which existing code to reference. Be concrete.

## Acceptance Criteria

- [ ] Criterion 1 — specific, verifiable, unambiguous
- [ ] Criterion 2 — testable outcome, not a process step
- [ ] Criterion 3 — observable result

## Definition of Done

The task is complete ONLY when ALL acceptance criteria above are checked.
```

**Acceptance criteria rules:**
- Each criterion must be independently verifiable (AI can check it without running the project)
- At least one criterion must be a build/test/runtime check where applicable
- Avoid process criteria ("did the work") — use outcome criteria ("the result exists/works")

### 5. Create tasks.md Index

Create `tasks.md` as an overview and tracking index:

```markdown
# Tasks: [Feature Name]

## Overview

| # | Task | Status | File |
|---|------|--------|------|
| 01 | [Short Name] | #status/pending | [[tasks/01-short-name]] |
| 02 | [Short Name] | #status/pending | [[tasks/02-short-name]] |

## Progress

- Total: N tasks
- Complete: 0
- In Progress: 0
- Remaining: N

## Critical Path

task-01 → task-03 → task-05 (reason for ordering)

## Notes

[Any overall implementation notes or warnings]
```

### 6. Report Completion

Output:
- Feature directory path
- Total task count with file list
- Critical path summary
- Next step: `4-implement`
