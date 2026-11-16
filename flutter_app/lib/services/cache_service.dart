import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

/// Result returned from a Stale-While-Revalidate (SWR) cache lookup.
class SwrCacheResult<T> {
  const SwrCacheResult({
    required this.data,
    required this.isFresh,
  });

  final T? data;
  final bool isFresh;

  bool get hasData => data != null;
}

/// Queued network write saved locally while offline so it can replay later.
class OfflineWriteItem {
  const OfflineWriteItem({
    required this.id,
    required this.target,
    required this.payload,
    required this.createdAtMs,
  });

  final String id;
  final String target;
  final Map<String, dynamic> payload;
  final int createdAtMs;

  Map<String, dynamic> toJson() => {
        'id': id,
        'target': target,
        'payload': payload,
        'createdAtMs': createdAtMs,
      };

  factory OfflineWriteItem.fromJson(Map<String, dynamic> json) {
    final rawPayload = json['payload'];
    return OfflineWriteItem(
      id: (json['id'] ?? '').toString(),
      target: (json['target'] ?? '').toString(),
      payload: rawPayload is Map
          ? Map<String, dynamic>.from(rawPayload)
          : <String, dynamic>{},
      createdAtMs: (json['createdAtMs'] as num?)?.toInt() ?? 0,
    );
  }
}

/// L1 in-memory + L2 SharedPreferences SWR TTL & offline-queue cache engine.
class CacheService {
  CacheService._();

  /// Creates an isolated instance for unit tests.
  CacheService.test();

  static final CacheService instance = CacheService._();

  static const String _swrPrefix = 'nm_swr_';
  static const String _queueKey = 'nm_offline_write_queue_v1';
  static const Duration defaultSwrTtl = Duration(minutes: 30);

  final Map<String, String> _l1Memory = <String, String>{};
  final Map<String, _SwrEnvelope> _l1Swr = <String, _SwrEnvelope>{};
  SharedPreferences? _prefs;

  /// Initializes the cache with an optional pre-fetched [SharedPreferences].
  Future<void> init([SharedPreferences? prefs]) async {
    try {
      _prefs = prefs ?? _prefs ?? await SharedPreferences.getInstance();
    } catch (_) {
      // Safe fallback to L1 in-memory cache when preferences are unavailable.
    }
  }

  /// Reads a string from the L1 memory map in O(1).
  String? getMemory(String key) => _l1Memory[key];

  /// Writes a string to the L1 memory map.
  void setMemory(String key, String value) {
    _l1Memory[key] = value;
  }

  /// Removes a key from the L1 memory map.
  void removeMemory(String key) {
    _l1Memory.remove(key);
  }

  /// Clears all entries from the L1 memory map.
  void clearMemory() {
    _l1Memory.clear();
  }

  /// Snapshot of all keys currently in the L1 memory map.
  Map<String, String> get memorySnapshot => Map<String, String>.unmodifiable(_l1Memory);

  /// Reads an entry from the SWR cache (L1 first, then SharedPreferences L2).
  Future<SwrCacheResult<T>> getSwr<T>(
    String cacheKey,
    T Function(dynamic raw) decoder,
  ) async {
    final nowMs = DateTime.now().millisecondsSinceEpoch;

    final memEntry = _l1Swr[cacheKey];
    if (memEntry != null) {
      try {
        return SwrCacheResult<T>(
          data: decoder(memEntry.data),
          isFresh: nowMs < memEntry.expiresAtMs,
        );
      } catch (_) {
        _l1Swr.remove(cacheKey);
      }
    }

    try {
      final prefs = _prefs ?? await SharedPreferences.getInstance();
      _prefs = prefs;
      final raw = prefs.getString('$_swrPrefix$cacheKey');
      if (raw != null && raw.isNotEmpty) {
        final decoded = jsonDecode(raw);
        if (decoded is Map<String, dynamic>) {
          final expiresAt = (decoded['expiresAt'] as num?)?.toInt() ?? 0;
          final updatedAt = (decoded['updatedAt'] as num?)?.toInt() ?? 0;
          final payload = decoded['data'];
          if (payload != null) {
            _l1Swr[cacheKey] = _SwrEnvelope(
              data: payload,
              updatedAtMs: updatedAt,
              expiresAtMs: expiresAt,
            );
            return SwrCacheResult<T>(
              data: decoder(payload),
              isFresh: nowMs < expiresAt,
            );
          }
        }
      }
    } catch (_) {
      // Ignore corrupt or missing cache entries.
    }

    return const SwrCacheResult(data: null, isFresh: false);
  }

  /// Writes a value to the SWR cache with a configurable [ttl] (30 min default).
  Future<void> setSwr<T>(
    String cacheKey,
    T data, {
    Object? Function(T value)? encoder,
    Duration ttl = defaultSwrTtl,
  }) async {
    final nowMs = DateTime.now().millisecondsSinceEpoch;
    final expiresAtMs = nowMs + ttl.inMilliseconds;
    final serializedData = encoder != null ? encoder(data) : data;

    _l1Swr[cacheKey] = _SwrEnvelope(
      data: serializedData,
      updatedAtMs: nowMs,
      expiresAtMs: expiresAtMs,
    );

    try {
      final prefs = _prefs ?? await SharedPreferences.getInstance();
      _prefs = prefs;
      final envelope = jsonEncode({
        'data': serializedData,
        'updatedAt': nowMs,
        'expiresAt': expiresAtMs,
      });
      await prefs.setString('$_swrPrefix$cacheKey', envelope);
    } catch (_) {
      // Ignore storage quota or serialization errors.
    }
  }

  /// Removes a single SWR cache entry.
  Future<void> invalidateSwr(String cacheKey) async {
    _l1Swr.remove(cacheKey);
    try {
      final prefs = _prefs ?? await SharedPreferences.getInstance();
      _prefs = prefs;
      await prefs.remove('$_swrPrefix$cacheKey');
    } catch (_) {
      // Ignore.
    }
  }

  /// Enqueues an offline cloud write, deduplicating by [OfflineWriteItem.id].
  Future<void> enqueueOfflineWrite(OfflineWriteItem item) async {
    final queue = await getOfflineQueue();
    final updated = queue.where((e) => e.id != item.id).toList()..add(item);
    await _saveOfflineQueue(updated);
  }

  /// Returns all queued offline writes.
  Future<List<OfflineWriteItem>> getOfflineQueue() async {
    try {
      final prefs = _prefs ?? await SharedPreferences.getInstance();
      _prefs = prefs;
      final raw = prefs.getString(_queueKey);
      if (raw == null || raw.isEmpty) return <OfflineWriteItem>[];
      final decoded = jsonDecode(raw);
      if (decoded is! List) return <OfflineWriteItem>[];
      return decoded
          .whereType<Map>()
          .map((e) => OfflineWriteItem.fromJson(Map<String, dynamic>.from(e)))
          .toList();
    } catch (_) {
      return <OfflineWriteItem>[];
    }
  }

  /// Replays queued offline writes using [sender]; keeps items that fail.
  Future<int> flushOfflineQueue(
    Future<bool> Function(OfflineWriteItem item) sender,
  ) async {
    final queue = await getOfflineQueue();
    if (queue.isEmpty) return 0;

    final remaining = <OfflineWriteItem>[];
    var flushedCount = 0;
    var stopRetrying = false;

    for (final item in queue) {
      if (stopRetrying) {
        remaining.add(item);
        continue;
      }
      try {
        final ok = await sender(item);
        if (ok) {
          flushedCount++;
        } else {
          remaining.add(item);
          stopRetrying = true;
        }
      } catch (_) {
        remaining.add(item);
        stopRetrying = true;
      }
    }

    await _saveOfflineQueue(remaining);
    return flushedCount;
  }

  /// Clears all queued offline writes.
  Future<void> clearOfflineQueue() async {
    await _saveOfflineQueue(const <OfflineWriteItem>[]);
  }

  Future<void> _saveOfflineQueue(List<OfflineWriteItem> items) async {
    try {
      final prefs = _prefs ?? await SharedPreferences.getInstance();
      _prefs = prefs;
      await prefs.setString(
        _queueKey,
        jsonEncode(items.map((e) => e.toJson()).toList()),
      );
    } catch (_) {
      // Ignore.
    }
  }
}

class _SwrEnvelope {
  const _SwrEnvelope({
    required this.data,
    required this.updatedAtMs,
    required this.expiresAtMs,
  });

  final Object? data;
  final int updatedAtMs;
  final int expiresAtMs;
}
