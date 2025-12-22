# SpecTacular Constitution

## Core Principles

### I. Task Completion is Non-Negotiable

Every task must be verifiably complete before marking done:
- Build must succeed without errors
- Tests must pass (if tests exist)
- Task status synced in both tasks.md AND TodoWrite

### II. Simple Steps Over Complex Workflows

Prefer straightforward approaches:
- Use `/spectacular.0-quick` for simple features
- Task format should be plain checkboxes
- Each step should be independently verifiable

### III. Validation Before Completion

No feature is "done" until validated:
- Run `validate-implementation.ps1` before marking complete
- Build + Test + Task completion = minimum bar

### IV. Production-Ready Defaults

Every implementation targets production:
- No placeholder or TODO code in completed tasks
- Error handling included by default
- Security considerations addressed

## Tech Stack

- ASP.NET Core
- React
- SQL Server

## Prompt Hybrid Integration

### V. Intelligent Prompt Perfection

The `/prompt-hybrid` command enhances the SpecTacular workflow with:

**Core Capabilities:**
- **Automatic Complexity Detection**: Analyzes prompts and spawns agents when needed
- **Agent-Assisted Analysis**: Explore agents gather codebase context automatically
- **Dual-Layer Validation**: Structural + semantic completeness checks
- **Constitution Compliance**: All prompts validated against these principles

**Advanced Features:**
- **Agent Result Caching** ⚡: 10-20x faster for repeated/similar prompts (24h cache)
- **Multi-Agent Verification** 🔍: Critical operations cross-validated by 2-3 agents
- **Learning System** 📚: Tracks patterns, suggests smart defaults, improves over time

**SpecTacular-Specific Integration:**
- Detects ASP.NET Core, React, and SQL Server patterns automatically
- Validates against all constitution principles (I-IV)
- Enforces production-ready defaults (no placeholders, error handling, security)
- Integrates seamlessly with 5-step pipeline (spec → plan → tasks → implement → validate)

**Complexity Thresholds:**
- Simple (0-4): Inline validation only (~2s)
- Moderate (5-9): Ask user if agent assistance wanted
- Complex (10+): Auto-spawn agent for codebase analysis (~20s)
- Critical (15+): Multi-agent verification for high-risk operations (~50s)

**SpecTacular Feature Detection:**
- Authentication (weight: 6): login, auth, JWT, identity
- API Endpoints (weight: 4): endpoint, controller, route, api
- Database Operations (weight: 5): database, EF Core, migration, SQL Server
- CRUD Operations (weight: 3): create, read, update, delete
- React Components (weight: 4): component, react, frontend, ui
- Security Features (weight: 8): security, encryption, password, token

**Configuration Files:**
- `.claude/config/complexity-rules.json` - Complexity detection rules
- `.claude/config/agent-templates.json` - SpecTacular-specific agent templates
- `.claude/config/cache-config.json` - Caching configuration
- `.claude/config/verification-config.json` - Multi-agent verification settings
- `.claude/config/learning-config.json` - Learning system configuration

**Memory/Storage:**
- `.claude/memory/prompt-patterns.md` - Pattern learning database
- `.claude/cache/agent-results/` - Cached agent analysis results

**Benefits:**
- Saves ~2 hours per feature (from 135 min → 19 min avg)
- Saves ~100 hours/year per developer (50 features/year)
- Better code quality (pattern-consistent, security-first)
- Fewer bugs (validation happens early)
- Constitution principles enforced automatically

**Usage:**
```
/prompt-hybrid Add user authentication following existing patterns
/prompt-hybrid Implement CRUD operations for Product entity
/prompt-hybrid Create React component for user dashboard
```

**Version**: 1.1.0 | **Ratified**: 2025-12-18
