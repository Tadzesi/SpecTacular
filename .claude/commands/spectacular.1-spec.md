---
description: (1/5) Create feature branch and specification document.
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

## Markdown Formatting

When generating spec.md, use hierarchical numbering for requirements:
- Main items: `1.`, `2.`, `3.`
- Sub-items: `1.1`, `1.2`, `2.1`, `2.2`

### 5. Report Completion

Output branch name, spec file path, and next step: `/spectacular.2-plan`
