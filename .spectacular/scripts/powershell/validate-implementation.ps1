#!/usr/bin/env pwsh
# Validate implementation completeness
param(
    [switch]$Json,
    [switch]$SkipTests,
    [switch]$SkipBuild,
    [switch]$RequireClean
)

. "$PSScriptRoot\common.ps1"

$result = @{
    success = $true
    checks = @{
        tasks = @{ status = "pending"; message = "" }
        build = @{ status = "pending"; message = "" }
        tests = @{ status = "pending"; message = "" }
        git = @{ status = "pending"; message = "" }
    }
    summary = ""
}

$paths = Get-FeaturePathsEnv
$repoRoot = $paths.REPO_ROOT
$tasksFile = $paths.TASKS

# Check 1: Tasks
if (Test-Path $tasksFile) {
    $tasksContent = Get-Content $tasksFile -Raw
    $incomplete = [regex]::Matches($tasksContent, '- \[ \]').Count
    $complete = [regex]::Matches($tasksContent, '- \[x\]', 'IgnoreCase').Count
    $total = $incomplete + $complete

    if ($incomplete -eq 0 -and $total -gt 0) {
        $result.checks.tasks.status = "pass"
        $result.checks.tasks.message = "All $total tasks complete"
    } elseif ($total -eq 0) {
        $result.checks.tasks.status = "warn"
        $result.checks.tasks.message = "No tasks found"
    } else {
        $result.checks.tasks.status = "fail"
        $result.checks.tasks.message = "$incomplete of $total tasks incomplete"
        $result.success = $false
    }
} else {
    $result.checks.tasks.status = "skip"
    $result.checks.tasks.message = "No tasks.md file found"
}

# Check 2: Build
if (-not $SkipBuild) {
    $buildCmd = $null
    if (Test-Path "$repoRoot\package.json") { $buildCmd = "npm"; $buildArgs = @("run", "build") }
    elseif (Test-Path "$repoRoot\*.csproj") { $buildCmd = "dotnet"; $buildArgs = @("build") }
    elseif (Test-Path "$repoRoot\Cargo.toml") { $buildCmd = "cargo"; $buildArgs = @("build") }
    elseif (Test-Path "$repoRoot\go.mod") { $buildCmd = "go"; $buildArgs = @("build", "./...") }

    if ($buildCmd) {
        try {
            Push-Location $repoRoot
            & $buildCmd $buildArgs 2>&1 | Out-Null
            $buildExitCode = $LASTEXITCODE
            Pop-Location
            if ($buildExitCode -eq 0) {
                $result.checks.build.status = "pass"
                $result.checks.build.message = "Build successful ($buildCmd)"
            } else {
                $result.checks.build.status = "fail"
                $result.checks.build.message = "Build failed"
                $result.success = $false
            }
        } catch {
            $result.checks.build.status = "fail"
            $result.checks.build.message = "Build error: $_"
            $result.success = $false
        }
    } else {
        $result.checks.build.status = "skip"
        $result.checks.build.message = "No build system found"
    }
} else {
    $result.checks.build.status = "skip"
    $result.checks.build.message = "Skipped"
}

# Check 3: Tests
if (-not $SkipTests) {
    $testCmd = $null
    if (Test-Path "$repoRoot\package.json") {
        $pkg = Get-Content "$repoRoot\package.json" | ConvertFrom-Json
        if ($pkg.scripts.test) { $testCmd = "npm"; $testArgs = @("test") }
    }
    elseif (Test-Path "$repoRoot\*.csproj") { $testCmd = "dotnet"; $testArgs = @("test") }

    if ($testCmd) {
        try {
            Push-Location $repoRoot
            & $testCmd $testArgs 2>&1 | Out-Null
            $testExitCode = $LASTEXITCODE
            Pop-Location
            if ($testExitCode -eq 0) {
                $result.checks.tests.status = "pass"
                $result.checks.tests.message = "Tests passed ($testCmd)"
            } else {
                $result.checks.tests.status = "fail"
                $result.checks.tests.message = "Tests failed"
                $result.success = $false
            }
        } catch {
            $result.checks.tests.status = "fail"
            $result.checks.tests.message = "Test error: $_"
            $result.success = $false
        }
    } else {
        $result.checks.tests.status = "skip"
        $result.checks.tests.message = "No test system found"
    }
} else {
    $result.checks.tests.status = "skip"
    $result.checks.tests.message = "Skipped"
}

# Check 4: Git
if ($RequireClean -and (Test-HasGit)) {
    Push-Location $repoRoot
    $gitStatus = git status --porcelain 2>&1
    Pop-Location
    if ([string]::IsNullOrWhiteSpace($gitStatus)) {
        $result.checks.git.status = "pass"
        $result.checks.git.message = "Working directory clean"
    } else {
        $result.checks.git.status = "fail"
        $result.checks.git.message = "Uncommitted changes"
        $result.success = $false
    }
} else {
    $result.checks.git.status = "skip"
    $result.checks.git.message = "Clean check not required"
}

# Summary
$passCount = ($result.checks.Values | Where-Object { $_.status -eq "pass" }).Count
$failCount = ($result.checks.Values | Where-Object { $_.status -eq "fail" }).Count
$skipCount = ($result.checks.Values | Where-Object { $_.status -eq "skip" }).Count

if ($result.success) {
    $result.summary = "READY: $passCount passed, $skipCount skipped"
} else {
    $result.summary = "NOT READY: $failCount failed, $passCount passed"
}

if ($Json) {
    $result | ConvertTo-Json -Depth 10
} else {
    Write-Host "`n=== Validation Results ===" -ForegroundColor Cyan
    foreach ($check in $result.checks.GetEnumerator()) {
        $name = $check.Key.PadRight(10)
        $status = $check.Value.status
        $message = $check.Value.message
        switch ($status) {
            "pass" { Write-Host "  $name [PASS] $message" -ForegroundColor Green }
            "fail" { Write-Host "  $name [FAIL] $message" -ForegroundColor Red }
            "warn" { Write-Host "  $name [WARN] $message" -ForegroundColor Yellow }
            "skip" { Write-Host "  $name [SKIP] $message" -ForegroundColor Gray }
        }
    }
    Write-Host ""
    if ($result.success) { Write-Host $result.summary -ForegroundColor Green }
    else { Write-Host $result.summary -ForegroundColor Red }
}

if (-not $result.success) { exit 1 }
