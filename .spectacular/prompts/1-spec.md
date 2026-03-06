---
name: 1-spec
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

### 4. AI Codebase Analysis (Before Writing Spec)

Before writing the spec, actively analyze the codebase:
- Read the project structure to understand what already exists
- Identify any existing code that overlaps with or enables the new feature
- Flag potential conflicts with existing functionality
- Recommend the best approach given what's already there
- Note what the spec should explicitly NOT cover (out of scope)

Output a brief analysis:
```
CODEBASE ANALYSIS
Existing related code: [files/patterns found]
Recommended approach: [1-2 sentences]
Out of scope: [what to exclude]
Risks: [any flags]
```

### 5. Write Simplified Spec

Create `spec.md` with:
- Summary (1 paragraph)
- User story with acceptance criteria (each criterion must be independently verifiable)
- 3-5 requirements
- Success criteria
- Out of scope section (explicit exclusions prevent scope creep)

### 6. Report Completion

Output branch name, spec file path, and next step: `2-plan`
