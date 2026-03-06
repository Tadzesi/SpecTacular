# Relationship Mapper

**Version:** 1.0.0
**Purpose:** Map connections between current task and existing project work
**Part of:** Predictive Intelligence System (Phase 0.15.4)

---

## Overview

The Relationship Mapper analyzes current user requests in the context of:
- Previous work (session history)
- Existing codebase patterns
- File dependencies
- Similar implementations

**Goal:** Help users build on existing work instead of creating inconsistencies

---

## Data Sources

### 1. Session History
**File:** `.claude/memory/sessions.md`
**Contains:**
- Previous tasks and implementations
- Decisions made
- Patterns established
- Lessons learned

### 2. Project Knowledge Graph
**File:** `.claude/memory/project-knowledge.md`
**Contains:**
- Core components and their relationships
- Architecture patterns
- Security model
- Performance characteristics

### 3. Prompt Learning Patterns
**File:** `.claude/memory/prompt-patterns.md`
**Contains:**
- Common user request patterns
- Successful transformations
- User preferences

### 4. Codebase Structure
**Sources:**
- File tree analysis
- Import/dependency analysis
- Naming pattern detection

---

## Relationship Types

### Type 1: Similar Previous Work

**Definition:** User has done something similar before

**Detection:**
```
SEARCH session_history FOR tasks WHERE:
  - Same domain keywords (auth, payment, API, etc.)
  - Similar action verbs (add, implement, fix, refactor)
  - Same files or components
  - Within last N sessions (default: 10)
```

**Example:**
```
Current: "Add payment processing"
Found: 3 weeks ago - "Add subscription management"

Relationship: Both involve payments, similar patterns
Recommendation: "You implemented subscription payments before.
                 Should I follow that Stripe integration pattern?"
```

**Output Format:**
```markdown
**Similar Work Found:**
- **[Date]:** [Previous task]
  - **Pattern used:** [Description]
  - **Lesson:** [What was learned]
  - **Recommendation:** [Apply same pattern / Improve on it]
```

---

### Type 2: Dependent Components

**Definition:** Current task will affect other parts of the system

**Detection:**
```
IF current_task affects component X:
  FIND all components that:
    - Import/reference X
    - Extend X
    - Configure X
    - Depend on X's behavior
```

**Example:**
```
Current: "Modify authentication service"
Found:
  - AuthController (uses AuthService)
  - UserMiddleware (validates auth tokens)
  - ProfileService (requires authenticated user)
  - AdminPanel (protected by auth)

Relationship: 15 components depend on auth
Recommendation: "Changing auth affects 15 components.
                 I can analyze impact before you proceed."
```

**Output Format:**
```markdown
**Dependent Components (will be affected):**
- **[Component]:** [How it depends on current task]
  - **Impact:** [What might break]
  - **Action needed:** [Update/test/validate]
```

---

### Type 3: Similar Implementations

**Definition:** Codebase already has similar code that can serve as template

**Detection:**
```
IF task == "add [X]":
  SEARCH codebase FOR:
    - Existing [X] implementations
    - Similar patterns
    - Naming conventions
    - File structures
```

**Example:**
```
Current: "Add user profile endpoint"
Found:
  - UserController has 5 endpoints (GET/POST/PUT/DELETE/PATCH)
  - All follow RESTful pattern
  - All use FluentValidation
  - All have matching test files

Relationship: Project has established API pattern
Recommendation: "Your project has 5 existing user endpoints.
                 Should I match that RESTful pattern?"
```

**Output Format:**
```markdown
**Similar Implementations in Codebase:**
- **[File]:[Line]** - [What it does]
  - **Pattern:** [Specific pattern to follow]
  - **Recommendation:** [Replicate this structure]
```

---

### Type 4: Related Technical Debt

**Definition:** Current task relates to known issues or improvements needed

**Detection:**
```
SEARCH session_history FOR:
  - TODOs related to current area
  - Known issues in related components
  - Planned improvements
  - Deferred work items
```

**Example:**
```
Current: "Optimize database queries"
Found:
  - Session note: "TODO: Add indexes to user table"
  - Known issue: "N+1 queries in order history"
  - Planned: "Implement query caching"

Relationship: Multiple performance issues in same area
Recommendation: "You noted 3 performance TODOs in this area.
                 Should I create comprehensive optimization plan?"
```

**Output Format:**
```markdown
**Related Technical Debt:**
- **[TODO/Issue]:** [Description]
  - **Status:** [Deferred/Planned/In progress]
  - **Recommendation:** [Address now / Keep separate]
```

---

### Type 5: Pattern Conflicts

**Definition:** User's approach might conflict with existing patterns

**Detection:**
```
IF user_proposed_approach DIFFERS FROM project_pattern:
  IDENTIFY:
    - What the difference is
    - Why project pattern exists
    - Impact of deviation
```

**Example:**
```
Current: "Add UserManager class"
Conflict:
  - Project uses "UserService" naming (15 occurrences)
  - "Manager" suffix not used anywhere
  - Inconsistent with established pattern

Recommendation: "Your project uses '{Noun}Service' pattern
                 (15 files). 'UserManager' breaks this pattern.
                 Rename to 'UserService' for consistency?"
```

**Output Format:**
```markdown
⚠️  **PATTERN CONFLICT DETECTED:**

**Your approach:** [Description]
**Project standard:** [Established pattern]
**Occurrences of standard:** [Count] files

**Impact of deviation:**
- [Consequence 1]
- [Consequence 2]

**Recommendation:** [Follow standard / Justify deviation]
```

---

## Mapping Algorithm

### Step 1: Extract Context from Current Task

```
context = {
  domain: extract_domain_keywords(user_prompt),
  action: extract_action_verb(user_prompt),
  components: extract_component_names(user_prompt),
  files: extract_file_references(user_prompt),
  scope: estimate_scope(user_prompt)
}
```

### Step 2: Search Session History

```
related_sessions = []

FOR EACH session IN session_history (last 10):
  similarity_score = calculate_similarity(session, context)
  IF similarity_score > threshold (0.7):
    related_sessions.append(session)

SORT related_sessions BY similarity_score DESC
RETURN top 3
```

### Step 3: Analyze Code Dependencies

```
IF context.components NOT empty:
  FOR EACH component IN context.components:
    dependents = find_dependents(component)
    dependencies = find_dependencies(component)

  RETURN {
    affected: dependents,
    requires: dependencies
  }
```

### Step 4: Find Similar Implementations

```
IF context.action IN ["add", "create", "implement"]:
  similar = search_codebase_for_pattern(context.domain, context.action)

  FOR EACH match IN similar:
    pattern = extract_pattern(match)
    ADD to recommendations
```

### Step 5: Detect Pattern Conflicts

```
user_pattern = infer_pattern_from_prompt(user_prompt)
project_patterns = load_detected_patterns()

FOR EACH project_pattern IN project_patterns:
  IF user_pattern CONFLICTS WITH project_pattern:
    conflicts.append({
      user: user_pattern,
      standard: project_pattern,
      severity: calculate_conflict_severity()
    })
```

### Step 6: Generate Relationship Report

```
report = {
  similar_work: related_sessions,
  dependent_components: dependents,
  similar_implementations: similar_code,
  related_debt: related_todos,
  pattern_conflicts: conflicts
}

RETURN formatted_relationship_map(report)
```

---

## Output Template

```markdown
## 🔗 RELATED WORK & CONNECTIONS

[IF similar_work found]:
### Previous Related Tasks:
- **[Date]:** [Task description]
  - **Relevance:** [How it relates]
  - **Pattern used:** [Approach taken]
  - **Lesson learned:** [Insight]
  - **Recommendation:** [Apply / Improve / Avoid]

[IF dependent_components found]:
### Affected Areas (will need updates):
- **[Component/File]:** [Why affected]
  - **Change required:** [What needs updating]
  - **Risk:** [Low/Medium/High]

[IF similar_implementations found]:
### Similar Implementations in Codebase:
- **[File]:[Line]** - [Description]
  - **Pattern:** [Specific pattern observed]
  - **Quality:** [Good example / Needs improvement]
  - **Recommendation:** [Follow this / Improve on it]

[IF related_debt found]:
### Related Technical Debt:
- **[TODO/Issue]:** [Description]
  - **Created:** [Date]
  - **Priority:** [Low/Medium/High]
  - **Recommendation:** [Address now / Defer / Integrate]

[IF pattern_conflicts found]:
⚠️  ### PATTERN CONFLICT DETECTED:
**Your approach:** [Description]
**Project standard:** [Pattern] ([N] occurrences)
**Impact:** [Inconsistency consequences]
**Recommendation:** [Follow standard / Establish new pattern]

[IF no relationships]:
### No Direct Relationships Found
This appears to be a new area. I'll help establish patterns.
```

---

## Configuration

### Thresholds

```json
{
  "similarity_threshold": 0.7,
  "max_related_sessions": 3,
  "max_dependents_shown": 10,
  "history_window_sessions": 10,
  "pattern_conflict_sensitivity": "medium"
}
```

### Weights for Similarity Scoring

```json
{
  "domain_match": 0.4,
  "action_match": 0.2,
  "component_match": 0.3,
  "file_match": 0.1
}
```

---

## Integration Example

**In Phase 0.15.4 (Relationship Mapping step):**

```markdown
## Step 0.15.4: Relationship Mapping

**Import:** Use Relationship Mapper from `.claude/library/intelligence/relationship-mapper.md`

**Process:**
1. Extract context from user prompt
2. Run relationship mapping algorithm
3. Generate relationship report
4. Display findings to user
5. Provide recommendations based on relationships

**Output:** [Formatted relationship map as specified in template]
```

---

## Benefits

✅ **Consistency:** Encourages following established patterns
✅ **Efficiency:** Builds on existing work instead of reinventing
✅ **Quality:** Learn from past successes and mistakes
✅ **Awareness:** Understand impact before making changes
✅ **Context:** Connect current work to broader project

---

## Version History

**v1.0.0 (2026-01-01):**
- Initial release
- 5 relationship types
- Mapping algorithm
- Integration with predictive intelligence

---

**Related Files:**
- Core: `.claude/library/intelligence/predictive-intelligence-core.md`
- Warning System: `.claude/library/intelligence/warning-system.md`
- Next Steps: `.claude/library/intelligence/next-steps-predictor.md`
- Configuration: `.claude/config/predictive-intelligence.json`
