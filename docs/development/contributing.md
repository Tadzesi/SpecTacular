# Contributing to SpecTacular

Thank you for considering contributing to SpecTacular! This guide will help you get started.

## Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest features
- 📝 Improve documentation
- 🔧 Fix issues
- ✨ Add new features
- 🧪 Write tests

## Getting Started

1. **Fork the repository**
2. **Clone your fork:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SpecTacular.git
   ```
3. **Set up development environment:** See [Development Setup](./setup)
4. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

### 1. Find or Create an Issue

- Check [existing issues](https://github.com/Tadzesi/SpecTacular/issues)
- Create a new issue if needed
- Comment on the issue to claim it

### 2. Make Changes

- Follow code style guidelines
- Write tests for new features
- Update documentation
- Keep commits focused and atomic

### 3. Test Your Changes

**CLI:**
```bash
cd spectacular-cli
dotnet test
dotnet build
```

**Extension:**
```bash
cd spectacular-vscode
npm test
npm run compile
```

### 4. Commit

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add user authentication

- Implement JWT token generation
- Add login endpoint
- Update documentation"
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` Code style (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style

### C# (CLI)

- PascalCase for public members
- camelCase for private fields
- Use `async`/`await` for I/O operations
- Add XML comments for public APIs

```csharp
/// <summary>
/// Scaffolds a new project structure
/// </summary>
/// <param name="targetPath">Target directory path</param>
public async Task ScaffoldAsync(string targetPath)
{
    // Implementation
}
```

### TypeScript (Extension/Webview)

- PascalCase for types, interfaces, classes
- camelCase for variables, functions
- Use type annotations
- Prefer `const` over `let`

```typescript
interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'folder';
}

const buildFileTree = (rootPath: string): FileNode[] => {
    // Implementation
};
```

### React

- Functional components with hooks
- Props interfaces clearly defined
- Use TypeScript

```typescript
interface EditorProps {
    content: string;
    onChange: (content: string) => void;
}

export const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
    // Implementation
};
```

## Testing Guidelines

### CLI Tests

```csharp
[Fact]
public async Task ScaffoldService_CreatesExpectedFiles()
{
    // Arrange
    var service = new ScaffoldService();

    // Act
    var result = await service.ScaffoldAsync(testPath, "TestProject");

    // Assert
    Assert.True(File.Exists(Path.Combine(testPath, "CLAUDE.md")));
}
```

### Extension Tests

```typescript
test('Dashboard panel creates webview', () => {
    const panel = DashboardPanel.createOrShow(extensionUri);
    expect(panel).toBeDefined();
});
```

## Documentation

### Update Documentation

When adding features:
1. Update relevant `/docs` pages
2. Add code examples
3. Update changelog
4. Add JSDoc/XML comments

### Documentation Style

- Use clear, concise language
- Include code examples
- Add diagrams for complex flows (Mermaid)
- Keep formatting consistent

## Pull Request Guidelines

### PR Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Commits follow conventional format
- [ ] All tests pass
- [ ] No merge conflicts

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How to test the changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Related Issues
Closes #123
```

## Review Process

1. **Automated checks** run on PR
2. **Maintainer review** (usually within 3 days)
3. **Address feedback** if requested
4. **Approval** from maintainer
5. **Merge** to main branch

## Community Guidelines

### Be Respectful

- Be kind and courteous
- Provide constructive feedback
- Help newcomers
- Assume good intentions

### Communication

- Ask questions if unclear
- Discuss major changes in issues first
- Be patient with review process
- Thank contributors

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- 💬 [GitHub Discussions](https://github.com/Tadzesi/SpecTacular/discussions)
- 🐛 [GitHub Issues](https://github.com/Tadzesi/SpecTacular/issues)
- 📧 Contact maintainers

## Recognition

Contributors are recognized in:
- README.md Contributors section
- Release notes
- GitHub insights

Thank you for contributing! 🎉
