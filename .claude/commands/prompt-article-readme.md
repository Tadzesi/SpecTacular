# /prompt-article-readme - README.md Generator

This command generates or updates a professional README.md file for any project by analyzing the codebase structure, configuration files, and existing documentation. It first perfects the user's prompt, then guides through the README generation wizard.

---

## Phase 0: Prompt Perfection

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Article/Documentation (from `.claude/library/adapters/article-adapter.md`)

**Before starting the README wizard, first perfect the user's prompt.**

### Step 0.1: Initial Analysis
- Detect language (Slovak / English)
- **Auto-detect prompt type:** Documentation / README Generation (smart default for this command)
- Extract the core intent: What README does the user want to create/update?

### Step 0.2: Completeness Check
Verify the prompt contains:
- [ ] Clear goal/desired outcome (generate new / update existing README)
- [ ] Context (project type, purpose)
- [ ] Scope (which project, specific sections needed)
- [ ] Constraints (if any: style preference, sections to include/exclude)
- [ ] Success criteria (what makes a good README for this project)

Mark missing items - these will be collected in the wizard steps.

### Step 0.3: Clarification (if needed)
- If anything is ambiguous or unclear, ASK before proceeding
- If multiple valid approaches exist:
  - List each option with pros/cons
  - Mark ⭐ recommended option with reasoning
  - Wait for user selection

### Step 0.4: Correction
- Fix grammar, spelling, sentence structure
- Preserve all technical terms, project names, and references EXACTLY
- Keep original intent and tone
- Make it clear, specific, and actionable

### Step 0.5: Structure the Perfect Prompt
Transform into an executable format with:
1. **Goal** - Generate new or update existing README
2. **Project** - Which project/directory
3. **Context** - Project purpose and background
4. **Constraints** - Style, sections, or other requirements
5. **Expected Result** - What the README should achieve

### Phase 0 Output Format

**Detected Language:** [Slovak / English]
**Prompt Type:** Documentation / README Generation *(auto-detected)*

**Original:**
> $ARGUMENTS

**Completeness Check:**
- [x] Goal: [extracted or ✅ auto-filled: "Generate README.md" - will be collected in wizard]
- [x] Project: [extracted or ✅ auto-filled: current directory]
- [x] Context: [extracted or ✅ auto-detected from project analysis]
- [ ] Constraints: [extracted or ❌ optional]
- [x] Style: [extracted or ❌ will be collected in wizard]

**Smart Defaults Applied:**
- Output format: README.md file (auto-detected from command type)
- Project context: Auto-analyzed from current directory
- Wizard will collect all missing documentation-specific parameters

**Perfected Prompt:**
> **Goal:** [generate/update README]
> **Project:** [project path or current directory]
> **Style:** [if specified, or "will configure in wizard"]
> **Constraints:** [any limitations, or "None - will configure in wizard"]

**Changes Made:**
- [list of corrections and improvements]

---

⏸️ **Waiting for approval before starting README wizard.** Reply with:
- `y` or `yes` — proceed to README wizard
- `n` or `no` — cancel
- Or type modifications for adjustments

---

## README Wizard Flow

Guide the user through each step using the AskUserQuestion tool. Do NOT skip steps or assume answers.

---

### Step 1: Language Selection

**Ask the user:**
> What language should the README be written in?

**Options:**
- **English** - International audience, standard formatting
- **Slovak** - Slovak language with proper grammar and diacritics

---

### Step 2: README Style

**Ask the user:**
> What style of README do you prefer?

**Options:**
- **Minimal** - Essential sections only (Description, Install, Usage)
- **Standard** - Common sections (Description, Install, Usage, Configuration, Contributing)
- **Comprehensive** - Full documentation (all sections including API, Architecture, Troubleshooting)
- **Badge-heavy** - Standard + shields.io badges for build status, coverage, version, etc.

---

### Step 3: Project Analysis

**Automatic Analysis - No user input needed:**

Analyze the project to detect:

1. **Project Type** - Detect from files:
   - `package.json` → Node.js/JavaScript/TypeScript
   - `*.csproj` / `*.sln` → .NET/C#
   - `requirements.txt` / `pyproject.toml` / `setup.py` → Python
   - `Cargo.toml` → Rust
   - `go.mod` → Go
   - `pom.xml` / `build.gradle` → Java
   - `composer.json` → PHP

2. **Framework Detection**:
   - React, Vue, Angular, Next.js, Nuxt
   - ASP.NET Core, Entity Framework
   - Express, Fastify, NestJS
   - Django, Flask, FastAPI
   - Spring Boot

3. **Build/Run Commands** - Extract from:
   - `package.json` scripts
   - `Makefile` targets
   - `.csproj` configuration
   - CI/CD files (`.github/workflows/`, `azure-pipelines.yml`)

4. **Dependencies** - Count and categorize from manifest files

5. **Existing Documentation** - Check for:
   - Existing `README.md` (preserve custom content)
   - `CONTRIBUTING.md`
   - `LICENSE`
   - `CHANGELOG.md`
   - `/docs` folder

6. **Project Structure** - Map key directories

---

### Step 4: Custom Sections (Optional)

**Ask the user:**
> Do you want to add any custom sections? (Optional - press Enter to skip)

**Options (multi-select):**
- **API Documentation** - Endpoint/method documentation
- **Architecture Diagram** - ASCII or mermaid diagram placeholder
- **Environment Variables** - .env documentation
- **Docker Support** - Docker/compose instructions
- **CI/CD** - Pipeline documentation
- **Screenshots** - Placeholder for screenshots
- **Roadmap** - Future plans section
- **FAQ** - Frequently asked questions
- **None** - Skip custom sections

---

### Step 5: Existing README Handling

**If README.md already exists, ask:**
> A README.md already exists. How should we handle it?

**Options:**
- **Replace** - Generate completely new README (backup old one)
- **Update** - Preserve custom content, update generated sections
- **Merge** - Intelligently merge existing with new content
- **Cancel** - Abort operation

---

## README Generation

After collecting inputs and analyzing the project, generate README with these sections:

### Section Templates by Style

**Minimal:**
```markdown
# Project Name

Brief description of the project.

## Installation

```bash
[install commands]
```

## Usage

```bash
[usage commands]
```

## License

[License type]
```

**Standard:**
```markdown
# Project Name

Brief description of the project.

## Features

- Feature 1
- Feature 2
- Feature 3

## Prerequisites

- Prerequisite 1
- Prerequisite 2

## Installation

```bash
[install commands]
```

## Usage

```bash
[usage commands]
```

## Configuration

[Configuration details]

## Contributing

[Contributing guidelines]

## License

[License type]
```

**Comprehensive:**
```markdown
# Project Name

[![Build Status](badge-url)](link)
[![Version](badge-url)](link)
[![License](badge-url)](link)

Brief description of the project.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Reference](#api-reference)
- [Architecture](#architecture)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Troubleshooting](#troubleshooting)
- [Changelog](#changelog)
- [License](#license)
- [Authors](#authors)

## Features

- Feature 1
- Feature 2
- Feature 3

## Prerequisites

- Prerequisite 1 (version X.X+)
- Prerequisite 2

## Installation

### Quick Start

```bash
[quick install commands]
```

### Manual Installation

```bash
[detailed install steps]
```

## Usage

### Basic Usage

```bash
[basic usage]
```

### Advanced Usage

```bash
[advanced usage]
```

## Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| VAR_1 | Description | value |
| VAR_2 | Description | value |

## API Reference

[API documentation or link]

## Architecture

```
[Project structure or diagram]
```

## Testing

```bash
[test commands]
```

## Deployment

[Deployment instructions]

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Troubleshooting

### Common Issues

**Issue 1**
- Solution

**Issue 2**
- Solution

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.

## License

This project is licensed under the [LICENSE_TYPE] - see [LICENSE](LICENSE) file.

## Authors

- **Author Name** - *Initial work* - [GitHub](link)
```

---

## Project-Specific Templates

### Node.js / JavaScript

```markdown
## Prerequisites

- Node.js >= [version]
- npm / yarn / pnpm

## Installation

```bash
npm install
# or
yarn install
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the application |
| `npm run dev` | Start in development mode |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run lint` | Run linter |
```

### .NET / C#

```markdown
## Prerequisites

- .NET SDK [version]+
- Visual Studio / VS Code (optional)

## Installation

```bash
dotnet restore
```

## Build

```bash
dotnet build
```

## Run

```bash
dotnet run --project [ProjectName]
```

## Test

```bash
dotnet test
```
```

### Python

```markdown
## Prerequisites

- Python >= [version]
- pip / poetry / pipenv

## Installation

```bash
# Using pip
pip install -r requirements.txt

# Using poetry
poetry install

# Using pipenv
pipenv install
```

## Usage

```bash
python main.py
# or
poetry run python main.py
```

## Testing

```bash
pytest
# or
python -m pytest
```
```

---

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                    README GENERATOR WIZARD                    ║
╚══════════════════════════════════════════════════════════════╝

📊 PROJECT ANALYSIS
├── Type: [detected project type]
├── Framework: [detected framework]
├── Package Manager: [npm/yarn/dotnet/pip/etc.]
├── Build Command: [detected build command]
├── Test Command: [detected test command]
├── Dependencies: [count] production, [count] dev
└── Existing README: [Yes/No]

📝 CONFIGURATION
├── Language: [selected language]
├── Style: [selected style]
├── Custom Sections: [selected sections]
└── Existing README: [handling method]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 GENERATED README.md
[Full README content]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 FILE SAVED: ./README.md
📦 BACKUP: ./README.md.backup (if replaced)
```

---

## Instructions for Claude

When this command is executed:

1. **Phase 0: Prompt Perfection** - Perfect the user's prompt first
   - Analyze, check completeness, clarify if needed, correct, structure
   - Display the perfected prompt and wait for user approval (`y`/`n`/modifications)
   - **Do NOT proceed to README wizard until user approves**
2. **Start the interactive wizard** - Use AskUserQuestion tool for each step
3. **Analyze the project** - Read package.json, *.csproj, requirements.txt, etc.
4. **Detect project structure** - Use Glob to map directories
5. **Check existing README** - Read if exists, offer handling options
6. **Generate README** - Follow template for selected style
7. **Customize content** - Add project-specific details from analysis
8. **Save the file** - Write README.md (backup existing if replacing)
9. **Display result** - Show generated content and file location

### Analysis Commands (Windows-compatible)

```powershell
# Find project files
Get-ChildItem -Recurse -Include package.json,*.csproj,requirements.txt,Cargo.toml,go.mod

# Check for existing README
Test-Path README.md

# Get directory structure
Get-ChildItem -Directory -Depth 2
```

### Quality Checklist

Before finalizing, verify:
- [ ] Project type correctly detected
- [ ] Build/run commands are accurate
- [ ] Prerequisites match actual requirements
- [ ] All selected custom sections included
- [ ] Links are valid (LICENSE, CONTRIBUTING, etc.)
- [ ] Grammar and spelling are correct
- [ ] File saved successfully

---

## Example Wizard Interaction

```
User: /prompt-article-readme Generate README for my React project

Claude: [Phase 0: Prompt Perfection]

**Detected Language:** English
**Prompt Type:** Documentation / README Generation

**Original:**
> Generate README for my React project

**Completeness Check:**
- [x] Goal: Generate README
- [x] Project: Current directory (React project)
- [ ] Context: ❌ will be auto-detected
- [ ] Style: ❌ will be collected in wizard

**Perfected Prompt:**
> **Goal:** Generate a new README.md file
> **Project:** Current directory (React project)
> **Style:** will configure in wizard
> **Constraints:** None - will configure in wizard

**Changes Made:**
- Clarified goal as "Generate a new README.md file"

⏸️ **Waiting for approval.** Reply with y/n/modifications

User: y

Claude: Welcome to the README Generator! Let me analyze your project and help create documentation.

[Step 1] What language should the README be written in?
- English
- Slovak

User: English

[Step 2] What style of README do you prefer?
- Minimal
- Standard
- Comprehensive
- Badge-heavy

User: Standard

[Analyzing project...]

📊 Detected: Node.js project with React
- Package manager: npm
- Scripts found: start, build, test, lint

[Step 4] Do you want to add any custom sections?
[Options displayed...]

User: Docker Support, Environment Variables

[Generating README...]

Claude: [Displays generated README and saves to file]
```

---

⏸️ **After generation, ask the user:**
- `edit [section]` — Modify specific section
- `add [section]` — Add new section
- `regenerate` — Start over
- `done` — Finish and exit

---

## Quick Start (Optional Arguments)

If user provides arguments, pre-fill wizard steps:

`/prompt-article-readme en comprehensive`

Would pre-select:
- Language: English
- Style: Comprehensive
- (Continue wizard for remaining options)

`/prompt-article-readme --update`

Would:
- Detect existing README
- Default to "Update" mode
- Preserve custom content

---

## Version History

**v2.0 (2024-12-20):**
- ✨ Added explicit library reference
- ✨ References prompt-perfection-core.md and article-adapter.md
- Enhanced documentation consistency
- Maintains all README generation functionality

**v1.0 (Previous):**
- Initial release
- Interactive README wizard
- Project analysis automation
- Multi-style support

---

## Library Integration

This command uses the **Unified Library System:**
- **Core:** `.claude/library/prompt-perfection-core.md` (universal Phase 0)
- **Adapter:** `.claude/library/adapters/article-adapter.md` (article/documentation domain)
- **Benefits:** Consistent validation, proven flow, easy maintenance

For details on the library system, see: `doc/Unified_Library_System_Guide.md`

---

**Ready to generate your README? Just type: `/prompt-article-readme`**
