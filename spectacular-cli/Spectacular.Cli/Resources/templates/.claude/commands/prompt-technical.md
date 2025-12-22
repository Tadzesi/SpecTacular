# /prompt-technical - Technical Implementation Analysis with Hybrid Intelligence

This command provides deep technical analysis for programming and development tasks. It uses **hybrid intelligence** - combining Phase 0 prompt perfection with automatic agent-powered codebase analysis for complex tasks.

---

## Phase 0: Prompt Perfection with Complexity Detection

**Before any technical analysis, first perfect the user's prompt and detect complexity.**

### Step 0.1: Initial Analysis

- Detect language (Slovak / English)
- Identify prompt type: [Question | Task | Bug Fix | Explanation | Code Review | Implementation | Other]
- Extract the core intent: What does the user ultimately want to achieve?
- **Analyze for technical complexity**

**Input:**
> $ARGUMENTS

---

### Step 0.2: Complexity Detection

**Analyze prompt for complexity signals:**

Read configuration from: `.spectacular/prompts/complexity-rules.json`

**Technical Complexity Triggers:**
- Multi-file scope (5): "multiple files", "across files", "entire codebase"
- Architecture questions (7): "how does", "where is", "what handles"
- Pattern detection (6): "existing pattern", "current convention", "match existing"
- Implementation planning (3): "implement", "build", "create feature"
- Cross-cutting concerns (4): "authentication", "logging", "error handling"
- Refactoring tasks (5): "refactor", "restructure", "improve structure"

**Calculate complexity score:**
- Score = Σ(weight for each matched trigger)
- Thresholds:
  - 0-4: **Simple** → Manual project scan
  - 5-9: **Moderate** → Ask user if agent assistance wanted
  - 10+: **Complex** → Automatic agent assistance

**Display complexity analysis:**
```markdown
**Complexity Analysis:**
Detected Language: [Slovak / English]
Prompt Type: [type]
Technical Complexity Score: [total]
Category: [Simple / Moderate / Complex]

Matched Triggers:
- [trigger 1] (weight: X)
- [trigger 2] (weight: Y)

Recommendation: [Use agent / Manual scan]
```

---

### Step 0.3: Completeness Check

Verify the prompt contains:
- [ ] **Goal:** Clear desired outcome
- [ ] **Context:** Project, technology, environment (will be auto-detected)
- [ ] **Scope:** Which files, components, areas
- [ ] **Constraints:** Performance, security, compatibility (optional)
- [ ] **Success Criteria:** How to verify it's done

**Mark missing items and prepare questions.**

---

### Step 0.4: Clarification (if needed)

IF anything is missing or unclear:

**Ask questions:**
```markdown
**Questions:**

🚨 Critical:
1. [Essential missing information]

⚠️ Important:
2. [Helpful context]

💡 Technical Details:
3. [Implementation specifics]
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
**Reasoning:** [why]
```

**Wait for user answers.**

---

### Step 0.5: Structure the Perfect Prompt

**Output the perfected prompt:**

```markdown
**Perfected Prompt:**

**Goal:** [one clear sentence]
**Context:** [environment, tech stack - will be auto-detected]
**Scope:** [specific files, components, areas]
**Requirements:**
1. [First specific requirement]
2. [Second specific requirement]
3. [...]
**Constraints:** [limitations, or "None"]
**Expected Result:** [what success looks like]

**Changes Made:**
- [Correction 1]
- [Correction 2]
- [Improvement 1]
```

---

**⏸️ Waiting for approval before technical analysis.**

Reply with:
- `y` or `yes` — proceed to technical analysis
- `n` or `no` — cancel
- Or type modifications for adjustments

---

## Phase 1: Intelligent Project Analysis

**Based on complexity score, choose analysis method:**

### Path A: Simple Complexity (Score 0-4) - Manual Scan

**Quickly scan for:**

1. **Project Structure Detection**
   - Look for configuration files:
     - `package.json` (Node.js/JavaScript/TypeScript)
     - `requirements.txt`, `pyproject.toml` (Python)
     - `*.csproj`, `*.sln` (C#/.NET)
     - `Cargo.toml` (Rust)
     - `go.mod` (Go)
     - `pom.xml`, `build.gradle` (Java)
     - `composer.json` (PHP)

2. **Tech Stack Identification**
   - Frameworks (React, Vue, Angular, Django, FastAPI, ASP.NET, etc.)
   - Build tools (Webpack, Vite, npm, etc.)
   - Testing frameworks (Jest, Pytest, JUnit, etc.)

3. **Quick Pattern Check**
   - File organization
   - Naming conventions
   - Common utilities

**Proceed to Phase 2.**

---

### Path B: Moderate Complexity (Score 5-9) - Ask User

**Inform user:**
```markdown
⚖️ **Moderate Complexity Detected (Score: [X])**

I can perform the technical analysis in two ways:

**Option 1: Quick Manual Scan** (~5 seconds)
- Fast configuration file analysis
- Basic pattern detection
- Good for straightforward tasks

**Option 2: Agent-Powered Deep Analysis** (~20 seconds)
- Comprehensive codebase exploration
- Detailed pattern and convention detection
- Validates technical feasibility
- Finds similar implementations
- Better for complex or unfamiliar codebases

**Would you like me to use agent assistance?** (yes/no)
```

**Wait for user choice:**
- `yes` → Go to Path C (Agent-Powered)
- `no` → Continue with Path A (Manual)

---

### Path C: Complex (Score 10+) - Agent-Powered Analysis

**Inform user:**
```markdown
🤖 **Complex Task Detected - Launching Agent Analysis**

Complexity Score: [X]
Matched Triggers: [list]

The agent will:
- Explore relevant files and directories
- Detect existing patterns and conventions
- Validate technical feasibility
- Find similar implementations
- Identify reusable components

This will take 15-30 seconds...
```

**Spawn Explore Agent:**

Read agent template from: `.spectacular/prompts/agent-templates.json`

**Use template:** `explore_codebase_context` or `detect_patterns_and_conventions` (based on triggers)

**Agent Task:**
```
Explore the codebase for technical analysis of:
"{user_prompt}"

Objectives:
1. Find relevant files for: {scope}
2. Detect code organization patterns
3. Identify existing implementations
4. Check technical feasibility
5. Find reusable components

Return:
- Relevant Files: [list with descriptions]
- Tech Stack: [detected technologies]
- Patterns: [conventions found]
- Similar Implementations: [examples]
- Feasibility: [assessment]
- Recommendations: [technical approach]
```

**Spawn the agent:**
```
Task(
  subagent_type="Explore",
  description="Technical codebase analysis",
  prompt=[agent task],
  model="haiku"
)
```

**Wait for agent results.**

---

### Agent Results Processing (Path C Only)

**Display agent findings:**
```markdown
✅ **Agent Analysis Complete**

### Codebase Context Discovered:

**Tech Stack Detected:**
- [Technology 1]
- [Technology 2]
- [Framework details]

**Relevant Files Found:**
- [file1.ext] - [description]
- [file2.ext] - [description]

**Patterns & Conventions:**
- Naming: [pattern]
- Structure: [pattern]
- Organization: [pattern]

**Similar Implementations:**
- [file] - [description of similar code]

**Technical Feasibility:**
- Feasible: [yes/no]
- Blockers: [list or "None"]
- Required Dependencies: [list or "All present"]

**Agent Recommendations:**
[Detailed recommendations based on analysis]
```

---

## Phase 2: Technical Analysis Output

**Synthesize findings (from Manual or Agent analysis):**

```
╔══════════════════════════════════════════════════════════════╗
║                 TECHNICAL ANALYSIS REPORT                     ║
╚══════════════════════════════════════════════════════════════╝

📁 PROJECT CONTEXT
├── Tech Stack: [detected technologies]
├── Framework: [name + version if detectable]
├── Architecture: [detected patterns]
├── Analysis Method: [Manual Scan / Agent-Powered]
└── Relevant Files: [files that will be affected]

🔍 ANALYSIS OF: "[task from perfected prompt]"

**Context Source:** [Configuration files / Agent exploration]
```

---

## Phase 3: Implementation Options

**Generate 2-3 implementation approaches:**

### Option A: [Name]

**Description:** [What this approach does]

**Pros:**
- [Advantage 1]
- [Advantage 2]
- [Advantage 3]

**Cons:**
- [Disadvantage 1]
- [Disadvantage 2]

**Alignment with Codebase:**
- [How it fits existing patterns - from agent if available]

**Code Example:**
```[language]
// Scaffolding example following detected patterns
[code snippet matching conventions]
```

**Files to Create/Modify:**
- `path/to/file.ext` - [what changes]
- `path/to/file2.ext` - [what changes]

**Complexity:** [Low / Medium / High]

---

### Option B: [Name]

[Same structure as Option A]

---

### Option C: [Name] (if applicable)

[Same structure as Option A]

---

### ⭐ Recommended Option: [X]

**Reasoning:**
- [Why this is best for this project]
- [How it aligns with existing patterns]
- [Benefits specific to detected tech stack]
- [Agent recommendation if applicable]

---

## Phase 4: Best Practices Checklist

**Based on detected tech stack and patterns:**

```markdown
✅ **BEST PRACTICES FOR [TECH STACK]**

- [ ] **Architecture:** [Pattern-specific best practice]
  - [Detail from agent if available]

- [ ] **Error Handling:** [Stack-specific approach]
  - Example from codebase: [file reference if found]

- [ ] **Testing:** [Testing strategy for this stack]
  - Follow pattern from: [test file if found]

- [ ] **Security:** [Security considerations]
  - [Stack-specific guidance]

- [ ] **Performance:** [Performance considerations]
  - [Relevant to detected architecture]

- [ ] **Code Organization:** [Follow detected conventions]
  - Naming: [detected pattern]
  - Structure: [detected pattern]

- [ ] **Documentation:** [Documentation approach]
  - [Consistent with existing docs]
```

---

## Phase 5: Implementation Plan

**Provide actionable, ordered steps:**

```markdown
📝 **IMPLEMENTATION STEPS**

**Phase 1: Preparation**
1. **[First preparation step]**
   - Files: [list]
   - Action: [what to do]
   ```[language]
   // Code scaffolding matching conventions
   ```

**Phase 2: Core Implementation**
2. **[Implementation step]**
   - Follow pattern from: [example file if agent found one]
   - Files: [list]
   ```[language]
   // Implementation code
   ```

3. **[Next step]**
   ```[language]
   // More code
   ```

**Phase 3: Integration**
4. **[Integration step]**
   - Connect with existing: [component/file]
   ```[language]
   // Integration code
   ```

**Phase 4: Testing**
5. **[Testing step]**
   - Test files: [list]
   - Follow test pattern from: [existing test if found]
   ```[language]
   // Test code
   ```

**Phase 5: Validation**
6. **[Validation step]**
   - Verify: [success criteria from perfected prompt]
```

---

## Phase 6: Code Scaffolding

**Generate ready-to-use code templates following detected patterns:**

### File: `[path/to/new/file.ext]`

**Purpose:** [What this file does]
**Pattern:** [Following convention from: existing_file.ext]

```[language]
// Complete scaffolding code matching codebase conventions
// Namespace/package: [detected pattern]
// Class/component naming: [detected convention]

[Full implementation template]
```

---

### File: `[path/to/modified/file.ext]`

**Changes:** [What to modify]
**Location:** [Line/section references if available]

```[language]
// Context: existing code
[surrounding code for context]

// NEW: Changes to make
[modifications highlighted]

// End of changes
```

---

## Final Output Summary

```
╔══════════════════════════════════════════════════════════════╗
║              TECHNICAL ANALYSIS COMPLETE                      ║
╚══════════════════════════════════════════════════════════════╝

📊 **Analysis Summary:**
├── Complexity: [Simple/Moderate/Complex]
├── Analysis Method: [Manual/Agent-Powered]
├── Options Generated: [count]
├── Recommended: Option [X]
└── Agent Insights: [Yes/No - summary if yes]

📋 **Implementation Options:**
┌─────────────────────────────────────────────────────────────┐
│ Option A: [name] - Complexity: [Low/Medium/High]           │
│ Option B: [name] - Complexity: [Low/Medium/High]           │
│ ⭐ Recommended: [X] - [brief reason]                         │
└─────────────────────────────────────────────────────────────┘

✅ **Best Practices:** [count] items identified
📝 **Implementation Plan:** [count] phases, [count] steps
💻 **Code Scaffolding:** [count] files prepared

🎯 **Success Criteria (from prompt):**
[List from perfected prompt]

**Alignment with Codebase:**
[How solution fits existing patterns - agent insights if available]
```

---

⏸️ **After analysis, wait for user confirmation:**

Reply with:
- `proceed` — Implement the recommended option
- `option [A/B/C]` — Implement specific option
- `explain` — Explain analysis or agent findings in detail
- `modify` — Adjust the analysis
- `agent` — Re-run with agent analysis (if manual was used)
- `manual` — Re-run with manual scan (if agent was used)
- `cancel` — Stop

---

## Configuration

**This command uses:**
- `.spectacular/prompts/complexity-rules.json` - Complexity detection rules
- `.spectacular/prompts/agent-templates.json` - Agent prompt templates

**Customize:**
- Edit complexity rules to adjust thresholds
- Modify agent templates for domain-specific analysis
- Tune weights for your project type

---

## How It Helps

**Hybrid Intelligence Benefits:**

✅ **Fast when simple:** Manual scan for straightforward tasks (~5s)
✅ **Deep when complex:** Agent explores for comprehensive analysis (~20s)
✅ **Always accurate:** Context gathered from actual codebase
✅ **Pattern-aware:** Follows existing conventions automatically
✅ **Validated:** Checks technical feasibility before recommending

**Compared to manual analysis:**
- ⚡ Faster codebase exploration
- 🎯 More accurate pattern detection
- ✅ Validated feasibility
- 📚 Finds existing examples automatically
- 🤖 Scales from simple to complex seamlessly

---

## Examples

### Example 1: Simple Task (Manual Scan)

**Input:**
```
/prompt-technical Add input validation to the login form
```

**Complexity:** Score 0 (simple, single component)
**Analysis:** Manual scan (~5s)
**Output:** Quick tech stack detection + validation patterns + scaffolding

---

### Example 2: Complex Task (Agent-Powered)

**Input:**
```
/prompt-technical Implement caching layer following existing patterns in the codebase
```

**Complexity:** Score 10 (pattern detection=6 + cross-cutting=4)
**Analysis:** Agent-powered (~20s)
**Agent finds:** Existing cache implementations, Redis config, service layer patterns
**Output:** Comprehensive analysis with agent insights + pattern-matched scaffolding

---

## Tips

1. **Be specific in your prompt** - Better prompts → better analysis
2. **Trust complexity detection** - Let the system choose the right approach
3. **Review agent findings** - Agent insights are shown transparently
4. **Try both methods** - Use `manual` or `agent` flags to override
5. **Customize for your stack** - Edit config files for domain-specific rules

---

**Ready for technical analysis? Just type:**
```
/prompt-technical [your technical task]
```
