<#
.SYNOPSIS
    Installs SpecTacular CLI tool and Dashboard for Windows.

.DESCRIPTION
    Downloads and installs the SpecTacular CLI tool and Dashboard application to ~/.spectacular/bin,
    adding it to the user's PATH.

    Can install from:
    1. Local build (publish folder) - when run from repository
    2. GitHub releases - for remote installation

    Usage (local):
        .\install.ps1
        .\install.ps1 -Local

    Usage (remote):
        irm https://raw.githubusercontent.com/Tadzesi/SpecTacular/main/spectacular-cli/installer/install.ps1 | iex

.PARAMETER InstallDir
    Installation directory. Defaults to ~/.spectacular/bin

.PARAMETER Version
    Specific version to install. Defaults to latest.

.PARAMETER Local
    Install from local publish folder instead of downloading from GitHub.

.PARAMETER NoPath
    Skip adding to PATH.

.PARAMETER NoDashboard
    Skip installing the dashboard application.

.EXAMPLE
    # Install from local build
    .\install.ps1 -Local

    # Install latest version from GitHub
    irm https://raw.githubusercontent.com/Tadzesi/SpecTacular/main/spectacular-cli/installer/install.ps1 | iex

    # Install specific version
    $env:SPECTACULAR_VERSION = "1.2.1"; irm https://raw.githubusercontent.com/Tadzesi/SpecTacular/main/spectacular-cli/installer/install.ps1 | iex

    # Install CLI only (skip dashboard)
    .\install.ps1 -NoDashboard
#>

param(
    [switch]$Local,
    [switch]$NoPath,
    [switch]$NoDashboard,
    [string]$InstallDir,
    [string]$Version
)

$ErrorActionPreference = 'Stop'

# Configuration
$RepoOwner = "Tadzesi"
$RepoName = "SpecTacular"
$CliExeName = "spectacular.exe"
$DashboardExeName = "SpectacularDashboard.exe"
$DefaultInstallDir = Join-Path $env:USERPROFILE ".spectacular\bin"

# Allow override via environment variables or parameters
if (-not $InstallDir) {
    $InstallDir = if ($env:SPECTACULAR_INSTALL_DIR) { $env:SPECTACULAR_INSTALL_DIR } else { $DefaultInstallDir }
}
if (-not $Version) {
    $Version = $env:SPECTACULAR_VERSION  # null = latest
}
# Check for -Local via environment variable as well
if ($env:SPECTACULAR_LOCAL -eq "true") {
    $Local = $true
}
# Check for -NoDashboard via environment variable as well
if ($env:SPECTACULAR_NO_DASHBOARD -eq "true") {
    $NoDashboard = $true
}

# Colors
function Write-Success { param($msg) Write-Host "[OK] $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "[..] $msg" -ForegroundColor Cyan }
function Write-Warn { param($msg) Write-Host "[!!] $msg" -ForegroundColor Yellow }
function Write-Err { param($msg) Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Banner
Write-Host ""
Write-Host "  SpecTacular Installer" -ForegroundColor Magenta
Write-Host "  =====================" -ForegroundColor Magenta
Write-Host ""

# Detect architecture (CLM-compatible using environment variables)
$procArch = $env:PROCESSOR_ARCHITECTURE
$arch = if ($procArch -eq "AMD64" -or $procArch -eq "ARM64") {
    if ($procArch -eq "ARM64") { "win-arm64" } else { "win-x64" }
} else {
    Write-Err "32-bit Windows is not supported."
    exit 1
}

Write-Info "Platform: $arch"
Write-Info "Install directory: $InstallDir"

# Check for existing installation
$existingExe = Join-Path $InstallDir $CliExeName
if (Test-Path $existingExe) {
    Write-Warn "Existing installation found. Will be overwritten."
}

# Create installation directory
if (-not (Test-Path $InstallDir)) {
    try {
        New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
        Write-Success "Created directory: $InstallDir"
    } catch {
        Write-Err "Failed to create directory: $_"
        exit 1
    }
}

# Determine script location for local install
$ScriptDir = $null
$isRemoteExecution = $false

if ($PSScriptRoot) {
    $ScriptDir = $PSScriptRoot
} else {
    $cmdDef = $MyInvocation.MyCommand.Definition
    if ($cmdDef -and (Test-Path $cmdDef -ErrorAction SilentlyContinue)) {
        $ScriptDir = Split-Path -Parent $cmdDef
    } else {
        $isRemoteExecution = $true
    }
}

# Configure proxy if environment variables are set
$proxyUrl = if ($env:HTTPS_PROXY) { $env:HTTPS_PROXY } else { $env:HTTP_PROXY }
$proxyParams = @{}
if ($proxyUrl) {
    Write-Info "Using proxy: $proxyUrl"
    $proxyParams = @{
        Proxy = $proxyUrl
        ProxyUseDefaultCredentials = $true
    }
}

# Get release info for remote installation
$release = $null
$tagName = $null

if (-not $Local) {
    try {
        if ($Version) {
            $releaseUrl = "https://api.github.com/repos/$RepoOwner/$RepoName/releases/tags/v$Version"
        } else {
            $releaseUrl = "https://api.github.com/repos/$RepoOwner/$RepoName/releases/latest"
        }

        Write-Info "Fetching release info..."

        $headers = @{
            "User-Agent" = "spectacular-installer"
            "Accept" = "application/vnd.github.v3+json"
        }

        $release = Invoke-RestMethod -Uri $releaseUrl -Headers $headers -TimeoutSec 30 @proxyParams
        $tagName = $release.tag_name
        $versionDisplay = $tagName -replace '^v', ''
        Write-Info "Version: $versionDisplay"

    } catch {
        if ($Version) {
            $tagName = "v$Version"
            Write-Warn "Could not fetch release info. Using version: $Version"
        } else {
            Write-Err "Cannot determine latest version. Please specify version:"
            Write-Err '  $env:SPECTACULAR_VERSION = "1.2.1"; irm ... | iex'
            exit 1
        }
    }
}

# ============================================
# CLI Installation
# ============================================
Write-Host ""
Write-Host "  CLI Installation" -ForegroundColor Cyan
Write-Host "  -----------------" -ForegroundColor Cyan

if ($Local) {
    # Find local CLI build
    $LocalCliPath = $null
    $searchPaths = @()

    if ($ScriptDir) {
        $searchPaths += Join-Path (Split-Path $ScriptDir -Parent) "publish\$arch\$CliExeName"
    }
    $searchPaths += @(".\publish\$arch\$CliExeName", ".\$CliExeName")

    foreach ($path in $searchPaths) {
        if (Test-Path $path -ErrorAction SilentlyContinue) {
            $LocalCliPath = (Resolve-Path $path).Path
            break
        }
    }

    if (-not $LocalCliPath) {
        Write-Err "Local CLI build not found. Please run 'dotnet publish' first:"
        Write-Err "  cd spectacular-cli/Spectacular.Cli"
        Write-Err "  dotnet publish -c Release -r $arch -o ../publish/$arch"
        exit 1
    }

    Write-Info "Installing from: $LocalCliPath"
    $targetPath = Join-Path $InstallDir $CliExeName
    Copy-Item -Path $LocalCliPath -Destination $targetPath -Force
    Write-Success "CLI installed: $targetPath"

} else {
    # Download CLI from GitHub
    $cliAsset = $release.assets | Where-Object { $_.name -eq "spectacular.exe" -or $_.name -like "spectacular-$arch.exe" } | Select-Object -First 1

    if ($cliAsset) {
        $cliDownloadUrl = $cliAsset.browser_download_url
    } else {
        $cliDownloadUrl = "https://github.com/$RepoOwner/$RepoName/releases/download/$tagName/spectacular.exe"
    }

    Write-Info "Downloading CLI..."
    $targetPath = Join-Path $InstallDir $CliExeName

    try {
        Invoke-WebRequest -Uri $cliDownloadUrl -OutFile $targetPath -UseBasicParsing @proxyParams
        Write-Success "CLI installed: $targetPath"
    } catch {
        Write-Err "Failed to download CLI: $_"
        exit 1
    }
}

# Verify CLI
try {
    $installedVersion = & (Join-Path $InstallDir $CliExeName) --version 2>&1
    Write-Success "CLI verified: $installedVersion"
} catch {
    Write-Warn "Could not verify CLI. You may need to restart your terminal."
}

# ============================================
# Dashboard Installation
# ============================================
if (-not $NoDashboard) {
    Write-Host ""
    Write-Host "  Dashboard Installation" -ForegroundColor Cyan
    Write-Host "  ----------------------" -ForegroundColor Cyan

    if ($Local) {
        # Find local dashboard build
        $LocalDashboardDir = $null
        $dashboardSearchPaths = @()

        if ($ScriptDir) {
            $repoRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent
            $dashboardSearchPaths += Join-Path $repoRoot "spectacular-dashboard\release\win-unpacked"
        }
        $dashboardSearchPaths += @(
            ".\spectacular-dashboard\release\win-unpacked",
            "..\spectacular-dashboard\release\win-unpacked"
        )

        foreach ($path in $dashboardSearchPaths) {
            $testExe = Join-Path $path $DashboardExeName
            if (Test-Path $testExe -ErrorAction SilentlyContinue) {
                $LocalDashboardDir = (Resolve-Path $path).Path
                break
            }
        }

        if ($LocalDashboardDir) {
            Write-Info "Installing from: $LocalDashboardDir"
            Copy-Item -Path "$LocalDashboardDir\*" -Destination $InstallDir -Recurse -Force
            Write-Success "Dashboard installed to: $InstallDir"
        } else {
            Write-Warn "Local dashboard build not found."
            Write-Warn "Build it first: cd spectacular-dashboard && npm run build"
        }

    } else {
        # Download dashboard zip from GitHub
        $dashboardAssetName = "spectacular-dashboard-$arch.zip"
        $dashboardAsset = $release.assets | Where-Object { $_.name -eq $dashboardAssetName } | Select-Object -First 1

        if ($dashboardAsset) {
            $dashboardDownloadUrl = $dashboardAsset.browser_download_url
        } else {
            $dashboardDownloadUrl = "https://github.com/$RepoOwner/$RepoName/releases/download/$tagName/$dashboardAssetName"
        }

        Write-Info "Downloading dashboard..."
        $dashboardTempFile = Join-Path $env:TEMP "spectacular-dashboard.zip"

        try {
            Invoke-WebRequest -Uri $dashboardDownloadUrl -OutFile $dashboardTempFile -UseBasicParsing @proxyParams
            Write-Success "Dashboard download complete"

            Write-Info "Extracting dashboard..."
            Expand-Archive -Path $dashboardTempFile -DestinationPath $InstallDir -Force
            Remove-Item -Path $dashboardTempFile -Force -ErrorAction SilentlyContinue
            Write-Success "Dashboard installed to: $InstallDir"

        } catch {
            Write-Warn "Could not download dashboard: $_"
            Write-Warn "You can install it later with: spectacular dashboard --install"
        }
    }

    # Verify dashboard
    $dashboardPath = Join-Path $InstallDir $DashboardExeName
    if (Test-Path $dashboardPath) {
        Write-Success "Dashboard verified: $dashboardPath"
    }
} else {
    Write-Info "Skipping dashboard installation (-NoDashboard specified)"
}

# ============================================
# Add to PATH
# ============================================
if (-not $NoPath) {
    Write-Host ""
    Write-Host "  PATH Configuration" -ForegroundColor Cyan
    Write-Host "  ------------------" -ForegroundColor Cyan

    try {
        $regPath = "HKCU:\Environment"
        $userPath = (Get-ItemProperty -Path $regPath -Name Path -ErrorAction SilentlyContinue).Path
        if (-not $userPath) { $userPath = "" }

        $pathEntries = $userPath -split ';' | Where-Object { $_ -ne '' }
        $alreadyInPath = $pathEntries -contains $InstallDir

        if (-not $alreadyInPath) {
            $newPath = if ($userPath) { "$InstallDir;$userPath" } else { $InstallDir }
            Set-ItemProperty -Path $regPath -Name Path -Value $newPath
            Write-Success "Added to PATH: $InstallDir"

            $sessionPathEntries = $env:Path -split ';' | Where-Object { $_ -ne '' }
            if ($sessionPathEntries -notcontains $InstallDir) {
                $env:Path = "$InstallDir;$env:Path"
            }

            # Broadcast environment change
            try {
                Add-Type -Namespace Win32 -Name NativeMethods -MemberDefinition @"
                    [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
                    public static extern IntPtr SendMessageTimeout(
                        IntPtr hWnd, uint Msg, UIntPtr wParam, string lParam,
                        uint fuFlags, uint uTimeout, out UIntPtr lpdwResult);
"@
                $HWND_BROADCAST = [IntPtr]0xffff
                $WM_SETTINGCHANGE = 0x1a
                $SMTO_ABORTIFHUNG = 0x0002
                $result = [UIntPtr]::Zero
                [Win32.NativeMethods]::SendMessageTimeout($HWND_BROADCAST, $WM_SETTINGCHANGE, [UIntPtr]::Zero, "Environment", $SMTO_ABORTIFHUNG, 5000, [ref]$result) | Out-Null
            } catch {
                # Ignore - PATH is still updated in registry
            }
        } else {
            Write-Info "Already in PATH"
        }
    } catch {
        Write-Warn "Could not add to PATH automatically."
        Write-Warn "Please add manually: $InstallDir"
    }
} else {
    Write-Info "Skipping PATH modification (-NoPath specified)"
}

# Done
Write-Host ""
Write-Host "  Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "  Quick start:" -ForegroundColor Cyan
Write-Host "    spectacular init          - Initialize a project"
Write-Host "    spectacular dashboard     - Launch dashboard"
Write-Host "    SpectacularDashboard      - Launch dashboard directly"
Write-Host ""
Write-Host "  For help: spectacular --help"
Write-Host ""
