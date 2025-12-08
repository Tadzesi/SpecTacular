using System.CommandLine;
using System.Diagnostics;
using Spectacular.Cli.Services;

namespace Spectacular.Cli.Commands;

public static class DashboardCommand
{
    public static Command Create()
    {
        var pathOption = new Option<string?>(
            new[] { "--path", "-p" },
            "Path to monitor (defaults to ./specs folder)");

        var installOption = new Option<bool>(
            new[] { "--install", "-i" },
            "Install the dashboard application");

        var setPathOption = new Option<string?>(
            new[] { "--set-exe" },
            "Set the path to the dashboard executable and save to config");

        var globalOption = new Option<bool>(
            new[] { "--global", "-g" },
            "Save config globally (use with --set-exe)");

        var command = new Command("dashboard", "Launch or install the SpecTacular Dashboard")
        {
            pathOption,
            installOption,
            setPathOption,
            globalOption
        };

        command.SetHandler(async (path, install, setExePath, global) =>
        {
            await ExecuteAsync(path, install, setExePath, global);
        }, pathOption, installOption, setPathOption, globalOption);

        return command;
    }

    private static async Task ExecuteAsync(string? path, bool install, string? setExePath, bool global)
    {
        // Default to specs folder if no path specified
        var currentDir = Directory.GetCurrentDirectory();
        var specsFolder = Path.Combine(currentDir, "specs");

        // Use specs folder as default if it exists, otherwise use current directory
        string targetPath;
        if (path != null)
        {
            targetPath = Path.GetFullPath(path);
        }
        else if (Directory.Exists(specsFolder))
        {
            targetPath = specsFolder;
        }
        else
        {
            targetPath = currentDir;
        }

        // Handle --set-exe option
        if (!string.IsNullOrEmpty(setExePath))
        {
            await SetDashboardPathAsync(setExePath, global, targetPath);
            return;
        }

        if (install)
        {
            await InstallDashboardAsync(targetPath, global);
            return;
        }

        // Try to resolve dashboard path from config or defaults
        var dashboardPath = ConfigService.ResolveDashboardPath(targetPath);

        if (dashboardPath != null)
        {
            LaunchDashboard(dashboardPath, targetPath);
            return;
        }

        // Dashboard not found - show help
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("  SpecTacular Dashboard not found.");
        Console.ResetColor();
        Console.WriteLine();
        Console.WriteLine("  Options:");
        Console.WriteLine();
        Console.WriteLine("  1. Set the dashboard path manually:");
        Console.WriteLine("     spectacular dashboard --set-exe \"C:\\path\\to\\SpecTacular.exe\"");
        Console.WriteLine();
        Console.WriteLine("  2. Install the dashboard:");
        Console.WriteLine("     spectacular dashboard --install");
        Console.WriteLine();

        // Prompt user to browse for the executable
        Console.Write("  Would you like to enter the path to the dashboard executable? [y/N]: ");
        Console.Out.Flush();
        var response = Console.ReadLine()?.Trim().ToLowerInvariant();

        if (response == "y" || response == "yes")
        {
            Console.Write("  Enter path to SpecTacular.exe: ");
            Console.Out.Flush();
            var enteredPath = Console.ReadLine()?.Trim().Trim('"');

            if (!string.IsNullOrEmpty(enteredPath))
            {
                await SetDashboardPathAsync(enteredPath, global, targetPath);

                // Now try to launch
                if (File.Exists(enteredPath))
                {
                    LaunchDashboard(enteredPath, targetPath);
                }
            }
        }
    }

    private static async Task SetDashboardPathAsync(string exePath, bool global, string projectPath)
    {
        // Normalize path
        exePath = Path.GetFullPath(exePath.Trim().Trim('"'));

        if (!File.Exists(exePath))
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"  [ERROR] File not found: {exePath}");
            Console.ResetColor();
            return;
        }

        var config = new SpectacularConfig { DashboardPath = exePath };

        if (global)
        {
            ConfigService.SaveGlobalConfig(config);
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"  [OK] Dashboard path saved to global config:");
            Console.WriteLine($"       {ConfigService.GetGlobalConfigPath()}");
            Console.ResetColor();
        }
        else
        {
            // Check if .spectacular folder exists
            var spectacularDir = Path.Combine(projectPath, ".spectacular");
            if (!Directory.Exists(spectacularDir))
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("  [!] No .spectacular folder found in current directory.");
                Console.WriteLine("      Saving to global config instead.");
                Console.ResetColor();
                ConfigService.SaveGlobalConfig(config);
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"  [OK] Dashboard path saved to: {ConfigService.GetGlobalConfigPath()}");
                Console.ResetColor();
            }
            else
            {
                ConfigService.SaveProjectConfig(projectPath, config);
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"  [OK] Dashboard path saved to project config:");
                Console.WriteLine($"       {ConfigService.GetProjectConfigPath(projectPath)}");
                Console.ResetColor();
            }
        }

        Console.WriteLine();
        Console.WriteLine($"  Dashboard: {exePath}");

        await Task.CompletedTask;
    }

    private static void LaunchDashboard(string exePath, string targetPath)
    {
        Console.WriteLine();
        Console.WriteLine("  Launching SpecTacular Dashboard...");
        Console.WriteLine($"  Executable: {exePath}");
        Console.WriteLine($"  Path: {targetPath}");
        Console.WriteLine();

        try
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = exePath,
                Arguments = $"--path \"{targetPath}\"",
                UseShellExecute = true
            };
            Process.Start(startInfo);

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine("  [OK] Dashboard launched successfully.");
            Console.ResetColor();
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"  [ERROR] Failed to launch dashboard: {ex.Message}");
            Console.ResetColor();
        }
    }

    private static async Task InstallDashboardAsync(string projectPath, bool global)
    {
        Console.WriteLine();
        Console.WriteLine("  SpecTacular Dashboard Installation");
        Console.WriteLine("  ===================================");
        Console.WriteLine();

        // Check if dashboard is already installed
        var existingPath = ConfigService.ResolveDashboardPath(projectPath);
        if (existingPath != null)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine($"  Dashboard already installed: {existingPath}");
            Console.ResetColor();
            Console.WriteLine();
            Console.WriteLine("  Run 'spectacular dashboard' to launch it.");
            return;
        }

        // Look for local installer (development scenario)
        var installerPath = FindInstaller();
        if (installerPath != null)
        {
            Console.WriteLine($"  Found installer: {installerPath}");
            Console.WriteLine();
            Console.Write("  Run installer now? [Y/n]: ");
            Console.Out.Flush();

            var response = Console.ReadLine()?.Trim().ToLowerInvariant();
            if (response != "n" && response != "no")
            {
                try
                {
                    var startInfo = new ProcessStartInfo
                    {
                        FileName = installerPath,
                        UseShellExecute = true
                    };
                    Process.Start(startInfo);

                    Console.WriteLine();
                    Console.ForegroundColor = ConsoleColor.Green;
                    Console.WriteLine("  [OK] Installer launched. Follow the prompts to complete installation.");
                    Console.ResetColor();
                }
                catch (Exception ex)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"  [ERROR] Failed to run installer: {ex.Message}");
                    Console.ResetColor();
                }
            }
            return;
        }

        // Check for unpacked version (development scenario)
        var unpackedPath = FindUnpackedDashboard();
        if (unpackedPath != null)
        {
            Console.WriteLine($"  Found unpacked dashboard: {unpackedPath}");
            Console.WriteLine();
            Console.Write("  Save this path to config and use it? [Y/n]: ");
            Console.Out.Flush();

            var response = Console.ReadLine()?.Trim().ToLowerInvariant();
            if (response != "n" && response != "no")
            {
                await SetDashboardPathAsync(unpackedPath, global, projectPath);
            }
            return;
        }

        // Dashboard not found - provide installation instructions
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine("  Dashboard not installed.");
        Console.ResetColor();
        Console.WriteLine();
        Console.WriteLine("  To install the dashboard, run the SpecTacular installer:");
        Console.WriteLine();
        Console.ForegroundColor = ConsoleColor.Cyan;
        Console.WriteLine("    irm https://raw.githubusercontent.com/Tadzesi/SpecTacular/main/spectacular-cli/installer/install.ps1 | iex");
        Console.ResetColor();
        Console.WriteLine();
        Console.WriteLine("  Or download from:");
        Console.WriteLine("    https://github.com/Tadzesi/SpecTacular/releases");
        Console.WriteLine();
        Console.WriteLine("  After installation, the dashboard will be available at:");
        Console.WriteLine($"    {ConfigService.GetInstallDir()}");

        await Task.CompletedTask;
    }

    private static string? FindInstaller()
    {
        var possiblePaths = new[]
        {
            Path.Combine(AppContext.BaseDirectory, "..", "..", "spectacular-dashboard", "release", "SpectacularDashboard Setup 1.0.0.exe"),
            @"C:\Projects\development\SpecTacular\spectacular-dashboard\release\SpectacularDashboard Setup 1.0.0.exe"
        };

        foreach (var possiblePath in possiblePaths)
        {
            try
            {
                var fullPath = Path.GetFullPath(possiblePath);
                if (File.Exists(fullPath))
                {
                    return fullPath;
                }
            }
            catch
            {
                // Ignore path errors
            }
        }

        return null;
    }

    private static string? FindUnpackedDashboard()
    {
        var possiblePaths = new[]
        {
            Path.Combine(AppContext.BaseDirectory, "..", "..", "spectacular-dashboard", "release", "win-unpacked", "SpectacularDashboard.exe"),
            @"C:\Projects\development\SpecTacular\spectacular-dashboard\release\win-unpacked\SpectacularDashboard.exe"
        };

        foreach (var possiblePath in possiblePaths)
        {
            try
            {
                var fullPath = Path.GetFullPath(possiblePath);
                if (File.Exists(fullPath))
                {
                    return fullPath;
                }
            }
            catch
            {
                // Ignore path errors
            }
        }

        return null;
    }
}
