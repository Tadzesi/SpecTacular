# Iteration Engine - Multi-Step Refinement

**Version:** 1.0.0
**Role:** Iterative refinement loop with adaptive strategy
**Pattern:** Multi-step search with dynamic adaptation (Anthropic pattern)

---

## Purpose

The Iteration Engine manages the multi-step refinement process, analyzing gaps in findings and adaptively spawning targeted agents to fill those gaps. It operates within the orchestration flow, receiving findings from one iteration and determining what additional research is needed.

---

## Core Responsibilities

1. **Gap Analysis** - Identify what's missing or uncertain from current findings
2. **Adaptive Agent Selection** - Choose specialized agents to address specific gaps
3. **Refinement Planning** - Design targeted research scope for next iteration
4. **Convergence Evaluation** - Determine if research can conclude
5. **Checkpoint Management** - Save and restore iteration state

---

## Configuration

**Primary:** `.claude/config/iteration-rules.json`
**Secondary:** `.claude/config/orchestration-config.json`

---

## Iteration Workflow

### Overview

```
┌─────────────────────────────────────┐
│   Iteration N                        │
│                                      │
│   1. Receive previous findings      │
│   2. Analyze gaps                   │
│   3. Select refinement agents       │
│   4. Spawn targeted agents          │
│   5. Integrate new findings         │
│   6. Check convergence              │
│                                      │
│   IF converged → Exit               │
│   IF not converged AND N < max →    │
│       Continue to Iteration N+1     │
│   IF N >= max → Exit with partial   │
└─────────────────────────────────────┘
```

---

## Step 1: Receive Previous Iteration Findings

**Input Structure:**

```markdown
## Iteration [N-1] Results

**Findings Count:** [X]
**Files Analyzed:** [list with file paths]
**Citations:** [count]
**Coverage:** [percentage]
**Average Confidence:** [score 0-1]

**Findings by Category:**

CRITICAL (High Impact):
  - Finding 1: [description] [confidence] [citations]
  - Finding 2: [description] [confidence] [citations]

IMPORTANT (Medium Impact):
  - Finding 3: [description] [confidence] [citations]

INFORMATIONAL (Low Impact):
  - Finding 4: [description] [confidence] [citations]

**Agent Contributions:**
  - ExploreAgent: [X] findings, [Y] files
  - CitationAgent: [X] citations
  - PatternAgent: [X] patterns detected
  ...

**Uncertainties:**
  - Area 1: Low confidence ([score])
  - Area 2: Conflicting information
  - Area 3: Incomplete exploration
```

---

## Step 2: Gap Analysis

**Gap Types Detected:**

### Gap Type 1: Coverage Gap

**Detection:**
```
Coverage = files_analyzed / estimated_relevant_files

IF coverage < min_coverage_threshold (default: 0.70):
  → Coverage gap detected
```

**Analysis:**
```markdown
### Coverage Gap Analysis

**Current Coverage:** [X]% ([A] of [B] estimated files)

**Missing Areas:**
Identify by comparing:
  - User prompt scope (what was requested)
  - Files analyzed (what was covered)
  - Common imports/dependencies (what was referenced but not explored)

**Example:**
User asked about: "authentication system"
Files analyzed: AuthController.cs, LoginService.cs
Missing files: JwtService.cs (referenced in LoginService), AuthMiddleware.cs (not explored)

**Estimated missing:** 5-7 files

**Action Required:**
Spawn targeted ExploreAgent with specific file list or directory focus
```

---

### Gap Type 2: Confidence Gap

**Detection:**
```
Average confidence across all findings

IF average_confidence < min_confidence_threshold (default: 0.80):
  → Confidence gap detected
```

**Analysis:**
```markdown
### Confidence Gap Analysis

**Current Average Confidence:** [X] (threshold: 0.80)

**Low Confidence Findings:**
  1. Finding: "[description]"
     Confidence: 0.60
     Reason: Single agent, weak citation (inferred from structure)
     Missing: Direct code evidence

  2. Finding: "[description]"
     Confidence: 0.55
     Reason: Conflicting information from 2 agents
     Missing: Verification with ground truth

**Action Required:**
For each low-confidence finding:
  - IF missing evidence → Spawn CitationAgent (targeted)
  - IF conflicting info → Spawn verification agent
  - IF uncertain pattern → Spawn PatternAgent (deep dive)
```

---

### Gap Type 3: Conflicting Findings

**Detection:**
```
IF agents reported contradictory information:
  - Agent A says: X
  - Agent B says: Y
  - Cosine similarity < 0.70 (different conclusions)
```

**Analysis:**
```markdown
### Conflict Analysis

**Conflict 1:**
  - Agent: ExploreAgent
  - Finding: "Uses SQL Server for data storage"
  - Evidence: Connection string in appsettings.json

  vs.

  - Agent: PatternAgent
  - Finding: "Uses Entity Framework with PostgreSQL"
  - Evidence: DbContext configuration shows Npgsql provider

**Root Cause:** Different config files analyzed (appsettings.json vs appsettings.Development.json)

**Action Required:**
Spawn verification agent to:
  1. Check all configuration files
  2. Determine actual database per environment
  3. Provide definitive answer with complete citations
```

---

### Gap Type 4: Missing Context

**Detection:**
```
Compare findings to original prompt:
  - Critical questions from prompt still unanswered
  - Architectural relationships unclear
  - Data flow not traced
  - Integration points not mapped
```

**Analysis:**
```markdown
### Missing Context Analysis

**Original Prompt Required:**
"Analyze how authentication works across the entire app"

**What We Know (from Iteration N-1):**
  - AuthController handles login endpoint ✅
  - JWT tokens are generated ✅
  - Token validation happens... ❌ UNKNOWN

**Missing Architectural Context:**
  - WHERE does token validation occur? (Middleware? Filter? Attribute?)
  - HOW do protected endpoints verify tokens?
  - WHAT happens on validation failure?

**Action Required:**
Spawn focused ExploreAgent:
  - Trace request pipeline from login → protected endpoint
  - Find middleware/filter registration
  - Map token validation flow
```

---

### Gap Type 5: Unanswered Critical Questions

**Detection:**
```
Extract critical questions from original prompt:
  - "Is it possible to..." → Feasibility question
  - "How does..." → Architectural question
  - "What handles..." → Component location question
  - "Why is..." → Rationale question

Check which are answered vs. unanswered
```

**Analysis:**
```markdown
### Unanswered Questions

**From Original Prompt:**
1. "How does the app handle password resets?" ✅ ANSWERED
2. "Is it possible to add OAuth providers?" ❌ UNANSWERED
3. "What handles session management?" ❌ PARTIALLY ANSWERED

**Gap Details:**

Question 2: OAuth feasibility
  - Current findings: None (not explored)
  - Needed: Check for OAuth libraries, existing patterns, feasibility
  - Action: Spawn SecurityAgent (OAuth analysis)

Question 3: Session management
  - Current findings: "JWT tokens used" (partial)
  - Needed: Token storage location, refresh mechanism, expiration handling
  - Action: Spawn ExploreAgent (session deep dive)
```

---

## Step 3: Adaptive Agent Selection

**Based on gap types, select specialized agents:**

```markdown
## Agent Selection Logic

Read from: `.claude/config/iteration-rules.json`

GAP TYPE: Coverage Gap
  → AGENT: ExploreAgent
  → MODEL: Haiku (fast exploration)
  → FOCUS: Specific files/directories not yet analyzed
  → PROMPT_MODIFIER: "Analyze ONLY these files: [missing_file_list]. Provide patterns and connections to previously analyzed code."

GAP TYPE: Confidence Gap (missing evidence)
  → AGENT: CitationAgent
  → MODEL: Haiku (citation focused)
  → FOCUS: Low-confidence findings needing code evidence
  → PROMPT_MODIFIER: "For finding '[low_confidence_finding]', locate exact code implementation with file:line citations and code snippets."

GAP TYPE: Confidence Gap (pattern unclear)
  → AGENT: PatternAgent
  → MODEL: Haiku (pattern analysis)
  → FOCUS: Uncertain patterns needing examples
  → PROMPT_MODIFIER: "Deep dive into '[pattern_name]' pattern. Find 3+ concrete examples with similarities and variations."

GAP TYPE: Conflicting Findings
  → AGENT: Plan Agent (verification)
  → MODEL: Sonnet (deep analysis)
  → FOCUS: Conflict resolution
  → PROMPT_MODIFIER: "Resolve conflict: Agent A found '[X]', Agent B found '[Y]'. Analyze all relevant sources and provide ground truth with comprehensive citations."

GAP TYPE: Missing Architectural Context
  → AGENT: ExploreAgent
  → MODEL: Haiku
  → FOCUS: Component relationships and data flow
  → PROMPT_MODIFIER: "Trace how [component A] integrates with [component B]. Map the complete flow from [start] to [end] with file:line references."

GAP TYPE: Security Uncertainty
  → AGENT: SecurityAgent
  → MODEL: Sonnet (security expertise)
  → FOCUS: Security-specific gaps
  → PROMPT_MODIFIER: "Analyze security implications of '[uncertain_area]'. Check for vulnerabilities, best practices, and provide security recommendations."

GAP TYPE: Performance Uncertainty
  → AGENT: PerformanceAgent
  → MODEL: Sonnet (performance expertise)
  → FOCUS: Performance-specific gaps
  → PROMPT_MODIFIER: "Analyze performance characteristics of '[uncertain_area]'. Identify bottlenecks, inefficiencies, and optimization opportunities."
```

**Agent Limit:**
```
Max agents per iteration: 3 (from orchestration-config.json)

IF gaps > 3:
  - Prioritize by impact (Critical > Important > Informational)
  - Prioritize by user prompt requirements
  - Defer lower-priority gaps to next iteration if needed
```

---

## Step 4: Spawn Refinement Agents

**Execution:**

```markdown
## Refinement Agent Spawning (Iteration N)

**Selected Agents:** [list]

For each selected agent:

  **Context Provided:**
  - User's original prompt
  - All findings from iterations 1 to N-1
  - Specific gap to address
  - Previous citations (cross-reference)
  - Files already analyzed (avoid duplication)

  **Focused Scope:**
  NOT full codebase re-scan
  ONLY targeted analysis for specific gap

  **Prompt Construction:**
  Base template (from agent-roles.json)
  + Gap-specific modifier
  + Previous iteration context
  + Explicit focus area

**Example Refinement Prompt (ExploreAgent):**

```
You are ExploreAgent, specialized in codebase discovery.

CONTEXT FROM PREVIOUS ITERATIONS:
- Iteration 1 analyzed: AuthController.cs, LoginService.cs, User.cs
- Found: JWT token generation in LoginService.GenerateToken()
- Missing: Token validation implementation

YOUR SPECIFIC TASK (Gap: Missing architectural context):
Trace how JWT tokens are VALIDATED when accessing protected endpoints.

FOCUS AREAS:
1. Find middleware/filters that handle authorization
2. Locate token validation logic
3. Map flow: Protected endpoint → Auth check → Token validation
4. Provide file:line citations for each step

DO NOT re-analyze files already covered (AuthController, LoginService, User).
FOCUS ONLY on the validation pipeline.

Expected output: Complete token validation flow with citations.
```

**Spawn using Task tool:**
```
Task(
  subagent_type="Explore",
  description="Trace JWT validation flow",
  prompt=[constructed prompt above],
  model="haiku"
)
```

**Parallel Execution:**
All refinement agents run simultaneously (up to max 3)

**Progress Display:**
```
🔄 Iteration [N] - Refinement Analysis

Gaps identified: [X]
Refinement agents: [count]

[1/N] ExploreAgent - JWT validation flow (Gap: Architecture)
[2/N] CitationAgent - Evidence for caching claim (Gap: Confidence)
[3/N] PatternAgent - Error handling pattern (Gap: Pattern clarity)

Running refinement agents in parallel... ⏳
```

**Wait for all agents to complete.**

**Checkpoint:** Save iteration state to `.claude/cache/iteration-checkpoints/[session-id]-iter-N.json`
```

---

## Step 5: Integrate New Findings

**Merge strategy:**

```markdown
## Finding Integration (Iteration N Results)

**New Findings from Iteration N:**
  - Agent X: [Y] new findings, [Z] citations
  - Agent Y: [A] new findings, [B] citations

**Integration Process:**

1. DEDUPLICATION
   Compare new findings with iterations 1 to N-1:

   IF new finding == existing finding:
     → Skip duplicate (already recorded)

   IF new finding ENHANCES existing finding:
     → Merge: Add new evidence/citations to existing
     → Increase confidence score

   IF new finding CONTRADICTS existing finding:
     → Flag for conflict resolution (Step 2, Gap Type 3)

2. CITATION CROSS-REFERENCING
   Link citations across iterations:

   Finding from Iter 1: "Uses repository pattern" [Citation 1]
   Finding from Iter N: "Repository pattern in UserRepository" [Citation 5]
   → Cross-reference: [1, 5]

3. CONFIDENCE UPDATE
   Recalculate confidence for findings with new evidence:

   Before (Iter 1): Confidence 0.65 (single agent, weak citation)
   After (Iter N): Confidence 0.85 (confirmed by second agent, strong citation)

4. COVERAGE UPDATE
   Recalculate coverage:

   Iter 1: 15 files analyzed
   Iter N: 7 additional files
   Total: 22 files
   Coverage: 22 / 25 estimated = 88% ✅

**Integrated Findings Database:**
Updated with:
  - New findings (deduplicated)
  - Enhanced existing findings
  - Updated confidence scores
  - Updated coverage metrics
  - New citations
  - Cross-references
```

---

## Step 6: Convergence Evaluation

**Convergence criteria from `.claude/config/iteration-rules.json`:**

```markdown
## Convergence Check (Iteration N)

REQUIRED CRITERIA:
  1. Coverage >= min_coverage_threshold (default: 0.70)
  2. Average confidence >= min_confidence_threshold (default: 0.80)
  3. Unresolved conflicts <= max_unresolved_conflicts (default: 2)
  4. All critical questions answered == true

CURRENT STATE:
  1. Coverage: [X]%
     Status: [✅ PASS / ❌ FAIL]

  2. Average confidence: [Y]
     Status: [✅ PASS / ❌ FAIL]
     (Calculation: Sum of all confidences / count of findings)

  3. Unresolved conflicts: [Z]
     Status: [✅ PASS / ❌ FAIL]
     (Count: Findings where agents still disagree after verification)

  4. Critical questions answered: [N/M]
     Status: [✅ PASS / ❌ FAIL]
     (Questions from original prompt marked as "critical")

ITERATION COUNT:
  Current: [N]
  Max allowed: [max_iterations] (default: 4)

DECISION TREE:

IF all 4 criteria PASS:
  ✅ CONVERGED
  → Exit iteration loop
  → Proceed to result aggregation
  → Mark as "FULL CONVERGENCE"

ELSE IF N < max_iterations:
  🔄 CONTINUE ITERATING
  → Increment N
  → Return to Step 2 (Gap Analysis)
  → Spawn new refinement agents

ELSE IF N >= max_iterations:
  ⚠️ MAX ITERATIONS REACHED
  → Exit iteration loop
  → Proceed to result aggregation
  → Mark as "PARTIAL CONVERGENCE"
  → List unmet criteria and gaps in final report
```

**Convergence Display:**

```
📊 Convergence Status (Iteration [N])

Criteria Assessment:
  Coverage:            [X]% ✅ (threshold: 70%)
  Confidence:          [Y]% ❌ (threshold: 80%) - BELOW
  Unresolved Conflicts: [Z]  ✅ (max: 2)
  Critical Questions:  [N/M] ✅ (all answered)

Overall: NOT CONVERGED (1 criterion failing)
Action: Continue to Iteration [N+1]
```

---

## Step 7: Checkpoint Management

**Save State:**

```markdown
## Iteration Checkpoint

**File:** `.claude/cache/iteration-checkpoints/[session-id]-iter-[N].json`

**Contents:**
```json
{
  "session_id": "research-abc123",
  "iteration": 2,
  "timestamp": "2025-12-28T14:30:00Z",
  "findings": [
    {
      "id": "finding-001",
      "description": "Uses JWT for authentication",
      "confidence": 0.90,
      "citations": ["AuthController.cs:42", "LoginService.cs:15"],
      "source_agents": ["ExploreAgent", "SecurityAgent"],
      "iteration_discovered": 1
    }
  ],
  "coverage": 0.75,
  "files_analyzed": ["AuthController.cs", "LoginService.cs", "User.cs"],
  "unresolved_conflicts": 0,
  "convergence_status": "not_converged",
  "gaps_identified": [
    {
      "type": "confidence_gap",
      "finding_id": "finding-003",
      "reason": "Missing code evidence"
    }
  ]
}
```

**Restore on Failure:**
```
IF lead agent crashes or timeout:
  1. Read latest checkpoint file
  2. Restore findings database
  3. Restore iteration count
  4. Resume from next step (avoid re-running completed work)
```

---

## Early Termination Optimization

**High Confidence Early Exit:**

```markdown
## Early Termination Check

IF coverage >= 0.85 AND average_confidence >= 0.90:
  → Exceptionally high quality
  → Terminate iteration loop early
  → User notification:

  ```
  ✨ High Confidence Reached (Iteration [N])

  Coverage: [X]% (well above 70% threshold)
  Confidence: [Y]% (well above 80% threshold)

  Research quality is exceptionally high. Concluding early to save time.

  (Skipped [M-N] potential iterations)
  ```

  → Proceed to result aggregation
```

---

## Gap Prioritization

**When multiple gaps detected:**

```markdown
## Gap Priority Ranking

PRIORITY 1 (Critical - Always Address):
  - Critical questions unanswered
  - Security gaps (potential vulnerabilities)
  - Coverage below 50% (major gap)

PRIORITY 2 (Important - Address if iterations remain):
  - Confidence below 70% on critical findings
  - Conflicting findings
  - Missing architectural context

PRIORITY 3 (Nice-to-Have - Address if time permits):
  - Confidence 70-79% on informational findings
  - Pattern clarifications
  - Edge case exploration

SELECTION LOGIC:
  IF iterations_remaining >= 2:
    → Address Priority 1 + Priority 2

  IF iterations_remaining == 1:
    → Address Priority 1 only (focus on critical)

  IF agents_available < gaps_count:
    → Rank within priority level by user prompt relevance
```

---

## Performance Tracking

**Metrics Collected:**

```markdown
## Iteration Metrics

Per Iteration:
  - Agents spawned: [count]
  - Files analyzed (new): [count]
  - Findings discovered (new): [count]
  - Citations added: [count]
  - Duration: [seconds]
  - Coverage gain: [percentage point increase]
  - Confidence gain: [score increase]

Cumulative (All Iterations):
  - Total iterations: [N]
  - Total agents: [sum across iterations]
  - Total files: [unique files analyzed]
  - Total findings: [deduplicated count]
  - Total duration: [sum of iteration times]
  - Convergence rate: [converged / total_research_sessions]

**Use for:**
  - Performance optimization
  - Strategy refinement
  - Complexity estimation improvement
```

---

## Error Handling

**Agent Failure Mid-Iteration:**
```
IF refinement agent fails or times out:
  - Log error
  - Mark gap as "unresolved - agent failure"
  - Continue with other agents
  - Do NOT halt iteration
  - Flag in convergence check (may prevent convergence)
```

**Checkpoint Save Failure:**
```
IF checkpoint save fails:
  - Log warning
  - Continue iteration (non-critical)
  - Risk: Cannot restore on crash
```

**Invalid Gap Detection:**
```
IF gap analysis produces no actionable gaps but convergence not reached:
  - Log anomaly
  - Force refinement with broad ExploreAgent
  - OR terminate with partial convergence
```

---

## Testing & Validation

**Test Scenarios:**

```
Test 1: Single iteration to convergence
  - Initial findings meet all criteria
  - Expected: 1 iteration, converged status

Test 2: Two iterations, coverage gap
  - Iteration 1: 60% coverage
  - Iteration 2: Additional files, 75% coverage
  - Expected: 2 iterations, converged

Test 3: Max iterations without convergence
  - Each iteration makes progress but not enough
  - Expected: 4 iterations, partial convergence, gaps listed

Test 4: Conflicting findings resolution
  - Iteration 1: 2 agents disagree
  - Iteration 2: Verification agent resolves
  - Expected: 2 iterations, conflict resolved, converged

Test 5: Early termination
  - Iteration 2 reaches 90% confidence
  - Expected: 2 iterations (not 4), early exit notification
```

---

## Integration with Lead Agent

**Called by Lead Agent at:**
- After Step 3 (Evaluate Initial Findings)
- Decision point: Continue iteration OR conclude

**Returns to Lead Agent:**
- Iteration decision: CONTINUE or EXIT
- If CONTINUE: List of refinement agents to spawn
- If EXIT: Convergence status (FULL or PARTIAL)
- Updated findings database

**Control Flow:**
```
Lead Agent Step 3 → Iteration Engine (Gap Analysis)
                  ↓
                  Decision: Continue OR Exit
                  ↓
                  IF Continue:
                    → Lead Agent Step 4 (Spawn refinement agents)
                    → Lead Agent Step 3 (Re-evaluate with new findings)
                    → Iteration Engine (repeat)

                  IF Exit:
                    → Lead Agent Step 5 (Aggregation)
```

---

## Version History

**v1.0.0 (Phase 1 - Foundation):**
- Multi-step refinement loop (max 4 iterations)
- 5 gap type detection (coverage, confidence, conflict, context, questions)
- Adaptive agent selection based on gaps
- Convergence criteria evaluation
- Checkpoint save/restore
- Early termination optimization
- Integration with lead agent core

**Future Enhancements:**
- Machine learning for gap detection
- Predictive agent effectiveness
- Dynamic threshold adjustment
- Cross-research pattern learning

---

## Related Components

**Invoked by:**
- `.claude/library/orchestration/lead-agent-core.md` - Lead Agent

**Reads from:**
- `.claude/config/iteration-rules.json` - Convergence and gap rules
- `.claude/config/orchestration-config.json` - Iteration limits
- `.claude/config/agent-roles.json` - Agent capabilities

**Writes to:**
- `.claude/cache/iteration-checkpoints/` - Iteration state

**Integrates with:**
- Worker agents (spawns refinement agents)
- Citation system (cross-referencing)
- Coverage tracking
- Confidence scoring

---

**Iteration Engine - Multi-Step Refinement with Adaptive Strategy**
