---
description: (3/5) Generate actionable task list from spec and plan.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Generate an **actionable task list** from the specification and plan. This is step 3 of the pipeline:

```
1-spec -> 2-plan -> 3-tasks -> 4-implement -> 5-validate
```

## Workflow

### 1. Locate Current Feature

Find the active feature directory in specs/.

### 2. Read Artifacts

Load and analyze:
- `spec.md` - What to build
- `plan.md` - How to build it

### 3. Generate Task List

Create `tasks.md` with checkbox format:

```markdown
# Tasks: [Feature Name]

## Setup
- [ ] Task 1: Description
- [ ] Task 2: Description

## Implementation
- [ ] Task 3: Description
- [ ] Task 4: Description

## Testing
- [ ] Task 5: Write unit tests
- [ ] Task 6: Integration tests

## Validation
- [ ] Task 7: Run build
- [ ] Task 8: Run tests
- [ ] Task 9: Manual verification
```

### Task Guidelines

- Each task should be **atomic** (completable in one session)
- Tasks should be **ordered** by dependency
- Include **setup**, **implementation**, **testing**, and **validation** phases
- Use clear, actionable language

### 4. Report Completion

Output tasks file path, task count, and next step: `4-implement`
