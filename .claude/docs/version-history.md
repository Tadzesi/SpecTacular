# Version History

## Version 4.2 - February 2026 Memory Recall System

**Enhancement: Commands remember project facts between sessions**

Commands used to ask the same questions every session ("what database?", "where is server?") because Phase 0 never consulted persistent memory. The v4.2 release adds a structured fact store and memory recall so commands pre-fill known answers automatically.

### What's New in v4.2

**New Memory File: Project Profile**
- `.claude/memory/project-profile.md` - Structured key-value fact store
- Sections: Infrastructure, Tech Stack, Deployment, Project Structure, User Preferences, Workflows
- Grows over time as `/session-end` extracts facts

**Enhanced Phase 0: Memory Recall (prompt-perfection-core.md v1.3)**
- Step 0.2a reads project profile before completeness check
- Pre-fills known facts with "(from project profile)" attribution
- Step 0.3 skips questions already answered by profile
- Missing profile triggers opt-in prompt on first encounter
- ALL commands using Phase 0 gain memory recall automatically

**Enhanced `/session-end` (v3.0)**
- Step 1.5 extracts structured facts from session into project profile
- Scans for infrastructure, tech stack, deployment, structure, preferences, workflows
- Merges without duplicating existing facts
- Shows extraction summary

**Slimmed Memory Files**
- `project-knowledge.md` reduced from 440 to ~40 lines (headers only, grows on use)
- `architectural-context.md` reduced from 653 to ~45 lines (headers only, grows on use)

### Migration Guide (v4.1 to v4.2)

v4.2 is **fully backward compatible** - all existing commands work without changes.

**Adoption Path:**
1. Update to v4.2
2. Run any `/prompt*` command - it will offer to create a project profile
3. Run `/session-end` - it will extract facts into the profile
4. Next session: commands pre-fill answers from profile

**First-Time Experience:**
- Phase 0 detects missing profile and asks to create one
- User can decline (commands work as before)
- `/session-end` also asks before first profile creation

---

## Version 4.1 - January 2026 Skill Reflection System

**Major Enhancement: Active Skill Improvement through Conversation Analysis**

The v4.1 release introduces the Skill Reflection System, transforming passive pattern tracking into active skill improvement.

### What's New in v4.1

**New Command: `/reflect`**
- Signal detection (corrections, successes, edge cases, preferences)
- Priority-coded change proposals (HIGH/MED/LOW)
- Direct skill file modifications with user approval
- Observation persistence for later review
- Integration with learning system

**New Library Component:**
- `.claude/library/intelligence/reflection-analyzer.md`
  - Signal detection engine
  - Confidence scoring
  - Priority classification
  - Output formatting

**New Memory File:**
- `.claude/memory/observations.md`
  - Pending observation storage
  - Applied/dismissed tracking

**Enhanced Configuration:**
- `.claude/config/learning-config.json` - Added `reflection_analysis` section

### Key Features

1. **Signal Detection**
   - Corrections: "no", "not like that", explicit fixes
   - Successes: "perfect", "great", accepted outputs
   - Edge Cases: missing features, workarounds needed
   - Preferences: repeated choices, style patterns

2. **Priority Classification**
   - HIGH: Direct corrections, apply first
   - MEDIUM: Patterns, recommend applying
   - LOW: Observations, review before applying

3. **Change Application**
   - Proposes specific changes with evidence
   - Modifies skill files directly
   - Requires user approval
   - Saves to pattern memory

### Migration Guide (v4.0 to v4.1)

v4.1 is **fully backward compatible** - all existing commands continue to work exactly as before.

**What's New:**
- New `/reflect` command (opt-in)
- Enhanced learning configuration
- Observation storage

**Adoption Path:**
1. Update to v4.1
2. Continue using existing commands
3. Run `/reflect` after skill-heavy sessions
4. Review and apply proposed improvements

---

## Version 4.0 - January 2026 Predictive Intelligence System

**Major Enhancement: Proactive Guidance with 2-Step Ahead Prediction**

See: `.claude/docs/v4.0-RELEASE-NOTES.md` for full details.

---

## Version 3.0 - December 2025 Multi-Agent Research System

**Major Enhancement: Deep Multi-Agent Research with Iterative Refinement**

The v3.0 release introduces a comprehensive multi-agent research system aligned with Anthropic's research architecture, enabling deep codebase analysis with orchestrated agents and persistent knowledge.

### What's New in v3.0

**New Command: `/prompt-research`**
- Multi-agent orchestration (2-5 specialized agents)
- Iterative refinement (2-4 iteration cycles)
- Source attribution (file:line citations with code snippets)
- External memory (persistent knowledge graph across sessions)
- Comprehensive reports (15-20 pages with priorities)
- Smart convergence (automatic research completion detection)

**New Orchestration Components:**
1. **Lead Agent** (`.claude/library/orchestration/lead-agent-core.md`)
   - Coordinates worker agents
   - Monitors research progress
   - Decides iterations and convergence

2. **Iteration Engine** (`.claude/library/orchestration/iteration-engine.md`)
   - Multi-step refinement loop (max 4 iterations)
   - Gap detection (8 gap types)
   - Adaptive agent selection
   - Convergence evaluation

3. **Result Aggregator** (`.claude/library/orchestration/result-aggregator.md`)
   - Deduplication and merging
   - Conflict resolution (6 rules)
   - Confidence scoring
   - Priority organization (Critical/Important/Informational)

**New Specialized Agents:**
1. **ExploreAgent** (`.claude/library/agents/explore-agent.md`)
   - Codebase discovery and file mapping
   - Architecture understanding
   - Pattern recognition

2. **CitationAgent** (`.claude/library/agents/citation-agent.md`)
   - Source attribution (file:line precision)
   - Code snippet extraction
   - Confidence scoring
   - Evidence tracking

3. **SecurityAgent** (`.claude/library/agents/security-agent.md`)
   - OWASP Top 10 compliance
   - Vulnerability detection
   - Authentication/authorization analysis

4. **PerformanceAgent** (`.claude/library/agents/performance-agent.md`)
   - Bottleneck detection
   - N+1 query identification
   - Caching analysis

5. **PatternAgent** (`.claude/library/agents/pattern-agent.md`)
   - Convention detection
   - Consistency analysis
   - Pattern recognition

**External Memory System:**
- `project-knowledge.md` - Facts, patterns, findings
- `architectural-context.md` - Understanding, rationale
- `citation-index.md` - Source evidence mapping

**Enhanced Configuration:**
- `orchestration-config.json` - Research strategies, iterations
- `iteration-rules.json` - Convergence criteria, gap detection
- `agent-roles.json` - Agent definitions and triggers
- `citation-config.json` - Citation formatting
- `external-memory-config.json` - Memory persistence

### File Structure Changes (v3.0)

**New Directories:**
```
.claude/
├── library/
│   ├── orchestration/              # NEW - Multi-agent orchestration
│   │   ├── lead-agent-core.md
│   │   ├── iteration-engine.md
│   │   └── result-aggregator.md
│   ├── agents/                     # NEW - Specialized agents
│   │   ├── explore-agent.md
│   │   ├── citation-agent.md
│   │   ├── security-agent.md
│   │   ├── performance-agent.md
│   │   └── pattern-agent.md
│   └── adapters/
│       └── research-adapter.md     # NEW - Research Phase 0 adapter
├── memory/                         # NEW - Persistent knowledge
│   ├── project-knowledge.md
│   ├── architectural-context.md
│   └── citation-index.md
├── cache/
│   └── iteration-checkpoints/      # NEW - Iteration state
└── config/
    ├── orchestration-config.json   # NEW
    ├── iteration-rules.json        # NEW
    ├── agent-roles.json            # NEW
    ├── citation-config.json        # NEW
    ├── external-memory-config.json # NEW
    ├── complexity-rules.json       # UPDATED with research triggers
    └── agent-templates.json        # UPDATED with orchestrator templates
```

### Migration Guide (v2.0 → v3.0)

v3.0 is **fully backward compatible** - all existing commands continue to work exactly as before.

**What's Preserved:**
- All existing commands unchanged
- All existing configurations preserved
- Cache system continues to work
- Learning system continues to improve
- Session management unchanged

**What's New:**
- New `/prompt-research` command (opt-in)
- Persistent knowledge graph (`.claude/memory/`)
- Enhanced complexity detection (research depth 20+)
- New orchestrator templates in `agent-templates.json`

**Adoption Path:**
1. Update to v3.0 (installer preserves all existing data)
2. Continue using existing commands as before
3. Try `/prompt-research` when needed for deep analysis
4. Knowledge graph builds automatically over time

**When to Use Each Command:**
- Quick task → `/prompt` or `/prompt-hybrid` (2-30s)
- Deep research → `/prompt-research` (60-180s)
- Implementation → `/prompt-technical` (after research)

### Performance Impact

**Existing Commands:** No change (same performance as v2.0)

**New `/prompt-research`:**
- First run: 60-180s (depending on strategy)
- Cached run: ~10s (10-20x faster)
- Memory-assisted: Faster on related topics

---

## Version 2.0 - December 2024 Refactoring

**Major Architectural Improvements:**

The v2.0 release brought significant improvements to the command library architecture.

### What Changed

**Before v2.0:**
- Each command had its own Phase 0 implementation
- Code duplication across multiple commands
- Inconsistent validation logic
- Harder to maintain (updates needed in multiple files)

**After v2.0:**
- All commands reference the unified library system
- Single source of truth for Phase 0 logic
- Consistent validation across all commands
- Easy maintenance (update library once, all commands benefit)
- New hybrid-adapter.md for reusable advanced features

### File Size Reductions

- `prompt-hybrid.md`: Reduced from 1097 to 1037 lines (~500 lines of duplication eliminated)
- All commands now 50-200 lines of domain logic + library references
- Overall codebase: More maintainable with DRY principles

### New Features in v2.0

1. **Hybrid Intelligence Adapter** (`.claude/library/adapters/hybrid-adapter.md`)
   - Reusable complexity detection
   - Agent spawning logic
   - Caching system
   - Multi-agent verification
   - Learning system integration

2. **Enhanced Documentation**
   - All commands now have version history
   - Library Integration sections
   - Clear references to core and adapters
   - Consistent structure across all commands

3. **Improved Maintainability**
   - Single source of truth for Phase 0
   - Easy to add new commands (just reference the library)
   - Simple to update all commands (modify library once)
   - Clear separation of concerns (core vs. domain logic)

### Migration Guide (v1.0 → v2.0)

If you created custom commands based on v1.0:

1. Replace duplicate Phase 0 code with library references:
   ```markdown
   ## Phase 0: Prompt Perfection
   **Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
   **Adaptation:** [Technical/Article/Session/Hybrid] (from adapter)
   ```

2. Add version history section
3. Add Library Integration section
4. Keep your domain-specific logic in Phase 1+

See any v2.0 command for examples.
