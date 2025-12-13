---
description: (4/5) Execute all tasks defined in tasks.md one by one.
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

Execute the **implementation plan** by processing all tasks. This is step 4 of the pipeline:

```
1-spec -> 2-plan -> 3-tasks -> 4-implement -> 5-validate
```

## Workflow

### 1. Locate Current Feature

Find the active feature directory in specs/.

### 2. Read Task List

Load `tasks.md` and identify all incomplete tasks (marked `#status/pending` or `#status/in-progress`).

### 3. Execute Tasks

For each incomplete task (marked `#status/pending` in tasks.md):

1. **Mark in progress** - Update:
   - TodoWrite with task status
   - tasks.md table: `#status/pending` → `#status/in-progress`
   - Task file YAML frontmatter: `status: pending` → `status: in-progress`

2. **Execute the task** - Perform the actual work following the steps

3. **Verify completion** - Check all acceptance criteria in the task file

4. **Mark complete** - Update ALL of these:
   - TodoWrite status → completed
   - tasks.md table: `#status/in-progress` → `#status/done`
   - Task file YAML frontmatter: `status: in-progress` → `status: done`
   - Task file acceptance criteria: `- [ ]` → `- [x]` (check each criterion)

### Task Execution Guidelines

- Complete tasks **in order** (respect dependencies)
- **One task at a time** - finish before starting next
- If a task fails, **stop and report** the issue
- Keep changes **focused** on the current task

### 4. Progress Reporting

After each task:
1. **Update Progress Summary** in tasks.md - increment Done count, decrement Remaining
2. **Report**:
   - Task completed
   - Files created/modified
   - Any issues encountered

### 5. Report Completion

When all tasks are done, output:
- Total tasks completed
- Files created/modified
- Next step: `/spectacular.5-validate`
