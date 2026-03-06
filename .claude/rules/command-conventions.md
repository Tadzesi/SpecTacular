---
paths: .claude/commands/**/*.md
---

# Command File Conventions

Rules for all slash command files in .claude/commands/.

## Structure

Every command file must include:

1. **Title** - `# /command-name - Description`
2. **Overview** - Brief description of purpose
3. **Arguments** - If command accepts arguments
4. **Phase 0** - Import from prompt-perfection-core.md
5. **Command-specific phases** - Implementation logic
6. **Configuration** - Referenced config files
7. **Version History** - Changelog with dates
8. **Library Integration** - Dependencies

## Library References

Use @ import syntax for library files:
- Core: @.claude/library/prompt-perfection-core.md
- Adapters: @.claude/library/adapters/*.md
- Intelligence: @.claude/library/intelligence/*.md

## Phase 0 Import Pattern

```markdown
## Phase 0: Prompt Perfection

**Import:** Use Phase 0 from @.claude/library/prompt-perfection-core.md
**Adaptation:** [None | Technical | Article | Session]
```

## Approval Gates

Always wait for user approval before:
- Executing the perfected prompt
- Applying changes to files
- Committing to git
- Running destructive operations

## Output Style

- Plain text only in terminal
- No emojis unless user requests
- No markdown headers in responses
- Maximum 80 characters per line
- Use UPPERCASE for emphasis
