# Predictive Intelligence Core

**Version:** 1.0.0
**Created:** 2026-01-01
**Purpose:** Proactive guidance system that anticipates user needs and sees "2 steps ahead"

---

## Overview

This library implements **Phase 0.15: Predictive Intelligence** - a new layer between initial analysis (0.1) and completeness check (0.2) that provides proactive guidance, warnings, and recommendations BEFORE the user encounters problems.

**Key Principle:** PREVENT problems instead of REACTING to them.

---

## Integration Point

**Location in Flow:** Between Step 0.1 (Initial Analysis) and Step 0.2 (Completeness Check)

**When to Execute:** After understanding user intent, before asking for missing information

**Input:** User's original prompt + detected language + prompt type + core intent
**Output:** Predictive analysis with journey stage, risks, warnings, and recommendations

---

## Phase 0.15: Predictive Intelligence

### Step 0.15.1: Journey Stage Detection

**Purpose:** Understand where the user is in their development journey

**Configuration:** Read from `.claude/config/predictive-intelligence.json` → `journey_stages`

**Process:**

1. **Analyze prompt against journey stage triggers:**
   - Exploring: "how does", "where is", "explain", "understand"
   - Planning: "should i", "design", "plan", "approach"
   - Implementing: "add", "create", "implement", "build"
   - Debugging: "fix", "bug", "error", "not working"
   - Refactoring: "refactor", "improve", "restructure"
   - Reviewing: "review", "audit", "check", "assess"

2. **Select primary journey stage** (highest match count)

3. **Determine stage-specific advice strategy:**
   ```
   IF journey_stage == "exploring":
     - Suggest related areas to explore
     - Offer comprehensive analysis options
     - Recommend /prompt-research for deep understanding

   IF journey_stage == "planning":
     - Highlight dependencies and prerequisites
     - Warn about common architectural mistakes
     - Suggest /prompt-technical for implementation options

   IF journey_stage == "implementing":
     - Warn about testing requirements
     - Alert to security implications
     - Highlight edge cases often forgotten
     - Suggest patterns from project

   IF journey_stage == "debugging":
     - Suggest root cause analysis
     - Recommend preventive measures
     - Identify related potential issues

   IF journey_stage == "refactoring":
     - Identify affected areas
     - Warn about breaking changes
     - Suggest comprehensive refactoring scope

   IF journey_stage == "reviewing":
     - Provide review checklist
     - Highlight common quality issues
     - Suggest standards/best practices
   ```

**Output:**
```markdown
### JOURNEY STAGE DETECTED: [Stage Name]

**What this means:**
[Description of what user is trying to do]

**Recommended approach:**
[Stage-specific guidance]
```

---

### Step 0.15.2: Domain Risk Analysis

**Purpose:** Identify domain-specific risks and security implications BEFORE implementation

**Configuration:** Read from `.claude/config/predictive-intelligence.json` → `domain_risks`

**Process:**

1. **Extract domain keywords from user prompt:**
   - authentication, authorization, payment, database, api, security, etc.

2. **Load domain risks for detected domains:**
   ```
   FOR EACH detected domain:
     risks = load_domain_risks(domain)
     FOR EACH risk in risks:
       IF risk.priority in ["P0", "P1"]:
         ADD to warnings_list
   ```

3. **Calculate risk severity:**
   - Critical: Any P0 risk detected
   - High: Any P1 risk detected
   - Medium: Any P2 risk detected
   - Low: No significant risks

4. **Generate mitigation recommendations:**
   - For each risk, provide specific mitigation strategy
   - Reference OWASP guidelines where applicable
   - Cite project-specific patterns if available

**Output:**
```markdown
### DOMAIN RISKS DETECTED:

**Severity: [Critical/High/Medium/Low]**

[IF Critical or High]:
⚠️  **CRITICAL RISKS:**
- **[Risk Name]:** [Description]
  - **Why this matters:** [Explanation]
  - **Mitigation:** [Specific recommendation]
  - **Priority:** [P0/P1]

[IF Medium]:
⚠️  **IMPORTANT CONSIDERATIONS:**
- **[Risk Name]:** [Description]
  - **Recommendation:** [Mitigation]
```

---

### Step 0.15.3: Project Pattern Recognition

**Purpose:** Detect existing project conventions and suggest consistency

**Data Sources:**
- Git history (if available via memory)
- File structure analysis
- Naming pattern detection
- Configuration files

**Process:**

1. **Quick pattern scan:**
   ```
   - Check for naming conventions (I{Name}, {Name}Async, etc.)
   - Detect architectural patterns (service layer, repositories, MVC)
   - Identify testing patterns (*.test.*, *.spec.*)
   - Find documentation patterns (README, API docs, JSDoc)
   ```

2. **Match user task to project patterns:**
   ```
   IF task == "add service" AND project_has("service_layer_pattern"):
     SUGGEST: "Follow existing service layer pattern from [example]"

   IF task == "create API endpoint" AND project_has("API_pattern"):
     SUGGEST: "Match your [count] existing endpoints structure"
   ```

3. **Detect inconsistencies:**
   ```
   IF user_approach CONFLICTS WITH project_pattern:
     WARN: "Your approach differs from project convention"
     EXPLAIN: Current pattern vs proposed approach
     ASK: "Follow existing pattern or establish new convention?"
   ```

**Output:**
```markdown
### PROJECT PATTERNS FOUND:

**Detected Conventions:**
- **Naming:** [Pattern] (e.g., I{Name} for interfaces)
  - **Consistency:** [95%] across [50] files
  - **Recommendation:** Follow this pattern for consistency

- **Architecture:** [Pattern] (e.g., Service layer)
  - **Example:** [file path]
  - **Recommendation:** Replicate this structure

[IF inconsistency detected]:
⚠️  **PATTERN CONFLICT DETECTED:**
Your approach: [description]
Project standard: [description]
**Recommendation:** [Follow standard / Justify deviation]
```

---

### Step 0.15.4: Relationship Mapping

**Purpose:** Connect current task to existing work and related areas

**Data Sources:**
- Session history (from `.claude/memory/sessions.md`)
- Project knowledge graph (from `.claude/memory/project-knowledge.md`)
- Git history analysis
- File dependency analysis

**Process:**

1. **Search for related previous work:**
   ```
   SEARCH session_history FOR:
     - Similar tasks (same keywords, same domain)
     - Related features (dependencies, integration points)
     - Recent changes to same files/areas
   ```

2. **Identify affected areas:**
   ```
   IF current_task affects "authentication":
     FIND all areas that depend on authentication:
       - Authorization middleware
       - Protected routes
       - Session management
       - User profile features
   ```

3. **Detect similar implementations:**
   ```
   IF task == "add login endpoint":
     SEARCH codebase FOR similar endpoints:
       - Registration endpoint (similar structure)
       - Password reset endpoint (similar flow)
     SUGGEST: "Follow pattern from [file]:[line]"
   ```

**Output:**
```markdown
### RELATED WORK & CONNECTIONS:

**Previous Related Tasks:**
- [Date]: [Task description]
  - **Relevance:** [How it relates to current task]
  - **Lesson learned:** [Insight from previous work]

**Affected Areas (will need updates):**
- [Component/File]: [Why it's affected]
- [Component/File]: [Why it's affected]

**Similar Implementations in Codebase:**
- [File]:[Line] - [Description]
  - **Pattern to follow:** [Specific pattern]
```

---

### Step 0.15.5: Proactive Warning System

**Purpose:** Warn about problems BEFORE user makes mistakes

**Warning Categories:**
1. **Security warnings** (always show for security-critical tasks)
2. **Breaking change warnings** (when changes affect other areas)
3. **Performance warnings** (when approach has known performance issues)
4. **Common mistake warnings** (based on domain knowledge)

**Process:**

1. **Load warning rules:**
   ```
   warnings = []

   IF domain == "authentication" AND NOT mentioned("rate_limiting"):
     ADD warning: "Missing rate limiting → brute force vulnerability"

   IF task == "add caching" AND NOT mentioned("invalidation"):
     ADD warning: "Cache invalidation strategy needed (hardest CS problem)"

   IF task == "refactor" AND scope == "production_code":
     ADD warning: "Refactoring production code → rollback plan required"
   ```

2. **Prioritize warnings:**
   - P0 (Critical): Security vulnerabilities, data loss risks
   - P1 (Important): Breaking changes, performance issues
   - P2 (Advisory): Best practices, optimizations

3. **Generate actionable warnings:**
   - What could go wrong
   - Why it matters
   - How to prevent it

**Output:**
```markdown
### PROACTIVE WARNINGS:

[IF Critical warnings]:
🚨 **CRITICAL WARNINGS - Address Before Proceeding:**
- **[Warning]:** [What could go wrong]
  - **Impact:** [Consequences]
  - **Prevention:** [How to avoid]

[IF Important warnings]:
⚠️  **IMPORTANT CONSIDERATIONS:**
- **[Warning]:** [What to watch for]
  - **Recommendation:** [Best practice]

[IF Advisory warnings]:
💡 **BEST PRACTICE REMINDERS:**
- [Advisory tip]
```

---

### Step 0.15.6: Next-Steps Prediction

**Purpose:** Forecast logical followup tasks and dependencies

**Configuration:** Read from `.claude/config/predictive-intelligence.json` → `common_followups`

**Process:**

1. **Identify task category:**
   ```
   IF task matches "user_registration":
     followups = ["email_verification", "login_functionality", "password_reset", "profile_management"]

   IF task matches "authentication":
     followups = ["authorization_middleware", "session_management", "rate_limiting", "password_reset"]
   ```

2. **Prioritize by importance:**
   ```
   P0 followups: Required (100% of projects need this)
   P1 followups: Highly recommended (80%+ of projects need this)
   P2 followups: Nice to have (50%+ of projects benefit)
   ```

3. **Estimate completion percentage:**
   ```
   FOR EACH followup:
     typical_percentage = how often projects implement this after main task

   EXAMPLE:
   "After user registration, 95% of projects also implement password reset"
   ```

4. **Suggest scope expansion or phased approach:**
   ```
   IF followups.count >= 3:
     SUGGEST: "Consider comprehensive approach or phased implementation"
     OFFER: "I can plan the complete flow (2-5 phases)"
   ```

**Output:**
```markdown
### RECOMMENDED NEXT STEPS:

After implementing [current task], you'll likely need:

**Immediate (Required):**
1. **[Followup Task]** - [Reason]
   - **Why:** [95%] of projects need this
   - **When:** Immediately after current task
   - **Effort:** [Low/Medium/High]

**Short-term (Highly Recommended):**
2. **[Followup Task]** - [Reason]
   - **Why:** [80%] of projects benefit from this
   - **When:** Within same sprint/milestone

**Long-term (Nice to Have):**
3. **[Followup Task]** - [Reason]
   - **Why:** Improves user experience
   - **When:** Future enhancement

**RECOMMENDATION:**
- **Option A:** Implement just [current task] (~[X] hours)
- **Option B:** Plan complete [feature] flow (~[Y] hours, more complete)

**Which approach fits your timeline?**
```

---

## Complete Output Format

**After all 6 steps, output comprehensive predictive analysis:**

```markdown
---

## 🔮 PREDICTIVE INTELLIGENCE ANALYSIS

### Journey Stage: [STAGE NAME]

**You are:** [Description of user journey stage]

**Recommended approach for this stage:**
[Stage-specific guidance from 0.15.1]

---

### ⚠️  Domain Risks & Security

**Risk Level:** [Critical/High/Medium/Low]

[Output from 0.15.2 - Domain Risk Analysis]

---

### 📐 Project Patterns

[Output from 0.15.3 - Pattern Recognition]

---

### 🔗 Related Work & Context

[Output from 0.15.4 - Relationship Mapping]

---

### 🚨 Proactive Warnings

[Output from 0.15.5 - Warning System]

---

### ⏭️  What's Next

[Output from 0.15.6 - Next-Steps Prediction]

---

**RECOMMENDATION:**

Based on this analysis, I suggest:
[Comprehensive recommendation synthesizing all insights]

**Options:**
- **Focused:** Proceed with just [current task]
- **Comprehensive:** Expand to include [recommended additions]
- **Research First:** Use /prompt-research for deeper analysis (if complex)

**How would you like to proceed?**

---
```

**After displaying predictive intelligence, continue with normal Phase 0 flow:**
- Step 0.2: Completeness Check (now enhanced with predictive context)
- Step 0.3: Clarification Questions (informed by predictive analysis)
- ...continue through Step 0.6 (Approval)

---

## Configuration Files

**Required:**
- `.claude/config/predictive-intelligence.json` - Main configuration

**Optional:**
- `.claude/memory/sessions.md` - Session history for relationship mapping
- `.claude/memory/project-knowledge.md` - Project knowledge graph
- `.claude/memory/prompt-patterns.md` - Learning patterns

---

## Benefits

### For Users:

✅ **Prevent problems** instead of fixing them
✅ **Complete features** instead of partial implementations
✅ **Consistent code** following project patterns
✅ **Better security** with proactive warnings
✅ **Faster development** with smart suggestions

### For Code Quality:

✅ **Fewer vulnerabilities** (warned before coding)
✅ **Better architecture** (dependencies identified upfront)
✅ **More complete** (followups suggested)
✅ **More consistent** (patterns enforced)

### For User Experience:

✅ **Less rework** (get it right first time)
✅ **Better guidance** (anticipatory vs reactive)
✅ **More confidence** (risks known upfront)
✅ **Clearer roadmap** (next steps predicted)

---

## Examples

### Example 1: Authentication Implementation

**User Prompt:** "Add authentication to the API"

**Without Predictive Intelligence:**
```
Claude: "What type of authentication? JWT or sessions?"
[User provides details, implements auth]
[Later discovers: missing rate limiting, no password reset, security gap]
```

**With Predictive Intelligence:**
```
🔮 PREDICTIVE INTELLIGENCE ANALYSIS

Journey Stage: IMPLEMENTATION

You are actively building authentication. Here's what to consider:

⚠️  Domain Risks (CRITICAL LEVEL):
🚨 Missing Rate Limiting → Brute force vulnerability (P0)
🚨 Password Security → Use BCrypt 12+ rounds (P0)
⚠️  Token Expiration → 15min access, 7day refresh (P1)

⏭️  What's Next After Auth:
1. Authorization Middleware (100% of projects need) - P0
2. Password Reset Flow (95% of projects need) - P1
3. Rate Limiting (90% of projects need) - P0
4. Email Verification (85% of projects) - P1

RECOMMENDATION: Plan complete authentication system
- Core auth: ~4 hours
- Complete security flow: ~8 hours (much more robust)

Implement just auth or plan complete security flow?
```

---

### Example 2: Database Refactoring

**User Prompt:** "Refactor database schema"

**With Predictive Intelligence:**
```
🔮 PREDICTIVE INTELLIGENCE ANALYSIS

Journey Stage: REFACTORING

⚠️  Domain Risks (HIGH LEVEL):
🚨 Data Loss Risk → Backup required before migration (P0)
🚨 Breaking Changes → Affects 12 dependent services (P0)
⚠️  Downtime → Plan zero-downtime migration strategy (P1)

🚨 PROACTIVE WARNINGS:
- Schema changes in production → Rollback plan REQUIRED
- Found 12 services using this schema → Coordination needed
- Migration scripts → Test on staging first

🔗 Related Work:
- Last schema change (2 weeks ago) had rollback
  Lesson: Always test migrations thoroughly

⏭️  Required Steps:
1. Backup current database (REQUIRED before any changes)
2. Write migration + rollback scripts
3. Test on staging environment
4. Coordinate with affected teams
5. Plan maintenance window OR zero-downtime approach

RECOMMENDATION: Use /prompt-research to analyze all dependencies first
This is HIGH RISK - comprehensive planning needed

Proceed with research or jump to implementation?
```

---

## Version History

**v1.0.0 (2026-01-01):**
- Initial release
- Complete predictive intelligence system
- 6-step analysis framework
- Journey stage detection
- Domain risk analysis
- Proactive warnings
- Next-steps prediction

---

## Related Files

- **Configuration:** `.claude/config/predictive-intelligence.json`
- **Core Library:** `.claude/library/prompt-perfection-core.md`
- **Relationship Mapper:** `.claude/library/intelligence/relationship-mapper.md`
- **Warning System:** `.claude/library/intelligence/warning-system.md`
- **Next Steps Predictor:** `.claude/library/intelligence/next-steps-predictor.md`

---

**Predictive Intelligence: See 2 steps ahead, prevent problems, guide users proactively.**
