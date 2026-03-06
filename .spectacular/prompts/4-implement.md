---
name: 4-implement
description: (4/5) Execute tasks with per-task analyze→implement→validate gate.
---

## User Input

```text
$ARGUMENTS
```

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
Identify incomplete tasks (status: pending or in-progress).

Register all tasks upfront using TaskCreate so progress is visible:

```
For each task:
  TaskCreate: title="[NN] Task Name", status=pending
```

Display the execution plan before starting:
```
EXECUTION PLAN
Feature: [name]
Tasks: N total, X already complete, Y to execute
Order: task-01 → task-02 → ... (critical path)
```

### 3. Per-Task Execution Loop

For each pending task **in dependency order**:

---

#### PHASE A — Prepare

1. **TaskUpdate** → `in_progress`
2. Read `tasks/NN-name.md` fully — understand objective, context, acceptance criteria
3. **AI Analysis** (do this before touching any code):
   - Read ALL files mentioned in the task's "Context" section
   - Find existing patterns in the codebase that this task should follow
   - Identify the minimal change set needed
   - Flag any risk: naming conflicts, breaking changes, missing dependencies
   - State your recommended approach in 2-3 sentences
   ```
   TASK NN/N: [Name]
   Analyzing: [files read]
   Approach: [recommended implementation]
   Risk: [any flags, or "none"]
   ```

---

#### PHASE B — Implement

4. Execute the implementation with **tight focus** — only what this task requires.
   Do not refactor unrelated code. Do not add features beyond the task scope.
5. After implementation, briefly list every file created or modified.

---

#### PHASE C — Validate

6. Check each acceptance criterion from `tasks/NN-name.md` **explicitly**:

   For each criterion:
   - State what you are checking
   - Show evidence it is satisfied (code snippet, test output, or logical proof)
   - Mark as PASS or FAIL

   ```
   VALIDATION: Task NN
   [x] Criterion 1 — PASS: [evidence]
   [x] Criterion 2 — PASS: [evidence]
   [ ] Criterion 3 — FAIL: [reason]
   ```

7. If any criterion FAILS:
   - Do NOT update the task status to complete
   - Diagnose the root cause
   - Fix it and re-run validation from step 6
   - If the fix is blocked or unclear, **stop the pipeline** and report:
     ```
     BLOCKED: Task NN
     Criterion: [which one]
     Reason: [root cause]
     Action needed: [what the user must decide or provide]
     ```

8. Once ALL criteria PASS:
   - Check all `- [ ]` boxes in `tasks/NN-name.md` → `- [x]`
     (This triggers TaskStatusService in VS Code to auto-update status: done)
   - Update `tasks.md` index: change `#status/pending` → `#status/done` for this task
   - **TaskUpdate** → `completed`

---

#### PHASE D — Progress Report

After each completed task, display:

```
PROGRESS: N/TOTAL complete
[x] task-01: Name
[x] task-02: Name
[ ] task-03: Name  ← next
[ ] task-04: Name
[ ] task-05: Name
Estimated remaining: N tasks
```

---

### 4. Pipeline Completion

When all tasks are complete:

```
ALL TASKS COMPLETE
Feature: [name]
Tasks completed: N/N
Files modified: [list]
Next step: 5-validate
```
