# Tasks: Auto-Installer for Windows

**Branch**: `001-auto-installer`

## Navigation

- **Spec**: [spec.md](./spec.md)
- **Plan**: [plan.md](./plan.md)

---

## Phase 1: Project Setup

| Task | Description | Status |
|------|-------------|--------|
| [[task-01]] | Create .NET 8 CLI project structure | #status/done |
| [[task-02]] | Configure single-file publish with trimming | #status/done |
| [[task-03]] | Set up embedded resources for templates | #status/done |

## Phase 2: CLI Commands

| Task | Description | Status |
|------|-------------|--------|
| [[task-04]] | Implement `spectacular --version` and `--help` | #status/done |
| [[task-05]] | Implement `spectacular init` command | #status/done |
| [[task-06]] | Implement template variable substitution | #status/done |
| [[task-07]] | Add `spectacular update` self-update command | #status/done |

## Phase 3: PowerShell Installer

| Task | Description | Status |
|------|-------------|--------|
| [[task-08]] | Create install.ps1 web installer script | #status/done |
| [[task-09]] | Add PATH modification (user-level) | #status/done |
| [[task-10]] | Handle execution policy and proxy support | #status/done |
| [[task-11]] | Create uninstall.ps1 script | #status/done |

## Phase 4: Testing & Documentation

| Task | Description | Status |
|------|-------------|--------|
| [[task-12]] | Write unit tests for ScaffoldService | #status/done |
| [[task-13]] | Test installation on clean Windows VM | #status/skipped |
| [[task-14]] | Update README with installation instructions | #status/done |
| [[task-15]] | Update CHANGELOG with new feature | #status/done |

## Phase 5: Release

| Task | Description | Status |
|------|-------------|--------|
| [[task-16]] | Build release artifacts for win-x64 | #status/done |
| [[task-17]] | Create GitHub Release with assets | #status/pending |

---

## Progress Summary

| Phase | Total | Done | Remaining |
|-------|-------|------|-----------|
| Setup | 3 | 3 | 0 |
| CLI Commands | 4 | 4 | 0 |
| Installer | 4 | 4 | 0 |
| Testing | 4 | 3 | 1 |
| Release | 2 | 1 | 1 |
| **Total** | **17** | **15** | **2** |

---

#status/complete
