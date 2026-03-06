# Proactive Warning System

**Version:** 1.0.0
**Purpose:** Warn users about problems BEFORE they make mistakes
**Part of:** Predictive Intelligence System (Phase 0.15.5)

---

## Overview

The Proactive Warning System identifies potential problems, risks, and common mistakes BEFORE the user implements their solution.

**Philosophy:** PREVENT problems instead of FIXING them

**Approach:** Issue warnings based on:
- Domain-specific risks
- Common mistakes patterns
- Security implications
- Performance pitfalls
- Breaking change impact

---

## Warning Categories

### Category 1: Security Warnings (Priority: CRITICAL)

**When to trigger:** ANY security-critical keyword detected

**Security-critical keywords:**
- authentication, authorization, password, token
- security, encryption, ssl, tls, certificate
- payment, credit card, sensitive data, PII
- session, cookie, cors, csrf, xss
- admin, privilege, permission, access control

**Warning Rules:**

```
IF domain == "authentication" AND NOT mentioned("rate_limiting"):
  WARN:
    title: "Missing Rate Limiting"
    severity: "CRITICAL"
    description: "Authentication endpoints without rate limiting
                  are vulnerable to brute force attacks"
    impact: "Attackers can try unlimited passwords"
    mitigation: "Implement rate limiting (5 attempts/minute)"
    priority: "P0"

IF domain == "password" AND NOT mentioned("hashing"):
  WARN:
    title: "Password Security Not Specified"
    severity: "CRITICAL"
    description: "Passwords must be hashed, never stored plain text"
    impact: "Database breach exposes all user passwords"
    mitigation: "Use BCrypt (12+ rounds) or Argon2id"
    priority: "P0"

IF domain == "payment" AND NOT mentioned("idempotency"):
  WARN:
    title: "Missing Idempotency Protection"
    severity: "CRITICAL"
    description: "Payment operations can be duplicated on retry"
    impact: "Users charged multiple times"
    mitigation: "Implement idempotency keys for all payment operations"
    priority: "P0"

IF domain == "api" AND NOT mentioned("input_validation"):
  WARN:
    title: "Input Validation Not Mentioned"
    severity: "HIGH"
    description: "APIs must validate all inputs"
    impact: "Injection attacks, malformed data, crashes"
    mitigation: "Validate all inputs with strict schemas"
    priority: "P1"
```

---

### Category 2: Breaking Change Warnings (Priority: HIGH)

**When to trigger:** Changes that affect existing functionality

**Breaking change indicators:**
- Refactoring production code
- Database schema changes
- API endpoint modifications
- Authentication/authorization changes
- Dependency updates (major versions)

**Warning Rules:**

```
IF action == "refactor" AND scope includes "production":
  WARN:
    title: "Refactoring Production Code"
    severity: "HIGH"
    description: "Changes to production code risk breaking functionality"
    impact: "Service disruption, user-facing errors"
    mitigation: "1. Comprehensive test coverage
                 2. Rollback plan ready
                 3. Gradual rollout (feature flags)
                 4. Monitoring alerts configured"
    priority: "P1"

IF action == "modify" AND target == "database_schema":
  WARN:
    title: "Database Schema Change"
    severity: "CRITICAL"
    description: "Schema changes can cause data loss or service outage"
    impact: "Data loss, downtime, application crashes"
    mitigation: "1. BACKUP database first (non-negotiable)
                 2. Write migration + rollback scripts
                 3. Test on staging environment
                 4. Plan maintenance window OR zero-downtime migration"
    priority: "P0"

IF action == "change" AND target == "api_endpoint":
  WARN:
    title: "API Endpoint Modification"
    severity: "HIGH"
    description: "Changing existing API breaks client applications"
    impact: "Mobile apps, integrations, third-party tools break"
    mitigation: "1. Use API versioning (/v1/, /v2/)
                 2. Deprecation period (not immediate removal)
                 3. Communication to API consumers
                 4. OR: Add new endpoint, deprecate old one"
    priority: "P1"
```

---

### Category 3: Performance Warnings (Priority: MEDIUM)

**When to trigger:** Approaches with known performance issues

**Performance pitfall indicators:**
- "cache everywhere", "add caching to all"
- "fetch all", "load everything"
- "synchronous", "blocking"
- Large loops, nested iterations
- Missing indexes, full table scans

**Warning Rules:**

```
IF action == "add caching" AND scope == "all" OR scope == "everywhere":
  WARN:
    title: "Cache-Everywhere Anti-Pattern"
    severity: "MEDIUM"
    description: "Caching everything causes cache invalidation complexity"
    impact: "Stale data, memory bloat, maintenance nightmare"
    mitigation: "1. Profile first - find actual bottlenecks
                 2. Cache only hot paths (80/20 rule)
                 3. Plan cache invalidation strategy
                 4. Start small, expand based on metrics"
    priority: "P2"
    quote: "There are only two hard things in Computer Science:
            cache invalidation and naming things. - Phil Karlton"

IF pattern == "N+1 query" OR mentions("loop" AND "query"):
  WARN:
    title: "Potential N+1 Query Problem"
    severity: "MEDIUM"
    description: "Queries in loops cause performance degradation"
    impact: "Slow page loads, database overload, poor UX"
    mitigation: "Use eager loading or batch queries"
    priority: "P2"
```

---

### Category 4: Common Mistake Warnings (Priority: MEDIUM)

**When to trigger:** User about to make a well-known mistake

**Common mistakes by domain:**

```
IF domain == "authentication" AND task == "implement":
  COMMON_MISTAKES = [
    {
      mistake: "Forgetting password reset functionality",
      frequency: "90% of first-time implementations",
      impact: "Users get locked out, support tickets flood in",
      prevention: "Plan password reset flow now (not later)"
    },
    {
      mistake: "No email verification",
      frequency: "75% of initial implementations",
      impact: "Spam accounts, fake users, email typos",
      prevention: "Implement email verification from start"
    },
    {
      mistake: "Weak password requirements",
      frequency: "60% of implementations",
      impact: "User accounts easily compromised",
      prevention: "Enforce strong passwords (OWASP guidelines)"
    }
  ]

IF domain == "payment":
  COMMON_MISTAKES = [
    {
      mistake: "Not handling refunds/chargebacks",
      frequency: "85% forget this initially",
      impact: "Cannot process refunds when needed",
      prevention: "Design refund workflow now"
    },
    {
      mistake: "Storing credit card data",
      frequency: "Rare but devastating",
      impact: "PCI DSS violations, massive liability",
      prevention: "NEVER store card data - use provider tokens"
    }
  ]

IF domain == "api_endpoint":
  COMMON_MISTAKES = [
    {
      mistake: "No pagination on list endpoints",
      frequency: "70% of first implementations",
      impact: "Slow responses, timeout errors as data grows",
      prevention: "Add pagination now (limit/offset or cursor)"
    },
    {
      mistake: "Missing error handling",
      frequency: "80% initially",
      impact: "Generic errors, poor debugging, bad UX",
      prevention: "Plan error responses (4xx, 5xx with details)"
    }
  ]
```

**Warning Format:**
```markdown
💡 **COMMON MISTAKE WARNING:**

**Developers often forget:** [Mistake]
- **Frequency:** [X%] of implementations initially miss this
- **Impact:** [Consequence]
- **Prevention:** [How to avoid]
```

---

### Category 5: Best Practice Reminders (Priority: LOW)

**When to trigger:** Opportunity to follow best practices

**Best practice areas:**
- Testing strategy
- Documentation
- Error logging
- Monitoring/observability
- Code review

**Reminder Rules:**

```
IF any implementation AND NOT mentioned("tests"):
  REMIND:
    title: "Testing Strategy"
    severity: "LOW"
    description: "Consider test coverage for new code"
    suggestion: "Plan unit tests + integration tests"
    effort: "20-30% additional time"

IF any new feature AND NOT mentioned("documentation"):
  REMIND:
    title: "Documentation"
    severity: "LOW"
    description: "Document new functionality"
    suggestion: "Update README, API docs, or code comments"
    effort: "10-15% additional time"
```

---

## Warning Algorithm

### Step 1: Analyze User Prompt for Risk Indicators

```
risk_indicators = {
  security_keywords: extract_security_keywords(prompt),
  breaking_change_indicators: detect_breaking_changes(prompt),
  performance_pitfalls: detect_performance_issues(prompt),
  missing_critical_aspects: detect_omissions(prompt)
}
```

### Step 2: Load Domain-Specific Warnings

```
domain = detect_domain(prompt)
domain_warnings = load_warnings_for_domain(domain)

FOR EACH warning_rule IN domain_warnings:
  IF warning_rule.condition_met(prompt):
    warnings.append(warning_rule)
```

### Step 3: Check Against Common Mistakes Database

```
common_mistakes = load_common_mistakes(domain)

FOR EACH mistake IN common_mistakes:
  IF NOT mentioned_in_prompt(mistake.prevention_keyword):
    warnings.append({
      type: "common_mistake",
      mistake: mistake,
      priority: "MEDIUM"
    })
```

### Step 4: Prioritize Warnings

```
SORT warnings BY priority DESC:
  P0 (CRITICAL) - Security, data loss, breaking changes
  P1 (HIGH) - Important but not critical
  P2 (MEDIUM) - Performance, best practices
  P3 (LOW) - Nice-to-have reminders

LIMIT to top 5 warnings (avoid overwhelming user)
```

### Step 5: Generate Warning Output

```
FOR EACH warning IN prioritized_warnings:
  formatted_warning = format_warning(warning)
  ADD to output

RETURN formatted_warnings_output
```

---

## Output Template

```markdown
## 🚨 PROACTIVE WARNINGS

[IF any P0/CRITICAL warnings]:
### 🚨 CRITICAL WARNINGS - Address Before Proceeding:

- **[Warning Title]**
  - **Risk:** [What could go wrong]
  - **Impact:** [Consequences if ignored]
  - **Prevention:** [How to avoid]
  - **Priority:** P0

[IF any P1/HIGH warnings]:
### ⚠️  IMPORTANT CONSIDERATIONS:

- **[Warning Title]**
  - **Concern:** [What to watch for]
  - **Impact:** [Potential consequences]
  - **Recommendation:** [Best practice]
  - **Priority:** P1

[IF any P2/MEDIUM warnings]:
### 💡 COMMON MISTAKES TO AVOID:

- **Developers often forget:** [Mistake]
  - **Frequency:** [X%] miss this initially
  - **Impact:** [Consequence]
  - **Prevention:** [How to avoid]

[IF any P3/LOW reminders]:
### ✅ BEST PRACTICE REMINDERS:

- **[Practice]:** [Suggestion]
  - **Benefit:** [Why it helps]
  - **Effort:** [Time investment]

---

**RECOMMENDATION BASED ON WARNINGS:**

[IF critical warnings]:
These warnings indicate HIGH RISK. I strongly recommend:
1. [Mitigation for warning 1]
2. [Mitigation for warning 2]
Should I help you plan risk mitigation first?

[IF only medium/low warnings]:
These are good practices to consider. Proceed when ready.
```

---

## Warning Suppression

**Users can suppress specific warnings:**

```
# In user prompt:
"Add authentication --suppress-warning rate_limiting"

# System behavior:
Skip rate_limiting warning, show others
```

**Suppression tracking:**
- Log suppressed warnings
- Remind user later if appropriate
- Don't suppress P0 warnings (security critical)

---

## False Positive Reduction

**Avoid warning fatigue:**

1. **Context-aware warnings:**
   - Don't warn about "missing tests" if user said "quick prototype"
   - Don't warn about "production risk" if user said "development"

2. **Smart detection:**
   - Check if user already mentioned the mitigation
   - Example: Don't warn about rate limiting if prompt says "with rate limiting"

3. **Relevance filtering:**
   - Only show warnings relevant to current task
   - Don't show payment warnings for authentication task

4. **Frequency limits:**
   - Don't repeat same warning if user proceeded before
   - Track user preferences from learning system

---

## Integration Example

**In Phase 0.15.5 (Warning System step):**

```markdown
## Step 0.15.5: Proactive Warning System

**Import:** Use Proactive Warning System from `.claude/library/intelligence/warning-system.md`

**Process:**
1. Analyze prompt for risk indicators
2. Load domain-specific warnings
3. Check against common mistakes
4. Prioritize warnings
5. Generate formatted output

**Output:** [Formatted warnings as specified in template]
```

---

## Configuration

### Warning Thresholds

```json
{
  "max_warnings_shown": 5,
  "minimum_severity": "P2",
  "enable_common_mistakes": true,
  "enable_best_practice_reminders": true,
  "suppress_repeated_warnings": true
}
```

### Domain Risk Configuration

**Loaded from:** `.claude/config/predictive-intelligence.json` → `domain_risks`

---

## Benefits

✅ **Prevent vulnerabilities** before they're coded
✅ **Avoid common mistakes** with proactive guidance
✅ **Reduce rework** by getting it right first time
✅ **Better security** through risk awareness
✅ **Higher quality** with best practice reminders

---

## Examples

### Example 1: Authentication Warning

**User:** "Add JWT authentication"

**Warnings Triggered:**
```
🚨 CRITICAL WARNINGS:

- **Missing Rate Limiting**
  Risk: Brute force attacks
  Impact: Accounts can be compromised
  Prevention: Add rate limiting (5 attempts/min)
  Priority: P0

- **Token Expiration Not Specified**
  Risk: Long-lived tokens increase compromise window
  Impact: Stolen tokens valid indefinitely
  Prevention: Set expiration (15min access, 7day refresh)
  Priority: P1

💡 COMMON MISTAKES:

- **Developers often forget:** Password reset functionality
  Frequency: 90% initially miss this
  Impact: Users get locked out, support overwhelmed
  Prevention: Plan password reset flow now
```

---

### Example 2: Database Migration Warning

**User:** "Refactor database schema"

**Warnings Triggered:**
```
🚨 CRITICAL WARNINGS:

- **Database Schema Change Risk**
  Risk: Data loss, service outage
  Impact: Potential data loss, downtime, crashes
  Prevention:
    1. BACKUP database FIRST (non-negotiable)
    2. Write migration + rollback scripts
    3. Test on staging
    4. Plan maintenance OR zero-downtime approach
  Priority: P0

- **Breaking Change Impact**
  Risk: 12 dependent services will be affected
  Impact: Service disruption across system
  Prevention: Coordinate with affected teams, plan migration
  Priority: P0

RECOMMENDATION: This is HIGH RISK operation.
Use /prompt-research to analyze all dependencies first.
Plan comprehensive migration strategy before proceeding.
```

---

## Version History

**v1.0.0 (2026-01-01):**
- Initial release
- 5 warning categories
- Domain-specific rules
- Common mistakes database
- Priority system
- Warning suppression

---

**Related Files:**
- Core: `.claude/library/intelligence/predictive-intelligence-core.md`
- Relationship Mapper: `.claude/library/intelligence/relationship-mapper.md`
- Next Steps: `.claude/library/intelligence/next-steps-predictor.md`
- Configuration: `.claude/config/predictive-intelligence.json`
