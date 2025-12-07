using System.Text.Json;
using System.Text.Json.Serialization;

namespace Spectacular.Cli.Services;

public class SpectacularConfig
{
    public string? DashboardPath { get; set; }
}

[JsonSerializable(typeof(SpectacularConfig))]
[JsonSourceGenerationOptions(WriteIndented = true)]
internal partial class ConfigJsonContext : JsonSerializerContext
{
}

public static class ConfigService
{
    private const string ConfigFileName = "config.json";

    /// <summary>
    /// Gets the global config directory path (%LOCALAPPDATA%\spectacular)
    /// </summary>
    public static string GetGlobalConfigDir()
    {
        return Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "spectacular");
    }

    /// <summary>
    /// Gets the global config file path
    /// </summary>
    public static string GetGlobalConfigPath()
    {
        return Path.Combine(GetGlobalConfigDir(), ConfigFileName);
    }

    /// <summary>
    /// Gets the project-specific config file path (.spectacular/config.json)
    /// </summary>
    public static string GetProjectConfigPath(string projectPath)
    {
        return Path.Combine(projectPath, ".spectacular", ConfigFileName);
    }

    /// <summary>
    /// Loads config, checking project config first, then global config
    /// </summary>
    public static SpectacularConfig LoadConfig(string? projectPath = null)
    {
        // Try project config first
        if (!string.IsNullOrEmpty(projectPath))
        {
            var projectConfigPath = GetProjectConfigPath(projectPath);
            var projectConfig = LoadConfigFromFile(projectConfigPath);
            if (projectConfig != null)
            {
                return projectConfig;
            }
        }

        // Fall back to global config
        var globalConfig = LoadConfigFromFile(GetGlobalConfigPath());
        return globalConfig ?? new SpectacularConfig();
    }

    /// <summary>
    /// Saves config to global location
    /// </summary>
    public static void SaveGlobalConfig(SpectacularConfig config)
    {
        var configDir = GetGlobalConfigDir();
        Directory.CreateDirectory(configDir);

        var configPath = GetGlobalConfigPath();
        var json = JsonSerializer.Serialize(config, ConfigJsonContext.Default.SpectacularConfig);
        File.WriteAllText(configPath, json);
    }

    /// <summary>
    /// Saves config to project location
    /// </summary>
    public static void SaveProjectConfig(string projectPath, SpectacularConfig config)
    {
        var configPath = GetProjectConfigPath(projectPath);
        var configDir = Path.GetDirectoryName(configPath);
        if (configDir != null)
        {
            Directory.CreateDirectory(configDir);
        }

        var json = JsonSerializer.Serialize(config, ConfigJsonContext.Default.SpectacularConfig);
        File.WriteAllText(configPath, json);
    }

    private static SpectacularConfig? LoadConfigFromFile(string path)
    {
        if (!File.Exists(path))
        {
            return null;
        }

        try
        {
            var json = File.ReadAllText(path);
            return JsonSerializer.Deserialize(json, ConfigJsonContext.Default.SpectacularConfig);
        }
        catch
        {
            return null;
        }
    }

    /// <summary>
    /// Resolves the dashboard executable path from config or defaults
    /// </summary>
    public static string? ResolveDashboardPath(string? projectPath = null)
    {
        var config = LoadConfig(projectPath);

        // 1. Check config
        if (!string.IsNullOrEmpty(config.DashboardPath) && File.Exists(config.DashboardPath))
        {
            return config.DashboardPath;
        }

        // 2. Check default install location
        var defaultPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "Programs", "spectacular", "SpecTacular.exe");

        if (File.Exists(defaultPath))
        {
            return defaultPath;
        }

        // 3. Check common dev locations
        var devPaths = new[]
        {
            @"C:\Projects\development\SpecTacular\spectacular-dashboard\release\win-unpacked\SpecTacular.exe",
            Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                "Projects", "SpecTacular", "spectacular-dashboard", "release", "win-unpacked", "SpecTacular.exe")
        };

        foreach (var devPath in devPaths)
        {
            if (File.Exists(devPath))
            {
                return devPath;
            }
        }

        return null;
    }
}
