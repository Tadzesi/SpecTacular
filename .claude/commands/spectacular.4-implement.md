---
description: (4/5) Execute all tasks defined in tasks.md one by one.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Execute the **implementation plan** by processing all tasks. This is step 4 of the pipeline:

```
1-spec -> 2-plan -> 3-tasks -> 4-implement -> 5-validate
```

## Workflow

### 1. Locate Current Feature

Find the active feature directory in specs/.

### 2. Read Task List

Load `tasks.md` and identify all incomplete tasks (marked `- [ ]`).

### 3. Execute Tasks

For each incomplete task:

1. **Mark in progress** - Update TodoWrite with task status
2. **Execute the task** - Perform the actual work
3. **Verify completion** - Ensure task requirements are met
4. **Mark complete** - Update both:
   - TodoWrite status
   - tasks.md checkbox (`- [ ]` â†’ `- [x]`)

### Task Execution Guidelines

- Complete tasks **in order** (respect dependencies)
- **One task at a time** - finish before starting next
- If a task fails, **stop and report** the issue
- Keep changes **focused** on the current task

### 4. Progress Reporting

After each task, report:
- Task completed
- Files created/modified
- Any issues encountered

### 5. Report Completion

When all tasks are done, output:
- Total tasks completed
- Files created/modified
- Next step: `5-validate`
