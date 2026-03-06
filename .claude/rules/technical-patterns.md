---
paths: .claude/commands/prompt-technical.md, .claude/library/adapters/technical-adapter.md
---

# Technical Analysis Patterns

Rules for technical implementation analysis commands.

## Phase 0 Requirements

1. Always detect complexity score before proceeding
2. Use Explore Agent for score >= 10
3. Ask user for score 5-9 (moderate complexity)
4. Manual scan only for score < 5

## Agent Usage

- Explore Agent: Codebase exploration, pattern detection
- Plan Agent: Implementation planning, architecture decisions
- Security Agent: OWASP analysis, vulnerability scanning
- Performance Agent: Bottleneck detection, optimization

## Output Format

- Use plain text in terminal (no markdown headers)
- Include complexity score in analysis output
- Show matched triggers with weights
- Present implementation options with pros/cons

## Error Handling

- Timeout after 30 seconds: Offer retry or manual fallback
- Agent failure: Auto-fallback to manual scan
- Cache corruption: Clear and re-run
- Empty results: Proceed with manual analysis

## Code Scaffolding

- Match existing codebase naming conventions
- Follow detected architectural patterns
- Include error handling patterns
- Add comments for complex logic only
