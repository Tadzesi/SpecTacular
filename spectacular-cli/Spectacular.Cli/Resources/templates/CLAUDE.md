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

## Prompt-Hybrid Intelligence

This project includes **advanced prompt perfection commands** with AI-powered codebase analysis:

### `/prompt-hybrid` - Intelligent Prompt Perfection

Transforms any prompt into an unambiguous, executable format using automatic complexity detection and autonomous agents.

**Features:**
- ✅ Automatic complexity detection (simple/moderate/complex)
- ✅ Agent-powered codebase analysis for complex tasks
- ✅ Result caching (10-20x faster for repeated prompts)
- ✅ Multi-agent verification for critical operations
- ✅ Learning system that improves over time

**Usage:**
```
/prompt-hybrid "Add user authentication following existing patterns"
```

**How it works:**
1. Analyzes your prompt and detects complexity
2. Spawns AI agents automatically for complex tasks (score ≥10)
3. Agents explore codebase, detect patterns, validate feasibility
4. Returns perfected prompt with technical insights
5. Caches results for 24h (reused for similar prompts)

**Complexity Triggers:**
- Multi-file scope (+5)
- Architecture questions (+7)
- Pattern detection needed (+6)
- Feasibility checks (+4)
- Implementation planning (+3)
- Cross-cutting concerns (+4)
- Refactoring tasks (+5)

**Performance:**
- Simple path: ~2s (inline validation)
- Complex path (first time): ~20s (agent analysis)
- Complex path (cached): ~2s (10-20x faster!)

---

### `/prompt-technical` - Technical Implementation Analysis

Deep technical analysis for programming tasks with hybrid intelligence.

**Usage:**
```
/prompt-technical
```

**What it does:**
1. Perfects your prompt using complexity detection
2. Analyzes project structure and patterns
3. Provides 2-3 implementation options with pros/cons
4. Recommends best approach with code scaffolding
5. Validates technical feasibility

**Use this when:**
- You need implementation options for a task
- You want to follow existing codebase patterns
- You need code examples matching your conventions
- You want feasibility validation before starting

---

### Configuration

Prompt-hybrid settings are in `.spectacular/prompts/`:

- `complexity-rules.json` - Complexity detection rules and triggers
- `agent-templates.json` - AI agent prompt templates
- `cache-config.json` - Result caching settings (24h default)
- `verification-config.json` - Multi-agent verification rules
- `learning-config.json` - Learning system configuration

**Customize complexity scoring:**
Edit `.spectacular/prompts/complexity-rules.json` to adjust trigger weights and thresholds.

**Clear cache:**
Delete `.claude/cache/agent-results/` to invalidate all cached results.

---

### Integration with SpecTacular Workflow

Prompt-hybrid commands complement the SpecTacular pipeline:

**Workflow Pattern:**
```
1. /prompt-hybrid "feature description"
   → Get perfected, validated prompt

2. /spectacular.1-spec [use perfected prompt]
   → Create specification with insights

3. /spectacular.2-plan
   → Generate technical plan

4. /spectacular.3-tasks
   → Break down into tasks

5. /spectacular.4-implement
   → Execute implementation

6. /spectacular.5-validate
   → Validate completion
```

**Or use the quick pipeline:**
```
/spectacular.0-quick "feature description"
```

The SpecTacular commands can optionally use prompt-hybrid logic internally for automatic complexity detection and codebase analysis during spec and plan generation.
