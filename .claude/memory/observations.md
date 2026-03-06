# Skill Observations

**Purpose:** Store pending skill improvement observations from `/reflect` sessions for later review.

**Last Updated:** 2026-01-05

---

## How This Works

When `/reflect` proposes changes and the user declines to apply them immediately, observations are saved here for later review.

**Workflow:**
1. Run `/reflect [skill]` after using a skill
2. Review proposed changes
3. If declined, choose to save observations here
4. Review observations periodically
5. Apply changes when ready

---

## Observation Format

```
## Observation: [date] - [skill-name]

Status: PENDING REVIEW | APPLIED | DISMISSED

**Signals Detected:**
- Corrections: [count]
- Successes: [count]
- Edge Cases: [count]

**Findings:**
[PRIORITY] [finding description]
           Evidence: "[quote]"
           Proposed: [specific change]

**User Decision:** [Declined - saved for review / Applied later / Dismissed]
**Applied Date:** [date if applied]
```

---

## Pending Observations

*No pending observations yet. Run `/reflect [skill]` after a session to generate observations.*

---

## Applied Observations

*Observations that were later applied will be moved here with their application date.*

---

## Dismissed Observations

*Observations that were reviewed and dismissed will be moved here with reasoning.*

---

## Statistics

**Total Observations:** 0
**Pending:** 0
**Applied:** 0
**Dismissed:** 0

**Most Common Signal Types:**
- Corrections: 0
- Successes: 0
- Edge Cases: 0
- Preferences: 0

---

## Configuration

This file is managed by the `/reflect` command.

**Settings:** `.claude/config/learning-config.json`

```json
{
  "reflection_analysis": {
    "observation_storage": ".claude/memory/observations.md"
  }
}
```

---

## Related Files

- `.claude/commands/reflect.md` - The reflect command
- `.claude/library/intelligence/reflection-analyzer.md` - Analysis logic
- `.claude/memory/prompt-patterns.md` - Applied patterns
- `.claude/config/learning-config.json` - Configuration
