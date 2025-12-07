using Spectacular.Cli.Services;

namespace Spectacular.Cli.Tests.Services;

public class TemplateServiceTests
{
    private readonly TemplateService _sut = new();

    [Fact]
    public void ApplyVariables_ReplacesAllPlaceholders()
    {
        // Arrange
        var content = "Project: {{PROJECT_NAME}}, Tech: {{TECH_STACK}}";
        var variables = new Dictionary<string, string>
        {
            { "{{PROJECT_NAME}}", "MyProject" },
            { "{{TECH_STACK}}", "Node.js, React" }
        };

        // Act
        var result = _sut.ApplyVariables(content, variables);

        // Assert
        Assert.Equal("Project: MyProject, Tech: Node.js, React", result);
    }

    [Fact]
    public void ApplyVariables_HandlesEmptyContent()
    {
        // Arrange
        var content = "";
        var variables = new Dictionary<string, string>
        {
            { "{{PROJECT_NAME}}", "MyProject" }
        };

        // Act
        var result = _sut.ApplyVariables(content, variables);

        // Assert
        Assert.Equal("", result);
    }

    [Fact]
    public void ApplyVariables_HandlesNoMatchingPlaceholders()
    {
        // Arrange
        var content = "No placeholders here";
        var variables = new Dictionary<string, string>
        {
            { "{{PROJECT_NAME}}", "MyProject" }
        };

        // Act
        var result = _sut.ApplyVariables(content, variables);

        // Assert
        Assert.Equal("No placeholders here", result);
    }

    [Fact]
    public void ApplyVariables_HandlesMutipleSamePlaceholder()
    {
        // Arrange
        var content = "{{NAME}} and {{NAME}} again";
        var variables = new Dictionary<string, string>
        {
            { "{{NAME}}", "Test" }
        };

        // Act
        var result = _sut.ApplyVariables(content, variables);

        // Assert
        Assert.Equal("Test and Test again", result);
    }

    [Fact]
    public void ApplyVariables_PreservesNonMatchingText()
    {
        // Arrange
        var content = "# {{PROJECT_NAME}}\n\nSome **markdown** content with {{DATE}}";
        var variables = new Dictionary<string, string>
        {
            { "{{PROJECT_NAME}}", "MyApp" },
            { "{{DATE}}", "2025-12-07" }
        };

        // Act
        var result = _sut.ApplyVariables(content, variables);

        // Assert
        Assert.Equal("# MyApp\n\nSome **markdown** content with 2025-12-07", result);
    }
}
