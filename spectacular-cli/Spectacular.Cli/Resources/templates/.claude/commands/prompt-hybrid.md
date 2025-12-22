# /prompt-hybrid - Intelligent Prompt Perfection with Agent Assistance

Transform any prompt into an unambiguous, executable format using intelligent complexity detection and autonomous agent assistance.

---

## Overview

This command analyzes your prompt, detects complexity, and automatically spawns agents when needed to gather codebase context. It ensures zero-guessing execution through dual-layer validation.

**Core Features:**
- ✅ Automatic complexity detection
- ✅ Intelligent agent spawning for complex analysis
- ✅ Dual-layer validation (structural + semantic)
- ✅ Context-aware clarification
- ✅ Preserves main conversation context

**Advanced Features:** ⚡ **NEW**
- ✅ Agent result caching (avoid re-analysis, ~10-20x faster for repeated prompts)
- ✅ Multi-agent verification (cross-validate critical operations with 2-3 agents)
- ✅ Learning system (track patterns, suggest smart defaults, improve over time)
- ✅ Cache hit indicators (see when cached results are used)
- ✅ Consensus analysis (aggregate findings from multiple agents)
- ✅ Pattern tracking (learn from successful transformations)

---

## Execution Flow

### Phase 0: Initial Analysis

**Step 1: Analyze the prompt**

Examine the user's input:
> $ARGUMENTS

**Detect:**
1. **Language:** Slovak / English
2. **Type:** Question | Task | Bug Fix | Explanation | Code Review | Implementation | Refactoring | Other
3. **Core Intent:** What does the user ultimately want to achieve?

---

### Phase 1: Complexity Detection

**Analyze the prompt for complexity signals using these rules:**

Read configuration from: `.spectacular/prompts/complexity-rules.json`

**Complexity Triggers (with weights):**
- Multi-file scope (5): "multiple files", "across files", "in all", "entire codebase"
- Architecture questions (7): "how does", "where is", "what handles", "explain the"
- Pattern detection (6): "existing pattern", "current convention", "like other", "similar to"
- Feasibility check (4): "is it possible", "can we", "will this work", "compatible with"
- Implementation planning (3): "implement", "build", "create feature", "add functionality"
- Cross-cutting concerns (4): "authentication", "logging", "error handling", "caching"
- Refactoring tasks (5): "refactor", "restructure", "reorganize", "clean up"

**Calculate complexity score:**
- Sum the weight of all matched triggers
- Thresholds:
  - 0-4: **Simple** (inline validation)
  - 5-9: **Moderate** (suggest agent)
  - 10+: **Complex** (spawn agent)

**Output complexity analysis:**
```markdown
**Complexity Analysis:**
Detected Language: [Slovak / English]
Prompt Type: [type]
Core Intent: [intent]

Matched Triggers:
- [trigger 1] (weight: X)
- [trigger 2] (weight: Y)

Complexity Score: [total]
Category: [Simple / Moderate / Complex]
```

**Decision Point:**
- IF score < 5 → **Go to Simple Path**
- IF score 5-9 → **Ask user:** "This prompt has moderate complexity. Would you like me to use an agent to analyze the codebase for better context? (yes/no)"
  - If yes → **Go to Complex Path**
  - If no → **Go to Simple Path**
- IF score >= 10 → **Go to Complex Path**

---

## Simple Path: Inline Validation

**Step 2.1: Completeness Check**

Verify the prompt contains:
- [ ] **Goal:** Clear desired outcome
- [ ] **Context:** Project, technology, environment
- [ ] **Scope:** Which files, components, areas
- [ ] **Constraints:** Performance, security, compatibility (optional)
- [ ] **Success Criteria:** How to verify it's done

**For each missing item, mark it and prepare questions.**

---

**Step 2.2: Clarification Questions**

IF anything is missing or unclear:

**Ask questions in priority order:**

```markdown
**Missing Information:**

🚨 Critical (must have):
1. [Question about essential missing info]

⚠️ Important (should have):
2. [Question about helpful context]

💡 Optional (nice to have):
3. [Question about optimizations]
```

**IF multiple valid approaches exist:**
```markdown
**Multiple Approaches Detected:**

**Option 1:** [Name]
- Pro: [advantage]
- Con: [disadvantage]

**Option 2:** [Name]
- Pro: [advantage]
- Con: [disadvantage]

⭐ **Recommended:** Option [X]
**Reasoning:** [why this is best]

*Select an option (1/2) or describe your preference*
```

**Wait for user answers before proceeding.**

---

**Step 2.3: Correction & Structuring**

Once all information is gathered:

1. **Correct:** Fix grammar, spelling, sentence structure
2. **Preserve:** Keep all technical terms, code references, variable names EXACTLY
3. **Clarify:** Make it clear, specific, and actionable

**Output the perfected prompt:**

```markdown
**Perfected Prompt:**

**Goal:** [one clear sentence stating desired outcome]

**Context:**
- Environment: [OS, platform]
- Tech Stack: [languages, frameworks]
- Background: [relevant project context]

**Scope:**
- Files to modify: [list]
- Files to create: [list]
- Components affected: [list]

**Requirements:**
1. [First specific requirement]
2. [Second specific requirement]
3. [Third specific requirement]
...

**Constraints:**
- [Constraint 1]
- [Constraint 2]
Or: None

**Expected Result:**
[Clear description of what success looks like]

**Changes Made:**
- [Correction 1]
- [Correction 2]
- [Improvement 1]
...
```

**→ Jump to Approval Gate**

---

## Complex Path: Agent-Assisted Analysis

**Step 3.1: Prepare Agent Task**

Read agent template configuration from: `.spectacular/prompts/agent-templates.json`

**Determine agent type based on complexity triggers:**
- Architecture questions, multi-file scope, cross-cutting → **Explore agent** with "explore_codebase_context" template
- Pattern detection needed → **Explore agent** with "detect_patterns_and_conventions" template
- Feasibility check → **Explore agent** with "validate_technical_feasibility" template
- Implementation planning, refactoring → **Plan agent** with "plan_implementation" template

**Extract keywords from user prompt** for agent context.

**Build agent prompt** from template, replacing:
- `{user_prompt}` with original user input
- `{keywords}` with extracted keywords
- `{scope}` with detected scope
- `{context}` with available context

---

**Step 3.1.5: Check Agent Result Cache** ⚡ **NEW**

Read cache configuration from: `.spectacular/prompts/cache-config.json`

**IF caching is enabled:**

1. **Generate cache key** from:
   - User prompt (normalized)
   - Current git branch
   - File hashes of relevant extensions (.cs, .js, .tsx, .json, etc.)
   - Agent template to be used

2. **Check cache directory:** `.claude/cache/agent-results/`

3. **Validate cached result:**
   - Check timestamp (max age: 24 hours default)
   - Verify files haven't changed (compare hashes)
   - Confirm same git branch
   - Ensure same agent template

**IF valid cache found:**
```markdown
⚡ **Cache Hit - Using Previous Analysis**

Cached from: [timestamp] ([X] hours ago)
Agent type: [Explore / Plan]
Files analyzed: [count]
Branch: [branch name]

Loading cached results... ✅
```

**Use cached agent results** and **skip to Step 3.3** (Process Agent Results)

**IF no cache or invalid:**
```markdown
💾 **No valid cache found - Running fresh analysis**

Reason: [Cache miss / Expired / Files changed / Branch changed]
```

**Continue to Step 3.2** (Spawn Agent)

**Note:** Cache results will be saved after agent completes for future use.

---

**Step 3.2: Spawn Agent**

**Inform user:**
```markdown
🤖 **Spawning agent for codebase analysis...**

Complexity score: [score]
Agent type: [Explore / Plan]
Task: [brief description]

This will take 10-30 seconds. Analyzing codebase to gather context...
```

**Use the Task tool to spawn the agent:**
```
Task(
  subagent_type="Explore" or "Plan",
  description="Gather codebase context for prompt",
  prompt=[built agent prompt from template],
  model="haiku" for Explore, "sonnet" for Plan
)
```

**Wait for agent to complete.**

---

**Step 3.3: Process Agent Results**

**Agent returns structured context. Display summary:**

```markdown
✅ **Agent Analysis Complete**

### Key Findings:
- Relevant Files: [list from agent]
- Patterns Detected: [patterns from agent]
- Technical Feasibility: [feasibility from agent]
- Blockers: [blockers from agent or "None"]

### Agent Recommendations:
[recommendations from agent]
```

**Save to cache** (if caching enabled):
```
💾 Saving agent results to cache for future use...
Cache key: [generated key]
Expiry: [timestamp + 24h]
```

---

**Step 3.3.5: Multi-Agent Verification** 🔍 **NEW** *(Optional)*

Read verification configuration from: `.spectacular/prompts/verification-config.json`

**IF verification is triggered:**

**Verification Triggers:**
- Complexity score >= 15 (Very High)
- Critical keywords detected: "authentication", "authorization", "security", "payment", "migration"
- Feasibility uncertainty detected
- User explicitly requests verification

**When triggered:**

```markdown
🔍 **Multi-Agent Verification Initiated**

Verification reason: [Complexity: 15+ / Critical operation detected / User requested]
Spawning [2-3] additional agents with different strategies...

**Verification Strategies:**
1. **Breadth-First Exploration** (Haiku, 30s) - Wide coverage
2. **Depth-First Analysis** (Sonnet, 45s) - Detailed investigation
3. **Pattern-Focused Verification** (Haiku, 30s) - Convention validation

Running agents in parallel... ⏳
```

**Spawn multiple agents concurrently** using different strategies (configured in verification-config.json).

**Wait for all agents to complete.**

**Analyze consensus:**

```markdown
✅ **Multi-Agent Verification Complete**

### Consensus Analysis:

**Agreement Level:** [High (>80%) / Medium (66-80%) / Low (<66%)]

**Unanimous Findings:**
- [Finding all agents agreed on]
- [Finding all agents agreed on]

**Majority Findings (2/3 agents):**
- [Finding most agents found]
- [Finding most agents found]

**Disagreements:**
⚠️ Agent 1 found: [X]
⚠️ Agent 2 found: [Y]
⚠️ Agent 3 found: [Z]

**Confidence Assessment:**
- Pattern Detection: [High/Medium/Low]
- Feasibility: [High/Medium/Low]
- Recommended Approach: [High/Medium/Low]

### Aggregated Recommendations:

**Consensus Recommendation:**
[Combined recommendation from all agents where they agree]

**Alternative Perspectives:**
- Approach A (Agent 1, 2): [description]
- Approach B (Agent 3): [description]

**Conflicting Findings:**
[Explanation of any disagreements and suggested resolution]
```

**Ask user if needed:**
```markdown
**Multiple perspectives detected. Which approach do you prefer?**
- Option 1: [Majority recommendation]
- Option 2: [Alternative approach]
- Explain: Show detailed reasoning from each agent
```

**Continue with aggregated findings** (combining consensus + user choice).

---

**Step 3.4: Enhanced Completeness Check**

With agent context, verify prompt contains:

```markdown
**Enhanced Completeness Check (with agent insights):**

- [✅] Goal: [extracted from user]
- [✅] Context: Auto-detected from codebase
  - Tech Stack: [agent-found]
  - Framework: [agent-found]
  - Existing Patterns: [agent-found]
- [✅] Scope: Agent-identified files
  - To modify: [agent-found]
  - To create: [user + agent suggestions]
- [❌/✅] Constraints: [from user or missing]
- [❌/✅] Success Criteria: [from user or missing]
- [✅] Technical Feasibility: Agent-validated
```

**If still missing info, ask questions.**

---

**Step 3.5: Context-Aware Clarification**

**Ask questions with agent insights:**

```markdown
**Agent-Enhanced Clarification:**

🤖 **Agent Analysis:**
{summary of agent findings}

**Questions (based on agent analysis):**

🚨 Critical Issues:
[List any blockers or conflicts agent found]

⚠️ Clarifications Needed:
1. [Question with agent context]
2. [Question with agent context]

💡 Agent Recommendations:
{agent recommendations}

**Suggested Approach (from agent):**
{detailed approach from agent}

Do you want to:
- `follow` - Use agent's recommended approach
- `modify` - Use agent's findings but specify different approach
- `explain` - Get more details about agent's analysis
```

**Wait for user response.**

---

**Step 3.6: Structure Perfect Prompt (Enhanced)**

**Output the agent-enhanced perfected prompt:**

```markdown
**Perfected Prompt (Agent-Enhanced):**

**Goal:** [one clear sentence]

**Context:**
- Environment: [OS, platform]
- Tech Stack: [agent-detected]
- Framework: [agent-detected + version if available]
- Existing Patterns: [agent-found patterns]
- Architecture: [agent-analyzed architecture]
- Background: [user context + agent insights]

**Scope:**
- Files to modify:
  - [file1.ext] - [agent description]
  - [file2.ext] - [agent description]
- Files to create:
  - [file3.ext] - [following pattern from agent]
- Components affected: [agent-mapped components]

**Requirements:**
1. [User requirement 1]
2. [User requirement 2]
3. Follow pattern from: [example_file] (agent-identified)
4. Use existing utility: [utility_name] from [file] (agent-found)
5. [Additional requirements]
...

**Constraints:**
- [User constraints]
- Compatibility: [agent-validated compatibility info]
- Dependencies: [agent-checked dependencies]
- [Other constraints]

**Expected Result:**
[What success looks like - user + agent validation criteria]

**Technical Validation (by Agent):**
- ✅ Feasibility: [agent assessment]
- ✅ Compatible with codebase: [details]
- ✅ Pattern alignment: [details]
- ✅ Dependencies: [all present / list missing]
- ⚠️ Blockers: [list or "None"]

**Agent Recommendations:**
[Key recommendations from agent]

**Changes Made:**
- [Grammar/spelling corrections]
- Context auto-detected from codebase analysis
- Technical feasibility validated by agent
- Patterns and conventions identified
- Similar implementations found and referenced
```

**→ Jump to Approval Gate**

---

## Approval Gate

**Both paths converge here.**

**Present the perfected prompt and wait for user approval:**

```markdown
---

⏸️ **Perfected Prompt Ready - Awaiting Your Approval**

**Summary:**
- Goal: [goal summary]
- Scope: [scope summary]
- Complexity: [Simple / Moderate / Complex]
- Agent Used: [Yes - Explore/Plan / No]
- Confidence: [High / Medium - based on completeness]

**Reply with:**
- `y` or `yes` — Execute this perfected prompt
- `n` or `no` — Cancel
- `modify [changes]` — Adjust the prompt (specify what to change)
- `explain` — Explain complexity score or agent findings (if agent was used)
- `retry` — Re-run analysis with different agent strategy
```

**Wait for user response.**

**Handle responses:**
- `yes` or `y` → **Proceed to execution** (return perfected prompt for user to use)
- `no` or `n` → **Cancel** (inform user: "Prompt perfection cancelled.")
- `modify [changes]` → **Apply changes** and re-display for approval
- `explain` → **Show detailed explanation** of analysis, then re-prompt for approval
- `retry` → **Re-run** Phase 1 with manual complexity selection

---

## Execution

**When user approves:**

```markdown
✅ **Prompt Perfected and Approved**

**You can now use this perfected prompt for your task.**

**Perfected Prompt:**
[Repeat the perfected prompt for clarity]

**Next Steps:**
1. Use this prompt as your specification
2. If this was a question, I can answer it now with full context
3. If this was a task, I can begin implementation
4. If this was planning, I can create an implementation plan

**What would you like to do next?**
```

---

**Learning System Integration** 📚 **NEW**

Read learning configuration from: `.spectacular/prompts/learning-config.json`

**IF learning is enabled:**

**After user approves and uses the prompt, track the transformation:**

```markdown
📚 **Recording prompt pattern for learning...**

Tracking:
- ✅ Original → Perfected transformation
- ✅ Complexity score accuracy
- ✅ Agent effectiveness (if used)
- ✅ User modifications (if any)
- ✅ Missing information patterns
```

**Append to:** `.claude/memory/prompt-patterns.md`

**Record:**
```markdown
### [Date] - [Prompt Type] - Complexity: [score]

**Original Prompt:**
[User's input]

**Complexity Score:** [score] ([Simple/Moderate/Complex])
**Triggered Rules:** [list of matched triggers]
**Agent Used:** [Yes - Explore/Plan / No]
**Cache Hit:** [Yes / No]
**Multi-Agent Verification:** [Yes / No]

**Missing Information Detected:**
- [item 1]
- [item 2]

**Questions Asked:**
1. [question 1]
2. [question 2]

**Perfected Prompt:**
[Final version]

**User Modifications:** [None / List of changes]
**Approval Status:** [Approved / Modified / Rejected]

**Agent Findings (if applicable):**
- Relevant Files: [count]
- Patterns Found: [summary]
- Feasibility: [assessment]
- Cache Performance: [hit/miss, time saved]

**Learning Insights:**
- Pattern: [detected pattern for future]
- Smart Default Opportunity: [suggestion]
- Complexity Score Accuracy: [correct/overscored/underscored]
- User Preference: [detected preference]

---
```

**Check for pattern thresholds** (default: 3 occurrences):

**IF pattern occurs 3+ times:**
```markdown
💡 **Learning Insight Detected**

Pattern: [description]
Occurrences: [count]

**Suggested Smart Default:**
When prompt contains "[keyword]", auto-suggest:
- [smart default 1]
- [smart default 2]

Would you like to apply this smart default in future prompts? (yes/no)
```

**IF complexity score was incorrect:**
```markdown
📊 **Complexity Score Feedback**

This prompt was scored as [category] but should have been [actual category].

**Suggested weight adjustments:**
- [trigger]: [current weight] → [suggested weight]

Feedback recorded for future calibration.
```

**Update statistics** in prompt-patterns.md:
- Total prompts processed
- Agent-assisted percentage
- Cache hit rate
- Average complexity score
- User approval rate

---

## Configuration Files

This command uses:
- `.spectacular/prompts/complexity-rules.json` - Complexity detection rules and thresholds
- `.spectacular/prompts/agent-templates.json` - Agent prompt templates
- `.spectacular/prompts/cache-config.json` - Agent result caching configuration ⚡ **NEW**
- `.spectacular/prompts/verification-config.json` - Multi-agent verification settings 🔍 **NEW**
- `.spectacular/prompts/learning-config.json` - Learning system configuration 📚 **NEW**

**Memory/Storage:**
- `.claude/memory/prompt-patterns.md` - Prompt pattern learning database 📚 **NEW**
- `.claude/cache/agent-results/` - Cached agent analysis results ⚡ **NEW**

**To customize:**
1. Edit `complexity-rules.json` to adjust triggers and weights
2. Edit `agent-templates.json` to customize agent behaviors
3. Adjust thresholds for simple/moderate/complex categories
4. Configure `cache-config.json` to control caching behavior (max age, size, strategy)
5. Configure `verification-config.json` to control when multi-agent verification triggers
6. Configure `learning-config.json` to enable/disable learning and adjust thresholds

---

## Examples

### Example 1: Simple Prompt

**Input:**
```
/prompt-hybrid Fix typo in README.md line 42
```

**Execution:**
- Complexity score: 0 (single file, clear scope)
- Path: Simple (inline)
- Questions: None (all info present)
- Output: Perfected prompt with corrections
- Time: ~2 seconds

---

### Example 2: Complex Prompt

**Input:**
```
/prompt-hybrid Add user authentication following existing patterns in the codebase
```

**Execution:**
- Complexity score: 13 (pattern detection=6 + implementation=3 + cross-cutting=4)
- Path: Complex (spawn agent)
- Agent: Explore with "detect_patterns_and_conventions"
- Agent finds: JWT pattern in src/auth/, AuthController.cs example
- Questions: Agent-enhanced (with pattern recommendations)
- Output: Agent-enhanced perfected prompt
- Time: ~20 seconds

---

### Example 3: Moderate Prompt

**Input:**
```
/prompt-hybrid Refactor the UserService for better performance
```

**Execution:**
- Complexity score: 8 (refactoring=5 + implementation=3)
- Path: Moderate (ask user)
- User choice: "yes" to agent
- Agent: Plan with "plan_implementation"
- Agent analyzes: Current UserService implementation, performance bottlenecks
- Output: Agent-enhanced with optimization strategy
- Time: ~25 seconds

---

### Example 4: Advanced Features in Action ⚡🔍📚 **NEW**

**Input (First Time):**
```
/prompt-hybrid Implement payment processing with security best practices
```

**Execution:**
- Complexity score: 17 (implementation=3 + cross-cutting=4 + critical keyword "payment"=10)
- Path: Complex + Multi-Agent Verification
- Verification triggered: Critical operation detected (payment)
- Spawning 3 agents:
  1. Breadth-First (Haiku, 30s) - Wide coverage
  2. Depth-First (Sonnet, 45s) - Detailed security analysis
  3. Pattern-Focused (Haiku, 30s) - Convention validation
- Consensus analysis: High agreement (85%)
- Unanimous findings: Use Stripe API, existing PaymentService pattern
- Disagreement: Agent 2 suggests additional fraud detection layer
- Learning: Pattern recorded for "payment" keyword
- Cache: Results saved for 24h
- Time: ~50 seconds (3 agents in parallel)

**Input (Same Prompt, 2 Hours Later):**
```
/prompt-hybrid Implement payment processing with security best practices
```

**Execution:**
- Cache hit! ⚡
- Cached from: 2 hours ago
- Files analyzed: 15 (no changes detected)
- Loading cached verification results...
- Consensus analysis: High agreement (85%) [from cache]
- Learning: Pattern count for "payment" = 2
- Time: ~2 seconds (cache hit, 25x faster!)

**Input (Third Time, Next Day):**
```
/prompt-hybrid Add payment for subscriptions
```

**Execution:**
- Complexity score: 14
- Cache miss: Different prompt
- Learning insight detected! 💡
- Pattern "payment" occurred 3+ times
- **Smart Default Suggested:**
  - Auto-include: Security scanning with OWASP guidelines
  - Auto-include: PCI DSS compliance checklist
  - Auto-include: Existing PaymentService pattern from src/services/
- User: Apply smart defaults (yes)
- Agent spawned with enhanced context
- Pattern applied automatically
- Results cached
- Learning: User preference recorded (apply payment defaults)
- Time: ~20 seconds

**Learning System Benefits:**
- First prompt: Thorough analysis (50s)
- Second prompt: Instant cache hit (2s)
- Third prompt: Smart defaults applied automatically
- Future prompts: Even faster with learned patterns

---

## Tips for Best Results

1. **Be as specific as possible** - Even if agent fills gaps, your initial context helps
2. **Trust the complexity detection** - Let the system decide when to use agents
3. **Review agent findings** - Agent insights are shown transparently
4. **Ask for explanations** - Use `explain` to understand the analysis
5. **Iterate freely** - Use `modify` to refine without starting over

**Advanced Tips:** ⚡ **NEW**
6. **Leverage caching** - Similar prompts use cached results (10-20x faster)
7. **Review verification results** - Multi-agent verification shows consensus and disagreements
8. **Accept smart defaults** - Learning system improves with usage
9. **Clear cache when needed** - Delete `.claude/cache/agent-results/` if codebase changes significantly
10. **Track your patterns** - Review `.claude/memory/prompt-patterns.md` to see learning progress

---

## Advanced Features Guide ⚡🔍📚 **NEW**

### Agent Result Caching ⚡

**How it works:**
- Agent analysis results are cached for 24 hours (configurable)
- Cache key includes: prompt + file hashes + git branch + agent template
- Cache invalidates when: files change, branch changes, time expires

**Benefits:**
- 10-20x faster for repeated/similar prompts
- Saves agent costs (no re-analysis)
- Consistent results for same context

**Cache hit example:**
```
⚡ Cache Hit - Using Previous Analysis
Cached from: 2024-12-18 14:30 (2 hours ago)
Agent type: Explore
Files analyzed: 23
Branch: main
Loading cached results... ✅
```

**To clear cache:**
- Delete `.claude/cache/agent-results/` directory
- Or wait for 24h auto-expiration
- Or edit cache config to reduce max age

---

### Multi-Agent Verification 🔍

**When it triggers:**
- Complexity score >= 15
- Critical keywords: authentication, authorization, security, payment, migration
- User explicitly requests: `/prompt-hybrid [prompt] --verify`

**How it works:**
- Spawns 2-3 agents with different strategies in parallel
- Agents analyze independently
- System aggregates findings and identifies consensus
- Shows unanimous findings, majority findings, and disagreements

**Consensus levels:**
- High (>80%): Strong agreement, proceed with confidence
- Medium (66-80%): Reasonable agreement, minor differences
- Low (<66%): Significant disagreements, user input needed

**Benefits:**
- Cross-validation reduces errors
- Multiple perspectives on complex tasks
- Higher confidence in critical operations
- Identifies edge cases one agent might miss

**Example output:**
```
✅ Multi-Agent Verification Complete

Agreement Level: High (85%)

Unanimous Findings:
- Use existing AuthService pattern
- JWT tokens with 24h expiration
- Hash passwords with BCrypt

Disagreements:
⚠️ Agent 1: Suggests OAuth integration
⚠️ Agent 2: Suggests 2FA requirement

User choice: [Select approach or explain differences]
```

---

### Learning System 📚

**What it learns:**
- Successful prompt transformations
- Common missing information patterns
- User modification preferences
- Complexity score accuracy
- Agent effectiveness metrics

**Smart Defaults:**
- After 3 occurrences of a pattern, suggests auto-applying context
- Example: "authentication" → auto-include security checklist
- Example: "React component" → auto-include component structure

**Pattern tracking:**
All patterns stored in `.claude/memory/prompt-patterns.md`

**Example learning insight:**
```
💡 Learning Insight Detected

Pattern: Prompts about "authentication" are missing security requirements
Occurrences: 3

Suggested Smart Default:
When prompt contains "authentication", auto-suggest:
- Security scanning checklist
- Password hashing method
- Token expiration strategy

Apply this smart default? (yes/no)
```

**Feedback loop:**
- Tracks approval rates
- Identifies overscored/underscored complexity
- Suggests weight adjustments
- Improves over time

**Statistics tracked:**
- Total prompts processed
- Agent-assisted percentage
- Cache hit rate
- Average complexity score
- User approval rate

**View your learning data:**
```
cat .claude/memory/prompt-patterns.md
```

---

## Tips for Best Results

1. **Be as specific as possible** - Even if agent fills gaps, your initial context helps
2. **Trust the complexity detection** - Let the system decide when to use agents
3. **Review agent findings** - Agent insights are shown transparently
4. **Ask for explanations** - Use `explain` to understand the analysis
5. **Iterate freely** - Use `modify` to refine without starting over

---

## Troubleshooting

**Basic Issues:**

**Agent taking too long?**
- Explore agents timeout at 30s, Plan agents at 60s
- Multi-agent verification timeouts at 45s per agent
- If timeout, falls back to simple path with warning

**Complexity score seems wrong?**
- Edit `.spectacular/prompts/complexity-rules.json` to adjust weights
- Provide feedback via learning system
- System will suggest weight adjustments after detecting patterns

**Agent not finding relevant code?**
- Provide more specific keywords in your prompt
- Use `retry` with manual agent selection
- Check cache - might be using outdated results

---

**Advanced Features Issues:** ⚡ **NEW**

**Cache not working?**
- Check `.spectacular/prompts/cache-config.json` - ensure `"enabled": true`
- Verify `.claude/cache/agent-results/` directory exists
- Check file permissions
- Cache invalidates if files changed or 24h expired

**Cache giving outdated results?**
- Clear cache: Delete `.claude/cache/agent-results/`
- Or reduce `max_cache_age_hours` in cache-config.json
- Cache automatically invalidates on file changes
- Cache includes git branch - switching branches creates new cache

**Multi-agent verification not triggering?**
- Check `.spectacular/prompts/verification-config.json` - ensure `"enabled": true`
- Verify complexity score >= 15 or critical keywords present
- Manually trigger: `/prompt-hybrid [prompt] --verify`
- Check `verification_triggers` configuration

**Agents disagree significantly?**
- This is normal for complex tasks
- Review all perspectives shown in consensus analysis
- Choose the approach that best fits your context
- Disagreement indicates legitimate trade-offs exist

**Learning system not tracking patterns?**
- Check `.spectacular/prompts/learning-config.json` - ensure `"enabled": true`
- Verify `.claude/memory/prompt-patterns.md` exists
- Patterns need 3+ occurrences to trigger smart defaults
- Check `learning_threshold` setting

**Smart defaults not appearing?**
- Need 3+ occurrences of pattern (configurable)
- Check `.claude/memory/prompt-patterns.md` for tracked patterns
- Verify `auto_suggest_improvements: true` in learning-config.json
- Pattern matching is case-insensitive

**Cache or learning files growing too large?**
- Cache auto-cleans based on `max_cache_size_mb` (default 50MB)
- Manually clear: Delete `.claude/cache/agent-results/`
- Learning file grows slowly, safe to periodically archive old entries
- Adjust `max_cache_age_hours` to expire cache sooner

**Performance slower than expected?**
- First run is always slower (no cache)
- Verify cache is enabled and working
- Check if multi-agent verification is triggering unnecessarily
- Adjust verification thresholds in config
- Use simpler prompts for quick iterations

---

## Performance Notes

**Basic Performance:**
- **Simple path:** < 2 seconds (inline validation only)
- **Complex path:** 10-30 seconds (agent exploration time)
- **Agent model:**
  - Explore: Haiku (fast, cost-effective)
  - Plan: Sonnet (thorough, higher quality)
- **Context preservation:** Main conversation preserved; agents run independently

**Advanced Features Performance:** ⚡ **NEW**
- **Cache hit:** ~2 seconds (10-20x faster than fresh analysis)
- **Cache miss:** Same as complex path (10-30s)
- **Multi-agent verification:** 30-50 seconds (2-3 agents in parallel)
- **Learning system:** < 1 second (pattern recording)
- **Cache overhead:** Minimal (~100ms for cache check)

**Performance Optimization:**
- Cache reduces repeated analysis costs by 90%+
- Parallel agent execution (not sequential)
- Compressed cache storage
- Early cache validation (before agent spawn)

---

## Integration

**Works standalone or with:**
- `/prompt-technical` - For technical deep-dive after perfection
- `/spectacular` workflow - Can integrate in future for spec → plan
- Other prompt commands - Complementary to existing commands

**Recommendation:**
- Use `/prompt` for quick, simple prompts
- Use `/prompt-hybrid` for complex tasks needing codebase analysis
- Use `/prompt-technical` after hybrid for implementation details

---

**Ready to perfect your prompt? Just type: `/prompt-hybrid [your prompt]`**
