# Reflection Analyzer - Intelligence Component

**Version:** 1.0.0
**Purpose:** Analyze conversation signals to detect corrections, successes, edge cases, and preferences for skill improvement.

---

## Overview

The Reflection Analyzer transforms passive conversation history into actionable skill improvements by detecting patterns in user feedback.

**Key Capabilities:**
- Signal detection across 4 categories
- Confidence scoring for each finding
- Priority classification (HIGH/MED/LOW)
- Evidence extraction with quotes
- Change proposal generation

---

## Signal Detection Engine

### Category 1: Corrections (HIGH Confidence)

**Detection Patterns:**

```regex
# Explicit negation
/\b(no|nope|wrong|incorrect)\b/i

# Clarification indicators
/\b(I meant|I wanted|I need|actually|instead|rather)\b/i

# Correction requests
/\b(change|fix|update|modify|adjust)\s+(that|this|it)\b/i

# Dissatisfaction
/\b(not (what|like|right)|that's not|doesn't work)\b/i

# Repetition with different wording
# (same intent, different phrasing within 3 messages)
```

**Confidence Score:** 0.85 - 0.95

**Evidence Extraction:**
- Capture the corrected request
- Capture what was wrong
- Capture the desired outcome

**Example:**
```
User: "No, I meant a dark theme, not light"
Signal: CORRECTION
Confidence: 0.92
Evidence: "I meant a dark theme, not light"
Proposed: Add constraint "Default to dark theme unless specified"
```

---

### Category 2: Successes (MEDIUM Confidence)

**Detection Patterns:**

```regex
# Explicit approval
/\b(perfect|great|excellent|awesome|nice|good)\b/i

# Agreement
/\b(yes|yeah|yep|correct|exactly|right)\b/i

# Gratitude (indicates satisfaction)
/\b(thanks|thank you|appreciate)\b/i

# Continuation signals
/\b(proceed|continue|go ahead|let's do|sounds good)\b/i

# Building on output (user extends rather than corrects)
# (detected by user adding to output rather than changing it)
```

**Confidence Score:** 0.65 - 0.80

**Evidence Extraction:**
- Capture the approved output
- Capture what made it successful
- Note any patterns in successful outputs

**Example:**
```
User: "Perfect, exactly what I needed"
Signal: SUCCESS
Confidence: 0.78
Evidence: "exactly what I needed"
Pattern: User prefers concise, actionable outputs
```

---

### Category 3: Edge Cases (MEDIUM Confidence)

**Detection Patterns:**

```regex
# Feature requests
/\b(can you (also|add)|what about|is there a way)\b/i

# Missing functionality
/\b(doesn't (handle|support)|missing|no option for)\b/i

# Workaround indicators
/\b(had to|worked around|manually)\b/i

# Unexpected scenarios
/\b(what if|edge case|special case|exception)\b/i

# Confusion indicators
/\b(confused|unclear|not sure how)\b/i
```

**Confidence Score:** 0.55 - 0.70

**Evidence Extraction:**
- Capture the edge case scenario
- Capture what was missing
- Capture any workaround used

**Example:**
```
User: "What about multi-language prompts?"
Signal: EDGE_CASE
Confidence: 0.62
Evidence: "multi-language prompts"
Gap: Language detection not implemented
```

---

### Category 4: Preferences (ACCUMULATIVE)

**Detection Patterns:**

```regex
# Explicit preferences
/\b(I (prefer|like|want)|always use|usually)\b/i

# Repeated choices (same option chosen 2+ times)
# (tracked across conversation and sessions)

# Style indicators
/\b(style|format|approach|way)\b/i

# Tool/framework mentions
/\b(using|with|in)\s+[A-Z][a-z]+/  # Proper nouns (tools)

# Implicit preferences (choices without explanation)
# (consistent patterns in user selections)
```

**Confidence Score:** 0.45 - 0.65 (increases with repetition)

**Evidence Extraction:**
- Capture the preference
- Count occurrences
- Note context of each occurrence

**Example:**
```
User choices: Grid (3x), Flexbox (0x)
Signal: PREFERENCE
Confidence: 0.58
Evidence: "Chose CSS Grid consistently"
Pattern: Prefer Grid for layouts
```

---

## Analysis Pipeline

### Step 1: Message Collection

```
Collect all messages from current conversation:
- User messages
- Assistant responses
- Tool results (for context)

Exclude:
- System messages
- Empty messages
- Pure acknowledgments ("ok", "done")
```

### Step 2: Signal Scanning

```
For each user message:
  1. Apply correction patterns → mark as CORRECTION if match
  2. Apply success patterns → mark as SUCCESS if match
  3. Apply edge case patterns → mark as EDGE_CASE if match
  4. Apply preference patterns → mark as PREFERENCE if match
  5. Calculate confidence based on pattern strength
  6. Extract evidence (surrounding context)
```

### Step 3: Aggregation

```
Group signals by type:
  corrections = [signal1, signal2, ...]
  successes = [signal1, signal2, ...]
  edge_cases = [signal1, signal2, ...]
  preferences = [signal1, signal2, ...]

For each group:
  - Deduplicate similar signals
  - Merge related evidence
  - Calculate aggregate confidence
```

### Step 4: Priority Classification

```
Priority rules:
  HIGH:
    - Any CORRECTION with confidence > 0.8
    - EDGE_CASE that caused visible problem
    - PREFERENCE appearing 3+ times

  MEDIUM:
    - SUCCESS patterns worth preserving
    - EDGE_CASE without workaround
    - PREFERENCE appearing 2 times

  LOW:
    - Single occurrence observations
    - Weak confidence signals
    - Contextual notes
```

### Step 5: Change Generation

```
For each HIGH/MEDIUM signal:
  1. Identify affected skill section
  2. Generate specific change proposal
  3. Format with evidence
  4. Include rollback guidance

Output format:
  [PRIORITY] + Action: "specific change"
              Category: [section in skill]
              Evidence: "quote"
              Rollback: "how to undo"
```

---

## Confidence Calculation

### Base Confidence

```
Pattern match strength:
  - Exact keyword match: +0.3
  - Phrase match: +0.4
  - Context supports: +0.2
  - Repetition (per occurrence): +0.1
```

### Modifiers

```
Increase confidence:
  - Explicit user statement: +0.15
  - Multiple supporting signals: +0.1 per signal
  - Recent occurrence (last 5 messages): +0.1

Decrease confidence:
  - Ambiguous context: -0.1
  - Contradicting signals: -0.2
  - Old occurrence (> 20 messages ago): -0.1
```

### Thresholds

```
Report threshold by type:
  CORRECTION: 0.6 (lower = report more corrections)
  SUCCESS: 0.5 (moderate threshold)
  EDGE_CASE: 0.4 (lower = catch more edge cases)
  PREFERENCE: 0.4 (needs accumulation to matter)
```

---

## Output Format

### Analysis Summary

```
REFLECTION ANALYSIS
===================

Skill: [skill-name]
Messages Analyzed: [count]
Session Duration: [time if available]

SIGNALS DETECTED:
-----------------
Corrections: [count] (avg confidence: [X])
Successes: [count] (avg confidence: [X])
Edge Cases: [count] (avg confidence: [X])
Preferences: [count] (avg confidence: [X])
```

### Detailed Findings

```
FINDINGS:
---------

[HIGH] CORRECTION #1
  Signal: User rejected dark theme suggestion
  Evidence: "no, use light theme for this project"
  Confidence: 0.91
  Proposed: Add question "Theme preference?" to Phase 0
  Category: Questions/Clarification
  Affected: prompt-hybrid.md lines 45-60

[MED] PREFERENCE #1
  Signal: Consistent choice of TypeScript
  Evidence: Chose TS 3/3 times when offered
  Confidence: 0.72
  Proposed: Default to TypeScript for new projects
  Category: Smart Defaults
  Affected: prompt-technical.md lines 120-135

[LOW] EDGE_CASE #1
  Signal: Multi-repo scenario not handled
  Evidence: "what about monorepo structures?"
  Confidence: 0.58
  Proposed: Note for review - consider monorepo support
  Category: Future Enhancement
  Affected: N/A (new feature)
```

### Change Proposals

```
PROPOSED CHANGES:
-----------------

1. [HIGH] prompt-hybrid.md
   Section: Phase 0 Questions
   Action: ADD question about theme preference
   Change: "Add '5. Theme preference? (light/dark/system)' after line 58"

2. [MED] prompt-technical.md
   Section: Smart Defaults
   Action: UPDATE default language
   Change: "Set default_language: 'typescript' in config"

3. [LOW] observations.md
   Section: Future Enhancements
   Action: APPEND note
   Change: "Add monorepo structure handling to backlog"
```

---

## Integration Points

### Memory System

**Read from:**
- `.claude/memory/prompt-patterns.md` - Historical patterns
- `.claude/memory/sessions.md` - Previous session context

**Write to:**
- `.claude/memory/prompt-patterns.md` - New patterns
- `.claude/memory/observations.md` - Pending observations

### Configuration

**Read from:**
- `.claude/config/learning-config.json` - Thresholds, settings

**Settings used:**
```json
{
  "reflection_analysis": {
    "min_signals_to_report": 2,
    "confidence_thresholds": {
      "correction": 0.6,
      "success": 0.5,
      "edge_case": 0.4,
      "preference": 0.4
    },
    "accumulation_window": 5,
    "max_proposals_per_priority": 5
  }
}
```

### Skill Files

**Target locations:**
- `.claude/commands/[skill].md` - Direct skill modifications
- `.claude/library/adapters/[adapter].md` - Shared behavior changes
- `.claude/config/*.json` - Configuration updates

---

## Error Handling

### No Signals Found

```
If total_signals < min_signals_to_report:
  Output: "Insufficient signals detected ([count] found, [min] required).
           Try /reflect after more interaction with the skill."
  Exit: SKIP_ANALYSIS
```

### Conflicting Signals

```
If CORRECTION and SUCCESS for same topic:
  Priority: CORRECTION (user corrected after initial success)
  Note: "Conflicting signals detected - correction takes precedence"
```

### Invalid Skill

```
If skill file not found:
  Output: "Skill '[name]' not found in .claude/commands/"
  Suggest: List available skills
  Exit: ERROR
```

---

## Best Practices

1. **Run after meaningful sessions** - Need enough interaction for signals
2. **Focus on one skill at a time** - Better analysis quality
3. **Review LOW items periodically** - May become patterns
4. **Apply HIGH items promptly** - Direct user feedback
5. **Track preference accumulation** - Confidence grows over time

---

## Version History

**v1.0.0 (2026-01-05):**
- Initial release
- 4 signal categories
- Confidence scoring
- Priority classification
- Memory integration

---

## Related Components

- `/reflect` command - User interface
- `learning-config.json` - Configuration
- `prompt-patterns.md` - Pattern storage
- `observations.md` - Observation storage
