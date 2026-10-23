package com.newromath.puzzlegames;

import android.content.pm.ApplicationInfo;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.Debug;
import android.view.View;
import android.view.Window;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.net.InetSocketAddress;
import java.net.Socket;

/**
 * NewroMath main activity.
 * - Locks WebView text zoom so system font-size settings cannot break the game layout on any device
 * - Disables overscroll bounce for a stable, non-jumping screen
 * - Runs lightweight runtime integrity checks (root, emulator, debugger, hooking frameworks, debuggable build)
 *   and exposes the result to the web layer as window.__NM_INTEGRITY for anti-cheat decisions
 */
public class MainActivity extends BridgeActivity {

    private String integrityJson = "{\"checked\":false}";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        applyStableWindow();
        configureWebView();

        // Run integrity checks off the UI thread so app start-up stays smooth
        new Thread(() -> {
            integrityJson = runIntegrityChecks();
            runOnUiThread(this::publishIntegrity);
        }, "nm-integrity").start();
    }

    @Override
    public void onResume() {
        super.onResume();
        publishIntegrity();
    }

    private void applyStableWindow() {
        try {
            Window window = getWindow();
            window.setStatusBarColor(Color.parseColor("#0d1a40"));
            window.setNavigationBarColor(Color.parseColor("#0d1a40"));
            window.getDecorView().setBackgroundColor(Color.parseColor("#183278"));
        } catch (Exception ignored) {
        }
    }

    private void configureWebView() {
        try {
            WebView webView = getBridge().getWebView();
            WebSettings settings = webView.getSettings();
            // Ignore the device's accessibility font scale so layouts are identical on every phone
            settings.setTextZoom(100);
            settings.setSupportZoom(false);
            settings.setBuiltInZoomControls(false);
            settings.setDisplayZoomControls(false);
            // Security: no file / content access from web content, no mixed content
            settings.setAllowFileAccess(false);
            settings.setAllowContentAccess(false);
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
            webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
            webView.setVerticalScrollBarEnabled(false);
            webView.setHorizontalScrollBarEnabled(false);
            webView.setBackgroundColor(Color.parseColor("#183278"));
            webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);

            boolean isDebuggable = (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
            WebView.setWebContentsDebuggingEnabled(isDebuggable);
        } catch (Exception ignored) {
        }
    }

    private void publishIntegrity() {
        try {
            WebView webView = getBridge().getWebView();
            String js = "window.__NM_INTEGRITY=" + integrityJson + ";"
                    + "window.dispatchEvent(new CustomEvent('nm-integrity',{detail:window.__NM_INTEGRITY}));";
            webView.post(() -> webView.evaluateJavascript(js, null));
        } catch (Exception ignored) {
        }
    }

    // ===================== Integrity checks =====================

    private String runIntegrityChecks() {
        boolean rooted = isRooted();
        boolean emulator = isEmulator();
        boolean debugger = Debug.isDebuggerConnected() || Debug.waitingForDebugger();
        boolean hooked = isHookFrameworkPresent();
        boolean debuggable = (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE) != 0;
        boolean compromised = rooted || debugger || hooked || (!debuggable && emulator);

        return "{\"checked\":true"
                + ",\"rooted\":" + rooted
                + ",\"emulator\":" + emulator
                + ",\"debugger\":" + debugger
                + ",\"hooked\":" + hooked
                + ",\"debuggable\":" + debuggable
                + ",\"compromised\":" + compromised
                + ",\"ts\":" + System.currentTimeMillis()
                + "}";
    }

    private boolean isRooted() {
        String tags = Build.TAGS;
        if (tags != null && tags.contains("test-keys")) return true;
        String[] paths = {
                "/system/app/Superuser.apk", "/sbin/su", "/system/bin/su", "/system/xbin/su",
                "/data/local/xbin/su", "/data/local/bin/su", "/system/sd/xbin/su",
                "/system/bin/failsafe/su", "/data/local/su", "/su/bin/su", "/system/xbin/daemonsu",
                "/sbin/.magisk", "/data/adb/magisk", "/data/adb/modules", "/cache/.disable_magisk"
        };
        for (String p : paths) {
            if (new File(p).exists()) return true;
        }
        return false;
    }

    private boolean isEmulator() {
        String fp = Build.FINGERPRINT == null ? "" : Build.FINGERPRINT;
        String model = Build.MODEL == null ? "" : Build.MODEL;
        String manu = Build.MANUFACTURER == null ? "" : Build.MANUFACTURER;
        String hw = Build.HARDWARE == null ? "" : Build.HARDWARE;
        String product = Build.PRODUCT == null ? "" : Build.PRODUCT;
        return fp.startsWith("generic") || fp.startsWith("unknown") || fp.contains("emulator")
                || model.contains("google_sdk") || model.contains("Emulator") || model.contains("Android SDK built for")
                || manu.contains("Genymotion") || hw.contains("goldfish") || hw.contains("ranchu")
                || product.contains("sdk_gphone") || product.contains("vbox86p") || product.contains("emulator")
                || (Build.BRAND != null && Build.BRAND.startsWith("generic") && Build.DEVICE != null && Build.DEVICE.startsWith("generic"));
    }

    private boolean isHookFrameworkPresent() {
        // 1. Xposed / LSPosed classes
        try {
            Class.forName("de.robv.android.xposed.XposedBridge");
            return true;
        } catch (Throwable ignored) {
        }
        // 2. Frida / Xposed libraries mapped into our process
        try (BufferedReader reader = new BufferedReader(new FileReader("/proc/self/maps"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String l = line.toLowerCase();
                if (l.contains("frida") || l.contains("gum-js-loop") || l.contains("xposed")
                        || l.contains("lsposed") || l.contains("substrate")) {
                    return true;
                }
            }
        } catch (Throwable ignored) {
        }
        // 3. Default frida-server port
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress("127.0.0.1", 27042), 150);
            return true;
        } catch (Throwable ignored) {
        }
        return false;
    }
}
