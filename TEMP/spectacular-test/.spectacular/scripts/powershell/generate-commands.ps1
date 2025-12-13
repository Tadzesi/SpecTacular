<#
.SYNOPSIS
    Generate AI tool commands from shared prompt sources.

.DESCRIPTION
    This script generates command files for either Claude Code or Cursor from
    shared prompt source files in .spectacular/prompts/.

.PARAMETER Tool
    Target tool: 'claude' for Claude Code, 'cursor' for Cursor IDE.
    If not specified, prompts the user to choose.

.PARAMETER Prefix
    Command prefix (e.g., 'spectacular', 'organizer'). Default: 'spectacular'

.PARAMETER Force
    Overwrite existing files without prompting.

.EXAMPLE
    .\generate-commands.ps1
    # Interactive mode - asks which tool to generate for

.EXAMPLE
    .\generate-commands.ps1 -Tool claude
    # Generate Claude Code commands

.EXAMPLE
    .\generate-commands.ps1 -Tool cursor -Force
    # Generate Cursor rules, overwriting existing
#>

param(
    [Parameter()]
    [ValidateSet('claude', 'cursor')]
    [string]$Tool,

    [Parameter()]
    [string]$Prefix = 'spectacular',

    [Parameter()]
    [switch]$Force
)

# Get repository root
$RepoRoot = git rev-parse --show-toplevel 2>$null
if (-not $RepoRoot) {
    $RepoRoot = (Get-Location).Path
}
$RepoRoot = $RepoRoot -replace '/', '\'

# Paths
$PromptsDir = Join-Path $RepoRoot '.spectacular\prompts'
$ClaudeDir = Join-Path $RepoRoot '.claude\commands'
$CursorDir = Join-Path $RepoRoot '.cursor\rules'

# Colors for output
function Write-Status($Message) { Write-Host "  $Message" -ForegroundColor Cyan }
function Write-Success($Message) { Write-Host "  $Message" -ForegroundColor Green }
function Write-Warning($Message) { Write-Host "  $Message" -ForegroundColor Yellow }
function Write-Error($Message) { Write-Host "  $Message" -ForegroundColor Red }

# Banner
Write-Host ""
Write-Host "  =====================================" -ForegroundColor Magenta
Write-Host "   SpecTacular Command Generator" -ForegroundColor Magenta
Write-Host "  =====================================" -ForegroundColor Magenta
Write-Host ""

# Check prompts directory exists
if (-not (Test-Path $PromptsDir)) {
    Write-Error "Prompts directory not found: $PromptsDir"
    Write-Host "  Create prompt source files in .spectacular/prompts/ first." -ForegroundColor Gray
    exit 1
}

# Get prompt files
$PromptFiles = Get-ChildItem -Path $PromptsDir -Filter '*.md' | Sort-Object Name
if ($PromptFiles.Count -eq 0) {
    Write-Error "No prompt files found in $PromptsDir"
    exit 1
}

Write-Status "Found $($PromptFiles.Count) prompt source files"

# Interactive tool selection if not specified
if (-not $Tool) {
    Write-Host ""
    Write-Host "  Which AI tool are you using?" -ForegroundColor White
    Write-Host ""
    Write-Host "    [1] Claude Code  - Generates .claude/commands/*.md" -ForegroundColor Cyan
    Write-Host "    [2] Cursor       - Generates .cursor/rules/*.mdc" -ForegroundColor Cyan
    Write-Host "    [3] Both         - Generate for both tools" -ForegroundColor Cyan
    Write-Host ""

    $Choice = Read-Host "  Enter choice (1/2/3)"

    switch ($Choice) {
        '1' { $Tool = 'claude' }
        '2' { $Tool = 'cursor' }
        '3' { $Tool = 'both' }
        default {
            Write-Error "Invalid choice. Please enter 1, 2, or 3."
            exit 1
        }
    }
    Write-Host ""
}

# Function to parse frontmatter from prompt file
function Get-PromptMetadata {
    param([string]$FilePath)

    $Content = Get-Content $FilePath -Raw
    $Metadata = @{
        Name = ''
        Description = ''
        Content = ''
    }

    # Parse YAML frontmatter (using (?s) for single-line mode to match across newlines)
    if ($Content -match '(?s)^---\r?\n(.*?)\r?\n---\r?\n(.*)$') {
        $FrontMatter = $Matches[1]
        $Metadata.Content = $Matches[2].Trim()

        # Extract name from frontmatter
        if ($FrontMatter -match 'name:\s*(.+)') {
            $Metadata.Name = $Matches[1].Trim()
        }

        # Extract description from frontmatter
        if ($FrontMatter -match 'description:\s*(.+)') {
            $Metadata.Description = $Matches[1].Trim()
        }
    } else {
        # No frontmatter, use filename as name
        $Metadata.Name = [System.IO.Path]::GetFileNameWithoutExtension($FilePath)
        $Metadata.Content = $Content.Trim()
    }

    return $Metadata
}

# Function to generate Claude Code command
function New-ClaudeCommand {
    param(
        [string]$Name,
        [string]$Description,
        [string]$Content,
        [string]$Prefix
    )

    $CommandName = "$Prefix.$Name"

    return @"
---
description: $Description
---

$Content
"@
}

# Function to generate Cursor rule (.mdc format)
function New-CursorRule {
    param(
        [string]$Name,
        [string]$Description,
        [string]$Content,
        [string]$Prefix
    )

    # Convert $ARGUMENTS to Cursor-compatible format
    # Cursor doesn't have direct variable support, so we add context instructions
    $CursorContent = $Content -replace '\$ARGUMENTS', '{user_input}'

    # Add Cursor-specific instruction for user input
    $CursorContent = $CursorContent -replace '```text\r?\n\{user_input\}\r?\n```', @"
When the user mentions @$Prefix-$Name, treat their message as the feature input.
"@

    return @"
---
description: $Description
globs:
alwaysApply: false
---

# $Prefix-$Name

$Description

$CursorContent
"@
}

# Generate commands for specified tool(s)
$Tools = if ($Tool -eq 'both') { @('claude', 'cursor') } else { @($Tool) }

foreach ($TargetTool in $Tools) {
    Write-Host ""
    Write-Host "  Generating for: $($TargetTool.ToUpper())" -ForegroundColor Yellow
    Write-Host "  $('-' * 40)" -ForegroundColor Gray

    # Set output directory
    $OutputDir = if ($TargetTool -eq 'claude') { $ClaudeDir } else { $CursorDir }
    $FileExt = if ($TargetTool -eq 'claude') { 'md' } else { 'mdc' }

    # Create output directory if needed
    if (-not (Test-Path $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
        Write-Status "Created directory: $OutputDir"
    }

    # Process each prompt file
    foreach ($PromptFile in $PromptFiles) {
        $Metadata = Get-PromptMetadata -FilePath $PromptFile.FullName

        # Generate output filename
        $OutputName = if ($TargetTool -eq 'claude') {
            "$Prefix.$($Metadata.Name).$FileExt"
        } else {
            "$Prefix-$($Metadata.Name).$FileExt"
        }
        $OutputPath = Join-Path $OutputDir $OutputName

        # Check if file exists
        if ((Test-Path $OutputPath) -and -not $Force) {
            Write-Warning "Skipping (exists): $OutputName"
            continue
        }

        # Generate content
        $OutputContent = if ($TargetTool -eq 'claude') {
            New-ClaudeCommand -Name $Metadata.Name -Description $Metadata.Description -Content $Metadata.Content -Prefix $Prefix
        } else {
            New-CursorRule -Name $Metadata.Name -Description $Metadata.Description -Content $Metadata.Content -Prefix $Prefix
        }

        # Write file
        $OutputContent | Set-Content -Path $OutputPath -Encoding UTF8
        Write-Success "Generated: $OutputName"
    }
}

# Summary
Write-Host ""
Write-Host "  =====================================" -ForegroundColor Magenta
Write-Host "   Generation Complete!" -ForegroundColor Green
Write-Host "  =====================================" -ForegroundColor Magenta
Write-Host ""

if ($Tools -contains 'claude') {
    Write-Host "  Claude Code commands: $ClaudeDir" -ForegroundColor Cyan
    Write-Host "    Usage: /spectacular.0-quick, /spectacular.1-spec, etc." -ForegroundColor Gray
}

if ($Tools -contains 'cursor') {
    Write-Host "  Cursor rules: $CursorDir" -ForegroundColor Cyan
    Write-Host "    Usage: @spectacular-0-quick, @spectacular-1-spec, etc." -ForegroundColor Gray
}

Write-Host ""
