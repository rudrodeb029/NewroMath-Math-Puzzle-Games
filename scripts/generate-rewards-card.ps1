Add-Type -AssemblyName System.Drawing

$width = 272
$height = 130
$scale = 3

$W = $width * $scale
$H = $height * $scale

$bmp = New-Object System.Drawing.Bitmap $W, $H, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

# Outer plate inset
$padL = 3.0 * $scale
$padR = 3.0 * $scale
$padT = 2.5 * $scale
$padB = 2.5 * $scale

$cTL = 15.0 * $scale
$cTR = 17.0 * $scale
$cBL = 15.0 * $scale
$cBR = 16.0 * $scale

$xL = $padL
$xR = $W - $padR
$yT = $padT
$yB = $H - $padB

$pTL1 = New-Object System.Drawing.PointF ($xL + $cTL), $yT
$pTR1 = New-Object System.Drawing.PointF ($xR - $cTR), $yT
$pTR2 = New-Object System.Drawing.PointF $xR, ($yT + $cTR)
$pBR1 = New-Object System.Drawing.PointF $xR, ($yB - $cBR)
$pBR2 = New-Object System.Drawing.PointF ($xR - $cBR), $yB
$pBL1 = New-Object System.Drawing.PointF ($xL + $cBL), $yB
$pBL2 = New-Object System.Drawing.PointF $xL, ($yB - $cBL)
$pTL2 = New-Object System.Drawing.PointF $xL, ($yT + $cTL)

$pts = @($pTL1, $pTR1, $pTR2, $pBR1, $pBR2, $pBL1, $pBL2, $pTL2)

$cardPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$cardPath.AddPolygon($pts)

# 1. Fill Card Background with Rich Sci-Fi Blue (EXACT LEVEL 3 PALETTE)
$cardRect = New-Object System.Drawing.RectangleF $xL, $yT, ($xR - $xL), ($yB - $yT)
$bgGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush ($cardRect, [System.Drawing.Color]::FromArgb(255, 0, 115, 255), [System.Drawing.Color]::FromArgb(255, 0, 40, 180), 38.0)

$g.SetClip($cardPath)
$g.FillPath($bgGrad, $cardPath)
$bgGrad.Dispose()

# Tech Facets & Speed Stripes (matching Level 3)
$stripePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(30, 255, 255, 255)), (2.5 * $scale)
for ($x = -80 * $scale; $x -lt $W + 150 * $scale; $x += 22 * $scale) {
    $g.DrawLine($stripePen, [float]$x, [float]$yT, [float]($x + ($yB - $yT) * 0.95), [float]$yB)
}
$stripePen.Dispose()

# Lighter blue geometric facet planes in the upper right (Level 3 signature effect)
$facetPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$fPts = @(
    New-Object System.Drawing.PointF ($xR - 100 * $scale), $yT
    New-Object System.Drawing.PointF ($xR - $cTR), $yT
    New-Object System.Drawing.PointF $xR, ($yT + $cTR)
    New-Object System.Drawing.PointF $xR, ($yT + 50 * $scale)
    New-Object System.Drawing.PointF ($xR - 80 * $scale), ($yT + 30 * $scale)
)
$facetPath.AddPolygon($fPts)
$facetBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(30, 255, 255, 255))
$g.FillPath($facetBrush, $facetPath)
$facetBrush.Dispose()
$facetPath.Dispose()

# Top ambient cyan glow inside plate
$topGlowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$topGlowRect = New-Object System.Drawing.RectangleF ($xL), ($yT - 15 * $scale), ($xR - $xL), (50 * $scale)
$topGlowPath.AddEllipse($topGlowRect)
$topGlowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush $topGlowPath
$topGlowBrush.CenterColor = [System.Drawing.Color]::FromArgb(85, 0, 220, 255)
$topGlowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 50, 200))
$g.FillPath($topGlowBrush, $topGlowPath)
$topGlowBrush.Dispose()
$topGlowPath.Dispose()

# Bottom shadow inside plate (Level 3 depth effect)
$botShadowRect = New-Object System.Drawing.RectangleF $xL, ($yB - 25 * $scale), ($xR - $xL), (25 * $scale)
$botShadowGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush ($botShadowRect, [System.Drawing.Color]::FromArgb(0, 0, 15, 60), [System.Drawing.Color]::FromArgb(180, 0, 20, 80), 90.0)
$g.FillRectangle($botShadowGrad, $botShadowRect)
$botShadowGrad.Dispose()

# Glowing circular aura on the left for the 3D gift dial
$glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowRect = New-Object System.Drawing.RectangleF (10 * $scale), (12 * $scale), (105 * $scale), (105 * $scale)
$glowPath.AddEllipse($glowRect)
$glowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush $glowPath
$glowBrush.CenterColor = [System.Drawing.Color]::FromArgb(230, 255, 210, 70) # Golden sparkle
$glowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 100, 240))
$g.FillPath($glowBrush, $glowPath)
$glowBrush.Dispose()
$glowPath.Dispose()

# Inner cyan contour line (Level 3 style)
$inD = 4.5 * $scale
$inTL = 13.0 * $scale
$inTR = 15.0 * $scale
$ixL = $xL + $inD
$ixR = $xR - $inD
$iyT = $yT + $inD
$innerTopPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$innerTopPath.AddLine([float]($ixL), [float]($iyT + 20 * $scale), [float]($ixL), [float]($iyT + $inTL))
$innerTopPath.AddLine([float]($ixL), [float]($iyT + $inTL), [float]($ixL + $inTL), [float]$iyT)
$innerTopPath.AddLine([float]($ixL + $inTL), [float]$iyT, [float]($ixR - $inTR), [float]$iyT)
$innerTopPath.AddLine([float]($ixR - $inTR), [float]$iyT, [float]$ixR, [float]($iyT + $inTR))
$innerTopPath.AddLine([float]$ixR, [float]($iyT + $inTR), [float]$ixR, [float]($iyT + 25 * $scale))
$innerPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(90, 130, 235, 255)), (1.2 * $scale)
$g.DrawPath($innerPen, $innerTopPath)
$innerPen.Dispose()
$innerTopPath.Dispose()

$g.ResetClip()

# 2. BORDERS: EXACT LEVEL CARD EFFECTS (ELECTRIC CYAN & 3D METALLIC BEVEL)
# Bottom & Bottom-Right: Clean shadow bevel
$botPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$botPath.AddLine($pBR1, $pBR2)
$botPath.AddLine($pBR2, $pBL1)
$botPath.AddLine($pBL1, $pBL2)
$botShadowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(180, 0, 25, 95)), (2.5 * $scale)
$botShadowPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$g.DrawPath($botShadowPen, $botPath)
$botShadowPen.Dispose()
$botPath.Dispose()

# Right edge fading cyan line
$rightFadeRect = New-Object System.Drawing.RectangleF ($xR - 5 * $scale), ($yT + $cTR), (10 * $scale), (65 * $scale)
$rightFadeGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush ($rightFadeRect, [System.Drawing.Color]::FromArgb(255, 0, 225, 255), [System.Drawing.Color]::FromArgb(0, 0, 100, 230), 90.0)
$rightFadePen = New-Object System.Drawing.Pen $rightFadeGrad, (3.2 * $scale)
$rightFadePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$rightFadePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawLine($rightFadePen, [float]$xR, [float]($yT + $cTR), [float]$xR, [float]($yT + $cTR + 55 * $scale))
$rightFadePen.Dispose()
$rightFadeGrad.Dispose()

# Top Edge, Top-Right Chamfer, Top-Left Chamfer, Left Edge (Level 3 Electric Cyan)
$litPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$litPath.AddLine($pBL2, $pTL2)
$litPath.AddLine($pTL2, $pTL1)
$litPath.AddLine($pTL1, $pTR1)
$litPath.AddLine($pTR1, $pTR2)

# Outer soft cyan glow
$outerGlowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(90, 0, 200, 255)), (5.5 * $scale)
$outerGlowPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$g.DrawPath($outerGlowPen, $litPath)
$outerGlowPen.Dispose()

# Vibrant Cyan Border (Level 3 signature border)
$cyanPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 0, 220, 255)), (3.2 * $scale)
$cyanPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Miter
$g.DrawPath($cyanPen, $litPath)
$cyanPen.Dispose()

# Crisp Bright Core Border Line
$corePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 185, 245, 255)), (1.6 * $scale)
$corePen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Miter
$g.DrawPath($corePen, $litPath)
$corePen.Dispose()

# Specular Highlight on Top Edge & Top-Right Chamfer
$specPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$specPath.AddLine(($xL + $cTL), $yT, ($xR - $cTR), $yT)
$specPath.AddLine(($xR - $cTR), $yT, $xR, ($yT + $cTR))
$specPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 255, 255)), (2.0 * $scale)
$specPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$specPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawPath($specPen, $specPath)
$specPen.Dispose()
$specPath.Dispose()
$litPath.Dispose()

# 3. Draw 3D Rewards Icon (reward_gift_dial_full.png)
$giftPath = "assets/reward_gift_dial_full.png"
if (Test-Path $giftPath) {
    $giftImg = [System.Drawing.Image]::FromFile($giftPath)
    $destX = 14 * $scale
    $destY = 16 * $scale
    $destSize = 98 * $scale
    $g.DrawImage($giftImg, [float]$destX, [float]$destY, [float]$destSize, [float]$destSize)
    $giftImg.Dispose()
}

# 4. Text: "Rewards" & "Coins & Gems"
$fontFamily = New-Object System.Drawing.FontFamily("Arial Black")
$titleFont = New-Object System.Drawing.Font ($fontFamily, (22.5 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$subFont = New-Object System.Drawing.Font ("Arial", (11.0 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

$textX = 120 * $scale
$textY = 27 * $scale

# Title Drop Shadow (Deep navy blue shadow)
$shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(240, 0, 15, 65))
$g.DrawString("Rewards", $titleFont, $shadowBrush, ($textX + 2.5 * $scale), ($textY + 2.5 * $scale))
$shadowBrush.Dispose()

# Title White text
$titleBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$g.DrawString("Rewards", $titleFont, $titleBrush, $textX, $textY)
$titleBrush.Dispose()

# Subtitle: "Coins & Gems"
$subY = $textY + 33 * $scale
$subShadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 0, 10, 45))
$g.DrawString("Coins & Gems", $subFont, $subShadow, ($textX + 1.5 * $scale), ($subY + 1.5 * $scale))
$subShadow.Dispose()

$subBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 210, 240, 255))
$g.DrawString("Coins & Gems", $subFont, $subBrush, $textX, $subY)
$subBrush.Dispose()

# 5. Right Chevron Button (Identical to Level 3 button)
$btnSize = 27 * $scale
$btnX = ($xR - 35 * $scale)
$btnY = ($H / 2 + 7 * $scale)

# Button Dark Base
$btnBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(240, 5, 25, 75))
$g.FillEllipse($btnBrush, $btnX, $btnY, $btnSize, $btnSize)
$btnBrush.Dispose()

# Button Cyan Rim (matching Level 3 button)
$btnRimPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 0, 210, 255)), (1.8 * $scale)
$g.DrawEllipse($btnRimPen, $btnX, $btnY, $btnSize, $btnSize)
$btnRimPen.Dispose()

# Chevron '>' Arrow
$chvPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), (3.0 * $scale)
$chvPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$chvPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$midX = $btnX + $btnSize / 2
$midY = $btnY + $btnSize / 2
$g.DrawLine($chvPen, [float]($midX - 2.8 * $scale), [float]($midY - 5.5 * $scale), [float]($midX + 3.2 * $scale), [float]$midY)
$g.DrawLine($chvPen, [float]($midX + 3.2 * $scale), [float]$midY, [float]($midX - 2.8 * $scale), [float]($midY + 5.5 * $scale))
$chvPen.Dispose()

$titleFont.Dispose()
$subFont.Dispose()
$fontFamily.Dispose()
$cardPath.Dispose()
$g.Dispose()

# Downsample to target 272x130
$finalBmp = New-Object System.Drawing.Bitmap $width, $height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$finalG = [System.Drawing.Graphics]::FromImage($finalBmp)
$finalG.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$finalG.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$finalG.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$finalG.DrawImage($bmp, 0, 0, $width, $height)
$finalG.Dispose()
$bmp.Dispose()

$outPath = "assets/card_rewards_scifi.png"
$finalBmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
$finalBmp.Dispose()
Write-Host "Successfully generated $outPath with Level-style sci-fi effects and electric cyan glow!"
