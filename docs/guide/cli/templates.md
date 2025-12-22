# Templates

SpecTacular uses template files to scaffold consistent specifications, plans, and tasks. All templates support variable substitution and can be customized per project.

## Template Location

After running `spectacular init`, templates are located in:

```
.spectacular/templates/
├── spec-template.md          # Standard specification template
├── spec-foam-template.md     # Foam-style spec template
├── plan-template.md          # Implementation plan template
├── task-template.md          # Individual task template
├── task-foam-template.md     # Foam-style task template
├── tasks-template.md         # Task checklist template
└── feature-template.md       # Feature template
```

## Template Variables

All templates support these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{PROJECT_NAME}}` | Project name | "MyApp" |
| `{{TECH_STACK}}` | Technology stack (comma-separated) | "Node.js, React" |
| `{{TECH_STACK_LIST}}` | Tech stack as markdown list | "- Node.js\n- React" |
| `{{DATE}}` | Current date (ISO 8601) | "2024-12-22" |
| `{{LANGUAGE}}` | Project language | "en" or "sk" |
| `{{TITLE}}` | Document title (context-specific) | "User Authentication" |
| `{{SPEC_LINK}}` | Link to related spec (for tasks) | "[[auth-spec]]" |

## Specification Template

**File:** `spec-template.md`

```markdown
---
type: spec
status: pending
created: {{DATE}}
---

# {{TITLE}}

## Overview

[Brief description of this feature]

## Requirements

### Functional Requirements

-
-
-

### Non-Functional Requirements

-
-
-

## Architecture

### Components

-

### Data Model

-

## Implementation Notes

-

## Success Criteria

- [ ]
- [ ]
- [ ]

## Related

- Depends on: [[]]
- Related specs: [[]]
```

### Usage

This template is used when creating new specifications:

```bash
# Using Claude Code
/spec "Add user authentication"

# Creates: specs/###-user-authentication/authentication-spec.md
```

## Plan Template

**File:** `plan-template.md`

```markdown
---
type: plan
status: pending
created: {{DATE}}
spec: [[{{SPEC_LINK}}]]
---

# {{TITLE}} - Implementation Plan

## Goal

[What are we trying to achieve?]

## Approach

### Phase 1: [Name]

**Objective:** [What this phase accomplishes]

**Steps:**
1.
2.
3.

**Deliverables:**
-

### Phase 2: [Name]

**Objective:**

**Steps:**
1.
2.

**Deliverables:**
-

## Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| | | |

## Dependencies

- Technical: [[]]
- External: [[]]

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1 | | |
| Phase 2 | | |

## Success Criteria

- [ ]
- [ ]
```

### Usage

```bash
# Using Claude Code
/plan

# Creates implementation plan based on current spec
```

## Task Template

**File:** `task-template.md`

```markdown
---
type: task
status: pending
created: {{DATE}}
spec: [[{{SPEC_LINK}}]]
assignee:
priority: medium
---

# {{TITLE}}

## Description

[What needs to be done?]

## Acceptance Criteria

- [ ]
- [ ]
- [ ]

## Implementation Notes

-

## Dependencies

- Requires: [[]]
- Blocks: [[]]

## Estimated Effort

[Time estimate]

## Testing

### Unit Tests

- [ ]

### Integration Tests

- [ ]

## Related

- Parent: [[]]
- Subtasks: [[]]
```

### Usage

```bash
# Using Claude Code
/tasks

# Creates task breakdown from plan or spec
```

## Task Checklist Template

**File:** `tasks-template.md`

```markdown
---
type: tasks
status: pending
created: {{DATE}}
spec: [[{{SPEC_LINK}}]]
---

# {{TITLE}} - Tasks

## Task Summary

| # | Task | Status | Assignee |
|---|------|--------|----------|
| 1 | [[task-01]] | #status/pending | |
| 2 | [[task-02]] | #status/pending | |

## Task Details

### [[task-01]]: [Task Name]

**Priority:** High
**Estimated:** [time]

**Acceptance Criteria:**
- [ ]

---

### [[task-02]]: [Task Name]

**Priority:** Medium
**Estimated:** [time]

**Acceptance Criteria:**
- [ ]

---

## Progress

- Total Tasks: 0
- Completed: 0
- In Progress: 0
- Blocked: 0
```

## Customizing Templates

### Edit Templates

```bash
cd .spectacular/templates
code spec-template.md
```

Make your changes, then regenerate commands:

```powershell
cd .spectacular/scripts/powershell
.\generate-commands.ps1
```

This updates `.claude/commands/` and `.cursor/rules/` with your changes.

### Add Custom Variables

While you can't add new variables to the CLI substitution engine, you can:

1. **Use AI context** - AI assistants will fill in contextual information
2. **Add placeholders** - Use `[TODO: ...]` for manual filling
3. **Use frontmatter** - Add YAML fields for metadata

Example:
```markdown
---
type: spec
status: pending
created: {{DATE}}
author: [TODO: Your name]
reviewer: [TODO: Reviewer name]
epic: [TODO: Epic link]
---
```

### Template Best Practices

✅ **Keep frontmatter consistent** - Same fields across all specs
✅ **Use status tags** - `#status/pending`, `#status/done`, etc.
✅ **Link related docs** - Use wikilinks `[[doc]]`
✅ **Include acceptance criteria** - Always use checkboxes `- [ ]`
✅ **Add examples** - Help others understand the format

❌ **Don't hardcode dates** - Use `{{DATE}}`
❌ **Don't skip frontmatter** - Used by VS Code extension
❌ **Don't remove variables** - Keep `{{PROJECT_NAME}}`, etc.

## Example Templates

### Minimal Spec Template

```markdown
---
type: spec
status: pending
---

# {{TITLE}}

## What
[One sentence description]

## Why
[Business value]

## How
[Technical approach]

## Done When
- [ ]
- [ ]
```

### Detailed Spec Template

```markdown
---
type: spec
status: pending
created: {{DATE}}
priority: medium
complexity: medium
---

# {{TITLE}}

## Executive Summary

[2-3 sentences for stakeholders]

## Problem Statement

### Current State
-

### Pain Points
-

### Desired State
-

## Proposed Solution

### Overview
[High-level approach]

### Architecture
[Diagram or description]

### Components
1. **Component 1** - [Description]
2. **Component 2** - [Description]

## Requirements

### Functional
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | | Must Have |
| FR-2 | | Should Have |

### Non-Functional
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1 | Performance | < 200ms |
| NFR-2 | Availability | 99.9% |

## Technical Design

### API Endpoints
-

### Data Model
```sql
CREATE TABLE ...
```

### Dependencies
- [ ] External API: [name]
- [ ] Database: [type]
- [ ] Libraries: [list]

## Implementation Plan

See: [[{{TITLE}}-plan]]

## Testing Strategy

### Unit Tests
-

### Integration Tests
-

### E2E Tests
-

## Deployment

### Checklist
- [ ] Database migration
- [ ] Environment variables
- [ ] Feature flag
- [ ] Monitoring

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| | | |

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| | Low/Med/High | Low/Med/High | |

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| | | |

## Stakeholders

- **Owner:** [Name]
- **Reviewers:** [Names]
- **Approvers:** [Names]

## Related Documents

- Epic: [[]]
- Dependencies: [[]]
- Related specs: [[]]
```

## Foam Templates

Foam-style templates use a different format optimized for the Foam extension:

**spec-foam-template.md:**
```markdown
# {{TITLE}}

type: spec
status: pending
created: {{DATE}}

---

## Context

[Why this spec exists]

## Decision

[What we're doing]

## Consequences

### Positive
-

### Negative
-

### Neutral
-

## Alternatives Considered

1. **Alternative 1** - [Rejected because...]
2. **Alternative 2** - [Rejected because...]

## Links

[[related-spec]] | [[dependency]] | [[parent-spec]]
```

## Version Control

**Do commit:**
- `.spectacular/templates/` - Custom templates
- `.spectacular/prompts/` - AI prompts

**Don't commit:**
- Generated specs in `specs/` (unless you want to share them)
- `.spectacular/config/project.json` (if it contains sensitive data)

Add to `.gitignore`:
```gitignore
# Optional: Don't commit generated specs
specs/

# Or be selective
specs/*/temp-*.md
```

## Next Steps

- [CLI Commands](./commands) - Use templates with CLI
- [Workflows](/guide/workflows/specification-pipeline) - Templates in AI workflows
- [Configuration](/getting-started/configuration) - Configure template behavior
- [Examples](/examples/) - See templates in action
