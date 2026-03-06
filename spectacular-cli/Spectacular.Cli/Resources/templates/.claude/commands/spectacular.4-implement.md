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

Execute each task through a strict **prepare → implement → validate** gate.
A task only completes when ALL its acceptance criteria pass. This is step 4:

```
1-spec -> 2-plan -> 3-tasks -> 4-implement -> 5-validate
```

## Workflow

### 1. Locate Current Feature

Find the active feature directory in `specs/`.

### 2. Load Task List

Read `tasks.md` and enumerate all task files in `tasks/`.
Identify pending tasks (status: pending or in-progress).

Register all pending tasks upfront using TaskCreate so progress is visible:
```
For each pending task:
  TaskCreate: title="[NN] Task Name", status=pending
```

Display the execution plan before starting:
```
EXECUTION PLAN
Feature: [name]
Tasks: N total, X already complete, Y to execute
Order: 01 → 02 → ... (critical path)
```

### 3. Per-Task Execution Loop

For each pending task **in dependency order**:

---

#### PHASE A — Prepare

1. **TaskUpdate** → `in_progress`
2. Update tasks.md: `#status/pending` → `#status/in-progress`
3. Update task file YAML: `status: pending` → `status: in-progress`
4. Read `tasks/NN-name.md` fully — objective, context, acceptance criteria
5. **AI Analysis** (do this BEFORE touching any code):
   - Read ALL files mentioned in the task's Context section
   - Find existing patterns in the codebase this task should follow
   - Identify the minimal change set needed
   - Flag any risk: naming conflicts, breaking changes, missing dependencies
   - State your recommended approach in 2-3 sentences
   ```
   TASK NN/N: [Name]
   Analyzing: [files read]
   Approach: [recommendation]
   Risk: [flags, or "none"]
   ```

---

#### PHASE B — Implement

6. Execute with **tight focus** — only what this task requires.
   Do not refactor unrelated code. Do not add features beyond task scope.
7. List every file created or modified after implementation.

---

#### PHASE C — Validate

8. Check each acceptance criterion from `tasks/NN-name.md` **explicitly**:

   For each criterion:
   - State what you are checking
   - Show evidence it passes (code snippet, test output, or logical proof)
   - Mark PASS or FAIL

   ```
   VALIDATION: Task NN
   [x] Criterion 1 — PASS: [evidence]
   [x] Criterion 2 — PASS: [evidence]
   [ ] Criterion 3 — FAIL: [reason]
   ```

9. If any criterion **FAILS**:
   - Do NOT mark the task complete
   - Diagnose the root cause (read the relevant files — do not guess)
   - Fix and re-run validation from step 8
   - If fix is blocked: **stop the pipeline** and report:
     ```
     BLOCKED: Task NN
     Criterion: [which one]
     Root cause: [diagnosis]
     Action needed: [what must be decided or provided]
     ```

10. Once ALL criteria **PASS**:
    - Check all `- [ ]` boxes → `- [x]` in `tasks/NN-name.md`
      (VS Code TaskStatusService will auto-update YAML `status: done`)
    - Update tasks.md table: `#status/in-progress` → `#status/done`
    - Update Progress Summary: increment Done, decrement Remaining
    - **TaskUpdate** → `completed`

---

#### PHASE D — Progress Report

After each completed task, display:
```
PROGRESS: N/TOTAL complete
[x] 01: Name
[x] 02: Name
[ ] 03: Name  ← next
[ ] 04: Name
Remaining: N tasks
```

---

### 4. Report Completion

When all tasks are complete:
```
ALL TASKS COMPLETE
Feature: [name]
Tasks completed: N/N
Files modified: [list]
Next step: /spectacular.5-validate
```
