# /example-custom-command - Example Custom Command Template

**Purpose:** This is an example template showing how to create a custom command using the unified library system.

**Use this as a starting point** for creating your own domain-specific commands.

---

## Overview

This example demonstrates:
- How to reference the core Phase 0 library
- How to use or create domain-specific adapters
- How to add custom Phase 1 logic
- How to integrate advanced features (optional)
- Best practices for documentation

---

## Phase 0: Prompt Perfection

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`

**Adaptation:** [Choose one or create custom]
- None (use universal criteria only)
- Technical (from `.claude/library/adapters/technical-adapter.md`)
- Article (from `.claude/library/adapters/article-adapter.md`)
- Session (from `.claude/library/adapters/session-adapter.md`)
- Hybrid Intelligence (from `.claude/library/adapters/hybrid-adapter.md`)
- Custom (create your own adapter in `.claude/library/adapters/`)

**For this example:** We'll use the universal Phase 0 with no adapter.

---

### Step 0.1-0.6: Standard Phase 0 Flow

**The canonical Phase 0 from the library provides:**
1. **Step 0.1:** Initial Analysis (language, type, intent)
2. **Step 0.2:** Completeness Check (6 universal criteria)
3. **Step 0.3:** Clarification Questions (if needed)
4. **Step 0.4:** Correction & Structuring
5. **Step 0.5:** Output Perfect Prompt
6. **Step 0.6:** Approval Gate

**Optional: Add Domain-Specific Criteria**

If your command needs additional criteria, add them to Step 0.2:

```markdown
**Domain-Specific Criteria:**
- [ ] **Your Criterion 1:** Description
- [ ] **Your Criterion 2:** Description
- [ ] **Your Criterion 3:** Description
```

**Example for a code review command:**
```markdown
**Code Review Criteria:**
- [ ] **File/PR to Review:** Specific file or pull request URL
- [ ] **Review Focus:** Security / Performance / Style / All
- [ ] **Depth Level:** Quick / Standard / Thorough
```

---

## Phase 1: Custom Command Logic

**After Phase 0 approval, execute your domain-specific logic.**

### Step 1.1: Prepare for Execution

Based on the perfected prompt, prepare your command:

```markdown
**Execution Plan:**
1. [First step your command needs to do]
2. [Second step]
3. [Third step]
...
```

**Example for code review:**
```markdown
**Execution Plan:**
1. Read the specified file(s) or PR
2. Analyze code against focus area (security/performance/style)
3. Generate findings with severity levels
4. Provide recommendations with code examples
5. Output formatted report
```

---

### Step 1.2: Execute Domain Logic

**This is where your command's unique functionality goes.**

**Best Practices:**

1. **Use Tools Appropriately:**
   - Read tool for file access
   - Glob tool for file discovery
   - Grep tool for code search
   - Bash tool for git/npm commands
   - Task tool for complex analysis (spawn agents if needed)

2. **Provide Progress Updates:**
   ```markdown
   🔍 **Analyzing code...**
   - Reading files...
   - Checking for [your focus]...
   - Generating recommendations...
   ```

3. **Handle Errors Gracefully:**
   - Check if files exist before reading
   - Validate input parameters
   - Provide helpful error messages

**Example Implementation:**

```markdown
**Step 1.2.1: Read Target Files**

Use Read tool to load the file(s) specified in perfected prompt.

**Step 1.2.2: Analyze Code**

Perform your domain-specific analysis:
- For code review: Check patterns, anti-patterns, best practices
- For testing: Generate test cases
- For documentation: Extract API endpoints and types
- For refactoring: Identify improvement opportunities

**Step 1.2.3: Generate Output**

Format results according to your command's purpose:
- Code review → Findings report with severity
- Testing → Test suite with assertions
- Documentation → Markdown docs with examples
- Refactoring → Suggestions with before/after code
```

---

### Step 1.3: Present Results

**Output Format:**

```markdown
✅ **[Your Command Name] Complete**

### Summary:
- [Key metric 1]: [value]
- [Key metric 2]: [value]
- [Key metric 3]: [value]

### Results:

[Your command's main output]

### Recommendations:

1. **[Recommendation 1]**
   - Details: [explanation]
   - Example: [code or example]

2. **[Recommendation 2]**
   - Details: [explanation]
   - Example: [code or example]

### Next Steps:

- [ ] [Actionable step 1]
- [ ] [Actionable step 2]
- [ ] [Actionable step 3]
```

---

### Step 1.4: Post-Execution Actions (Optional)

**Ask user for follow-up:**

```markdown
**What would you like to do next?**
- `save` — Save results to file
- `revise` — Modify and re-run
- `explain [item]` — Get more details
- `done` — Finish
```

---

## Optional: Add Hybrid Intelligence

**If your command would benefit from agent assistance:**

1. **Add complexity detection** (from hybrid-adapter.md)
2. **Spawn agents** for codebase exploration
3. **Use caching** for performance
4. **Enable multi-agent verification** for critical operations

**Example:**

```markdown
## Phase 0: Prompt Perfection with Hybrid Intelligence

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Hybrid Intelligence (from `.claude/library/adapters/hybrid-adapter.md`)

**Enhanced Flow:**
1. Initial Analysis + Complexity Detection
2. IF complex → Spawn agent to gather context
3. Continue with Phase 0 Steps 0.2-0.6 (enhanced with agent findings)

## Phase 1: [Your Command] with Agent Context

**Use agent findings** (if available) to enhance your command's execution.
```

---

## Configuration (Optional)

**If your command uses configuration files:**

Create configuration in `.claude/config/`:

```json
// .claude/config/your-command-config.json
{
  "enabled": true,
  "default_option": "value",
  "thresholds": {
    "level_1": 10,
    "level_2": 20
  },
  "custom_settings": {
    "option_a": true,
    "option_b": false
  }
}
```

**Reference in your command:**

```markdown
**Configuration:** `.claude/config/your-command-config.json`

Read configuration at runtime and use values in execution.
```

---

## Examples

### Example 1: Simple Usage

**Input:**
```
/example-custom-command [your input]
```

**Execution:**
- Phase 0: Perfects the prompt
- Phase 1: Executes custom logic
- Output: Results with recommendations

**Time:** ~5 seconds

---

### Example 2: Complex Usage with Agent

**Input:**
```
/example-custom-command [complex task requiring codebase analysis]
```

**Execution:**
- Phase 0: Detects complexity (score >= 10)
- Agent: Spawned to gather context
- Phase 1: Executes with agent insights
- Output: Enhanced results with codebase-specific recommendations

**Time:** ~20 seconds (first time), ~2 seconds (cached)

---

## Tips for Creating Custom Commands

1. **Start Simple:**
   - Use basic Phase 0 import first
   - Add custom logic in Phase 1
   - Test thoroughly before adding advanced features

2. **Follow the Pattern:**
   - Study existing commands (prompt.md, session-end.md)
   - Use same section structure
   - Maintain consistent formatting

3. **Document Thoroughly:**
   - Add clear purpose and overview
   - Provide examples
   - Include troubleshooting section
   - Add version history

4. **Test Edge Cases:**
   - Missing information
   - Invalid input
   - File not found
   - Agent timeout (if using)

5. **Version Your Command:**
   - Start with v1.0
   - Document changes in version history
   - Update version number when making changes

---

## Troubleshooting

**Issue:** Phase 0 not working correctly
**Solution:** Verify library reference path is correct: `.claude/library/prompt-perfection-core.md`

**Issue:** Adapter not loading
**Solution:** Check adapter path and ensure file exists in `.claude/library/adapters/`

**Issue:** Custom logic errors
**Solution:** Test Phase 1 logic independently, add error handling

**Issue:** Command too slow
**Solution:** Consider using Task tool for complex operations, add caching if applicable

---

## Version History

**v1.0 (2024-12-20):**
- Initial example template
- Demonstrates library system integration
- Shows Phase 0 + custom Phase 1 pattern
- Includes optional hybrid intelligence example

---

## Library Integration

This example uses the **Unified Library System:**
- **Core:** `.claude/library/prompt-perfection-core.md` (universal Phase 0)
- **Adapter:** None (or choose appropriate adapter for your domain)
- **Benefits:** Consistent validation, proven flow, easy maintenance

For details on the library system, see: `doc/Unified_Library_System_Guide.md`

---

## Creating Your Own Custom Command

1. **Copy this template:**
   ```bash
   cp .claude/commands/example-custom-command.md .claude/commands/your-command.md
   ```

2. **Customize Phase 0:**
   - Choose appropriate adapter or use none
   - Add domain-specific criteria if needed

3. **Implement Phase 1:**
   - Replace example logic with your functionality
   - Use appropriate tools (Read, Glob, Grep, Bash, Task)
   - Format output for your use case

4. **Document:**
   - Update purpose and overview
   - Add examples
   - Create version history entry

5. **Test:**
   - Test with simple inputs
   - Test with complex inputs
   - Test error cases
   - Test edge cases

6. **Deploy:**
   - Save to `.claude/commands/`
   - Test in Claude Code with `/your-command`
   - Iterate based on results

---

**Ready to create your custom command? Copy this template and start building!**
