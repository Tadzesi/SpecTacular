# Install SpecTacular Dashboard extension for development
# Run this script as Administrator

$ExtensionName = "spectacular-dashboard"
$SourcePath = $PSScriptRoot
$ExtensionsPath = "$env:USERPROFILE\.vscode\extensions\$ExtensionName"

# Check that extension has been compiled
$DistJs = Join-Path $SourcePath "dist\extension.js"
$WebviewDist = Join-Path $SourcePath "webview\dist\assets\index.js"
if (-not (Test-Path $DistJs) -or -not (Test-Path $WebviewDist)) {
    Write-Host "[ERROR] Extension is not compiled. Run 'npm run compile' first:" -ForegroundColor Red
    Write-Host "  cd $SourcePath" -ForegroundColor Yellow
    Write-Host "  npm run compile" -ForegroundColor Yellow
    exit 1
}

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
