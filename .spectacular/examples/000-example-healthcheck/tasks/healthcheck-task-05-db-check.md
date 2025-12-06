---
type: task
status: done
phase: implementation
created: 2025-12-06
parent: [[healthcheck-tasks]]
prev: [[healthcheck-task-04-controller]]
next: [[healthcheck-task-06-register]]
tags: [task/implementation, status/done]
---

# Task 05: Add Database Connectivity Check

## Navigation

- **Task List**: [[healthcheck-tasks]]
- **Previous Task**: [[healthcheck-task-04-controller]]
- **Next Task**: [[healthcheck-task-06-register]]

---

## Description

Add optional database connectivity check to the health service.

## Acceptance Criteria

- [x] Database check is configurable (can be disabled)
- [x] Check performs simple query (SELECT 1)
- [x] Timeout set to 5 seconds
- [x] Failed DB check marks status as unhealthy

## Files Modified

- `src/health/health.service.ts`

## Implementation Notes

```typescript
async checkDatabase(): Promise<boolean> {
  if (!this.config.checkDatabase) return true;

  try {
    await this.db.query('SELECT 1', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
}
```

---

## Workflow

[[healthcheck-task-04-controller]] → [[healthcheck-task-05-db-check]] → [[healthcheck-task-06-register]]

---

## Links

- **Parent**: [[healthcheck-tasks]]
- **Blocked By**: [[healthcheck-task-03-service]]
- **Requirement**: [[healthcheck-spec#FR-003]]

#task/implementation #status/done #phase/2
