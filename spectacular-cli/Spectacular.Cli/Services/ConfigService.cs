using System.Text.Json;
using System.Text.Json.Serialization;

namespace Spectacular.Cli.Services;

public class SpectacularConfig
{
    // Config class reserved for future CLI settings
    // DashboardPath removed in v1.7.0 - Dashboard is now VS Code extension only
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
    /// Gets the default install directory (~/.spectacular/bin)
    /// </summary>
    public static string GetInstallDir()
    {
        return Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
            ".spectacular", "bin");
    }

}
