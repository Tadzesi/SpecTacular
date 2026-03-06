# /prompt-article - Interactive Article Writing Wizard

This command provides an interactive wizard for writing articles in Slovak or English, with configurable types, audiences, styles, and multi-platform output. It first perfects the user's prompt, then guides through the article creation wizard.

---

## Phase 0: Prompt Perfection

**Import:** Use Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Article (from `.claude/library/adapters/article-adapter.md`)

**Before starting the article wizard, first perfect the user's prompt.**

### Step 0.1: Initial Analysis
- Detect language (Slovak / English)
- **Auto-detect prompt type:** Article / Content Creation (smart default for this command)
- Extract the core intent: What article does the user want to create?

### Step 0.2: Completeness Check
Verify the prompt contains:
- [ ] Clear goal/desired outcome (what article to write)
- [ ] Context (topic, background information)
- [ ] Scope (target audience, platform)
- [ ] Constraints (if any: length, tone, deadline)
- [ ] Success criteria (what makes a good article)

Mark missing items - these will be collected in the wizard steps.

### Step 0.3: Clarification (if needed)
- If anything is ambiguous or unclear, ASK before proceeding
- If multiple valid approaches exist:
  - List each option with pros/cons
  - Mark ⭐ recommended option with reasoning
  - Wait for user selection

### Step 0.4: Correction
- Fix grammar, spelling, sentence structure in the topic/title
- Preserve all technical terms, names, and references EXACTLY
- Keep original intent and tone
- Make it clear, specific, and actionable

### Step 0.5: Structure the Perfect Prompt
Transform into an executable format with:
1. **Goal** - What article to create
2. **Topic** - Main subject matter
3. **Context** - Background and key points to cover
4. **Constraints** - Any limitations or requirements
5. **Expected Result** - What the final article should achieve

### Phase 0 Output Format

**Detected Language:** [Slovak / English]
**Prompt Type:** Article / Content Creation *(auto-detected)*

**Original:**
> $ARGUMENTS

**Completeness Check:**
- [x] Goal: [extracted or ✅ auto-filled: "Write an article" - will be collected in wizard]
- [x] Topic: [extracted or ❌ will be collected in wizard]
- [x] Context: [extracted or ✅ auto-filled: "article content" - will be collected in wizard]
- [ ] Constraints: [extracted or ❌ optional]
- [x] Target Audience: [extracted or ❌ will be collected in wizard]

**Smart Defaults Applied:**
- Output format: Article (auto-detected from command type)
- Wizard will collect all missing article-specific parameters

**Perfected Prompt:**
> **Goal:** [one clear sentence about the article]
> **Topic:** [main subject]
> **Key Points:** [if provided]
> **Constraints:** [any limitations, or "None - will configure in wizard"]

**Changes Made:**
- [list of corrections and improvements]

---

⏸️ **Waiting for approval before starting article wizard.** Reply with:
- `y` or `yes` — proceed to article wizard
- `n` or `no` — cancel
- Or type modifications for adjustments

---

## Article Wizard Flow

Guide the user through each step using the AskUserQuestion tool. Do NOT skip steps or assume answers.

---

### Step 1: Language Selection

**Ask the user:**
> What language should the article be written in?

**Options:**
- **English** - International audience, standard formatting
- **Slovak** - Slovak language with proper grammar and diacritics (ä, č, ď, é, í, ĺ, ľ, ň, ó, ô, ŕ, š, ť, ú, ý, ž)

---

### Step 2: Article Type Selection

**Ask the user:**
> What type of article do you want to write?

**Options:**
- **Blog Post** - Conversational, engaging content for company/personal blog
- **LinkedIn Post** - Professional networking content (optimal: 1300-2000 characters)
- **Technical Article** - In-depth technical content with code examples and explanations
- **News Article** - Informative, factual reporting style
- **Tutorial** - Step-by-step instructional guide
- **How-to Guide** - Problem-solution focused practical guide
- **Case Study** - Analysis of a specific project, implementation, or success story
- **Opinion Piece** - Personal perspective or thought leadership content

---

### Step 3: Target Audience Selection

**Ask the user:**
> Who is your target audience?

**Predefined Options:**
- **Technical** - Developers, engineers, IT professionals
- **Business** - Managers, executives, business stakeholders
- **General** - Non-technical readers, broad audience
- **Developers** - Software developers and programmers
- **Managers** - Team leads, project managers, department heads
- **Executives** - C-level, directors, decision makers
- **End-users** - Product users, customers
- **Custom** - Let me specify my own audience

If user selects "Custom", ask them to describe their target audience.

---

### Step 4: Writing Style Selection

**Ask the user:**
> What writing style should be used?

**Options:**
- **Formal** - Professional, structured, suitable for official communications
- **Conversational** - Friendly, engaging, approachable tone
- **Professional** - Balanced, business-appropriate yet accessible
- **Educational** - Clear explanations, learning-focused, instructive

---

### Step 5: Topic and Title

**Ask the user:**
> What is the topic/title of your article?

Let the user provide free-form text for the topic or title.

---

### Step 6: Key Points (Optional)

**Ask the user:**
> What key points should the article cover? (Optional - press Enter to skip)

Let the user provide bullet points or key messages they want included.

---

### Step 7: Article Length

**Ask the user:**
> What length should the article be?

**Options:**
- **Short** - 300-500 words (quick read, social media friendly)
- **Medium** - 500-1000 words (standard blog/article length)
- **Long** - 1000-2000 words (in-depth coverage)
- **Extended** - 2000+ words (comprehensive guide or whitepaper)

---

### Step 8: Output Destinations

**Ask the user:**
> Where will this article be published? (Select all that apply)

**Options (multi-select):**
- **Markdown File** - Always included, saved to specified location
- **LinkedIn** - Formatted for LinkedIn post (character limits applied)
- **Jira** - Formatted for Jira wiki/description
- **Medium** - Formatted for Medium platform
- **Dev.to** - Formatted for Dev.to with frontmatter
- **Confluence** - Formatted for Confluence wiki
- **Email Newsletter** - Formatted for email distribution
- **Other** - Let me specify

---

### Step 9: Output File Location

**Ask the user:**
> Where should the markdown file be saved?

Suggest default: `./articles/[date]-[slug].md`

Let user specify custom path or accept default.

---

## Article Generation

After collecting all inputs, generate the article following these guidelines:

### Content Structure by Article Type

**Blog Post:**
```
# [Title]

[Engaging introduction - hook the reader]

## [Section 1]
[Content]

## [Section 2]
[Content]

## Conclusion
[Call to action or summary]
```

**LinkedIn Post:**
```
[Hook - first line is crucial]

[Main content - 3-5 short paragraphs]

[Call to action]

#hashtag1 #hashtag2 #hashtag3
```

**Technical Article:**
```
# [Title]

## Overview
[Brief summary]

## Prerequisites
[What readers need to know/have]

## [Technical Section 1]
[Content with code examples]

## [Technical Section 2]
[Content with code examples]

## Conclusion
[Summary and next steps]

## References
[Links and resources]
```

**Tutorial / How-to Guide:**
```
# [Title]

## Introduction
[What we'll build/learn]

## Prerequisites
[Requirements]

## Step 1: [First Step]
[Instructions]

## Step 2: [Second Step]
[Instructions]

## [Continue steps...]

## Troubleshooting
[Common issues and solutions]

## Summary
[What was accomplished]
```

**Case Study:**
```
# [Title]

## Executive Summary
[Brief overview]

## Challenge
[Problem description]

## Solution
[What was implemented]

## Implementation
[How it was done]

## Results
[Outcomes and metrics]

## Lessons Learned
[Key takeaways]
```

**News Article:**
```
# [Headline]

**[Dateline]** — [Lead paragraph - who, what, when, where, why]

[Supporting details]

[Quotes and context]

[Background information]

[Conclusion/future outlook]
```

**Opinion Piece:**
```
# [Title]

[Strong opening statement]

## My Perspective
[Main argument]

## Why This Matters
[Supporting points]

## Counterarguments
[Addressing opposing views]

## Conclusion
[Call to action or final thought]
```

---

## Platform-Specific Formatting

After generating the main article, create platform-specific versions:

### LinkedIn Version
- Maximum 3000 characters (optimal: 1300-2000)
- Short paragraphs (1-3 sentences)
- Use line breaks for readability
- Include 3-5 relevant hashtags
- Strong hook in first line
- End with engagement question or CTA

### Jira Version
- Use Jira wiki markup if needed
- Keep formatting clean
- Include clear sections with headers
- Use {code} blocks for code snippets

### Medium Version
- Include Medium-style formatting
- Add subtitle
- Use pull quotes for emphasis
- Suggest appropriate tags

### Dev.to Version
```yaml
---
title: "[Title]"
published: false
description: "[Description]"
tags: tag1, tag2, tag3
cover_image:
---
```

### Confluence Version
- Use Confluence-compatible markup
- Include table of contents macro suggestion
- Structure for wiki navigation

### Email Newsletter Version
- Subject line suggestion
- Preview text
- Mobile-friendly formatting
- Clear CTA buttons

---

## Output Format

```
╔══════════════════════════════════════════════════════════════╗
║                    ARTICLE GENERATION WIZARD                  ║
╚══════════════════════════════════════════════════════════════╝

📝 CONFIGURATION SUMMARY
├── Language: [selected language]
├── Type: [article type]
├── Audience: [target audience]
├── Style: [writing style]
├── Length: [word count target]
└── Destinations: [platforms]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 MAIN ARTICLE (Markdown)
[Full article content]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 LINKEDIN VERSION
[Platform-optimized content]
Characters: [count]/3000

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎫 JIRA VERSION
[Platform-optimized content]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Additional platform versions as selected...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💾 FILE SAVED: [filepath]
```

---

## Instructions for Claude

When this command is executed:

1. **Phase 0: Prompt Perfection** - Perfect the user's prompt first
   - Analyze, check completeness, clarify if needed, correct, structure
   - Display the perfected prompt and wait for user approval (`y`/`n`/modifications)
   - **Do NOT proceed to article wizard until user approves**
2. **Start the interactive wizard** - Use AskUserQuestion tool for each step
3. **Collect all inputs** - Do not skip steps, ensure all parameters are captured
4. **Generate the article** - Follow the structure for the selected article type
5. **Apply writing style** - Match tone and complexity to selected audience/style
6. **Create platform versions** - Generate formatted versions for each selected destination
7. **Save the file** - Write the markdown file to the specified location
8. **Display all versions** - Show the main article and all platform-specific versions

### Language-Specific Guidelines

**For Slovak:**
- Use proper Slovak grammar and spelling
- Include appropriate diacritics (ä, č, ď, é, í, ĺ, ľ, ň, ó, ô, ŕ, š, ť, ú, ý, ž)
- Follow Slovak stylistic conventions
- Adapt idioms and expressions naturally

**For English:**
- Use clear, professional English
- Avoid overly complex sentences
- Use active voice when possible
- Follow standard punctuation rules

### Quality Checklist

Before finalizing, verify:
- [ ] Article matches requested type and structure
- [ ] Tone matches selected style and audience
- [ ] Length is within target range
- [ ] All key points are covered (if provided)
- [ ] Platform versions respect character limits
- [ ] Grammar and spelling are correct
- [ ] File is saved successfully

---

## Example Wizard Interaction

```
User: /prompt-article Write a blog post about AI in healthcare

Claude: [Phase 0: Prompt Perfection]

**Detected Language:** English
**Prompt Type:** Article / Content Creation

**Original:**
> Write a blog post about AI in healthcare

**Completeness Check:**
- [x] Goal: Write a blog post
- [x] Topic: AI in healthcare
- [ ] Context: ❌ will be collected in wizard
- [ ] Target Audience: ❌ will be collected in wizard

**Perfected Prompt:**
> **Goal:** Create a blog post about artificial intelligence applications in healthcare
> **Topic:** AI in healthcare
> **Constraints:** None - will configure in wizard

**Changes Made:**
- Expanded "AI" to "artificial intelligence" for clarity

⏸️ **Waiting for approval.** Reply with y/n/modifications

User: y

Claude: Welcome to the Article Writing Wizard! Let me guide you through creating your article.

[Step 1] What language should the article be written in?
- English
- Slovak

User: English

[Step 2] What type of article do you want to write?
[Options displayed...]

User: Blog Post

[Continue through all steps...]

Claude: [Generates and displays article with all platform versions]
[Saves markdown file to specified location]
```

---

⏸️ **After generation, ask the user:**
- `save` — Save to file (if not auto-saved)
- `revise [section]` — Modify specific section
- `regenerate` — Start over with same parameters
- `translate` — Create version in other language
- `done` — Finish and exit

---

## Quick Start (Optional Arguments)

If user provides arguments, pre-fill wizard steps:

`/prompt-article sk linkedin "My Topic Here"`

Would pre-select:
- Language: Slovak
- Type: LinkedIn Post
- Topic: "My Topic Here"
- (Continue wizard for remaining options)

---

## Version History

**v2.0 (2024-12-20):**
- ✨ Added explicit library reference
- ✨ References prompt-perfection-core.md and article-adapter.md
- Enhanced documentation consistency
- Maintains all wizard functionality

**v1.0 (Previous):**
- Initial release
- Interactive article wizard
- Multi-platform output support

---

## Library Integration

This command uses the **Unified Library System:**
- **Core:** `.claude/library/prompt-perfection-core.md` (universal Phase 0)
- **Adapter:** `.claude/library/adapters/article-adapter.md` (article domain)
- **Benefits:** Consistent validation, proven flow, easy maintenance

For details on the library system, see: `doc/Unified_Library_System_Guide.md`

---

**Ready to write your article? Just type: `/prompt-article [your topic]`**
