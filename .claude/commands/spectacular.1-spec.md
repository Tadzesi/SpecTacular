---
description: (1/5) Create feature branch and specification document.
---

## User Input

```text
$ARGUMENTS
```

You **MUST** consider the user input before proceeding (if not empty).

## Purpose

Create a **simplified specification** for straightforward features. This is step 1 of the pipeline:

```
1-spec -> 2-plan -> 3-tasks -> 4-implement -> 5-validate
```

## Workflow

### 1. Generate Branch Name

- Extract 2-4 word short name from description
- Use action-noun format (e.g., "add-health-check", "fix-login-bug")

### 2. Find Next Feature Number

Check specs/ directories for highest existing number. Use N + 1.

### 3. Create Feature Directory

Run:
```powershell
.spectacular/scripts/powershell/create-new-feature.ps1 -Json -Number [N] -ShortName "[name]" "[description]"
```

### 4. Write Simplified Spec

Create `spec.md` with:
- Summary (1 paragraph)
- User story with acceptance criteria
- 3-5 requirements
- Success criteria

### 5. Report Completion

Output branch name, spec file path, and next step: `2-plan`
