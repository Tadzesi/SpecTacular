# /reflect - Skill Reflection and Improvement

Analyze the current session and propose improvements to skills based on conversation signals (corrections, successes, edge cases, and preferences).

**Purpose:** Transform passive pattern tracking into active skill improvement by detecting what worked, what didn't, and proposing specific changes.

---

## Trigger

Run `/reflect` or `/reflect [skill-name]` after a session where you used a skill to capture learnings.

**Common triggers:**
- "reflect"
- "improve skill"
- "learn from this"
- End of skill-heavy sessions

---

## Workflow

### Step 1: Identify the Skill

**If skill name not provided, ask:**

```
Which skill should I analyze this session for?
- prompt
- prompt-hybrid
- prompt-technical
- prompt-research
- prompt-article
- session-end
- [other]
```

**Wait for user response.**

---

### Step 2: Analyze the Conversation

**Import:** `.claude/library/intelligence/reflection-analyzer.md`

Look for these signals in the current conversation:

#### Signal Categories

**Corrections (HIGH confidence):**
- User said "no", "not like that", "I meant..."
- User explicitly corrected output
- User asked for changes immediately after generation
- User rejected a suggestion
- User had to repeat a request differently

**Successes (MEDIUM confidence):**
- User said "perfect", "great", "yes", "exactly"
- User accepted output without modification
- User built on top of the output
- User proceeded with suggested approach
- No corrections needed

**Edge Cases (MEDIUM confidence):**
- Questions the skill didn't anticipate
- Scenarios requiring workarounds
- Features user asked for that weren't covered
- Unexpected inputs that caused issues
- Missing options or choices

**Preferences (accumulate over sessions):**
- Repeated patterns in user choices
- Style preferences shown implicitly
- Tool/framework preferences
- Output format preferences
- Communication style preferences

#### Analysis Process

1. Scan conversation for each signal type
2. Count occurrences with context
3. Extract specific quotes/examples
4. Classify by confidence level
5. Identify patterns across signals

---

### Step 3: Propose Changes

**Present findings using accessible formatting:**

```
Skill Reflection: [skill-name]

Signals: X corrections, Y successes, Z edge cases

Proposed changes:

[HIGH] + Add constraint: "[specific constraint]"
        Category: [Constraints/NEVER/Output Format/etc.]
        Evidence: "[quote from conversation]"

[HIGH] + Add preference: "[specific preference]"
        Category: [Style/Format/Approach/etc.]
        Evidence: "[quote from conversation]"

[MED]  + Add option: "[new option to consider]"
        Category: [Choices/Features/etc.]
        Evidence: "[user request]"

[LOW]  ~ Note for review: "[observation]"
        Category: [Observation/Pattern/etc.]
        Evidence: "[context]"

Commit message: "[skill]: [summary of changes]"
```

**Priority Indicators:**
- [HIGH] - Corrections, explicit user feedback (apply first)
- [MED] - Preferences, repeated patterns (recommend applying)
- [LOW] - Observations, edge cases (review before applying)

---

### Step 4: Confirmation Gate

```
Apply these changes? [Y/n] or describe tweaks

Options:
- Y - Apply changes, commit, and push
- n - Skip this update
- Or describe any tweaks to the proposed changes
```

**Wait for user response.**

---

### Step 5: If Approved

1. **Read current skill file:**
   ```
   Read: .claude/commands/[skill-name].md
   ```

2. **Apply changes using Edit tool:**
   - Add constraints to appropriate section
   - Add preferences to configuration
   - Update documentation if needed

3. **Save observations to pattern memory:**
   ```
   Append to: .claude/memory/prompt-patterns.md

   ## Reflection: [date] - [skill-name]

   **Signals Detected:**
   - Corrections: [count]
   - Successes: [count]
   - Edge Cases: [count]

   **Changes Applied:**
   - [change 1]
   - [change 2]

   **Observations Saved:**
   - [observation 1]
   ```

4. **Confirm completion:**
   ```
   Skill reflection complete.

   Applied:
   - [X] [change 1]
   - [X] [change 2]

   Saved to: .claude/memory/prompt-patterns.md

   The skill will now incorporate these learnings.
   ```

---

### Step 6: If Declined

**Ask:**
```
Would you like to save these observations for later review?
```

**If yes, append to:** `.claude/memory/observations.md`

```
## Observation: [date] - [skill-name]

Status: PENDING REVIEW

**Findings:**
[HIGH] [finding 1]
[MED] [finding 2]
[LOW] [finding 3]

**User Decision:** Declined - saved for review
```

---

## Configuration

**Reference:** `.claude/config/learning-config.json`

```json
{
  "reflection_analysis": {
    "enabled": true,
    "min_signals_to_report": 2,
    "confidence_thresholds": {
      "correction": 0.9,
      "success": 0.7,
      "edge_case": 0.6,
      "preference": 0.5
    },
    "auto_apply_threshold": "HIGH",
    "observation_storage": ".claude/memory/observations.md"
  }
}
```

---

## Example Sessions

### Example 1: Frontend Design Skill

User runs `/reflect frontend-design` after a UI session:

```
Skill Reflection: frontend-design

Signals: 2 corrections, 3 successes

Proposed changes:

[HIGH] + Constraints/NEVER:
        "Use gradients unless explicitly requested"
        Evidence: User said "no gradients" twice

[HIGH] + Color & Theme:
        "Dark backgrounds: use #000, not #1a1a1a"
        Evidence: User corrected color choice

[MED]  + Layout:
        "Prefer CSS Grid for card layouts"
        Evidence: User chose Grid over Flexbox consistently

Commit: "frontend-design: no gradients, #000 dark"

Apply these changes? [Y/n]
```

---

### Example 2: Prompt Hybrid Skill

User runs `/reflect prompt-hybrid` after prompt perfection session:

```
Skill Reflection: prompt-hybrid

Signals: 1 correction, 4 successes, 1 edge case

Proposed changes:

[HIGH] + Question Priority:
        "Always ask about error handling strategy first"
        Evidence: User mentioned this was missing

[MED]  + Output Format:
        "Include estimated complexity score in output"
        Evidence: User asked for this twice

[LOW]  ~ Edge Case Noted:
        "Multi-language prompts need language detection"
        Evidence: User had Slovak/English mixed prompt

Commit: "prompt-hybrid: error handling priority, complexity score"

Apply these changes? [Y/n]
```

---

### Example 3: Session End Skill

User runs `/reflect session-end`:

```
Skill Reflection: session-end

Signals: 0 corrections, 5 successes, 2 edge cases

Proposed changes:

[MED]  + New Section:
        "Add 'Blockers Encountered' section"
        Evidence: User mentioned blockers in 3 sessions

[LOW]  ~ Format Preference:
        "User prefers bullet points over paragraphs"
        Evidence: User reformatted 2 outputs

No HIGH priority changes detected.

Apply these changes? [Y/n]
```

---

## Integration with Learning System

This command integrates with the existing learning infrastructure:

**Memory Files:**
- `.claude/memory/prompt-patterns.md` - Pattern storage
- `.claude/memory/observations.md` - Pending observations

**Configuration:**
- `.claude/config/learning-config.json` - Thresholds and settings

**Library Component:**
- `.claude/library/intelligence/reflection-analyzer.md` - Analysis logic

---

## Signal Detection Patterns

### Correction Patterns

```
Regex patterns for correction detection:
- "no,? (?:not |don't |that's not)"
- "I (?:meant|wanted|need)"
- "(?:change|fix|update) (?:that|this|it)"
- "(?:wrong|incorrect|not right)"
- "(?:actually|instead|rather)"
```

### Success Patterns

```
Regex patterns for success detection:
- "(?:perfect|great|excellent|awesome)"
- "(?:yes|yeah|yep|correct|exactly)"
- "(?:thanks|thank you|looks good)"
- "(?:proceed|continue|go ahead)"
```

### Edge Case Patterns

```
Indicators of edge cases:
- Questions about missing features
- Requests for options not offered
- Workarounds user had to apply
- "Can you also..." / "What about..."
- "Is there a way to..."
```

---

## Important Notes

1. **Always show exact changes before applying**
2. **Never modify skills without explicit user approval**
3. **Commit messages should be concise and descriptive**
4. **Observations accumulate over sessions for pattern detection**
5. **HIGH priority items should be addressed first**
6. **Edge cases may indicate missing functionality**

---

## Troubleshooting

**Issue:** No signals detected
**Solution:** Ensure conversation has actual skill usage, not just planning

**Issue:** Too many LOW priority items
**Solution:** Increase `min_signals_to_report` in config

**Issue:** Changes don't apply correctly
**Solution:** Verify skill file path and section headers

**Issue:** Observations not saving
**Solution:** Check `.claude/memory/` directory exists

---

## Version History

**v1.0 (2026-01-05):**
- Initial release
- Signal detection (corrections, successes, edge cases, preferences)
- Priority-based change proposals
- Integration with learning system
- Observation persistence

---

## Library Integration

This command uses the **Unified Library System:**
- **Core:** `.claude/library/prompt-perfection-core.md` (for consistent flow)
- **Intelligence:** `.claude/library/intelligence/reflection-analyzer.md` (analysis logic)
- **Memory:** `.claude/memory/prompt-patterns.md` (pattern storage)
- **Config:** `.claude/config/learning-config.json` (settings)

---

**Ready to improve your skills? Just type:**
```
/reflect [skill-name]
```
