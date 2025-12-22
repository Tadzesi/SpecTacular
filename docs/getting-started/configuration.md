# Configuration

SpecTacular can be customized at both global and project levels to fit your workflow.

## Project Configuration

When you run `spectacular init`, a `.spectacular/` directory is created with:

```
.spectacular/
├── config/
│   └── project.json          # Project-level configuration
├── templates/                # Custom templates
│   ├── spec-template.md
│   ├── task-template.md
│   └── ...
├── prompts/                  # AI workflow prompts
│   ├── 1-spec.md
│   ├── 2-plan.md
│   └── ...
├── scripts/                  # Automation scripts
└── memory/
    └── constitution.md       # Project guidelines
```

### project.json

```json
{
  "projectName": "MyProject",
  "techStack": ["Node.js", "TypeScript"],
  "language": "en",
  "version": "1.6.4",
  "initialized": "2024-12-22T10:00:00Z"
}
```

## Global Configuration

Global settings are stored in `~/.spectacular/config/global.json`:

```json
{
  "defaultLanguage": "en",
  "checkForUpdates": true,
  "updateCheckInterval": 86400,
  "telemetry": false
}
```

**Location:**
- Windows: `C:\Users\<username>\.spectacular\config\global.json`
- Linux/macOS: `~/.spectacular/config/global.json`

## Template Customization

### Customize Spec Template

Edit `.spectacular/templates/spec-template.md`:

```markdown
---
type: spec
status: pending
created: {{DATE}}
author: {{USER}}
---

# {{TITLE}}

## Overview
[Brief description]

## Requirements

### Functional Requirements
-

### Non-Functional Requirements
-

## Architecture

## Success Criteria
- [ ]
```

Variables available:
- `{{DATE}}` - Current date
- `{{TITLE}}` - Specification title
- `{{USER}}` - Current user
- `{{PROJECT_NAME}}` - Project name
- `{{TECH_STACK}}` - Technology stack

### Customize Task Template

Edit `.spectacular/templates/task-template.md`:

```markdown
---
type: task
status: pending
created: {{DATE}}
spec: [[{{SPEC_LINK}}]]
---

# {{TITLE}}

## Acceptance Criteria
- [ ]
- [ ]
- [ ]

## Implementation Notes

## Dependencies
-

## Estimated Effort
[Time estimate]
```

## VS Code Extension Settings

Configure the extension in VS Code settings (`Ctrl+,`):

### Dashboard Settings

```json
{
  "spectacular.dashboard.theme": "auto",
  "spectacular.dashboard.showTreeView": true,
  "spectacular.dashboard.autoSave": true,
  "spectacular.dashboard.autoSaveDelay": 1000
}
```

### File Watching

```json
{
  "spectacular.fileWatch.enabled": true,
  "spectacular.fileWatch.debounceDelay": 300,
  "spectacular.fileWatch.exclude": [
    "**/node_modules/**",
    "**/.git/**"
  ]
}
```

### Status Tag Configuration

```json
{
  "spectacular.statusTags.enabled": true,
  "spectacular.statusTags.customColors": {
    "done": "#68d391",
    "pending": "#4a9eff",
    "blocked": "#f56565",
    "in-progress": "#f6ad55"
  }
}
```

### Wikilink Settings

```json
{
  "spectacular.wikilinks.enabled": true,
  "spectacular.wikilinks.basePath": "specs/",
  "spectacular.wikilinks.autoComplete": true
}
```

## AI Workflow Configuration

### Claude Code Commands

Commands are located in `.claude/commands/`:

- `spectacular.0-quick.md` - Full pipeline orchestration
- `spectacular.1-spec.md` - Specification creation
- `spectacular.2-plan.md` - Planning workflow
- `spectacular.3-tasks.md` - Task breakdown
- `spectacular.4-implement.md` - Implementation guidance
- `spectacular.5-validate.md` - Validation workflow

### Cursor Rules

Cursor rules are located in `.cursor/rules/` with the same structure.

### Customize Prompts

Edit `.spectacular/prompts/*.md` to customize AI workflow:

```markdown
# Custom Specification Prompt

You are helping create a specification for {{PROJECT_NAME}}.

## Context
- Tech Stack: {{TECH_STACK}}
- Project Type: {{PROJECT_TYPE}}

## Instructions
[Your custom instructions]

## Output Format
[Desired format]
```

After editing, regenerate commands:

```powershell
cd .spectacular/scripts/powershell
.\generate-commands.ps1
```

## Advanced Configuration

### Custom Status Tags

Add custom status tags by editing your spec templates:

```markdown
#status/review     - Needs review
#status/approved   - Approved
#status/deprecated - No longer valid
```

### Auto-Status Rules

Configure automatic status updates in `project.json`:

```json
{
  "autoStatus": {
    "enabled": true,
    "rules": {
      "task": {
        "allCriteriaChecked": "done",
        "anyCriteriaUnchecked": "pending"
      }
    }
  }
}
```

### Directory Structure

Customize spec directory structure:

```json
{
  "structure": {
    "specsDir": "specs",
    "templatesDir": ".spectacular/templates",
    "featureTemplate": "{number}-{name}/"
  }
}
```

## Environment Variables

SpecTacular respects these environment variables:

- `SPECTACULAR_HOME` - Override default `~/.spectacular/` location
- `SPECTACULAR_UPDATE_CHECK` - Set to `false` to disable update checks
- `HTTP_PROXY` - Proxy for update downloads

## Best Practices

✅ **Version control `.spectacular/`** - Templates and prompts should be shared

❌ **Don't commit `node_modules/`** - Already in `.gitignore`

✅ **Customize templates** - Make them match your team's workflow

✅ **Use consistent status tags** - Define a standard set

✅ **Document your configuration** - Add a `CONFIG.md` to your project

## Next Steps

- [CLI Commands](/guide/cli/commands) - Learn CLI customization options
- [Extension Features](/guide/extension/features) - Explore dashboard settings
- [Workflows](/guide/workflows/specification-pipeline) - Configure AI workflows

## Troubleshooting

### Config not loading

Check file permissions and JSON syntax:

```bash
# Validate JSON
cat ~/.spectacular/config/global.json | jq .
```

### Templates not applying

Regenerate commands after template changes:

```powershell
cd .spectacular/scripts/powershell
.\generate-commands.ps1
```

### Changes not reflecting

Reload VS Code window:
- Press `Ctrl+Shift+P`
- Type "Reload Window"
- Press Enter
