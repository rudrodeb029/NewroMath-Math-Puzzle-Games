import 'dart:async';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

import 'cache_service.dart';

/// Fast synchronous-read memory cache backed by [SharedPreferences] async flush.
class StorageService {
  StorageService._({CacheService? cacheService})
      : _cache = cacheService ?? CacheService.instance;

  /// Creates an isolated instance for unit tests.
  StorageService.test({CacheService? cacheService})
      : _cache = cacheService ?? CacheService.test();

  static final StorageService instance = StorageService._();

  final CacheService _cache;
  SharedPreferences? _prefs;
  bool _initialized = false;

  final Set<String> _pendingWrites = <String>{};
  final Set<String> _pendingRemovals = <String>{};
  Timer? _flushTimer;

  /// Optional hook invoked whenever a `newromath_*` key changes.
  void Function(String changedKey)? onKeyChanged;

  bool get isInitialized => _initialized;

  /// Hydrates the L1 in-memory cache from [SharedPreferences] for instant reads.
  Future<void> init([SharedPreferences? prefs]) async {
    try {
      _prefs = prefs ?? _prefs ?? await SharedPreferences.getInstance();
      await _cache.init(_prefs);
      for (final key in _prefs!.getKeys()) {
        final val = _prefs!.get(key);
        if (val != null) {
          _cache.setMemory(key, val.toString());
        }
      }
    } catch (_) {
      // Safe fallback to L1 memory-only mode when SharedPreferences is unavailable.
    }
    _initialized = true;
  }

  /// Reads a raw string synchronously from the L1 memory cache.
  String? getString(String key) {
    final cached = _cache.getMemory(key);
    if (cached != null) return cached;
    final fromPrefs = _prefs?.get(key)?.toString();
    if (fromPrefs != null) {
      _cache.setMemory(key, fromPrefs);
    }
    return fromPrefs;
  }

  /// Writes a string immediately to L1 memory and schedules async persistence.
  Future<void> setString(String key, String value) async {
    _cache.setMemory(key, value);
    _pendingRemovals.remove(key);
    _pendingWrites.add(key);
    _scheduleFlush();
    onKeyChanged?.call(key);
  }

  /// Reads an integer synchronously, returning [defaultValue] if missing/invalid.
  int getInt(String key, {int defaultValue = 0}) {
    final raw = getString(key);
    if (raw == null) return defaultValue;
    return int.tryParse(raw.trim()) ?? defaultValue;
  }

  /// Persists an integer value.
  Future<void> setInt(String key, int value) =>
      setString(key, value.toString());

  /// Reads a boolean synchronously, returning [defaultValue] if missing.
  bool getBool(String key, {bool defaultValue = false}) {
    final raw = getString(key);
    if (raw == null) return defaultValue;
    final normalized = raw.trim().toLowerCase();
    if (normalized == 'true' || normalized == '1') return true;
    if (normalized == 'false' || normalized == '0') return false;
    return defaultValue;
  }

  /// Persists a boolean value as `'true'` or `'false'`.
  Future<void> setBool(String key, bool value) =>
      setString(key, value ? 'true' : 'false');

  /// Reads a JSON-encoded object or list synchronously.
  dynamic getJson(String key) {
    final raw = getString(key);
    if (raw == null || raw.isEmpty) return null;
    try {
      return jsonDecode(raw);
    } catch (_) {
      return null;
    }
  }

  /// Encodes [value] as JSON and persists it.
  Future<void> setJson(String key, Object? value) =>
      setString(key, jsonEncode(value));

  /// Reads a JSON-encoded list of strings synchronously.
  List<String> getStringList(String key) {
    final decoded = getJson(key);
    if (decoded is List) {
      return decoded.map((e) => e.toString()).toList();
    }
    return <String>[];
  }

  /// Reads a JSON-encoded list of integers synchronously.
  List<int> getIntList(String key) {
    final decoded = getJson(key);
    if (decoded is List) {
      return decoded
          .map((e) => e is num ? e.toInt() : int.tryParse(e.toString()))
          .whereType<int>()
          .toList();
    }
    return <int>[];
  }

  /// Removes a key from both L1 memory and [SharedPreferences].
  Future<void> remove(String key) async {
    _cache.removeMemory(key);
    _pendingWrites.remove(key);
    _pendingRemovals.add(key);
    _scheduleFlush();
    onKeyChanged?.call(key);
  }

  /// Returns all keys in memory starting with [prefix].
  Set<String> keysWithPrefix(String prefix) {
    return _cache.memorySnapshot.keys
        .where((k) => k.startsWith(prefix))
        .toSet();
  }

  void _scheduleFlush() {
    _flushTimer?.cancel();
    _flushTimer = Timer(const Duration(milliseconds: 120), () {
      unawaited(flushNow());
    });
  }

  /// Immediately flushes all pending writes and removals to [SharedPreferences].
  Future<void> flushNow() async {
    _flushTimer?.cancel();
    _flushTimer = null;

    if (_pendingWrites.isEmpty && _pendingRemovals.isEmpty) return;

    final writes = List<String>.from(_pendingWrites);
    final removals = List<String>.from(_pendingRemovals);
    _pendingWrites.clear();
    _pendingRemovals.clear();

    try {
      final prefs = _prefs ?? await SharedPreferences.getInstance();
      _prefs = prefs;
      for (final key in writes) {
        final val = _cache.getMemory(key);
        if (val != null) {
          await prefs.setString(key, val);
        }
      }
      for (final key in removals) {
        await prefs.remove(key);
      }
    } catch (_) {
      // Safe fallback when SharedPreferences isn't available (e.g. unit tests).
    }
  }

  /// Cancels any pending flush timer.
  Future<void> dispose() async {
    await flushNow();
    _flushTimer?.cancel();
  }
}
