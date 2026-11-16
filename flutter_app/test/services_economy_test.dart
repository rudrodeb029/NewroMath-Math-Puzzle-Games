import 'package:flutter_test/flutter_test.dart';
import 'package:newromath/data/levels_catalog.dart';
import 'package:newromath/services/security_service.dart';
import 'package:newromath/services/storage_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  group('Catalog & Parity Constants', () {
    test('starter economy defaults match 500 coins / 50 gems / level 1', () {
      expect(GameDefaults.defaultCoins, 500);
      expect(GameDefaults.defaultGems, 50);
      expect(GameDefaults.defaultUnlockedLevel, 1);
      expect(GameDefaults.defaultPlayerLevel, 1);
      expect(GameDefaults.defaultPlayerXp, 0);
    });

    test('has exact 25 campaign levels and 25 awards', () {
      expect(levelsCatalog.length, 25);
      expect(levelAwards.length, 25);
      expect(levelsCatalog.first.num, 1);
      expect(levelsCatalog.first.title, 'Warm-Up Ignition');
      expect(levelsCatalog.last.num, 25);
      expect(levelsCatalog.last.title, 'Apex Boss Stage');
      expect(getStageCount(1), 10);
      expect(getStageCount(25), 20);
      expect(getLevelEntryCost(1).coins, 100);
      expect(getLevelEntryCost(1).gems, 10);
      expect(getLevelEntryCost(25).coins, 1200);
      expect(getLevelEntryCost(25).gems, 75);
    });

    test('IAP catalog matches exact SKUs and pricing', () {
      final byId = {for (final p in iapCatalog) p.id: p};
      expect(byId['newromath_pro_noads']?.defaultPrice, r'$1.99');
      expect(byId['newromath_pro_noads']?.isConsumable, isFalse);

      expect(byId['coins_1500']?.defaultPrice, r'$0.49');
      expect(byId['coins_5000']?.defaultPrice, r'$0.99');
      expect(byId['coins_15000']?.defaultPrice, r'$1.99');
      expect(byId['coins_45000']?.defaultPrice, r'$3.99');

      expect(byId['gems_50']?.defaultPrice, r'$0.49');
      expect(byId['gems_200']?.defaultPrice, r'$0.99');
      expect(byId['gems_600']?.defaultPrice, r'$2.49');
      expect(byId['gems_2000']?.defaultPrice, r'$4.99');
    });

    test('AdMobConfig uses official Google Demo IDs and 45s cooldown', () {
      expect(AdMobConfig.appId, 'ca-app-pub-3940256099942544~3347511713');
      expect(
        AdMobConfig.bannerAdUnitId,
        'ca-app-pub-3940256099942544/6300978111',
      );
      expect(
        AdMobConfig.interstitialAdUnitId,
        'ca-app-pub-3940256099942544/1033173712',
      );
      expect(
        AdMobConfig.rewardedAdUnitId,
        'ca-app-pub-3940256099942544/5224354917',
      );
      expect(AdMobConfig.interstitialCooldownMs, 45000);
    });
  });

  group('SecurityService', () {
    test('enforces clamping limits and transaction delta caps', () {
      final sec = SecurityService.instance;
      expect(sec.clampCoins(-100), 0);
      expect(sec.clampCoins(99999999), SecurityService.maxCoins);
      expect(sec.clampGems(-5), 0);
      expect(sec.clampGems(500000), SecurityService.maxGems);
      expect(sec.clampXp(-1), 0);
      expect(sec.clampXp(99999999), SecurityService.maxXp);
      expect(sec.clampUnlockedLevel(0), 1);
      expect(sec.clampUnlockedLevel(99), SecurityService.maxUnlockedLevel);
      expect(sec.clampPlayerLevel(0), 1);
      expect(sec.clampPlayerLevel(99), SecurityService.maxPlayerLevel);

      expect(sec.clampCoinDelta(500000), SecurityService.maxSingleCoinDelta);
      expect(sec.clampCoinDelta(-500000), -SecurityService.maxSingleCoinDelta);
      expect(sec.clampGemDelta(50000), SecurityService.maxSingleGemDelta);
      expect(sec.clampXpDelta(100000), SecurityService.maxSingleXpDelta);
      expect(sec.clampXpDelta(-50), 0);
    });

    test('computes deterministic HMAC-SHA256 seal and detects tampering', () {
      final sec = SecurityService.instance;
      const state = EconomyState(
        coins: 500,
        gems: 50,
        xp: 120,
        unlockedLevel: 3,
        playerLevel: 3,
        isPro: false,
      );
      const tampered = EconomyState(
        coins: 500000,
        gems: 50,
        xp: 120,
        unlockedLevel: 3,
        playerLevel: 3,
        isPro: false,
      );

      final seal1 = sec.computeEconomySeal(state);
      final seal2 = sec.computeEconomySeal(state);
      expect(seal1, seal2);
      expect(seal1, startsWith('nms2_'));
      expect(sec.verifyEconomySeal(state, seal1), isTrue);
      expect(sec.verifyEconomySeal(tampered, seal1), isFalse);
      expect(sec.verifyEconomySeal(state, null), isFalse);
    });

    test('verifyAndSanitizeStorage clamps tampered values on boot', () async {
      SharedPreferences.setMockInitialValues({
        SecurityService.keyCoins: 99999999,
        SecurityService.keyGems: -25,
        SecurityService.keyUnlockedLevel: 99,
        SecurityService.keyPlayerLevel: 99,
      });
      final prefs = await SharedPreferences.getInstance();
      final storage = StorageService.instance;
      await storage.init(prefs);

      final sanitized =
          await SecurityService.instance.verifyAndSanitizeStorage(storage);
      expect(sanitized.coins, SecurityService.maxCoins);
      expect(sanitized.gems, 0);
      expect(sanitized.unlockedLevel, SecurityService.maxUnlockedLevel);
      expect(sanitized.playerLevel, SecurityService.maxPlayerLevel);
      expect(
        storage.getString(SecurityService.sealStorageKey),
        SecurityService.instance.computeEconomySeal(sanitized),
      );
    });
  });
}
