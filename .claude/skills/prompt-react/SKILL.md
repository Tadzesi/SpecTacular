---
name: prompt-react
description: React / Vite project-aware prompt perfection. Use when working on React
             components, hooks, state management, routing, or frontend build config.
             Automatically reads package.json, vite.config, tsconfig and applies
             current React best practices without asking what you already have.
argument-hint: "[describe what you want to implement or fix]"
disable-model-invocation: false
---

# /prompt-react — React Project-Aware Prompt Perfection

## STARTUP: Scan Project (ALWAYS FIRST)

Before any analysis, read the project to understand what already exists:

1. Read `package.json` — React version, key dependencies (Router, Query, Zustand, etc.), scripts
2. Read `vite.config.ts` / `vite.config.js` — base path, plugins, proxy config, build output
3. Read `tsconfig.json` — strict mode, paths aliases, target
4. Check `src/` structure — pages/, components/, hooks/, services/, types/
5. Check if `.env` / `.env.production` exists — API URL patterns
6. Read `project-profile.md` from `.claude/memory/` if exists

Display brief summary:
```
PROJECT SCAN COMPLETE
React: [version] | TypeScript: [yes/no, strict: yes/no]
Router: [React Router v6 / TanStack Router / none]
State: [Zustand / Redux / Context / none]
Data fetching: [TanStack Query / SWR / axios / fetch]
Base path: [/ or /appname/]
API proxy: [configured target or none]
Build output: [dist/]
```

---

## Phase 0: Prompt Perfection

### Step 0.1 — Analyze Input

Detect:
- **Type:** New component | Hook | Page | API integration | State | Routing | Build config | Bug fix
- **Scope:** Single component | Feature | Cross-cutting (auth, error handling, etc.)

### Step 0.2 — Completeness Check (pre-filled from scan)

Use scan results to pre-fill what's already known:

| Criterion | Pre-filled? | Source |
|-----------|-------------|--------|
| React version + TS | ✓ from package.json | |
| Routing library | ✓ from deps | |
| State management | ✓ from deps | |
| Base path / API URL | ✓ from vite.config | |
| **Specific goal** | ❓ from user | |
| **Component location** | ❓ inferred or ask | |
| **Expected behavior** | ❓ from user | |

### Step 0.3 — Clarification (only truly unknown)

Skip anything the scan already answered. If multiple valid approaches exist:
- Mark ⭐ recommended based on what's already in the project (match existing patterns)
- E.g., if project uses TanStack Query, recommend that over raw fetch

### Step 0.4 — Apply React Best Practices Automatically

Based on detected stack, apply these without asking:

**General React (all versions):**
- Functional components only — no class components
- Custom hooks for reusable logic (`use` prefix)
- Proper `useEffect` cleanup for subscriptions, timers, abort controllers
- `key` prop on list items — use stable IDs, never array index

**If TypeScript detected:**
- Explicit return types on components: `React.FC` or explicit `JSX.Element`
- `interface` for props, `type` for unions/aliases
- No `any` — use `unknown` and narrow, or proper generics
- Strict null checks — handle `undefined` / `null` explicitly

**If React Router v6 detected:**
- `useNavigate` not `useHistory`
- `<Outlet />` for nested routes
- `loader` / `action` for data-fetching patterns if using v6.4+
- `Navigate` component for declarative redirects

**If TanStack Query detected:**
- `useQuery` for reads, `useMutation` for writes
- Proper `queryKey` arrays (hierarchical: `['items', id]`)
- Invalidate related queries after mutations
- Loading/error states handled at component level

**If Vite detected:**
- Environment variables: `import.meta.env.VITE_*` (not `process.env`)
- Base path: `import.meta.env.BASE_URL` for asset paths
- Dynamic imports for code splitting: `React.lazy(() => import('./Page'))`

**If base path is `/appname/` (SPA under subpath):**
- Router basename must match: `<BrowserRouter basename="/appname">`
- All `href` and navigation relative — no hardcoded `/` roots
- Build: `vite build` with `base: '/appname/'` in config

**API calls:**
- Use base URL from env var, not hardcoded
- AbortController for cancellable requests
- Centralized API client (axios instance or fetch wrapper) — not raw fetch everywhere

**Error handling:**
- Error boundaries for production (`<ErrorBoundary>`)
- Meaningful error states in UI, not just console.error

### Step 0.5 — Perfected Prompt Output

```markdown
**✨ Perfected React Prompt:**

**Goal:** [One clear sentence]

**Project Context (from scan):**
- React [version] + TypeScript [strict/lenient]
- [Router, state, data fetching detected]
- Base path: [/appname/]

**Scope:**
- Files to create/modify: [list with paths]

**Requirements:**
1. [Requirement with React specifics]
2. ...

**Best Practices to Apply:**
- [Specific to their detected stack]

**Expected Result:**
[What it should look like / how to verify]
```

### Step 0.6 — Approval Gate

Wait for: `y` (execute) | `modify` (adjust) | `no` (cancel)

After approval — implement following perfected prompt and project conventions.

---

## React Quick Reference (apply without asking)

### Component with TypeScript
```tsx
interface Props {
  id: number;
  onClose: () => void;
}

export function ItemDetail({ id, onClose }: Props) {
  // ...
}
```

### Custom hook pattern
```tsx
function useItem(id: number) {
  const [data, setData] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetchItem(id, controller.signal)
      .then(setData)
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [id]);

  return { data, loading };
}
```

### TanStack Query pattern
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['items', id],
  queryFn: () => api.getItem(id),
});
```

---

## Related Commands

- `/prompt-dotnet` — for the C# API backend
- `/deploy` — when ready to build and deploy to server
- `/prompt-technical` — for architectural decisions
