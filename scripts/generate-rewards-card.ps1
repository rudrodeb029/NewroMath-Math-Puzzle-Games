Add-Type -AssemblyName System.Drawing

# EXACT SAME DIMENSIONS AS LEVEL 3: 258 x 130!
$width = 258
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
$cTR = 15.0 * $scale
$cBL = 15.0 * $scale
$cBR = 15.0 * $scale

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

# 1. Fill Card Background with Rich Sci-Fi Blue (Matching Level 3)
$cardRect = New-Object System.Drawing.RectangleF $xL, $yT, ($xR - $xL), ($yB - $yT)
$bgGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush ($cardRect, [System.Drawing.Color]::FromArgb(255, 0, 110, 255), [System.Drawing.Color]::FromArgb(255, 0, 40, 185), 40.0)

$g.SetClip($cardPath)
$g.FillPath($bgGrad, $cardPath)
$bgGrad.Dispose()

# Speed stripes
$stripePen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(28, 255, 255, 255)), (2.5 * $scale)
for ($x = -80 * $scale; $x -lt $W + 150 * $scale; $x += 20 * $scale) {
    $g.DrawLine($stripePen, [float]$x, [float]$yT, [float]($x + ($yB - $yT) * 0.95), [float]$yB)
}
$stripePen.Dispose()

# Upper right tech facet plane (Level 3 effect)
$facetPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$fPts = @(
    New-Object System.Drawing.PointF ($xR - 90 * $scale), $yT
    New-Object System.Drawing.PointF ($xR - $cTR), $yT
    New-Object System.Drawing.PointF $xR, ($yT + $cTR)
    New-Object System.Drawing.PointF $xR, ($yT + 45 * $scale)
    New-Object System.Drawing.PointF ($xR - 75 * $scale), ($yT + 25 * $scale)
)
$facetPath.AddPolygon($fPts)
$facetBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(28, 255, 255, 255))
$g.FillPath($facetBrush, $facetPath)
$facetBrush.Dispose()
$facetPath.Dispose()

# Top ambient cyan glow
$topGlowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$topGlowRect = New-Object System.Drawing.RectangleF ($xL), ($yT - 15 * $scale), ($xR - $xL), (50 * $scale)
$topGlowPath.AddEllipse($topGlowRect)
$topGlowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush $topGlowPath
$topGlowBrush.CenterColor = [System.Drawing.Color]::FromArgb(85, 0, 220, 255)
$topGlowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 50, 200))
$g.FillPath($topGlowBrush, $topGlowPath)
$topGlowBrush.Dispose()
$topGlowPath.Dispose()

# Bottom subtle shadow bevel inside plate for 3D depth
$botShadowRect = New-Object System.Drawing.RectangleF $xL, ($yB - 18 * $scale), ($xR - $xL), (18 * $scale)
$botShadowGrad = New-Object System.Drawing.Drawing2D.LinearGradientBrush ($botShadowRect, [System.Drawing.Color]::FromArgb(0, 0, 15, 60), [System.Drawing.Color]::FromArgb(140, 0, 20, 80), 90.0)
$g.FillRectangle($botShadowGrad, $botShadowRect)
$botShadowGrad.Dispose()

# Golden aura behind Gift Dial
$glowPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$glowRect = New-Object System.Drawing.RectangleF (10 * $scale), (14 * $scale), (100 * $scale), (100 * $scale)
$glowPath.AddEllipse($glowRect)
$glowBrush = New-Object System.Drawing.Drawing2D.PathGradientBrush $glowPath
$glowBrush.CenterColor = [System.Drawing.Color]::FromArgb(220, 255, 210, 70)
$glowBrush.SurroundColors = @([System.Drawing.Color]::FromArgb(0, 0, 100, 240))
$g.FillPath($glowBrush, $glowPath)
$glowBrush.Dispose()
$glowPath.Dispose()

# Inner contour line (Level 3 style, completely framing all chamfers)
$inD = 4.5 * $scale
$inTL = 13.0 * $scale
$inTR = 13.0 * $scale
$inBL = 13.0 * $scale
$inBR = 13.0 * $scale
$ixL = $xL + $inD
$ixR = $xR - $inD
$iyT = $yT + $inD
$iyB = $yB - $inD
$innerPts = @(
    New-Object System.Drawing.PointF ($ixL + $inTL), $iyT
    New-Object System.Drawing.PointF ($ixR - $inTR), $iyT
    New-Object System.Drawing.PointF $ixR, ($iyT + $inTR)
    New-Object System.Drawing.PointF $ixR, ($iyB - $inBR)
    New-Object System.Drawing.PointF ($ixR - $inBR), $iyB
    New-Object System.Drawing.PointF ($ixL + $inBL), $iyB
    New-Object System.Drawing.PointF $ixL, ($iyB - $inBL)
    New-Object System.Drawing.PointF $ixL, ($iyT + $inTL)
)
$innerPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$innerPath.AddPolygon($innerPts)
$innerPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(60, 120, 230, 255)), (1.2 * $scale)
$g.DrawPath($innerPen, $innerPath)
$innerPen.Dispose()
$innerPath.Dispose()

$g.ResetClip()

# 2. FULL 3D SCI-FI BORDER AROUND ENTIRE CARD (PROPERLY RECOVERED!)
# Outer soft cyan glow
$outerGlowPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(80, 0, 210, 255)), (5.0 * $scale)
$outerGlowPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$g.DrawPath($outerGlowPen, $cardPath)
$outerGlowPen.Dispose()

# Main Electric Cyan Border (all edges & chamfers recovered!)
$mainBorderPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 0, 215, 255)), (2.8 * $scale)
$mainBorderPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Miter
$g.DrawPath($mainBorderPen, $cardPath)
$mainBorderPen.Dispose()

# Bottom edge subtle darker cyan accent for 3D grounding
$botRecovPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$botRecovPath.AddLine($pBR1, $pBR2)
$botRecovPath.AddLine($pBR2, $pBL1)
$botRecovPath.AddLine($pBL1, $pBL2)
$botRecovPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 0, 150, 240)), (2.2 * $scale)
$botRecovPen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
$g.DrawPath($botRecovPen, $botRecovPath)
$botRecovPen.Dispose()
$botRecovPath.Dispose()

# Specular Highlight on Top Edge & Top-Right Chamfer
$specPath = New-Object System.Drawing.Drawing2D.GraphicsPath
$specPath.AddLine(($xL + $cTL), $yT, ($xR - $cTR), $yT)
$specPath.AddLine(($xR - $cTR), $yT, $xR, ($yT + $cTR))
$specPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 255, 255, 255)), (1.8 * $scale)
$specPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$specPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$g.DrawPath($specPen, $specPath)
$specPen.Dispose()
$specPath.Dispose()

# 3. Draw 3D Rewards Icon (reward_gift_dial_full.png)
$giftPath = "assets/reward_gift_dial_full.png"
if (Test-Path $giftPath) {
    $giftImg = [System.Drawing.Image]::FromFile($giftPath)
    $destX = 12 * $scale
    $destY = 16 * $scale
    $destSize = 98 * $scale
    $g.DrawImage($giftImg, [float]$destX, [float]$destY, [float]$destSize, [float]$destSize)
    $giftImg.Dispose()
}

# 4. Text: "Rewards" & "Coins & Gems"
$fontFamily = New-Object System.Drawing.FontFamily("Arial Black")
$titleFont = New-Object System.Drawing.Font ($fontFamily, (21.5 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$subFont = New-Object System.Drawing.Font ("Arial", (10.5 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

$textX = 116 * $scale
$textY = 28 * $scale

# Title Drop Shadow
$shadowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(240, 0, 15, 65))
$g.DrawString("Rewards", $titleFont, $shadowBrush, ($textX + 2.5 * $scale), ($textY + 2.5 * $scale))
$shadowBrush.Dispose()

# Title White text
$titleBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$g.DrawString("Rewards", $titleFont, $titleBrush, $textX, $textY)
$titleBrush.Dispose()

# Subtitle: "Coins & Gems"
$subY = $textY + 32 * $scale
$subShadow = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 0, 10, 45))
$g.DrawString("Coins & Gems", $subFont, $subShadow, ($textX + 1.5 * $scale), ($subY + 1.5 * $scale))
$subShadow.Dispose()

$subBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 210, 240, 255))
$g.DrawString("Coins & Gems", $subFont, $subBrush, $textX, $subY)
$subBrush.Dispose()

# 5. Right Chevron Button (Matching Level 3 button)
$btnSize = 26 * $scale
$btnX = ($xR - 33 * $scale)
$btnY = ($H / 2 + 7 * $scale)

# Button Dark Base
$btnBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(240, 5, 25, 75))
$g.FillEllipse($btnBrush, $btnX, $btnY, $btnSize, $btnSize)
$btnBrush.Dispose()

# Button Cyan Rim
$btnRimPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(255, 0, 210, 255)), (1.8 * $scale)
$g.DrawEllipse($btnRimPen, $btnX, $btnY, $btnSize, $btnSize)
$btnRimPen.Dispose()

# Chevron '>' Arrow
$chvPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), (2.8 * $scale)
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

# Downsample to target 258x130 (EXACT SAME SIZE AS LEVEL 3!)
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
Write-Host "Successfully generated $outPath (258x130) with recovered 3D cyan borders!"
