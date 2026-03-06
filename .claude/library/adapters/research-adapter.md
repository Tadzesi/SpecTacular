# Research Adapter - Phase 0 for Multi-Agent Research

**Version:** 1.0.0
**Adapter Type:** Research-specific Phase 0 adaptation
**Purpose:** Adapt prompt perfection for deep multi-agent research with orchestration
**Command:** `/prompt-research`

---

## 📋 Overview

The Research Adapter customizes Phase 0 (Prompt Perfection) for the `/prompt-research` command, which uses the **orchestrator-worker pattern** with **iterative refinement** for comprehensive codebase analysis.

**Key Differentiators from Other Adapters:**
- **hybrid-adapter.md** → Single-pass with optional agent (fast, 2-30s)
- **technical-adapter.md** → Technical analysis (moderate, 20-60s)
- **research-adapter.md** → Multi-iteration orchestration (comprehensive, 60-180s)

**When to Use:**
- Complexity score >= 20 (research depth)
- User explicitly requests `/prompt-research`
- Deep codebase understanding needed
- Security audits, performance analysis, architecture mapping
- Multiple perspectives required (2-5 specialized agents)

---

## 🔄 Phase 0 Adaptation

### Import Base Phase 0

**Reference:** `.claude/library/prompt-perfection-core.md`

**Core Phase 0 Steps (unchanged):**
1. Language detection
2. Prompt type identification
3. Completeness validation
4. Clarifying questions
5. Structured output

**Research-Specific Adaptations:**
- Add research scope analysis
- Add complexity scoring (research depth >= 20)
- Add strategy selection (Narrow/Broad/Comprehensive)
- Add agent selection logic
- Add iteration planning
- Add convergence criteria definition

---

## 🎯 Research-Specific Phase 0 Enhancements

### Step 1: Language Detection (Standard)

Use base Phase 0 language detection:
- Slovak (sk)
- English (en)

**No changes needed.**

---

### Step 2: Prompt Type Identification (Enhanced)

Base types + Research-specific types:

**Standard Types:**
- Task execution
- Question answering
- Bug fix
- Feature implementation
- Code explanation
- Refactoring

**Research-Specific Types:**
- Architecture analysis
- Security audit
- Performance investigation
- Pattern discovery
- Codebase exploration
- Feasibility study
- Technical debt assessment
- Compliance review

**Detection:**
```
IF keywords: ["analyze", "audit", "investigate", "discover", "map", "understand"]:
  → Research type
  → Trigger deep analysis mode
```

---

### Step 3: Completeness Validation (Enhanced)

**Standard Validation:**
- Goal defined?
- Context provided?
- Scope clear?
- Constraints specified?

**Research-Specific Validation:**
- **Research scope** defined?
  - What to analyze? (specific components vs. entire codebase)
  - Depth required? (surface-level vs. comprehensive)
  - Focus areas? (security, performance, architecture, patterns)

- **Success criteria** defined?
  - What questions need answering?
  - What gaps to fill?
  - What decisions to inform?

- **Time constraints** specified?
  - Quick overview (Narrow strategy, 1-2 iterations)
  - Standard analysis (Broad strategy, 2-3 iterations)
  - Comprehensive audit (Comprehensive strategy, 3-4 iterations)

**If Incomplete:**
Ask research-specific clarifying questions.

---

### Step 4: Clarifying Questions (Research-Focused)

**Standard Questions:**
- What is the specific goal?
- What context is relevant?
- What are the constraints?

**Research-Specific Questions:**

**Question 1: Research Scope**
```
"What specific aspects should I research?"

Options:
1. Architecture & Design (Recommended for understanding system structure)
   - Component relationships, data flow, patterns
2. Security & Compliance
   - Vulnerabilities, auth/authz, OWASP Top 10
3. Performance & Scalability
   - Bottlenecks, optimization opportunities, caching
4. Code Quality & Patterns
   - Conventions, consistency, technical debt
5. All of the Above (Comprehensive - takes longer)
```

**Question 2: Research Depth**
```
"How deep should the analysis be?"

Options:
1. Quick Overview (Narrow - 1-2 iterations, ~60s)
   - High-level understanding, key components only
2. Standard Analysis (Broad - 2-3 iterations, ~120s) (Recommended)
   - Thorough analysis, most important areas covered
3. Comprehensive Audit (Comprehensive - 3-4 iterations, ~180s)
   - Deep dive, all aspects, maximum coverage
```

**Question 3: Specific Questions**
```
"What specific questions do you need answered?"

User input: [Open text field]
Examples:
  - "How does authentication work?"
  - "Are there any SQL injection vulnerabilities?"
  - "What causes the slow performance on the dashboard?"
  - "What patterns are used for error handling?"
```

**Question 4: Focus Areas** (if scope = "All of the Above")
```
"Should any area receive special attention?"

Options:
1. Equal priority for all areas
2. Prioritize security findings
3. Prioritize performance bottlenecks
4. Prioritize architectural understanding
```

---

### Step 5: Structured Output (Research Format)

**Standard Prompt Format:**
```markdown
## Goal
[Research objective]

## Research Scope
[What to analyze - specific components or full codebase]

## Research Depth
[Narrow / Broad / Comprehensive]

## Focus Areas
- [Area 1: Architecture]
- [Area 2: Security]
- [Area 3: Performance]
- [Area 4: Patterns]

## Specific Questions
1. [Question 1]
2. [Question 2]
3. [Question 3]

## Success Criteria
[What answers/insights are needed]

## Constraints
- Time: [Quick/Standard/Comprehensive]
- Files to analyze: [Specific paths if provided]
- Files to exclude: [Patterns to exclude]

## Expected Deliverables
- Research report with findings
- Citations for all claims
- Architectural insights
- Security/performance/pattern analysis
- Recommendations with priorities
- Knowledge graph updates
```

---

## 🧠 Complexity Scoring for Research

### Research Depth Score (Extends Existing Complexity)

**Existing Complexity Triggers (0-15):**
- Multi-file scope: +5
- Architecture questions: +7
- Pattern detection: +6
- Feasibility checks: +4
- Implementation planning: +3
- Cross-cutting concerns: +4
- Refactoring tasks: +5

**Research-Specific Triggers (+5 to +10 each):**
- **Security audit requested:** +10
- **Performance investigation:** +8
- **Architecture analysis:** +7
- **Pattern discovery:** +6
- **Codebase exploration:** +7
- **Technical debt assessment:** +8
- **Compliance review:** +10
- **Multiple focus areas:** +5

**Score Thresholds:**
- **0-19:** Use `/prompt-hybrid` (faster, single-pass)
- **20-29:** Research mode (Narrow strategy, 2 agents, 1-2 iterations)
- **30-49:** Research mode (Broad strategy, 3-4 agents, 2-3 iterations)
- **50+:** Research mode (Comprehensive strategy, 5 agents, 3-4 iterations)

**Example Scoring:**
```
Prompt: "Analyze authentication system for security vulnerabilities and performance issues"

Triggers:
  - "authentication" → Cross-cutting concern (+4)
  - "security vulnerabilities" → Security audit (+10)
  - "performance issues" → Performance investigation (+8)
  - "analyze" → Architecture analysis (+7)
  - Multiple focus areas (security + performance) → (+5)

Total: 34 → Broad research strategy (3-4 agents, 2-3 iterations)
```

---

## 🎭 Strategy Selection

### Based on Complexity Score and User Preference

**Narrow Research Strategy** (Score 20-29 OR user choice)
- **Initial Agents:** 2 (ExploreAgent + CitationAgent)
- **Max Iterations:** 2
- **Duration:** ~60 seconds
- **Use Case:** Quick overview, specific question, limited scope

**Broad Research Strategy** (Score 30-49 OR user choice) **[Recommended]**
- **Initial Agents:** 3-4 (Explore + Citation + 1-2 specialists)
- **Max Iterations:** 3
- **Duration:** ~120 seconds
- **Use Case:** Standard analysis, multiple questions, balanced depth

**Comprehensive Research Strategy** (Score 50+ OR user choice)
- **Initial Agents:** 5 (Explore + Citation + Security + Performance + Pattern)
- **Max Iterations:** 4
- **Duration:** ~180 seconds
- **Use Case:** Full audit, all aspects, maximum coverage

**Strategy Output:**
```markdown
## Research Strategy Selected

**Strategy:** Broad Research
**Reason:** Complexity score: 34 (multiple focus areas)

**Agents to Deploy:**
1. ExploreAgent (always) - Codebase discovery
2. CitationAgent (always) - Source attribution
3. SecurityAgent (security focus) - Vulnerability detection
4. PerformanceAgent (performance focus) - Bottleneck analysis

**Iteration Plan:**
- Iteration 1: Initial exploration and analysis
- Iteration 2: Gap-driven refinement
- Iteration 3: Validation and convergence check

**Convergence Criteria:**
- Coverage: >= 70%
- Confidence: >= 0.80
- Unresolved conflicts: <= 2
- All critical questions answered
```

---

## 🔗 Integration Wiring

### Integration Point 1: Lead Agent Invocation

**After Phase 0 completes:**

```markdown
## Invoke Lead Agent

**Input to Lead Agent:**
- Perfected prompt (from Phase 0)
- Research scope
- Research depth (Narrow/Broad/Comprehensive)
- Focus areas
- Specific questions
- Complexity score
- Selected strategy

**Lead Agent Actions:**
1. Read external memory (project-knowledge.md, architectural-context.md)
2. Plan initial agent cohort
3. Spawn worker agents in parallel
4. Monitor progress
5. Coordinate iterations
6. Invoke Result Aggregator when converged

**Reference:** `.claude/library/orchestration/lead-agent-core.md`
```

---

### Integration Point 2: Iteration Engine Coordination

**Lead Agent delegates to Iteration Engine:**

```markdown
## Iteration Engine Integration

**Input from Lead Agent:**
- Initial agent results
- Research scope and questions
- Convergence criteria

**Iteration Engine Actions:**
1. Evaluate convergence (coverage, confidence, conflicts, questions)
2. Detect gaps (8 gap types)
3. Select refinement agents
4. Plan next iteration
5. Save checkpoints
6. Repeat until converged (max 4 iterations)

**Reference:** `.claude/library/orchestration/iteration-engine.md`
```

---

### Integration Point 3: External Memory Usage

**Before Research Starts:**

```markdown
## Load External Memory

**Lead Agent reads:**
1. `.claude/memory/project-knowledge.md`
   - Check for existing answers to questions
   - Avoid re-analyzing known areas
   - Focus on gaps in knowledge

2. `.claude/memory/architectural-context.md`
   - Load existing architectural understanding
   - Build on previous insights
   - Refine understanding incrementally

3. `.claude/memory/citation-index.md`
   - Check citation validity
   - Reuse valid citations
   - Avoid redundant file reads

**Benefits:**
- Faster research (skip known areas)
- Incremental understanding (build on previous)
- Avoid redundant work (reuse citations)

**Reference:** `.claude/config/external-memory-config.json`
```

---

### Integration Point 4: Result Aggregator Invocation

**When Iteration Engine signals convergence:**

```markdown
## Invoke Result Aggregator

**Input to Result Aggregator:**
- All agent findings from all iterations
- All citations from CitationAgent
- Iteration checkpoints
- External memory context

**Result Aggregator Actions:**
1. Collect all findings
2. Deduplicate (similarity >= 0.85)
3. Resolve conflicts (6 resolution rules)
4. Score confidence (bonuses/penalties)
5. Organize by priority (Critical/Important/Informational)
6. Integrate citations
7. Generate research report
8. Update knowledge graph

**Output:**
- Comprehensive research report
- Updated project-knowledge.md
- Updated architectural-context.md
- Updated citation-index.md

**Reference:** `.claude/library/orchestration/result-aggregator.md`
```

---

### Integration Point 5: Specialized Agent Deployment

**Lead Agent spawns agents based on focus areas:**

```markdown
## Agent Selection Logic

IF "Architecture" in focus_areas:
  Spawn ExploreAgent (always included anyway)

IF "Security" in focus_areas OR security_keywords detected:
  Spawn SecurityAgent
  Configure for OWASP Top 10 checks

IF "Performance" in focus_areas OR performance_keywords detected:
  Spawn PerformanceAgent
  Configure for bottleneck detection

IF "Patterns" in focus_areas OR consistency_questions asked:
  Spawn PatternAgent
  Configure for convention detection

CitationAgent ALWAYS spawned (provides evidence)

**Agent References:**
- `.claude/library/agents/explore-agent.md`
- `.claude/library/agents/citation-agent.md`
- `.claude/library/agents/security-agent.md`
- `.claude/library/agents/performance-agent.md`
- `.claude/library/agents/pattern-agent.md`

**Configuration:** `.claude/config/agent-roles.json`
```

---

### Integration Point 6: Cache Integration

**Leverage existing hybrid-adapter cache:**

```markdown
## Cache Integration

**Check agent result cache:**
1. Generate cache key:
   - Perfected prompt hash
   - File hashes of relevant files
   - Git branch
   - Agent template version

2. Check `.claude/cache/agent-results/`
   - IF cache hit AND valid (< 24h, files unchanged):
     Use cached agent results
     Skip agent spawning
     10-20x faster
   - IF cache miss OR invalid:
     Spawn agents normally
     Cache results after completion

**Cache applies to:**
- Individual agent results (per iteration)
- NOT to aggregation (always fresh)
- NOT to external memory reads (always current)

**Reference:** `.claude/config/cache-config.json`
```

---

### Integration Point 7: Learning System Integration

**Leverage existing learning system:**

```markdown
## Learning System Integration

**Pattern Tracking:**
1. After research completes, track patterns:
   - Research topic → Findings pattern
   - User questions → Answer locations
   - Focus areas → Agent effectiveness

2. Update `.claude/memory/prompt-patterns.md`
   - If pattern occurs 3+ times, suggest as smart default
   - "You previously researched authentication - use same approach?"

3. Improve complexity scoring:
   - Track actual vs. estimated complexity
   - Adjust trigger weights over time
   - Optimize strategy selection

**Reference:** `.claude/config/learning-config.json`
```

---

## 🎯 Research Flow Summary

```markdown
## Complete Research Flow

User: "/prompt-research Analyze authentication system"
  ↓
Phase 0 (Research Adapter):
  1. Detect language (English)
  2. Identify type (Security audit + Architecture analysis)
  3. Validate completeness
  4. Ask clarifying questions (scope, depth, questions)
  5. Calculate complexity score: 34 (Broad strategy)
  6. Output perfected prompt with strategy
  ↓
Lead Agent Invocation:
  1. Read external memory (check existing knowledge)
  2. Select Broad strategy (3-4 agents, 2-3 iterations)
  3. Plan agent cohort: Explore + Citation + Security + Pattern
  4. Spawn agents in parallel (Iteration 1)
  5. Monitor agent progress
  ↓
Iteration Engine:
  1. Collect Iteration 1 results
  2. Evaluate convergence: Coverage 60%, Confidence 0.75
  3. Detect gaps: Missing performance analysis, low coverage
  4. Plan Iteration 2: Spawn PerformanceAgent, refine gaps
  5. Spawn Iteration 2 agents
  6. Collect Iteration 2 results
  7. Evaluate convergence: Coverage 75%, Confidence 0.82
  8. Converged! (meets thresholds)
  ↓
Result Aggregator:
  1. Collect findings from both iterations (all agents)
  2. Deduplicate (remove 3 duplicate findings)
  3. Resolve conflicts (1 conflict auto-resolved)
  4. Score confidence (aggregate with bonuses)
  5. Organize by priority:
     - Critical: 2 findings (SQL injection, N+1 query)
     - Important: 5 findings (missing indexes, weak hashing)
     - Informational: 8 findings (patterns, conventions)
  6. Integrate citations (25 citations total)
  7. Generate comprehensive research report
  8. Update knowledge graph
  ↓
Output to User:
  - Research Report (15-20 pages)
  - Executive summary
  - Critical/Important/Informational findings
  - Security analysis
  - Performance analysis
  - Pattern analysis
  - Recommendations
  - Citations and references
  - Knowledge graph updates
  - Next steps

Total Duration: ~120 seconds (Broad strategy)
```

---

## ⚙️ Configuration References

### Orchestration Config
**File:** `.claude/config/orchestration-config.json`

**Key Settings:**
- Strategy templates (Narrow/Broad/Comprehensive)
- Agent cohort rules
- Iteration limits (max 4)
- Convergence thresholds

### Agent Roles Config
**File:** `.claude/config/agent-roles.json`

**Key Settings:**
- Agent expertise and triggers
- Model selection (Haiku/Sonnet)
- Timeout settings
- Tool permissions

### External Memory Config
**File:** `.claude/config/external-memory-config.json`

**Key Settings:**
- Memory persistence
- Merge strategies
- Update frequency
- Retention policies

### Complexity Rules Config
**File:** `.claude/config/complexity-rules.json`

**Key Settings:**
- Research depth triggers
- Score thresholds (20+ for research)
- Trigger weights

---

## 📊 Performance Expectations

### Narrow Research (Score 20-29)
- **Agents:** 2 (Explore + Citation)
- **Iterations:** 1-2
- **Duration:** ~60 seconds
- **Findings:** 5-10
- **Coverage:** 40-60%

### Broad Research (Score 30-49) **[Typical]**
- **Agents:** 3-4 (Explore + Citation + 1-2 specialists)
- **Iterations:** 2-3
- **Duration:** ~120 seconds
- **Findings:** 10-20
- **Coverage:** 60-80%

### Comprehensive Research (Score 50+)
- **Agents:** 5 (All specialists)
- **Iterations:** 3-4
- **Duration:** ~180 seconds
- **Findings:** 20-40
- **Coverage:** 80-95%

**Cache Performance:**
- First run: Full duration
- Cached run (same prompt, files unchanged): ~10 seconds (10-20x faster)

---

## 🔧 Error Handling

### Phase 0 Failures
```
IF Phase 0 cannot complete prompt:
  Return to user with specific questions
  Do not proceed to Lead Agent
  Wait for user clarification
```

### Agent Spawn Failures
```
IF agent fails to spawn:
  Log error
  Continue with other agents
  Report gap in final report
  Reduce coverage score accordingly
```

### Convergence Timeout
```
IF max iterations reached (4) without convergence:
  Invoke Result Aggregator anyway
  Flag in report: "Research incomplete - max iterations reached"
  Provide partial results
  Suggest follow-up research
```

### Memory Update Failures
```
IF knowledge graph update fails:
  Log error
  Save findings to temporary file
  Alert user to manual merge
  Research report still delivered
```

---

## 📝 Version History

**v1.0.0 (Phase 5 - Command Integration):**
- Research-specific Phase 0 adaptation
- Orchestration flow wiring
- Integration with all Phase 1-4 components
- Strategy selection logic
- Cache and learning integration
- Complete research flow implementation

---

## 🔗 Related Components

**Imports:**
- `.claude/library/prompt-perfection-core.md` (base Phase 0)

**Invokes:**
- `.claude/library/orchestration/lead-agent-core.md`
- `.claude/library/orchestration/iteration-engine.md`
- `.claude/library/orchestration/result-aggregator.md`

**Integrates:**
- `.claude/library/agents/*` (all specialized agents)
- `.claude/memory/*` (external memory system)
- `.claude/cache/*` (agent result cache)

**Configured by:**
- `.claude/config/orchestration-config.json`
- `.claude/config/agent-roles.json`
- `.claude/config/external-memory-config.json`
- `.claude/config/complexity-rules.json`
- `.claude/config/cache-config.json`
- `.claude/config/learning-config.json`

**Used by:**
- `.claude/commands/prompt-research.md` (main command)

---

**Research Adapter - Comprehensive Multi-Agent Research with Iterative Refinement**
