# Article & Content Creation Adapter

**Version:** 1.0
**Parent Library:** `.claude/library/prompt-perfection-core.md`
**Purpose:** Domain-specific adaptation for article writing and content creation

---

## Overview

This adapter extends the core Phase 0 flow for content creation commands (`/prompt-article`, `/prompt-article-readme`).

It adds content-specific completeness criteria and interactive wizard patterns.

---

## When to Use This Adapter

Use this adapter when the command's purpose is:
- **Article writing** (blog posts, LinkedIn posts, technical articles)
- **Documentation** (README files, guides, tutorials)
- **Content creation** (case studies, opinion pieces, news articles)
- **Multi-platform publishing** (generating platform-specific formats)

---

## Extended Completeness Criteria

In addition to the universal 6 criteria, check for:

### For All Content Creation

- [ ] **Topic:** Main subject matter
- [ ] **Audience:** Target readers (technical/business/general)
- [ ] **Style:** Writing tone (formal/conversational/professional/educational)
- [ ] **Length:** Word count target or article size
- [ ] **Language:** Slovak / English / Other

### For Articles

- [ ] **Article Type:** Blog post, technical article, tutorial, case study, etc.
- [ ] **Key Points:** Main messages to cover
- [ ] **Platform:** Where it will be published
- [ ] **Format:** Markdown, HTML, platform-specific

### For Documentation

- [ ] **Documentation Type:** README, API docs, user guide, technical spec
- [ ] **Project Context:** What project/code is being documented
- [ ] **Sections Needed:** What to include (installation, usage, API, etc.)
- [ ] **Examples:** Should code examples be included

### For Multi-Platform Content

- [ ] **Target Platforms:** LinkedIn, Medium, Dev.to, Confluence, etc.
- [ ] **Platform Requirements:** Character limits, formatting rules
- [ ] **Cross-posting Strategy:** Same content or adapted per platform

---

## Content-Specific Clarification Questions

### Topic and Audience

**Critical:**
1. What is the main topic or title of your content?
   - Why: Defines the entire piece
   - Example: "Introduction to React Hooks" vs "Company Q3 Results"

2. Who is your target audience?
   - Why: Determines language complexity and tone
   - Options: Technical (developers), Business (executives/managers), General (broad audience)

3. What writing style should I use?
   - Why: Sets the tone
   - Options: Formal (official), Conversational (friendly), Professional (business), Educational (instructive)

### Content Structure

**Important:**
4. What type of content are you creating?
   - Why: Determines structure and format
   - Options: Blog Post, Technical Article, Tutorial, How-to Guide, Case Study, News Article, Opinion Piece, Documentation

5. What length should the content be?
   - Why: Scopes the effort
   - Options: Short (300-500 words), Medium (500-1000), Long (1000-2000), Extended (2000+)

6. What are the key points you want to cover?
   - Why: Ensures all important topics included
   - Format: Bullet points or free-form text

### Publishing and Format

**Important:**
7. Where will this content be published?
   - Why: Affects formatting and optimization
   - Options: Markdown file, LinkedIn, Medium, Dev.to, Jira, Confluence, Email, Blog

**Optional:**
8. Should I include code examples, images, or diagrams?
   - Why: Adds visual elements if needed
   - Relevant for: Technical articles, tutorials

9. Are there any SEO keywords or hashtags to include?
   - Why: Improves discoverability
   - Relevant for: Blog posts, social media

### Language-Specific

**Critical (if Slovak):**
10. Should I use Slovak with proper diacritics?
    - Why: Ensures correct Slovak grammar
    - Diacritics: ä, č, ď, é, í, ĺ, ľ, ň, ó, ô, ŕ, š, ť, ú, ý, ž

---

## Interactive Wizard Pattern

For comprehensive content creation, use wizard approach:

### Step-by-Step Collection

```markdown
**Content Creation Wizard:**

I'll guide you through creating your content step-by-step.

**Step 1/8: Language**
What language? (English / Slovak / Other)

[Wait for answer]

**Step 2/8: Content Type**
What type? (Blog Post / Technical Article / Tutorial / etc.)

[Wait for answer]

**Step 3/8: Target Audience**
Who is your audience? (Technical / Business / General / etc.)

[Wait for answer]

[Continue through all 8 steps...]
```

### Wizard Benefits

✅ **Comprehensive:** Ensures all criteria collected
✅ **User-friendly:** One question at a time
✅ **Flexible:** Can skip optional steps
✅ **Clear:** User knows what's being asked and why

---

## Perfected Prompt Format for Content

### Article Prompt

```markdown
**✨ Perfected Article Prompt:**

**Goal:** Create [article type] about [topic]

**Content Configuration:**
- Language: [English / Slovak]
- Type: [Blog Post / Technical Article / Tutorial / etc.]
- Audience: [Technical / Business / General]
- Style: [Formal / Conversational / Professional / Educational]
- Length: [Short / Medium / Long / Extended] ([word count range])

**Topic & Structure:**
- Main Topic: [topic/title]
- Key Points to Cover:
  1. [Point 1]
  2. [Point 2]
  3. [Point 3]

**Publishing:**
- Primary Platform: [Markdown / LinkedIn / Medium / etc.]
- Additional Platforms: [List if multi-platform]
- Format Requirements: [Character limits, formatting rules]

**Content Elements:**
- Code Examples: [Yes / No]
- Images/Diagrams: [Yes / No / Suggested placeholders]
- SEO Keywords: [List or "None"]
- Hashtags: [List or "None"]

**Expected Result:**
- [Article type] in [language]
- Formatted for [platform(s)]
- [Word count] words
- Covers all key points
- Matches [style] tone for [audience]
```

### README Documentation Prompt

```markdown
**✨ Perfected README Prompt:**

**Goal:** Generate README.md for [project name]

**Project Context:**
- Project Type: [Web app / Library / CLI tool / etc.]
- Tech Stack: [Technologies detected or specified]
- Purpose: [What the project does]
- Status: [In development / Production / etc.]

**README Scope:**
- Style: [Minimal / Standard / Comprehensive]
- Sections to Include:
  - [ ] Project Title & Description
  - [ ] Installation Instructions
  - [ ] Usage Examples
  - [ ] API Documentation
  - [ ] Configuration Options
  - [ ] Contributing Guidelines
  - [ ] License Information
  - [ ] Badges/Shields
  - [ ] Screenshots/Demos

**Content Requirements:**
- Code Examples: [Yes - show usage]
- Installation Steps: [Platform-specific / General]
- API Documentation: [Full / Basic / None]
- Contributing Guide: [Yes / No]

**Expected Result:**
- Professional README.md
- [Style] level of detail
- All requested sections included
- Code examples formatted correctly
```

---

## Platform-Specific Formatting

### LinkedIn Optimization

**Constraints:**
- Maximum 3000 characters (optimal: 1300-2000)
- Short paragraphs (1-3 sentences each)
- Line breaks for readability
- 3-5 relevant hashtags
- Strong hook in first line
- End with engagement question or CTA

**Format:**
```
[Hook - attention-grabbing first line]

[Main content - 3-5 short paragraphs]

[Call to action or question]

#hashtag1 #hashtag2 #hashtag3
```

### Medium Optimization

**Features:**
- Include subtitle
- Use pull quotes for emphasis
- Break content with headers (H2, H3)
- Add tags (up to 5)
- Consider cover image

**Format:**
```markdown
# [Title]
## [Subtitle]

[Introduction paragraph]

> [Pull quote for emphasis]

## [Section 1]
[Content]

## [Section 2]
[Content]

## Conclusion
[Wrap up]

**Tags:** tag1, tag2, tag3
```

### Dev.to Optimization

**Features:**
- Frontmatter with metadata
- Series support
- Cover image
- Canonical URL
- Tags

**Format:**
```yaml
---
title: "[Title]"
published: false
description: "[Description]"
tags: tag1, tag2, tag3
cover_image: [URL or leave empty]
series: [Series name if applicable]
canonical_url: [Original URL if cross-posting]
---

[Article content in markdown]
```

### Jira/Confluence

**Features:**
- Jira wiki markup or Markdown
- {code} blocks for code snippets
- Tables for data
- Panels for callouts

**Format:**
```
h1. [Title]

[Introduction]

{code:java}
// Code example
{code}

|| Header 1 || Header 2 ||
| Cell 1 | Cell 2 |

{info}
Important information
{info}
```

---

## Content Structure Templates

### Blog Post

```markdown
# [Title]

[Engaging introduction - hook the reader]

## [Section 1 - Main Point]
[Content with examples]

## [Section 2 - Supporting Point]
[Content with examples]

## [Section 3 - Additional Point]
[Content]

## Conclusion
[Summary and call to action]
```

### Technical Article

```markdown
# [Title]

## Overview
[Brief summary of what you'll learn]

## Prerequisites
[What readers need to know/have]

## [Technical Section 1]
[Explanation with code examples]

```[language]
// Code example
```

## [Technical Section 2]
[More content]

## Conclusion
[Summary and next steps]

## References
[Links and resources]
```

### Tutorial / How-to Guide

```markdown
# [How to X]

## Introduction
[What we'll build/learn]

## Prerequisites
[Tools, knowledge required]

## Step 1: [First Step]
[Clear instructions]
[Code or screenshots]

## Step 2: [Second Step]
[Instructions]

## [Continue steps...]

## Troubleshooting
[Common issues and solutions]

## Summary
[What was accomplished]

## Next Steps
[What to learn next]
```

### Case Study

```markdown
# [Case Study Title]

## Executive Summary
[Brief overview of the project]

## The Challenge
[Problem description]

## The Solution
[What was implemented]

## Implementation
[How it was done - technical details]

## Results
[Outcomes and metrics]
- Metric 1: [Improvement]
- Metric 2: [Improvement]

## Lessons Learned
[Key takeaways]

## Conclusion
[Final thoughts]
```

---

## Validation Rules

### Pre-Writing Validation

1. **Topic Clarity**
   - Topic is specific and focused
   - Not too broad or too narrow for target length
   - Key points are clear

2. **Audience Alignment**
   - Writing style matches audience
   - Technical depth appropriate
   - Language/terminology suitable

3. **Platform Requirements**
   - Character limits respected
   - Format compatible
   - Platform features utilized

### Content Quality Checks

1. **Structure**
   - Logical flow
   - Clear sections with headers
   - Introduction and conclusion present

2. **Tone and Style**
   - Consistent throughout
   - Matches specified style
   - Appropriate for audience

3. **Completeness**
   - All key points covered
   - Length within target range
   - Examples included if requested

4. **Grammar and Spelling**
   - Correct grammar
   - Proper spelling
   - Proper diacritics (if Slovak)

---

## Integration with Commands

### For /prompt-article

```markdown
## Phase 0: Prompt Perfection

**Import:** `.claude/library/prompt-perfection-core.md`
**Adaptation:** Article (from `.claude/library/adapters/article-adapter.md`)

**Interactive Wizard Enabled:**
- Step-by-step collection of all criteria
- User-friendly question flow
- Optional steps can be skipped

[Continue with Phase 1: Article Generation]
```

### For /prompt-article-readme

```markdown
## Phase 0: Prompt Perfection

**Import:** `.claude/library/prompt-perfection-core.md`
**Adaptation:** Article (from `.claude/library/adapters/article-adapter.md`)

**Auto-Detection Enabled:**
- Project structure analysis
- Tech stack detection
- Existing README review (if updating)

[Continue with Phase 1: README Generation]
```

---

## Complexity Detection for Articles (Optional Enhancement)

**Potential complexity triggers:**
- "research" keyword (+5)
- "technical tutorial" (+4)
- "case study" (+6)
- "compare" / "analysis" (+5)
- No topic provided (+3)
- "comprehensive" (+4)

**Use agent for:**
- Research articles → Gather sources, data
- Technical tutorials → Find code examples
- Case studies → Analyze implementations
- Comparisons → Collect comparison data

**Example:**
```
Topic: "Technical comparison of React vs Vue"
Complexity: 11 (compare=5 + technical=4 + tutorial=2)
→ Spawn agent to gather React/Vue examples, benchmarks
→ Agent returns code samples, performance data, use cases
→ Generate article with agent-gathered context
```

---

## Benefits of Article Adapter

### Solves Common Problems

❌ **Before (No Adapter):**
- Generic questions don't gather content-specific needs
- Missing audience/style information
- No platform optimization
- Unclear structure expectations

✅ **After (With Article Adapter):**
- Content-specific wizard
- Audience and style captured
- Multi-platform formatting automatic
- Structure templates provided

### Improves Quality

✅ **Better Targeting:** Content matches audience perfectly
✅ **Platform Optimization:** Format fits each platform
✅ **Consistent Quality:** Structure templates ensure completeness
✅ **Multi-language Support:** Proper Slovak/English handling

---

## Examples

### Example 1: Simple Blog Post

**User Prompt:**
```
Write a blog post about AI in healthcare
```

**Article Adapter Questions:**
1. Language? (English / Slovak) → English
2. Target audience? (Technical / Business / General) → General
3. Writing style? (Formal / Conversational / etc.) → Conversational
4. Length? (Short / Medium / Long) → Medium
5. Key points to cover? → AI diagnosis, treatment planning, patient care

**Result:**
- 750-word conversational blog post
- Structured with introduction, 3 main sections, conclusion
- Written for general audience
- Engaging tone

### Example 2: Multi-Platform Technical Article

**User Prompt:**
```
Technical article about React Hooks for LinkedIn and Dev.to
```

**Article Adapter Questions:**
- Type: Technical Article
- Audience: Technical (developers)
- Platforms: LinkedIn, Dev.to
- Code examples: Yes

**Result:**
- Full technical article in Markdown
- LinkedIn version: 1500 chars, hook + summary + hashtags
- Dev.to version: Full article with frontmatter, code blocks, tags
- Both optimized for their platforms

---

## Version History

**v1.0 (2024-12-19):**
- Initial release
- Article and documentation criteria
- Interactive wizard pattern
- Platform-specific formatting
- Structure templates

---

## Related Files

- **Core Library:** `.claude/library/prompt-perfection-core.md`
- **This Adapter:** `.claude/library/adapters/article-adapter.md`
- **Commands Using This:**
  - `.claude/commands/prompt-article.md`
  - `.claude/commands/prompt-article-readme.md`

---

**This adapter ensures content creation gets the detailed configuration needed for high-quality, platform-optimized articles.**
