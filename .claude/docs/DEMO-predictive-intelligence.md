# Predictive Intelligence Demo

**Version:** v4.0.0
**Purpose:** Simple demonstration of predictive intelligence in action

---

## Demo 1: Authentication Implementation

### User Input:
```
/prompt-hybrid Add authentication to my API
```

### Expected Output:

```
Phase 0: Prompt Perfection

Detected Language: English
Prompt Type: Implementation
Core Intent: Add API authentication

Complexity Analysis:
Matched Triggers:
- cross_cutting_concerns (weight: 4)
- implementation_planning (weight: 3)

Complexity Score: 7
Category: Moderate

---

🔮 PREDICTIVE INTELLIGENCE ANALYSIS

Journey Stage: IMPLEMENTING

You are actively building new functionality. Here's what to consider
BEFORE you start coding:

---

⚠️  Domain Risks & Security

Risk Level: CRITICAL

🚨 CRITICAL WARNINGS - Address Before Proceeding:

- Missing Rate Limiting
  Risk: Authentication endpoints without rate limiting are vulnerable
        to brute force attacks
  Impact: Attackers can try unlimited passwords
  Prevention: Implement rate limiting (5 attempts per minute)
  Priority: P0

- Password Security Not Specified
  Risk: Passwords must be hashed, never stored in plain text
  Impact: Database breach exposes all user passwords
  Prevention: Use BCrypt (12+ rounds) or Argon2id
  Priority: P0

- Token Expiration Configuration
  Risk: Long-lived tokens increase compromise window
  Impact: Stolen tokens valid for extended periods
  Prevention: Set reasonable expiration (15min access, 7day refresh)
  Priority: P1

---

📐 Project Patterns

Detected Conventions:
- Naming: I{Name} for interfaces (98% consistent across 45 files)
  Recommendation: Use IAuthService for authentication interface

- Architecture: Service layer pattern detected
  Example: UserService.cs, OrderService.cs
  Recommendation: Create AuthService following this pattern

Similar Implementations in Codebase:
- UserService.cs:25-80 - User management with validation
  Pattern: Service layer with dependency injection
  Recommendation: Follow this structure for AuthService

---

🔗 Related Work & Context

Previous Related Tasks:
- 3 weeks ago: "Add user registration"
  Relevance: Registration and auth are tightly coupled
  Lesson: Used BCrypt for password hashing successfully
  Recommendation: Continue using BCrypt for consistency

Affected Areas (will need updates):
- UserController.cs - Will need auth middleware
- API routes - Will need protection
- Frontend - Will need login UI

---

🚨 Proactive Warnings

💡 COMMON MISTAKES TO AVOID:

- 90% of developers forget: Password reset functionality
  Frequency: Initial implementations often skip this
  Impact: Users get locked out, support tickets flood in
  Prevention: Plan password reset flow NOW (not later)

- 85% of developers forget: Email verification
  Frequency: Often added as afterthought
  Impact: Spam accounts, fake users, unverified emails
  Prevention: Design email verification from the start

- 75% miss: Two-factor authentication consideration
  Frequency: Rarely planned initially
  Impact: Adding 2FA later requires refactoring
  Prevention: Design auth system with 2FA in mind

---

⏭️  Recommended Next Steps

After implementing authentication, you'll likely need:

🔴 Immediate (Required - P0):
1. Authorization Middleware
   Why: 100% of projects need this (control access to resources)
   Effort: Medium (~5 hours)
   When: Immediately after authentication

2. Password Validation Rules
   Why: Enforce strong passwords (security requirement)
   Effort: Low (~2 hours)
   When: Part of authentication implementation

🟡 Short-term (Highly Recommended - P1):
3. Password Reset Flow
   Why: 90% of projects need this (users forget passwords)
   Benefit: Self-service recovery, reduce support load
   Effort: Medium (~6 hours)
   When: Within same sprint

4. Email Verification
   Why: 85% of projects add this (prevent spam accounts)
   Benefit: Verify email ownership, reduce fake accounts
   Effort: Medium (~5 hours)
   When: This sprint or next

5. Rate Limiting
   Why: 80% of secure APIs have this (prevent brute force)
   Benefit: Security against password guessing attacks
   Effort: Low (~3 hours)
   When: Before production deployment

🟢 Long-term (Nice to Have - P2):
6. Two-Factor Authentication
   Why: 60% of security-conscious apps add this eventually
   Benefit: Additional security layer
   Effort: High (~8 hours)
   When: Future enhancement

---

📊 SCOPE OPTIONS:

Option A: Focused (~6 hours)
- Just basic JWT authentication
- Risk: Missing critical security features, rework needed later
- Use when: Prototype or MVP only

Option B: Balanced (~15 hours) ⭐ RECOMMENDED
- Authentication + Authorization + Password validation + Rate limiting
- Benefit: Complete core security, production-ready
- Use when: Building for production

Option C: Comprehensive (~28 hours)
- Everything in Balanced + Password reset + Email verification + 2FA ready
- Benefit: Fully-featured auth system, best security
- Use when: Enterprise application or high-security requirements

---

RECOMMENDATION:

Based on this analysis, I recommend Option B (Balanced).

Authentication alone (Option A) leaves critical security gaps:
- No rate limiting = brute force vulnerability
- No authorization = can't protect resources
- Missing password validation = weak passwords

Option B delivers production-ready security in reasonable time.
You can add password reset and email verification in next iteration.

Option C is best for high-security needs but takes 2x longer.

---

How would you like to proceed?
- `focused` - Just basic auth (~6 hours) - RISKY
- `balanced` - Production-ready security (~15 hours) ⭐ RECOMMENDED
- `comprehensive` - Full auth system (~28 hours) - BEST SECURITY
- `explain` - Tell me more about the risks or options

[Waiting for your choice...]
```

---

## Demo 2: Database Migration

### User Input:
```
/prompt-hybrid Refactor user table schema in production database
```

### Expected Output:

```
🔮 PREDICTIVE INTELLIGENCE ANALYSIS

Journey Stage: REFACTORING

You are restructuring existing code. This requires EXTRA CAUTION
as changes can break current functionality.

---

⚠️  Domain Risks & Security

Risk Level: CRITICAL

🚨 CRITICAL WARNINGS - Address Before Proceeding:

- Database Schema Change Risk
  Risk: Schema changes can cause data loss or service outage
  Impact: Data loss, downtime, application crashes
  Prevention:
    1. BACKUP database FIRST (non-negotiable)
    2. Write migration + rollback scripts
    3. Test on staging environment
    4. Plan maintenance window OR zero-downtime migration
  Priority: P0

- Breaking Change Impact
  Risk: Found 12 services depending on user table
  Impact: Service disruption across entire system
  Prevention:
    1. Coordinate with affected teams
    2. Use /prompt-research for comprehensive impact analysis
    3. Plan phased migration
  Priority: P0

- Production Environment Risk
  Risk: Changes to production data are irreversible
  Impact: Potential data corruption, user-facing errors
  Prevention:
    1. Test migration on copy of production data
    2. Have rollback plan ready
    3. Monitor during migration
  Priority: P0

---

🔗 Related Work & Context

Previous Related Tasks:
- 2 weeks ago: "Add email column to user table"
  Relevance: Similar database migration
  Lesson: Migration had rollback issue, required manual fix
  WARNING: Learn from this - test rollback thoroughly this time

Affected Areas (12 dependent services):
- AuthService - Queries user table for authentication
- UserProfileService - Manages user data
- OrderService - References user_id foreign key
- NotificationService - Sends emails to users
- AnalyticsService - Aggregates user data
- AdminDashboard - Displays user information
- [+6 more services]

---

🚨 Proactive Warnings

🚨 CRITICAL - Must Address:

- No Backup Mentioned
  You haven't mentioned backing up the database
  REQUIRED: Backup before ANY schema changes
  Command: Create full database backup

- Rollback Plan Missing
  Last migration had rollback issues (2 weeks ago)
  REQUIRED: Write AND TEST rollback script
  Lesson: Don't assume rollback will work

- Downtime Not Addressed
  12 services depend on this table
  REQUIRED: Plan for zero-downtime OR maintenance window
  Impact: 1000+ active users affected

---

⏭️  Recommended Next Steps

🔴 IMMEDIATE (REQUIRED - Do BEFORE migration):

1. Create Database Backup
   Why: 100% required before schema changes
   Effort: Low (~30 min)
   When: RIGHT NOW before anything else

2. Write Migration Scripts
   Why: Automated, repeatable, testable
   Effort: Medium (~3 hours)
   When: After backup

3. Write Rollback Scripts
   Why: Must be able to undo changes
   Effort: Medium (~2 hours)
   When: Same time as migration scripts

4. Test on Staging
   Why: Catch issues before production
   Effort: Medium (~4 hours)
   When: After scripts written

5. Coordinate with Teams
   Why: 12 services affected, need coordination
   Effort: Low (~1 hour meetings)
   When: Before scheduling migration

---

📊 SCOPE OPTIONS:

Option A: Quick Migration (~4 hours) ⚠️  HIGH RISK
- Write migration, run it
- Risk: Data loss, no rollback, service outage
- RECOMMENDATION: DO NOT USE THIS

Option B: Safe Migration (~12 hours) ⭐ MINIMUM REQUIRED
- Backup + Migration + Rollback + Staging test
- Benefit: Reversible, tested, safe
- RECOMMENDATION: MINIMUM for production

Option C: Zero-Downtime Migration (~24 hours) 🏆 BEST
- Everything in B + Blue-green deployment + Gradual rollout
- Benefit: No service interruption, safest approach
- RECOMMENDATION: Best for production with active users

---

CRITICAL RECOMMENDATION:

Given the context:
- Production environment (high risk)
- 12 dependent services (high impact)
- Previous migration had issues (lessons to apply)
- 1000+ active users (downtime unacceptable)

I STRONGLY RECOMMEND Option C (Zero-Downtime Migration).

Option A is DANGEROUS - do not use.
Option B is MINIMUM ACCEPTABLE for production.
Option C is BEST PRACTICE for your situation.

---

NEXT STEP RECOMMENDATION:

STOP and use /prompt-research for comprehensive impact analysis.

This command will:
- Analyze all 12 dependent services
- Identify exact dependencies on user table
- Find potential breaking changes
- Suggest migration strategy
- Estimate true scope

Duration: ~2 minutes for research
Benefit: Prevents disaster, ensures complete planning

Run research first? (yes/no)
```

---

## Demo 3: Simple Task (LITE Predictive Intelligence)

### User Input:
```
/prompt Fix typo in README.md
```

### Expected Output:

```
Phase 0: Prompt Perfection

Detected Language: English
Prompt Type: Bug Fix
Core Intent: Fix documentation typo

Complexity Score: 0
Category: Simple

🔮 PREDICTIVE INTELLIGENCE (Lite)

Journey Stage: IMPLEMENTING (simple fix)

💡 Quick Tip:
While fixing the typo, consider:
- Check for other typos in same file
- Verify links still work
- Update last-modified date if present

⏭️  Quick Followup:
After fixing README:
- Commit with clear message
- Consider reviewing other docs for typos

---

Perfected Prompt:

Goal: Fix typo in README.md

Context: Documentation update
Scope: README.md file only
Requirements:
1. Correct spelling/grammar error
2. Maintain formatting
Expected Result: README.md with typo fixed

Approve? (y/n)
```

---

## Key Differences by Command

### /prompt-hybrid (FULL)
- All 6 predictive intelligence steps
- Comprehensive analysis
- Best for complex tasks

### /prompt-technical (FULL)
- Same as hybrid
- Technical focus
- Implementation planning

### /prompt (LITE)
- Warnings + Next steps only
- Quick tips
- Simple tasks

### /prompt-research (CUSTOM)
- Predictive scoping
- Research strategy
- Comprehensive analysis

---

## Configuration

**Location:** `.claude/config/predictive-intelligence.json`

**Enable/Disable:**
```json
{
  "enabled": true  // Set to false to disable
}
```

---

## More Examples

See `.claude/docs/predictive-intelligence-integration-guide.md` for:
- More detailed examples
- Configuration options
- Integration instructions
- Troubleshooting

---

**Predictive Intelligence: Experience the difference between reactive and proactive development.**
