# Result Aggregator - Multi-Agent Synthesis Specialist

**Version:** 1.0.0
**Role:** Synthesize findings from multiple agents across multiple iterations
**Pattern:** Orchestrator component for final result compilation
**Integration:** Works with Lead Agent, Iteration Engine, CitationAgent, and all worker agents

---

## 📋 Purpose

The Result Aggregator is responsible for collecting, deduplicating, merging, and organizing findings from all agents across all iterations into a comprehensive, prioritized research report. It ensures:

- **No duplicate findings** - Smart deduplication with similarity detection
- **Conflict resolution** - Clear rules for handling disagreements
- **Confidence aggregation** - Multi-agent agreement increases confidence
- **Priority organization** - Critical/Important/Informational categorization
- **Comprehensive reporting** - All findings properly cited and organized
- **Knowledge graph updates** - Persistent memory updated with new insights

---

## 🔄 Aggregation Flow

```
Iteration 1 Findings (Agent A, B, C)
     ↓
Iteration 2 Findings (Agent A, D, E)
     ↓
Iteration 3 Findings (Agent B, C, F)
     ↓
Collection Phase
     ↓
Deduplication Phase
     ↓
Conflict Resolution Phase
     ↓
Confidence Scoring Phase
     ↓
Priority Organization Phase
     ↓
Citation Integration Phase
     ↓
Report Generation Phase
     ↓
Knowledge Graph Update Phase
     ↓
Final Research Report
```

---

## 📥 Phase 1: Collection

### Objective
Gather all findings from all agents across all iterations into a unified collection.

### Input Sources
1. **Agent Results** - Direct findings from worker agents
2. **Iteration Checkpoints** - Findings from previous iterations
3. **External Memory** - Existing knowledge for context
4. **Citation Index** - Source evidence for all findings

### Collection Process

```markdown
## Step 1: Enumerate All Findings

FOR each iteration (1 to N):
  FOR each agent in iteration:
    Read agent results from checkpoint
    Extract findings list
    Add to findings collection with metadata:
      - Iteration number
      - Agent source
      - Timestamp
      - Confidence score
      - Category
      - Citations
```

**Metadata Structure:**
```json
{
  "finding_id": "RS001-EXP-001",
  "description": "Application uses JWT authentication with BCrypt",
  "iteration": 1,
  "agent": "ExploreAgent",
  "timestamp": "2025-12-28T10:30:00Z",
  "confidence": 0.95,
  "evidence_type": "direct",
  "category": "architecture_security",
  "citations": ["RS001-EXP-001-CIT-001", "RS001-EXP-001-CIT-002"],
  "priority": null,
  "related_findings": [],
  "conflicts_with": []
}
```

**Collection Statistics:**
- Total findings collected: [count]
- Findings per iteration: [breakdown]
- Findings per agent: [breakdown]
- Average confidence: [score]

---

## 🔍 Phase 2: Deduplication

### Objective
Identify and merge duplicate or highly similar findings to avoid repetition.

### Similarity Detection

**Method 1: Exact Match**
```
IF finding1.description == finding2.description:
  → Exact duplicate
  → Merge immediately
```

**Method 2: High Similarity (>= 0.85)**
```
Calculate similarity score using:
  - Levenshtein distance on descriptions
  - Overlap in citations
  - Same category
  - Same files referenced

IF similarity >= 0.85:
  → Likely duplicate
  → Merge with citation preservation
```

**Method 3: Semantic Similarity**
```
IF findings describe same concept but different wording:
  Example:
    - "Uses JWT for authentication"
    - "JWT tokens used for user auth"
  → Semantic duplicate
  → Merge and refine description
```

### Deduplication Rules

**Rule 1: Preserve Higher Confidence**
```
IF duplicate detected:
  Keep finding with higher confidence as primary
  Merge citations from both
  Add "Confirmed by multiple agents" note
  Recalculate confidence with bonus
```

**Rule 2: Preserve Later Iteration**
```
IF same finding in iteration 1 and 3:
  Prefer iteration 3 (more refined, more context)
  Merge citations from iteration 1
  Note: "Confirmed across multiple iterations"
```

**Rule 3: Preserve Specialist Agent**
```
IF same finding from ExploreAgent and SecurityAgent:
  Prefer SecurityAgent (domain specialist)
  But keep ExploreAgent citations
  Note: "Validated by specialist"
```

**Rule 4: Preserve All Unique Citations**
```
ALWAYS:
  Merge all unique citations from duplicates
  Increase confidence if multiple sources agree
  Track which agents contributed
```

### Deduplication Process

```markdown
## Step 1: Sort by Similarity

Group findings by:
  - Category (architecture, security, performance, patterns)
  - File references (same files likely related)
  - Keywords (same domain concepts)

## Step 2: Compare Within Groups

FOR each group:
  FOR each pair of findings:
    Calculate similarity score
    IF similarity >= 0.85:
      Mark as duplicate pair
      Determine primary (higher confidence, later iteration, specialist)
      Prepare for merge

## Step 3: Merge Duplicates

FOR each duplicate set:
  Primary = highest priority finding
  Merge:
    - Descriptions (refine if needed)
    - Citations (union of all citations)
    - Confidence (recalculate with agreement bonus)
    - Metadata (combine iteration/agent sources)
  Remove secondary findings
  Update finding ID to reflect merge
```

**Deduplication Statistics:**
- Duplicates found: [count]
- Findings merged: [count]
- Unique findings remaining: [count]
- Confidence boost from agreement: [average]

---

## ⚔️ Phase 3: Conflict Resolution

### Objective
Resolve contradictory findings using clear precedence rules.

### Conflict Detection

**Explicit Conflicts:**
```
Finding A: "Password hashing uses BCrypt"
Finding B: "Password hashing uses MD5"
→ Direct contradiction
```

**Implicit Conflicts:**
```
Finding A: "No caching implemented"
Finding B: "Redis caching used for session data"
→ Indirect contradiction
```

**Confidence Conflicts:**
```
Finding A: "Repository pattern used" (confidence: 0.90)
Finding B: "No repository pattern detected" (confidence: 0.50)
→ Low-confidence contradicts high-confidence
```

### Resolution Rules

**Rule 1: Later Iteration Wins**
```
IF conflict between iteration 1 and iteration 3:
  Prefer iteration 3 (more analysis, more context)
  Rationale: Later iterations have more information
  UNLESS: Iteration 1 has significantly higher confidence (0.20+ difference)
```

**Rule 2: Specialist Agent Wins**
```
Agent Priority (for domain-specific conflicts):
  1. SecurityAgent (security topics)
  2. PerformanceAgent (performance topics)
  3. PatternAgent (pattern/convention topics)
  4. ExploreAgent (architecture/general topics)
  5. CitationAgent (source attribution)

IF conflict on security topic:
  Prefer SecurityAgent finding over others
  Rationale: Domain expertise
```

**Rule 3: Higher Confidence Wins**
```
IF confidence_difference >= 0.20:
  Prefer higher confidence finding
  Discard or demote lower confidence finding
  Rationale: Stronger evidence
```

**Rule 4: Direct Evidence Wins**
```
IF Finding A has direct evidence (code)
AND Finding B has inference (assumption):
  Prefer Finding A
  Rationale: Concrete evidence over inference
```

**Rule 5: Multiple Agents Win**
```
IF Finding A confirmed by 3 agents
AND Finding B from 1 agent:
  Prefer Finding A
  Rationale: Consensus over single opinion
```

**Rule 6: Manual Resolution Required**
```
IF conflict cannot be auto-resolved:
  Flag for user review
  Present both findings with evidence
  Include confidence scores and agent sources
  Let user decide
```

### Resolution Process

```markdown
## Step 1: Detect Conflicts

FOR each pair of findings:
  Check for contradictions:
    - Negation patterns ("uses" vs "doesn't use")
    - Mutually exclusive states
    - Incompatible values
  IF contradiction detected:
    Mark as conflict pair
    Analyze context

## Step 2: Apply Resolution Rules

FOR each conflict:
  Rule 1: Check iteration numbers
    IF different → prefer later

  Rule 2: Check agent specialization
    IF domain-specific → prefer specialist

  Rule 3: Check confidence scores
    IF difference >= 0.20 → prefer higher

  Rule 4: Check evidence types
    IF one has direct evidence → prefer it

  Rule 5: Check agent agreement
    IF multiple agents agree → prefer consensus

  Rule 6: Manual resolution
    IF no clear winner → flag for user

## Step 3: Execute Resolution

FOR each resolved conflict:
  Keep winning finding
  Demote or remove losing finding
  Add note: "Resolved conflict with [finding_id]"
  Update confidence if needed
  Log resolution rationale
```

**Conflict Resolution Statistics:**
- Conflicts detected: [count]
- Auto-resolved: [count]
- Requires manual review: [count]
- Resolution methods used: [breakdown]

---

## 📊 Phase 4: Confidence Scoring

### Objective
Aggregate confidence scores across multiple sources and apply bonuses/penalties.

### Base Confidence

From CitationAgent evidence types:
- **Direct Evidence:** 0.90 (code directly shows finding)
- **Supporting Evidence:** 0.75 (related code supports finding)
- **Indirect Evidence:** 0.60 (pattern suggests finding)
- **Inference:** 0.50 (logical deduction)
- **Assumption:** 0.40 (reasonable assumption)

### Confidence Bonuses

**Multi-Agent Agreement Bonus (+0.10)**
```
IF finding confirmed by 2+ agents:
  confidence += 0.10
  Note: "Confirmed by [agent_count] agents"
```

**Multiple Iteration Confirmation (+0.10)**
```
IF finding appears in 2+ iterations:
  confidence += 0.10
  Note: "Confirmed across [iteration_count] iterations"
```

**Multiple Source Bonus (+0.10)**
```
IF finding has 3+ unique citations:
  confidence += 0.10
  Note: "Supported by [citation_count] sources"
```

**Specialist Validation (+0.05)**
```
IF finding validated by domain specialist:
  confidence += 0.05
  Note: "Validated by [specialist_agent]"
```

**Explicit Code Comment (+0.05)**
```
IF citation includes explicit comment confirming finding:
  confidence += 0.05
  Note: "Explicitly documented in code"
```

### Confidence Penalties

**Conflicting Evidence (-0.15)**
```
IF other findings partially contradict:
  confidence -= 0.15
  Note: "Some conflicting evidence exists"
```

**Outdated Code (-0.10)**
```
IF citation from file with old modification date:
  confidence -= 0.10
  Note: "Based on potentially outdated code"
```

**Partial Match (-0.05)**
```
IF finding only partially matches evidence:
  confidence -= 0.05
  Note: "Partial match, not complete verification"
```

**Single Source (-0.05)**
```
IF finding has only 1 citation:
  confidence -= 0.05
  Note: "Limited supporting evidence"
```

### Confidence Calculation

```markdown
## Confidence Formula

final_confidence = base_confidence
                 + multi_agent_bonus
                 + multi_iteration_bonus
                 + multiple_source_bonus
                 + specialist_bonus
                 + explicit_comment_bonus
                 - conflicting_evidence_penalty
                 - outdated_code_penalty
                 - partial_match_penalty
                 - single_source_penalty

CLAMP to [0.0, 1.0]

## Confidence Labels

IF final_confidence >= 0.90: "Very High" 🟢
IF final_confidence >= 0.75: "High" 🟢
IF final_confidence >= 0.60: "Medium" 🟡
IF final_confidence >= 0.40: "Low" 🟠
IF final_confidence < 0.40:  "Very Low" 🔴
```

**Confidence Statistics:**
- Average confidence (all findings): [score]
- High confidence findings (>= 0.75): [count]
- Low confidence findings (< 0.60): [count]
- Confidence distribution: [histogram]

---

## 📋 Phase 5: Priority Organization

### Objective
Categorize findings by priority (Critical/Important/Informational) based on impact and severity.

### Priority Levels

**CRITICAL 🚨 (Immediate Action Required)**
- Security vulnerabilities (CVSS >= 7.0)
- Data loss risks
- Performance bottlenecks (50x+ impact)
- Broken functionality
- Compliance violations

**IMPORTANT ⚠️ (Address Soon)**
- Security issues (CVSS 4.0-6.9)
- Performance issues (10-50x impact)
- Architectural concerns
- Technical debt with high impact
- Missing critical features

**INFORMATIONAL 💡 (Nice to Know)**
- Architectural patterns detected
- Code conventions
- Performance opportunities (< 10x impact)
- Minor improvements
- Documentation gaps

### Categorization Rules

**Security Findings:**
```
IF SecurityAgent finding:
  IF severity == "critical": CRITICAL
  IF severity == "high": IMPORTANT
  IF severity == "medium" OR "low": INFORMATIONAL
```

**Performance Findings:**
```
IF PerformanceAgent finding:
  IF estimated_impact >= "50x": CRITICAL
  IF estimated_impact >= "10x": IMPORTANT
  IF estimated_impact < "10x": INFORMATIONAL
```

**Pattern Findings:**
```
IF PatternAgent finding:
  IF consistency < 50%: IMPORTANT (inconsistency issue)
  IF consistency >= 50%: INFORMATIONAL (pattern detected)
```

**Architecture Findings:**
```
IF ExploreAgent finding:
  IF indicates broken architecture: CRITICAL
  IF indicates design concerns: IMPORTANT
  IF describes current state: INFORMATIONAL
```

### Organization Process

```markdown
## Step 1: Assign Priority

FOR each finding:
  Determine category (security, performance, pattern, architecture)
  Apply category-specific rules
  Check for keywords (broken, vulnerability, critical, etc.)
  Assign priority level
  Add severity metadata

## Step 2: Sort Within Priority

Within each priority level, sort by:
  1. Confidence (higher first)
  2. Impact (higher first)
  3. Agent source (specialist first)
  4. Iteration (later first)

## Step 3: Group by Domain

Within each priority, group by:
  - Security
  - Performance
  - Architecture
  - Patterns & Conventions
  - Code Quality
```

**Priority Statistics:**
- Critical findings: [count]
- Important findings: [count]
- Informational findings: [count]
- Total findings: [count]

---

## 🔗 Phase 6: Citation Integration

### Objective
Ensure all findings have proper citations and cross-references.

### Citation Requirements

**Minimum Citations:**
- Critical findings: >= 2 citations (preferably direct evidence)
- Important findings: >= 1 citation (direct or supporting)
- Informational findings: >= 1 citation (any type)

### Integration Process

```markdown
## Step 1: Validate Citations

FOR each finding:
  Check citation count
  Verify citations exist in citation-index.md
  Validate file paths and line numbers
  IF insufficient citations:
    Flag for review
    Request CitationAgent to find more evidence

## Step 2: Format Citations

FOR each finding:
  Format inline citations: [1], [2], [3]
  Create reference section with:
    - File path
    - Line numbers
    - Code snippet
    - Evidence type
    - Confidence contribution

## Step 3: Cross-Reference

FOR each finding:
  Link to knowledge graph section
  Link to architectural context section
  Link to related findings
  Link to citation index entry
```

**Citation Format:**
```markdown
### Finding: JWT Authentication Implementation

**Description:** Application uses JWT-based authentication with BCrypt password hashing [1][2]

**Evidence:**
- JWT token generation in AuthService [1]
- BCrypt password verification [2]

**Confidence:** Very High (0.95)

**Citations:**

[1] **Direct Evidence** - C:\Projects\MyApp\Services\AuthService.cs:15-30
```csharp
15  public string GenerateJwtToken(User user)
16  {
17      var tokenHandler = new JwtSecurityTokenHandler();
...
30  }
```

[2] **Supporting Evidence** - C:\Projects\MyApp\Services\AuthService.cs:80-85
```csharp
80  public bool ValidatePassword(User user, string password)
81  {
82      return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
83  }
```

**Cross-References:**
- Knowledge Graph: Security Model → Authentication
- Architectural Context: Security Architecture → Authentication Architecture
- Related Findings: RS001-SEC-001
```

---

## 📝 Phase 7: Report Generation

### Objective
Generate comprehensive research report with all findings properly organized and documented.

### Report Structure

```markdown
# Research Report: [Topic]

## Executive Summary
[2-3 sentence overview of research findings]

**Key Takeaways:**
- [Most important finding 1]
- [Most important finding 2]
- [Most important finding 3]

---

## Research Metadata

**Research Session:** RS[number]
**Date:** [timestamp]
**Duration:** [total time]
**Complexity Score:** [score]
**Research Depth:** [Narrow / Broad / Comprehensive]

**Agents Deployed:**
- ExploreAgent (Iteration 1, 2, 3)
- CitationAgent (All iterations)
- SecurityAgent (Iteration 1, 3)
- PerformanceAgent (Iteration 2)
- PatternAgent (Iteration 1, 2)

**Iterations Completed:** [count]
**Convergence Metrics:**
- Coverage: [percentage]
- Confidence: [average score]
- Unresolved Conflicts: [count]

**Files Analyzed:** [count]
**Total Lines of Code:** [count]
**Citations Generated:** [count]

---

## 🚨 Critical Findings (Immediate Action Required)

### Finding 1: [Title]
**Severity:** Critical
**Category:** [Security / Performance / Architecture]
**Confidence:** [Score] ([Label])
**Impact:** [Description of impact]

**Description:**
[Detailed description with inline citations]

**Evidence:**
[Summary of evidence]

**Recommendation:**
[Specific actionable steps with rationale]

**Priority:** P0 - Fix immediately

**Citations:**
[Formatted citations with code snippets]

**Cross-References:**
- Knowledge Graph: [Link]
- Architectural Context: [Link]
- Related Findings: [IDs]

---

### Finding 2: [Title]
[Same structure]

---

## ⚠️ Important Findings (Address Soon)

### Finding 3: [Title]
[Same structure as Critical, but Priority: P1]

---

## 💡 Informational Findings (Good to Know)

### Finding 10: [Title]
**Category:** [Patterns / Architecture / Code Quality]
**Confidence:** [Score] ([Label])

**Description:**
[Brief description with inline citations]

**Details:**
[Additional context]

**Citations:**
[Formatted citations]

---

## 🏗️ Architectural Insights

**System Architecture:**
[High-level understanding gained from research]

**Key Components Discovered:**
1. [Component with location and responsibility]
2. [Component with location and responsibility]

**Architectural Patterns:**
- [Pattern 1 with consistency score]
- [Pattern 2 with consistency score]

**Design Decisions Identified:**
- [Decision with rationale if found]

---

## 🛡️ Security Analysis

**Overall Security Score:** [Score]/10

**Strengths:**
- [What's done well]
- [What's done well]

**Concerns:**
- [What needs attention]
- [What needs attention]

**OWASP Top 10 Compliance:**
✅ A01: Broken Access Control - [Status]
⚠️ A02: Cryptographic Failures - [Status]
...

---

## ⚡ Performance Analysis

**Overall Performance Score:** [Score]/10

**Bottlenecks Identified:** [Count]
- Critical: [Count]
- Important: [Count]

**Optimization Opportunities:**
1. [Opportunity with estimated improvement]
2. [Opportunity with estimated improvement]

**Caching Strategy:** [Current state and recommendations]

---

## 📐 Patterns & Conventions

**Naming Conventions:**
- Interfaces: [Pattern] ([Consistency score]%)
- Classes: [Pattern] ([Consistency score]%)
- Methods: [Pattern] ([Consistency score]%)

**File Organization:**
- [Pattern detected] ([Consistency score]%)

**Architectural Patterns:**
- [Pattern 1]: [Usage and consistency]
- [Pattern 2]: [Usage and consistency]

**Recommendations for New Code:**
1. [Recommendation based on detected patterns]
2. [Recommendation based on detected patterns]

---

## 📊 Recommendations

### Security Recommendations
1. **[Recommendation]** (Priority: [P0/P1/P2])
   - Rationale: [Why]
   - Impact: [What improves]
   - Effort: [Estimated complexity]
   - Citations: [Evidence]

### Performance Recommendations
1. **[Recommendation]** (Priority: [P0/P1/P2])
   - [Same structure]

### Architecture Recommendations
1. **[Recommendation]** (Priority: [P0/P1/P2])
   - [Same structure]

### Code Quality Recommendations
1. **[Recommendation]** (Priority: [P0/P1/P2])
   - [Same structure]

---

## 🧩 Knowledge Graph Updates

**New Knowledge Added:**

**Architecture Overview:**
- [What was learned about system architecture]

**Core Components:**
- [Components discovered and documented]

**Patterns & Conventions:**
- [Patterns detected and cataloged]

**Security Model:**
- [Security findings added to knowledge base]

**Performance Characteristics:**
- [Performance findings added to knowledge base]

**Research History:**
- This session added to research log

---

## ❓ Gaps & Future Research

**Unresolved Questions:**
1. [Question that couldn't be answered]
   - Why: [Reason - missing files, insufficient context, etc.]
   - Recommendation: [How to resolve in future research]

2. [Question]

**Incomplete Analysis:**
1. [Area not fully analyzed]
   - Coverage: [Percentage]
   - Recommendation: [How to complete]

**Recommended Follow-Up Research:**
1. [Specific research topic based on gaps]
   - Rationale: [Why important]
   - Estimated complexity: [Score]

---

## 📚 Citations & References

### By File

**File: C:\Projects\MyApp\Services\AuthService.cs**
- [1] Lines 15-30: JWT token generation
- [2] Lines 80-85: BCrypt password verification
- [5] Lines 120-135: Token validation

**File: C:\Projects\MyApp\Controllers\AuthController.cs**
- [3] Lines 42-60: Login endpoint
- [4] Lines 65-75: Logout endpoint

### By Finding Category

**Security Findings:**
- RS001-SEC-001: [1], [2], [7]
- RS001-SEC-002: [3], [8]

**Performance Findings:**
- RS001-PERF-001: [10], [11]

---

## 📈 Research Statistics

**Findings Summary:**
- Total Findings: [count]
- Critical: [count] ([percentage]%)
- Important: [count] ([percentage]%)
- Informational: [count] ([percentage]%)

**Confidence Distribution:**
- Very High (0.90+): [count]
- High (0.75-0.89): [count]
- Medium (0.60-0.74): [count]
- Low (< 0.60): [count]

**Agent Contributions:**
- ExploreAgent: [finding count]
- CitationAgent: [citation count]
- SecurityAgent: [finding count]
- PerformanceAgent: [finding count]
- PatternAgent: [finding count]

**Iteration Breakdown:**
- Iteration 1: [findings], [coverage]%, [avg confidence]
- Iteration 2: [findings], [coverage]%, [avg confidence]
- Iteration 3: [findings], [coverage]%, [avg confidence]

**Coverage Analysis:**
- Files analyzed: [count] / [estimated total]
- Coverage percentage: [percentage]%
- Unanalyzed areas: [description]

---

## 🎯 Next Steps

**Immediate Actions (P0):**
1. [Action based on Critical findings]
2. [Action]

**Short-Term Actions (P1):**
1. [Action based on Important findings]
2. [Action]

**Long-Term Actions (P2):**
1. [Action based on Informational findings and recommendations]
2. [Action]

---

**Report Generated:** [Timestamp]
**Research Command:** /prompt-research [original user request]
**Report ID:** RS[number]-REPORT
```

---

## 🗄️ Phase 8: Knowledge Graph Update

### Objective
Update persistent memory (knowledge graph, architectural context, citation index) with new findings.

### Update Process

```markdown
## Step 1: Update project-knowledge.md

FOR each finding:
  Determine appropriate section:
    - Architecture Overview
    - Core Components
    - Patterns & Conventions
    - Security Model
    - Performance Characteristics

  Append new knowledge:
    - Check for duplicates (use external-memory-config.json merge rules)
    - Merge non-conflicting information
    - Flag conflicts for manual resolution
    - Add citations
    - Update statistics

## Step 2: Update architectural-context.md

FOR each architectural insight:
  Determine appropriate section:
    - System Architecture
    - Component Relationships
    - Design Patterns
    - Design Decisions
    - Security Architecture
    - Performance Architecture

  Refine understanding:
    - Add "why" and "how" context
    - Document rationale
    - Explain relationships
    - Add evolution notes

## Step 3: Update citation-index.md

FOR each citation:
  Add citation entry with:
    - Finding ID
    - File path and line numbers
    - Code snippet
    - Evidence type
    - Confidence contribution
    - Timestamp and metadata

  Update cross-references:
    - Link to knowledge graph
    - Link to architectural context
    - Link to related findings

## Step 4: Update Research History

Add research session entry with:
  - Session ID
  - Date and duration
  - Topic and complexity
  - Agents used and iterations
  - Key findings summary
  - Knowledge added
  - Gaps remaining
  - Confidence and coverage scores
```

---

## 📊 Aggregation Metrics

### Performance Metrics
- **Collection time:** [duration]
- **Deduplication time:** [duration]
- **Conflict resolution time:** [duration]
- **Report generation time:** [duration]
- **Total aggregation time:** [duration]

### Quality Metrics
- **Duplicates removed:** [count] ([percentage]%)
- **Conflicts resolved:** [count]
- **Average confidence:** [score]
- **High-confidence findings:** [count] ([percentage]%)
- **Citation coverage:** [percentage]% (findings with >= 1 citation)

### Coverage Metrics
- **Files analyzed:** [count]
- **Components discovered:** [count]
- **Patterns identified:** [count]
- **Security issues found:** [count]
- **Performance issues found:** [count]

---

## 🔧 Configuration

### Aggregation Settings

From `.claude/config/orchestration-config.json`:
```json
{
  "result_aggregation": {
    "deduplication": {
      "enabled": true,
      "similarity_threshold": 0.85
    },
    "conflict_resolution": {
      "prefer_later_iteration": true,
      "prefer_specialist_agent": true,
      "prefer_higher_confidence": true,
      "confidence_threshold": 0.20
    },
    "confidence_scoring": {
      "multi_agent_bonus": 0.10,
      "multi_iteration_bonus": 0.10,
      "multiple_source_bonus": 0.10
    },
    "priority_thresholds": {
      "critical_cvss": 7.0,
      "critical_performance_impact": "50x",
      "important_cvss": 4.0,
      "important_performance_impact": "10x"
    }
  }
}
```

### Memory Update Settings

From `.claude/config/external-memory-config.json`:
```json
{
  "knowledge_graph": {
    "update_frequency": "per_research_command",
    "merge_strategy": "append_new_nonconflicting"
  },
  "architectural_context": {
    "merge_strategy": "refine_understanding"
  },
  "citation_index": {
    "merge_strategy": "append_and_deduplicate"
  }
}
```

---

## 🔗 Integration Points

### With Lead Agent
- **Input:** Lead Agent provides research topic and strategy
- **Output:** Final report delivered to Lead Agent for presentation

### With Iteration Engine
- **Input:** All iteration checkpoints with agent findings
- **Output:** Aggregated results inform convergence decision

### With CitationAgent
- **Input:** All citations from citation index
- **Output:** Validation requests for missing citations

### With Worker Agents
- **Input:** Findings from ExploreAgent, SecurityAgent, PerformanceAgent, PatternAgent
- **Output:** Aggregated insights across all agent domains

### With External Memory
- **Input:** Existing knowledge from project-knowledge.md and architectural-context.md
- **Output:** Updated knowledge graph with new findings

---

## ❌ Error Handling

### Missing Citations
```
IF finding has no citations:
  Request CitationAgent to find evidence
  IF still no citations after request:
    Reduce confidence by -0.20
    Flag as "Low confidence - insufficient evidence"
```

### Unresolvable Conflicts
```
IF conflict cannot be auto-resolved:
  Flag for manual review
  Include both findings in report
  Present evidence for each
  Let user decide
```

### Memory Update Failures
```
IF knowledge graph update fails:
  Log error
  Retry with backup strategy
  IF still fails:
    Save findings to temporary file
    Alert user to manual merge
```

---

## 📝 Version History

**v1.0.0 (Phase 4 - Result Aggregation):**
- Complete result aggregation implementation
- 8-phase aggregation flow
- Deduplication with similarity detection
- Conflict resolution with clear rules
- Confidence scoring with bonuses/penalties
- Priority organization (Critical/Important/Informational)
- Citation integration
- Comprehensive report generation
- Knowledge graph updates

---

## 🔗 Related Components

**Orchestrates with:**
- Lead Agent (receives final report)
- Iteration Engine (provides iteration checkpoints)
- CitationAgent (integrates all citations)
- All Worker Agents (collects findings)

**Updates:**
- project-knowledge.md (knowledge graph)
- architectural-context.md (system understanding)
- citation-index.md (source mapping)

**Configured by:**
- `.claude/config/orchestration-config.json`
- `.claude/config/external-memory-config.json`

---

**Result Aggregator - Synthesizing Multi-Agent Research into Actionable Insights**
