---
paths: .claude/config/**/*.json
---

# Configuration File Standards

Rules for JSON configuration files.

## Required Fields

Every config file must have:
- `version` - Semantic version string
- `description` - Purpose of this config

## Validation

Before committing config changes:
```powershell
Get-Content file.json | ConvertFrom-Json
```

## Common Configs

### complexity-rules.json
- `rules[]` - Array of complexity triggers
- `thresholds` - Score ranges for each category
- `agent_config` - Agent settings
- `user_factors` - Risk multipliers

### agent-templates.json
- `templates[]` - Agent prompt templates
- `trigger_mappings` - Complexity to template mapping

### learning-config.json
- `enabled` - Boolean to enable/disable
- `pattern_storage` - Path to patterns file
- `learning_threshold` - Occurrences before learning

## Naming Conventions

- Use kebab-case for file names
- Use snake_case for JSON keys
- Use descriptive names (not abbreviations)

## Schema Documentation

Include inline comments or separate schema file:
```json
{
  "version": "1.0.0",
  "description": "Describes the config purpose",
  "_comment": "Use _comment for inline docs"
}
```
