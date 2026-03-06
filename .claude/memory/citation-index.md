# Citation Index

**Version:** 1.0.0
**Last Updated:** Not yet populated
**Purpose:** Mapping database from Finding IDs to source locations with full traceability

---

## 📋 Overview

This citation index provides a **centralized mapping** from research findings to their exact source locations in the codebase. It enables:

- **Traceability** - Every finding can be traced to exact file:line evidence
- **Cross-referencing** - Links between findings, knowledge graph, and source code
- **Validation** - Verify findings by checking source locations
- **Navigation** - Quick IDE navigation to evidence

**Maintained by:** CitationAgent
**Updated:** After each research session
**Retention:** 90 days (configurable)

---

## 🗂️ Index Structure

### Finding ID Format
```
[SessionID]-[AgentType]-[FindingNumber]

Examples:
  RS001-EXP-001  (Research Session 1, ExploreAgent, Finding 1)
  RS001-SEC-001  (Research Session 1, SecurityAgent, Finding 1)
  RS002-PERF-003 (Research Session 2, PerformanceAgent, Finding 3)
```

### Citation ID Format
```
[FindingID]-CIT-[CitationNumber]

Examples:
  RS001-EXP-001-CIT-001  (First citation for finding RS001-EXP-001)
  RS001-SEC-001-CIT-002  (Second citation for finding RS001-SEC-001)
```

---

## 📑 Citation Entries

### Citation Entry Template

**Finding ID:** [ID]
**Finding Description:** [Brief summary]
**Confidence:** [Score] ([Label])
**Category:** [Architecture / Security / Performance / Pattern / etc.]

**Citations:**

#### Citation 1: [Evidence Type]
- **Citation ID:** [ID]
- **File:** [Absolute path]
- **Lines:** [Start-End]
- **Evidence Type:** [Direct / Supporting / Indirect / Inference]
- **Confidence Contribution:** [Score]
- **Code Snippet:**
  ```[language]
  [Code with line numbers]
  ```
- **Context:** [Why this code is relevant]
- **Discovered By:** [Agent name]
- **Timestamp:** [When found]
- **Git Branch:** [Branch at time of discovery]
- **File Hash:** [Hash for validation]

#### Citation 2: [Evidence Type]
[Same structure]

**Cross-References:**
- **Knowledge Graph:** [Section in project-knowledge.md]
- **Architectural Context:** [Section in architectural-context.md]
- **Related Findings:** [Other finding IDs]

---

## 🔍 Current Citations

### Research Session 001
**Date:** [Not yet conducted]
**Topic:** [User's research request]
**Total Findings:** 0
**Total Citations:** 0

---

## 📊 Statistics

### Overall Metrics
- **Total Research Sessions:** 0
- **Total Findings Indexed:** 0
- **Total Citations Recorded:** 0
- **Average Citations per Finding:** N/A
- **Most Cited Files:** [List]
- **Most Active Agents:** [List]

### Citation Quality
- **Direct Evidence:** 0 (0%)
- **Supporting Evidence:** 0 (0%)
- **Indirect Evidence:** 0 (0%)
- **Inference:** 0 (0%)
- **Average Confidence:** N/A

### Validity Status
- **Valid Citations:** 0
- **Outdated Citations (file changed):** 0
- **Broken Citations (file missing):** 0
- **Revalidation Needed:** 0

---

## 🔗 Cross-Reference Index

### By File Path
**Status:** Not yet populated

**File: [Path]**
- Referenced by findings: [Finding IDs]
- Total citations: [Count]
- Last analyzed: [Date]

---

### By Agent
**Status:** Not yet populated

**ExploreAgent:**
- Findings: [Count]
- Citations: [Count]
- Average confidence: [Score]

**CitationAgent:**
- Findings: [Count]
- Citations: [Count]
- Average confidence: [Score]

**SecurityAgent:**
- Findings: [Count]
- Citations: [Count]
- Average confidence: [Score]

**PerformanceAgent:**
- Findings: [Count]
- Citations: [Count]
- Average confidence: [Score]

**PatternAgent:**
- Findings: [Count]
- Citations: [Count]
- Average confidence: [Score]

---

### By Category
**Status:** Not yet populated

**Architecture:**
- Findings: [Count]
- Citations: [Count]

**Security:**
- Findings: [Count]
- Citations: [Count]

**Performance:**
- Findings: [Count]
- Citations: [Count]

**Patterns:**
- Findings: [Count]
- Citations: [Count]

**Code Quality:**
- Findings: [Count]
- Citations: [Count]

---

### By Confidence Level
**Status:** Not yet populated

**Very High (0.90+):**
- Findings: [Count]
- Citations: [Count]

**High (0.75-0.89):**
- Findings: [Count]
- Citations: [Count]

**Medium (0.60-0.74):**
- Findings: [Count]
- Citations: [Count]

**Low (0.40-0.59):**
- Findings: [Count]
- Citations: [Count]

**Very Low (<0.40):**
- Findings: [Count]
- Citations: [Count]

---

## 🔄 Citation Lifecycle

### New Citation
1. Agent discovers finding in code
2. CitationAgent extracts source location
3. Citation entry created with:
   - File path (absolute)
   - Line numbers
   - Code snippet (with context)
   - Confidence score
   - Evidence type
   - Timestamp
   - Git branch
   - File hash
4. Citation indexed here
5. Cross-references established

### Citation Validation
- **Automatic revalidation:** Every 24 hours
- **Checks:**
  - File still exists?
  - Line numbers still valid?
  - Code snippet still matches?
  - File hash matches?
- **On validation failure:**
  - Mark citation as "Needs Review"
  - Attempt auto-correction (line shift detection)
  - Flag for manual review if auto-correction fails

### Citation Expiration
- **Default retention:** 90 days
- **Extension:** If cited in recent research (auto-extended)
- **On expiration:**
  - Move to archive (not deleted)
  - Retain for historical reference
  - Can be reactivated if rediscovered

---

## 🛠️ Maintenance Operations

### Revalidation
**Last Run:** [Never]
**Next Scheduled:** [After first research session]

**Revalidation Process:**
1. Check all citations in index
2. Verify file existence
3. Verify line numbers
4. Recalculate file hashes
5. Update validity status
6. Flag issues for review

### Cleanup
**Last Run:** [Never]
**Next Scheduled:** [After first research session]

**Cleanup Process:**
1. Identify expired citations (>90 days, not recently used)
2. Archive expired citations
3. Remove duplicate citations
4. Consolidate related findings

### Migration
**Last Run:** [Never]

**Migration Process (on file refactoring):**
1. Detect file renames/moves (git history)
2. Update citation file paths
3. Revalidate line numbers
4. Update cross-references
5. Log migration actions

---

## 📝 Example Citation Entry

**Finding ID:** RS001-EXP-001
**Finding Description:** Application uses JWT-based authentication with BCrypt password hashing
**Confidence:** 0.95 (Very High)
**Category:** Architecture, Security

**Citations:**

#### Citation 1: Direct Evidence
- **Citation ID:** RS001-EXP-001-CIT-001
- **File:** C:\Projects\MyApp\Services\AuthService.cs
- **Lines:** 15-30
- **Evidence Type:** Direct Evidence
- **Confidence Contribution:** 0.90
- **Code Snippet:**
  ```csharp
  15  public string GenerateJwtToken(User user)
  16  {
  17      var tokenHandler = new JwtSecurityTokenHandler();
  18      var key = Encoding.ASCII.GetBytes(_config["Jwt:Secret"]);
  19      var tokenDescriptor = new SecurityTokenDescriptor
  20      {
  21          Subject = new ClaimsIdentity(new[]
  22          {
  23              new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
  24              new Claim(ClaimTypes.Name, user.Username)
  25          }),
  26          Expires = DateTime.UtcNow.AddHours(24),
  27          SigningCredentials = new SigningCredentials(
  28              new SymmetricSecurityKey(key),
  29              SecurityAlgorithms.HmacSha256Signature)
  30      };
  ```
- **Context:** JWT token generation with 24-hour expiration, HMAC-SHA256 signing
- **Discovered By:** ExploreAgent
- **Timestamp:** 2025-12-28T10:30:00Z
- **Git Branch:** main
- **File Hash:** a3f5c8d9e2b1f0a4c7e9b2d5f8a1c3e6

#### Citation 2: Supporting Evidence
- **Citation ID:** RS001-EXP-001-CIT-002
- **File:** C:\Projects\MyApp\Services\AuthService.cs
- **Lines:** 80-85
- **Evidence Type:** Supporting Evidence
- **Confidence Contribution:** 0.75
- **Code Snippet:**
  ```csharp
  80  public bool ValidatePassword(User user, string password)
  81  {
  82      return BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
  83  }
  84
  85  public string HashPassword(string password)
  ```
- **Context:** BCrypt password verification and hashing
- **Discovered By:** SecurityAgent
- **Timestamp:** 2025-12-28T10:30:05Z
- **Git Branch:** main
- **File Hash:** a3f5c8d9e2b1f0a4c7e9b2d5f8a1c3e6

**Cross-References:**
- **Knowledge Graph:** project-knowledge.md → Security Model → Authentication
- **Architectural Context:** architectural-context.md → Security Architecture → Authentication Architecture
- **Related Findings:** RS001-SEC-001 (Password hashing analysis)

---

## 🔍 Search & Query Examples

### Find all citations for a specific file
```
File: AuthService.cs
→ RS001-EXP-001-CIT-001, RS001-EXP-001-CIT-002, RS001-SEC-001-CIT-001
```

### Find all security-related citations
```
Category: Security
→ RS001-SEC-001, RS001-SEC-002, RS001-SEC-003
```

### Find all high-confidence findings
```
Confidence: >= 0.75
→ RS001-EXP-001 (0.95), RS001-PAT-001 (0.90), RS001-SEC-001 (0.85)
```

### Find citations by specific agent
```
Agent: SecurityAgent
→ RS001-SEC-001, RS001-SEC-002, RS001-SEC-003
```

---

## 📌 Integration Points

### With CitationAgent
- CitationAgent writes all citation entries
- Extracts code snippets with context
- Calculates confidence scores
- Maintains validity status

### With Result Aggregator
- Aggregator references citations when merging findings
- Uses citation confidence for overall confidence calculation
- Deduplicates citations across iterations

### With Knowledge Graph
- Citations provide evidence for knowledge graph facts
- Cross-references link findings to graph sections
- Graph entries include citation IDs for verification

### With Architectural Context
- Citations support architectural understanding claims
- Design rationale backed by cited code
- Evolution tracked through citation timestamps

---

## 🔄 Update Log

### Version 1.0.0 - 2025-12-28
- Initial citation index template created
- Awaiting first research session to populate

---

## 📝 Notes

**Citation Best Practices:**
- Every finding must have at least 1 citation (preferably 2-3)
- Direct evidence citations preferred over inference
- Code snippets include sufficient context (5 lines before/after)
- Absolute paths for cross-platform compatibility
- Regular revalidation maintains accuracy

**Maintenance Schedule:**
- Revalidation: Daily (automated)
- Cleanup: Weekly (automated)
- Archive: Monthly (automated)
- Manual review: As needed (flagged issues)

**Citation Quality Targets:**
- Average confidence: >= 0.75
- Direct evidence: >= 60% of citations
- Valid citations: >= 95%
- Outdated citations: <= 5%

---

**This index grows with each research session, building a comprehensive evidence database for all project knowledge.**
