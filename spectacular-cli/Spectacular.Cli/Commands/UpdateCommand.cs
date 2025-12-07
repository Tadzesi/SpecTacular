using System.CommandLine;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace Spectacular.Cli.Commands;

public static class UpdateCommand
{
    private const string GitHubApiUrl = "https://api.github.com/repos/spectacular/spectacular-cli/releases/latest";
    private const string UserAgent = "spectacular-cli";

    public static Command Create()
    {
        var checkOption = new Option<bool>(
            new[] { "--check", "-c" },
            "Only check for updates, don't install");

        var command = new Command("update", "Update spectacular CLI to the latest version")
        {
            checkOption
        };

        command.SetHandler(async (check) =>
        {
            await ExecuteAsync(check);
        }, checkOption);

        return command;
    }

    private static async Task ExecuteAsync(bool checkOnly)
    {
        var currentVersion = Assembly.GetExecutingAssembly()
            .GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion
            ?? Assembly.GetExecutingAssembly().GetName().Version?.ToString()
            ?? "1.0.0";

        Console.WriteLine();
        Console.WriteLine("  SpecTacular Update");
        Console.WriteLine("  ==================");
        Console.WriteLine();
        Console.WriteLine($"  Current version: {currentVersion}");
        Console.WriteLine();

        try
        {
            using var client = new HttpClient();
            client.DefaultRequestHeaders.Add("User-Agent", UserAgent);
            client.Timeout = TimeSpan.FromSeconds(30);

            Console.WriteLine("  Checking for updates...");

            var response = await client.GetAsync(GitHubApiUrl);

            if (!response.IsSuccessStatusCode)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine($"  [!] Could not check for updates (HTTP {(int)response.StatusCode})");
                Console.WriteLine("      Visit https://github.com/spectacular/spectacular-cli/releases for manual download.");
                Console.ResetColor();
                return;
            }

            var json = await response.Content.ReadAsStringAsync();
            var release = JsonSerializer.Deserialize(json, UpdateJsonContext.Default.GitHubRelease);

            if (release == null)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("  [!] Could not parse release information.");
                Console.ResetColor();
                return;
            }

            var latestVersion = release.TagName?.TrimStart('v') ?? "unknown";

            if (latestVersion == currentVersion)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine($"  [OK] You are running the latest version ({currentVersion})");
                Console.ResetColor();
                return;
            }

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine($"  [!] New version available: {latestVersion}");
            Console.ResetColor();

            if (checkOnly)
            {
                Console.WriteLine();
                Console.WriteLine("  Run 'spectacular update' to install the update.");
                return;
            }

            // Find the appropriate asset for this platform
            var asset = release.Assets?.FirstOrDefault(a =>
                a.Name?.Contains("win-x64", StringComparison.OrdinalIgnoreCase) == true ||
                a.Name?.Contains("windows", StringComparison.OrdinalIgnoreCase) == true);

            if (asset == null)
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.WriteLine("  [!] No compatible download found for your platform.");
                Console.WriteLine($"      Visit {release.HtmlUrl} to download manually.");
                Console.ResetColor();
                return;
            }

            Console.WriteLine();
            Console.WriteLine($"  Downloading {asset.Name}...");

            var downloadPath = Path.Combine(Path.GetTempPath(), asset.Name ?? "spectacular-update.exe");
            var downloadResponse = await client.GetAsync(asset.BrowserDownloadUrl);

            if (!downloadResponse.IsSuccessStatusCode)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"  [ERROR] Download failed (HTTP {(int)downloadResponse.StatusCode})");
                Console.ResetColor();
                return;
            }

            await using (var fs = new FileStream(downloadPath, FileMode.Create))
            {
                await downloadResponse.Content.CopyToAsync(fs);
            }

            // Get the path of the current executable
            var currentExePath = Environment.ProcessPath ?? Assembly.GetExecutingAssembly().Location;
            var installDir = Path.GetDirectoryName(currentExePath) ?? Environment.CurrentDirectory;
            var targetPath = Path.Combine(installDir, "spectacular.exe");

            Console.WriteLine("  Installing update...");

            // On Windows, we can't replace a running executable directly
            // Create a batch file to do the replacement after this process exits
            var batchPath = Path.Combine(Path.GetTempPath(), "spectacular-update.cmd");
            var batchContent = $@"@echo off
timeout /t 1 /nobreak >nul
copy /y ""{downloadPath}"" ""{targetPath}""
del ""{downloadPath}""
del ""%~f0""
echo Update complete!
";
            await File.WriteAllTextAsync(batchPath, batchContent);

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine();
            Console.WriteLine("  [OK] Update downloaded. Restart spectacular to complete the update.");
            Console.ResetColor();

            // Start the batch file and exit
            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
            {
                FileName = "cmd.exe",
                Arguments = $"/c \"{batchPath}\"",
                UseShellExecute = false,
                CreateNoWindow = true
            });
        }
        catch (HttpRequestException)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("  [!] Could not connect to update server.");
            Console.WriteLine("      Check your internet connection and try again.");
            Console.ResetColor();
        }
        catch (TaskCanceledException)
        {
            Console.ForegroundColor = ConsoleColor.Yellow;
            Console.WriteLine("  [!] Update check timed out.");
            Console.ResetColor();
        }
        catch (Exception ex)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.WriteLine($"  [ERROR] {ex.Message}");
            Console.ResetColor();
        }
    }

}

internal class GitHubRelease
{
    [JsonPropertyName("tag_name")]
    public string? TagName { get; set; }

    [JsonPropertyName("html_url")]
    public string? HtmlUrl { get; set; }

    [JsonPropertyName("assets")]
    public List<GitHubAsset>? Assets { get; set; }
}

internal class GitHubAsset
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("browser_download_url")]
    public string? BrowserDownloadUrl { get; set; }
}

[JsonSerializable(typeof(GitHubRelease))]
[JsonSerializable(typeof(GitHubAsset))]
[JsonSerializable(typeof(List<GitHubAsset>))]
[JsonSourceGenerationOptions(PropertyNameCaseInsensitive = true)]
internal partial class UpdateJsonContext : JsonSerializerContext
{
}
