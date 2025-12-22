# Building SpecTacular

This guide covers building both the CLI tool and VS Code extension from source.

## Prerequisites

### For CLI Development

- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Git** - For cloning the repository
- **PowerShell** - For installation scripts (Windows)

### For Extension Development

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** - Comes with Node.js
- **VS Code** - [Download](https://code.visualstudio.com/)
- **Git** - For cloning the repository

## Clone Repository

```bash
git clone https://github.com/Tadzesi/SpecTacular.git
cd SpecTacular
```

## Building the CLI

### Development Build

```powershell
cd spectacular-cli/Spectacular.Cli
dotnet build
```

**Output:** `bin/Debug/net8.0/spectacular.exe`

### Release Build

```powershell
dotnet build -c Release
```

**Output:** `bin/Release/net8.0/spectacular.exe`

### Publish Single-File Executable

```powershell
dotnet publish -c Release -r win-x64 -o ../publish/win-x64
```

**Output:** `spectacular-cli/publish/win-x64/spectacular.exe`

**Options:**
- `-c Release` - Release configuration
- `-r win-x64` - Target Windows x64
- `-o <path>` - Output directory
- `--self-contained` - Include .NET runtime (already configured)
- `/p:PublishSingleFile=true` - Single file (already configured)
- `/p:PublishTrimmed=true` - Trim unused code (already configured)

### Run Locally

```powershell
# Run from source
dotnet run -- init --help

# Or run published executable
..\publish\win-x64\spectacular.exe --version
```

### Install Locally for Testing

```powershell
cd ..\installer
.\install.ps1 -Local
```

This installs from `../publish/win-x64/` instead of downloading from GitHub.

**Verify:**
```bash
spectacular --version
```

### Run Tests

```powershell
cd ..  # Back to spectacular-cli/
dotnet test
```

**With coverage:**
```powershell
dotnet test --collect:"XPlat Code Coverage"
```

## Building the VS Code Extension

### Install Dependencies

```bash
cd spectacular-vscode
npm install
```

This installs dependencies for both the extension and webview.

### Development Build

**Watch mode (recommended for development):**
```bash
npm run watch
```

This starts two watch processes:
- Extension host compilation (TypeScript)
- Webview compilation (React + Vite)

**Single build:**
```bash
npm run compile
```

### Build Components Separately

**Extension host only:**
```bash
npm run compile:extension
```

**Webview only:**
```bash
npm run compile:webview
```

### Run Extension in Development

1. Open `spectacular-vscode/` in VS Code
2. Press `F5` (or Run → Start Debugging)
3. Extension Development Host window opens
4. Test your changes

**Hot reload:**
- Webview changes hot-reload automatically
- Extension host changes require window reload (`Ctrl+R`)

### Package Extension

Create a `.vsix` file for distribution:

```bash
npm run package
```

**Output:** `spectacular-dashboard-1.6.4.vsix`

**Install packaged extension:**
```bash
code --install-extension spectacular-dashboard-1.6.4.vsix
```

### Run Tests

**Extension tests:**
```bash
npm test
```

**Webview tests:**
```bash
cd webview
npm test
```

## Project Structure

### CLI Structure

```
spectacular-cli/
├── Spectacular.Cli/              # Main project
│   ├── Commands/                 # CLI commands
│   │   ├── InitCommand.cs
│   │   └── UpdateCommand.cs
│   ├── Services/                 # Business logic
│   │   ├── ScaffoldService.cs
│   │   ├── TemplateService.cs
│   │   └── ConfigService.cs
│   ├── Resources/templates/      # Embedded resources
│   │   ├── .claude/
│   │   ├── .spectacular/
│   │   └── CLAUDE.md
│   ├── Program.cs                # Entry point
│   └── Spectacular.Cli.csproj    # Project file
├── Spectacular.Cli.Tests/        # Unit tests
│   └── ...
├── publish/                      # Build output (gitignored)
└── installer/
    └── install.ps1               # Installation script
```

### Extension Structure

```
spectacular-vscode/
├── src/                          # Extension host (TypeScript)
│   ├── extension.ts              # Entry point
│   ├── DashboardPanel.ts         # Main webview panel
│   ├── DashboardViewProvider.ts  # Sidebar provider
│   ├── SpecsTreeProvider.ts      # Tree view
│   ├── TaskStatusService.ts      # Auto-status logic
│   ├── FileDecorationProvider.ts # Modified indicators
│   ├── VersionCheckService.ts    # Update checker
│   └── fileOperations.ts         # File utilities
├── webview/                      # React UI
│   ├── src/
│   │   ├── App.tsx               # Main React component
│   │   ├── components/           # UI components (13 files)
│   │   ├── hooks/                # Custom hooks (5 files)
│   │   ├── contexts/             # React contexts
│   │   └── utils/                # Utilities
│   ├── public/                   # Static assets
│   ├── package.json              # Webview dependencies
│   ├── vite.config.ts            # Vite configuration
│   └── tsconfig.json             # TypeScript config
├── dist/                         # Build output (gitignored)
├── package.json                  # Extension dependencies
├── tsconfig.json                 # Extension TypeScript config
└── esbuild.js                    # Build script
```

## Build Scripts

### CLI Scripts

**Defined in:** `Spectacular.Cli.csproj`

```xml
<PropertyGroup>
  <OutputType>Exe</OutputType>
  <TargetFramework>net8.0</TargetFramework>
  <PublishSingleFile>true</PublishSingleFile>
  <SelfContained>true</SelfContained>
  <PublishTrimmed>true</PublishTrimmed>
  <RuntimeIdentifier>win-x64</RuntimeIdentifier>
</PropertyGroup>
```

### Extension Scripts

**Defined in:** `spectacular-vscode/package.json`

```json
{
  "scripts": {
    "compile": "npm run compile:extension && npm run compile:webview",
    "compile:extension": "node esbuild.js",
    "compile:webview": "cd webview && npm run build",
    "watch": "concurrently \"npm run watch:extension\" \"npm run watch:webview\"",
    "watch:extension": "node esbuild.js --watch",
    "watch:webview": "cd webview && npm run dev",
    "package": "vsce package",
    "publish": "vsce publish",
    "test": "node ./out/test/runTest.js"
  }
}
```

## Development Workflow

### CLI Workflow

1. **Make changes** to source files
2. **Build:** `dotnet build`
3. **Test:** `dotnet test`
4. **Run:** `dotnet run -- <command>`
5. **Publish:** `dotnet publish -c Release -r win-x64`
6. **Install locally:** `cd installer && .\install.ps1 -Local`
7. **Test installed:** `spectacular --version`

### Extension Workflow

1. **Start watch mode:** `npm run watch`
2. **Open in VS Code:** Open `spectacular-vscode/` folder
3. **Start debugging:** Press `F5`
4. **Make changes:**
   - Extension host: Edit `src/*.ts` → Reload window (`Ctrl+R`)
   - Webview: Edit `webview/src/*.tsx` → Auto hot-reload
5. **Test changes** in Extension Development Host
6. **Run tests:** `npm test`
7. **Package:** `npm run package`

## Common Build Issues

### CLI Issues

**Issue:** `error NU1101: Unable to find package`

**Solution:**
```powershell
dotnet restore
dotnet build
```

**Issue:** `.NET SDK not found`

**Solution:** Install .NET 8 SDK from https://dot.net

**Issue:** `Embedded resource not found`

**Solution:** Check .csproj file:
```xml
<ItemGroup>
  <EmbeddedResource Include="Resources\templates\**\*" />
</ItemGroup>
```

### Extension Issues

**Issue:** `npm install` fails

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue:** Webview not loading

**Solution:**
```bash
cd webview
rm -rf node_modules dist
npm install
npm run build
cd ..
npm run compile:extension
```

**Issue:** Extension not activating

**Solution:** Check `package.json` activation events:
```json
{
  "activationEvents": [
    "workspaceContains:**/.spectacular",
    "workspaceContains:**/specs"
  ]
}
```

**Issue:** TypeScript errors

**Solution:**
```bash
# Extension
npm run compile:extension

# Webview
cd webview
npm run build
```

## Performance Optimization

### CLI Optimizations

**Build for size:**
```powershell
dotnet publish -c Release -r win-x64 /p:PublishTrimmed=true /p:TrimMode=Link
```

**Build for speed:**
```powershell
dotnet publish -c Release -r win-x64 /p:PublishReadyToRun=true
```

### Extension Optimizations

**Minified build:**
```bash
# Already configured in vite.config.ts
npm run compile:webview
```

**Bundle analysis:**
```bash
cd webview
npm run build -- --mode analyze
```

## Debugging

### Debug CLI

**VS Code launch.json:**
```json
{
  "type": "coreclr",
  "request": "launch",
  "name": "Debug CLI",
  "program": "${workspaceFolder}/spectacular-cli/Spectacular.Cli/bin/Debug/net8.0/spectacular.exe",
  "args": ["init", "--name", "TestProject"],
  "cwd": "${workspaceFolder}",
  "console": "integratedTerminal"
}
```

### Debug Extension

**Built-in debugger:**
1. Press `F5` in VS Code
2. Set breakpoints in `src/*.ts`
3. Breakpoints hit when extension runs

**Debug webview:**
1. In Extension Development Host: View → Developer Tools
2. Console tab shows webview logs
3. Sources tab for debugging React code

### Debug Tests

**CLI tests:**
```powershell
dotnet test --logger "console;verbosity=detailed"
```

**Extension tests:**
```bash
npm test -- --debug
```

## Continuous Integration

### GitHub Actions (Example)

```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  cli:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-dotnet@v3
        with:
          dotnet-version: '8.0.x'
      - run: cd spectacular-cli && dotnet build
      - run: cd spectacular-cli && dotnet test

  extension:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd spectacular-vscode && npm ci
      - run: cd spectacular-vscode && npm run compile
      - run: cd spectacular-vscode && npm test
```

## Next Steps

- [Testing Guide](./testing) - How to test your changes
- [Contributing](./contributing) - Contribution guidelines
- [Release Process](./release-process) - How releases are made
- [Architecture](/architecture/) - Understand the codebase
