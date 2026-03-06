---
paths: .claude/library/**/*.md
---

# Library File Standards

Rules for core library and adapter files.

## Core Library (prompt-perfection-core.md)

- Contains canonical Phase 0 flow
- Must not be modified for domain-specific needs
- All changes affect ALL commands
- Version with semantic versioning

## Adapters

- Extend core library for specific domains
- Located in .claude/library/adapters/
- Reference parent library explicitly
- Add domain-specific criteria only

## Intelligence Components

- Located in .claude/library/intelligence/
- Implement predictive features
- Must be optional (can be disabled)
- Configuration in .claude/config/

## File Structure

```markdown
# Component Name

**Version:** X.Y
**Parent Library:** [path if adapter]
**Purpose:** One-line description

---

## Overview
[Description]

## Integration
[How to use]

## Implementation
[Details]

## Version History
[Changelog]
```

## Dependencies

Document all dependencies:
- Config files referenced
- Memory files used
- Other library components

## Backward Compatibility

- Never break existing command functionality
- Add new features as optional
- Deprecate before removing
- Provide migration guides
