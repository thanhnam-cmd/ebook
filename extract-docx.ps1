Add-Type -AssemblyName System.IO.Compression.FileSystem
$docx = 'C:\Users\My PC\Downloads\website-content.docx'
if (Test-Path $docx) {
    Write-Output 'FOUND'
    $zip = [System.IO.Compression.ZipFile]::OpenRead($docx)
    $entry = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
    $stream = $entry.Open()
    $reader = New-Object System.IO.StreamReader($stream)
    $xml = $reader.ReadToEnd()
    $reader.Close()
    $zip.Dispose()
    $xml = $xml -replace '</w:p>', "`n"
    $xml = $xml -replace '<[^>]+>', ''
    $xml = [System.Net.WebUtility]::HtmlDecode($xml)
    $xml | Out-File -FilePath 'C:\Users\My PC\Downloads\docx-content.txt' -Encoding UTF8
    Write-Output 'DONE'
} else {
    Write-Output 'NOT FOUND'
}
