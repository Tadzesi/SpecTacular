# /prompt-research - Deep Multi-Agent Research Command

**Version:** 1.0.0
**Command:** `/prompt-research`
**Purpose:** Comprehensive codebase research using orchestrator-worker architecture with iterative refinement
**Created:** 2025-12-28 (Phase 5 completion)
**Pattern:** Aligned with Anthropic's multi-agent research system

---

## 📋 Overview

The `/prompt-research` command provides **deep, multi-iteration codebase analysis** using specialized agents coordinated by an orchestrator. Unlike `/prompt-hybrid` (single-pass, fast), this command uses **2-4 iterations** with **multiple specialized agents** to achieve comprehensive understanding.

**Key Capabilities:**
- **Multi-agent orchestration** - 2-5 specialized agents work in parallel
- **Iterative refinement** - 2-4 iteration cycles with gap-driven refinement
- **Source attribution** - Every finding has file:line citations with code snippets
- **External memory** - Persistent knowledge graph across sessions
- **Comprehensive reporting** - 15-20 page research reports with priorities
- **Smart convergence** - Automatically determines when research is complete

---

## 🎯 When to Use This Command

### Use `/prompt-research` for:
✅ **Architecture analysis** - Understanding system structure and component relationships
✅ **Security audits** - OWASP Top 10, vulnerability detection, auth/authz review
✅ **Performance investigations** - Bottleneck detection, N+1 queries, caching analysis
✅ **Pattern discovery** - Naming conventions, code organization, consistency checks
✅ **Comprehensive understanding** - When you need multiple perspectives and deep insights
✅ **Critical decisions** - When accuracy and completeness matter more than speed

### Use `/prompt-hybrid` instead for:
⚡ **Quick tasks** - Single-file changes, simple questions
⚡ **Fast iterations** - When you need answers in 2-30 seconds
⚡ **Single perspective** - One agent is sufficient
⚡ **Known patterns** - Following established codebase patterns

### Use `/prompt-technical` for:
🔧 **Implementation planning** - After you understand the system (use research first)
🔧 **Code scaffolding** - Generating implementation with best practices

---

## 📊 Command Comparison

| Feature | /prompt-research | /prompt-hybrid | /prompt-technical |
|---------|------------------|----------------|-------------------|
| **Duration** | 60-180s | 2-30s | 20-60s |
| **Agents** | 2-5 specialized | 0-1 general | 0-1 general |
| **Iterations** | 2-4 cycles | Single-pass | Single-pass |
| **Depth** | Comprehensive | Balanced | Technical |
| **Citations** | Always (file:line) | Optional | Optional |
| **Memory** | Persistent graph | Learning only | Learning only |
| **Report** | 15-20 pages | Structured prompt | Implementation plan |
| **Use Case** | Research & audit | General tasks | Implementation |

---

## 🚀 Usage

### Basic Usage

```
/prompt-research Analyze the authentication system
```

### With Specific Scope

```
/prompt-research Perform security audit of payment processing
```

### With Multiple Focus Areas

```
/prompt-research Investigate performance issues and security vulnerabilities in the API layer
```

### With Specific Questions

```
/prompt-research How does caching work? Are there any N+1 query problems?
```

---

## 📝 Phase 0: Prompt Perfection

### Objective
Transform user input into a comprehensive research specification.

**Import:** Uses Phase 0 from `.claude/library/prompt-perfection-core.md`
**Adaptation:** Research-specific (from `.claude/library/adapters/research-adapter.md`)

### Step 0.11: Delegation Assessment *(AI Fluency - NEW v1.1)*

**Purpose:** Verify research task delegation is appropriate

**Before starting research, assess:**

```markdown
## 🤝 DELEGATION ASSESSMENT (AI Fluency)

### Problem Awareness
- **Research Goal:** [Clear / Needs Clarification]
- **Scope Definition:** [Well-defined / Broad / Undefined]
- **Success Criteria:** [Measurable findings / Qualitative understanding]

### Platform Capabilities
**This research involves:**
- Code analysis: ✅ AI Excellent
- Pattern detection: ✅ AI Excellent
- Architecture understanding: ✅ AI Good
- Security assessment: ✅ AI Good (human must approve remediations)
- Business decisions: ⚠️ Human Required

### Recommended Delegation

**AI Autonomous (Agency Mode):**
- Codebase exploration and mapping
- Pattern detection and consistency analysis
- Technical documentation generation
- Citation gathering and evidence collection

**AI with Human Review:**
- Security vulnerability assessment (human approves severity)
- Architecture recommendations (human validates fit)
- Performance optimization suggestions (human prioritizes)

**Human Must Decide:**
- Business priority of findings
- Resource allocation for fixes
- Architectural direction changes
- Security policy decisions

---
```

**Note:** For research tasks, AI operates primarily in **Agency Mode** - working independently and reporting back. Human reviews findings and makes decisions.

### Process

**Step 1: Understand the Request**
```
User input: "Analyze authentication system"

Analysis:
- Language: English
- Type: Architecture analysis + potential security audit
- Research scope: Authentication components
- Depth: Standard (user can choose)
```

**Step 2: Clarifying Questions** (Interactive)

The command will ask:

**Question 1: Research Scope**
```
What specific aspects should I research?

1. Architecture & Design (Recommended for understanding system structure)
   - Component relationships, data flow, patterns
2. Security & Compliance
   - Vulnerabilities, auth/authz, OWASP Top 10
3. Performance & Scalability
   - Bottlenecks, optimization opportunities, caching
4. Code Quality & Patterns
   - Conventions, consistency, technical debt
5. All of the Above (Comprehensive - takes longer)

Your choice: [1-5]
```

**Question 2: Research Depth**
```
How deep should the analysis be?

1. Quick Overview (Narrow - 1-2 iterations, ~60s)
   - High-level understanding, key components only
2. Standard Analysis (Broad - 2-3 iterations, ~120s) (Recommended)
   - Thorough analysis, most important areas covered
3. Comprehensive Audit (Comprehensive - 3-4 iterations, ~180s)
   - Deep dive, all aspects, maximum coverage

Your choice: [1-3]
```

**Question 3: Specific Questions**
```
What specific questions do you need answered?

Examples:
  - "How does authentication work?"
  - "Are there any SQL injection vulnerabilities?"
  - "What causes slow performance?"

Your questions: [Text input]
```

**Step 3: Calculate Complexity & Strategy**
```
Complexity Score: 34 (Security audit +10, Architecture analysis +7, etc.)

Selected Strategy: Broad Research
- Agents: ExploreAgent, CitationAgent, SecurityAgent, PatternAgent
- Iterations: 2-3
- Duration: ~120 seconds
- Coverage target: 70%
- Confidence target: 0.80
```

**Step 4: Output Perfected Prompt**
```markdown
## Research Specification

**Goal:** Analyze authentication system for architecture and security

**Research Scope:**
- Focus: Architecture & Design, Security & Compliance
- Components: Authentication services, middleware, token management
- Files: **/*Auth*.{cs,js,ts}, **/security/**/*

**Research Depth:** Standard Analysis (Broad strategy)

**Specific Questions:**
1. How is authentication implemented? (JWT, sessions, other?)
2. Are there any security vulnerabilities?
3. How is password hashing handled?
4. Is authorization properly enforced?

**Success Criteria:**
- Understand authentication flow
- Identify security risks
- Document current architecture
- Provide security recommendations

**Strategy:**
- Agents: ExploreAgent, CitationAgent, SecurityAgent, PatternAgent
- Iterations: 2-3
- Convergence: Coverage >= 70%, Confidence >= 0.80

**Expected Deliverables:**
- Research report with findings
- Architecture diagram (textual)
- Security analysis (OWASP Top 10)
- Pattern analysis (conventions)
- Recommendations (prioritized)
```

---

## 🔄 Phase 1: Multi-Agent Research Execution

### Orchestration Flow

**Step 1: Lead Agent Planning** (5-10s)
```
Lead Agent:
1. Reads external memory:
   - .claude/memory/project-knowledge.md (check existing knowledge)
   - .claude/memory/architectural-context.md (load context)
   - .claude/memory/citation-index.md (reuse valid citations)

2. Plans agent cohort:
   - ExploreAgent (always) - Find auth-related files
   - CitationAgent (always) - Provide file:line evidence
   - SecurityAgent (security focus) - OWASP audit
   - PatternAgent (consistency) - Convention analysis

3. Spawns agents in parallel (Iteration 1)
```

**Step 2: Iteration 1 - Initial Exploration** (30-40s)
```
ExploreAgent:
- Globs: **/*Auth*.cs, **/Middleware/*.cs, **/Services/*Auth*.cs
- Greps: "JWT", "BCrypt", "password", "token"
- Reads: AuthService.cs, AuthController.cs, JwtMiddleware.cs
- Findings: JWT authentication, BCrypt hashing, middleware validation

CitationAgent:
- Extracts file:line citations for all findings
- Code snippets with context
- Confidence scoring per citation
- Citations: 8 found

SecurityAgent:
- Analyzes authentication flow
- Checks OWASP Top 10
- Validates password hashing (BCrypt - secure ✓)
- Validates token management (JWT - needs expiration check ⚠️)
- Findings: 2 security concerns, 5 good practices

PatternAgent:
- Detects naming: I{Name} for interfaces (100% consistent)
- Detects patterns: Dependency injection (100%)
- Detects structure: Service layer pattern (95%)
- Findings: 4 patterns identified

Iteration 1 Results:
- Findings: 15 total
- Coverage: 55% (estimated)
- Confidence: 0.75 (average)
- Unresolved: How is session management handled?
```

**Step 3: Iteration Engine - Gap Analysis** (5s)
```
Iteration Engine evaluates:
- Coverage: 55% (< 70% target) ❌
- Confidence: 0.75 (< 0.80 target) ❌
- Unresolved questions: 1 (session management) ❌
→ Convergence NOT met, continue to Iteration 2

Gaps detected:
- Coverage gap: Session management not analyzed
- Confidence gap: Token expiration logic unclear
- Missing context: Refresh token implementation

Refinement plan:
- Spawn ExploreAgent again (focus on sessions, refresh tokens)
- Spawn PerformanceAgent (check auth performance)
```

**Step 4: Iteration 2 - Refinement** (30-40s)
```
ExploreAgent (refined focus):
- Greps: "session", "refresh", "token expiration"
- Reads: RefreshTokenService.cs, SessionManager.cs
- Findings: Refresh tokens used, 7-day expiration, session store in Redis

PerformanceAgent:
- Analyzes token validation performance
- Checks caching (Redis cache for user data - good ✓)
- Detects: No performance issues in auth flow
- Findings: 2 performance insights

CitationAgent:
- Adds citations for Iteration 2 findings
- Citations: +5 (13 total)

Iteration 2 Results:
- Findings: +7 (22 total)
- Coverage: 78% (estimated)
- Confidence: 0.83 (average)
- Unresolved: None
```

**Step 5: Iteration Engine - Convergence Check** (5s)
```
Iteration Engine evaluates:
- Coverage: 78% (>= 70% target) ✓
- Confidence: 0.83 (>= 0.80 target) ✓
- Unresolved questions: 0 ✓
- Conflicts: 0 ✓
→ Convergence MET, proceed to aggregation
```

**Step 6: Result Aggregation** (20-30s)
```
Result Aggregator:
1. Collects all findings (Iteration 1 + 2)
2. Deduplicates: 3 duplicates found, merged
3. Resolves conflicts: None detected
4. Scores confidence: Average 0.85 (with bonuses)
5. Organizes by priority:
   - Critical: 0 findings
   - Important: 2 findings (token expiration config, rate limiting)
   - Informational: 17 findings (architecture, patterns)
6. Integrates citations: 13 unique citations
7. Generates research report
8. Updates knowledge graph
```

**Total Duration:** ~120 seconds (Broad strategy)

---

## 📄 Output: Research Report

### Report Structure (15-20 pages)

```markdown
# Research Report: Authentication System Analysis

## Executive Summary
The authentication system uses JWT tokens with BCrypt password hashing, following industry best practices for security. The architecture implements a clean service layer pattern with 100% dependency injection consistency. Two areas need attention: token expiration configuration and rate limiting for login attempts.

**Key Takeaways:**
- Secure password hashing (BCrypt with 12 rounds) ✅
- JWT tokens with refresh token mechanism ✅
- Token expiration should be configurable (currently hardcoded) ⚠️
- Rate limiting not implemented for auth endpoints ⚠️

---

## Research Metadata
**Research Session:** RS001
**Date:** 2025-12-28T14:30:00Z
**Duration:** 118 seconds
**Complexity Score:** 34
**Research Depth:** Broad (Standard Analysis)

**Agents Deployed:**
- ExploreAgent (Iteration 1, 2)
- CitationAgent (All iterations)
- SecurityAgent (Iteration 1)
- PatternAgent (Iteration 1)
- PerformanceAgent (Iteration 2)

**Iterations Completed:** 2
**Convergence Metrics:**
- Coverage: 78%
- Confidence: 0.85 (average)
- Unresolved Conflicts: 0

**Files Analyzed:** 8
**Total Lines of Code:** 1,250
**Citations Generated:** 13

---

## 🚨 Critical Findings
(None found - good news!)

---

## ⚠️ Important Findings

### Finding 1: Token Expiration Hardcoded
**Severity:** Important
**Category:** Security, Maintainability
**Confidence:** High (0.88)

**Description:**
JWT token expiration is hardcoded to 24 hours in AuthService.cs [1]. This should be configurable via appsettings.json to allow different expiration times for different environments (dev vs. production).

**Evidence:**
- Hardcoded value in token generation [1]
- No configuration entry in appsettings.json [2]

**Recommendation:**
Move expiration time to configuration:
1. Add Jwt:AccessTokenExpirationHours to appsettings.json
2. Update AuthService to read from configuration
3. Allows flexibility per environment (dev: 24h, prod: 1h)

**Priority:** P1 - Address in next sprint

**Citations:**
[1] C:\Projects\MyApp\Services\AuthService.cs:26
```csharp
26          Expires = DateTime.UtcNow.AddHours(24),
```
[2] C:\Projects\MyApp\appsettings.json:10-15 (JWT section)

---

### Finding 2: Missing Rate Limiting
**Severity:** Important
**Category:** Security (Brute Force Protection)
**Confidence:** High (0.85)

**Description:**
Login and authentication endpoints do not implement rate limiting [3][4]. This allows unlimited login attempts, making the system vulnerable to brute force attacks.

**Evidence:**
- AuthController.Login has no rate limiting attribute [3]
- No rate limiting middleware configured [4]

**Recommendation:**
Implement rate limiting:
1. Install AspNetCoreRateLimit NuGet package
2. Configure rate limiting middleware (max 5 attempts per minute)
3. Apply to auth endpoints
4. Return 429 Too Many Requests on violation

**Priority:** P1 - Security concern

**Citations:**
[3] C:\Projects\MyApp\Controllers\AuthController.cs:42
[4] C:\Projects\MyApp\Startup.cs:50-70 (middleware configuration)

---

## 💡 Informational Findings

### Finding 3: JWT Authentication Implementation
**Category:** Architecture, Security
**Confidence:** Very High (0.95)

**Description:**
Application uses JWT-based authentication with BCrypt password hashing [5][6]. Implementation follows security best practices with proper token signing (HMAC-SHA256) and secure password hashing (BCrypt, 12 rounds).

**Details:**
- JWT tokens signed with HMAC-SHA256
- 24-hour expiration (see Finding 1 for improvement)
- Refresh tokens implemented (7-day expiration)
- BCrypt hashing with 12 rounds (secure)
- User claims included in token

**Citations:**
[5] C:\Projects\MyApp\Services\AuthService.cs:15-30 (JWT generation)
[6] C:\Projects\MyApp\Services\AuthService.cs:80-85 (BCrypt hashing)

---

[Additional 14 informational findings...]

---

## 🏗️ Architectural Insights

**System Architecture:**
Layered architecture with clean separation of concerns:
- Controllers (API layer) → Services (Business logic) → Repositories (Data access)

**Key Components Discovered:**
1. AuthService (C:\Projects\MyApp\Services\AuthService.cs)
   - Responsibility: JWT generation, password validation, token refresh
   - Dependencies: IUserRepository, IConfiguration, ILogger
2. AuthController (C:\Projects\MyApp\Controllers\AuthController.cs)
   - Responsibility: HTTP endpoints (login, logout, refresh)
   - Dependencies: IAuthService
3. JwtMiddleware (C:\Projects\MyApp\Middleware\JwtMiddleware.cs)
   - Responsibility: Token validation pipeline
   - Dependencies: IConfiguration

**Architectural Patterns:**
- Dependency Injection: 100% consistent ✅
- Service Layer Pattern: 95% consistent ✅
- Repository Pattern: 100% consistent ✅

---

## 🛡️ Security Analysis

**Overall Security Score:** 8.5/10 (Very Good)

**Strengths:**
- BCrypt password hashing (12 rounds) ✅
- JWT token signing with HMAC-SHA256 ✅
- Refresh token rotation ✅
- No hardcoded secrets ✅

**Concerns:**
- Hardcoded token expiration (Finding 1) ⚠️
- Missing rate limiting (Finding 2) ⚠️

**OWASP Top 10 Compliance:**
✅ A01: Broken Access Control - Authorization middleware present
✅ A02: Cryptographic Failures - BCrypt hashing, HTTPS enforced
⚠️ A03: Injection - Parameterized queries used, but validate input
✅ A04: Insecure Design - Secure design patterns followed
⚠️ A05: Security Misconfiguration - Token expiration hardcoded
✅ A06: Vulnerable Components - Dependencies up-to-date
⚠️ A07: Authentication Failures - Missing rate limiting
✅ A08: Software/Data Integrity - Code signing not analyzed
✅ A09: Security Logging - Authentication events logged
✅ A10: SSRF - Not applicable to this system

---

## ⚡ Performance Analysis

**Overall Performance Score:** 9.0/10 (Excellent)

**Bottlenecks Identified:** 0 Critical, 0 Important

**Optimization Opportunities:**
- Redis caching used for user data ✅
- Token validation cached in memory ✅
- No N+1 queries detected ✅

**Caching Strategy:**
- User data cached in Redis (5-minute TTL)
- Token validation results cached (in-memory)
- Session data cached (Redis)

**Performance:** Authentication flow is well-optimized, no issues detected.

---

## 📐 Patterns & Conventions

**Naming Conventions:**
- Interfaces: I{Name} (100% consistent) ✅
- Classes: {Entity}{Purpose} (95% consistent) ✅
- Async methods: {Verb}{Noun}Async (100% consistent) ✅

**File Organization:**
- Layer-based folders (100% consistent) ✅
- One class per file (100% consistent) ✅

**Architectural Patterns:**
- Dependency Injection: Used everywhere ✅
- Service Layer: Clear separation ✅
- Repository Pattern: Data access abstraction ✅

**Recommendations for New Code:**
1. Continue using I{Name} for interfaces
2. Follow {Verb}{Noun}Async for async methods
3. Maintain service layer separation
4. Use constructor injection for dependencies

---

## 📊 Recommendations

### Security Recommendations
1. **Configure Token Expiration** (Priority: P1)
   - Rationale: Security best practice, environment flexibility
   - Impact: More secure production environment
   - Effort: Low (1 hour)
   - Citations: [1][2]

2. **Implement Rate Limiting** (Priority: P1)
   - Rationale: Prevent brute force attacks
   - Impact: Significant security improvement
   - Effort: Medium (4 hours)
   - Citations: [3][4]

### Architecture Recommendations
(None - architecture is well-designed)

### Performance Recommendations
(None - performance is excellent)

---

## 🧩 Knowledge Graph Updates

**New Knowledge Added:**

**Architecture Overview:**
- Layered architecture identified
- JWT authentication is core security mechanism
- Service layer pattern used throughout

**Core Components:**
- AuthService, AuthController, JwtMiddleware documented
- Component relationships mapped
- Dependencies tracked

**Patterns & Conventions:**
- Naming conventions: I{Name}, {Verb}{Noun}Async
- 100% dependency injection consistency
- Service layer pattern 95% consistent

**Security Model:**
- JWT + BCrypt documented
- OWASP Top 10 compliance assessed
- Two improvements identified

**Performance Characteristics:**
- Redis caching strategy documented
- No bottlenecks found
- Excellent performance score (9.0/10)

**Research History:**
- Session RS001 added to log

---

## ❓ Gaps & Future Research

**No Unresolved Questions** ✅

**Recommended Follow-Up Research:**
1. **Analyze authorization system** (separate from authentication)
   - Rationale: Complete security picture
   - Estimated complexity: 25 (Narrow research)

2. **Review API rate limiting across all endpoints**
   - Rationale: Consistent rate limiting strategy
   - Estimated complexity: 30 (Broad research)

---

## 📚 Citations & References

### By File

**File: C:\Projects\MyApp\Services\AuthService.cs**
- [1] Lines 26: Token expiration (hardcoded 24h)
- [5] Lines 15-30: JWT token generation
- [6] Lines 80-85: BCrypt password verification
- [7] Lines 90-95: Refresh token generation

**File: C:\Projects\MyApp\Controllers\AuthController.cs**
- [3] Lines 42: Login endpoint (no rate limiting)
- [8] Lines 65-75: Logout endpoint

**File: C:\Projects\MyApp\appsettings.json**
- [2] Lines 10-15: JWT configuration section

[Additional citations...]

---

## 📈 Research Statistics

**Findings Summary:**
- Total Findings: 19
- Critical: 0 (0%)
- Important: 2 (11%)
- Informational: 17 (89%)

**Confidence Distribution:**
- Very High (0.90+): 5 findings
- High (0.75-0.89): 11 findings
- Medium (0.60-0.74): 3 findings
- Low (< 0.60): 0 findings

**Agent Contributions:**
- ExploreAgent: 8 findings
- SecurityAgent: 7 findings
- PatternAgent: 4 findings
- PerformanceAgent: 2 findings
- CitationAgent: 13 citations

**Iteration Breakdown:**
- Iteration 1: 15 findings, 55% coverage, 0.75 avg confidence
- Iteration 2: 7 findings, 78% coverage, 0.83 avg confidence

**Coverage Analysis:**
- Files analyzed: 8 / 10 estimated (80%)
- Coverage percentage: 78%
- Unanalyzed areas: Email notification service (not in auth scope)

---

## 🎯 Next Steps

**Immediate Actions (P1):**
1. Configure JWT token expiration via appsettings.json
2. Implement rate limiting for authentication endpoints

**Short-Term Actions (P2):**
1. Consider analyzing authorization system separately
2. Review rate limiting strategy across all endpoints

---

**Report Generated:** 2025-12-28T14:32:00Z
**Research Command:** /prompt-research Analyze authentication system
**Report ID:** RS001-REPORT
```

---

## 🗄️ Persistent Memory Updates

After research completes, the following files are updated:

### project-knowledge.md
```markdown
## Core Components

### Component 1: AuthService
**Location:** C:\Projects\MyApp\Services\AuthService.cs
**Responsibility:** JWT generation, password validation, token refresh
**Dependencies:** IUserRepository, IConfiguration, ILogger
**Patterns:** Service layer, dependency injection
**Citations:** [RS001-EXP-001]

[Additional components...]

## Security Model

### Authentication
**Implementation:** JWT tokens with BCrypt password hashing
**Security Score:** 8.5/10
**Strengths:** BCrypt (12 rounds), HMAC-SHA256, refresh tokens
**Concerns:** Hardcoded expiration, missing rate limiting
**Citations:** [RS001-SEC-001], [RS001-SEC-002]

[Additional security details...]
```

### architectural-context.md
```markdown
## Security Architecture

### Authentication Architecture
**Flow:** User → Credentials → AuthService → Token Generation → Token Storage
**Why JWT:** Stateless authentication, scalability, modern standard
**Why BCrypt:** Industry standard, configurable rounds, secure
**Design Decision:** 24-hour expiration chosen for user convenience
**Trade-off:** Security (shorter) vs. UX (longer) - currently favors UX
**Citations:** [RS001-EXP-001-CIT-001]

[Additional architectural understanding...]
```

### citation-index.md
```markdown
**Finding ID:** RS001-SEC-001
**Description:** JWT authentication with BCrypt hashing
**Confidence:** 0.95
**Category:** Security

**Citations:**
[RS001-SEC-001-CIT-001] C:\Projects\MyApp\Services\AuthService.cs:15-30
[RS001-SEC-001-CIT-002] C:\Projects\MyApp\Services\AuthService.cs:80-85

[Additional citations...]
```

---

## ⚙️ Configuration

### Complexity Threshold

From `.claude/config/complexity-rules.json`:
```json
{
  "thresholds": {
    "research_mode": 20
  }
}
```

**Automatic Research Mode:**
- Score >= 20: Command automatically uses research mode
- Score < 20: Suggests using `/prompt-hybrid` instead

### Strategy Selection

From `.claude/config/orchestration-config.json`:
```json
{
  "strategy_templates": {
    "narrow_research": {
      "initial_agents": 2,
      "max_iterations": 2,
      "estimated_duration_seconds": 60
    },
    "broad_research": {
      "initial_agents": 4,
      "max_iterations": 3,
      "estimated_duration_seconds": 120
    },
    "comprehensive_research": {
      "initial_agents": 5,
      "max_iterations": 4,
      "estimated_duration_seconds": 180
    }
  }
}
```

### Agent Roles

From `.claude/config/agent-roles.json`:
- ExploreAgent (always) - Haiku, 30s timeout
- CitationAgent (always) - Haiku, 20s timeout
- SecurityAgent (conditional) - Sonnet, 45s timeout
- PerformanceAgent (conditional) - Sonnet, 45s timeout
- PatternAgent (conditional) - Haiku, 30s timeout

---

## 🔍 Example Workflows

### Workflow 1: Security Audit
```
User: /prompt-research Perform security audit
→ Phase 0 clarifying questions (scope, depth)
→ User selects: Security focus, Comprehensive depth
→ Strategy: Comprehensive (5 agents, 3-4 iterations)
→ Agents: Explore + Citation + Security + Performance + Pattern
→ Iteration 1: Broad security scan
→ Iteration 2: Deep vulnerability analysis
→ Iteration 3: Validation and cross-checks
→ Converged after 3 iterations (165s)
→ Report: 12 security findings (2 critical, 5 important, 5 info)
→ Memory updated with security model
```

### Workflow 2: Performance Investigation
```
User: /prompt-research Why is the dashboard slow?
→ Phase 0 clarifying questions
→ User selects: Performance focus, Standard depth
→ Strategy: Broad (4 agents, 2-3 iterations)
→ Agents: Explore + Citation + Performance + Pattern
→ Iteration 1: Find dashboard code, analyze performance
→ Iteration 2: Deep dive into bottlenecks
→ Converged after 2 iterations (95s)
→ Report: 5 performance findings (1 critical N+1 query, 4 opportunities)
→ Memory updated with performance characteristics
```

### Workflow 3: Architecture Understanding
```
User: /prompt-research Help me understand the architecture
→ Phase 0 clarifying questions
→ User selects: Architecture focus, Standard depth
→ Strategy: Broad (4 agents, 2-3 iterations)
→ Agents: Explore + Citation + Pattern + Security
→ Iteration 1: Map components and relationships
→ Iteration 2: Refine understanding, trace data flows
→ Converged after 2 iterations (110s)
→ Report: Architecture overview, component map, patterns
→ Memory updated with architectural context
```

---

## 📊 Performance Expectations

### First Run (No Cache)
- **Narrow:** ~60s (2 agents, 1-2 iterations)
- **Broad:** ~120s (4 agents, 2-3 iterations)
- **Comprehensive:** ~180s (5 agents, 3-4 iterations)

### Cached Run (Same Research)
- **All strategies:** ~10s (10-20x faster)
- Cache hit if: Same prompt, files unchanged, < 24h old

### Memory Benefits
- **Second research on same topic:** Faster (skips known areas)
- **Related research:** Faster (builds on existing knowledge)
- **After multiple sessions:** Significantly faster (comprehensive knowledge)

---

## 🎓 Best Practices

### 1. Be Specific
❌ Bad: "Analyze the code"
✅ Good: "Analyze authentication system for security vulnerabilities"

### 2. Use for Complex Tasks
❌ Bad: "Fix typo in line 42" (use /prompt instead)
✅ Good: "Perform comprehensive security audit" (use /prompt-research)

### 3. Provide Context in Questions
❌ Bad: "Is it fast?"
✅ Good: "Are there performance bottlenecks in the API layer?"

### 4. Leverage Multiple Sessions
- First session: Broad understanding
- Second session: Deep dive into specific area
- Memory builds understanding over time

### 5. Review Knowledge Graph
- Check `.claude/memory/project-knowledge.md` periodically
- See what the system knows
- Avoid redundant research

---

## 🔧 Troubleshooting

### Research Takes Too Long
```
Issue: Research exceeds expected duration
Cause: Comprehensive strategy on large codebase
Solution: Use Narrow or Broad strategy instead
```

### Low Coverage (< 70%)
```
Issue: Convergence not met, research incomplete
Cause: Scope too broad, files too many
Solution: Narrow scope to specific components
```

### Too Many Findings
```
Issue: Report has 50+ findings (overwhelming)
Cause: Comprehensive strategy on complex codebase
Solution: Focus on Critical/Important findings first
```

### Cache Not Working
```
Issue: Research not using cached results
Cause: Files changed or branch switched
Solution: Expected behavior - cache invalidates on changes
```

---

## 📝 Version History

### v1.1.0 - 2026-01-20 (AI Fluency Alignment)
- ✨ **NEW:** Step 0.11 - Delegation Assessment (AI Fluency Framework)
- ✨ **NEW:** Problem Awareness, Platform Capabilities, Delegation Plan
- ✨ **NEW:** Agency Mode documentation for research tasks
- Aligned with Anthropic's 4Ds model
- Enhanced responsibility awareness

### v1.0.0 - 2025-12-28 (Phase 5 Complete)
- Initial release of /prompt-research command
- Multi-agent orchestration with iterative refinement
- Source attribution with CitationAgent
- External memory integration
- Comprehensive research reporting
- Integration with all Phase 1-4 components

**Future Enhancements:**
- Visual architecture diagrams (Mermaid)
- Interactive finding exploration
- Automated remediation suggestions
- Cross-project knowledge sharing

---

## 🔗 Library Integration

### Core Phase 0
**Imports:** `.claude/library/prompt-perfection-core.md`

### Research Adapter
**Uses:** `.claude/library/adapters/research-adapter.md`

### Orchestration Components
**Invokes:**
- `.claude/library/orchestration/lead-agent-core.md`
- `.claude/library/orchestration/iteration-engine.md`
- `.claude/library/orchestration/result-aggregator.md`

### Specialized Agents
**Deploys:**
- `.claude/library/agents/explore-agent.md`
- `.claude/library/agents/citation-agent.md`
- `.claude/library/agents/security-agent.md`
- `.claude/library/agents/performance-agent.md`
- `.claude/library/agents/pattern-agent.md`

### External Memory
**Updates:**
- `.claude/memory/project-knowledge.md`
- `.claude/memory/architectural-context.md`
- `.claude/memory/citation-index.md`

### Configuration Files
**Configured by:**
- `.claude/config/orchestration-config.json`
- `.claude/config/agent-roles.json`
- `.claude/config/external-memory-config.json`
- `.claude/config/complexity-rules.json`
- `.claude/config/citation-config.json`
- `.claude/config/iteration-rules.json`
- `.claude/config/cache-config.json`
- `.claude/config/learning-config.json`

---

**Deep Multi-Agent Research - Comprehensive Codebase Understanding with Iterative Refinement**
