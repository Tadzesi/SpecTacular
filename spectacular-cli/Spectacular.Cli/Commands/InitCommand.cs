using System.CommandLine;
using Spectacular.Cli.Services;

namespace Spectacular.Cli.Commands;

public enum AiTool
{
    ClaudeCode,
    Cursor,
    Both
}

public static class InitCommand
{
    public static Command Create()
    {
        var nameOption = new Option<string?>(
            new[] { "--name", "-n" },
            "Project name (defaults to current directory name)");

        var techOption = new Option<string>(
            new[] { "--tech", "-t" },
            () => "ASP.NET Core, React, SQL Server",
            "Technology stack (comma-separated)");

        var pathOption = new Option<string?>(
            new[] { "--path", "-p" },
            "Target directory (defaults to current directory)");

        var forceOption = new Option<bool>(
            new[] { "--force", "-f" },
            "Overwrite existing files");

        var toolOption = new Option<string?>(
            new[] { "--tool", "-l" },
            "AI tool to generate files for: claude, cursor, or both (interactive if not specified)");

        var languageOption = new Option<string?>(
            new[] { "--language", "-lang" },
            "Preferred language(s) for AI responses (e.g., 'English', 'Slovak', 'English, Slovak')");

        var command = new Command("init", "Initialize SpecTacular workflow in current directory")
        {
            nameOption,
            techOption,
            pathOption,
            forceOption,
            toolOption,
            languageOption
        };

        command.SetHandler(async (name, tech, path, force, tool, language) =>
        {
            await ExecuteAsync(name, tech, path, force, tool, language);
        }, nameOption, techOption, pathOption, forceOption, toolOption, languageOption);

        return command;
    }

    private static async Task ExecuteAsync(string? name, string tech, string? path, bool force, string? tool, string? language)
    {
        var targetPath = path ?? Directory.GetCurrentDirectory();
        var projectName = name ?? Path.GetFileName(targetPath) ?? "MyProject";

        // Determine AI tool selection
        var aiTool = ParseOrPromptForTool(tool);
        if (aiTool == null)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("  [!] Initialization cancelled.");
            Console.ResetColor();
            return;
        }

        // Determine language preference
        var languagePref = PromptForLanguage(language);

        Console.WriteLine();
        Console.WriteLine("  SpecTacular Init");
        Console.WriteLine("  ================");
        Console.WriteLine();
        Console.WriteLine($"  Project:  {projectName}");
        Console.WriteLine($"  Path:     {targetPath}");
        Console.WriteLine($"  Tech:     {tech}");
        Console.WriteLine($"  Tool:     {GetToolDisplayName(aiTool.Value)}");
        Console.WriteLine($"  Language: {languagePref}");
        Console.WriteLine();

        // Check if already initialized
        var spectacularDir = Path.Combine(targetPath, ".spectacular");
        if (Directory.Exists(spectacularDir) && !force)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("  [!] .spectacular directory already exists.");
            Console.WriteLine("      Use --force to overwrite existing files.");
            Console.ResetColor();
            return;
        }

        try
        {
            var scaffoldService = new ScaffoldService();
            var (createdFiles, skippedFiles) = await scaffoldService.ScaffoldAsync(targetPath, projectName, tech, aiTool.Value, languagePref);

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"  [OK] Created {createdFiles.Count} files:");
            Console.ResetColor();
            Console.WriteLine();

            foreach (var file in createdFiles.Take(10))
            {
                Console.WriteLine($"       {file}");
            }

            if (createdFiles.Count > 10)
            {
                Console.WriteLine($"       ... and {createdFiles.Count - 10} more");
            }

            // Show skipped files
            if (skippedFiles.Count > 0)
            {
                Console.WriteLine();
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"  [..] Skipped {skippedFiles.Count} existing file(s):");
                Console.ResetColor();
                foreach (var file in skippedFiles)
                {
                    Console.WriteLine($"       {file}");
                }
            }

            // Auto-configure dashboard if found
            var dashboardPath = ConfigService.ResolveDashboardPath(targetPath);
            if (dashboardPath != null)
            {
                // Save to global config so it works everywhere
                var config = new SpectacularConfig { DashboardPath = dashboardPath };
                ConfigService.SaveGlobalConfig(config);

                Console.WriteLine();
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"  [OK] Dashboard configured: {dashboardPath}");
                Console.ResetColor();
            }

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("  Next steps:");
            Console.ResetColor();
            Console.WriteLine("  1. Customize .spectacular/memory/constitution.md");
            Console.WriteLine("  2. Start creating features with: /spectacular.1-spec");
            if (dashboardPath != null)
            {
                Console.WriteLine("  3. Launch dashboard with: spectacular dashboard");
            }
            Console.WriteLine();
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"  [ERROR] {ex.Message}");
            Console.ResetColor();
        }
    }

    private static string PromptForLanguage(string? languageArg)
    {
        // If language argument was provided, use it
        if (!string.IsNullOrWhiteSpace(languageArg))
        {
            return languageArg;
        }

        // Interactive prompt
        Console.WriteLine();
        Console.WriteLine("  What language(s) do you prefer for AI responses?");
        Console.WriteLine();
        Console.WriteLine("  Examples: English, Slovak, English and Slovak, German");
        Console.WriteLine();
        Console.Write("  Language(s): ");
        Console.Out.Flush();

        var input = Console.ReadLine()?.Trim();
        Console.WriteLine();

        return string.IsNullOrWhiteSpace(input) ? "English" : input;
    }

    private static AiTool? ParseOrPromptForTool(string? toolArg)
    {
        // If tool argument was provided, parse it
        if (!string.IsNullOrWhiteSpace(toolArg))
        {
            return toolArg.ToLowerInvariant() switch
            {
                "claude" or "claudecode" or "claude-code" => AiTool.ClaudeCode,
                "cursor" => AiTool.Cursor,
                "both" or "all" => AiTool.Both,
                _ => null
            };
        }

        // Interactive prompt
        Console.WriteLine();
        Console.WriteLine("  Which AI tool files should be generated?");
        Console.WriteLine();
        Console.WriteLine("    [1] Claude Code  (.claude/commands/)");
        Console.WriteLine("    [2] Cursor       (.cursor/rules/)");
        Console.WriteLine("    [3] Both");
        Console.WriteLine("    [Q] Cancel");
        Console.WriteLine();
        Console.Write("  Select (1-3): ");
        Console.Out.Flush();

        var input = Console.ReadLine()?.Trim().ToLowerInvariant();
        Console.WriteLine();

        return input switch
        {
            "1" or "claude" => AiTool.ClaudeCode,
            "2" or "cursor" => AiTool.Cursor,
            "3" or "both" => AiTool.Both,
            _ => null
        };
    }

    private static string GetToolDisplayName(AiTool tool)
    {
        return tool switch
        {
            AiTool.ClaudeCode => "Claude Code",
            AiTool.Cursor => "Cursor",
            AiTool.Both => "Both (Claude Code + Cursor)",
            _ => "Unknown"
        };
    }
}
