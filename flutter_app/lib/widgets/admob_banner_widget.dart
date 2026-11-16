import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import '../data/levels_catalog.dart';

/// Fixed-height (50dp) Google AdMob Demo Bottom Banner Container.
///
/// Mirrors `AdMobBanner` in `src/components/AdMobComponents.jsx`:
/// - Uses official Google AdMob Demo Banner ID (`ca-app-pub-3940256099942544/6300978111`)
/// - Collapses to `SizedBox.shrink()` when [isProUser] is true
/// - Renders native `AdWidget` on Android/iOS once loaded, with a zero-reflow
///   dark navy (`#061026`) test ad surface while loading or on desktop/test runners.
class AdMobBannerWidget extends StatefulWidget {
  const AdMobBannerWidget({
    super.key,
    this.isProUser = false,
  });

  final bool isProUser;

  @override
  State<AdMobBannerWidget> createState() => _AdMobBannerWidgetState();
}

class _AdMobBannerWidgetState extends State<AdMobBannerWidget> {
  BannerAd? _bannerAd;
  bool _isLoaded = false;

  bool get _isMobilePlatform =>
      !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS);

  @override
  void initState() {
    super.initState();
    if (!widget.isProUser && _isMobilePlatform) {
      _loadBanner();
    }
  }

  @override
  void didUpdateWidget(covariant AdMobBannerWidget oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.isProUser && _bannerAd != null) {
      _bannerAd?.dispose();
      _bannerAd = null;
      _isLoaded = false;
    } else if (!widget.isProUser && _bannerAd == null && _isMobilePlatform) {
      _loadBanner();
    }
  }

  void _loadBanner() {
    try {
      final ad = BannerAd(
        adUnitId: AdMobConfig.bannerAdUnitId,
        size: AdSize.banner,
        request: const AdRequest(),
        listener: BannerAdListener(
          onAdLoaded: (loadedAd) {
            if (!mounted) {
              loadedAd.dispose();
              return;
            }
            setState(() {
              _isLoaded = true;
            });
          },
          onAdFailedToLoad: (failedAd, error) {
            failedAd.dispose();
            if (mounted) {
              setState(() {
                _bannerAd = null;
                _isLoaded = false;
              });
            }
          },
        ),
      );
      _bannerAd = ad;
      ad.load();
    } catch (_) {
      // Safe fallback on environments where MobileAds is not initialized (e.g. unit tests)
      _bannerAd = null;
      _isLoaded = false;
    }
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.isProUser) {
      return const SizedBox.shrink();
    }

    return Container(
      width: double.infinity,
      height: 50,
      decoration: const BoxDecoration(
        color: Color(0xFF061026),
        border: Border(
          top: BorderSide(
            color: Color(0x4D06B6D4),
            width: 1,
          ),
        ),
      ),
      child: _isLoaded && _bannerAd != null
          ? Center(
              child: SizedBox(
                width: _bannerAd!.size.width.toDouble(),
                height: _bannerAd!.size.height.toDouble(),
                child: AdWidget(ad: _bannerAd!),
              ),
            )
          : Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFBBF24),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text(
                            'TEST AD',
                            style: TextStyle(
                              color: Color(0xFF020617),
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              letterSpacing: 0.6,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Flexible(
                          child: Text(
                            'Google AdMob Test Banner',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: Color(0xFFCBD5E1),
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8),
                  Flexible(
                    child: FittedBox(
                      fit: BoxFit.scaleDown,
                      alignment: Alignment.centerRight,
                      child: Text(
                        '${AdMobConfig.bannerAdUnitId.substring(0, 22)}...',
                        style: const TextStyle(
                          fontFamily: 'monospace',
                          fontSize: 9,
                          color: Color(0xCC67E8F9),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
