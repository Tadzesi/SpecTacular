using System.CommandLine;

namespace Spectacular.Cli.Commands;

public static class DashboardCommand
{
    public static Command Create()
    {
        var command = new Command("dashboard", "Information about the SpecTacular Dashboard VS Code extension");

        command.SetHandler(() =>
        {
            Execute();
        });

        return command;
    }

    private static void Execute()
    {
        Console.WriteLine();
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("  SpecTacular Dashboard");
        Console.ResetColor();
        Console.WriteLine("  =====================");
        Console.WriteLine();
        Console.WriteLine("  The SpecTacular Dashboard is now available as a VS Code extension.");
        Console.WriteLine();
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("  Installation:");
        Console.ResetColor();
        Console.WriteLine();
        Console.WriteLine("  1. Open VS Code");
        Console.WriteLine("  2. Go to Extensions (Ctrl+Shift+X)");
        Console.WriteLine("  3. Search for \"SpecTacular Dashboard\"");
        Console.WriteLine("  4. Click Install");
        Console.WriteLine();
        Console.WriteLine("  Or install from VSIX:");
        Console.ForegroundColor = ConsoleColor.White;
        Console.WriteLine("    code --install-extension spectacular-dashboard-1.4.0.vsix");
        Console.ResetColor();
        Console.WriteLine();
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("  Usage:");
        Console.ResetColor();
        Console.WriteLine();
        Console.WriteLine("  1. Click the SpecTacular icon in VS Code's Activity Bar");
        Console.WriteLine("  2. Or press Ctrl+Shift+P and run: \"SpecTacular: Open Dashboard\"");
        Console.WriteLine();
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("  Features:");
        Console.ResetColor();
        Console.WriteLine();
        Console.WriteLine("  - Auto-detection of specs/ or .spectacular/ folders");
        Console.WriteLine("  - Real-time file watching");
        Console.WriteLine("  - Markdown preview with status tags and wikilinks");
        Console.WriteLine("  - Theme integration with VS Code");
        Console.WriteLine("  - Navigation history (back/forward, mouse buttons 3/4)");
        Console.WriteLine();
        Console.ForegroundColor = ConsoleColor.DarkGray;
        Console.WriteLine("  Note: The Electron desktop app was removed in v1.4.0 for size reasons.");
        Console.WriteLine("        The VS Code extension provides the same functionality with better IDE integration.");
        Console.ResetColor();
        Console.WriteLine();
    }
}
