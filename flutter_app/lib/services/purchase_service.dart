import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:in_app_purchase/in_app_purchase.dart';

import '../data/levels_catalog.dart';
import '../models/game_models.dart';
import 'admob_service.dart';
import 'firebase_sync_service.dart';
import 'security_service.dart';
import 'storage_service.dart';

/// Outcome of an In-App Purchase request.
@immutable
class PurchaseOutcome {
  const PurchaseOutcome({
    required this.success,
    required this.sku,
    this.transactionId,
    this.error,
    this.isFallback = false,
  });

  final bool success;
  final String sku;
  final String? transactionId;
  final String? error;
  final bool isFallback;
}

/// Outcome of restoring previous Google Play / App Store purchases.
@immutable
class RestoreOutcome {
  const RestoreOutcome({
    required this.success,
    required this.restoredCount,
    required this.message,
  });

  final bool success;
  final int restoredCount;
  final String message;
}

/// Google Play Store / App Store In-App Purchase service powered by
/// `in_app_purchase` with live store SKU tracking and instant fallback when a
/// SKU is not yet published or running on non-store platforms.
class PurchaseService extends ChangeNotifier {
  PurchaseService._();

  static final PurchaseService instance = PurchaseService._();

  static const String proSkuId = 'newromath_pro_noads';

  bool _isSupported = false;
  bool _isInitialized = false;
  bool _isLoading = false;
  bool _isProUser = false;
  String? _activePurchaseSku;
  String? _errorMessage;

  final Map<String, String> _prices = <String, String>{
    for (final p in iapCatalog) p.id: p.defaultPrice,
  };
  final Set<String> _liveStoreSkus = <String>{};
  final Map<String, ProductDetails> _storeProducts = <String, ProductDetails>{};

  StreamSubscription<List<PurchaseDetails>>? _purchaseSub;
  Completer<PurchaseOutcome>? _pendingPurchaseCompleter;
  String? _pendingPurchaseSku;
  Completer<bool>? _pendingRestoreCompleter;

  bool get isSupported => _isSupported;
  bool get isInitialized => _isInitialized;
  bool get isLoading => _isLoading;
  bool get isProUser => _isProUser;
  String? get activePurchaseSku => _activePurchaseSku;
  String? get errorMessage => _errorMessage;
  Map<String, String> get prices => Map<String, String>.unmodifiable(_prices);
  Set<String> get liveStoreSkus => Set<String>.unmodifiable(_liveStoreSkus);
  List<IapProduct> get catalog => iapCatalog;

  bool get _isMobileStorePlatform =>
      !kIsWeb &&
      (defaultTargetPlatform == TargetPlatform.android ||
          defaultTargetPlatform == TargetPlatform.iOS);

  /// Initializes billing, loads live Play Store prices if available, and
  /// restores saved PRO VIP status.
  Future<void> initialize({StorageService? storage}) async {
    final store = storage ?? StorageService.instance;
    if (store.getBool(SecurityService.keyIsPro, defaultValue: false)) {
      _isProUser = true;
      AdMobService.instance.setAdsDisabled(true);
    }

    if (_isInitialized) {
      notifyListeners();
      return;
    }

    _isLoading = true;
    notifyListeners();

    if (_isMobileStorePlatform) {
      try {
        final iap = InAppPurchase.instance;
        _isSupported = await iap.isAvailable();

        if (_isSupported) {
          _purchaseSub ??= iap.purchaseStream.listen(
            _handlePurchaseUpdates,
            onError: (Object err) {
              _errorMessage = err.toString();
              if (_pendingPurchaseCompleter != null &&
                  !_pendingPurchaseCompleter!.isCompleted) {
                _pendingPurchaseCompleter!.complete(
                  PurchaseOutcome(
                    success: false,
                    sku: _pendingPurchaseSku ?? '',
                    error: _errorMessage,
                  ),
                );
              }
            },
          );

          final ids = iapCatalog.map((p) => p.id).toSet();
          final response = await iap.queryProductDetails(ids);
          for (final details in response.productDetails) {
            _liveStoreSkus.add(details.id);
            _storeProducts[details.id] = details;
            if (details.price.isNotEmpty) {
              _prices[details.id] = details.price;
            }
          }
        }
      } catch (_) {
        _isSupported = false;
      }
    } else {
      _isSupported = true;
    }

    _isInitialized = true;
    _isLoading = false;
    notifyListeners();
  }

  /// Updates and persists the player's PRO VIP ad-free status.
  Future<void> setProUser(bool isPro, {StorageService? storage}) async {
    _isProUser = isPro;
    final store = storage ?? StorageService.instance;
    await store.setBool(SecurityService.keyIsPro, isPro);
    AdMobService.instance.setAdsDisabled(isPro);
    notifyListeners();
  }

  /// Returns the localized store price for [sku] or the catalog fallback.
  String getPrice(String sku) {
    return _prices[sku] ??
        iapCatalog
            .where((p) => p.id == sku)
            .map((p) => p.defaultPrice)
            .firstOrNull ??
        r'$0.99';
  }

  /// Purchases [sku] via Play Billing when live, or instant dev/offline fallback
  /// when the Play Store SKU is not live yet or running in preview/test mode.
  Future<PurchaseOutcome> purchaseProduct(
    String sku, {
    StorageService? storage,
  }) async {
    final product = iapCatalog.where((p) => p.id == sku).firstOrNull;
    if (product == null) {
      return PurchaseOutcome(
        success: false,
        sku: sku,
        error: 'Product not found in catalog',
      );
    }

    _isLoading = true;
    _activePurchaseSku = sku;
    _errorMessage = null;
    notifyListeners();

    final storeDetails = _storeProducts[sku];
    if (_isMobileStorePlatform &&
        _isSupported &&
        _liveStoreSkus.contains(sku) &&
        storeDetails != null) {
      try {
        final completer = Completer<PurchaseOutcome>();
        _pendingPurchaseCompleter = completer;
        _pendingPurchaseSku = sku;

        final param = PurchaseParam(productDetails: storeDetails);
        final started = product.isConsumable
            ? await InAppPurchase.instance
                .buyConsumable(purchaseParam: param, autoConsume: true)
            : await InAppPurchase.instance
                .buyNonConsumable(purchaseParam: param);

        if (!started) {
          _pendingPurchaseCompleter = null;
          _pendingPurchaseSku = null;
          _isLoading = false;
          _activePurchaseSku = null;
          _errorMessage = 'Billing flow could not be launched.';
          notifyListeners();
          return PurchaseOutcome(
            success: false,
            sku: sku,
            error: _errorMessage,
          );
        }

        final outcome = await completer.future.timeout(
          const Duration(minutes: 2),
          onTimeout: () => PurchaseOutcome(
            success: false,
            sku: sku,
            error: 'Purchase timed out.',
          ),
        );

        _pendingPurchaseCompleter = null;
        _pendingPurchaseSku = null;
        _isLoading = false;
        _activePurchaseSku = null;
        if (outcome.success && sku == proSkuId) {
          await setProUser(true, storage: storage);
        }
        notifyListeners();
        return outcome;
      } catch (err) {
        _pendingPurchaseCompleter = null;
        _pendingPurchaseSku = null;
        _isLoading = false;
        _activePurchaseSku = null;
        _errorMessage = err.toString();
        notifyListeners();
        return PurchaseOutcome(
          success: false,
          sku: sku,
          error: _errorMessage,
        );
      }
    }

    // Instant fallback when Play Store SKU is not live yet or in preview/test mode.
    await Future<void>.delayed(const Duration(milliseconds: 250));
    if (sku == proSkuId) {
      await setProUser(true, storage: storage);
    }
    _isLoading = false;
    _activePurchaseSku = null;
    notifyListeners();

    unawaited(
      FirebaseSyncService.instance.recordPurchase(
        productId: sku,
        title: product.name,
        price: getPrice(sku),
        rewardCoins: product.type == 'coins'
            ? product.amount
            : (sku == proSkuId ? 2000 : 0),
        rewardGems: product.type == 'gems'
            ? product.amount
            : (sku == proSkuId ? 50 : 0),
        grantPro: sku == proSkuId,
      ),
    );

    return PurchaseOutcome(
      success: true,
      sku: sku,
      transactionId: 'fallback_tx_${DateTime.now().millisecondsSinceEpoch}',
      isFallback: true,
    );
  }

  /// Queries Google Play / App Store for past non-consumable purchases.
  Future<RestoreOutcome> restorePurchases({StorageService? storage}) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    if (_isMobileStorePlatform && _isSupported) {
      try {
        final restoreCompleter = Completer<bool>();
        _pendingRestoreCompleter = restoreCompleter;
        await InAppPurchase.instance.restorePurchases();

        final restoredPro = await restoreCompleter.future.timeout(
          const Duration(seconds: 4),
          onTimeout: () => _isProUser,
        );
        _pendingRestoreCompleter = null;
        _isLoading = false;
        notifyListeners();

        if (restoredPro) {
          await setProUser(true, storage: storage);
          return const RestoreOutcome(
            success: true,
            restoredCount: 1,
            message: '🎉 PRO VIP Lifetime Pass restored successfully!',
          );
        }
        return const RestoreOutcome(
          success: true,
          restoredCount: 0,
          message: 'No previous permanent purchases found for this account.',
        );
      } catch (err) {
        _pendingRestoreCompleter = null;
        _isLoading = false;
        _errorMessage = err.toString();
        notifyListeners();
        return RestoreOutcome(
          success: false,
          restoredCount: 0,
          message: 'Restore failed: $_errorMessage',
        );
      }
    }

    _isLoading = false;
    notifyListeners();
    return RestoreOutcome(
      success: true,
      restoredCount: _isProUser ? 1 : 0,
      message: _isProUser
          ? '🎉 PRO VIP Lifetime Pass is active.'
          : '🎉 (Preview Mode) Restore check completed.',
    );
  }

  Future<void> _handlePurchaseUpdates(List<PurchaseDetails> updates) async {
    for (final details in updates) {
      final sku = details.productID;
      final product = iapCatalog.where((p) => p.id == sku).firstOrNull;

      if (details.status == PurchaseStatus.purchased ||
          details.status == PurchaseStatus.restored) {
        if (sku == proSkuId) {
          await setProUser(true);
          if (_pendingRestoreCompleter != null &&
              !_pendingRestoreCompleter!.isCompleted) {
            _pendingRestoreCompleter!.complete(true);
          }
        }

        if (details.pendingCompletePurchase) {
          try {
            await InAppPurchase.instance.completePurchase(details);
          } catch (_) {
            // Ignore completion error if already acknowledged.
          }
        }

        if (details.status == PurchaseStatus.purchased && product != null) {
          unawaited(
            FirebaseSyncService.instance.recordPurchase(
              productId: sku,
              title: product.name,
              price: getPrice(sku),
              rewardCoins: product.type == 'coins'
                  ? product.amount
                  : (sku == proSkuId ? 2000 : 0),
              rewardGems: product.type == 'gems'
                  ? product.amount
                  : (sku == proSkuId ? 50 : 0),
              grantPro: sku == proSkuId,
            ),
          );
        }

        if (_pendingPurchaseCompleter != null &&
            !_pendingPurchaseCompleter!.isCompleted &&
            _pendingPurchaseSku == sku) {
          _pendingPurchaseCompleter!.complete(
            PurchaseOutcome(
              success: true,
              sku: sku,
              transactionId: details.purchaseID ??
                  'gp_${DateTime.now().millisecondsSinceEpoch}',
            ),
          );
        }
      } else if (details.status == PurchaseStatus.error ||
          details.status == PurchaseStatus.canceled) {
        final errText = details.error?.message ??
            (details.status == PurchaseStatus.canceled
                ? 'Purchase was cancelled.'
                : 'Purchase failed.');
        if (details.pendingCompletePurchase) {
          try {
            await InAppPurchase.instance.completePurchase(details);
          } catch (_) {
            // Ignore.
          }
        }
        if (_pendingPurchaseCompleter != null &&
            !_pendingPurchaseCompleter!.isCompleted &&
            _pendingPurchaseSku == sku) {
          _pendingPurchaseCompleter!.complete(
            PurchaseOutcome(
              success: false,
              sku: sku,
              error: errText,
            ),
          );
        }
      }
    }
  }

  @override
  void dispose() {
    unawaited(_purchaseSub?.cancel());
    super.dispose();
  }
}
