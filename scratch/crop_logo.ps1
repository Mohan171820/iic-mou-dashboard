Add-Type -AssemblyName System.Drawing
$imgPath = 'C:\Users\miriy\.gemini\antigravity-ide\brain\cde3bd72-7f9c-4767-b7d4-e32ecb51fe37\.tempmediaStorage\media_1792128439673.png'
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)

$minX = $bmp.Width
$maxX = 0
$minY = $bmp.Height
$maxY = 0

# Scan between X: 30% and 70% width, Y: 10 to 160
$startX = [int]($bmp.Width * 0.30)
$endX = [int]($bmp.Width * 0.70)

for ($y = 10; $y -lt 160; $y += 1) {
    for ($x = $startX; $x -lt $endX; $x += 1) {
        $pixel = $bmp.GetPixel($x, $y)
        # Check if pixel is dark enough (logo colors: gold/blue/black)
        if ($pixel.R -lt 230 -or $pixel.G -lt 230 -or $pixel.B -lt 230) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Found logo inside center strip: X=$minX to $maxX, Y=$minY to $maxY"
$pad = 12
$cropX = [Math]::Max(0, $minX - $pad)
$cropY = [Math]::Max(0, $minY - $pad)
$cropW = [Math]::Min($bmp.Width - $cropX, ($maxX - $minX) + ($pad * 2))
$cropH = [Math]::Min($bmp.Height - $cropY, ($maxY - $minY) + ($pad * 2))

$rect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$cropped = $bmp.Clone($rect, $bmp.PixelFormat)
$cropped.Save('public\images\srm_logo.png', [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
$bmp.Dispose()
Write-Host "Precisely cropped and saved public\images\srm_logo.png (Width: $cropW, Height: $cropH)!"
