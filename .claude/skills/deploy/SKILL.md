---
name: deploy
description: Deploy a .NET + React application to the Linux home server. Scans the
             project to determine what needs to be built and deployed, generates the
             exact commands. Use when you are ready to deploy a stack update.
argument-hint: "[stack-name or leave empty to auto-detect]"
disable-model-invocation: true
---

# /deploy — Project-Aware Deployment Workflow

## STARTUP: Scan Project + Load Server Config (ALWAYS FIRST)

**Step 1 — Read personal server config:**
Read `~/.claude/memory/personal-profile.md` for:
- `SERVER_HOST` — server IP or hostname
- `SERVER_USER` — SSH username
- `SERVER_STACKS_PATH` — path to stacks directory on server (e.g. `~/server/stacks/`)

If file doesn't exist or fields are missing:
```
MISSING PERSONAL PROFILE
Create ~/.claude/memory/personal-profile.md with your server details.
Template: https://github.com/Tadzesi/claude-ideas/blob/main/.claude/templates/personal-profile.md
```

**Step 2 — Scan current project:**
- Check `docker-compose.yml` → stack name (service names, networks)
- Check for `.csproj` files → .NET API present? Which `publish` runtime target?
- Check `package.json` → React frontend present? Build script? base path?
- Check `Dockerfile` / `Dockerfile.api` → runtime image, published path
- Check `nginx.conf` → routing structure
- Check `project-profile.md` → stack name override, deploy notes

Display:
```
DEPLOY SCAN COMPLETE
Stack: [detected name]
Server: [SERVER_USER]@[SERVER_HOST]
Remote path: [SERVER_STACKS_PATH]/[stack-name]/

Components to deploy:
  [✓] .NET API — dotnet publish -r linux-x64 → [publish path]
  [✓] React frontend — npm run build → dist/
  [ ] nginx config — unchanged / needs update

Estimated steps: [N]
```

---

## Deploy Process

### Phase 1 — Pre-deploy Checks

Before generating commands, verify:

1. **Git status** — any uncommitted changes? Warn if yes (user decides)
2. **Build validation:**
   - .NET: `dotnet build` passes?
   - React: TypeScript errors? (`npm run build` dry check)
3. **Env vars** — does `.env` exist with required keys?

Show results, proceed only after user confirms: `y`

### Phase 2 — Generate Deploy Commands

Generate the complete deploy sequence based on scan. Example output for .NET API + React stack:

```bash
# ═══════════════════════════════════════════════
# DEPLOY: [stack-name] → [SERVER_USER]@[SERVER_HOST]
# ═══════════════════════════════════════════════

# 1. Build React frontend
cd [frontend-path]
npm run build

# 2. Upload frontend to server
scp -r dist/* [SERVER_USER]@[SERVER_HOST]:[SERVER_STACKS_PATH]/[stack-name]/frontend/

# 3. Publish .NET API (linux-x64)
cd [api-path]
dotnet publish -c Release -r linux-x64 --self-contained false -o ./publish

# 4. Upload API binaries
scp -r ./publish/* [SERVER_USER]@[SERVER_HOST]:[SERVER_STACKS_PATH]/[stack-name]/publish/

# 5. Build and restart Docker stack on server
ssh [SERVER_USER]@[SERVER_HOST] "cd [SERVER_STACKS_PATH]/[stack-name] && docker compose build && docker compose up -d"

# 6. Verify containers are running
ssh [SERVER_USER]@[SERVER_HOST] "docker compose -f [SERVER_STACKS_PATH]/[stack-name]/docker-compose.yml ps"
```

**Adapt based on scan:**
- Only React (no .NET) → skip steps 3-4
- Only .NET (no React) → skip steps 1-2
- Static files volume-mounted → skip Docker build, just `docker exec [nginx] nginx -s reload`
- Has DB migrations → add `dotnet ef database update` step on server

### Phase 3 — Execute or Copy

Ask: **Execute commands now, or copy to clipboard?**

- `run` → Execute each step sequentially, stop on error, show output
- `copy` → Output full bash script ready to paste in terminal
- `script` → Save as `deploy.sh` in project root

### Phase 4 — Post-deploy Verification

After deployment:

```bash
# Check all containers running
ssh [SERVER_USER]@[SERVER_HOST] "docker ps | grep [stack-name]"

# Quick HTTP health check (if endpoint exists)
curl -s -o /dev/null -w "%{http_code}" https://[your-domain]/[stack-name]/api/health
```

Show results, flag any issues.

---

## Adapters for Different Deploy Scenarios

### Scenario: Static files only (volume-mounted nginx)
```bash
# No rebuild needed — just reload nginx
ssh [SERVER_USER]@[SERVER_HOST] "docker exec [nginx-container] nginx -s reload"
```

### Scenario: Pre-compiled binaries only (no SDK on server)
```bash
# Compile locally → SCP binaries → docker compose build (Dockerfile uses pre-built binaries)
dotnet publish -c Release -r linux-x64 --self-contained false -o ./publish
scp -r ./publish/* [SERVER_USER]@[SERVER_HOST]:[SERVER_STACKS_PATH]/[stack]/publish/
ssh [SERVER_USER]@[SERVER_HOST] "cd [SERVER_STACKS_PATH]/[stack] && docker compose build api && docker compose up -d api"
```

### Scenario: Cloudflare cache bust after deploy
```bash
# Clear Cloudflare cache for domain (requires CF_API_TOKEN in personal-profile.md)
curl -X POST "https://api.cloudflare.com/client/v4/zones/[CF_ZONE_ID]/purge_cache" \
  -H "Authorization: Bearer [CF_API_TOKEN]" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

---

## Related Commands

- `/prompt-dotnet` — fix/implement before deploying the API
- `/prompt-react` — fix/implement before deploying the frontend
- `/new-stack` — scaffold a new stack to deploy to
