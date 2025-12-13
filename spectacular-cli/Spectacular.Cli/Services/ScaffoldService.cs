using System.Reflection;
using Spectacular.Cli.Commands;

namespace Spectacular.Cli.Services;

public class ScaffoldService
{
    private readonly TemplateService _templateService;

    public ScaffoldService()
    {
        _templateService = new TemplateService();
    }

    public async Task<(List<string> Created, List<string> Skipped)> ScaffoldAsync(string targetPath, string projectName, string techStack, AiTool aiTool = AiTool.Both, string language = "English")
    {
        var createdFiles = new List<string>();
        var skippedFiles = new List<string>();
        var assembly = Assembly.GetExecutingAssembly();
        var resourcePrefix = "Spectacular.Cli.Resources.templates.";

        // Get all embedded resources
        var resourceNames = assembly.GetManifestResourceNames()
            .Where(n => n.StartsWith(resourcePrefix))
            .ToList();

        // Create template variables
        var variables = new Dictionary<string, string>
        {
            { "{{PROJECT_NAME}}", projectName },
            { "{{TECH_STACK}}", techStack },
            { "{{DATE}}", DateTime.Now.ToString("yyyy-MM-dd") },
            { "{{TECH_STACK_LIST}}", FormatTechStackList(techStack) },
            { "{{LANGUAGE}}", language }
        };

        foreach (var resourceName in resourceNames)
        {
            // Simpler approach: manually map the resource names to proper paths
            var relativePath = MapResourceToPath(resourceName, resourcePrefix);

            if (string.IsNullOrEmpty(relativePath))
                continue;

            // Filter based on AI tool selection
            if (!ShouldIncludeFile(relativePath, aiTool))
                continue;

            var fullPath = Path.Combine(targetPath, relativePath);
            var directory = Path.GetDirectoryName(fullPath);

            if (!string.IsNullOrEmpty(directory) && !Directory.Exists(directory))
            {
                Directory.CreateDirectory(directory);
            }

            // Skip CLAUDE.md if it already exists (don't overwrite user's customizations)
            if (relativePath.Equals("CLAUDE.md", StringComparison.OrdinalIgnoreCase) && File.Exists(fullPath))
            {
                skippedFiles.Add(relativePath);
                continue;
            }

            // Read resource content
            using var stream = assembly.GetManifestResourceStream(resourceName);
            if (stream == null) continue;

            using var reader = new StreamReader(stream);
            var content = await reader.ReadToEndAsync();

            // Apply template substitutions
            content = _templateService.ApplyVariables(content, variables);

            // Write file
            await File.WriteAllTextAsync(fullPath, content);
            createdFiles.Add(relativePath);
        }

        // Ensure specs directory exists (even if empty)
        var specsDir = Path.Combine(targetPath, "specs");
        if (!Directory.Exists(specsDir))
        {
            Directory.CreateDirectory(specsDir);
        }

        return (createdFiles.OrderBy(f => f).ToList(), skippedFiles);
    }

    private static string MapResourceToPath(string resourceName, string prefix)
    {
        // Remove prefix
        var name = resourceName.Substring(prefix.Length);

        // Handle special cases based on known patterns
        if (name.StartsWith(".claude.commands."))
        {
            var fileName = name.Substring(".claude.commands.".Length);
            fileName = RestoreFileName(fileName);
            return $".claude/commands/{fileName}";
        }

        if (name.StartsWith(".claude.tasks."))
        {
            var fileName = name.Substring(".claude.tasks.".Length);
            fileName = RestoreFileName(fileName);
            return $".claude/tasks/{fileName}";
        }

        if (name.StartsWith(".spectacular.memory."))
        {
            var fileName = name.Substring(".spectacular.memory.".Length);
            fileName = RestoreFileName(fileName);
            return $".spectacular/memory/{fileName}";
        }

        if (name.StartsWith(".spectacular.scripts.powershell."))
        {
            var fileName = name.Substring(".spectacular.scripts.powershell.".Length);
            fileName = RestoreFileName(fileName);
            return $".spectacular/scripts/powershell/{fileName}";
        }

        if (name.StartsWith(".spectacular.templates."))
        {
            var fileName = name.Substring(".spectacular.templates.".Length);
            fileName = RestoreFileName(fileName);
            return $".spectacular/templates/{fileName}";
        }

        if (name.StartsWith(".spectacular.prompts."))
        {
            var fileName = name.Substring(".spectacular.prompts.".Length);
            fileName = RestoreFileName(fileName);
            return $".spectacular/prompts/{fileName}";
        }

        if (name.StartsWith(".cursor.rules."))
        {
            var fileName = name.Substring(".cursor.rules.".Length);
            fileName = RestoreFileName(fileName);
            return $".cursor/rules/{fileName}";
        }

        // For other files in root of templates
        return RestoreFileName(name);
    }

    private static bool ShouldIncludeFile(string relativePath, AiTool aiTool)
    {
        // Always include non-AI tool specific files
        var isClaudeFile = relativePath.StartsWith(".claude/");
        var isCursorFile = relativePath.StartsWith(".cursor/");

        if (!isClaudeFile && !isCursorFile)
            return true;

        return aiTool switch
        {
            AiTool.ClaudeCode => isClaudeFile,
            AiTool.Cursor => isCursorFile,
            AiTool.Both => true,
            _ => true
        };
    }

    private static string RestoreFileName(string embeddedName)
    {
        // Resource names replace hyphens and file extensions
        // e.g., "spectacular.0-quick.md" becomes "spectacular/0-quick/md"
        // We need to restore: "spectacular.0-quick.md"

        // Find the extension (last segment)
        var parts = embeddedName.Split('.');
        if (parts.Length < 2) return embeddedName;

        // The last part is the extension
        var ext = parts[^1];

        // Everything before is the filename (with dots replaced by hyphens where appropriate)
        var nameWithoutExt = string.Join(".", parts[..^1]);

        return $"{nameWithoutExt}.{ext}";
    }

    private static string FormatTechStackList(string techStack)
    {
        var items = techStack.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
        return string.Join("\n", items.Select(item => $"- {item}"));
    }
}
