import 'dart:math' as math;
import 'dart:typed_data';
import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/widgets.dart';

enum _WaveShape { sine, triangle, sawtooth }

class _ToneSegment {
  const _ToneSegment({
    required this.startFreq,
    required this.endFreq,
    required this.durationSec,
    required this.gain,
    this.delaySec = 0.0,
    this.shape = _WaveShape.sine,
  });

  final double startFreq;
  final double endFreq;
  final double durationSec;
  final double gain;
  final double delaySec;
  final _WaveShape shape;
}

/// Procedural PCM-WAV synthesizer using `audioplayers` [BytesSource] so no
/// external MP3/WAV asset files are needed.
class SoundService {
  SoundService._();

  static final SoundService instance = SoundService._();

  static const int _sampleRate = 22050;

  bool _isMuted = false;
  bool _initialized = false;
  bool _testNoOp = false;
  AudioPlayer? _player;
  final Map<String, Uint8List> _cachedWavs = <String, Uint8List>{};

  bool get isMuted => _isMuted;

  /// Enables or disables platform audio playback for unit/widget tests.
  @visibleForTesting
  void enableTestNoOp([bool enabled = true]) {
    _testNoOp = enabled;
    if (enabled) {
      _player = null;
    }
  }

  bool get _shouldSkipPlatformAudio {
    if (_testNoOp) return true;
    try {
      final bindingName = WidgetsBinding.instance.runtimeType.toString();
      if (bindingName.contains('Test')) return true;
    } catch (_) {
      return true;
    }
    return false;
  }

  /// Updates mute state for all sound effects.
  void setMuted(bool muted) {
    _isMuted = muted;
  }

  /// Pre-generates lightweight PCM WAV buffers without eagerly opening platform channels.
  Future<void> init() async {
    if (_initialized) return;
    _initialized = true;
    _ensureBuffersPrepared();
  }

  void _ensureBuffersPrepared() {
    if (_cachedWavs.isNotEmpty) return;

    // Soft click sound on cell / button tap (480 -> 700 Hz sine, 40ms)
    _cachedWavs['click'] = _synthesizeWav(const [
      _ToneSegment(
        startFreq: 480,
        endFreq: 700,
        durationSec: 0.04,
        gain: 0.22,
        shape: _WaveShape.sine,
      ),
    ]);

    // Crisp placement sound (540 -> 880 Hz triangle, 80ms)
    _cachedWavs['place'] = _synthesizeWav(const [
      _ToneSegment(
        startFreq: 540,
        endFreq: 880,
        durationSec: 0.08,
        gain: 0.28,
        shape: _WaveShape.triangle,
      ),
    ]);

    // Note / toggle tick (750 Hz sine, 50ms)
    _cachedWavs['note'] = _synthesizeWav(const [
      _ToneSegment(
        startFreq: 750,
        endFreq: 750,
        durationSec: 0.05,
        gain: 0.16,
        shape: _WaveShape.sine,
      ),
    ]);

    // Erase / pop-back sound (320 -> 180 Hz sine, 70ms)
    _cachedWavs['erase'] = _synthesizeWav(const [
      _ToneSegment(
        startFreq: 320,
        endFreq: 180,
        durationSec: 0.07,
        gain: 0.22,
        shape: _WaveShape.sine,
      ),
    ]);

    // Mistake warning buzz (160 -> 130 Hz sawtooth, 240ms)
    _cachedWavs['mistake'] = _synthesizeWav(const [
      _ToneSegment(
        startFreq: 160,
        endFreq: 145,
        durationSec: 0.10,
        gain: 0.30,
        shape: _WaveShape.sawtooth,
      ),
      _ToneSegment(
        startFreq: 130,
        endFreq: 115,
        durationSec: 0.14,
        delaySec: 0.10,
        gain: 0.28,
        shape: _WaveShape.sawtooth,
      ),
    ]);

    // Coin pickup chime (B5 -> E6)
    _cachedWavs['coin'] = _synthesizeWav(const [
      _ToneSegment(
        startFreq: 987.77,
        endFreq: 987.77,
        durationSec: 0.065,
        gain: 0.24,
        shape: _WaveShape.sine,
      ),
      _ToneSegment(
        startFreq: 1318.51,
        endFreq: 1318.51,
        durationSec: 0.11,
        delaySec: 0.055,
        gain: 0.26,
        shape: _WaveShape.sine,
      ),
    ]);

    // Gem pickup crystalline chime (C6 -> E6 -> G6)
    _cachedWavs['gem'] = _synthesizeWav(const [
      _ToneSegment(
        startFreq: 1046.50,
        endFreq: 1046.50,
        durationSec: 0.06,
        gain: 0.22,
        shape: _WaveShape.sine,
      ),
      _ToneSegment(
        startFreq: 1318.51,
        endFreq: 1318.51,
        durationSec: 0.06,
        delaySec: 0.05,
        gain: 0.22,
        shape: _WaveShape.sine,
      ),
      _ToneSegment(
        startFreq: 1567.98,
        endFreq: 1567.98,
        durationSec: 0.12,
        delaySec: 0.10,
        gain: 0.25,
        shape: _WaveShape.sine,
      ),
    ]);

    // Quick success chime (C5 -> G5)
    _cachedWavs['success'] = _synthesizeWav(const [
      _ToneSegment(
        startFreq: 523.25,
        endFreq: 523.25,
        durationSec: 0.08,
        gain: 0.26,
        shape: _WaveShape.triangle,
      ),
      _ToneSegment(
        startFreq: 783.99,
        endFreq: 783.99,
        durationSec: 0.14,
        delaySec: 0.075,
        gain: 0.28,
        shape: _WaveShape.triangle,
      ),
    ]);

    // Victory fanfare melody: C5, E5, G5, C6
    _cachedWavs['victory'] = _synthesizeWav(const [
      _ToneSegment(
        startFreq: 523.25,
        endFreq: 523.25,
        durationSec: 0.18,
        delaySec: 0.00,
        gain: 0.26,
        shape: _WaveShape.triangle,
      ),
      _ToneSegment(
        startFreq: 659.25,
        endFreq: 659.25,
        durationSec: 0.18,
        delaySec: 0.12,
        gain: 0.26,
        shape: _WaveShape.triangle,
      ),
      _ToneSegment(
        startFreq: 783.99,
        endFreq: 783.99,
        durationSec: 0.18,
        delaySec: 0.24,
        gain: 0.26,
        shape: _WaveShape.triangle,
      ),
      _ToneSegment(
        startFreq: 1046.50,
        endFreq: 1046.50,
        durationSec: 0.28,
        delaySec: 0.36,
        gain: 0.30,
        shape: _WaveShape.triangle,
      ),
    ]);
  }

  /// Soft UI click SFX.
  Future<void> playClick() => _playCached('click');

  /// Number tile placement SFX.
  Future<void> playPlace() => _playCached('place');

  /// Subtle note/toggle SFX.
  Future<void> playNote() => _playCached('note');

  /// Tile removal / undo SFX.
  Future<void> playErase() => _playCached('erase');

  /// Wrong answer / mistake buzz SFX.
  Future<void> playMistake() => _playCached('mistake');

  /// Coin reward chime SFX.
  Future<void> playCoin() => _playCached('coin');

  /// Gem reward chime SFX.
  Future<void> playGem() => _playCached('gem');

  /// Positive validation chime SFX.
  Future<void> playSuccess() => _playCached('success');

  /// Stage/level victory fanfare SFX.
  Future<void> playVictory() => _playCached('victory');

  Future<void> _playCached(String key) async {
    if (_isMuted || _shouldSkipPlatformAudio) return;
    _ensureBuffersPrepared();
    final bytes = _cachedWavs[key];
    if (bytes == null) return;

    try {
      _player ??= AudioPlayer()..setReleaseMode(ReleaseMode.stop);
      await _player!.stop();
      await _player!.play(BytesSource(bytes));
    } catch (_) {
      // Ignore audio platform failures (e.g. headless environments).
    }
  }

  /// Exposes synthesized WAV bytes for unit testing header & sample integrity.
  @visibleForTesting
  Uint8List? getWavBytesForTest(String key) {
    _ensureBuffersPrepared();
    return _cachedWavs[key];
  }

  /// Generates a 16-bit mono PCM WAV buffer in memory from tone segments.
  Uint8List _synthesizeWav(List<_ToneSegment> segments) {
    var totalDuration = 0.0;
    for (final seg in segments) {
      final end = seg.delaySec + seg.durationSec;
      if (end > totalDuration) totalDuration = end;
    }

    final totalSamples = math.max(1, (totalDuration * _sampleRate).ceil());
    final mixBuffer = Float64List(totalSamples);

    for (final seg in segments) {
      final startIdx = (seg.delaySec * _sampleRate).floor();
      final segSamples = math.max(1, (seg.durationSec * _sampleRate).ceil());
      var phase = 0.0;

      for (var i = 0; i < segSamples; i++) {
        final idx = startIdx + i;
        if (idx >= totalSamples) break;

        final progress = segSamples > 1 ? i / (segSamples - 1) : 1.0;
        final freq = seg.startFreq *
            math.pow(
              math.max(1.0, seg.endFreq) / math.max(1.0, seg.startFreq),
              progress,
            );

        phase += (2.0 * math.pi * freq) / _sampleRate;
        if (phase > 2.0 * math.pi) {
          phase -= 2.0 * math.pi * (phase ~/ (2.0 * math.pi));
        }

        // Smooth 5ms attack and exponential decay envelope to eliminate pops.
        final attackSamples = math.min(segSamples ~/ 4, (_sampleRate * 0.005).round());
        final attackEnv = attackSamples > 0 && i < attackSamples
            ? i / attackSamples
            : 1.0;
        final decayEnv = math.exp(-4.2 * progress);
        final sample = _sampleWaveform(seg.shape, phase) * seg.gain * attackEnv * decayEnv;
        mixBuffer[idx] += sample;
      }
    }

    const numChannels = 1;
    const bitsPerSample = 16;
    const byteRate = _sampleRate * numChannels * (bitsPerSample ~/ 8);
    const blockAlign = numChannels * (bitsPerSample ~/ 8);
    final dataByteLength = totalSamples * blockAlign;
    final wavBytes = ByteData(44 + dataByteLength);

    // RIFF header
    _writeAscii(wavBytes, 0, 'RIFF');
    wavBytes.setUint32(4, 36 + dataByteLength, Endian.little);
    _writeAscii(wavBytes, 8, 'WAVE');

    // fmt subchunk
    _writeAscii(wavBytes, 12, 'fmt ');
    wavBytes.setUint32(16, 16, Endian.little); // PCM chunk size
    wavBytes.setUint16(20, 1, Endian.little); // PCM audio format
    wavBytes.setUint16(22, numChannels, Endian.little);
    wavBytes.setUint32(24, _sampleRate, Endian.little);
    wavBytes.setUint32(28, byteRate, Endian.little);
    wavBytes.setUint16(32, blockAlign, Endian.little);
    wavBytes.setUint16(34, bitsPerSample, Endian.little);

    // data subchunk
    _writeAscii(wavBytes, 36, 'data');
    wavBytes.setUint32(40, dataByteLength, Endian.little);

    for (var i = 0; i < totalSamples; i++) {
      final clamped = mixBuffer[i].clamp(-1.0, 1.0);
      final pcm16 = (clamped * 32767.0).round().clamp(-32768, 32767);
      wavBytes.setInt16(44 + (i * 2), pcm16, Endian.little);
    }

    return wavBytes.buffer.asUint8List();
  }

  double _sampleWaveform(_WaveShape shape, double phase) {
    switch (shape) {
      case _WaveShape.sine:
        return math.sin(phase);
      case _WaveShape.triangle:
        return (2.0 / math.pi) * math.asin(math.sin(phase));
      case _WaveShape.sawtooth:
        return (phase / math.pi) - 1.0;
    }
  }

  void _writeAscii(ByteData data, int offset, String value) {
    for (var i = 0; i < value.length; i++) {
      data.setUint8(offset + i, value.codeUnitAt(i));
    }
  }

  /// Releases audio player resources.
  Future<void> dispose() async {
    try {
      await _player?.dispose();
    } catch (_) {
      // Ignore.
    }
    _player = null;
  }
}
