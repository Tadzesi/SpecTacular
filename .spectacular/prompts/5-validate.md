---
name: 5-validate
description: (5/5) Full pipeline validation - tasks, build, tests - plus AI review and next steps.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Validate the **implementation is production-ready** and provide an AI review with
recommendations. This is step 5 of the pipeline:

```
1-spec -> 2-plan -> 3-tasks -> 4-implement -> 5-validate
```

## Workflow

### 1. Locate Current Feature

Find the active feature directory in `specs/`.

### 2. Pre-Validation: Read All Artifacts

Load `spec.md`, `plan.md`, `tasks.md`, and all files in `tasks/`.
This gives the full picture for AI review.

### 3. Run Validation Script

Execute:
```powershell
.spectacular/scripts/powershell/validate-implementation.ps1 -Json
```

### 4. Validation Checks

#### Check 1: All Tasks Complete
- Every `tasks/NN-name.md` must have `status: done` in frontmatter
  OR all acceptance criteria checkboxes must be `[x]`
- `tasks.md` index must show all entries as `#status/done`
- No `- [ ]` checkboxes remain anywhere in `tasks/`

#### Check 2: Build Passes
- Detects project type (npm, dotnet, cargo, go, python)
- Runs the appropriate build command
- Must complete with zero errors

#### Check 3: Tests Pass
- Runs the appropriate test command for the project type
- All tests must pass — zero failures

#### Check 4: Spec Compliance (AI Check)
- Re-read `spec.md` acceptance criteria
- For each acceptance criterion in the spec, verify the implementation satisfies it
- This is an AI code review — read the relevant changed files
- Flag any criterion that is implemented incorrectly or incompletely

### 5. Handle Failures

If any check fails:
1. Report exactly which check failed with full detail
2. Diagnose the root cause (do not guess — read the relevant files)
3. State the specific fix needed
4. Do NOT mark as complete
5. Return to `4-implement` for the affected task if needed

### 6. AI Feature Review

Once all checks pass, perform an independent review of the implementation:

**What was built:**
- Summarize what each task delivered in plain language
- List all files created or significantly modified

**Quality assessment:**
- Are there any obvious code smells or design issues introduced?
- Does the implementation follow existing project patterns?
- Are there edge cases not covered by the acceptance criteria?

**Recommendations:**
- What should be done next? (follow-up tasks, tech debt, improvements)
- Are there any concerns that should be tracked even if not blocking?

### 7. Report Results

```
VALIDATION SUMMARY
Feature: [name] | Branch: [branch]

Check 1 - Tasks:    PASS  (N/N complete)
Check 2 - Build:    PASS
Check 3 - Tests:    PASS  (N tests, 0 failures)
Check 4 - Spec:     PASS  (all acceptance criteria satisfied)

Overall: READY TO MERGE

AI REVIEW
What was built: [summary]
Quality: [assessment]
Recommendations:
  - [item 1]
  - [item 2]

Next steps: merge branch, update spec status, or continue with next feature.
```

## Non-Negotiable

Build must pass. Tests must pass. All spec acceptance criteria must be satisfied.
A "working locally" implementation that fails any check is NOT complete.
