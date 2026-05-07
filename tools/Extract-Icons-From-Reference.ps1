$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$source = "D:\WORK\STOCKS\Sport Versus Opener\2b6a0189-ab15-4a44-9ec3-a6d1ad4b08b7.png"
$outDir = Join-Path $root "AE_3D_Align_Tool_icons"
if (!(Test-Path $outDir)) {
    New-Item -ItemType Directory -Path $outDir | Out-Null
}

$icons = @(
    @{ Name = "align_left";    X = 90;   Y = 267; W = 106; H = 127 },
    @{ Name = "align_hcenter"; X = 333;  Y = 267; W = 104; H = 127 },
    @{ Name = "align_right";   X = 579;  Y = 267; W = 106; H = 127 },
    @{ Name = "align_top";     X = 751;  Y = 274; W = 115; H = 112 },
    @{ Name = "align_vcenter"; X = 950;  Y = 284; W = 128; H = 100 },
    @{ Name = "align_bottom";  X = 1157; Y = 280; W = 130; H = 106 },
    @{ Name = "dist_top";      X = 91;   Y = 602; W = 108; H = 110 },
    @{ Name = "dist_vcenter";  X = 313;  Y = 608; W = 107; H = 105 },
    @{ Name = "dist_bottom";   X = 542;  Y = 604; W = 112; H = 108 },
    @{ Name = "dist_left";     X = 751;  Y = 601; W = 111; H = 112 },
    @{ Name = "dist_hcenter";  X = 955;  Y = 601; W = 104; H = 111 },
    @{ Name = "dist_right";    X = 1160; Y = 601; W = 112; H = 111 }
)

function Export-Icon {
    param(
        [System.Drawing.Bitmap]$SourceBitmap,
        [hashtable]$Spec
    )

    $targetW = 28
    $targetH = 24
    $scale = [Math]::Min(($targetW - 2) / $Spec.W, ($targetH - 2) / $Spec.H)
    $drawW = [Math]::Round($Spec.W * $scale)
    $drawH = [Math]::Round($Spec.H * $scale)
    $offsetX = [Math]::Floor(($targetW - $drawW) / 2)
    $offsetY = [Math]::Floor(($targetH - $drawH) / 2)

    $crop = New-Object System.Drawing.Bitmap $Spec.W, $Spec.H
    $cg = [System.Drawing.Graphics]::FromImage($crop)
    $cg.DrawImage($SourceBitmap, 0, 0, (New-Object System.Drawing.Rectangle $Spec.X, $Spec.Y, $Spec.W, $Spec.H), [System.Drawing.GraphicsUnit]::Pixel)
    $cg.Dispose()

    $scaled = New-Object System.Drawing.Bitmap $targetW, $targetH
    $sg = [System.Drawing.Graphics]::FromImage($scaled)
    $sg.Clear([System.Drawing.Color]::Transparent)
    $sg.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $sg.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $sg.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $sg.DrawImage($crop, $offsetX, $offsetY, $drawW, $drawH)
    $sg.Dispose()
    $crop.Dispose()

    for ($y = 0; $y -lt $targetH; $y++) {
        for ($x = 0; $x -lt $targetW; $x++) {
            $c = $scaled.GetPixel($x, $y)
            $luma = [int](($c.R * 0.299) + ($c.G * 0.587) + ($c.B * 0.114))
            $alpha = [Math]::Max(0, [Math]::Min(255, ($luma - 18) * 2.4))
            if ($alpha -lt 10) {
                $scaled.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            } else {
                $scaled.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, 185, 185, 185))
            }
        }
    }

    $outPath = Join-Path $outDir ($Spec.Name + ".png")
    $scaled.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $scaled.Dispose()
}

$src = [System.Drawing.Bitmap]::FromFile($source)
try {
    foreach ($icon in $icons) {
        Export-Icon -SourceBitmap $src -Spec $icon
    }
} finally {
    $src.Dispose()
}

Write-Host "Extracted reference icons to $outDir"
