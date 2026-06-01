param(
    [string]$InputDir = "E:\2026精选案例库"
)

# reload PATH to make sure ffmpeg is available
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Check if ffmpeg is available
if (-not (Get-Command ffmpeg -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: ffmpeg is not found in your PATH." -ForegroundColor Red
    Write-Host "Please restart your terminal or shell to apply PATH changes, or install FFmpeg." -ForegroundColor Red
    Exit 1
}

$OutputDir = Join-Path $InputDir "compressed"

if (-not (Test-Path -Path $OutputDir)) {
    [System.IO.Directory]::CreateDirectory($OutputDir) | Out-Null
}

Write-Host "=============================================" -ForegroundColor Green
Write-Host "=== Starting Web Video & GIF Compression ===" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "Input Directory  : $InputDir"
Write-Host "Output Directory : $OutputDir`n"

# Get all files using LiteralPath to avoid issues with brackets [] in filenames
$files = Get-ChildItem -LiteralPath $InputDir | Where-Object { 
    $_.Extension -eq '.mp4' -or $_.Extension -eq '.gif' 
}

$totalFiles = $files.Count
$processedCount = 0
$totalSavedBytes = 0

Write-Host "Found $totalFiles files to process (MP4 and GIF).`n"

$logFile = Join-Path $OutputDir "ffmpeg_temp.log"

foreach ($file in $files) {
    $processedCount++
    $originalSize = $file.Length
    $originalName = $file.Name
    $ext = $file.Extension.ToLower()
    
    # Define output file path
    if ($ext -eq '.gif') {
        # GIFs are converted to .mp4
        $outputName = [System.IO.Path]::ChangeExtension($originalName, ".mp4")
    } else {
        $outputName = $originalName
    }
    
    $outputFile = Join-Path $OutputDir $outputName
    
    # Skip if already exists and is not empty
    if (Test-Path -LiteralPath $outputFile) {
        $outFileItem = Get-Item -LiteralPath $outputFile -ErrorAction SilentlyContinue
        if ($outFileItem -and $outFileItem.Length -gt 0) {
            Write-Host "[$processedCount/$totalFiles] Skipping '$originalName' (already compressed in output folder)." -ForegroundColor Yellow
            continue
        } else {
            # Clean up 0-byte files from previous failed encodes
            Remove-Item -LiteralPath $outputFile -Force -ErrorAction SilentlyContinue
        }
    }
    
    Write-Host "[$processedCount/$totalFiles] Processing '$originalName'..." -ForegroundColor Cyan
    Write-Host "  Format       : $ext" -ForegroundColor DarkGray
    Write-Host "  Original Size: $([Math]::Round($originalSize / 1MB, 2)) MB" -ForegroundColor DarkGray
    
    $startTime = Get-Date
    
    # Build ffmpeg arguments
    $ffmpegArgs = @()
    if ($ext -eq '.gif') {
        # GIF conversion settings: H.264, YUV420p color format, CRF 23, Muted, Slow preset, Faststart, Divisible by 2 filter
        $ffmpegArgs += "-i", $file.FullName
        $ffmpegArgs += "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2"
        $ffmpegArgs += "-vcodec", "libx264"
        $ffmpegArgs += "-pix_fmt", "yuv420p"
        $ffmpegArgs += "-preset", "slow"
        $ffmpegArgs += "-crf", "23"
        $ffmpegArgs += "-an" # No audio
        $ffmpegArgs += "-movflags", "+faststart"
        $ffmpegArgs += "-y"
        $ffmpegArgs += $outputFile
    } else {
        # MP4 compression settings: H.264, CRF 23, Slow preset, AAC audio 128k, Faststart, Divisible by 2 filter
        $ffmpegArgs += "-i", $file.FullName
        $ffmpegArgs += "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2"
        $ffmpegArgs += "-vcodec", "libx264"
        $ffmpegArgs += "-preset", "slow"
        $ffmpegArgs += "-crf", "23"
        $ffmpegArgs += "-acodec", "aac"
        $ffmpegArgs += "-b:a", "128k"
        $ffmpegArgs += "-movflags", "+faststart"
        $ffmpegArgs += "-y"
        $ffmpegArgs += $outputFile
    }
    
    # Run ffmpeg and redirect stderr to logFile (since ffmpeg outputs progress to stderr)
    if (Test-Path -LiteralPath $logFile) { Remove-Item -LiteralPath $logFile }
    
    # Start ffmpeg
    & ffmpeg $ffmpegArgs 2>$logFile
    
    if ($LASTEXITCODE -eq 0 -and (Test-Path -LiteralPath $outputFile)) {
        $endTime = Get-Date
        $duration = $endTime - $startTime
        $compressedSize = (Get-Item -LiteralPath $outputFile).Length
        $saved = $originalSize - $compressedSize
        $totalSavedBytes += $saved
        $ratio = [Math]::Round(($compressedSize / $originalSize) * 100, 1)
        
        Write-Host "  Status       : SUCCESS" -ForegroundColor Green
        Write-Host "  Duration     : $([Math]::Round($duration.TotalSeconds, 1)) seconds" -ForegroundColor Green
        Write-Host "  New Size     : $([Math]::Round($compressedSize / 1MB, 2)) MB ($ratio% of original)" -ForegroundColor Green
        Write-Host "  Space Saved  : $([Math]::Round($saved / 1MB, 2)) MB`n" -ForegroundColor Green
    } else {
        Write-Host "  Status       : FAILED" -ForegroundColor Red
        if (Test-Path -LiteralPath $logFile) {
            Write-Host "  FFmpeg Error Logs (Last 15 lines):" -ForegroundColor Red
            Get-Content -LiteralPath $logFile -Tail 15 | ForEach-Object { Write-Host "    $_" -ForegroundColor Red }
        }
        Write-Host ""
    }
}

if (Test-Path -LiteralPath $logFile) { Remove-Item -LiteralPath $logFile }

$totalSavedMB = [Math]::Round($totalSavedBytes / 1MB, 2)
Write-Host "=============================================" -ForegroundColor Green
Write-Host "=== Compression Process Completed!        ===" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host "Total space saved: $totalSavedMB MB" -ForegroundColor Green
