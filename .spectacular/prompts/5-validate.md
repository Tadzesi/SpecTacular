---
name: 5-validate
description: (5/5) Validate implementation is complete - tasks, build, and tests pass.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Validate that the **implementation is production-ready**. This is step 5 of the pipeline:

```
1-spec -> 2-plan -> 3-tasks -> 4-implement -> 5-validate
```

## Workflow

### 1. Locate Current Feature

Find the active feature directory in specs/.

### 2. Run Validation Script

Execute:
```powershell
.spectacular/scripts/powershell/validate-implementation.ps1 -Json
```

### 3. Validation Checks

The script performs these checks:

#### Check 1: Tasks Complete
- All checkboxes in tasks.md must be marked `[x]`
- No incomplete tasks (`[ ]`) allowed

#### Check 2: Build Passes
- Detects project type (npm, dotnet, cargo, go)
- Runs appropriate build command
- Must complete without errors

#### Check 3: Tests Pass
- Runs appropriate test command
- All tests must pass

#### Check 4: Git Status (Optional)
- Working directory should be clean
- Or changes should be staged/committed

### 4. Handle Failures

If any check fails:
1. **Report the failure** with details
2. **Identify the fix** needed
3. **Do NOT mark as complete** until fixed

### 5. Report Results

Output validation summary:
- Tasks: PASS/FAIL (X/Y complete)
- Build: PASS/FAIL
- Tests: PASS/FAIL
- Overall: READY / NOT READY

## Non-Negotiable

From the project constitution:
> **Task Completion is Non-Negotiable** - Build must pass, tests must pass
