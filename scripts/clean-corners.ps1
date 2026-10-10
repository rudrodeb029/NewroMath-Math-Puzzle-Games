Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;

public class ImageClipper {
    public static void ClipPolygon(string srcPath, string dstPath, float[] xs, float[] ys) {
        string tempPath = dstPath + ".tmp.png";
        using (Bitmap src = new Bitmap(srcPath)) {
            int w = src.Width;
            int h = src.Height;
            using (Bitmap dst = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
                using (Graphics g = Graphics.FromImage(dst)) {
                    g.SmoothingMode = SmoothingMode.AntiAlias;
                    g.CompositingQuality = CompositingQuality.HighQuality;
                    g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                    g.PixelOffsetMode = PixelOffsetMode.HighQuality;

                    PointF[] pts = new PointF[xs.Length];
                    for (int i = 0; i < xs.Length; i++) {
                        pts[i] = new PointF(xs[i], ys[i]);
                    }

                    using (GraphicsPath path = new GraphicsPath()) {
                        path.AddPolygon(pts);
                        g.SetClip(path);
                        g.DrawImage(src, 0, 0, w, h);
                    }
                }
                dst.Save(tempPath, ImageFormat.Png);
            }
        }
        if (System.IO.File.Exists(dstPath)) {
            System.IO.File.Delete(dstPath);
        }
        System.IO.File.Move(tempPath, dstPath);
    }
}
"@

Write-Host "Processing card images from assets_backup with precision deeper cuts..."

# 1. card_daily_clean.png (540 x 167)
[float[]]$d_xs = @(17, 519, 538, 538, 524, 17, 2, 2)
[float[]]$d_ys = @(0, 0, 19, 151, 167, 167, 150, 17)
[ImageClipper]::ClipPolygon("assets_backup\card_daily_clean.png", "assets\card_daily_clean.png", $d_xs, $d_ys)
Write-Host "Cleaned card_daily_clean.png"

# 2. card_level3_scifi.png (258 x 130)
[float[]]$l_xs = @(18, 242, 256, 256, 243, 18, 3, 3)
[float[]]$l_ys = @(0, 0, 15, 115, 130, 130, 112, 17)
[ImageClipper]::ClipPolygon("assets_backup\card_level3_scifi.png", "assets\card_level3_scifi.png", $l_xs, $l_ys)
Write-Host "Cleaned card_level3_scifi.png"

# 3. card_endless_scifi.png (272 x 130)
[float[]]$e_xs = @(15, 252, 270, 270, 253, 16, 0, 0)
[float[]]$e_ys = @(0, 0, 18, 113, 130, 130, 114, 15)
[ImageClipper]::ClipPolygon("assets_backup\card_endless_scifi.png", "assets\card_endless_scifi.png", $e_xs, $e_ys)
Write-Host "Cleaned card_endless_scifi.png"

# 4. card_continue_clean.png (540 x 74)
[float[]]$c_xs = @(18, 521, 536, 536, 526, 13, 3, 3)
[float[]]$c_ys = @(0, 0, 15, 63, 73, 73, 63, 15)
[ImageClipper]::ClipPolygon("assets_backup\card_continue_clean.png", "assets\card_continue_clean.png", $c_xs, $c_ys)
Write-Host "Cleaned card_continue_clean.png"

# 5. card_newgame_clean.png (540 x 72)
[float[]]$n_xs = @(18, 522, 536, 536, 526, 13, 3, 3)
[float[]]$n_ys = @(0, 0, 15, 61, 71, 71, 61, 15)
[ImageClipper]::ClipPolygon("assets_backup\card_newgame_clean.png", "assets\card_newgame_clean.png", $n_xs, $n_ys)
Write-Host "Cleaned card_newgame_clean.png"

Write-Host "All card corners cleaned with precision and smooth antialiasing!"
