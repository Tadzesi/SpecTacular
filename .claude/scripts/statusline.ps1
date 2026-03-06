# Claude Code Status Line Script (Enhanced with Icons & Colors)
# Displays: Folder, Git Branch, Progress Bar, Tokens, Global API Duration
# API Duration: Cumulative across all sessions with delta indicator (+last call)
#
# Context percentage: APPROXIMATION. used_percentage from JSON excludes system prompt,
# tool definitions, and MCP tool schemas (~10-20% overhead not counted).
# Actual usage is higher than displayed. Use /context for precise values.
# Autocompact triggers at ~95% by default (CLAUDE_AUTOCOMPACT_PCT_OVERRIDE to change).
# Thresholds are shifted down 15% to compensate for known under-reporting.

# Force UTF-8 output encoding
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [System.Text.UTF8Encoding]::new($false)

# Read JSON from stdin
$jsonInput = [Console]::In.ReadToEnd()
$data = $jsonInput | ConvertFrom-Json

# --- ANSI Color Codes (Professional Palette) ---
$esc = [char]27
$reset = "$esc[0m"
$bold = "$esc[1m"
$dim = "$esc[2m"

# Colors
$cyan = "$esc[38;2;86;182;194m"      # Folder - soft cyan
$green = "$esc[38;2;152;195;121m"    # Git branch - soft green
$yellow = "$esc[38;2;229;192;123m"   # Warning/API - soft amber
$orange = "$esc[38;2;209;154;102m"   # API duration - soft orange
$gray = "$esc[38;2;150;150;150m"     # Dimmed text
$white = "$esc[38;2;220;220;220m"    # Normal text

# Context bar colors (gradient based on usage)
$barGreen = "$esc[38;2;152;195;121m"   # 0-50%
$barYellow = "$esc[38;2;229;192;123m"  # 50-75%
$barOrange = "$esc[38;2;209;154;102m"  # 75-90%
$barRed = "$esc[38;2;224;108;117m"     # 90%+

# --- Icons (ASCII-safe) ---
$iconFolder = ">"
$iconBranch = "*"
$iconContext = "#"
$iconTokens = "~"
$iconApi = "^"

# --- Folder Name ---
$cwd = $data.cwd
$folderName = if ($cwd) { Split-Path -Leaf $cwd } else { "~" }

# --- Git Branch ---
$gitBranch = ""
if ($cwd -and (Test-Path $cwd)) {
    Push-Location $cwd
    try {
        $branch = git rev-parse --abbrev-ref HEAD 2>$null
        if ($LASTEXITCODE -eq 0 -and $branch) {
            $gitBranch = $branch
        }
    } catch {}
    Pop-Location
}

# --- Context Usage ---
# Use used_percentage from JSON directly - most accurate (Claude Code calculates this).
# Autocompact triggers at ~95% by default (CLAUDE_AUTOCOMPACT_PCT_OVERRIDE to change).
$contextSize = $data.context_window.context_window_size
$percentUsed = 0
$contextTokens = 0
$hasContextData = $false

# Prefer used_percentage from JSON (approximate - excludes system prompt + MCP tool overhead)
if ($data.context_window.used_percentage -ne $null -and $data.context_window.used_percentage -gt 0) {
    $percentUsed = [math]::Round($data.context_window.used_percentage, 1)
    # Derive token count from percentage for display
    if ($contextSize -gt 0) {
        $contextTokens = [math]::Round($contextSize * $percentUsed / 100)
    }
    $hasContextData = $true
}
# Fallback: calculate from current_usage tokens if used_percentage not available
elseif ($data.context_window.current_usage) {
    $inputTokens = if ($data.context_window.current_usage.input_tokens) {
        $data.context_window.current_usage.input_tokens
    } else { 0 }
    $cacheCreation = if ($data.context_window.current_usage.cache_creation_input_tokens) {
        $data.context_window.current_usage.cache_creation_input_tokens
    } else { 0 }
    $cacheRead = if ($data.context_window.current_usage.cache_read_input_tokens) {
        $data.context_window.current_usage.cache_read_input_tokens
    } else { 0 }
    $contextTokens = $inputTokens + $cacheCreation + $cacheRead

    if ($contextTokens -gt 0 -and $contextSize -gt 0) {
        $hasContextData = $true
        $percentUsed = [math]::Round(($contextTokens / $contextSize) * 100, 1)
        if ($percentUsed -gt 100) { $percentUsed = 100 }
    }
}
# Fallback: total_input_tokens
elseif ($data.context_window.total_input_tokens) {
    $contextTokens = $data.context_window.total_input_tokens
    if ($contextTokens -gt 0 -and $contextSize -gt 0) {
        $hasContextData = $true
        $percentUsed = [math]::Round(($contextTokens / $contextSize) * 100, 1)
        if ($percentUsed -gt 100) { $percentUsed = 100 }
    }
}

# --- Cumulative Totals ---
$totalInput = if ($data.context_window.total_input_tokens) { $data.context_window.total_input_tokens } else { 0 }
$totalOutput = if ($data.context_window.total_output_tokens) { $data.context_window.total_output_tokens } else { 0 }

# --- API Duration (global cumulative with delta indicator) ---
$stateFile = Join-Path $env:USERPROFILE ".claude\.statusline-state.json"
$globalTotalMs = 0
$lastCallMs = 0
$hasValidDelta = $false

if ($data.cost -and $data.cost.total_api_duration_ms) {
    $currentSessionTotal = $data.cost.total_api_duration_ms

    # Default state
    $state = @{
        global_cumulative_ms = 0
        last_session_total_ms = 0
        last_call_ms = 0
        session_id = ""
    }

    # Read previous state from JSON file
    if (Test-Path $stateFile) {
        try {
            $content = Get-Content $stateFile -Raw -ErrorAction Stop
            if ($content) {
                $parsed = $content | ConvertFrom-Json -ErrorAction Stop
                # Convert PSObject to hashtable manually for compatibility
                $state = @{
                    global_cumulative_ms = if ($parsed.global_cumulative_ms) { [long]$parsed.global_cumulative_ms } else { 0 }
                    last_session_total_ms = if ($parsed.last_session_total_ms) { [long]$parsed.last_session_total_ms } else { 0 }
                    last_call_ms = if ($parsed.last_call_ms) { [long]$parsed.last_call_ms } else { 0 }
                    session_id = if ($parsed.session_id) { $parsed.session_id } else { "" }
                }
            }
        } catch {
            # State file corrupted or unreadable, use defaults
        }
    }

    # Get current session ID to detect session changes
    $currentSessionId = if ($data.session_id) { $data.session_id } else { "" }

    # Detect new session by session_id change or time going backwards
    $isNewSession = ($currentSessionId -ne $state.session_id -and $state.session_id -ne "") -or
                    ($currentSessionTotal -lt $state.last_session_total_ms)

    if ($isNewSession) {
        # New session started - add previous session to global
        $state.global_cumulative_ms += $state.last_session_total_ms
        $state.last_session_total_ms = 0
        $state.session_id = $currentSessionId
    }

    # Calculate last call duration (difference since last statusline update)
    $lastCallMs = $currentSessionTotal - $state.last_session_total_ms

    # Only show delta if we have a meaningful previous value (not first call)
    $hasValidDelta = ($state.last_session_total_ms -gt 0) -and ($lastCallMs -gt 0) -and ($lastCallMs -lt $currentSessionTotal)

    # Update state for next call
    $state.last_session_total_ms = $currentSessionTotal
    $state.last_call_ms = $lastCallMs
    $state.session_id = $currentSessionId

    # Calculate display values
    $globalTotalMs = $state.global_cumulative_ms + $currentSessionTotal

    # Save state with proper encoding
    try {
        $stateJson = $state | ConvertTo-Json -Compress
        [System.IO.File]::WriteAllText($stateFile, $stateJson, [System.Text.UTF8Encoding]::new($false))
    } catch {
        # Silently fail if we can't write state
    }
}

# --- Helper Functions ---
function Format-Duration($ms) {
    if ($ms -ge 60000) {
        return "{0:N1}m" -f ($ms / 60000)
    }
    if ($ms -ge 1000) {
        return "{0:N1}s" -f ($ms / 1000)
    }
    return "{0}ms" -f $ms
}

function Format-Tokens($count) {
    if ($count -ge 1000000) {
        return "{0:N1}M" -f ($count / 1000000)
    }
    if ($count -ge 1000) {
        return "{0:N1}k" -f ($count / 1000)
    }
    return $count.ToString()
}

function Get-ProgressBarColor($percent) {
    # Thresholds shifted -15% to compensate for known under-reporting in used_percentage
    # (system prompt + MCP tool definitions not included in JSON field)
    if ($percent -ge 75) { return $barRed }
    if ($percent -ge 60) { return $barOrange }
    if ($percent -ge 35) { return $barYellow }
    return $barGreen
}

function Get-ProgressBar($percent, $width) {
    $filled = [math]::Floor(($percent / 100) * $width)
    $empty = $width - $filled
    $filledChar = [char]0x2588  # Full block
    $emptyChar = [char]0x2591   # Light shade

    $barColor = Get-ProgressBarColor $percent
    $filledPart = "$barColor" + ($filledChar.ToString() * $filled)
    $emptyPart = "$gray" + ($emptyChar.ToString() * $empty)

    return "$filledPart$emptyPart$reset"
}

# --- Build Status Line ---
$fmtContextSize = Format-Tokens $contextSize
$fmtTotalIn = Format-Tokens $totalInput
$fmtTotalOut = Format-Tokens $totalOutput

# Build colored parts
$parts = @()

# Folder with icon
$parts += "$cyan$iconFolder $folderName$reset"

# Git branch with icon (if available)
if ($gitBranch) {
    $parts += "$green$iconBranch $gitBranch$reset"
}

# Context usage with colored bar (or placeholder if no data yet)
if ($hasContextData) {
    $progressBar = Get-ProgressBar $percentUsed 10
    $barColor = Get-ProgressBarColor $percentUsed
    $fmtContextTokens = Format-Tokens $contextTokens
    $parts += "$progressBar $barColor~${percentUsed}%$reset"
    $parts += "$gray$iconContext$reset $white$fmtContextTokens$gray/$fmtContextSize$reset"
} else {
    # No data yet - show waiting indicator
    $emptyBar = "$gray" + ([char]0x2591).ToString() * 10 + "$reset"
    $parts += "$emptyBar ${gray}---%$reset"
    $parts += "$gray$iconContext$reset ${gray}---/$fmtContextSize$reset"
}

# Cumulative tokens
$parts += "$gray$iconTokens$reset $white$fmtTotalIn$gray/$fmtTotalOut$reset"

# API duration with icon
if ($globalTotalMs -gt 0) {
    $globalFormatted = Format-Duration $globalTotalMs
    if ($hasValidDelta) {
        # Show delta only if we have a meaningful value
        $deltaFormatted = Format-Duration $lastCallMs
        $parts += "$orange$iconApi$reset $yellow$globalFormatted$reset $gray(+$deltaFormatted)$reset"
    } else {
        # First call or invalid delta - just show total
        $parts += "$orange$iconApi$reset $yellow$globalFormatted$reset"
    }
}

# Join with separator
$separator = " $gray|$reset "
$status = $parts -join $separator

Write-Host $status
