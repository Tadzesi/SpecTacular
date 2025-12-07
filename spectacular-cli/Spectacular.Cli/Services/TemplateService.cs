namespace Spectacular.Cli.Services;

public class TemplateService
{
    public string ApplyVariables(string content, Dictionary<string, string> variables)
    {
        foreach (var (placeholder, value) in variables)
        {
            content = content.Replace(placeholder, value);
        }

        return content;
    }
}
