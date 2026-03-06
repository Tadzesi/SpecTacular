# Hybrid Intelligence Adapter

**Version:** 1.0
**Last Updated:** 2024-12-20
**Purpose:** Advanced features for hybrid intelligence - complexity detection, agent spawning, caching, multi-agent verification, and learning

---

## Overview

This adapter extends the canonical Phase 0 flow with hybrid intelligence capabilities:
- Automatic complexity detection
- Intelligent agent spawning
- Agent result caching
- Multi-agent verification
- Learning system with pattern tracking

Commands using this adapter gain enterprise-grade prompt perfection with autonomous codebase analysis.

---

## When to Use This Adapter

Use the Hybrid Intelligence Adapter when your command needs:
- **Complexity-aware processing** - Different paths for simple vs. complex prompts
- **Codebase exploration** - Automatic agent spawning for context gathering
- **Performance optimization** - Caching of agent results
- **Critical operation validation** - Multi-agent verification for high-stakes tasks
- **Continuous improvement** - Learning from user patterns

**Best for:**
- Technical implementation commands
- Architecture analysis commands
- Code generation with pattern matching
- Security-critical operations

---

## How to Use This Adapter

### In Your Slash Command

Add this reference after importing the core library:

```markdown
## Phase 0: Prompt Perfection with Hybrid Intelligence

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Hybrid Intelligence (from `.claude/library/adapters/hybrid-adapter.md`)

**Enhanced Flow:**
1. Run standard Phase 0 Step 0.1 (Initial Analysis)
2. Add Complexity Detection (from this adapter)
3. Choose path: Simple (inline) or Complex (agent-assisted)
4. Continue with standard Phase 0 Steps 0.2-0.6 (enhanced with agent context if complex)
```

---

## Hybrid Intelligence Enhancements

### Enhancement 1: Complexity Detection

**When:** After Phase 0 Step 0.1 (Initial Analysis)

**Purpose:** Determine if agent assistance is needed

**Configuration:** `.claude/config/complexity-rules.json`

**Process:**

1. **Read complexity rules** from configuration file

2. **Analyze prompt** for complexity triggers:
   ```markdown
   **Common Triggers:**
   - Multi-file scope (weight: 5)
   - Architecture questions (weight: 7)
   - Pattern detection (weight: 6)
   - Feasibility check (weight: 4)
   - Implementation planning (weight: 3)
   - Cross-cutting concerns (weight: 4)
   - Refactoring tasks (weight: 5)
   ```

3. **Calculate score:**
   - Sum weights of all matched triggers
   - Thresholds:
     - 0-4: Simple (inline validation)
     - 5-9: Moderate (ask user)
     - 10-14: Complex (spawn agent)
     - 15+: Very High (multi-agent verification)

4. **Output complexity analysis:**
   ```markdown
   **Complexity Analysis:**
   Detected Language: [language]
   Prompt Type: [type]

   Matched Triggers:
   - [trigger 1] (weight: X)
   - [trigger 2] (weight: Y)

   Complexity Score: [total]
   Category: [Simple / Moderate / Complex / Very High]
   ```

5. **Decision:**
   - IF score < 5 → Continue with standard Phase 0 (Simple Path)
   - IF score 5-9 → Ask user if agent assistance wanted
   - IF score >= 10 → Proceed to Enhancement 2 (Agent Context Gathering)
   - IF score >= 15 → Proceed to Enhancement 3 (Multi-Agent Verification)

---

### Enhancement 2: Agent Context Gathering

**When:** Complexity score >= 10 (or user requests for moderate complexity)

**Purpose:** Gather codebase context automatically

**Configuration:** `.claude/config/agent-templates.json`, `.claude/config/cache-config.json`

**Process:**

#### Step 2.1: Check Agent Result Cache ⚡

**Configuration:** `.claude/config/cache-config.json`

1. **IF caching is enabled:**
   - Generate cache key from: prompt + file hashes + git branch + agent template
   - Check cache directory: `.claude/cache/agent-results/`
   - Validate cached result: timestamp, file changes, branch, template match

2. **IF valid cache found:**
   ```markdown
   ⚡ **Cache Hit - Using Previous Analysis**

   Cached from: [timestamp] ([X] hours ago)
   Agent type: [Explore / Plan]
   Files analyzed: [count]
   Branch: [branch name]

   Loading cached results... ✅
   ```
   - Use cached results
   - Skip to Step 2.3 (Process Results)

3. **IF no cache or invalid:**
   ```markdown
   💾 **No valid cache found - Running fresh analysis**

   Reason: [Cache miss / Expired / Files changed / Branch changed]
   ```
   - Continue to Step 2.2 (Spawn Agent)

---

#### Step 2.2: Spawn Exploration Agent

**Configuration:** `.claude/config/agent-templates.json`

1. **Determine agent type** based on complexity triggers:
   - Architecture questions, multi-file scope → **Explore** with "explore_codebase_context"
   - Pattern detection → **Explore** with "detect_patterns_and_conventions"
   - Feasibility check → **Explore** with "validate_technical_feasibility"
   - Implementation planning → **Plan** with "plan_implementation"

2. **Inform user:**
   ```markdown
   🤖 **Spawning agent for codebase analysis...**

   Complexity score: [score]
   Agent type: [Explore / Plan]
   Task: [brief description]

   This will take 10-30 seconds. Analyzing codebase to gather context...
   ```

3. **Build agent prompt** from template:
   - Replace `{user_prompt}` with original input
   - Replace `{keywords}` with extracted keywords
   - Replace `{scope}` with detected scope
   - Replace `{context}` with available context

4. **Spawn agent:**
   ```
   Task(
     subagent_type="Explore" or "Plan",
     description="Gather codebase context for prompt",
     prompt=[built agent prompt],
     model="haiku" for Explore, "sonnet" for Plan
   )
   ```

5. **Wait for agent to complete**

---

#### Step 2.3: Process Agent Results

1. **Display agent findings:**
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

2. **Save to cache** (if enabled):
   ```markdown
   💾 Saving agent results to cache for future use...
   Cache key: [generated key]
   Expiry: [timestamp + 24h]
   ```

3. **Enhance Phase 0 Steps 0.2-0.6** with agent context:
   - Step 0.2: Use agent findings for completeness check
   - Step 0.3: Ask clarification questions with agent insights
   - Step 0.5: Include agent context in perfected prompt output

---

### Enhancement 3: Multi-Agent Verification 🔍

**When:** Complexity score >= 15 OR critical keywords detected OR user requests

**Purpose:** Cross-validate findings with multiple agents for critical operations

**Configuration:** `.claude/config/verification-config.json`

**Process:**

1. **Check if verification is triggered:**
   - Complexity score >= 15 (Very High)
   - Critical keywords: "authentication", "authorization", "security", "payment", "migration"
   - Feasibility uncertainty detected
   - User explicitly requests verification

2. **Inform user:**
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

3. **Spawn multiple agents concurrently** with different strategies (configured in verification-config.json)

4. **Wait for all agents to complete**

5. **Analyze consensus:**
   ```markdown
   ✅ **Multi-Agent Verification Complete**

   ### Consensus Analysis:

   **Agreement Level:** [High (>80%) / Medium (66-80%) / Low (<66%)]

   **Unanimous Findings:**
   - [Finding all agents agreed on]
   - [Finding all agents agreed on]

   **Majority Findings (2/3 agents):**
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
   ```

6. **Ask user if needed:**
   ```markdown
   **Multiple perspectives detected. Which approach do you prefer?**
   - Option 1: [Majority recommendation]
   - Option 2: [Alternative approach]
   - Explain: Show detailed reasoning from each agent
   ```

7. **Use aggregated findings** for Phase 0 completion

---

### Enhancement 4: Learning System Integration 📚

**When:** After user approves the perfected prompt

**Purpose:** Track patterns and improve over time

**Configuration:** `.claude/config/learning-config.json`

**Storage:** `.claude/memory/prompt-patterns.md`

**Process:**

1. **Record transformation:**
   ```markdown
   📚 **Recording prompt pattern for learning...**

   Tracking:
   - ✅ Original → Perfected transformation
   - ✅ Complexity score accuracy
   - ✅ Agent effectiveness (if used)
   - ✅ User modifications (if any)
   - ✅ Missing information patterns
   ```

2. **Append to learning database:**
   ```markdown
   ### [Date] - [Prompt Type] - Complexity: [score]

   **Original Prompt:** [user input]
   **Complexity Score:** [score] ([category])
   **Triggered Rules:** [list]
   **Agent Used:** [Yes/No - type]
   **Cache Hit:** [Yes/No]
   **Multi-Agent Verification:** [Yes/No]

   **Missing Information Detected:**
   - [item 1]
   - [item 2]

   **Questions Asked:**
   1. [question 1]
   2. [question 2]

   **Perfected Prompt:** [final version]
   **User Modifications:** [None / List]
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

3. **Check for pattern thresholds** (default: 3 occurrences):
   - IF pattern occurs 3+ times → Suggest smart default
   - IF complexity score incorrect → Suggest weight adjustment

4. **Update statistics:**
   - Total prompts processed
   - Agent-assisted percentage
   - Cache hit rate
   - Average complexity score
   - User approval rate

---

## Additional Criteria for Completeness Check

When using this adapter, add these criteria to Phase 0 Step 0.2:

**Hybrid Intelligence Criteria:**
- [ ] **Complexity Score:** Calculated and displayed
- [ ] **Agent Strategy:** Determined (if complex)
- [ ] **Cache Status:** Checked (if applicable)
- [ ] **Verification Need:** Assessed (if critical)
- [ ] **Learning Enabled:** Configured (if applicable)

**Enhanced Context (from agent):**
- [ ] **Tech Stack:** Auto-detected from codebase
- [ ] **Patterns:** Identified by agent
- [ ] **Feasibility:** Validated by agent
- [ ] **Similar Implementations:** Found by agent
- [ ] **Blockers:** Detected by agent

---

## Configuration Files Required

Commands using this adapter need:

1. **`.claude/config/complexity-rules.json`** - Complexity detection
   ```json
   {
     "rules": [
       {
         "id": "multi_file_scope",
         "name": "Multi-file Scope",
         "triggers": ["multiple files", "across files", "in all"],
         "weight": 5,
         "agent": "Explore"
       }
     ],
     "thresholds": {
       "simple": {"max": 4},
       "moderate": {"min": 5, "max": 9},
       "complex": {"min": 10},
       "very_high": {"min": 15}
     }
   }
   ```

2. **`.claude/config/agent-templates.json`** - Agent prompts
   ```json
   {
     "templates": {
       "explore_codebase_context": {
         "agent": "Explore",
         "model": "haiku",
         "prompt_template": "Explore the codebase for: {user_prompt}..."
       }
     }
   }
   ```

3. **`.claude/config/cache-config.json`** - Agent caching (optional)
   ```json
   {
     "enabled": true,
     "max_cache_age_hours": 24,
     "max_cache_size_mb": 50,
     "cache_directory": ".claude/cache/agent-results/"
   }
   ```

4. **`.claude/config/verification-config.json`** - Multi-agent (optional)
   ```json
   {
     "enabled": true,
     "verification_triggers": {
       "complexity_threshold": 15,
       "critical_keywords": ["authentication", "security", "payment"]
     },
     "strategies": [
       {
         "name": "Breadth-First Exploration",
         "agent": "Explore",
         "model": "haiku",
         "timeout": 30
       }
     ]
   }
   ```

5. **`.claude/config/learning-config.json`** - Learning system (optional)
   ```json
   {
     "enabled": true,
     "learning_threshold": 3,
     "auto_suggest_improvements": true,
     "track_approval_rate": true
   }
   ```

---

## Memory/Storage

Commands using this adapter may use:
- `.claude/memory/prompt-patterns.md` - Learning database
- `.claude/cache/agent-results/` - Agent result cache

---

## Performance Notes

**Timing:**
- Simple path (no agent): < 2 seconds
- Complex path (first time): 10-30 seconds
- Complex path (cached): ~2 seconds (10-20x faster)
- Multi-agent verification: 30-50 seconds (parallel execution)
- Learning system: < 1 second

**Optimization:**
- Cache reduces repeated analysis by 90%+
- Parallel agent execution (not sequential)
- Compressed cache storage
- Early cache validation

---

## Benefits of Hybrid Intelligence

**For Simple Prompts:**
- Fast inline validation (~2s)
- No unnecessary overhead
- Clean, focused experience

**For Complex Prompts:**
- Automatic codebase exploration
- Pattern and convention detection
- Technical feasibility validation
- Cached results for speed

**For Critical Operations:**
- Multi-agent cross-validation
- Higher confidence in recommendations
- Identifies edge cases
- Multiple perspectives

**Continuous Improvement:**
- Learns from every interaction
- Suggests smart defaults
- Improves complexity scoring
- Tracks user preferences

---

## Integration Examples

### Example 1: Technical Command with Hybrid Intelligence

```markdown
# /my-technical-command

## Phase 0: Prompt Perfection with Hybrid Intelligence

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Hybrid Intelligence (from `.claude/library/adapters/hybrid-adapter.md`)

**Enhanced Flow:**
1. Initial Analysis + Complexity Detection
2. IF complex → Agent Context Gathering (with cache check)
3. IF very high → Multi-Agent Verification
4. Standard Phase 0 Steps 0.2-0.6 (enhanced with agent findings)
5. Learning System Integration (track patterns)

## Phase 1: Technical Analysis

[Command-specific logic using agent context if available]
```

---

### Example 2: Simple Command with Optional Hybrid Features

```markdown
# /my-simple-command

## Phase 0: Prompt Perfection

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Hybrid Intelligence (optional complexity detection only)

**Process:**
- Run standard Phase 0
- Add complexity detection (no auto-spawn, just inform user)
- User can manually request agent assistance with `--agent` flag

## Phase 1: Execution

[Command-specific logic]
```

---

## Version History

**v1.0 (2024-12-20):**
- Initial release
- Complexity detection engine
- Agent context gathering with caching
- Multi-agent verification
- Learning system integration
- Configuration-driven behavior

---

## Related Files

- **Core Library:** `.claude/library/prompt-perfection-core.md`
- **Hybrid Adapter:** `.claude/library/adapters/hybrid-adapter.md` (this file)
- **Technical Adapter:** `.claude/library/adapters/technical-adapter.md`
- **Complexity Rules:** `.claude/config/complexity-rules.json`
- **Agent Templates:** `.claude/config/agent-templates.json`
- **Cache Config:** `.claude/config/cache-config.json`
- **Verification Config:** `.claude/config/verification-config.json`
- **Learning Config:** `.claude/config/learning-config.json`

---

**This adapter brings enterprise-grade intelligence to prompt perfection.**
