# Next-Steps Predictor

**Version:** 1.0.0
**Purpose:** Predict logical followup tasks and dependencies
**Part of:** Predictive Intelligence System (Phase 0.15.6)

---

## Overview

The Next-Steps Predictor forecasts what users will need AFTER completing their current task, helping them:
- Build complete features (not partial implementations)
- Plan comprehensive solutions
- Avoid forgetting critical dependencies
- Understand the full scope upfront

**Philosophy:** Help users see the complete picture, not just the immediate task

---

## Prediction Categories

### Category 1: Required Followups (P0)

**Definition:** Tasks that are ALWAYS needed after the current task

**Characteristics:**
- 90-100% of projects need this
- System won't work correctly without it
- Obvious next step in logical sequence

**Examples:**

```
Current: "Implement user registration"
Required Followups:
  - Login functionality (100% need this)
  - Email verification (95% need this)
  - Password validation (100% need this)

Current: "Add database model"
Required Followups:
  - Database migration script (100% need this)
  - Model validation rules (95% need this)

Current: "Create API endpoint"
Required Followups:
  - Input validation (100% need this)
  - Error handling (100% need this)
```

---

### Category 2: Highly Recommended Followups (P1)

**Definition:** Tasks that most projects need but not strictly required

**Characteristics:**
- 70-90% of projects implement this
- Significantly improves quality/UX
- Common source of regret if skipped

**Examples:**

```
Current: "Implement authentication"
Highly Recommended:
  - Password reset flow (90% need this)
  - Rate limiting (85% need this)
  - Session management (90% need this)
  - Two-factor authentication (60% eventually add)

Current: "Add payment processing"
Highly Recommended:
  - Refund handling (85% need this)
  - Invoice generation (75% need this)
  - Payment history (80% need this)
```

---

### Category 3: Nice-to-Have Followups (P2)

**Definition:** Tasks that enhance the feature but not critical

**Characteristics:**
- 40-70% of projects add this
- Improves UX or provides convenience
- Can be deferred to later

**Examples:**

```
Current: "Implement user registration"
Nice-to-Have:
  - Social media login (50% add)
  - Profile picture upload (60% add)
  - Account deletion (40% add eventually)

Current: "Add search functionality"
Nice-to-Have:
  - Search filters (65% add)
  - Search history (45% add)
  - Autocomplete (70% add)
```

---

### Category 4: Future Enhancements (P3)

**Definition:** Tasks that are natural extensions but can wait

**Characteristics:**
- 10-40% of projects eventually add
- Valuable but not immediate priority
- Good to know about for planning

**Examples:**

```
Current: "Basic user profile"
Future Enhancements:
  - Profile customization themes (20% add)
  - Profile sharing (15% add)
  - Profile badges/achievements (10% add)
```

---

## Followup Database

**Configuration:** `.claude/config/predictive-intelligence.json` → `common_followups`

**Structure:**

```json
{
  "task_category": [
    {
      "task": "followup_task_name",
      "reason": "Why this is needed",
      "priority": "P0/P1/P2/P3",
      "typical_percentage": 90,
      "estimated_effort": "Low/Medium/High",
      "timing": "Immediate/Short-term/Long-term",
      "dependencies": ["prerequisite_tasks"]
    }
  ]
}
```

**Example:**

```json
{
  "user_registration": [
    {
      "task": "email_verification",
      "reason": "Prevent spam accounts, verify email ownership",
      "priority": "P1",
      "typical_percentage": 95,
      "estimated_effort": "Medium",
      "timing": "Immediate",
      "dependencies": ["email_service"]
    },
    {
      "task": "login_functionality",
      "reason": "Users need to sign in after registration",
      "priority": "P0",
      "typical_percentage": 100,
      "estimated_effort": "Medium",
      "timing": "Immediate",
      "dependencies": ["session_management"]
    }
  ]
}
```

---

## Prediction Algorithm

### Step 1: Categorize Current Task

```
task_category = categorize_task(user_prompt)

Categories:
  - user_registration
  - authentication
  - authorization
  - payment_processing
  - api_endpoint
  - database_model
  - caching_layer
  - search_functionality
  - file_upload
  - notification_system
  ... etc
```

### Step 2: Load Followup Rules

```
followups = load_followups_for_category(task_category)

IF no exact match:
  followups = infer_followups_from_keywords(user_prompt)
```

### Step 3: Filter by Relevance

```
relevant_followups = []

FOR EACH followup IN followups:
  # Skip if already mentioned in prompt
  IF mentioned_in_prompt(followup.task):
    CONTINUE

  # Skip if context suggests it's not needed
  IF context_suggests_skip(followup, user_context):
    CONTINUE

  # Add if relevant
  relevant_followups.append(followup)
```

### Step 4: Prioritize and Group

```
grouped_followups = {
  required: filter(priority == "P0"),
  highly_recommended: filter(priority == "P1"),
  nice_to_have: filter(priority == "P2"),
  future: filter(priority == "P3")
}

# Limit to avoid overwhelming
LIMIT required TO 3
LIMIT highly_recommended TO 3
LIMIT nice_to_have TO 2
LIMIT future TO 2
```

### Step 5: Calculate Scope Options

```
Option A: Current task only
  - Tasks: [current]
  - Effort: estimate_effort(current)

Option B: Current + Required followups
  - Tasks: [current] + required
  - Effort: sum(estimate_effort(tasks))

Option C: Comprehensive (Current + Required + Recommended)
  - Tasks: [current] + required + highly_recommended
  - Effort: sum(estimate_effort(tasks))

RECOMMEND based on:
  - User's stated timeline
  - Task complexity
  - Risk level
```

---

## Effort Estimation

**Effort Levels:**

```
Low effort: 1-3 hours
  - Simple configuration changes
  - Adding validation rules
  - Writing tests for small functions

Medium effort: 4-8 hours
  - New API endpoints
  - Database migrations
  - Integration with third-party service

High effort: 1-3 days
  - Complex feature implementation
  - System refactoring
  - Security audit and remediation

Very High effort: 4+ days
  - Major architectural changes
  - Comprehensive security overhaul
  - Large-scale refactoring
```

**Estimation Formula:**

```
total_effort = base_effort(current_task)

FOR EACH followup:
  IF followup.priority == "P0":
    total_effort += followup.effort
  ELSE IF followup.priority == "P1":
    total_effort += (followup.effort * 0.8)  # Can cut some corners
  ELSE:
    total_effort += (followup.effort * 0.5)  # Optional, faster impl

RETURN total_effort
```

---

## Output Template

```markdown
## ⏭️  RECOMMENDED NEXT STEPS

After implementing **[current task]**, you'll likely need:

### 🔴 Immediate (Required - P0):

1. **[Task Name]**
   - **Why:** [Reason this is needed]
   - **Impact if skipped:** [Consequence]
   - **Effort:** [Low/Medium/High] (~[X] hours)
   - **When:** [Immediately / Before deployment]

[Repeat for each P0 task]

### 🟡 Short-term (Highly Recommended - P1):

2. **[Task Name]**
   - **Why:** [X%] of projects need this
   - **Benefit:** [What it provides]
   - **Effort:** [Low/Medium/High] (~[X] hours)
   - **When:** [This sprint / Within 2 weeks]

[Repeat for each P1 task]

### 🟢 Long-term (Nice to Have - P2):

3. **[Task Name]**
   - **Benefit:** [What it provides]
   - **Usage:** [X%] of projects eventually add this
   - **Effort:** [Low/Medium/High]
   - **When:** [Future milestone]

[Repeat for each P2 task]

---

## 📊 SCOPE OPTIONS:

**Option A: Focused Approach**
- Implement: [Current task only]
- Effort: ~[X] hours
- Risk: May need to add followups later (more rework)

**Option B: Balanced Approach** ⭐ RECOMMENDED
- Implement: [Current + Required followups]
- Effort: ~[Y] hours
- Benefit: Complete core functionality, no critical gaps

**Option C: Comprehensive Approach**
- Implement: [Current + Required + Recommended]
- Effort: ~[Z] hours
- Benefit: Fully-featured implementation, best UX

---

**RECOMMENDATION:**

[IF high risk OR many P0 followups]:
I recommend **Option B** (Balanced). [Current task] has several
critical dependencies. Implementing them together avoids rework
and ensures a complete, working solution.

[IF low risk AND few followups]:
**Option A** (Focused) is fine for now. You can add [followups]
later if needed. The gaps are not critical.

[IF complex feature]:
Consider **Option C** (Comprehensive) if you want a complete
[feature] system. This delivers better UX and fewer surprises.

---

**How would you like to proceed?**
- `focused` - Just [current task] (~[X] hours)
- `balanced` - [Current + Required] (~[Y] hours) ⭐ Recommended
- `comprehensive` - Complete [feature] (~[Z] hours)
- `explain` - Tell me more about the followups
```

---

## Context-Aware Predictions

**Adjust predictions based on user context:**

### User Explicitly States Timeline

```
IF user says "quick prototype":
  - Reduce recommended followups
  - Focus on P0 only
  - Suggest: "For quick prototype, just implement [current].
              Add [followups] when productionizing."

IF user says "production ready":
  - Include all P0 and P1 followups
  - Emphasize security and robustness
  - Suggest: "For production, I recommend comprehensive approach."
```

### Project Maturity

```
IF project is new/early stage:
  - Suggest building complete features
  - Avoid technical debt from partial implementations
  - Recommend: Balanced or Comprehensive

IF project is mature:
  - Respect existing patterns
  - Suggest incremental additions
  - Recommend: Focused, then iterate
```

### Risk Level

```
IF task is security-critical:
  - Emphasize P0 followups
  - Highlight security implications
  - Recommend: Don't skip required tasks

IF task is low-risk:
  - Allow more flexibility
  - Suggest phased approach
  - Recommend: Ship and iterate
```

---

## Dependency Detection

**Identify prerequisite tasks:**

```
FOR EACH followup:
  dependencies = followup.dependencies

  FOR EACH dependency:
    IF NOT already_implemented(dependency):
      WARN: "Before [followup], you need [dependency]"
      SUGGEST: Add dependency to plan

EXAMPLE:
  Followup: "Email verification"
  Dependency: "Email service"
  Warning: "Email verification requires email service.
            Should I help you set up email service first?"
```

**Dependency Chain Example:**

```
Current: Add user registration

Detected chain:
1. User registration (current)
   ↓ requires
2. Email service (dependency)
   ↓ enables
3. Email verification (followup)
   ↓ requires
4. Email templates (dependency)

Recommendation: Plan email service setup as prerequisite
```

---

## Learning from History

**If session history available:**

```
IF user has done similar task before:
  previous_followups = get_actual_followups_from_history(similar_task)

  IF previous_followups DIFFERS FROM predicted_followups:
    LEARN: User's pattern for this type of task
    SUGGEST: "Last time you did [similar], you also added [X].
              Should I include that this time?"
```

**Example:**

```
Current: "Add payment processing"

History: 3 months ago - "Add subscription payments"
User added: Payment, Refunds, Invoices, Email receipts

Prediction enhanced:
  "When you added subscriptions, you also implemented refunds,
   invoices, and email receipts. Should I plan those for payment
   processing too?"
```

---

## Integration Example

**In Phase 0.15.6 (Next-Steps Prediction step):**

```markdown
## Step 0.15.6: Next-Steps Prediction

**Import:** Use Next-Steps Predictor from `.claude/library/intelligence/next-steps-predictor.md`

**Process:**
1. Categorize current task
2. Load followup rules
3. Filter by relevance
4. Prioritize and group
5. Calculate scope options
6. Generate recommendations

**Output:** [Formatted next-steps as specified in template]
```

---

## Configuration

### Prediction Thresholds

```json
{
  "min_percentage_to_suggest": 70,
  "max_followups_per_priority": {
    "P0": 3,
    "P1": 3,
    "P2": 2,
    "P3": 2
  },
  "show_effort_estimates": true,
  "show_percentage_stats": true
}
```

---

## Benefits

✅ **Complete features** - Don't build half-solutions
✅ **Better planning** - Know full scope upfront
✅ **Avoid regret** - Don't forget critical tasks
✅ **Faster delivery** - Build it right the first time
✅ **Better UX** - Comprehensive functionality

---

## Examples

### Example 1: User Registration

**Current Task:** "Implement user registration"

**Predicted Next Steps:**
```
⏭️  RECOMMENDED NEXT STEPS

🔴 Immediate (Required):
1. Login Functionality
   Why: 100% of projects need this (users must sign in)
   Effort: Medium (~6 hours)

2. Password Validation
   Why: Security requirement, prevent weak passwords
   Effort: Low (~2 hours)

🟡 Short-term (Highly Recommended):
3. Email Verification
   Why: 95% of projects add this (prevent spam)
   Benefit: Verify email ownership, reduce fake accounts
   Effort: Medium (~5 hours)

4. Password Reset Flow
   Why: 90% of projects need this (users forget passwords)
   Benefit: Self-service recovery, reduce support load
   Effort: Medium (~6 hours)

📊 SCOPE OPTIONS:
- Focused: Just registration (~4 hours)
- Balanced: Registration + Login + Validation (~12 hours) ⭐
- Comprehensive: Complete auth system (~23 hours)

RECOMMENDATION: Option B (Balanced)
Registration alone isn't useful - users can't sign in.
Login + validation creates complete registration flow.
Add email verification and password reset in next iteration.
```

---

### Example 2: Payment Processing

**Current Task:** "Add payment processing with Stripe"

**Predicted Next Steps:**
```
⏭️  RECOMMENDED NEXT STEPS

🔴 Immediate (Required):
1. Idempotency Key Implementation
   Why: CRITICAL - Prevents duplicate charges on retry
   Impact if skipped: Users charged multiple times
   Effort: Low (~3 hours)

2. Webhook Signature Verification
   Why: CRITICAL - Security (prevent webhook spoofing)
   Impact if skipped: Fake payment confirmations accepted
   Effort: Medium (~4 hours)

🟡 Short-term (Highly Recommended):
3. Refund Handling
   Why: 85% need this (refunds will be requested)
   Benefit: Process refunds without manual intervention
   Effort: Medium (~6 hours)

4. Payment Failure Handling
   Why: 80% need robust error handling
   Benefit: Graceful failure UX, retry logic
   Effort: Medium (~5 hours)

5. Invoice Generation
   Why: 75% of businesses need receipts
   Benefit: Automatic receipts, tax compliance
   Effort: Medium (~6 hours)

🚨 CRITICAL WARNING:
Payment processing has HIGH security and compliance requirements.
Skipping required followups creates liability.

📊 SCOPE OPTIONS:
- Focused: Just payment (~5 hours) - RISKY
- Balanced: Payment + Security + Refunds (~18 hours) ⭐ RECOMMENDED
- Comprehensive: Complete payment system (~30 hours)

RECOMMENDATION: Option B (Balanced) MINIMUM
Option A is too risky - missing critical security.
Idempotency and webhooks are non-negotiable for payments.
Refunds are 85% likely to be needed - build now, not later.
```

---

## Version History

**v1.0.0 (2026-01-01):**
- Initial release
- Followup prediction algorithm
- Priority-based grouping
- Scope options generation
- Effort estimation
- Dependency detection

---

**Related Files:**
- Core: `.claude/library/intelligence/predictive-intelligence-core.md`
- Relationship Mapper: `.claude/library/intelligence/relationship-mapper.md`
- Warning System: `.claude/library/intelligence/warning-system.md`
- Configuration: `.claude/config/predictive-intelligence.json`
