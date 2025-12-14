using System.CommandLine;
using System.Reflection;
using Spectacular.Cli.Commands;

namespace Spectacular.Cli;

class Program
{
    static async Task<int> Main(string[] args)
    {
        var rootCommand = new RootCommand("SpecTacular CLI - Scaffold specification workflow for your projects")
        {
            Name = "spectacular"
        };

        // Get version from assembly
        var version = Assembly.GetExecutingAssembly()
            .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion
            ?? Assembly.GetExecutingAssembly().GetName().Version?.ToString()
            ?? "1.0.0";

        // Handle version flag manually
        if (args.Length == 1 && (args[0] == "--version" || args[0] == "-v"))
        {
            Console.WriteLine($"spectacular {version}");
            return 0;
        }

        // Add subcommands
        rootCommand.AddCommand(InitCommand.Create());
        rootCommand.AddCommand(UpdateCommand.Create());

        // Check if no command is provided (no args, or first arg is an option)
        var hasNoCommand = args.Length == 0 ||
                          (args.Length > 0 && args[0].StartsWith("-") && !args[0].StartsWith("--version") && !args[0].StartsWith("--help") && args[0] != "-h" && args[0] != "-?");

        // Show available commands when no command is provided
        if (hasNoCommand)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine("Error: No command specified.");
            Console.ResetColor();
            Console.WriteLine();
            Console.WriteLine("Available commands:");
            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.Write("  init");
            Console.ResetColor();
            Console.WriteLine("     Scaffold a new SpecTacular project");
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.Write("  update");
            Console.ResetColor();
            Console.WriteLine("   Check for and install updates");
            Console.WriteLine();
            Console.WriteLine("Run 'spectacular <command> --help' for more information on a command.");
            return 1;
        }

        return await rootCommand.InvokeAsync(args);
    }
}
