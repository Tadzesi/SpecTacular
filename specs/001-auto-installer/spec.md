# Feature Specification: Auto-Installer for Windows

**Feature Branch**: `001-auto-installer`
**Created**: 2025-12-07
**Status**: Draft

## Summary

Create an auto-installer system for SpecTacular that enables one-liner PowerShell installation (similar to Claude Code's `irm ... | iex` pattern) and provides a `spectacular init` CLI command to scaffold all required files in any project directory.

## User Story

**As a** developer
**I want** to install SpecTacular with a single PowerShell command
**So that** I can quickly set up the specification workflow in any project

### Acceptance Criteria

1. Given a Windows machine with PowerShell, when I run `irm https://[domain]/install.ps1 | iex`, then SpecTacular CLI is installed and available in PATH
2. Given SpecTacular is installed, when I run `spectacular init` in a project folder, then all scaffold files are created
3. Given a corporate network, when I run the installer behind a proxy, then installation completes successfully
4. Given the CLI is installed, when I run `spectacular --version`, then the version number is displayed

## Requirements

- REQ-1: PowerShell install script must handle execution policy gracefully
- REQ-2: CLI tool must be a .NET 8 self-contained executable (no runtime dependency)
- REQ-3: `spectacular init` must create: `.spectacular/`, `.claude/commands/`, `specs/`, `CLAUDE.md`
- REQ-4: Installation must add CLI to user PATH (not require admin)
- REQ-5: Support proxy/firewall environments via standard environment variables

## Success Criteria

- Fresh Windows 10/11 machine can install via one-liner
- `spectacular init` creates identical structure to `setup-spectacular.ps1`
- No admin privileges required for installation
- Works behind corporate proxy when `HTTP_PROXY` is set

## Notes

- Consider cross-platform support (macOS/Linux) as future enhancement
- .NET 8 allows single-file publish with trimming for small executable size
- Dashboard Electron app installation is out of scope (focus on scaffold only)
