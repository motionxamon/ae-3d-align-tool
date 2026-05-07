$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "AE_3D_Align_Tool_icons"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

function New-IconBitmap {
    param(
        [string]$Name,
        [scriptblock]$Draw
    )

    $bmp = New-Object System.Drawing.Bitmap 28, 24
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::None
    $g.Clear([System.Drawing.Color]::Transparent)

    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(185, 185, 185))
    & $Draw $g $brush

    $path = Join-Path $outDir ($Name + ".png")
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)

    $brush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
}

function Draw-Rect {
    param($g, $b, [int]$x, [int]$y, [int]$w, [int]$h)
    $g.FillRectangle($b, $x, $y, $w, $h)
}

function Draw-RoundRect {
    param($g, $b, [int]$x, [int]$y, [int]$w, [int]$h, [int]$r)

    $oldMode = $g.SmoothingMode
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

    $d = $r * 2
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc($x, $y, $d, $d, 180, 90)
    $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
    $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
    $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $g.FillPath($b, $path)
    $path.Dispose()

    $g.SmoothingMode = $oldMode
}

New-IconBitmap "align_left" {
    param($g, $b)
    Draw-Rect $g $b 3 3 3 18
    Draw-Rect $g $b 8 5 10 6
    Draw-Rect $g $b 8 14 17 6
}

New-IconBitmap "align_hcenter" {
    param($g, $b)
    Draw-Rect $g $b 13 3 3 18
    Draw-Rect $g $b 9 5 11 6
    Draw-Rect $g $b 6 14 17 6
}

New-IconBitmap "align_right" {
    param($g, $b)
    Draw-Rect $g $b 22 3 3 18
    Draw-Rect $g $b 10 5 10 6
    Draw-Rect $g $b 3 14 17 6
}

New-IconBitmap "align_top" {
    param($g, $b)
    Draw-Rect $g $b 5 3 18 3
    Draw-Rect $g $b 8 8 7 14
    Draw-Rect $g $b 17 8 7 8
}

New-IconBitmap "align_vcenter" {
    param($g, $b)
    Draw-Rect $g $b 5 11 18 3
    Draw-Rect $g $b 7 6 7 12
    Draw-Rect $g $b 16 8 7 8
}

New-IconBitmap "align_bottom" {
    param($g, $b)
    Draw-Rect $g $b 5 20 18 3
    Draw-Rect $g $b 8 4 7 14
    Draw-Rect $g $b 17 10 7 8
}

New-IconBitmap "dist_top" {
    param($g, $b)
    Draw-Rect $g $b 5 4 18 2
    Draw-RoundRect $g $b 8 9 13 4 1
    Draw-RoundRect $g $b 11 17 7 4 1
}

New-IconBitmap "dist_vcenter" {
    param($g, $b)
    Draw-Rect $g $b 5 11 18 2
    Draw-RoundRect $g $b 7 6 14 4 1
    Draw-RoundRect $g $b 7 16 14 4 1
}

New-IconBitmap "dist_bottom" {
    param($g, $b)
    Draw-Rect $g $b 5 20 18 2
    Draw-RoundRect $g $b 11 4 7 4 1
    Draw-RoundRect $g $b 8 12 13 4 1
}

New-IconBitmap "dist_left" {
    param($g, $b)
    Draw-Rect $g $b 4 4 2 16
    Draw-RoundRect $g $b 10 5 4 15 1
    Draw-RoundRect $g $b 19 8 4 9 1
}

New-IconBitmap "dist_hcenter" {
    param($g, $b)
    Draw-Rect $g $b 13 4 2 16
    Draw-RoundRect $g $b 8 6 4 13 1
    Draw-RoundRect $g $b 17 6 4 13 1
}

New-IconBitmap "dist_right" {
    param($g, $b)
    Draw-Rect $g $b 22 4 2 16
    Draw-RoundRect $g $b 5 8 4 9 1
    Draw-RoundRect $g $b 14 5 4 15 1
}

Write-Host "Generated icons in $outDir"
