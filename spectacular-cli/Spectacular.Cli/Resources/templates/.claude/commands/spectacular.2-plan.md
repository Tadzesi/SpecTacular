---
description: (2/5) Generate technical implementation plan from spec.
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

Generate a **technical implementation plan** from the specification. This is step 2 of the pipeline:

```
1-spec -> 2-plan -> 3-tasks -> 4-implement -> 5-validate
```

## Workflow

### 1. Locate Current Feature

Find the active feature directory in specs/ (check current branch or most recent).

### 2. Read Specification

Load and analyze `spec.md` to understand requirements.

### 3. Setup Plan File

Run:
```powershell
.spectacular/scripts/powershell/setup-plan.ps1 -Json
```

### 4. Write Implementation Plan

Create `plan.md` with:

#### Tech Stack Analysis
- Identify relevant technologies from the project
- List frameworks, libraries, and tools needed

#### Project Structure
- Map affected directories and files
- Identify new files to create

#### Implementation Approach
- High-level strategy
- Key design decisions
- Integration points

#### Risk Assessment
- Technical challenges
- Dependencies
- Mitigation strategies

## Markdown Formatting

When generating plan.md, use hierarchical numbering with proper nested list syntax:
- Main steps: `1.`, `2.`, `3.`
- Sub-steps: Use `-` prefix: `- 1.1.`, `- 1.2.`, `- 2.1.`
- Sub-sub-steps: Use `-` prefix: `- 1.1.1.`, `- 1.1.2.` (if needed)

**IMPORTANT**: Sub-items MUST use `-` prefix for proper markdown rendering in VS Code preview.

### 5. Report Completion

Output plan file path and next step: `/spectacular.3-tasks`
