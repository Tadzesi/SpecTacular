---
name: prompt-dotnet
description: C# / .NET project-aware prompt perfection. Use when working on .NET APIs,
             C# classes, Entity Framework, middleware, or any backend C# code. Automatically
             reads project structure, detects framework version and patterns, applies .NET
             best practices without asking what you already have.
argument-hint: "[describe what you want to implement or fix]"
disable-model-invocation: false
---

# /prompt-dotnet — .NET Project-Aware Prompt Perfection

## STARTUP: Scan Project (ALWAYS FIRST)

Before any analysis, read the project to understand what already exists:

1. Find and read `.csproj` file(s) — detect TargetFramework, key NuGet packages
2. Read `Program.cs` — detect: minimal API vs controllers, DI registrations, middleware pipeline, auth setup
3. Check `appsettings.json` — connection strings, config keys
4. Check `Dockerfile` if exists — build/runtime image, publish target
5. Check `docker-compose.yml` if exists — service name, ports, networks
6. Read `project-profile.md` from `.claude/memory/` if exists

Display brief summary:
```
PROJECT SCAN COMPLETE
Framework: [e.g. net10.0]
Architecture: [Minimal API / Controllers]
Auth: [JWT / None / Cookie]
ORM: [EF Core / Dapper / None]
DB: [PostgreSQL / MS SQL / None] — [connection string key]
Docker: [yes/no] — stack: [name if found]
Packages: [key ones: FluentValidation, Serilog, MediatR, etc.]
```

---

## Phase 0: Prompt Perfection

### Step 0.1 — Analyze Input

Detect:
- **Type:** Feature | Bug Fix | Refactor | API endpoint | EF migration | Config | Auth | Other
- **Scope:** Single method | Class | Service | Entire feature | Cross-cutting

### Step 0.2 — Completeness Check (pre-filled from scan)

Use scan results to pre-fill what's already known. Only ask for what's genuinely missing:

| Criterion | Pre-filled? | Source |
|-----------|-------------|--------|
| Framework version | ✓ from .csproj | |
| Architecture pattern | ✓ from Program.cs | |
| Auth mechanism | ✓ from Program.cs | |
| ORM / DB access | ✓ from packages | |
| **Specific goal** | ❓ from user | |
| **Affected files** | ❓ inferred or ask | |
| **Expected behavior** | ❓ from user | |

### Step 0.3 — Clarification (only truly unknown items)

Ask only what the scan could not determine. Example for a typical .NET task — skip any question already answered by the scan.

If multiple valid approaches exist for their stack, present options:
- Mark ⭐ recommended based on what's already in the project (consistency > preference)
- E.g., if project uses FluentValidation, recommend that over DataAnnotations

### Step 0.4 — Apply .NET Best Practices Automatically

Based on detected stack, apply these without asking:

**General .NET 10:**
- Async/await throughout — no `.Result` or `.Wait()`
- `CancellationToken` on all async methods that touch IO
- `ILogger<T>` injection, not static logging
- Nullable reference types — `#nullable enable` if project uses it
- `record` types for DTOs where appropriate
- `IResult` return types for minimal API endpoints

**If EF Core detected:**
- Async methods: `ToListAsync()`, `FirstOrDefaultAsync()`, `SaveChangesAsync()`
- No lazy loading in APIs (N+1 problem) — use `.Include()` explicitly
- Migrations with `dotnet ef migrations add` + `dotnet ef database update`
- `AsNoTracking()` for read-only queries

**If PostgreSQL detected:**
- `Npgsql.EntityFrameworkCore.PostgreSQL` provider conventions
- `snake_case` naming convention if configured
- pgvector operations if `Pgvector` package present

**If MS SQL detected:**
- SQL Server specific types and conventions
- `datetime2` over `datetime`, `nvarchar(max)` awareness

**If JWT detected:**
- `[Authorize]` attribute usage
- Claims extraction patterns
- Token validation in middleware, not in controllers

**If Docker detected:**
- No hardcoded connection strings — use env vars / `IConfiguration`
- Health check endpoints (`/health`) if not already present
- Port from env: `ASPNETCORE_URLS` or `--urls`

**CORS (if detected):**
- Origins from configuration, not hardcoded
- Proper methods/headers for the frontend (React SPA needs: GET, POST, PUT, DELETE + Authorization header)

### Step 0.5 — Perfected Prompt Output

```markdown
**✨ Perfected .NET Prompt:**

**Goal:** [One clear sentence]

**Project Context (from scan):**
- Framework: [net10.0]
- Pattern: [Minimal API / Controllers]
- [Other relevant detected facts]

**Scope:**
- Files to modify: [list]
- Files to create: [list]

**Requirements:**
1. [Requirement with .NET specifics]
2. ...

**Best Practices to Apply:**
- [Specific to their detected stack]

**Expected Result:**
[What the implementation should do/look like]
```

### Step 0.6 — Approval Gate

Wait for: `y` (execute) | `modify` (adjust) | `no` (cancel)

After approval — proceed with implementation following the perfected prompt and detected project conventions.

---

## .NET 10 Quick Reference (apply without asking)

### Minimal API endpoint pattern
```csharp
app.MapGet("/items/{id}", async (int id, IItemService service, CancellationToken ct) =>
{
    var item = await service.GetByIdAsync(id, ct);
    return item is null ? Results.NotFound() : Results.Ok(item);
})
.WithName("GetItem")
.WithOpenApi();
```

### Service registration pattern
```csharp
builder.Services.AddScoped<IItemService, ItemService>();
```

### EF Core async query pattern
```csharp
var items = await _context.Items
    .AsNoTracking()
    .Where(x => x.IsActive)
    .ToListAsync(cancellationToken);
```

### DTO with record
```csharp
public record ItemDto(int Id, string Name, DateTime CreatedAt);
```

---

## Related Commands

- `/prompt-react` — for the React frontend side
- `/deploy` — when ready to deploy to server
- `/prompt-technical` — for broader architectural decisions
