
# PowerShell script to convert PDF to images using Windows Runtime API
param(
    [string]$pdfPath = "E:\2026精选案例库\{01} ON&OFFline方案库\二次元活动2024.pdf",
    [string]$outputDir = "e:\portfolio-helenq0414\public\cases\anime_event_2024"
)

try {
    if (!(Test-Path $outputDir)) {
        New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
    }

    [void][System.Reflection.Assembly]::LoadWithPartialName("System.Runtime.WindowsRuntime")
    $absPdfPath = [System.IO.Path]::GetFullPath($pdfPath)
    
    if (!(Test-Path $absPdfPath)) {
        Write-Error "PDF file not found at $absPdfPath"
        exit 1
    }

    $storageFileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync($absPdfPath)
    while ($storageFileTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
    $storageFile = $storageFileTask.GetResults()

    $pdfDocTask = [Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($storageFile)
    while ($pdfDocTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
    $pdfDoc = $pdfDocTask.GetResults()

    $pageCount = $pdfDoc.PageCount
    Write-Host "PDF loaded successfully. Total Pages: $pageCount"

    for ($i = 0; $i -lt $pageCount; $i++) {
        $page = $pdfDoc.GetPage($i)
        $outputFile = Join-Path $outputDir ("page_" + ($i + 1).ToString("00") + ".png")
        
        if (!(Test-Path $outputFile)) {
            $parentDirTask = [Windows.Storage.StorageFolder]::GetFolderFromPathAsync([System.IO.Path]::GetFullPath($outputDir))
            while ($parentDirTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
            $parentFolder = $parentDirTask.GetResults()
            
            $createFileTask = $parentFolder.CreateFileAsync(("page_" + ($i + 1).ToString("00") + ".png"), [Windows.Storage.CreationCollisionOption]::ReplaceExisting)
            while ($createFileTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
            $storageOutputFile = $createFileTask.GetResults()
        } else {
            $storageOutputFileTask = [Windows.Storage.StorageFile]::GetFileFromPathAsync([System.IO.Path]::GetFullPath($outputFile))
            while ($storageOutputFileTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
            $storageOutputFile = $storageOutputFileTask.GetResults()
        }

        $streamTask = $storageOutputFile.OpenAsync([Windows.Storage.FileAccessMode]::ReadWrite)
        while ($streamTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
        $stream = $streamTask.GetResults()

        $renderOptions = New-Object Windows.Data.Pdf.PdfPageRenderOptions
        $renderTask = $page.RenderToStreamAsync($stream, $renderOptions)
        while ($renderTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
        
        $flushTask = $stream.FlushAsync()
        while ($flushTask.Status -eq 'Started') { Start-Sleep -Milliseconds 50 }
        
        $stream.Close()
        Write-Host "Rendered Page $($i + 1) to $outputFile"
    }

    Write-Host "Success: All pages converted to images!"
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
