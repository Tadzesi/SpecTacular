# Technical Implementation Adapter

**Version:** 1.0
**Parent Library:** `.claude/library/prompt-perfection-core.md`
**Purpose:** Domain-specific adaptation for programming and development tasks

---

## Overview

This adapter extends the core Phase 0 flow for technical implementation commands (`/prompt-technical`, `/prompt-hybrid` when technical).

It adds technical-specific completeness criteria and validation patterns.

---

## When to Use This Adapter

Use this adapter when the command's purpose is:
- **Code implementation** (writing new code)
- **Refactoring** (improving existing code)
- **Bug fixing** (resolving code issues)
- **Technical analysis** (understanding codebase)
- **Architecture planning** (designing systems)

---

## Extended Completeness Criteria

In addition to the universal 6 criteria, check for:

### For All Technical Tasks

- [ ] **Technical Stack:** Languages, frameworks, versions
- [ ] **Architecture:** Patterns, conventions, structure
- [ ] **Code Location:** Specific files, classes, methods
- [ ] **Testing Strategy:** Unit tests, integration tests, test approach

### For Implementation Tasks

- [ ] **Implementation Pattern:** How to structure the solution
- [ ] **Existing Examples:** Similar implementations in codebase
- [ ] **Dependencies:** Required libraries, packages, services
- [ ] **Error Handling:** How to handle failures

### For Refactoring Tasks

- [ ] **Current State:** What exists now
- [ ] **Target State:** What it should become
- [ ] **Backwards Compatibility:** Breaking changes or not
- [ ] **Migration Strategy:** How to transition

### For Bug Fixes

- [ ] **Reproduction Steps:** How to trigger the bug
- [ ] **Expected Behavior:** What should happen
- [ ] **Actual Behavior:** What's happening instead
- [ ] **Root Cause:** Why it's happening (if known)

---

## Technical-Specific Clarification Questions

### Stack and Environment

**Critical:**
1. Which programming language and framework are you using?
   - Why: Determines syntax, patterns, best practices
   - Example: "React with TypeScript" vs "Vue with JavaScript"

2. What's your target environment?
   - Why: Affects compatibility, deployment, testing
   - Example: "Node 18 on Linux" vs "Browser with ES2020"

### Code Location and Scope

**Critical:**
3. Which files or components need to be modified?
   - Why: Defines exact scope, prevents over-implementation
   - Example: "UserService.cs, IUserRepository.cs"

4. Are there existing implementations I should follow?
   - Why: Ensures consistency with codebase patterns
   - Example: "Follow pattern from AuthService.cs"

### Technical Feasibility

**Important:**
5. Are there any technical constraints or limitations?
   - Why: Prevents suggesting infeasible solutions
   - Example: "Must work without external dependencies"

6. What's your testing approach for this change?
   - Why: Ensures quality, defines done criteria
   - Example: "Unit tests required" vs "Manual testing OK"

### Implementation Details

**Important:**
7. Should I follow any specific coding standards or conventions?
   - Why: Maintains code quality and consistency
   - Example: "Follow Airbnb style guide"

**Optional:**
8. Are there performance or security requirements?
   - Why: Might affect implementation approach
   - Example: "Must handle 10k requests/sec"

---

## Hybrid Intelligence Integration

### Complexity Detection for Technical Tasks

**Use existing complexity rules from** `.claude/config/complexity-rules.json`

**Additional technical triggers:**
- "codebase" / "entire project" (+5)
- "following existing pattern" (+6)
- "refactor" / "restructure" (+5)
- "performance" / "optimize" (+4)
- "security" / "authentication" (+4)

### When to Spawn Agents

**Spawn Explore Agent when:**
- Pattern detection needed (score includes pattern trigger)
- Multi-file scope (score >= 10)
- Existing implementations needed
- Codebase architecture unclear

**Spawn Plan Agent when:**
- Implementation planning (score >= 10 with implementation trigger)
- Refactoring (score >= 10 with refactor trigger)
- Architecture decisions needed

### Agent-Enhanced Questions

If agent was used, enhance questions with agent findings:

```markdown
🤖 **Agent Analysis:**

The agent found:
- Existing pattern in: [file paths]
- Similar implementations: [examples]
- Tech stack: [detected frameworks]
- Recommended approach: [agent suggestion]

**Questions based on agent analysis:**

1. The agent found [X] pattern in [file]. Should we follow this pattern?
   - Yes (recommended) - Maintains consistency
   - No - Use different approach (specify)

2. Agent detected [Y] dependency. Should I use it?
   - Yes - Reuse existing
   - No - Implement custom solution
```

---

## Perfected Prompt Format for Technical Tasks

### Standard Technical Prompt

```markdown
**✨ Perfected Technical Prompt:**

**Goal:** [Clear technical outcome]

**Context:**
- Environment: [OS, runtime, platform]
- Tech Stack: [Languages, frameworks, versions]
- Framework: [Specific framework + version]
- Architecture: [Patterns in use - e.g., MVC, Clean Architecture]
- Project Background: [Relevant context]

**Scope:**
- Files to modify:
  - [file1.ext] - [What changes: add method, refactor class, etc.]
  - [file2.ext] - [What changes]
- Files to create:
  - [file3.ext] - [Purpose, following pattern from X]
- Components affected: [Services, controllers, models, etc.]

**Requirements:**
1. [Functional requirement 1]
2. [Functional requirement 2]
3. Follow pattern from: [example_file.ext] ← Agent-identified
4. Use existing utility: [utility_name] from [file] ← Agent-found
5. Include error handling for: [scenarios]
6. Write tests for: [test cases]
...

**Constraints:**
- Coding Standards: [Which standards to follow]
- Compatibility: [Backwards compatibility, browser support]
- Dependencies: [Allowed/disallowed dependencies]
- Performance: [Performance requirements if any]
- Security: [Security considerations]

**Expected Result:**
[What success looks like]
- Functionality: [What it should do]
- Tests: [Test coverage expected]
- Documentation: [Code comments, README updates]

**Technical Validation (if agent used):**
- ✅ Feasibility: [Agent assessment]
- ✅ Compatible with codebase: [Details]
- ✅ Pattern alignment: [Existing patterns found]
- ✅ Dependencies: [All present / List missing]
- ⚠️ Blockers: [Technical blockers or "None"]

**Agent Recommendations (if applicable):**
[Key technical recommendations from agent]

**Implementation Approach:**
[Suggested approach based on analysis]
```

### For Bug Fixes

```markdown
**✨ Perfected Bug Fix Prompt:**

**Goal:** Fix [bug description]

**Context:**
- Tech Stack: [Technologies]
- Affected Component: [Where the bug is]
- Discovery: [How bug was found]

**Bug Details:**
- **Reproduction Steps:**
  1. [Step 1]
  2. [Step 2]
  3. [Step 3]

- **Expected Behavior:** [What should happen]
- **Actual Behavior:** [What's happening instead]
- **Root Cause:** [Why it's happening - if known]

**Scope:**
- Files to modify: [List with suspected locations]
- Tests to add: [Regression tests needed]

**Requirements:**
1. Fix the bug at root cause (not just symptoms)
2. Add regression test to prevent recurrence
3. Verify no side effects in related functionality
4. [Additional requirements]

**Expected Result:**
- Bug fixed and verified
- Regression test passing
- No new bugs introduced
```

### For Refactoring

```markdown
**✨ Perfected Refactoring Prompt:**

**Goal:** Refactor [component] for [reason]

**Context:**
- Current State: [What exists now]
- Target State: [What it should become]
- Reason: [Why refactoring - performance, maintainability, etc.]

**Scope:**
- Files to refactor: [List]
- Related files affected: [List]
- Tests to update: [List]

**Requirements:**
1. Maintain existing functionality (no behavior changes)
2. Improve [specific aspect - performance, readability, etc.]
3. Keep backwards compatible / Document breaking changes
4. Update tests to match new structure
5. [Additional requirements]

**Constraints:**
- Backwards Compatibility: [Required / Breaking changes OK]
- Migration Strategy: [How to transition existing code]
- Performance: [Must not regress]

**Expected Result:**
- Refactored code with improved [aspect]
- All tests passing
- Documentation updated
- [Migration guide if breaking changes]
```

---

## Validation Rules

### Pre-Implementation Validation

Before starting implementation, verify:

1. **Tech Stack Known**
   - Language and framework identified
   - Version compatibility checked
   - Dependencies available

2. **Code Location Clear**
   - Exact files identified
   - Existing code reviewed (if modifying)
   - Directory structure understood

3. **Pattern Alignment**
   - Existing patterns identified (manually or via agent)
   - Approach matches codebase conventions
   - No conflicts with architecture

4. **Testing Strategy Defined**
   - Test approach decided (unit, integration, e2e)
   - Test location identified
   - Coverage expectations set

### During Implementation Validation

1. **Code Quality**
   - Follows coding standards
   - Proper error handling
   - Adequate comments/documentation

2. **Testing**
   - Tests written and passing
   - Edge cases covered
   - Regression tests if fixing bug

3. **Integration**
   - Works with existing code
   - No breaking changes (or documented)
   - Dependencies resolved

---

## Technical-Specific Enhancements

### Auto-Detection Capabilities

When agent is used, automatically detect:

1. **Project Structure**
   - Glob for config files (package.json, *.csproj, etc.)
   - Identify framework and version
   - Map directory organization

2. **Coding Patterns**
   - Naming conventions (PascalCase, camelCase, snake_case)
   - File organization (feature-based, layer-based)
   - Common utilities and helpers

3. **Testing Approach**
   - Test framework in use (Jest, xUnit, Pytest)
   - Test file location patterns
   - Existing test examples

4. **Dependencies**
   - Installed packages
   - Available libraries
   - Custom utilities

### Code Scaffolding

Generate ready-to-use code templates:

1. **Match Existing Patterns**
   - Use same naming conventions
   - Follow same file structure
   - Import/using statements like existing code

2. **Include Boilerplate**
   - Error handling patterns
   - Logging statements
   - Documentation comments

3. **Provide Context**
   - Show surrounding code
   - Reference related files
   - Link to examples

---

## Integration with Hybrid Commands

### For /prompt-technical

```markdown
## Phase 0: Prompt Perfection

**Import:** `.claude/library/prompt-perfection-core.md`
**Adaptation:** Technical (from `.claude/library/adapters/technical-adapter.md`)

**Enhanced with Hybrid Intelligence:**
- Complexity detection enabled
- Agent spawning for complex tasks (score >= 10)
- Caching for repeated analyses
- Multi-agent verification for critical tasks (score >= 15)

[Continue with Phase 1: Technical Analysis]
```

### For /prompt-hybrid (Technical Tasks)

```markdown
## Phase 0: Prompt Perfection

**Import:** `.claude/library/prompt-perfection-core.md`
**Adaptation:** Conditional - Technical (if technical task detected)

**Complexity Detection:**
- Automatic from `.claude/config/complexity-rules.json`
- Technical triggers apply
- Agent spawns when needed

[Continue with Phase 1: Implementation or Analysis]
```

---

## Benefits of Technical Adapter

### Solves Common Problems

❌ **Before (No Adapter):**
- Generic questions don't gather technical details
- Missing framework/version information
- No pattern alignment checking
- Unclear code location
- No testing strategy

✅ **After (With Technical Adapter):**
- Technical-specific questions
- Framework and version captured
- Pattern alignment via agent (when complex)
- Exact file locations identified
- Testing approach defined upfront

### Improves Quality

✅ **Better Context:** Full tech stack understanding
✅ **Pattern Consistency:** Follows existing codebase conventions
✅ **Reduced Errors:** Technical feasibility validated
✅ **Testability:** Testing strategy defined early
✅ **Maintainability:** Coding standards enforced

---

## Examples

### Example 1: Simple Implementation

**User Prompt:**
```
Add input validation to the login form
```

**Technical Adapter Questions:**
1. Which framework? (React / Vue / Angular / etc.)
2. Which file contains the login form?
3. What validation rules? (email format, password strength)
4. Should I add tests?

**Result:**
- Tech stack identified
- Exact file known
- Validation rules specified
- Testing approach defined

### Example 2: Complex Refactoring (Agent Used)

**User Prompt:**
```
Refactor UserService to follow repository pattern like other services
```

**Complexity:** Score 11 (refactor=5 + pattern=6)
**Agent:** Spawns to find repository pattern examples

**Agent Finds:**
- `OrderRepository.cs` - example repository
- `ProductRepository.cs` - another example
- Pattern: Interface + implementation, dependency injection

**Enhanced Questions:**
1. Found repository pattern in OrderRepository. Follow this exact pattern? (yes/no)
2. Should I create IUserRepository interface? (recommended - yes)
3. Update dependency injection in Startup.cs? (yes/no)

**Result:**
- Pattern perfectly aligned
- Exact approach defined
- All affected files identified

---

## Version History

**v1.0 (2024-12-19):**
- Initial release
- Technical task criteria
- Bug fix and refactoring patterns
- Hybrid intelligence integration
- Code scaffolding support

---

## Related Files

- **Core Library:** `.claude/library/prompt-perfection-core.md`
- **This Adapter:** `.claude/library/adapters/technical-adapter.md`
- **Commands Using This:**
  - `.claude/commands/prompt-technical.md`
  - `.claude/commands/prompt-hybrid.md` (when technical task)
- **Complexity Rules:** `.claude/config/complexity-rules.json`
- **Agent Templates:** `.claude/config/agent-templates.json`

---

**This adapter ensures technical tasks get the detailed validation they need for successful implementation.**
