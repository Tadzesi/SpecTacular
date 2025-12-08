<#
.SYNOPSIS
    Installs SpecTacular CLI tool and Dashboard for Windows.

.DESCRIPTION
    Downloads and installs the SpecTacular CLI tool and Dashboard application, adding CLI to the user's PATH.

    Can install from:
    1. Local build (publish folder) - when run from repository
    2. GitHub releases - for remote installation

    Usage (local):
        .\install.ps1
        .\install.ps1 -Local

    Usage (remote):
        irm https://raw.githubusercontent.com/[owner]/spectacular/main/spectacular-cli/installer/install.ps1 | iex

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
    irm https://[domain]/install.ps1 | iex

    # Install specific version
    $env:SPECTACULAR_VERSION = "1.0.0"; irm https://[domain]/install.ps1 | iex

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
$ExeName = "spectacular.exe"
$DashboardExeName = "SpectacularDashboard.exe"
$DefaultInstallDir = Join-Path $env:USERPROFILE ".spectacular\bin"
$DashboardInstallDir = Join-Path $env:USERPROFILE ".spectacular\dashboard"

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
$existingExe = Join-Path $InstallDir $ExeName
if (Test-Path $existingExe) {
    Write-Warn "Existing installation found. Will be overwritten."
}

# Determine script location for local install
# When run via 'irm | iex', $PSScriptRoot is empty and $MyInvocation.MyCommand.Definition contains the URL
$ScriptDir = $null
$isRemoteExecution = $false

if ($PSScriptRoot) {
    $ScriptDir = $PSScriptRoot
} else {
    $cmdDef = $MyInvocation.MyCommand.Definition
    # Check if this looks like a valid local path (not a URL or piped content)
    if ($cmdDef -and (Test-Path $cmdDef -ErrorAction SilentlyContinue)) {
        $ScriptDir = Split-Path -Parent $cmdDef
    } else {
        # Running via irm | iex or other remote execution
        $isRemoteExecution = $true
    }
}

# Auto-detect local mode if running from repository (skip for remote execution)
$LocalSourcePath = $null
if (-not $Local -and -not $isRemoteExecution -and $ScriptDir) {
    # Check if we're in the installer folder of the repository
    $possiblePublishPath = Join-Path (Split-Path $ScriptDir -Parent) "publish\$arch\$ExeName"
    if (Test-Path $possiblePublishPath) {
        Write-Info "Local build detected at: $possiblePublishPath"
        Write-Host ""
        $response = Read-Host "  Install from local build? [Y/n]"
        if ($response -ne 'n' -and $response -ne 'N' -and $response -ne 'no') {
            $Local = $true
            $LocalSourcePath = $possiblePublishPath
        }
    }
}

# Handle local installation
if ($Local) {
    if (-not $LocalSourcePath) {
        # Try to find the local build
        $searchPaths = @(
            ".\publish\$arch\$ExeName",
            ".\$ExeName"
        )

        # Add script-relative paths only if we have a valid ScriptDir
        if ($ScriptDir) {
            $searchPaths = @(
                (Join-Path (Split-Path $ScriptDir -Parent) "publish\$arch\$ExeName"),
                (Join-Path $ScriptDir "..\publish\$arch\$ExeName")
            ) + $searchPaths
        }

        foreach ($path in $searchPaths) {
            if (Test-Path $path -ErrorAction SilentlyContinue) {
                $LocalSourcePath = (Resolve-Path $path).Path
                break
            }
        }
    }

    if (-not $LocalSourcePath -or -not (Test-Path $LocalSourcePath)) {
        Write-Err "Local build not found. Please run 'dotnet publish' first:"
        Write-Err "  cd spectacular-cli/Spectacular.Cli"
        Write-Err "  dotnet publish -c Release -r $arch -o ../publish/$arch"
        exit 1
    }

    Write-Info "Installing from local build: $LocalSourcePath"

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

    # Copy executable
    $targetPath = Join-Path $InstallDir $ExeName
    try {
        Copy-Item -Path $LocalSourcePath -Destination $targetPath -Force
        Write-Success "Installed to: $targetPath"

        # Also copy PDB if exists (use string replacement for CLM compatibility)
        $pdbSource = $LocalSourcePath -replace '\.exe$', '.pdb'
        if (Test-Path $pdbSource) {
            $pdbTarget = $targetPath -replace '\.exe$', '.pdb'
            Copy-Item -Path $pdbSource -Destination $pdbTarget -Force
            Write-Info "Copied debug symbols"
        }
    } catch {
        Write-Err "Installation failed: $_"
        exit 1
    }

    # Skip to PATH setup (shared code below)
    $skipDownload = $true
} else {
    $skipDownload = $false
}

if (-not $skipDownload) {
# Configure proxy if environment variables are set (CLM-compatible approach)
$proxyUrl = if ($env:HTTPS_PROXY) { $env:HTTPS_PROXY } else { $env:HTTP_PROXY }
$proxyParams = @{}
if ($proxyUrl) {
    Write-Info "Using proxy: $proxyUrl"
    $proxyParams = @{
        Proxy = $proxyUrl
        ProxyUseDefaultCredentials = $true
    }
}

# Determine download URL
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

    try {
        $release = Invoke-RestMethod -Uri $releaseUrl -Headers $headers -TimeoutSec 30 @proxyParams
    } catch {
        # If GitHub API fails, try direct download URL pattern
        Write-Warn "Could not fetch from GitHub API. Trying direct download..."

        if (-not $Version) {
            Write-Err "Cannot determine latest version. Please specify version:"
            Write-Err '  $env:SPECTACULAR_VERSION = "1.0.0"; irm ... | iex'
            exit 1
        }

        $downloadUrl = "https://github.com/$RepoOwner/$RepoName/releases/download/v$Version/spectacular-$arch.exe"
        $tagName = "v$Version"
    }

    if ($release) {
        $tagName = $release.tag_name
        $asset = $release.assets | Where-Object { $_.name -like "*$arch*" } | Select-Object -First 1

        if (-not $asset) {
            Write-Err "No compatible binary found for $arch in release $tagName"
            Write-Err "Available assets:"
            $release.assets | ForEach-Object { Write-Host "  - $($_.name)" }
            exit 1
        }

        $downloadUrl = $asset.browser_download_url
    }

    $versionDisplay = $tagName -replace '^v', ''
    Write-Info "Version: $versionDisplay"
    Write-Info "Downloading from: $downloadUrl"

} catch {
    Write-Err "Failed to get release information: $_"
    exit 1
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

# Download executable
$tempFile = Join-Path $env:TEMP "spectacular-download.exe"
try {
    Write-Info "Downloading..."

    # Use Invoke-WebRequest instead of WebClient for CLM compatibility
    Invoke-WebRequest -Uri $downloadUrl -OutFile $tempFile -UseBasicParsing @proxyParams

    Write-Success "Download complete"
} catch {
    Write-Err "Download failed: $_"
    exit 1
}

# Install executable
$targetPath = Join-Path $InstallDir $ExeName
try {
    Move-Item -Path $tempFile -Destination $targetPath -Force
    Write-Success "Installed to: $targetPath"
} catch {
    Write-Err "Installation failed: $_"
    Remove-Item -Path $tempFile -Force -ErrorAction SilentlyContinue
    exit 1
}
} # End of if (-not $skipDownload)

# Add to PATH if not already present (shared for both local and remote install)
# Uses registry cmdlets for Constrained Language Mode (CLM) compatibility
if (-not $NoPath) {
    try {
        # Read current user PATH from registry (CLM-compatible)
        $regPath = "HKCU:\Environment"
        $userPath = (Get-ItemProperty -Path $regPath -Name Path -ErrorAction SilentlyContinue).Path
        if (-not $userPath) { $userPath = "" }

        # Check if path already exists (split and compare for accurate matching)
        $pathEntries = $userPath -split ';' | Where-Object { $_ -ne '' }
        $alreadyInPath = $pathEntries -contains $InstallDir

        if (-not $alreadyInPath) {
            # Update PATH in registry (CLM-compatible)
            $newPath = if ($userPath) { "$InstallDir;$userPath" } else { $InstallDir }
            Set-ItemProperty -Path $regPath -Name Path -Value $newPath
            Write-Success "Added to PATH"

            # Also update current session (only if not already present)
            $sessionPathEntries = $env:Path -split ';' | Where-Object { $_ -ne '' }
            if ($sessionPathEntries -notcontains $InstallDir) {
                $env:Path = "$InstallDir;$env:Path"
            }

            # Broadcast environment change to notify other applications (Explorer, terminals)
            # This allows new terminals to pick up PATH changes without system restart
            # Note: This may fail in Constrained Language Mode - that's OK, PATH is still updated
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
                Write-Info "Broadcast environment change to system"
            } catch {
                Write-Info "New terminals will have PATH updated automatically"
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

# Verify CLI installation
Write-Host ""
Write-Host "  CLI Installation" -ForegroundColor Cyan
Write-Host "  -----------------" -ForegroundColor Cyan
$verifyPath = Join-Path $InstallDir $ExeName
try {
    $installedVersion = & $verifyPath --version 2>&1
    Write-Success "CLI verified: $installedVersion"
} catch {
    Write-Warn "Could not verify CLI installation. You may need to restart your terminal."
}

# ============================================
# Dashboard Installation
# ============================================
if (-not $NoDashboard) {
    Write-Host ""
    Write-Host "  Dashboard Installation" -ForegroundColor Cyan
    Write-Host "  ----------------------" -ForegroundColor Cyan

    $dashboardInstalled = $false

    if ($Local) {
        # Look for local dashboard build
        $localDashboardPaths = @()

        if ($ScriptDir) {
            $repoRoot = Split-Path (Split-Path $ScriptDir -Parent) -Parent
            $localDashboardPaths += Join-Path $repoRoot "spectacular-dashboard\release\win-unpacked"
        }

        $localDashboardPaths += @(
            ".\spectacular-dashboard\release\win-unpacked",
            "..\spectacular-dashboard\release\win-unpacked"
        )

        $LocalDashboardDir = $null
        foreach ($path in $localDashboardPaths) {
            $testExe = Join-Path $path $DashboardExeName
            if (Test-Path $testExe -ErrorAction SilentlyContinue) {
                $LocalDashboardDir = (Resolve-Path $path).Path
                break
            }
        }

        if ($LocalDashboardDir) {
            Write-Info "Local dashboard found: $LocalDashboardDir"

            # Create dashboard directory
            if (-not (Test-Path $DashboardInstallDir)) {
                New-Item -ItemType Directory -Path $DashboardInstallDir -Force | Out-Null
            }

            # Copy all files from win-unpacked to dashboard install dir
            try {
                Copy-Item -Path "$LocalDashboardDir\*" -Destination $DashboardInstallDir -Recurse -Force
                Write-Success "Dashboard installed to: $DashboardInstallDir"
                $dashboardInstalled = $true
            } catch {
                Write-Err "Failed to copy dashboard files: $_"
            }
        } else {
            Write-Warn "Local dashboard build not found."
            Write-Warn "Build it first: cd spectacular-dashboard && npm run build"
        }
    } else {
        # Download dashboard from GitHub releases
        Write-Info "Downloading dashboard..."

        try {
            # Find dashboard asset in release
            $dashboardAssetName = "spectacular-dashboard-$arch.zip"
            $dashboardAsset = $null

            if ($release) {
                $dashboardAsset = $release.assets | Where-Object { $_.name -eq $dashboardAssetName } | Select-Object -First 1
            }

            if (-not $dashboardAsset) {
                # Try direct URL pattern
                $dashboardDownloadUrl = "https://github.com/$RepoOwner/$RepoName/releases/download/$tagName/$dashboardAssetName"
            } else {
                $dashboardDownloadUrl = $dashboardAsset.browser_download_url
            }

            Write-Info "Dashboard URL: $dashboardDownloadUrl"

            # Download dashboard zip
            $dashboardTempFile = Join-Path $env:TEMP "spectacular-dashboard.zip"
            Invoke-WebRequest -Uri $dashboardDownloadUrl -OutFile $dashboardTempFile -UseBasicParsing @proxyParams

            Write-Success "Dashboard download complete"

            # Create dashboard directory
            if (-not (Test-Path $DashboardInstallDir)) {
                New-Item -ItemType Directory -Path $DashboardInstallDir -Force | Out-Null
            }

            # Extract dashboard
            Write-Info "Extracting dashboard..."
            Expand-Archive -Path $dashboardTempFile -DestinationPath $DashboardInstallDir -Force

            # Clean up temp file
            Remove-Item -Path $dashboardTempFile -Force -ErrorAction SilentlyContinue

            Write-Success "Dashboard installed to: $DashboardInstallDir"
            $dashboardInstalled = $true

        } catch {
            Write-Warn "Could not download dashboard: $_"
            Write-Warn "You can install it later with: spectacular dashboard --install"
        }
    }

    # Verify dashboard installation
    if ($dashboardInstalled) {
        $dashboardExePath = Join-Path $DashboardInstallDir $DashboardExeName
        if (Test-Path $dashboardExePath) {
            Write-Success "Dashboard verified: $dashboardExePath"
        }
    }
} else {
    Write-Info "Skipping dashboard installation (-NoDashboard specified)"
}

# Done
Write-Host ""
Write-Host "  Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "  Quick start:" -ForegroundColor Cyan
Write-Host "    1. Open a new terminal (to refresh PATH)"
Write-Host "    2. Navigate to your project directory"
Write-Host "    3. Run: spectacular init"
Write-Host ""
Write-Host "  Launch dashboard: spectacular dashboard"
Write-Host "  For help: spectacular --help"
Write-Host ""
