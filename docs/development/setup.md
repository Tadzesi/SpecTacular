# Development Setup

Set up your development environment to contribute to SpecTacular.

## Prerequisites

### Required

- **Git** - Version control
- **.NET 8 SDK** - For CLI development
- **Node.js 18+** - For extension development
- **VS Code** - Recommended IDE

### Recommended

- **PowerShell 7+** - For installation scripts
- **GitHub CLI** (`gh`) - For PR management
- **Docker** - For containerized testing (optional)

## Clone Repository

```bash
git clone https://github.com/Tadzesi/SpecTacular.git
cd SpecTacular
```

## CLI Development Setup

### Install .NET SDK

```bash
# Download from https://dot.net
dotnet --version  # Verify: 8.0.x
```

### Restore Dependencies

```bash
cd spectacular-cli/Spectacular.Cli
dotnet restore
```

### Build

```bash
dotnet build
```

### Run Tests

```bash
cd ..
dotnet test
```

## Extension Development Setup

### Install Node.js

```bash
# Download from https://nodejs.org
node --version  # Verify: 18.x or higher
npm --version
```

### Install Dependencies

```bash
cd spectacular-vscode
npm install
```

This installs dependencies for both extension and webview.

### Start Development

```bash
npm run watch
```

This starts two watch processes:
- Extension host (TypeScript → JavaScript)
- Webview (React + Vite)

### Open in VS Code

```bash
code .
```

Press `F5` to launch Extension Development Host.

## Project Structure

```
SpecTacular/
├── spectacular-cli/              # CLI tool
│   ├── Spectacular.Cli/
│   └── Spectacular.Cli.Tests/
├── spectacular-vscode/           # VS Code extension
│   ├── src/                      # Extension host
│   └── webview/                  # React UI
├── docs/                         # VitePress documentation
├── .spectacular/                 # Example configuration
└── specs/                        # Example specs
```

## Development Workflow

### CLI Workflow

1. Make changes in `Spectacular.Cli/`
2. Build: `dotnet build`
3. Test: `dotnet test`
4. Run: `dotnet run -- init --help`
5. Install locally: `cd installer && .\install.ps1 -Local`

### Extension Workflow

1. Start watch: `npm run watch`
2. Open in VS Code: `code .`
3. Press `F5` to debug
4. Make changes
5. Reload window (`Ctrl+R`) for extension changes
6. Webview hot-reloads automatically

### Documentation Workflow

1. Navigate to `docs/`
2. Start dev server: `npm run dev`
3. Edit markdown files
4. Preview at http://localhost:5173
5. Build: `npm run build`

## Testing

### CLI Tests

```bash
cd spectacular-cli
dotnet test --logger "console;verbosity=detailed"
```

### Extension Tests

```bash
cd spectacular-vscode
npm test
```

### Webview Tests

```bash
cd spectacular-vscode/webview
npm test
```

### E2E Testing

```bash
# Install test project
cd test-workspace
spectacular init --name "Test"

# Open in VS Code
code .

# Test extension features manually
```

## Debugging

### Debug CLI

In VS Code, create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug CLI",
      "type": "coreclr",
      "request": "launch",
      "program": "${workspaceFolder}/spectacular-cli/Spectacular.Cli/bin/Debug/net8.0/spectacular.exe",
      "args": ["init", "--name", "TestProject"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

### Debug Extension

1. Open `spectacular-vscode/` in VS Code
2. Press `F5`
3. Set breakpoints in `src/*.ts`
4. Test in Extension Development Host

### Debug Webview

1. In Extension Development Host: `Ctrl+Shift+I`
2. Console shows webview logs
3. Sources tab for React debugging

## Common Issues

### .NET SDK Not Found

```bash
# Verify installation
dotnet --version

# If not found, download from https://dot.net
```

### npm install Fails

```bash
# Clear cache and retry
rm -rf node_modules package-lock.json
npm install
```

### Extension Not Activating

Check activation events in `package.json`:

```json
{
  "activationEvents": [
    "workspaceContains:**/.spectacular"
  ]
}
```

### Watch Mode Not Working

```bash
# Restart watch processes
pkill node
npm run watch
```

## Code Style

### C# (CLI)

```csharp
// PascalCase for classes, methods
public class ScaffoldService
{
    // camelCase for parameters
    public async Task ScaffoldAsync(string targetPath)
    {
        // ...
    }
}
```

### TypeScript (Extension)

```typescript
// PascalCase for classes, interfaces
export class DashboardPanel {
    // camelCase for methods, variables
    public async showFile(filePath: string): Promise<void> {
        // ...
    }
}
```

### React (Webview)

```typescript
// PascalCase for components
export const WysiwygEditor: React.FC<Props> = ({ content }) => {
    // camelCase for hooks, variables
    const [isEditing, setIsEditing] = useState(false);

    return <div>...</div>;
};
```

## Git Workflow

### Create Feature Branch

```bash
git checkout -b feature/my-feature
```

### Commit Changes

```bash
git add .
git commit -m "feat: Add feature description

- Detailed change 1
- Detailed change 2"
```

### Push and Create PR

```bash
git push origin feature/my-feature
gh pr create --fill
```

## Next Steps

- [Building](./building) - Build from source
- [Contributing](./contributing) - Contribution guidelines
- [Architecture](/architecture/) - Understand the codebase
