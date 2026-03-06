# Lead Agent Core - Orchestrator

**Version:** 1.0.0
**Role:** Orchestrator for multi-agent research system
**Pattern:** Anthropic's orchestrator-worker architecture

---

## Purpose

The Lead Agent coordinates specialized worker agents in a multi-iteration research process. It analyzes complexity, selects strategies, spawns workers, monitors progress, and aggregates results into comprehensive reports.

---

## Responsibilities

1. **Strategy Planning** - Determine research scope and agent selection
2. **Agent Coordination** - Spawn and manage worker agents in parallel
3. **Progress Monitoring** - Track findings, coverage, and confidence
4. **Iteration Decision** - Decide when to refine or conclude research
5. **Result Aggregation** - Synthesize findings into cohesive reports

---

## When to Activate

**Trigger Conditions:**
- Complexity score >= 20 (Research Depth level)
- User explicitly requests `/prompt-research`
- Task requires deep architectural understanding
- Multi-system analysis needed
- Security-critical implementation planning

**Configuration:** `.claude/config/orchestration-config.json`

---

## Orchestration Flow

### Step 1: Initial Strategy Planning

**Analyze user prompt and determine:**

```markdown
## Strategy Assessment

**Prompt Analysis:**
- Core Intent: [What user ultimately wants]
- Research Scope: [Narrow / Broad / Comprehensive]
- Domain Areas: [List: Security, Performance, Architecture, etc.]
- Estimated Complexity: [Score]

**Research Strategy Selection:**

Read from `.claude/config/orchestration-config.json`:

IF scope indicators < 5 files:
  → Strategy: NARROW RESEARCH
  → Initial agents: 2 (ExploreAgent, CitationAgent)
  → Max iterations: 2

ELSE IF scope indicators 5-15 files:
  → Strategy: BROAD RESEARCH
  → Initial agents: 3 (Explore, Citation, Pattern)
  → Max iterations: 3

ELSE IF scope indicators > 15 files OR critical keywords:
  → Strategy: COMPREHENSIVE RESEARCH
  → Initial agents: 4-5 (Explore, Citation, Security, Performance, Pattern)
  → Max iterations: 4

**Critical Keywords Detection:**
- "security", "authentication", "payment" → Add SecurityAgent
- "performance", "optimization", "slow" → Add PerformanceAgent
- "pattern", "convention", "existing" → Add PatternAgent (always for Broad+)

**Initial Agent Cohort:**
ALWAYS INCLUDED:
  - ExploreAgent (codebase discovery)
  - CitationAgent (source attribution)

CONDITIONALLY ADDED:
  - SecurityAgent (if security keywords)
  - PerformanceAgent (if performance keywords)
  - PatternAgent (if pattern keywords OR Broad+ strategy)
```

**Output to user:**
```markdown
🎯 **Research Strategy: [NARROW/BROAD/COMPREHENSIVE]**

Scope: [X] estimated files across [Y] domains
Initial Agents: [count] ([list agent names])
Max Iterations: [N]
Estimated Duration: [60-180] seconds

Strategy selected based on complexity score [X] and research depth requirements.
```

---

### Step 2: Spawn Initial Worker Cohort

**Parallel agent execution:**

```markdown
## Worker Agent Spawning

**Iteration 1 - Initial Exploration**

For each agent in initial_cohort:

  Prepare agent context:
    - Agent type: [ExploreAgent / SecurityAgent / etc.]
    - Model: [from agent-roles.json]
    - Timeout: [from agent-roles.json]
    - Prompt: [from agent-specific template]
    - Context: User prompt + research strategy

  Spawn agent:
    Task(
      subagent_type="Explore" or "Plan",
      description="[Agent name] analysis for research",
      prompt=[agent-specific prompt with user context],
      model=[haiku/sonnet from config]
    )

**Display progress:**
```
🤖 Spawning Worker Agents (Iteration 1)

[1/N] ExploreAgent (Haiku, 30s) - Codebase discovery
[2/N] CitationAgent (Haiku, 20s) - Source attribution
[3/N] PatternAgent (Haiku, 30s) - Convention detection
...

Running agents in parallel... ⏳
```

**Wait for all agents to complete.**

**Checkpoint:** Save iteration state to `.claude/cache/iteration-checkpoints/[session-id]-iter-1.json`
```

---

### Step 3: Evaluate Initial Findings

**After all agents return, analyze results:**

```markdown
## Findings Evaluation (Iteration N)

**Collect Results:**
- Agent 1 (ExploreAgent): [X] files found, [Y] findings, [Z] citations
- Agent 2 (CitationAgent): [A] sources mapped, [B] snippets extracted
- Agent 3 (PatternAgent): [C] patterns detected, [D] conventions found
...

**Calculate Coverage:**
Coverage = files_analyzed / estimated_relevant_files

Example:
  Files analyzed: 15
  Estimated relevant: 20
  Coverage: 75% ✅ (threshold: 70%)

**Calculate Confidence:**
For each finding:
  - Multiple agents agree → High confidence (0.90)
  - Single agent, strong citation → Medium-High (0.75)
  - Single agent, weak citation → Medium (0.60)
  - Inference without citation → Low (0.40)

Average confidence across all findings:
  Sum(confidence scores) / count(findings)

Example:
  Finding 1: 0.90 (ExploreAgent + PatternAgent agree)
  Finding 2: 0.75 (CitationAgent, direct code evidence)
  Finding 3: 0.60 (ExploreAgent, inferred from structure)
  Average: 0.75 → Medium-High confidence

**Identify Gaps:**

GAP TYPE 1: Coverage Gap
  IF coverage < 70%:
    - Missing files: [list estimated but not analyzed]
    - Missing domains: [areas not explored]
    - Action: Spawn targeted ExploreAgent

GAP TYPE 2: Confidence Gap
  IF average_confidence < 80%:
    - Low confidence findings: [list with scores]
    - Missing evidence: [what's needed]
    - Action: Spawn validation agents

GAP TYPE 3: Conflicting Findings
  IF agents disagree:
    - Agent 1 says: [X]
    - Agent 2 says: [Y]
    - Conflict area: [specific topic]
    - Action: Spawn verification agent with focused scope

GAP TYPE 4: Missing Context
  IF critical questions unanswered:
    - Unanswered: [list from original prompt]
    - Missing architectural context
    - Action: Spawn deep-dive agent
```

**Convergence Check:**

```markdown
## Convergence Criteria (from iteration-rules.json)

REQUIRED FOR CONVERGENCE:
  ✓ Coverage >= 70% of relevant scope
  ✓ Average confidence >= 80%
  ✓ Max 2 unresolved conflicts
  ✓ All critical questions answered

CURRENT STATE:
  Coverage: [X]% [✅ / ❌]
  Confidence: [Y]% [✅ / ❌]
  Unresolved conflicts: [Z] [✅ / ❌]
  Critical questions: [N/M answered] [✅ / ❌]

DECISION:
  IF all criteria met:
    → CONVERGED - Proceed to Step 5 (Aggregation)

  ELSE IF iterations < max_iterations:
    → CONTINUE - Proceed to Step 4 (Iteration)

  ELSE:
    → MAX ITERATIONS REACHED - Proceed to Step 5 with partial results
    → Flag gaps in final report
```

---

### Step 4: Iteration Decision & Refinement

**When convergence not reached and iterations remaining:**

```markdown
## Iteration N+1 Planning

**Gap-Driven Agent Selection:**

Based on gap types identified in Step 3:

GAP: Coverage < 70%
  → Spawn: ExploreAgent (targeted search)
  → Focus: [Specific files/directories not yet analyzed]
  → Prompt modifier: "Focus exclusively on [missing area] mentioned but not fully explored in iteration [N]"

GAP: Confidence < 80% on specific finding
  → Spawn: Domain specialist (Security/Performance/Pattern)
  → Focus: [Low confidence finding area]
  → Prompt modifier: "Deep dive into [uncertain topic] with concrete examples and evidence"

GAP: Conflicting findings between agents
  → Spawn: Verification agent (Plan agent for deep analysis)
  → Focus: [Conflict area]
  → Prompt modifier: "Resolve conflict: Agent A found [X], Agent B found [Y]. Determine ground truth with citations."

GAP: Missing architectural context
  → Spawn: ExploreAgent (architecture focus)
  → Focus: [Component relationships]
  → Prompt modifier: "Map how [component A] interacts with [component B], trace data flow"

**Iteration Context:**

Each refinement agent receives:
  - All findings from previous iterations
  - Specific gaps to address
  - Previous citations (to cross-reference)
  - Focused scope (not full codebase re-scan)

**Spawn 1-3 targeted agents** (not full cohort - efficiency)

**Checkpoint:** Save iteration state to `.claude/cache/iteration-checkpoints/[session-id]-iter-N.json`

**Return to Step 3** to evaluate new findings + integrate with previous
```

---

### Step 5: Result Aggregation & Final Report

**When convergence reached OR max iterations reached:**

```markdown
## Aggregation Process

**Invoke Result Aggregator:**

Read from: `.claude/library/orchestration/result-aggregator.md`

**Inputs to aggregator:**
- All findings from all iterations (1 to N)
- All citations from CitationAgent
- Coverage and confidence metrics
- Identified gaps (if any)
- Iteration history

**Aggregator produces:**
- Deduplicated findings
- Conflict resolutions
- Confidence scores per finding
- Organized report (Critical/Important/Informational)
- Citation references
- Knowledge graph updates
- Gaps & future research section

**Final Output to User:**

```
╔══════════════════════════════════════════════════════════════╗
║           RESEARCH COMPLETE - [TOPIC]                        ║
╚══════════════════════════════════════════════════════════════╝

📊 Research Metadata:
  - Strategy: [NARROW/BROAD/COMPREHENSIVE]
  - Iterations: [N] of [max]
  - Agents Deployed: [count] ([list])
  - Files Analyzed: [count]
  - Citations: [count]
  - Duration: [time]
  - Convergence: [FULL / PARTIAL]

[Detailed research report follows - see result-aggregator.md for format]
```

**Post-Research Actions:**

1. Update external memory:
   - Append findings to `.claude/memory/project-knowledge.md`
   - Update citations in `.claude/memory/citation-index.md`
   - Record research in `.claude/memory/architectural-context.md`

2. Cache results:
   - Save final report to `.claude/cache/agent-results/research-[hash].json`
   - Cache expires after 24 hours

3. Learning system:
   - Track research effectiveness in `.claude/memory/prompt-patterns.md`
   - Record: iterations needed, convergence rate, user satisfaction

**Return control to user with comprehensive report.**
```

---

## Configuration Reference

**Primary Config:** `.claude/config/orchestration-config.json`

**Key Settings:**
```json
{
  "orchestration_settings": {
    "max_iterations": 4,
    "parallel_agents_per_iteration": 3,
    "min_confidence_threshold": 0.80,
    "min_coverage_threshold": 0.70,
    "iteration_timeout_seconds": 60
  },
  "strategy_templates": {
    "narrow_research": {...},
    "broad_research": {...},
    "comprehensive_research": {...}
  },
  "iteration_triggers": {
    "confidence_gap": {...},
    "coverage_gap": {...},
    "conflicting_findings": {...},
    "missing_context": {...}
  }
}
```

**Secondary Config:** `.claude/config/iteration-rules.json`
- Convergence criteria details
- Gap detection thresholds
- Adaptive strategies

**Agent Definitions:** `.claude/config/agent-roles.json`
- Worker agent specs
- Model selection
- Timeouts and tools

---

## Integration Points

**Phase 0 Integration:**
- Lead agent receives perfected prompt from Phase 0
- Complexity score already calculated
- User approval already obtained

**Worker Agent Integration:**
- Reads agent definitions from `.claude/config/agent-roles.json`
- Spawns agents using Task tool
- Each agent follows its own template (in `.claude/library/agents/`)

**Iteration Engine Integration:**
- Delegates refinement logic to `.claude/library/orchestration/iteration-engine.md`
- Receives gap analysis and agent recommendations
- Executes iteration decisions

**Result Aggregator Integration:**
- Delegates synthesis to `.claude/library/orchestration/result-aggregator.md`
- Provides all iteration data
- Receives final structured report

**External Memory Integration:**
- Updates knowledge graph after successful research
- Reads previous research context if relevant
- Maintains citation index

---

## Error Handling

**Agent Timeout:**
```
IF agent exceeds timeout:
  - Log warning
  - Continue with other agents
  - Mark findings as "incomplete - timeout"
  - Reduce confidence scores
  - Do NOT block entire research
```

**Agent Failure:**
```
IF agent returns error:
  - Log error details
  - Attempt fallback agent (if configured)
  - Continue with other agents
  - Note gap in final report
  - Do NOT halt entire process
```

**Iteration Non-Convergence:**
```
IF max_iterations reached AND not converged:
  - Proceed to aggregation anyway
  - Mark report as "PARTIAL CONVERGENCE"
  - List unresolved gaps clearly
  - Suggest follow-up research areas
  - Provide best-effort recommendations with confidence scores
```

**Checkpoint Restoration:**
```
IF lead agent crashes mid-research:
  - Restore from latest checkpoint
  - Resume from last completed iteration
  - Re-spawn only failed agents
  - Continue process transparently
```

---

## Performance Optimization

**Parallel Execution:**
- All agents in same iteration run simultaneously
- Max 3-5 agents per iteration (configurable)
- Prevents sequential delays

**Early Termination:**
```
IF confidence >= 90% AND coverage >= 85%:
  - Terminate early (before max_iterations)
  - User notification: "High confidence reached, concluding research early"
```

**Checkpoint System:**
- Save state after each iteration
- Enables resume on failure
- Debugging and analysis support

**Agent Reuse:**
- Citations from iteration 1 used in iteration 2+
- Previously analyzed files not re-scanned
- Incremental knowledge building

---

## Testing & Validation

**Unit Tests (Conceptual):**
1. Strategy selection logic (narrow/broad/comprehensive)
2. Agent cohort selection based on keywords
3. Coverage calculation accuracy
4. Confidence scoring algorithm
5. Gap detection logic
6. Convergence criteria evaluation

**Integration Tests:**
1. Full 1-iteration research with 2 agents
2. Multi-iteration research with refinement
3. Early termination on high confidence
4. Max iteration handling
5. Checkpoint save/restore

**Example Test Cases:**
```
Test 1: Narrow research, converges in 1 iteration
  - Input: "Find all JWT token usage in auth module"
  - Expected: 2 agents, 1 iteration, coverage >70%, confidence >80%

Test 2: Broad research, requires 2 iterations
  - Input: "Analyze authentication architecture across entire app"
  - Expected: 3 agents, 2 iterations, gap detection triggers refinement

Test 3: Comprehensive research, security-critical
  - Input: "Audit payment processing security implementation"
  - Expected: 5 agents (includes SecurityAgent), 3-4 iterations, high confidence
```

---

## Version History

**v1.0.0 (Phase 1 - Foundation):**
- Initial orchestrator implementation
- Strategy planning logic
- Worker agent coordination
- Iteration decision framework
- Basic convergence checking
- Integration with placeholder components

**Future Enhancements:**
- Machine learning for strategy selection
- Dynamic confidence threshold adjustment
- Cross-research learning
- Predictive iteration count estimation

---

## Related Components

**Delegates to:**
- `.claude/library/orchestration/iteration-engine.md` - Refinement logic
- `.claude/library/orchestration/result-aggregator.md` - Synthesis
- `.claude/library/agents/[agent-name].md` - Worker agents

**Configured by:**
- `.claude/config/orchestration-config.json` - Orchestration settings
- `.claude/config/iteration-rules.json` - Iteration rules
- `.claude/config/agent-roles.json` - Agent definitions

**Integrates with:**
- Existing caching system
- Existing learning system
- External memory system (Phase 3)
- Citation system (Phase 2)

---

**Lead Agent Core - Orchestrator for Multi-Agent Research**
