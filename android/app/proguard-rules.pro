# NewroMath R8 / ProGuard rules (release builds are minified + obfuscated)

# Keep line numbers for crash reports but hide original source file names
-keepattributes SourceFile,LineNumberTable,*Annotation*,Signature,InnerClasses,EnclosingMethod
-renamesourcefileattribute SourceFile

# ---- Capacitor core + plugins (bridge uses reflection on @CapacitorPlugin / @PluginMethod) ----
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keepclassmembers class * {
    @com.getcapacitor.PluginMethod public *;
    @com.getcapacitor.annotation.PermissionCallback *;
    @com.getcapacitor.annotation.ActivityCallback *;
}
-keep class * extends com.getcapacitor.Plugin { *; }
-keep class com.capacitorjs.plugins.** { *; }
-keep class com.getcapacitor.community.admob.** { *; }

# ---- WebView JS interfaces ----
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ---- Cordova compatibility layer ----
-keep class org.apache.cordova.** { *; }

# ---- Google Mobile Ads (AdMob) ----
-keep class com.google.android.gms.ads.** { *; }
-keep class com.google.ads.** { *; }
-dontwarn com.google.android.gms.**

# ---- Google Play In-App Billing ----
-keep class com.android.billingclient.** { *; }
-keep class com.capgo.nativepurchases.** { *; }
-dontwarn com.android.billingclient.**

# ---- AndroidX / Kotlin ----
-dontwarn kotlin.**
-dontwarn kotlinx.**
-dontwarn org.jetbrains.annotations.**

# ---- Strip verbose/debug logging from release ----
-assumenosideeffects class android.util.Log {
    public static int v(...);
    public static int d(...);
    public static int i(...);
}
