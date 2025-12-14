# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Information

**Project Name**: {{PROJECT_NAME}}
**Tech Stack**: {{TECH_STACK}}
**Created**: {{DATE}}

## Language Preferences

**Preferred Language(s)**: {{LANGUAGE}}

When responding to user prompts:
1. First, detect the language of the user's prompt
2. Fix any typos or grammatical errors to understand the intent
3. Respond in the user's preferred language(s) listed above
4. If the prompt language differs from the preference, use the prompt's language

## Prompt Processing

Before executing any task, always:
1. Parse and understand the user's request
2. Correct typos and clarify ambiguous terms
3. Confirm understanding if the request is unclear
4. Execute the task in the appropriate language

## Formatting Standards

When generating markdown files (spec.md, plan.md, tasks.md), use hierarchical numbering with proper nested list syntax:
- Main steps: `1.`, `2.`, `3.`
- Sub-steps: Use `-` prefix with numbering: `- 1.1.`, `- 1.2.`, `- 2.1.`
- Sub-sub-steps: Use `-` prefix: `- 1.1.1.`, `- 1.1.2.` (if needed)

**IMPORTANT**: Sub-items MUST use `-` prefix for proper markdown rendering in VS Code preview.

Example:
```markdown
## Requirements

1. User Authentication
   - 1.1. Implement login endpoint
   - 1.2. Implement logout endpoint
   - 1.3. Session management
     - 1.3.1. Token generation
     - 1.3.2. Token validation
2. User Profile
   - 2.1. View profile
   - 2.2. Edit profile
```

## Tech Stack Details

{{TECH_STACK_LIST}}

## SpecTacular Pipeline Commands

Available slash commands for specification-driven development:
- `/spectacular.0-quick` - Full pipeline in one command
- `/spectacular.1-spec` - Create feature specification
- `/spectacular.2-plan` - Generate implementation plan
- `/spectacular.3-tasks` - Create task breakdown
- `/spectacular.4-implement` - Execute implementation
- `/spectacular.5-validate` - Validate completion

## Core Principles

1. **Task Completion is Non-Negotiable** - Build must pass, tests must pass
2. **Simple Steps Over Complex Workflows** - Use pipeline commands when possible
3. **Validation Before Completion** - Always run `/spectacular.5-validate`
4. **Production-Ready Defaults** - No placeholder code in completed work
