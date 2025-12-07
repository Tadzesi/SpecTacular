<#
.SYNOPSIS
    Uninstalls SpecTacular CLI tool.

.DESCRIPTION
    Removes the SpecTacular CLI tool and removes it from the user's PATH.

.EXAMPLE
    irm https://[domain]/uninstall.ps1 | iex
#>

$ErrorActionPreference = 'Stop'

# Configuration
$ExeName = "spectacular.exe"
$DefaultInstallDir = Join-Path $env:USERPROFILE ".spectacular\bin"
$InstallDir = if ($env:SPECTACULAR_INSTALL_DIR) { $env:SPECTACULAR_INSTALL_DIR } else { $DefaultInstallDir }

# Colors
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "[..] $msg" -ForegroundColor Cyan }
function Write-Warn { param($msg) Write-Host "[!!] $msg" -ForegroundColor Yellow }

Write-Host ""
Write-Host "  SpecTacular CLI Uninstaller" -ForegroundColor Magenta
Write-Host "  ===========================" -ForegroundColor Magenta
Write-Host ""

$exePath = Join-Path $InstallDir $ExeName

# Check if installed
if (-not (Test-Path $exePath)) {
    Write-Warn "SpecTacular CLI not found at: $exePath"
    Write-Info "Nothing to uninstall."
    exit 0
}

# Remove from PATH
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -like "*$InstallDir*") {
    try {
        $pathParts = $userPath -split ';' | Where-Object { $_ -ne $InstallDir -and $_ -ne "" }
        $newPath = $pathParts -join ';'
        [Environment]::SetEnvironmentVariable("Path", $newPath, "User")
        Write-Success "Removed from PATH"
    } catch {
        Write-Warn "Could not remove from PATH: $_"
    }
} else {
    Write-Info "Not in PATH"
}

# Remove executable
try {
    Remove-Item -Path $exePath -Force
    Write-Success "Removed: $exePath"
} catch {
    Write-Warn "Could not remove executable: $_"
    Write-Warn "You may need to close any terminals using spectacular and try again."
}

# Remove installation directory if empty
$parentDir = Split-Path $InstallDir -Parent
if ((Test-Path $InstallDir) -and (Get-ChildItem $InstallDir | Measure-Object).Count -eq 0) {
    try {
        Remove-Item -Path $InstallDir -Force
        Write-Success "Removed empty directory: $InstallDir"

        # Also try to remove parent .spectacular if empty
        if ((Test-Path $parentDir) -and (Get-ChildItem $parentDir | Measure-Object).Count -eq 0) {
            Remove-Item -Path $parentDir -Force
            Write-Success "Removed empty directory: $parentDir"
        }
    } catch {
        Write-Info "Directory not empty, keeping: $InstallDir"
    }
}

Write-Host ""
Write-Host "  Uninstallation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "  Note: You may need to restart your terminal for PATH changes to take effect."
Write-Host ""
