# Prompt Pattern Learning System

**Purpose:** Track successful prompt transformations, user preferences, and pattern improvements over time.

**Last Updated:** 2025-12-18

---

## How This Works

This file automatically tracks:
- ✅ Successful prompt transformations (original → perfected)
- ✅ Common missing information patterns
- ✅ User modification preferences
- ✅ Complexity score accuracy
- ✅ Agent effectiveness metrics

**Learning Threshold:** After 3 occurrences of a pattern, the system will suggest smart defaults.

---

## Pattern Categories

### 1. Successful Transformations

**Format:**
```
### [Date] - [Prompt Type] - Score: X/10

**Original Prompt:**
[User's original input]

**Complexity Score:** [score] ([Simple/Moderate/Complex])
**Agent Used:** [Yes - Explore/Plan / No]

**Missing Information Detected:**
- [item 1]
- [item 2]

**Perfected Prompt:**
[Final perfected version]

**User Modifications:** [None / List of changes user made]
**Approval Status:** [Approved / Modified / Rejected]
**Outcome Success:** [Yes / Partial / No]
```

---

### 2. Common Missing Information Patterns

**Format:**
```
**Prompt Type:** [type]
**Occurrences:** [count]

**Frequently Missing:**
1. [missing item 1] - [count] times
2. [missing item 2] - [count] times
3. [missing item 3] - [count] times

**Smart Default Suggestion:**
[Suggested default to add automatically]
```

#### Tracked Patterns

*No patterns tracked yet. This section will populate as the system learns from usage.*

---

### 3. User Preference Patterns

**Format:**
```
**Preference Type:** [type]
**Confidence:** [0.0-1.0]
**Occurrences:** [count]

**Pattern:**
[Description of detected preference]

**Evidence:**
- [example 1]
- [example 2]
- [example 3]
```

#### Tracked Preferences

*No preferences tracked yet. This section will populate as the system learns.*

---

### 4. Complexity Score Accuracy

**Format:**
```
**Date Range:** [start] - [end]
**Total Prompts:** [count]

**Accuracy Metrics:**
- Correct categorization: [X]%
- Over-scored (simple → complex): [X]%
- Under-scored (complex → simple): [X]%

**Weight Adjustment Suggestions:**
- [trigger]: Adjust weight from [X] to [Y] (reason: [explanation])
- [trigger]: Adjust weight from [X] to [Y] (reason: [explanation])
```

#### Current Metrics

*No metrics yet. This section will populate after analyzing usage patterns.*

---

### 5. Agent Effectiveness

**Format:**
```
**Agent Type:** [Explore / Plan]
**Template:** [template name]
**Usage Count:** [count]

**Effectiveness Metrics:**
- Relevant findings: [X]%
- User satisfaction: [X]%
- Time to complete: [average]s
- Cache hit rate: [X]%

**Common Findings:**
- [finding type 1]: [count] times
- [finding type 2]: [count] times

**Improvement Suggestions:**
[Suggestions for template improvements]
```

#### Agent Performance

*No performance data yet. This section will populate as agents are used.*

---

## Learning Insights

### Project-Specific Smart Defaults

*As the system learns your project, it will suggest smart defaults here.*

**Example:**
- When prompt mentions "authentication" → Auto-include ASP.NET Core Identity patterns
- When prompt mentions "React component" → Auto-include component structure from src/components
- When prompt mentions "database" → Auto-include SQL Server context and migrations

---

### Detected Tech Stack Patterns

*System-detected patterns from your codebase analysis.*

**Current Project:**
- Tech Stack: ASP.NET Core, React, SQL Server
- Architecture: [To be detected]
- Common Patterns: [To be detected]

---

## Usage Statistics

**Total Prompts Processed:** 0
**Agent-Assisted Prompts:** 0
**Cache Hits:** 0
**Average Complexity Score:** N/A
**User Approval Rate:** N/A

**Last Pattern Update:** Never

---

## Configuration

This learning system is configured in `.claude/config/learning-config.json`

**Current Settings:**
- Learning Enabled: Yes
- Learning Threshold: 3 occurrences
- Auto-Suggest Improvements: Yes
- Track User Modifications: Yes

**To Disable:**
Edit `.claude/config/learning-config.json` and set `"enabled": false`

---

## Example Patterns (Template)

### Example 1: Feature Implementation Pattern

**Original Prompt:**
"Add login functionality"

**Complexity Score:** 10 (Complex)
**Agent Used:** Yes - Explore

**Missing Information Detected:**
- Authentication method not specified
- Database context unclear
- UI requirements missing

**Questions Asked:**
1. Which authentication method? (JWT / Cookie / OAuth)
2. Which database tables to use?
3. Login UI location (existing page or new)?

**Perfected Prompt:**
```
Goal: Implement login functionality using JWT authentication
Context: ASP.NET Core Web API + React frontend
Scope:
  - Backend: Create AuthController with Login endpoint
  - Frontend: Add login form in src/components/Auth/Login.jsx
  - Database: Use existing Users table in ApplicationDbContext
Requirements:
  1. JWT token generation with 24h expiration
  2. Password hashing with BCrypt
  3. Login form validation (email + password)
  4. Token storage in localStorage
Constraints: None
Expected Result: Users can log in and receive JWT token
```

**User Modifications:** None
**Approval Status:** Approved
**Outcome Success:** Yes

**Learning:** When user mentions "login", auto-suggest JWT vs Cookie choice and database context.

---

*This file grows as you use `/prompt-hybrid` and `/prompt-technical`. The system learns from your patterns and improves suggestions over time.*

---

## Reflection: 2026-01-10 - prompt-technical

**Signals Detected:**
- Corrections: 0
- Successes: 0
- Architectural Gaps: 12
- Documentation Gaps: 8

**Analysis Type:** Project-wide reflection against Claude Code documentation

**Changes Applied:**
- [x] Added arguments parsing section with override flags
- [x] Added comprehensive error handling section
- [x] Updated version history (v2.1)
- [x] Standardized terminology (Explore Agent, Complexity Score)

**Key Findings:**
1. Memory system uses custom .claude/memory/ vs CLAUDE.md hierarchy
2. No user override flags were documented
3. Missing error handling for agent failures
4. Path format inconsistency (Windows/Unix)

**Observations Saved for Future:**
- Consider migrating to .claude/rules/ directory for path-specific rules
- Consider hooks integration for pre/post analysis actions
- Consider plugin packaging for marketplace distribution

**Recommendation:** Proceed with Option B (memory migration) in next iteration

---

## Reflection: 2026-01-10 - Option B & C Implementation

**Task:** Memory migration and plugin packaging

**Option B Changes Applied:**
- [x] Created .claude/CLAUDE.md with @ import syntax
- [x] Created .claude/rules/ directory with 4 rule files:
  - technical-patterns.md (path: .claude/commands/prompt-technical.md)
  - command-conventions.md (path: .claude/commands/**/*.md)
  - library-standards.md (path: .claude/library/**/*.md)
  - config-validation.md (path: .claude/config/**/*.json)
- [x] Updated prompt-technical.md with @ imports
- [x] Updated prompt-perfection-core.md to v1.2 with @ syntax
- [x] Added @ import reference to root CLAUDE.md

**Option C Changes Applied:**
- [x] Created plugin.json manifest with full metadata
- [x] Created .claude/skills/ directory with skill configs:
  - prompt-technical.json
  - prompt-hybrid.json
  - reflect.json
  - session-management.json
- [x] Created PLUGIN.md documentation

**New File Structure:**
```
.claude/
├── CLAUDE.md (NEW - memory imports)
├── rules/ (NEW)
│   ├── technical-patterns.md
│   ├── command-conventions.md
│   ├── library-standards.md
│   └── config-validation.md
└── skills/ (NEW)
    ├── prompt-technical.json
    ├── prompt-hybrid.json
    ├── reflect.json
    └── session-management.json

plugin.json (NEW)
PLUGIN.md (NEW)
```

**Alignment with Claude Code:**
- Uses native @ import syntax
- Uses .claude/rules/ with YAML frontmatter
- Uses hierarchical CLAUDE.md structure
- Ready for plugin marketplace distribution
