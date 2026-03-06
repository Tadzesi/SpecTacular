# Command Comparisons

## Command Selection Guide

### Quick Reference Table

| Your Goal | Command | Why |
|-----------|---------|-----|
| **Quick prompt cleanup** | `/prompt` | Fast, simple, no codebase analysis |
| **General prompt perfection** | `/prompt-hybrid` | Smart complexity detection, agents when needed |
| **Deep research & analysis** | `/prompt-research` | Multi-agent, iterative, comprehensive reports |
| **Technical implementation** | `/prompt-technical` | Deep tech analysis, auto-detects patterns |
| **Write an article** | `/prompt-article` | Interactive wizard, multi-platform output |
| **Generate README** | `/prompt-article-readme` | Project analysis, auto-detects tech stack |
| **Start session** | `/session-start` | Load previous context |
| **End session** | `/session-end` | Save current context |

---

## Decision Tree

```
Need prompt help?
├─ Just fix my prompt quickly → /prompt
├─ Complex task, not sure if needs analysis → /prompt-hybrid
├─ Deep research needed (security, performance, architecture) → /prompt-research
├─ Technical implementation needed → /prompt-technical
├─ Want to write article/content → /prompt-article
└─ Need README for project → /prompt-article-readme

Research & Analysis?
├─ Security audit → /prompt-research (SecurityAgent)
├─ Performance investigation → /prompt-research (PerformanceAgent)
├─ Architecture analysis → /prompt-research (multi-agent)
└─ Pattern discovery → /prompt-research (PatternAgent)

Session management?
├─ Starting work → /session-start
└─ Ending work → /session-end
```

---

## Detailed Comparisons

### /prompt vs /prompt-hybrid

**Use `/prompt` when:**
- You need quick prompt cleanup (< 2 seconds)
- The task is simple and well-defined
- You don't need codebase analysis
- You want to provide all context yourself

**Use `/prompt-hybrid` when:**
- The task might be complex (let it detect)
- You want codebase context automatically gathered
- You need pattern/convention detection
- You want technical feasibility validation
- You're unsure what information is needed

**Example:**
```
/prompt Fix typo in line 42          → Simple, use /prompt
/prompt-hybrid Add auth like existing → Complex, auto-spawns agent
```

---

### /prompt-hybrid vs /prompt-technical

**Use `/prompt-hybrid` when:**
- You want the prompt perfected first
- General-purpose prompt perfection
- Not necessarily technical implementation
- Let complexity detection decide approach

**Use `/prompt-technical` when:**
- You specifically want technical analysis
- You need implementation options with code
- You want best practices checklist
- You need detailed code scaffolding
- After you've already perfected the prompt

**Workflow:**
```
/prompt-hybrid [idea]  → Perfect the prompt first
     ↓
/prompt-technical      → Then get technical analysis
```

---

### /prompt-hybrid vs /prompt-research

**Use `/prompt-hybrid` when:**
- You need fast results (2-30s)
- Single-pass analysis is sufficient
- General task complexity (score 10-19)
- One agent perspective is enough

**Use `/prompt-research` when:**
- You need comprehensive analysis (60-180s)
- Multiple perspectives required (2-5 agents)
- Iterative refinement needed (2-4 cycles)
- Research complexity (score 20+)
- Security audits, performance investigations, architecture analysis
- Persistent knowledge graph needed
- Source citations required (file:line with code snippets)

**Example:**
```
/prompt-hybrid Analyze auth system          → Fast, single agent (~20s)
/prompt-research Perform security audit     → Deep, multi-agent (~120s)
```

**Decision Criteria:**
- Speed vs. Depth: hybrid = fast, research = comprehensive
- Agents: hybrid = 0-1, research = 2-5
- Iterations: hybrid = 1, research = 2-4
- Citations: hybrid = optional, research = always
- Memory: hybrid = learning only, research = persistent graph

---

### /prompt-research vs /prompt-hybrid - Feature Comparison Table

| Feature | /prompt-research | /prompt-hybrid |
|---------|------------------|----------------|
| Duration | 60-180s | 2-30s |
| Agents | 2-5 specialized | 0-1 general |
| Iterations | 2-4 cycles | Single-pass |
| Depth | Comprehensive | Balanced |
| Citations | Always (file:line) | Optional |
| Memory | Persistent graph | Learning only |
| Report | 15-20 pages | Structured prompt |

---

## Common Workflows

### Workflow 1: From Idea to Implementation
```
1. /prompt-hybrid "Add feature X"
   → Perfects prompt, gathers context

2. /prompt-technical
   → Technical analysis, implementation options

3. Implement (Claude executes the plan)

4. /session-end
   → Save session context
```

### Workflow 2: Article Writing
```
1. /prompt-article "Write about topic X"
   → Interactive wizard

2. Generate article for multiple platforms

3. /session-end
   → Save work
```

### Workflow 3: Documentation
```
1. /prompt-article-readme
   → Generate README from project

2. Review and customize

3. /session-end
   → Save changes
```

### Workflow 4: Deep Research & Security Audit
```
1. /prompt-research "Perform comprehensive security audit"
   → Interactive questions (scope, depth, focus)
   → User selects: Security + Architecture, Standard depth

2. Multi-agent research (120s)
   → Iteration 1: SecurityAgent + ExploreAgent + CitationAgent
   → Iteration 2: Refinement based on gaps
   → Converges at 75% coverage, 0.85 confidence

3. Review 15-20 page research report
   → Critical findings (vulnerabilities)
   → Important findings (security concerns)
   → Recommendations with priorities
   → Full citations (file:line with code)

4. Knowledge graph updated automatically
   → project-knowledge.md (security model)
   → architectural-context.md (security architecture)
   → citation-index.md (evidence tracking)

5. Follow-up research (optional)
   → /prompt-research "Investigate Finding #1 in detail"
   → Builds on existing knowledge (faster)

6. /session-end
   → Save session context
```

### Workflow 5: Performance Investigation
```
1. /prompt-research "Why is the dashboard slow?"
   → User selects: Performance focus, Standard depth

2. Multi-agent research (95s)
   → PerformanceAgent detects N+1 query (critical)
   → ExploreAgent maps data flow
   → CitationAgent provides exact locations

3. Implement fixes based on recommendations

4. /session-end
```
