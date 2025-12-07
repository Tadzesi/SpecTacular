# Implementation Plan: Auto-Installer for Windows

**Branch**: `001-auto-installer` | **Date**: 2025-12-07

## Summary

Build a .NET 8 CLI tool (`spectacular.exe`) distributed via PowerShell web installer. The CLI embeds all scaffold templates as resources and extracts them during `init`.

## Technical Context

**Language**: C# 12 / .NET 8
**Build**: Single-file publish with trimming (AOT optional)
**Distribution**: GitHub Releases + raw PowerShell script
**Testing**: xUnit with file system mocking

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Installation Flow                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User runs:                                                      │
│  irm https://raw.githubusercontent.com/.../install.ps1 | iex    │
│                                                                  │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────┐                                            │
│  │  install.ps1    │                                            │
│  │  - Check prereqs│                                            │
│  │  - Download exe │                                            │
│  │  - Add to PATH  │                                            │
│  └────────┬────────┘                                            │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐     ┌──────────────────────────────┐       │
│  │ spectacular.exe │────►│ %USERPROFILE%\.spectacular\  │       │
│  │ (in PATH)       │     │ └── bin\spectacular.exe      │       │
│  └─────────────────┘     └──────────────────────────────┘       │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     CLI Commands                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  spectacular init [--name <project>] [--tech <stack>]           │
│      │                                                          │
│      ├─► .spectacular/                                          │
│      │   ├── templates/        (7 template files)               │
│      │   ├── memory/           (constitution.md)                │
│      │   ├── scripts/powershell/ (6 PS1 scripts)                │
│      │   └── prompts/          (6 prompt files)                 │
│      │                                                          │
│      ├─► .claude/                                               │
│      │   ├── commands/         (6 slash commands)               │
│      │   └── tasks/            (index.md, backlog.md, etc.)     │
│      │                                                          │
│      ├─► specs/                (empty, ready for features)      │
│      │                                                          │
│      └─► CLAUDE.md             (project instructions)           │
│                                                                  │
│  spectacular --version                                          │
│  spectacular --help                                             │
│  spectacular update           (self-update from GitHub)         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
spectacular-cli/                    # New .NET project
├── Spectacular.Cli/
│   ├── Program.cs                  # Entry point, command parsing
│   ├── Commands/
│   │   ├── InitCommand.cs          # spectacular init
│   │   ├── UpdateCommand.cs        # spectacular update
│   │   └── VersionCommand.cs       # spectacular --version
│   ├── Services/
│   │   ├── ScaffoldService.cs      # File extraction & generation
│   │   ├── PathService.cs          # PATH manipulation
│   │   └── TemplateService.cs      # Template variable replacement
│   ├── Resources/
│   │   └── templates/              # Embedded scaffold files
│   └── Spectacular.Cli.csproj
├── Spectacular.Cli.Tests/
│   └── ...
└── install.ps1                     # Web installer script

installer/                          # PowerShell installer
├── install.ps1                     # Main installer (downloadable)
└── uninstall.ps1                   # Clean removal script
```

## Key Components

### 1. install.ps1 (PowerShell Installer)

```powershell
# Core responsibilities:
# 1. Detect architecture (x64/arm64)
# 2. Check for .NET runtime (warn if missing, but not required for AOT)
# 3. Create ~/.spectacular/bin directory
# 4. Download latest release from GitHub
# 5. Add to user PATH if not present
# 6. Verify installation with `spectacular --version`
```

### 2. InitCommand (C# CLI)

```csharp
// Core responsibilities:
// 1. Detect current directory or use --path
// 2. Check for existing .spectacular (warn/skip if exists)
// 3. Extract embedded resources to target paths
// 4. Replace template variables (PROJECT_NAME, TECH_STACK, DATE)
// 5. Report created files
```

### 3. Embedded Resources

All scaffold files from `.spectacular/` will be embedded as resources:
- Templates (7 files): spec-template.md, plan-template.md, etc.
- Scripts (6 files): create-new-feature.ps1, validate-implementation.ps1, etc.
- Commands (6 files): spectacular.0-quick.md through spectacular.5-validate.md
- Memory (1 file): constitution.md

## Build & Distribution

### Single-File Publish Command

```bash
dotnet publish -c Release -r win-x64 --self-contained true \
  -p:PublishSingleFile=true \
  -p:EnableCompressionInSingleFile=true \
  -p:IncludeNativeLibrariesForSelfExtract=true
```

### GitHub Release Structure

```
spectacular-v1.0.0/
├── spectacular-win-x64.exe      # Windows x64
├── spectacular-win-arm64.exe    # Windows ARM64
├── install.ps1                  # Installer script
├── checksums.sha256             # File integrity
└── CHANGELOG.md
```

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| PATH modification fails | User can't run CLI | Provide manual instructions, test extensively |
| Corporate firewall blocks | Install fails | Support HTTP_PROXY, provide offline install option |
| Antivirus flags exe | User confusion | Sign executable, document false positive handling |
| Large executable size | Slow download | Use trimming, compression; target <15MB |

## Dependencies

- **System.CommandLine** - CLI argument parsing
- **Microsoft.Extensions.FileProviders.Embedded** - Resource extraction
