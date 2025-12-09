# Install SpecTacular Dashboard extension for development
# Run this script as Administrator

$ExtensionName = "spectacular-dashboard"
$SourcePath = $PSScriptRoot
$ExtensionsPath = "$env:USERPROFILE\.vscode\extensions\$ExtensionName"

# Remove existing link/folder if exists
if (Test-Path $ExtensionsPath) {
    Write-Host "Removing existing extension at $ExtensionsPath"
    Remove-Item -Path $ExtensionsPath -Recurse -Force
}

# Create symbolic link
Write-Host "Creating symlink from $ExtensionsPath to $SourcePath"
New-Item -ItemType SymbolicLink -Path $ExtensionsPath -Target $SourcePath

Write-Host ""
Write-Host "Extension installed! Please reload VS Code (Ctrl+Shift+P -> 'Developer: Reload Window')"
Write-Host ""
