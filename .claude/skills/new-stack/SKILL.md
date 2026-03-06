---
name: new-stack
description: Scaffold a new Docker stack for the Linux home server following the
             established pattern (nginx + .NET API + React frontend + stack-internal
             network). Use when starting a new application to deploy on the server.
argument-hint: "[stack-name]"
disable-model-invocation: true
---

# /new-stack — Docker Stack Scaffold

## STARTUP: Load Server Config (ALWAYS FIRST)

Read `~/.claude/memory/personal-profile.md` for:
- `SERVER_HOST`, `SERVER_USER`, `SERVER_STACKS_PATH`
- `POSTGRES_STACK` — which stack hosts the shared PostgreSQL instance
- `FRONTEND_NETWORK` — shared frontend network name
- `INFRASTRUCTURE_NETWORK` — shared infrastructure network name
- Next available port from `ALLOCATED_PORTS` list

If personal-profile.md missing:
```
Run /install-personal-profile first to set up your server config.
```

---

## Phase 0: Gather Stack Requirements

Ask only what's needed to scaffold correctly:

**1. Stack name** (if not provided as argument):
- Must be lowercase, kebab-case: `my-app`
- Will be used as: directory name, container prefix, nginx alias, subdomain

**2. Components** (select all that apply):
- [ ] .NET API backend
- [ ] React frontend (Vite SPA)
- [ ] PostgreSQL database (new isolated DB in shared PostgreSQL instance, or new container)
- [ ] nginx reverse proxy (almost always yes)

**3. Access:**
- [ ] Public (via Cloudflare Tunnel — adds to `lab463-web` nginx config)
- [ ] Local only (via `*.463.vinne` subdomain)
- [ ] Both

**4. Port** (suggest next available based on `ALLOCATED_PORTS`):
- Format: `3006:80` for nginx, `8080` internal for API

---

## Scaffold Output

Generate all files for the new stack:

### `docker-compose.yml`
```yaml
services:
  [stack-name]-nginx:
    image: nginx:alpine
    container_name: [stack-name]-nginx
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./frontend:/usr/share/nginx/html:ro      # if React frontend
    ports:
      - "[PORT]:80"
    networks:
      - frontend
      - [stack-name]-internal
    depends_on:
      - [stack-name]-api
    restart: unless-stopped

  [stack-name]-api:
    image: [stack-name]-api
    container_name: [stack-name]-api
    build:
      context: .
      dockerfile: Dockerfile.api
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=${DB_CONNECTION_STRING}
    networks:
      - [stack-name]-internal
      - linkvault-internal    # if using shared PostgreSQL
    restart: unless-stopped

networks:
  frontend:
    external: true
  [stack-name]-internal:
    driver: bridge
  linkvault-internal:   # if using shared PostgreSQL
    external: true
```

### `nginx.conf`
```nginx
server {
    listen 80;
    server_name _;

    # API
    location /api/ {
        proxy_pass http://[stack-name]-api:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # React SPA
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

### `Dockerfile.api`
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY ./publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "[AppName].Api.dll"]
```

### `.env`
```bash
# [stack-name] environment variables
# DO NOT COMMIT THIS FILE

DB_CONNECTION_STRING=Host=postgresql-db;Database=[stack-name];Username=postgres;Password=YOUR_DB_PASSWORD
# Add other secrets below
```

### `.gitignore`
```
.env
publish/
frontend/
```

### `deploy.sh` (local deploy script)
```bash
#!/bin/bash
# Deploy [stack-name] to server
set -e

SERVER="[SERVER_USER]@[SERVER_HOST]"
STACK_PATH="[SERVER_STACKS_PATH]/[stack-name]"

echo "Building React frontend..."
cd frontend-src && npm run build && cd ..
echo "Copying frontend..."
scp -r frontend-src/dist/* "$SERVER:$STACK_PATH/frontend/"

echo "Publishing .NET API..."
cd src/[AppName].Api && dotnet publish -c Release -r linux-x64 --self-contained false -o ./publish && cd ../..
echo "Copying API..."
scp -r src/[AppName].Api/publish/* "$SERVER:$STACK_PATH/publish/"

echo "Rebuilding and restarting on server..."
ssh "$SERVER" "cd $STACK_PATH && docker compose build && docker compose up -d"

echo "Done!"
ssh "$SERVER" "docker compose -f $STACK_PATH/docker-compose.yml ps"
```

---

## Server Setup Instructions

After generating files, show these commands to run on the server:

```bash
# 1. Create stack directory
mkdir -p [SERVER_STACKS_PATH]/[stack-name]/{publish,frontend}

# 2. Copy generated files to server
scp docker-compose.yml nginx.conf Dockerfile.api .env \
  [SERVER_USER]@[SERVER_HOST]:[SERVER_STACKS_PATH]/[stack-name]/

# 3. Create database on PostgreSQL (if using shared instance)
ssh [SERVER_USER]@[SERVER_HOST] \
  "docker exec postgresql-db psql -U postgres -c 'CREATE DATABASE [stack-name];'"

# 4. First deploy (after copying binaries and frontend)
ssh [SERVER_USER]@[SERVER_HOST] \
  "cd [SERVER_STACKS_PATH]/[stack-name] && docker compose build && docker compose up -d"

# 5. If public access — add to lab463-web nginx.conf:
#    location /[stack-name]/ {
#        proxy_pass http://[stack-name]:80/;
#    }
# Then: docker exec lab463-web nginx -s reload
```

---

## Related Commands

- `/deploy` — after scaffold is built, use this to deploy
- `/prompt-dotnet` — to implement the .NET API
- `/prompt-react` — to implement the React frontend
