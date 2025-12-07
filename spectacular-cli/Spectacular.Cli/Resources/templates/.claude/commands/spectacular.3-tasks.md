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

Find the active feature directory in `specs/`.

### 2. Read Artifacts

Load and analyze:
- `spec.md` - What to build
- `plan.md` - How to build it

### 3. Create Task Structure

Create the following structure in the feature directory:

```
specs/<feature>/
├── tasks.md           # Task overview with links
└── tasks/             # Individual task files
    ├── 01-setup.md
    ├── 02-models.md
    ├── 03-service.md
    └── ...
```

### 4. Generate tasks.md (Overview)

Create `tasks.md` with status table linking to individual task files:

```markdown
# Tasks: [Feature Name]

## Phase 1: Setup

| Task | Description | Status |
|------|-------------|--------|
| [01-setup](./tasks/01-setup.md) | Create project structure | #status/pending |

## Phase 2: Implementation

| Task | Description | Status |
|------|-------------|--------|
| [02-models](./tasks/02-models.md) | Create data models | #status/pending |
| [03-service](./tasks/03-service.md) | Implement service | #status/pending |

## Phase 3: Testing & Validation

| Task | Description | Status |
|------|-------------|--------|
| [04-tests](./tasks/04-tests.md) | Write unit tests | #status/pending |
| [05-validate](./tasks/05-validate.md) | Run build and verify | #status/pending |

## Progress Summary

| Phase | Total | Done | Remaining |
|-------|-------|------|-----------|
| Setup | 1 | 0 | 1 |
| Implementation | 2 | 0 | 2 |
| Testing & Validation | 2 | 0 | 2 |
| **Total** | **5** | **0** | **5** |
```

### 5. Generate Individual Task Files

For each task, create a file in `tasks/` folder:

```markdown
---
type: task
status: pending
created: [DATE]
---

# Task 01: Setup

## Objective

Brief description of what this task accomplishes.

## Steps

1. Step one
2. Step two
3. Step three

## Acceptance Criteria

- [ ] Criterion 1
- [ ] Criterion 2

## Notes

Any implementation notes or considerations.
```

### Task Guidelines

- Each task should be **atomic** (completable in one session)
- Tasks should be **ordered** by dependency
- Number tasks with 2-digit prefix (01, 02, 03...)
- Include **setup**, **implementation**, **testing**, and **validation** phases
- Use clear, actionable language in task titles

### 6. Report Completion

Output:
- tasks.md file path
- List of created task files
- Total task count
- Next step: `4-implement`
