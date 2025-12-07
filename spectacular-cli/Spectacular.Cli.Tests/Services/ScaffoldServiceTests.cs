using Spectacular.Cli.Services;

namespace Spectacular.Cli.Tests.Services;

public class ScaffoldServiceTests : IDisposable
{
    private readonly string _testDir;
    private readonly ScaffoldService _sut = new();

    public ScaffoldServiceTests()
    {
        _testDir = Path.Combine(Path.GetTempPath(), $"spectacular-test-{Guid.NewGuid():N}");
        Directory.CreateDirectory(_testDir);
    }

    public void Dispose()
    {
        if (Directory.Exists(_testDir))
        {
            Directory.Delete(_testDir, recursive: true);
        }
    }

    [Fact]
    public async Task ScaffoldAsync_CreatesExpectedDirectories()
    {
        // Act
        await _sut.ScaffoldAsync(_testDir, "TestProject", "Node.js");

        // Assert
        Assert.True(Directory.Exists(Path.Combine(_testDir, ".spectacular")));
        Assert.True(Directory.Exists(Path.Combine(_testDir, ".claude")));
        Assert.True(Directory.Exists(Path.Combine(_testDir, "specs")));
    }

    [Fact]
    public async Task ScaffoldAsync_SubstitutesProjectName()
    {
        // Act
        await _sut.ScaffoldAsync(_testDir, "MyAwesomeProject", "TypeScript");

        // Assert - check index.md for project name substitution
        var indexPath = Path.Combine(_testDir, ".claude", "tasks", "index.md");
        var content = await File.ReadAllTextAsync(indexPath);

        Assert.Contains("MyAwesomeProject", content);
        Assert.DoesNotContain("{{PROJECT_NAME}}", content);
    }

    [Fact]
    public async Task ScaffoldAsync_SubstitutesTechStack()
    {
        // Act
        await _sut.ScaffoldAsync(_testDir, "TestProject", "Python, FastAPI, PostgreSQL");

        // Assert
        var constitutionPath = Path.Combine(_testDir, ".spectacular", "memory", "constitution.md");
        var content = await File.ReadAllTextAsync(constitutionPath);

        Assert.Contains("- Python", content);
        Assert.Contains("- FastAPI", content);
        Assert.Contains("- PostgreSQL", content);
        Assert.DoesNotContain("{{TECH_STACK", content);
    }

    [Fact]
    public async Task ScaffoldAsync_CreatesClaudeCommands()
    {
        // Act
        await _sut.ScaffoldAsync(_testDir, "TestProject", "Node.js");

        // Assert
        var commandsDir = Path.Combine(_testDir, ".claude", "commands");
        Assert.True(Directory.Exists(commandsDir));

        var commands = Directory.GetFiles(commandsDir, "*.md");
        Assert.True(commands.Length >= 6, $"Expected at least 6 commands, got {commands.Length}");
    }

    [Fact]
    public async Task ScaffoldAsync_ReturnsListOfCreatedFiles()
    {
        // Act
        var files = await _sut.ScaffoldAsync(_testDir, "TestProject", "Node.js");

        // Assert
        Assert.NotEmpty(files);
        Assert.Contains(files, f => f.Contains(".spectacular"));
        Assert.Contains(files, f => f.Contains(".claude"));
    }

    [Fact]
    public async Task ScaffoldAsync_SubstitutesDate()
    {
        // Act
        await _sut.ScaffoldAsync(_testDir, "TestProject", "Node.js");

        // Assert
        var indexPath = Path.Combine(_testDir, ".claude", "tasks", "index.md");
        var content = await File.ReadAllTextAsync(indexPath);

        var today = DateTime.Now.ToString("yyyy-MM-dd");
        Assert.Contains(today, content);
        Assert.DoesNotContain("{{DATE}}", content);
    }
}
