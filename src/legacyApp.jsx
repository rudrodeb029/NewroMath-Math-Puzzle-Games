

















































































































































































































































import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import confetti from 'canvas-confetti';
import './index.css';
import { adMobService } from './services/adMobService';
import { purchaseService, IAP_CATALOG } from './services/purchaseService';
import { AdMobBanner, AdMobInterstitialModal, AdMobRewardedModal } from './components/AdMobComponents';
import {
  Volume2,
  Vibrate,
  Timer,
  Lightbulb,
  Zap,
  Type,
  Divide,
  BookOpen,
  Crown,
  RotateCcw,
  Trash2,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Pencil,
  BarChart3,
  CheckCircle2,
  Gamepad2,
  Target,
  Trophy,
  Flame,
  Sparkles,
  Check,
  Calendar,
  Lock,
  User,
  X,
  Globe,
  Phone,
  Mail
} from 'lucide-react';

const PLAYER_COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
];


    // ==========================================
    // SOUND SYNTHESIZER
    // ==========================================
    // ==========================================
    // STUDIO-GRADE CYBER SCI-FI SOUND SYNTHESIZER
    // Multi-layered FM & Sub-Harmonic Audio Synthesis
    // ==========================================
    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.masterNode = null;
        this.compressor = null;
        this.muted = false;
      }

      init() {
        if (!this.ctx && typeof window !== 'undefined') {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) {
            this.ctx = new AudioCtx();
            // Studio limiter & dynamics compressor for distortion-free, warm sound on mobile speakers
            this.compressor = this.ctx.createDynamicsCompressor();
            this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
            this.compressor.knee.setValueAtTime(24, this.ctx.currentTime);
            this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
            this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
            this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

            this.masterNode = this.ctx.createGain();
            this.masterNode.gain.setValueAtTime(0.9, this.ctx.currentTime);

            this.compressor.connect(this.masterNode);
            this.masterNode.connect(this.ctx.destination);
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }

      getOut() {
        this.init();
        return this.compressor || (this.ctx && this.ctx.destination);
      }

      // Modern Tactile Glass Click (Haptic UI Micro-Switch)
      click() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          const out = this.getOut();

          // 1. Crisp Glass Transient
          const osc1 = this.ctx.createOscillator();
          const gain1 = this.ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(1400, t);
          osc1.frequency.exponentialRampToValueAtTime(520, t + 0.035);
          gain1.gain.setValueAtTime(0.14, t);
          gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
          osc1.connect(gain1);
          gain1.connect(out);
          osc1.start(t);
          osc1.stop(t + 0.035);

          // 2. Warm Tactile Sub-Body
          const osc2 = this.ctx.createOscillator();
          const gain2 = this.ctx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(420, t);
          osc2.frequency.exponentialRampToValueAtTime(220, t + 0.04);
          gain2.gain.setValueAtTime(0.09, t);
          gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          osc2.connect(gain2);
          gain2.connect(out);
          osc2.start(t);
          osc2.stop(t + 0.04);
        } catch (e) {}
      }

      tap() {
        this.click();
      }

      // Resonant Magnetic Snap (Placing a puzzle tile into a slot)
      snap() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          const out = this.getOut();

          // High Acoustic Slap
          const oscHigh = this.ctx.createOscillator();
          const gainHigh = this.ctx.createGain();
          const filterHigh = this.ctx.createBiquadFilter();
          filterHigh.type = 'bandpass';
          filterHigh.frequency.setValueAtTime(1800, t);
          filterHigh.Q.setValueAtTime(4, t);

          oscHigh.type = 'triangle';
          oscHigh.frequency.setValueAtTime(980, t);
          oscHigh.frequency.exponentialRampToValueAtTime(320, t + 0.06);

          gainHigh.gain.setValueAtTime(0.2, t);
          gainHigh.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

          oscHigh.connect(filterHigh);
          filterHigh.connect(gainHigh);
          gainHigh.connect(out);
          oscHigh.start(t);
          oscHigh.stop(t + 0.06);

          // Deep Magnetic Body Clack
          const oscLow = this.ctx.createOscillator();
          const gainLow = this.ctx.createGain();
          oscLow.type = 'sine';
          oscLow.frequency.setValueAtTime(260, t);
          oscLow.frequency.exponentialRampToValueAtTime(95, t + 0.08);

          gainLow.gain.setValueAtTime(0.18, t);
          gainLow.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

          oscLow.connect(gainLow);
          gainLow.connect(out);
          oscLow.start(t);
          oscLow.stop(t + 0.08);
        } catch (e) {}
      }

      // Bubble Drop Pop (Returning tile to tray / undo)
      pop() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          const out = this.getOut();

          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(340, t);
          osc.frequency.exponentialRampToValueAtTime(780, t + 0.055);

          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

          osc.connect(gain);
          gain.connect(out);
          osc.start(t);
          osc.stop(t + 0.055);
        } catch (e) {}
      }

      // ========================================================
      // 1. CELESTIAL CRYSTAL SUCCESS CHIME (Positive Reward & Stage Win)
      // High-end Lydian Chime Cascade + Sustaining Harmonic Shimmer Chord
      // ========================================================
      success() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          const out = this.getOut();

          // A. Ascending Crystal Lydian Cascade (Sparkling Glass Bell Arpeggio)
          // Frequencies: G5 (783.99), B5 (987.77), D6 (1174.66), F#6 (1479.98), G6 (1567.98), B6 (1975.53)
          const cascadeNotes = [783.99, 987.77, 1174.66, 1479.98, 1567.98, 1975.53];
          cascadeNotes.forEach((freq, idx) => {
            const noteStart = t + idx * 0.038;

            // Dual harmonic oscillators: Pure fundamental + chorused overtone
            const oscFundamental = this.ctx.createOscillator();
            const oscHarmonic = this.ctx.createOscillator();
            const noteGain = this.ctx.createGain();

            oscFundamental.type = 'sine';
            oscFundamental.frequency.setValueAtTime(freq, noteStart);

            oscHarmonic.type = 'triangle';
            oscHarmonic.frequency.setValueAtTime(freq, noteStart);
            oscHarmonic.detune.setValueAtTime((idx % 2 === 0 ? 5 : -5), noteStart);

            const duration = idx === cascadeNotes.length - 1 ? 0.38 : 0.22;
            const peakGain = idx === cascadeNotes.length - 1 ? 0.16 : 0.12;

            noteGain.gain.setValueAtTime(0.001, noteStart);
            noteGain.gain.exponentialRampToValueAtTime(peakGain, noteStart + 0.004);
            noteGain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);

            oscFundamental.connect(noteGain);
            oscHarmonic.connect(noteGain);
            noteGain.connect(out);

            oscFundamental.start(noteStart);
            oscFundamental.stop(noteStart + duration);
            oscHarmonic.start(noteStart);
            oscHarmonic.stop(noteStart + duration);
          });

          // B. Sustaining Celestial Shimmer Chord (Blooms at arpeggio peak)
          const chordTime = t + 0.16;
          const chordFrequencies = [783.99, 1174.66, 1567.98, 1975.53];
          chordFrequencies.forEach((freq, idx) => {
            const chordOsc = this.ctx.createOscillator();
            const chordGain = this.ctx.createGain();
            const chordFilter = this.ctx.createBiquadFilter();

            chordFilter.type = 'bandpass';
            chordFilter.frequency.setValueAtTime(freq, chordTime);
            chordFilter.Q.setValueAtTime(6.0, chordTime);

            chordOsc.type = 'triangle';
            chordOsc.frequency.setValueAtTime(freq, chordTime);
            chordOsc.detune.setValueAtTime((idx % 2 === 0 ? 4 : -4), chordTime);

            chordGain.gain.setValueAtTime(0.001, chordTime);
            chordGain.gain.exponentialRampToValueAtTime(0.07, chordTime + 0.02);
            chordGain.gain.exponentialRampToValueAtTime(0.0005, chordTime + 0.48);

            chordOsc.connect(chordFilter);
            chordFilter.connect(chordGain);
            chordGain.connect(out);

            chordOsc.start(chordTime);
            chordOsc.stop(chordTime + 0.48);
          });

          // C. Stardust Sparkle (Ultra-high crystalline harmonic ping)
          const sparkleTime = t + 0.19;
          const sparkleOsc = this.ctx.createOscillator();
          const sparkleGain = this.ctx.createGain();
          sparkleOsc.type = 'sine';
          sparkleOsc.frequency.setValueAtTime(3135.96, sparkleTime); // High G7
          sparkleGain.gain.setValueAtTime(0.001, sparkleTime);
          sparkleGain.gain.exponentialRampToValueAtTime(0.045, sparkleTime + 0.005);
          sparkleGain.gain.exponentialRampToValueAtTime(0.0001, sparkleTime + 0.28);
          sparkleOsc.connect(sparkleGain);
          sparkleGain.connect(out);
          sparkleOsc.start(sparkleTime);
          sparkleOsc.stop(sparkleTime + 0.28);
        } catch (e) {}
      }

      correct() {
        this.success();
      }

      // ========================================================
      // 2. FUTURISTIC TECH ERROR CHIME (Calculation Error & Invalid Action)
      // Dissonant Rejection Chime + Haptic Sub Impact + Sci-Fi Recalculate Warp
      // ========================================================
      error() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          const out = this.getOut();

          // A. Dual Rejection Chime (Dissonant descending glass/bell pair)
          // Strike 1 (t): D5 (587.33Hz) + Eb5 (622.25Hz) - subtle minor second tension
          // Strike 2 (t + 0.09s): A4 (440Hz) + Ab4 (415.30Hz) - downward resolution
          const rejectSteps = [
            { offset: 0, f1: 587.33, f2: 622.25, dur: 0.11, vol: 0.16 },
            { offset: 0.09, f1: 440.00, f2: 415.30, dur: 0.16, vol: 0.14 }
          ];

          rejectSteps.forEach((step) => {
            const hit = t + step.offset;

            // Carrier 1 (Glass bell transient)
            const osc1 = this.ctx.createOscillator();
            const gain1 = this.ctx.createGain();
            const filter1 = this.ctx.createBiquadFilter();

            filter1.type = 'bandpass';
            filter1.frequency.setValueAtTime(step.f1 * 1.5, hit);
            filter1.Q.setValueAtTime(4.0, hit);

            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(step.f1, hit);
            osc1.frequency.exponentialRampToValueAtTime(step.f1 * 0.94, hit + step.dur);

            gain1.gain.setValueAtTime(0.001, hit);
            gain1.gain.exponentialRampToValueAtTime(step.vol, hit + 0.004);
            gain1.gain.exponentialRampToValueAtTime(0.001, hit + step.dur);

            osc1.connect(filter1);
            filter1.connect(gain1);
            gain1.connect(out);
            osc1.start(hit);
            osc1.stop(hit + step.dur);

            // Carrier 2 (Harmonic Dissonance layer)
            const osc2 = this.ctx.createOscillator();
            const gain2 = this.ctx.createGain();
            osc2.type = 'triangle';
            osc2.frequency.setValueAtTime(step.f2, hit);
            osc2.frequency.exponentialRampToValueAtTime(step.f2 * 0.94, hit + step.dur);

            gain2.gain.setValueAtTime(0.001, hit);
            gain2.gain.exponentialRampToValueAtTime(step.vol * 0.55, hit + 0.004);
            gain2.gain.exponentialRampToValueAtTime(0.001, hit + step.dur);

            osc2.connect(gain2);
            gain2.connect(out);
            osc2.start(hit);
            osc2.stop(hit + step.dur);
          });

          // B. Haptic Sub-Impact (Low-frequency damped pulse for physical presence)
          const subHit = t + 0.01;
          const subOsc = this.ctx.createOscillator();
          const subGain = this.ctx.createGain();
          const subFilter = this.ctx.createBiquadFilter();

          subFilter.type = 'lowpass';
          subFilter.frequency.setValueAtTime(240, subHit);

          subOsc.type = 'sine';
          subOsc.frequency.setValueAtTime(145, subHit);
          subOsc.frequency.exponentialRampToValueAtTime(58, subHit + 0.14);

          subGain.gain.setValueAtTime(0.001, subHit);
          subGain.gain.exponentialRampToValueAtTime(0.18, subHit + 0.005);
          subGain.gain.exponentialRampToValueAtTime(0.001, subHit + 0.14);

          subOsc.connect(subFilter);
          subFilter.connect(subGain);
          subGain.connect(out);
          subOsc.start(subHit);
          subOsc.stop(subHit + 0.14);

          // C. Sci-Fi Computation Mismatch Warp (Soft downward bandpass sweep)
          const warpOsc = this.ctx.createOscillator();
          const warpGain = this.ctx.createGain();
          const warpFilter = this.ctx.createBiquadFilter();

          warpFilter.type = 'bandpass';
          warpFilter.frequency.setValueAtTime(680, t);
          warpFilter.frequency.exponentialRampToValueAtTime(210, t + 0.18);
          warpFilter.Q.setValueAtTime(3.0, t);

          warpOsc.type = 'triangle';
          warpOsc.frequency.setValueAtTime(320, t);
          warpOsc.frequency.exponentialRampToValueAtTime(140, t + 0.18);

          warpGain.gain.setValueAtTime(0.001, t);
          warpGain.gain.exponentialRampToValueAtTime(0.09, t + 0.008);
          warpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

          warpOsc.connect(warpFilter);
          warpFilter.connect(warpGain);
          warpGain.connect(out);
          warpOsc.start(t);
          warpOsc.stop(t + 0.18);
        } catch (e) {}
      }

      wrong() {
        this.error();
      }

      // Cyber Aerodynamic Sweep (Tile flying / modal transitions)
      whoosh() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          const out = this.getOut();

          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();

          filter.type = 'bandpass';
          filter.Q.setValueAtTime(2.5, t);
          filter.frequency.setValueAtTime(450, t);
          filter.frequency.exponentialRampToValueAtTime(1900, t + 0.09);
          filter.frequency.exponentialRampToValueAtTime(420, t + 0.22);

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(260, t);
          osc.frequency.exponentialRampToValueAtTime(740, t + 0.09);
          osc.frequency.exponentialRampToValueAtTime(310, t + 0.22);

          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(out);
          osc.start(t);
          osc.stop(t + 0.22);
        } catch (e) {}
      }

      // Epic Triumphant Victory Fanfare (Level Completed / Daily Solved!)
      fanfare() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          const out = this.getOut();

          // Rapid ascending victory arpeggio: C5 -> E5 -> G5 -> C6 -> E6 -> G6
          const arpeggio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
          arpeggio.forEach((freq, i) => {
            const noteStart = t + i * 0.075;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = i >= 4 ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, noteStart);

            const duration = i === arpeggio.length - 1 ? 0.65 : 0.26;
            gain.gain.setValueAtTime(0.14, noteStart);
            gain.gain.exponentialRampToValueAtTime(0.001, noteStart + duration);

            osc.connect(gain);
            gain.connect(out);
            osc.start(noteStart);
            osc.stop(noteStart + duration);
          });

          // Grand sustaining golden chord at the climax
          const chordTime = t + 0.44;
          const chordFrequencies = [523.25, 783.99, 1046.50, 1318.51];
          chordFrequencies.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, chordTime);
            osc.detune.setValueAtTime((idx % 2 === 0 ? 4 : -4), chordTime);

            gain.gain.setValueAtTime(0.08, chordTime);
            gain.gain.exponentialRampToValueAtTime(0.0005, chordTime + 0.75);

            osc.connect(gain);
            gain.connect(out);
            osc.start(chordTime);
            osc.stop(chordTime + 0.75);
          });
        } catch (e) {}
      }

      // Sparkling Arcade Coin Pickup Bell
      coin() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          const out = this.getOut();

          [987.77, 1318.51].forEach((freq, i) => {
            const hit = t + i * 0.06;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, hit);

            gain.gain.setValueAtTime(0.15, hit);
            gain.gain.exponentialRampToValueAtTime(0.001, hit + 0.22);

            osc.connect(gain);
            gain.connect(out);
            osc.start(hit);
            osc.stop(hit + 0.22);
          });
        } catch (e) {}
      }

      // Crystalline Gem Sparkle
      gem() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const t = this.ctx.currentTime;
          const out = this.getOut();

          [1567.98, 2093.00, 2637.02].forEach((freq, i) => {
            const hit = t + i * 0.045;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, hit);

            gain.gain.setValueAtTime(0.12, hit);
            gain.gain.exponentialRampToValueAtTime(0.001, hit + 0.25);

            osc.connect(gain);
            gain.connect(out);
            osc.start(hit);
            osc.stop(hit + 0.25);
          });
        } catch (e) {}
      }
    }
    const sound = new SoundEngine();
    if (typeof window !== 'undefined') window.__sound = sound;

    // ==========================================
    // FAST IN-MEMORY CACHED GAME STORAGE ENGINE
    // Zero main-thread disk I/O pauses, 100% offline persistence
    // ==========================================
    class FastGameStorage {
      constructor() {
        this.cache = new Map();
        this.pendingWrites = new Map();
        this.debounceTimer = null;
        this.initialized = false;
        this.init();
      }

      init() {
        if (this.initialized || typeof window === 'undefined') return;
        try {
          if (typeof localStorage !== 'undefined') {
            for (let i = 0; i < localStorage.length; i++) {
              const k = localStorage.key(i);
              if (k) {
                this.cache.set(k, localStorage.getItem(k));
              }
            }
          }
        } catch (e) {
          console.warn('[FastGameStorage] Init read fallback:', e);
        }
        this.initialized = true;

        if (typeof window !== 'undefined') {
          window.addEventListener('beforeunload', () => this.flushSync());
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') this.flushSync();
          });
        }
      }

      getItem(key) {
        if (!this.initialized) this.init();
        if (this.cache.has(key)) {
          return this.cache.get(key);
        }
        try {
          if (typeof localStorage !== 'undefined') {
            const val = localStorage.getItem(key);
            if (val !== null) this.cache.set(key, val);
            return val;
          }
        } catch (e) {}
        return null;
      }

      setItem(key, value) {
        if (!this.initialized) this.init();
        const strVal = String(value);
        this.cache.set(key, strVal);
        this.pendingWrites.set(key, strVal);
        this.scheduleFlush();
      }

      removeItem(key) {
        if (!this.initialized) this.init();
        this.cache.delete(key);
        this.pendingWrites.set(key, null);
        this.scheduleFlush();
      }

      clear() {
        this.cache.clear();
        this.pendingWrites.clear();
        try {
          if (typeof localStorage !== 'undefined') {
            localStorage.clear();
          }
        } catch (e) {}
      }

      scheduleFlush() {
        if (this.debounceTimer) return;
        this.debounceTimer = setTimeout(() => {
          this.debounceTimer = null;
          this.flushPending();
        }, 120);
      }

      flushPending() {
        if (typeof localStorage === 'undefined' || this.pendingWrites.size === 0) return;
        try {
          this.pendingWrites.forEach((val, key) => {
            if (val === null) {
              localStorage.removeItem(key);
            } else {
              localStorage.setItem(key, val);
            }
          });
          this.pendingWrites.clear();
        } catch (e) {
          console.warn('[FastGameStorage] Flush error:', e);
        }
      }

      flushSync() {
        if (this.debounceTimer) {
          clearTimeout(this.debounceTimer);
          this.debounceTimer = null;
        }
        this.flushPending();
      }
    }
    const GameStorage = new FastGameStorage();
    if (typeof window !== 'undefined') {
      window.GameStorage = GameStorage;
    }

    function PageTransition({ screenKey, direction, children, isWaitingForLoad = false }) {
      const [displayedKey, setDisplayedKey] = useState(screenKey);
      const [transition, setTransition] = useState(null);
      const prevChildrenRef = useRef(children);
      const timeoutRef = useRef(null);

      const getPageKind = key => key === 'hint'
        ? 'hint'
        : key === 'correct' || key === 'wrong'
          ? 'result'
          : 'page';

      // Detect screen change during render
      if (screenKey !== displayedKey) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const prevKey = displayedKey;
        const prevChildren = prevChildrenRef.current;
        setDisplayedKey(screenKey);
        setTransition({
          outgoingKey: prevKey,
          outgoingChildren: prevChildren,
          incomingKey: screenKey,
          outgoingKind: getPageKind(prevKey),
          incomingKind: getPageKind(screenKey),
          direction: direction || 'forward',
        });
      }

      useEffect(() => {
        prevChildrenRef.current = children;
      }, [children]);

      useEffect(() => {
        if (transition) {
          timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;
            setTransition(null);
          }, 290);
          return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          };
        }
      }, [transition]);

      let incomingAnimClass = '';
      let outgoingAnimClass = '';

      if (transition) {
        if (transition.incomingKind === 'hint') {
          incomingAnimClass = 'page-anim-in-hint';
        } else if (transition.incomingKind === 'result') {
          incomingAnimClass = 'page-anim-in-result';
        } else {
          incomingAnimClass = transition.direction === 'back' ? 'page-anim-in-back' : 'page-anim-in-forward';
        }

        if (transition.outgoingKind === 'hint') {
          outgoingAnimClass = 'page-anim-out-hint';
        } else if (transition.outgoingKind === 'result') {
          outgoingAnimClass = 'page-anim-out-result';
        } else {
          outgoingAnimClass = transition.direction === 'back' ? 'page-anim-out-back' : 'page-anim-out-forward';
        }
      }

      const isHintLayer = getPageKind(screenKey) === 'hint';

      return (
        <div className="page-transition-stage">
          {transition && (
            <div
              key={`outgoing-${transition.outgoingKey}`}
              aria-hidden="true"
              className={`page-transition-layer page-transition-outgoing ${outgoingAnimClass}`}
            >
              {transition.outgoingChildren}
            </div>
          )}
          <div
            key={`current-${screenKey}`}
            className={`page-transition-layer page-transition-current ${isHintLayer ? 'hint-layer' : ''} ${incomingAnimClass} ${isWaitingForLoad ? 'opacity-0 pointer-events-none' : ''}`}
          >
            {children}
          </div>
        </div>
      );
    }

    // ==========================================
    // SLIDING-TILE LOADER (7 tiles / 8 slots, styles in index.html)
    // ==========================================
    const LOADER_TILE_COLORS = ['red', 'green', 'blue', 'black', 'orange', 'teal', 'gold'];
    function SlidingTileLoader() {
      return (
        <div className="nm-loader-overlay bg-[#183278]" role="status" aria-label="Loading">
          <div className="nm-loader-card bg-transparent shadow-none border-none">
            <svg className="nm-loader" viewBox="0 0 100 80">
              <g transform="translate(50 0) scale(0.707 0.707) rotate(45 0 0)">
                {LOADER_TILE_COLORS.map((fill, i) => (
                  <rect key={fill} className={`rect nm-r${i + 1}`} width="30" height="30" rx="2" ry="2" fill={fill} />
                ))}
              </g>
            </svg>
          </div>
        </div>
      );
    }

    // Warm the image cache in idle time with optimized WebP assets so later pages open instantly
    const PREFETCH_ASSETS = [
      '/assets/icon_brain_3d.webp', '/assets/icon_chest_3d.webp', '/assets/icon_gamepad_3d.webp',
      '/assets/icon_gem_3d_clean.webp', '/assets/icon_gold_coin_3d_clean.webp', '/assets/icon_star_3d.webp',
      '/assets/icon_stopwatch_3d.webp', '/assets/icon_target_3d.webp', '/assets/icon_trophy_3d.webp',
      '/assets/reward_gift_dial_full.webp'
    ];
    function prefetchAssetsWhenIdle() {
      const run = () => PREFETCH_ASSETS.forEach(src => { const img = new Image(); img.decoding = 'async'; img.src = src; });
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(run, { timeout: 2500 });
      else setTimeout(run, 1200);
    }

    // Shows the loader ONLY when the newly opened page is genuinely slow
    // (its visible images still loading). Fast pages open instantly, no loader flash.
    function useSmartPageLoader(screenKey, minDisplayMs = 280, maxMs = 5000) {
      const [visible, setVisible] = useState(false);
      const showStartRef = useRef(0);

      useEffect(() => {
        let cancelled = false;
        let maxTimer = null;
        let minTimer = null;
        const cleanups = [];

        const finish = () => {
          if (cancelled) return;
          const elapsed = Date.now() - showStartRef.current;
          const remainingMin = showStartRef.current > 0 ? Math.max(0, minDisplayMs - elapsed) : 0;
          if (remainingMin > 0) {
            minTimer = setTimeout(() => {
              if (!cancelled) setVisible(false);
            }, remainingMin);
          } else {
            setVisible(false);
          }
        };

        const raf = requestAnimationFrame(() => {
          if (cancelled) return;
          const layer = document.querySelector('.page-transition-current');
          if (!layer) {
            setVisible(false);
            return;
          }
          const pending = Array.from(layer.querySelectorAll('img'))
            .filter(img => img.getAttribute('loading') !== 'lazy' && !img.complete);

          if (pending.length === 0) {
            // Fast screen: all assets cached -> open immediately without loader
            setVisible(false);
            return;
          }

          // Slower screen: assets need downloading -> show loader cleanly with solid theme background
          showStartRef.current = Date.now();
          setVisible(true);

          let remaining = pending.length;
          const onDone = () => {
            remaining -= 1;
            if (remaining <= 0) finish();
          };

          pending.forEach(img => {
            img.addEventListener('load', onDone, { once: true });
            img.addEventListener('error', onDone, { once: true });
            cleanups.push(() => {
              img.removeEventListener('load', onDone);
              img.removeEventListener('error', onDone);
            });
          });

          maxTimer = setTimeout(finish, maxMs);
        });

        return () => {
          cancelled = true;
          cancelAnimationFrame(raf);
          clearTimeout(maxTimer);
          clearTimeout(minTimer);
          cleanups.forEach(fn => fn());
          setVisible(false);
        };
      }, [screenKey]);

      return visible;
    }

    // ==========================================
    // 3D CYBER-ARCADE FLYING TILE OBJECT POOL (Zero GC Pauses & Zero DOM Churn)
    // Pre-allocated fixed slots reused across all moves to eliminate memory allocations
    // ==========================================
    const FLYING_POOL_CAPACITY = 8;
    const INITIAL_FLYING_POOL = Array.from({ length: FLYING_POOL_CAPACITY }, (_, i) => ({
      slotId: i,
      active: false,
      id: null,
      number: null,
      targetSlot: null,
      fromX: 0,
      fromY: 0,
      fromW: 48,
      fromH: 48,
      toX: 0,
      toY: 0,
      toW: 48,
      toH: 48,
      isReturn: false,
      flightSeq: 0
    }));

    function PooledFlyingTileItem({ slot, onComplete, largeFontEnabled }) {
      const elRef = useRef(null);
      const finishedRef = useRef(false);

      useEffect(() => {
        if (!slot.active) {
          finishedRef.current = false;
          return;
        }

        finishedRef.current = false;
        const el = elRef.current;
        if (!el || !isFinite(slot.fromX) || !isFinite(slot.toX)) {
          finishedRef.current = true;
          onComplete(slot);
          return;
        }

        const dx = slot.toX - slot.fromX;
        const dy = slot.toY - slot.fromY;

        // Parabolic ballistic arc: curves sideways slightly towards the center
        const arcX = dx * 0.12 + (dx > 0 ? 16 : -16);
        const arcY = dy * 0.5 + (slot.isReturn ? 28 : -38);
        const midX = slot.fromX + dx * 0.5 + arcX;
        const midY = slot.fromY + arcY;
        const tilt = (dx > 0 ? 12 : -12) * (slot.isReturn ? -1 : 1);
        const targetScaleX = Math.max(0.2, Math.min(3, (slot.toW || 48) / (slot.fromW || 48)));
        const targetScaleY = Math.max(0.2, Math.min(3, (slot.toH || 48) / (slot.fromH || 48)));
        const reducedMotion = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const duration = reducedMotion ? 100 : 260;

        const safeFinish = () => {
          if (finishedRef.current) return;
          finishedRef.current = true;
          onComplete(slot);
        };

        const watchdog = setTimeout(safeFinish, duration + 40);

        let animation = null;
        try {
          if (typeof el.animate === 'function') {
            animation = el.animate([
              {
                transform: `translate3d(${slot.fromX}px, ${slot.fromY}px, 0) scale(1, 1) rotate(0deg)`,
                opacity: 1
              },
              {
                offset: 0.45,
                transform: `translate3d(${midX}px, ${midY}px, 0) scale(1.12, 1.12) rotate(${tilt}deg)`,
                opacity: 1
              },
              {
                transform: `translate3d(${slot.toX}px, ${slot.toY}px, 0) scale(${targetScaleX}, ${targetScaleY}) rotate(0deg)`,
                opacity: 1
              }
            ], {
              duration: duration,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              fill: 'forwards'
            });

            animation.onfinish = safeFinish;
            animation.onerror = safeFinish;
          } else {
            safeFinish();
          }
        } catch (e) {
          safeFinish();
        }

        return () => {
          clearTimeout(watchdog);
          if (animation) {
            try { animation.cancel(); } catch (e) {}
          }
          if (slot.active && !finishedRef.current) {
            safeFinish();
          }
        };
      }, [slot.active, slot.flightSeq]);

      const initialTransform = slot.active && isFinite(slot.fromX) && isFinite(slot.fromY)
        ? `translate3d(${slot.fromX}px, ${slot.fromY}px, 0)`
        : 'translate3d(-9999px, -9999px, 0)';

      return (
        <div
          ref={elRef}
          aria-hidden={!slot.active}
          className={`scifi-flying-tile ${slot.isReturn ? 'scifi-flying-tile-return' : ''} pointer-events-none absolute select-none flex items-center justify-center font-black ${
            largeFontEnabled ? 'text-[clamp(20px,6.5vw,30px)]' : 'text-[clamp(16px,5vw,24px)]'
          }`}
          style={{
            left: 0,
            top: 0,
            width: `${slot.fromW || 48}px`,
            height: `${slot.fromH || 48}px`,
            boxSizing: 'border-box',
            transform: initialTransform,
            WebkitTransform: initialTransform,
            visibility: slot.active ? 'visible' : 'hidden',
            opacity: slot.active ? 1 : 0,
            willChange: slot.active ? 'transform, opacity' : 'auto'
          }}
        >
          <div className="scifi-flying-trail-halo" />
          <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {slot.number}
          </span>
        </div>
      );
    }

    // Backwards-compatible alias for single item compatibility
    const FlyingTileItem = PooledFlyingTileItem;

    // ==========================================
    // CROSS-MATH PUZZLE TEMPLATES DATABASE
    // Multiple distinct mathematically verified cross-math layouts
    // ==========================================
        const PUZZLE_TEMPLATES = [
  {
    "id": 0,
    "cols": 5,
    "solvedText": "3 + 5 = 8",
    "hintStep": "Top row: 3 + 5 = 8",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 3
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 5
      },
      {
        "slot": 2,
        "row": 2,
        "column": 4,
        "answer": 6
      },
      {
        "slot": 3,
        "row": 4,
        "column": 2,
        "answer": 7
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "+",
        {
          "slot": 1
        },
        "=",
        "8"
      ],
      [
        "+",
        null,
        "+",
        null,
        "+"
      ],
      [
        "4",
        "+",
        "2",
        "=",
        {
          "slot": 2
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "7",
        "+",
        {
          "slot": 3
        },
        "=",
        "14"
      ]
    ],
    "numbers": [
      3,
      5,
      6,
      7,
      9,
      12
    ]
  },
  {
    "id": 1,
    "cols": 5,
    "solvedText": "6 + 9 = 15",
    "hintStep": "Top row: 6 + 9 = 15",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 6
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 9
      },
      {
        "slot": 2,
        "row": 2,
        "column": 4,
        "answer": 8
      },
      {
        "slot": 3,
        "row": 4,
        "column": 2,
        "answer": 12
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "+",
        {
          "slot": 1
        },
        "=",
        "15"
      ],
      [
        "+",
        null,
        "+",
        null,
        "+"
      ],
      [
        "5",
        "+",
        "3",
        "=",
        {
          "slot": 2
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "11",
        "+",
        {
          "slot": 3
        },
        "=",
        "23"
      ]
    ],
    "numbers": [
      6,
      8,
      9,
      10,
      12,
      14
    ]
  },
  {
    "id": 2,
    "cols": 5,
    "solvedText": "14 − 6 = 8",
    "hintStep": "Top row: 14 − 6 = 8",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 14
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 6
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 9
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 5
      },
      {
        "slot": 4,
        "row": 4,
        "column": 2,
        "answer": 10
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "−",
        {
          "slot": 1
        },
        "=",
        "8"
      ],
      [
        "+",
        null,
        "+",
        null,
        "+"
      ],
      [
        {
          "slot": 2
        },
        "−",
        "4",
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "23",
        "−",
        {
          "slot": 4
        },
        "=",
        "13"
      ]
    ],
    "numbers": [
      5,
      6,
      7,
      9,
      10,
      14,
      15
    ]
  },
  {
    "id": 3,
    "cols": 5,
    "solvedText": "16 − 7 = 9",
    "hintStep": "Top row: 16 − 7 = 9",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 16
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 7
      },
      {
        "slot": 2,
        "row": 2,
        "column": 2,
        "answer": 3
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 5
      },
      {
        "slot": 4,
        "row": 4,
        "column": 0,
        "answer": 24
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "−",
        {
          "slot": 1
        },
        "=",
        "9"
      ],
      [
        "+",
        null,
        "+",
        null,
        "+"
      ],
      [
        "8",
        "−",
        {
          "slot": 2
        },
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        {
          "slot": 4
        },
        "−",
        "10",
        "=",
        "14"
      ]
    ],
    "numbers": [
      3,
      5,
      7,
      11,
      16,
      18,
      24
    ]
  },
  {
    "id": 4,
    "cols": 5,
    "solvedText": "11 + 7 = 18",
    "hintStep": "Top row: 11 + 7 = 18",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 11
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 7
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 4
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 6
      },
      {
        "slot": 4,
        "row": 4,
        "column": 2,
        "answer": 5
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "+",
        {
          "slot": 1
        },
        "=",
        "18"
      ],
      [
        "−",
        null,
        "−",
        null,
        "−"
      ],
      [
        {
          "slot": 2
        },
        "+",
        "2",
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "7",
        "+",
        {
          "slot": 4
        },
        "=",
        "12"
      ]
    ],
    "numbers": [
      4,
      5,
      6,
      7,
      9,
      11,
      15
    ]
  },
  {
    "id": 5,
    "cols": 5,
    "solvedText": "20 − 8 = 12",
    "hintStep": "Top row: 20 − 8 = 12",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 20
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 8
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 7
      },
      {
        "slot": 3,
        "row": 2,
        "column": 2,
        "answer": 3
      },
      {
        "slot": 4,
        "row": 4,
        "column": 4,
        "answer": 8
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "−",
        {
          "slot": 1
        },
        "=",
        "12"
      ],
      [
        "−",
        null,
        "−",
        null,
        "−"
      ],
      [
        {
          "slot": 2
        },
        "−",
        {
          "slot": 3
        },
        "=",
        "4"
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "13",
        "−",
        "5",
        "=",
        {
          "slot": 4
        }
      ]
    ],
    "numbers": [
      3,
      7,
      8,
      8,
      10,
      16,
      20
    ]
  },
  {
    "id": 6,
    "cols": 5,
    "solvedText": "2 × 3 = 6",
    "hintStep": "Top row: 2 × 3 = 6",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 2
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 3
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 4
      },
      {
        "slot": 3,
        "row": 2,
        "column": 2,
        "answer": 2
      },
      {
        "slot": 4,
        "row": 4,
        "column": 2,
        "answer": 6
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "×",
        {
          "slot": 1
        },
        "=",
        "6"
      ],
      [
        "×",
        null,
        "×",
        null,
        "×"
      ],
      [
        {
          "slot": 2
        },
        "×",
        {
          "slot": 3
        },
        "=",
        "8"
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "8",
        "×",
        {
          "slot": 4
        },
        "=",
        "48"
      ]
    ],
    "numbers": [
      2,
      2,
      3,
      4,
      5,
      6,
      12
    ]
  },
  {
    "id": 7,
    "cols": 5,
    "solvedText": "3 × 2 = 6",
    "hintStep": "Top row: 3 × 2 = 6",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 3
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 2
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 3
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 12
      },
      {
        "slot": 4,
        "row": 4,
        "column": 0,
        "answer": 9
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "×",
        {
          "slot": 1
        },
        "=",
        "6"
      ],
      [
        "×",
        null,
        "×",
        null,
        "×"
      ],
      [
        {
          "slot": 2
        },
        "×",
        "4",
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        {
          "slot": 4
        },
        "×",
        "8",
        "=",
        "72"
      ]
    ],
    "numbers": [
      2,
      3,
      3,
      7,
      9,
      12,
      15
    ]
  },
  {
    "id": 8,
    "cols": 5,
    "solvedText": "4 × 3 = 12",
    "hintStep": "Top row: 4 × 3 = 12",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 4
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 3
      },
      {
        "slot": 2,
        "row": 2,
        "column": 2,
        "answer": 3
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 6
      },
      {
        "slot": 4,
        "row": 4,
        "column": 2,
        "answer": 9
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "×",
        {
          "slot": 1
        },
        "=",
        "12"
      ],
      [
        "×",
        null,
        "×",
        null,
        "×"
      ],
      [
        "2",
        "×",
        {
          "slot": 2
        },
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "8",
        "×",
        {
          "slot": 4
        },
        "=",
        "72"
      ]
    ],
    "numbers": [
      3,
      3,
      4,
      6,
      9,
      10,
      16
    ]
  },
  {
    "id": 9,
    "cols": 5,
    "solvedText": "5 × 2 = 10",
    "hintStep": "Top row: 5 × 2 = 10",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 5
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 2
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 2
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 8
      },
      {
        "slot": 4,
        "row": 4,
        "column": 0,
        "answer": 10
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "×",
        {
          "slot": 1
        },
        "=",
        "10"
      ],
      [
        "×",
        null,
        "×",
        null,
        "×"
      ],
      [
        {
          "slot": 2
        },
        "×",
        "4",
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        {
          "slot": 4
        },
        "×",
        "8",
        "=",
        "80"
      ]
    ],
    "numbers": [
      2,
      2,
      5,
      6,
      8,
      10,
      14
    ]
  },
  {
    "id": 10,
    "cols": 5,
    "solvedText": "36 ÷ 6 = 6",
    "hintStep": "Top row: 36 ÷ 6 = 6",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 36
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 6
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 4
      },
      {
        "slot": 3,
        "row": 2,
        "column": 2,
        "answer": 2
      },
      {
        "slot": 4,
        "row": 4,
        "column": 4,
        "answer": 3
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "÷",
        {
          "slot": 1
        },
        "=",
        "6"
      ],
      [
        "÷",
        null,
        "÷",
        null,
        "÷"
      ],
      [
        {
          "slot": 2
        },
        "÷",
        {
          "slot": 3
        },
        "=",
        "2"
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "9",
        "÷",
        "3",
        "=",
        {
          "slot": 4
        }
      ]
    ],
    "numbers": [
      2,
      3,
      4,
      6,
      8,
      12,
      36
    ]
  },
  {
    "id": 11,
    "cols": 5,
    "solvedText": "48 ÷ 4 = 12",
    "hintStep": "Top row: 48 ÷ 4 = 12",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 48
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 4
      },
      {
        "slot": 2,
        "row": 2,
        "column": 2,
        "answer": 2
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 3
      },
      {
        "slot": 4,
        "row": 4,
        "column": 0,
        "answer": 8
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "÷",
        {
          "slot": 1
        },
        "=",
        "12"
      ],
      [
        "÷",
        null,
        "÷",
        null,
        "÷"
      ],
      [
        "6",
        "÷",
        {
          "slot": 2
        },
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        {
          "slot": 4
        },
        "÷",
        "2",
        "=",
        "4"
      ]
    ],
    "numbers": [
      2,
      3,
      4,
      5,
      8,
      14,
      48
    ]
  },
  {
    "id": 12,
    "cols": 5,
    "solvedText": "72 ÷ 8 = 9",
    "hintStep": "Top row: 72 ÷ 8 = 9",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 72
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 8
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 6
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 3
      },
      {
        "slot": 4,
        "row": 4,
        "column": 2,
        "answer": 4
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "÷",
        {
          "slot": 1
        },
        "=",
        "9"
      ],
      [
        "÷",
        null,
        "÷",
        null,
        "÷"
      ],
      [
        {
          "slot": 2
        },
        "÷",
        "2",
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "12",
        "÷",
        {
          "slot": 4
        },
        "=",
        "3"
      ]
    ],
    "numbers": [
      3,
      4,
      6,
      7,
      8,
      15,
      72
    ]
  },
  {
    "id": 13,
    "cols": 5,
    "solvedText": "6 × 4 = 24",
    "hintStep": "Top row: 6 × 4 = 24",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 6
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 4
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 2
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 4
      },
      {
        "slot": 4,
        "row": 4,
        "column": 2,
        "answer": 2
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "×",
        {
          "slot": 1
        },
        "=",
        "24"
      ],
      [
        "÷",
        null,
        "÷",
        null,
        "÷"
      ],
      [
        {
          "slot": 2
        },
        "×",
        "2",
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "3",
        "×",
        {
          "slot": 4
        },
        "=",
        "6"
      ]
    ],
    "numbers": [
      2,
      2,
      4,
      4,
      5,
      6,
      10
    ]
  },
  {
    "id": 14,
    "cols": 5,
    "solvedText": "18 ÷ 3 = 6",
    "hintStep": "Top row: 18 ÷ 3 = 6",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 18
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 3
      },
      {
        "slot": 2,
        "row": 2,
        "column": 2,
        "answer": 2
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 2
      },
      {
        "slot": 4,
        "row": 4,
        "column": 0,
        "answer": 72
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "÷",
        {
          "slot": 1
        },
        "=",
        "6"
      ],
      [
        "×",
        null,
        "×",
        null,
        "×"
      ],
      [
        "4",
        "÷",
        {
          "slot": 2
        },
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        {
          "slot": 4
        },
        "÷",
        "6",
        "=",
        "12"
      ]
    ],
    "numbers": [
      2,
      2,
      3,
      8,
      16,
      18,
      72
    ]
  },
  {
    "id": 15,
    "cols": 5,
    "solvedText": "5 × 4 = 20",
    "hintStep": "Top row: 5 × 4 = 20",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 5
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 4
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 3
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 6
      },
      {
        "slot": 4,
        "row": 4,
        "column": 2,
        "answer": 8
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "×",
        {
          "slot": 1
        },
        "=",
        "20"
      ],
      [
        "×",
        null,
        "×",
        null,
        "×"
      ],
      [
        {
          "slot": 2
        },
        "×",
        "2",
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "15",
        "×",
        {
          "slot": 4
        },
        "=",
        "120"
      ]
    ],
    "numbers": [
      3,
      4,
      5,
      6,
      7,
      8,
      18
    ]
  },
  {
    "id": 16,
    "cols": 5,
    "solvedText": "96 ÷ 8 = 12",
    "hintStep": "Top row: 96 ÷ 8 = 12",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 96
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 8
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 6
      },
      {
        "slot": 3,
        "row": 2,
        "column": 2,
        "answer": 2
      },
      {
        "slot": 4,
        "row": 4,
        "column": 4,
        "answer": 4
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "÷",
        {
          "slot": 1
        },
        "=",
        "12"
      ],
      [
        "÷",
        null,
        "÷",
        null,
        "÷"
      ],
      [
        {
          "slot": 2
        },
        "÷",
        {
          "slot": 3
        },
        "=",
        "3"
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "16",
        "÷",
        "4",
        "=",
        {
          "slot": 4
        }
      ]
    ],
    "numbers": [
      2,
      4,
      6,
      8,
      10,
      20,
      96
    ]
  },
  {
    "id": 17,
    "cols": 5,
    "solvedText": "7 × 3 = 21",
    "hintStep": "Top row: 7 × 3 = 21",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 7
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 3
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 4
      },
      {
        "slot": 3,
        "row": 2,
        "column": 2,
        "answer": 3
      },
      {
        "slot": 4,
        "row": 2,
        "column": 4,
        "answer": 12
      },
      {
        "slot": 5,
        "row": 4,
        "column": 0,
        "answer": 28
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "×",
        {
          "slot": 1
        },
        "=",
        "21"
      ],
      [
        "×",
        null,
        "×",
        null,
        "×"
      ],
      [
        {
          "slot": 2
        },
        "×",
        {
          "slot": 3
        },
        "=",
        {
          "slot": 4
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        {
          "slot": 5
        },
        "×",
        "9",
        "=",
        "252"
      ]
    ],
    "numbers": [
      3,
      3,
      4,
      7,
      11,
      12,
      25,
      28
    ]
  },
  {
    "id": 18,
    "cols": 5,
    "solvedText": "144 ÷ 12 = 12",
    "hintStep": "Top row: 144 ÷ 12 = 12",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 144
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 12
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 8
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 4
      },
      {
        "slot": 4,
        "row": 4,
        "column": 2,
        "answer": 6
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "÷",
        {
          "slot": 1
        },
        "=",
        "12"
      ],
      [
        "÷",
        null,
        "÷",
        null,
        "÷"
      ],
      [
        {
          "slot": 2
        },
        "÷",
        "2",
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "18",
        "÷",
        {
          "slot": 4
        },
        "=",
        "3"
      ]
    ],
    "numbers": [
      4,
      6,
      8,
      12,
      15,
      24,
      144
    ]
  },
  {
    "id": 19,
    "cols": 5,
    "solvedText": "24 × 6 = 144",
    "hintStep": "Top row: 24 × 6 = 144",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 24
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 6
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 3
      },
      {
        "slot": 3,
        "row": 2,
        "column": 2,
        "answer": 2
      },
      {
        "slot": 4,
        "row": 4,
        "column": 4,
        "answer": 24
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "×",
        {
          "slot": 1
        },
        "=",
        "144"
      ],
      [
        "÷",
        null,
        "÷",
        null,
        "÷"
      ],
      [
        {
          "slot": 2
        },
        "×",
        {
          "slot": 3
        },
        "=",
        "6"
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "8",
        "×",
        "3",
        "=",
        {
          "slot": 4
        }
      ]
    ],
    "numbers": [
      2,
      3,
      6,
      12,
      24,
      24,
      30
    ]
  },
  {
    "id": 20,
    "cols": 5,
    "solvedText": "30 ÷ 5 = 6",
    "hintStep": "Top row: 30 ÷ 5 = 6",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 30
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 5
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 4
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 2
      },
      {
        "slot": 4,
        "row": 4,
        "column": 2,
        "answer": 10
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "÷",
        {
          "slot": 1
        },
        "=",
        "6"
      ],
      [
        "×",
        null,
        "×",
        null,
        "×"
      ],
      [
        {
          "slot": 2
        },
        "÷",
        "2",
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "120",
        "÷",
        {
          "slot": 4
        },
        "=",
        "12"
      ]
    ],
    "numbers": [
      2,
      4,
      5,
      10,
      15,
      30,
      35
    ]
  },
  {
    "id": 21,
    "cols": 5,
    "solvedText": "8 × 5 = 40",
    "hintStep": "Top row: 8 × 5 = 40",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 8
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 5
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 3
      },
      {
        "slot": 3,
        "row": 2,
        "column": 2,
        "answer": 3
      },
      {
        "slot": 4,
        "row": 4,
        "column": 4,
        "answer": 360
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "×",
        {
          "slot": 1
        },
        "=",
        "40"
      ],
      [
        "×",
        null,
        "×",
        null,
        "×"
      ],
      [
        {
          "slot": 2
        },
        "×",
        {
          "slot": 3
        },
        "=",
        "9"
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "24",
        "×",
        "15",
        "=",
        {
          "slot": 4
        }
      ]
    ],
    "numbers": [
      3,
      3,
      5,
      8,
      18,
      45,
      360
    ]
  },
  {
    "id": 22,
    "cols": 5,
    "solvedText": "180 ÷ 10 = 18",
    "hintStep": "Top row: 180 ÷ 10 = 18",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 180
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 10
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 6
      },
      {
        "slot": 3,
        "row": 2,
        "column": 4,
        "answer": 3
      },
      {
        "slot": 4,
        "row": 4,
        "column": 2,
        "answer": 5
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "÷",
        {
          "slot": 1
        },
        "=",
        "18"
      ],
      [
        "÷",
        null,
        "÷",
        null,
        "÷"
      ],
      [
        {
          "slot": 2
        },
        "÷",
        "2",
        "=",
        {
          "slot": 3
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "30",
        "÷",
        {
          "slot": 4
        },
        "=",
        "6"
      ]
    ],
    "numbers": [
      3,
      5,
      6,
      10,
      20,
      40,
      180
    ]
  },
  {
    "id": 23,
    "cols": 5,
    "solvedText": "36 × 4 = 144",
    "hintStep": "Top row: 36 × 4 = 144",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 36
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 4
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 4
      },
      {
        "slot": 3,
        "row": 2,
        "column": 2,
        "answer": 2
      },
      {
        "slot": 4,
        "row": 4,
        "column": 4,
        "answer": 18
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "×",
        {
          "slot": 1
        },
        "=",
        "144"
      ],
      [
        "÷",
        null,
        "÷",
        null,
        "÷"
      ],
      [
        {
          "slot": 2
        },
        "×",
        {
          "slot": 3
        },
        "=",
        "8"
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        "9",
        "×",
        "2",
        "=",
        {
          "slot": 4
        }
      ]
    ],
    "numbers": [
      2,
      4,
      4,
      18,
      22,
      36,
      50
    ]
  },
  {
    "id": 24,
    "cols": 5,
    "solvedText": "48 × 6 = 288",
    "hintStep": "Top row: 48 × 6 = 288",
    "slots": [
      {
        "slot": 0,
        "row": 0,
        "column": 0,
        "answer": 48
      },
      {
        "slot": 1,
        "row": 0,
        "column": 2,
        "answer": 6
      },
      {
        "slot": 2,
        "row": 2,
        "column": 0,
        "answer": 4
      },
      {
        "slot": 3,
        "row": 2,
        "column": 2,
        "answer": 3
      },
      {
        "slot": 4,
        "row": 2,
        "column": 4,
        "answer": 12
      },
      {
        "slot": 5,
        "row": 4,
        "column": 0,
        "answer": 12
      }
    ],
    "rows": [
      [
        {
          "slot": 0
        },
        "×",
        {
          "slot": 1
        },
        "=",
        "288"
      ],
      [
        "÷",
        null,
        "÷",
        null,
        "÷"
      ],
      [
        {
          "slot": 2
        },
        "×",
        {
          "slot": 3
        },
        "=",
        {
          "slot": 4
        }
      ],
      [
        "=",
        null,
        "=",
        null,
        "="
      ],
      [
        {
          "slot": 5
        },
        "×",
        "2",
        "=",
        "24"
      ]
    ],
    "numbers": [
      3,
      4,
      6,
      12,
      12,
      25,
      48,
      60
    ]
  }
];

    // ==========================================
    // LEVEL ENTRY COST PROGRESSION CHAIN
    // Level 1 starts at 100 Gold Coins & 10 Diamond Coins (Gems).
    // The economy chain progressively scales as missions become harder.
    // ==========================================
    // Each level is a series of puzzles: 10 on Level 1, growing steadily to 20 on Level 25.
    function getStageCount(levelNum) {
      const lvl = Math.max(1, Math.min(25, Number(levelNum) || 1));
      return Math.round(10 + ((lvl - 1) * 10) / 24);
    }

    function getLevelEntryCost(levelNum) {
      const lvl = Math.max(1, Math.min(25, Number(levelNum) || 1));
      let coins = 100;
      let gems = 10;
      if (lvl <= 8) {
        // World 1: Easy (Levels 1 - 8)
        coins = 100 + (lvl - 1) * 25;
        gems = 10 + (lvl - 1) * 2;
      } else if (lvl <= 17) {
        // World 2: Medium (Levels 9 - 17)
        coins = 275 + (lvl - 8) * 40;
        gems = 24 + (lvl - 8) * 2;
      } else {
        // World 3: Hard (Levels 18 - 25)
        coins = 635 + (lvl - 17) * 70;
        gems = 42 + (lvl - 17) * 4;
        if (lvl === 25) {
          coins = 1200;
          gems = 75;
        }
      }
      return { coins, gems };
    }

    // ==========================================
    const ALL_LEVELS = [
      // World 1: Easy (Levels 1 - 8)
      { num: 1, title: 'Warm-Up Ignition', diff: 'Easy', range: '0 - 50', xp: 15, coins: 10, tag: 'WARM-UP', tier: 'easy', cost: getLevelEntryCost(1) },
      { num: 2, title: 'Addition Circuit', diff: 'Easy', range: '51 - 100', xp: 20, coins: 12, tag: 'CIRCUIT', tier: 'easy', cost: getLevelEntryCost(2) },
      { num: 3, title: 'Cross Pulse', diff: 'Easy', range: '101 - 150', xp: 25, coins: 14, tag: 'CURRENT', tier: 'easy', cost: getLevelEntryCost(3) },
      { num: 4, title: 'Binary Junction', diff: 'Easy', range: '151 - 200', xp: 25, coins: 16, tag: 'LOGIC', tier: 'easy', cost: getLevelEntryCost(4) },
      { num: 5, title: 'Equation Dash', diff: 'Easy', range: '201 - 250', xp: 30, coins: 18, tag: 'EQUATION', tier: 'easy', cost: getLevelEntryCost(5) },
      { num: 6, title: 'Number Quest', diff: 'Easy', range: '251 - 300', xp: 30, coins: 20, tag: 'QUEST', tier: 'easy', cost: getLevelEntryCost(6) },
      { num: 7, title: 'Cipher Key', diff: 'Easy', range: '301 - 350', xp: 35, coins: 22, tag: 'CIPHER', tier: 'easy', cost: getLevelEntryCost(7) },
      { num: 8, title: 'Milestone Arena', diff: 'Easy', range: '351 - 400', xp: 35, coins: 25, tag: 'ARENA', tier: 'easy', cost: getLevelEntryCost(8) },

      // World 2: Medium (Levels 9 - 17)
      { num: 9, title: 'Vector Flux', diff: 'Medium', range: '401 - 450', xp: 40, coins: 26, tag: 'FLUX', tier: 'medium', cost: getLevelEntryCost(9) },
      { num: 10, title: 'Hyper Matrix', diff: 'Medium', range: '451 - 500', xp: 40, coins: 28, tag: 'MATRIX', tier: 'medium', cost: getLevelEntryCost(10) },
      { num: 11, title: 'Photon Grid', diff: 'Medium', range: '501 - 550', xp: 45, coins: 30, tag: 'PHOTON', tier: 'medium', cost: getLevelEntryCost(11) },
      { num: 12, title: 'Quantum Leap', diff: 'Medium', range: '551 - 600', xp: 45, coins: 32, tag: 'QUANTUM', tier: 'medium', cost: getLevelEntryCost(12) },
      { num: 13, title: 'Delta Shift', diff: 'Medium', range: '601 - 650', xp: 50, coins: 34, tag: 'DELTA', tier: 'medium', cost: getLevelEntryCost(13) },
      { num: 14, title: 'Synapse Overload', diff: 'Medium', range: '651 - 700', xp: 50, coins: 36, tag: 'SYNAPSE', tier: 'medium', cost: getLevelEntryCost(14) },
      { num: 15, title: 'Cosmic Ray', diff: 'Medium', range: '701 - 750', xp: 55, coins: 38, tag: 'COSMIC', tier: 'medium', cost: getLevelEntryCost(15) },
      { num: 16, title: 'Plasma Core', diff: 'Medium', range: '751 - 800', xp: 55, coins: 40, tag: 'PLASMA', tier: 'medium', cost: getLevelEntryCost(16) },
      { num: 17, title: 'Mastery Trial', diff: 'Medium', range: '801 - 850', xp: 60, coins: 45, tag: 'TRIAL', tier: 'medium', cost: getLevelEntryCost(17) },

      // World 3: Hard (Levels 18 - 25)
      { num: 18, title: 'Vortex Rift', diff: 'Hard', range: '851 - 920', xp: 65, coins: 48, tag: 'VORTEX', tier: 'hard', cost: getLevelEntryCost(18) },
      { num: 19, title: 'Singularity Node', diff: 'Hard', range: '921 - 1000', xp: 70, coins: 50, tag: 'NODE', tier: 'hard', cost: getLevelEntryCost(19) },
      { num: 20, title: 'Dark Matter Maze', diff: 'Hard', range: '1001 - 1100', xp: 75, coins: 55, tag: 'DARK', tier: 'hard', cost: getLevelEntryCost(20) },
      { num: 21, title: 'Neutron Blitz', diff: 'Hard', range: '1101 - 1200', xp: 80, coins: 60, tag: 'BLITZ', tier: 'hard', cost: getLevelEntryCost(21) },
      { num: 22, title: 'Chrono Shift', diff: 'Hard', range: '1201 - 1300', xp: 85, coins: 65, tag: 'CHRONO', tier: 'hard', cost: getLevelEntryCost(22) },
      { num: 23, title: 'Supernova Grid', diff: 'Hard', range: '1301 - 1400', xp: 90, coins: 70, tag: 'NOVA', tier: 'hard', cost: getLevelEntryCost(23) },
      { num: 24, title: 'Omega Frontier', diff: 'Hard', range: '1401 - 1490', xp: 95, coins: 80, tag: 'OMEGA', tier: 'hard', cost: getLevelEntryCost(24) },
      { num: 25, title: 'Apex Boss Stage', diff: 'Hard', range: '1491 - 1600', xp: 100, coins: 100, tag: 'APEX BOSS', tier: 'hard', cost: getLevelEntryCost(25) },
    ];

    export const LEVEL_AWARDS = [
      { level: 1, title: 'Chrono Speedster', icon: '/assets/awards/award_lvl_01.webp', desc: 'Conquered Level 1 arithmetic time challenge', color: 'from-amber-400 to-orange-500' },
      { level: 2, title: 'Logic Cipher', icon: '/assets/awards/award_lvl_02.webp', desc: 'Mastered Level 2 puzzle sequences', color: 'from-cyan-400 to-blue-500' },
      { level: 3, title: 'Matrix Cube', icon: '/assets/awards/award_lvl_03.webp', desc: 'Solved Level 3 isometric logic blocks', color: 'from-purple-400 to-indigo-500' },
      { level: 4, title: 'Neural Flash', icon: '/assets/awards/award_lvl_04.webp', desc: 'Discharged Level 4 high-voltage reasoning', color: 'from-yellow-300 to-amber-500' },
      { level: 5, title: 'Synapse Spark', icon: '/assets/awards/award_lvl_05.webp', desc: 'Illuminated Level 5 cognitive breakthroughs', color: 'from-amber-300 to-yellow-500' },
      { level: 6, title: 'Arithmetic Matrix', icon: '/assets/awards/award_lvl_06.webp', desc: 'Calculated Level 6 cyber theorems', color: 'from-blue-400 to-indigo-600' },
      { level: 7, title: 'Golden Sovereign', icon: '/assets/awards/award_lvl_07.webp', desc: 'Minted Level 7 golden arithmetic ratios', color: 'from-yellow-400 to-amber-600' },
      { level: 8, title: 'Daily Chronicler', icon: '/assets/awards/award_lvl_08.webp', desc: 'Completed Level 8 calendar challenges', color: 'from-sky-400 to-cyan-600' },
      { level: 9, title: 'Bullseye Marksman', icon: '/assets/awards/award_lvl_09.webp', desc: 'Scored Level 9 pinpoint precision equations', color: 'from-red-400 to-rose-600' },
      { level: 10, title: 'Cosmic Ascendant', icon: '/assets/awards/award_lvl_10.webp', desc: 'Launched Level 10 supersonic ascension', color: 'from-orange-400 to-red-600' },
      { level: 11, title: 'Aegis Defender', icon: '/assets/awards/award_lvl_11.webp', desc: 'Fortified Level 11 shield defenses', color: 'from-cyan-400 to-teal-500' },
      { level: 12, title: 'Supernova Burst', icon: '/assets/awards/award_lvl_12.webp', desc: 'Ignited Level 12 blazing solve streaks', color: 'from-orange-500 to-rose-600' },
      { level: 13, title: 'Grand Vault', icon: '/assets/awards/award_lvl_13.webp', desc: 'Unwrapped Level 13 mystery treasuries', color: 'from-pink-400 to-purple-600' },
      { level: 14, title: 'Vault Keymaster', icon: '/assets/awards/award_lvl_14.webp', desc: 'Unlocked Level 14 secret vault doors', color: 'from-amber-400 to-yellow-500' },
      { level: 15, title: 'Diamond Mind', icon: '/assets/awards/award_lvl_15.webp', desc: 'Faceted Level 15 flawless math perfection', color: 'from-cyan-300 to-blue-600' },
      { level: 16, title: 'Victory Chime', icon: '/assets/awards/award_lvl_16.webp', desc: 'Rang the Level 16 victory bell', color: 'from-yellow-400 to-amber-500' },
      { level: 17, title: 'Celestial Starlight', icon: '/assets/awards/award_lvl_17.webp', desc: 'Attained Level 17 astral mastery', color: 'from-amber-300 to-yellow-400' },
      { level: 18, title: 'Omni Sphere', icon: '/assets/awards/award_lvl_18.webp', desc: 'Harmonized Level 18 multidimensional orbits', color: 'from-teal-400 to-cyan-600' },
      { level: 19, title: 'Titan Battleaxe', icon: '/assets/awards/award_lvl_19.webp', desc: 'Cleaved Level 19 titan challenges', color: 'from-rose-400 to-red-600' },
      { level: 20, title: 'Cipher Lockbreaker', icon: '/assets/awards/award_lvl_20.webp', desc: 'Decrypted Level 20 heavy cipher locks', color: 'from-amber-400 to-orange-600' },
      { level: 21, title: 'Grandmaster Bishop', icon: '/assets/awards/award_lvl_21.webp', desc: 'Outplayed Level 21 tactical chessboards', color: 'from-indigo-400 to-violet-600' },
      { level: 22, title: 'Medal of Honor', icon: '/assets/awards/award_lvl_22.webp', desc: 'Decorated with Level 22 medal of courage', color: 'from-yellow-400 to-amber-500' },
      { level: 23, title: 'Imperial Sovereign', icon: '/assets/awards/award_lvl_23.webp', desc: 'Crowned sovereign of Level 23 math realm', color: 'from-amber-300 to-yellow-500' },
      { level: 24, title: 'Champion Cup', icon: '/assets/awards/award_lvl_24.webp', desc: 'Raised Level 24 golden championship cup', color: 'from-yellow-400 to-amber-600' },
      { level: 25, title: 'Apex Grandmaster', icon: '/assets/awards/award_lvl_25.webp', desc: 'Ascended to the supreme Level 25 apex throne', color: 'from-amber-300 to-yellow-400' },
    ];

    function getLevelTargetXp(levelNum) {
      const lvl = Math.max(1, Math.min(25, Number(levelNum) || 1));
      const lvlObj = ALL_LEVELS.find(l => l.num === lvl);
      return lvlObj ? lvlObj.xp * 10 : 300;
    }

    // ==========================================
    // ==========================================
    // PROCEDURAL CROSS-MATH GENERATOR (+, −, ×, ÷)
    // Dynamic Difficulty Engine: Gradually scales complexity under EVERY level!
    // Every game (1 to 10-20) within each level gets progressively harder:
    // higher arithmetic range, more blank slots, mixed operators, and clever distractors.
    // ==========================================
    function getStageDifficultyProfile(levelNum, stageIndex = 0, totalStages = 10) {
      const lvl = Math.max(1, Math.min(25, Number(levelNum) || 1));
      const st = Math.max(0, Math.min(totalStages - 1, Number(stageIndex) || 0));
      const progress = totalStages > 1 ? st / (totalStages - 1) : 0;

      let tierName, badgeClass, mode, blankCount, trayCount, minVal, maxVal, minM, maxM, minD, maxD;

      if (lvl === 1) {
        if (progress < 0.35) {
          tierName = 'INTRO ✦';
          badgeClass = 'bg-cyan-900/60 border-cyan-400/50 text-cyan-200';
          mode = 'add';
          blankCount = 3;
          trayCount = 5; // 3 answers + 2 distractors (1 row)
          minVal = 1; maxVal = 6;
        } else if (progress < 0.70) {
          tierName = 'WARM-UP ⚡';
          badgeClass = 'bg-emerald-900/60 border-emerald-400/50 text-emerald-200';
          mode = (st % 2 === 0) ? 'add' : 'sub';
          blankCount = (st <= 5) ? 3 : 4;
          trayCount = 6; // 3-4 answers + distractors (1 row)
          minVal = 2; maxVal = 9;
        } else {
          tierName = 'LEVEL FINALE 🔥';
          badgeClass = 'bg-amber-900/60 border-amber-400/50 text-amber-200';
          mode = (st % 2 === 0) ? 'sub' : 'add';
          blankCount = 4;
          trayCount = 7; // 4 answers + 3 distractors (2 rows: 4+3)
          minVal = 3; maxVal = 14;
        }
      } else if (lvl <= 5) {
        if (progress < 0.35) {
          tierName = 'NOVICE ✦';
          badgeClass = 'bg-cyan-900/60 border-cyan-400/50 text-cyan-200';
          mode = (st % 2 === 0) ? 'add' : 'sub';
          blankCount = 4;
          trayCount = 6; // (1 row)
          minVal = 2; maxVal = 10;
        } else if (progress < 0.75) {
          tierName = 'TACTICAL ⚡';
          badgeClass = 'bg-emerald-900/60 border-emerald-400/50 text-emerald-200';
          mode = (st % 3 === 0) ? 'mul' : (st % 3 === 1) ? 'sub' : 'add';
          blankCount = (st % 2 === 0) ? 4 : 5;
          trayCount = 7; // (2 rows: 4+3)
          minVal = 3; maxVal = 16;
          minM = 2; maxM = 4;
        } else {
          tierName = 'SECTOR BOSS 🔥';
          badgeClass = 'bg-rose-900/60 border-rose-400/50 text-rose-200';
          mode = (st % 2 === 0) ? 'mul' : 'sub_both';
          blankCount = 5;
          trayCount = 8; // (2 rows: 4+4)
          minVal = 4; maxVal = 20;
          minM = 2; maxM = 5;
        }
      } else if (lvl <= 10) {
        if (progress < 0.30) {
          tierName = 'ADEPT ✦';
          badgeClass = 'bg-blue-900/60 border-blue-400/50 text-blue-200';
          mode = (st % 3 === 0) ? 'add' : (st % 3 === 1) ? 'sub' : 'mul';
          blankCount = (st % 2 === 0) ? 4 : 5;
          trayCount = 7; // (2 rows: 4+3)
          minVal = 4; maxVal = 18;
          minM = 2; maxM = 5;
        } else if (progress < 0.70) {
          tierName = 'OPERATOR ⚡';
          badgeClass = 'bg-indigo-900/60 border-indigo-400/50 text-indigo-200';
          mode = (st % 4 === 0) ? 'div' : (st % 4 === 1) ? 'mul' : (st % 4 === 2) ? 'sub_both' : 'add';
          blankCount = 5;
          trayCount = 8; // (2 rows: 4+4)
          minVal = 5; maxVal = 24;
          minM = 2; maxM = 6;
          minD = 2; maxD = 3;
        } else {
          tierName = 'MATRIX BOSS 🔥';
          badgeClass = 'bg-purple-900/60 border-purple-400/50 text-purple-200';
          mode = (st % 3 === 0) ? 'div' : (st % 3 === 1) ? 'mul_div' : 'mul';
          blankCount = 5;
          trayCount = 9; // (2 rows: 5+4)
          minVal = 6; maxVal = 30;
          minM = 3; maxM = 6;
          minD = 2; maxD = 4;
        }
      } else if (lvl <= 17) {
        if (progress < 0.30) {
          tierName = 'SPECIALIST ⚡';
          badgeClass = 'bg-indigo-900/60 border-indigo-400/50 text-indigo-200';
          mode = (st % 4 === 0) ? 'mul' : (st % 4 === 1) ? 'div' : (st % 4 === 2) ? 'sub' : 'add';
          blankCount = 5;
          trayCount = 8; // (2 rows: 4+4)
          minVal = 6; maxVal = 28;
          minM = 3; maxM = 6;
          minD = 2; maxD = 3;
        } else if (progress < 0.75) {
          tierName = 'VANGUARD 🔥';
          badgeClass = 'bg-amber-900/60 border-amber-400/50 text-amber-200';
          mode = (st % 4 === 0) ? 'mul_div' : (st % 4 === 1) ? 'div_mul' : (st % 4 === 2) ? 'div' : 'mul';
          blankCount = (st % 2 === 0) ? 5 : 6;
          trayCount = 9; // (2 rows: 5+4)
          minVal = 8; maxVal = 35;
          minM = 3; maxM = 7;
          minD = 2; maxD = 4;
        } else {
          tierName = 'TRIAL OVERLORD 💀';
          badgeClass = 'bg-rose-900/60 border-rose-400/50 text-rose-200';
          mode = (st % 3 === 0) ? 'mul_div' : (st % 3 === 1) ? 'div_mul' : 'div';
          blankCount = 6;
          trayCount = 10; // (2 rows: 5+5)
          minVal = 10; maxVal = 45;
          minM = 3; maxM = 8;
          minD = 2; maxD = 4;
        }
      } else {
        // Levels 18 - 25: Master / Apex World
        if (progress < 0.30) {
          tierName = 'MASTER ⚡';
          badgeClass = 'bg-purple-900/60 border-purple-400/50 text-purple-200';
          mode = (st % 4 === 0) ? 'mul' : (st % 4 === 1) ? 'div' : (st % 4 === 2) ? 'mul_div' : 'sub_both';
          blankCount = 5;
          trayCount = 9; // (2 rows: 5+4)
          minVal = 10; maxVal = 40;
          minM = 3; maxM = 7;
          minD = 2; maxD = 4;
        } else if (progress < 0.80) {
          tierName = 'GRANDMASTER 🔥';
          badgeClass = 'bg-rose-900/60 border-rose-400/50 text-rose-200';
          mode = (st % 4 === 0) ? 'mul_div' : (st % 4 === 1) ? 'div_mul' : (st % 4 === 2) ? 'div' : 'mul';
          blankCount = 6;
          trayCount = 10; // (2 rows: 5+5)
          minVal = 12; maxVal = 55;
          minM = 3; maxM = 8;
          minD = 2; maxD = 5;
        } else {
          tierName = 'APEX BOSS 👑';
          badgeClass = 'bg-red-950/80 border-red-500/80 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.5)]';
          mode = (st % 3 === 0) ? 'mul_div' : (st % 3 === 1) ? 'div_mul' : 'div';
          blankCount = 6;
          trayCount = (lvl === 25 && progress >= 0.90) ? 12 : 11; // (2 rows: 6+5 or 6+6)
          minVal = 15; maxVal = 70;
          minM = 4; maxM = 9;
          minD = 3; maxD = 5;
        }
      }

      return {
        tierName,
        badgeClass,
        mode,
        blankCount,
        trayCount,
        minVal,
        maxVal,
        minM: minM || 2,
        maxM: maxM || 5,
        minD: minD || 2,
        maxD: maxD || 3,
        progress
      };
    }

    function generateCrossMathPuzzle(levelNum, seed = 0, stageIndex = -1) {
      const totalStages = getStageCount(levelNum);
      const st = Math.max(0, Math.min(totalStages - 1, stageIndex >= 0 ? stageIndex : (seed >= 1000 ? Math.floor(seed / 1000) : 0)));
      const profile = getStageDifficultyProfile(levelNum, st, totalStages);

      let s = Math.abs((levelNum * 7919 + seed * 9973 + (st + 1) * 31337 + 12345)) % 233280;
      const rnd = (min, max) => {
        s = (s * 9301 + 49297) % 233280;
        const r = s / 233280;
        return Math.floor(min + r * (max - min + 1));
      };

      const mode = profile.mode;
      let X, Y, Z, A, B, C, D, E, F;
      let opH = '+', opV = '+';

      // Generate grid values, re-rolling if needed so there are enough distinct values for all blanks
      let valMap = {};
      let attempts = 0;
      while (attempts < 60) {
        attempts++;
        if (mode === 'mul') {
          opH = '×'; opV = '×';
          X = rnd(profile.minM, profile.maxM);
          Y = rnd(profile.minM, profile.maxM);
          A = rnd(profile.minM, profile.maxM);
          B = rnd(profile.minM, profile.maxM);
          Z = X * Y;
          C = A * B;
          D = X * A;
          E = Y * B;
          F = Z * C;
        } else if (mode === 'div') {
          opH = '÷'; opV = '÷';
          B = rnd(profile.minD, profile.maxD);
          C = rnd(profile.minD, profile.maxD);
          A = B * C;

          E = rnd(profile.minD, profile.maxD);
          F = rnd(profile.minD, profile.maxD);
          D = E * F;

          Z = C * F;
          Y = B * E;
          X = A * D;
        } else if (mode === 'mul_div') {
          opH = '×'; opV = '÷';
          A = rnd(profile.minD, profile.maxD);
          D = rnd(profile.minD, profile.maxD);
          X = A * D;

          B = rnd(profile.minD, profile.maxD);
          E = rnd(profile.minD, profile.maxD);
          Y = B * E;

          Z = X * Y;
          C = A * B;
          F = D * E;
        } else if (mode === 'div_mul') {
          opH = '÷'; opV = '×';
          Y = rnd(profile.minD, profile.maxD);
          Z = rnd(profile.minD, profile.maxD);
          X = Y * Z;

          B = rnd(profile.minD, profile.maxD);
          C = rnd(profile.minD, profile.maxD);
          A = B * C;

          D = X * A;
          E = Y * B;
          F = Z * C;
        } else if (mode === 'sub') {
          opH = '−'; opV = '+';
          Y = rnd(profile.minVal, profile.maxVal);
          Z = rnd(profile.minVal, profile.maxVal);
          X = Y + Z;

          B = rnd(profile.minVal, profile.maxVal);
          C = rnd(profile.minVal, profile.maxVal);
          A = B + C;

          D = X + A;
          E = Y + B;
          F = Z + C;
        } else if (mode === 'sub_both') {
          opH = '+'; opV = '−';
          A = rnd(profile.minVal, profile.maxVal);
          D = rnd(profile.minVal, profile.maxVal);
          X = A + D;

          B = rnd(profile.minVal, profile.maxVal);
          E = rnd(profile.minVal, profile.maxVal);
          Y = B + E;

          Z = X + Y;
          C = A + B;
          F = D + E;
        } else {
          opH = '+'; opV = '+';
          X = rnd(profile.minVal, profile.maxVal);
          Y = rnd(profile.minVal, profile.maxVal);
          A = rnd(profile.minVal, profile.maxVal);
          B = rnd(profile.minVal, profile.maxVal);
          Z = X + Y;
          C = A + B;
          D = X + A;
          E = Y + B;
          F = Z + C;
        }

        valMap = {
          '0,0': X, '0,2': Y, '0,4': Z,
          '2,0': A, '2,2': B, '2,4': C,
          '4,0': D, '4,2': E, '4,4': F
        };

        const distinctVals = new Set(Object.values(valMap));
        if (distinctVals.size >= profile.blankCount) {
          break;
        }
      }

      // Candidate positions for blanks, shuffled deterministically
      const allPos = ['0,0', '0,2', '0,4', '2,0', '2,2', '2,4', '4,0', '4,2', '4,4'];
      for (let i = allPos.length - 1; i > 0; i--) {
        const j = rnd(0, i);
        const temp = allPos[i];
        allPos[i] = allPos[j];
        allPos[j] = temp;
      }

      let blankKeys = [];
      const chosenValues = new Set();
      
      let preferredSets = [];
      if (profile.blankCount === 3) {
        preferredSets = [
          ['0,0', '2,2', '4,2'],
          ['0,2', '2,0', '4,0'],
          ['0,0', '2,4', '4,2'],
          ['0,2', '2,2', '4,4'],
          ['2,0', '2,2', '2,4']
        ];
      } else if (profile.blankCount === 4) {
        preferredSets = [
          ['0,0', '0,2', '2,2', '4,2'],
          ['0,2', '2,0', '2,4', '4,0'],
          ['0,0', '2,0', '2,2', '4,4']
        ];
      }

      // Check preferred sets first to see if any has 100% pairwise distinct answers
      for (const set of preferredSets) {
        const vals = set.map(k => valMap[k]);
        if (new Set(vals).size === set.length) {
          blankKeys = set;
          vals.forEach(v => chosenValues.add(v));
          break;
        }
      }

      // If no preferred set worked or blankCount > 4, greedily pick blanks with distinct values
      if (blankKeys.length < profile.blankCount) {
        blankKeys = [];
        chosenValues.clear();
        for (const pos of allPos) {
          const v = valMap[pos];
          if (!chosenValues.has(v)) {
            chosenValues.add(v);
            blankKeys.push(pos);
            if (blankKeys.length === profile.blankCount) break;
          }
        }
      }

      // Safety fallback ensuring blankKeys always matches target blankCount
      if (blankKeys.length < profile.blankCount) {
        for (const pos of allPos) {
          if (!blankKeys.includes(pos)) {
            blankKeys.push(pos);
            if (blankKeys.length === profile.blankCount) break;
          }
        }
      }

      const slots = [];
      const slotIndices = {};
      blankKeys.forEach((key, idx) => {
        const [r, c] = key.split(',').map(Number);
        slots.push({ slot: idx, row: r, column: c, answer: valMap[key] });
        slotIndices[key] = idx;
      });

      const getCell = (r, c) => {
        const key = `${r},${c}`;
        if (slotIndices[key] !== undefined) {
          return { slot: slotIndices[key] };
        }
        return String(valMap[key]);
      };

      const rows = [
        [getCell(0, 0), opH, getCell(0, 2), '=', getCell(0, 4)],
        [opV, null, opV, null, opV],
        [getCell(2, 0), opH, getCell(2, 2), '=', getCell(2, 4)],
        ['=', null, '=', null, '='],
        [getCell(4, 0), opH, getCell(4, 2), '=', getCell(4, 4)]
      ];

      const answers = slots.map(s => s.answer);
      const targetNumbersCount = profile.trayCount || (profile.blankCount <= 3 ? 5 : profile.blankCount === 4 ? 6 : profile.blankCount === 5 ? 7 : 8);

      // CRUCIAL: 100% of required answers are unconditionally included in numbersSet
      const numbersSet = new Set(answers);

      // Decoy distractors that are plausible and mathematically distinct
      const distractorCandidates = [
        Math.max(1, answers[0] + (rnd(0, 1) === 0 ? 1 : -1)),
        Math.max(1, (answers[1] || answers[0]) + (rnd(0, 1) === 0 ? 2 : -2)),
        Math.max(1, (answers[2] || answers[0]) + rnd(1, 4)),
        Math.max(1, (answers[0] || 5) + rnd(3, 7)),
        Math.max(1, (answers[answers.length - 1] || 5) + (rnd(0, 1) === 0 ? 3 : -3)),
        Math.max(1, (answers[1] || 4) + (rnd(0, 1) === 0 ? 4 : -4)),
        Math.max(1, (answers[2] || 6) + (rnd(0, 1) === 0 ? 5 : -5)),
        Math.max(1, (answers[0] || 7) + rnd(4, 9)),
        Math.max(1, (answers[answers.length - 1] || 8) + rnd(2, 6)),
        Math.max(1, Math.round((answers[0] + (answers[1] || answers[0])) / 2)),
        Math.max(1, answers[0] + 10),
        Math.max(1, (answers[answers.length - 1] || 10) + 10)
      ];

      for (const d of distractorCandidates) {
        if (numbersSet.size < targetNumbersCount && !numbersSet.has(d)) {
          numbersSet.add(d);
        }
      }

      let padAttempt = 0;
      let padCandidate = 1;
      while (numbersSet.size < targetNumbersCount && padAttempt < 150) {
        padAttempt++;
        const fallbackNum = rnd(1, Math.max(30, profile.maxVal * 2));
        if (!numbersSet.has(fallbackNum)) {
          numbersSet.add(fallbackNum);
        } else {
          while (numbersSet.has(padCandidate)) padCandidate++;
          numbersSet.add(padCandidate);
        }
      }

      const numbers = Array.from(numbersSet);
      // Fisher-Yates shuffle preserving ALL elements (zero slicing of required answers!)
      for (let i = numbers.length - 1; i > 0; i--) {
        const j = rnd(0, i);
        const temp = numbers[i];
        numbers[i] = numbers[j];
        numbers[j] = temp;
      }

      return {
        id: seed,
        cols: 5,
        level: levelNum,
        stage: st + 1,
        totalStages,
        stageDifficulty: profile.tierName,
        stageBadgeClass: profile.badgeClass,
        solvedText: `${X} ${opH} ${Y} = ${Z}`,
        hintStep: `Top row: ${X} ${opH} ${Y} = ${Z}`,
        slots,
        rows,
        numbers
      };
    }

    const puzzleCache = new Map();
    function getMemoizedPuzzle(levelNum, seed = 0, stageIndex = -1) {
      const sIdx = stageIndex >= 0 ? stageIndex : (seed >= 1000 ? Math.floor(seed / 1000) : 0);
      const key = `${levelNum}_${seed}_${sIdx}`;
      if (puzzleCache.has(key)) return puzzleCache.get(key);
      const result = generateCrossMathPuzzle(levelNum, seed, sIdx);
      if (puzzleCache.size > 300) {
        const firstKey = puzzleCache.keys().next().value;
        puzzleCache.delete(firstKey);
      }
      puzzleCache.set(key, result);
      return result;
    }

    const levelStageSeedsCache = new Map();
    function getStageSeedsForLevel(levelNum) {
      if (levelStageSeedsCache.has(levelNum)) return levelStageSeedsCache.get(levelNum);
      const total = getStageCount(levelNum);
      const seen = new Set();
      const seeds = [];
      for (let st = 0; st < total; st++) {
        let seed = st * 1000 + 101;
        let guard = 0;
        while (guard < 40) {
          const text = getMemoizedPuzzle(levelNum, seed, st).solvedText;
          if (!seen.has(text)) { seen.add(text); break; }
          seed += 1;
          guard += 1;
        }
        seeds.push(seed);
      }
      levelStageSeedsCache.set(levelNum, seeds);
      return seeds;
    }

    function evalDailyRow(rowConfig, x, y, z) {
      if (x === undefined || y === undefined || z === undefined || !rowConfig) return null;
      let intermediate = 0;
      if (rowConfig.op1 === '+') intermediate = x + y;
      else if (rowConfig.op1 === '−' || rowConfig.op1 === '-') intermediate = x - y;
      else if (rowConfig.op1 === '×' || rowConfig.op1 === '*') intermediate = x * y;
      else if (rowConfig.op1 === '÷' || rowConfig.op1 === '/') intermediate = Math.floor(x / y);

      let result = 0;
      if (rowConfig.op2 === '+') result = intermediate + z;
      else if (rowConfig.op2 === '−' || rowConfig.op2 === '-') result = intermediate - z;
      else if (rowConfig.op2 === '×' || rowConfig.op2 === '*') result = intermediate * z;
      else if (rowConfig.op2 === '÷' || rowConfig.op2 === '/') result = Math.floor(intermediate / z);

      return result;
    }

    function evalDailyCol(linkConfig, x, y, z) {
      if (x === undefined || y === undefined || z === undefined || !linkConfig) return null;
      let intermediate = 0;
      if (linkConfig.op1 === '+') intermediate = x + y;
      else if (linkConfig.op1 === '−' || linkConfig.op1 === '-') intermediate = x - y;
      else if (linkConfig.op1 === '×' || linkConfig.op1 === '*') intermediate = x * y;

      let result = 0;
      if (linkConfig.op2 === '+') result = intermediate + z;
      else if (linkConfig.op2 === '−' || linkConfig.op2 === '-') result = intermediate - z;
      else if (linkConfig.op2 === '×' || linkConfig.op2 === '*') result = intermediate * z;

      return result;
    }

    function generateDailyChallengePuzzle(year, month, day) {
      let seed = ((year * 10000 + month * 100 + day) * 2654435761) >>> 0;
      const rnd = (min, max) => {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        return min + (seed % (max - min + 1));
      };

      const availableRowTemplates = [
        { id: 'mul_add', op1: '×', op2: '+', eval: (x, y, z) => (x * y) + z },
        { id: 'add_mul', op1: '+', op2: '×', eval: (x, y, z) => (x + y) * z },
        { id: 'mul_sub', op1: '×', op2: '−', eval: (x, y, z) => (x * y) - z },
        { id: 'sub_mul', op1: '−', op2: '×', eval: (x, y, z) => (x - y) * z },
        { id: 'add_add', op1: '+', op2: '+', eval: (x, y, z) => (x + y) + z },
        { id: 'add_sub', op1: '+', op2: '−', eval: (x, y, z) => (x + y) - z }
      ];

      // Procedurally vary templates based on calendar date
      const idx1 = (day * 2 + month) % availableRowTemplates.length;
      const idx2 = (idx1 + 2) % availableRowTemplates.length;
      const idx3 = (idx1 + 4) % availableRowTemplates.length;

      const rowAlpha = availableRowTemplates[idx1];
      const rowBeta = availableRowTemplates[idx2];
      const rowGamma = availableRowTemplates[idx3];

      // Pick 9 unique numbers across all 3 rows
      const used = new Set();
      const pickUnique = (min, max) => {
        for (let attempt = 0; attempt < 80; attempt++) {
          const val = rnd(min, max);
          if (!used.has(val)) {
            used.add(val);
            return val;
          }
        }
        for (let v = min; v <= 40; v++) {
          if (!used.has(v)) {
            used.add(v);
            return v;
          }
        }
        let fallback = 1;
        while (used.has(fallback)) fallback++;
        used.add(fallback);
        return fallback;
      };

      const genTriplet = (tmpl) => {
        let x, y, z;
        if (tmpl.id === 'mul_add') {
          x = pickUnique(2, 9);
          y = pickUnique(2, 8);
          z = pickUnique(1, 14);
        } else if (tmpl.id === 'add_mul') {
          x = pickUnique(2, 8);
          y = pickUnique(2, 7);
          z = pickUnique(2, 6);
        } else if (tmpl.id === 'mul_sub') {
          x = pickUnique(3, 9);
          y = pickUnique(3, 8);
          z = pickUnique(1, Math.min(12, Math.max(2, (x * y) - 3)));
        } else if (tmpl.id === 'sub_mul') {
          x = pickUnique(5, 14);
          y = pickUnique(1, Math.max(2, x - 2));
          if (x < y) { const tmp = x; x = y; y = tmp; }
          z = pickUnique(2, 6);
        } else if (tmpl.id === 'add_add') {
          x = pickUnique(3, 14);
          y = pickUnique(2, 12);
          z = pickUnique(2, 11);
        } else {
          x = pickUnique(4, 14);
          y = pickUnique(3, 12);
          z = pickUnique(1, Math.min(10, Math.max(2, (x + y) - 3)));
        }
        return [x, y, z];
      };

      const [A, B, C] = genTriplet(rowAlpha);
      const [D, E, F] = genTriplet(rowBeta);
      const [G, H, I] = genTriplet(rowGamma);

      const targetAlpha = rowAlpha.eval(A, B, C);
      const targetBeta = rowBeta.eval(D, E, F);
      const targetGamma = rowGamma.eval(G, H, I);

      // Connected resonance column: B, E, H (middle column)
      let linkTemplates = [];
      if (B + E > H) linkTemplates.push({ op1: '+', op2: '−', eval: (b, e, h) => b + e - h });
      if (B > E) linkTemplates.push({ op1: '−', op2: '+', eval: (b, e, h) => b - e + h });
      linkTemplates.push({ op1: '+', op2: '+', eval: (b, e, h) => b + e + h });
      if (B * E > H && B * E <= 35) linkTemplates.push({ op1: '×', op2: '−', eval: (b, e, h) => b * e - h });
      if (B * E + H <= 45) linkTemplates.push({ op1: '×', op2: '+', eval: (b, e, h) => b * e + h });

      const colLink = linkTemplates[(day * 3 + month) % linkTemplates.length];
      const targetLink = colLink.eval(B, E, H);

      // 9 interactive receptor slots across 3 rows
      const answers = { 0: A, 1: B, 2: C, 3: D, 4: E, 5: F, 6: G, 7: H, 8: I };

      // Distractors for the number tray (plausible mathematical decoys)
      const distractors = [
        A + rnd(1, 3),
        Math.max(1, D + (rnd(0, 1) ? 2 : -2)),
        Math.max(1, G + (rnd(0, 1) ? 1 : -1)),
        Math.max(1, B + (rnd(0, 1) ? 3 : -3)),
        Math.max(1, E + rnd(2, 5)),
        Math.max(1, H + (rnd(0, 1) ? 2 : -2))
      ];

      // Gradual tray scaling by calendar day (10 to 14 options across 2 balanced rows)
      let targetDailyTrayCount = 10; // Days 1-6: 10 options (5 + 5 in 2 rows)
      if (day >= 28) {
        targetDailyTrayCount = 14; // Days 28-31 (Apex Finale): 14 options (7 + 7 in 2 rows)
      } else if (day >= 21) {
        targetDailyTrayCount = 13; // Days 21-27: 13 options (7 + 6 in 2 rows)
      } else if (day >= 14) {
        targetDailyTrayCount = 12; // Days 14-20: 12 options (6 + 6 in 2 rows)
      } else if (day >= 7) {
        targetDailyTrayCount = 11; // Days 7-13: 11 options (6 + 5 in 2 rows)
      }

      // Guarantee all 9 answers are present + pad to targetDailyTrayCount unique numbers for balanced 2-row layout
      const traySet = new Set([A, B, C, D, E, F, G, H, I]);
      for (const d of distractors) {
        if (traySet.size < targetDailyTrayCount && !traySet.has(d)) {
          traySet.add(d);
        }
      }
      let fallbackSeed = 1;
      let padGuard = 0;
      while (traySet.size < targetDailyTrayCount && padGuard < 150) {
        padGuard++;
        const candidate = rnd(1, 45);
        if (!traySet.has(candidate)) {
          traySet.add(candidate);
        } else {
          while (traySet.has(fallbackSeed)) fallbackSeed++;
          traySet.add(fallbackSeed);
        }
      }
      const trayNumbers = Array.from(traySet).sort((x, y) => x - y);

      return {
        year,
        month,
        day,
        protocolId: 274 + day,
        difficulty: 'TACTICAL ⚡',
        rowAlpha,
        rowBeta,
        rowGamma,
        colLink,
        targetAlpha,
        targetBeta,
        targetGamma,
        targetLink,
        answers,
        trayNumbers
      };
    }

    // ==========================================
    // MASTER APP COMPONENT
    // ==========================================
    function App() {
      // Current active screen (1 to 18)
      // 'splash' | 'onboarding' | 'home' | 'categories' | 'levels' | 'game' | 'hint' | 'correct' | 'wrong'
      // 'daily' | 'stats' | 'achievements' | 'leaderboard' | 'history' | 'profile' | 'settings' | 'help' | 'offline'
      const initialScreen = (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('screen')) || 'home';
      const [currentScreen, setCurrentScreen] = useState(initialScreen);
      const [transitionDirection, setTransitionDirection] = useState('forward');
      const navigationStackRef = useRef([initialScreen]);
      const [showScreenPicker, setShowScreenPicker] = useState(false);

      // Google AdMob State Management & Dual Native/Web Fallback
      const [adMobState, setAdMobState] = useState(() => adMobService.getState());
      useEffect(() => {
        adMobService.initialize();
        const unsub = adMobService.subscribe(setAdMobState);
        return () => unsub();
      }, []);

      // Google Play In-App Purchase (IAP) & Billing Management
      const [purchaseState, setPurchaseState] = useState(() => purchaseService.getState());
      useEffect(() => {
        purchaseService.initialize();
        const unsub = purchaseService.subscribe(setPurchaseState);
        return () => unsub();
      }, []);

      // Sliding-tile loader: appears only when a page takes noticeably long to load
      const isPageLoading = useSmartPageLoader(currentScreen);
      useEffect(() => { prefetchAssetsWhenIdle(); }, []);

      // Gameplay State & Level Progression (Loaded from URL or LocalStorage)
      const queryParamLevel = (typeof window !== 'undefined' && parseInt(new URLSearchParams(window.location.search).get('level') || '', 10)) || null;

      // Ensure new users start fresh from Level 1, migrating any old legacy dummy defaults (Level 3 with 112 XP)
      (() => {
        try {
          if (typeof localStorage !== 'undefined') {
            const hasStartedV2 = GameStorage.getItem('newromath_started_v2');
            if (!hasStartedV2) {
              GameStorage.setItem('newromath_started_v2', 'true');
              const oldUnlocked = GameStorage.getItem('newromath_unlocked_level');
              const oldXp = GameStorage.getItem('newromath_player_xp');
              // If device has the old hardcoded dummy default of 3 with 112 XP, reset to fresh Level 1
              if (oldUnlocked === '3' && (oldXp === '112' || !oldXp)) {
                GameStorage.removeItem('newromath_unlocked_level');
                GameStorage.removeItem('newromath_player_level');
                GameStorage.removeItem('newromath_selected_level');
                GameStorage.removeItem('newromath_player_xp');
              }
            }
          }
        } catch (e) {}
      })();

      const [unlockedLevelMax, setUnlockedLevelMax] = useState(() => {
        if (queryParamLevel && !isNaN(queryParamLevel)) return Math.max(1, queryParamLevel);
        try {
          const saved = GameStorage.getItem('newromath_unlocked_level');
          return saved ? Math.max(1, parseInt(saved, 10)) : 1;
        } catch (e) {
          return 1;
        }
      });

      // Player Global State: New players start at Level 1 with 0 XP
      const [playerLevel, setPlayerLevel] = useState(() => {
        if (queryParamLevel && !isNaN(queryParamLevel)) return Math.max(1, queryParamLevel);
        try {
          const saved = GameStorage.getItem('newromath_player_level');
          if (saved) return Math.max(1, parseInt(saved, 10));
          const savedUnlocked = GameStorage.getItem('newromath_unlocked_level');
          return savedUnlocked ? Math.max(1, parseInt(savedUnlocked, 10)) : 1;
        } catch (e) {
          return 1;
        }
      });
      const [playerXp, setPlayerXp] = useState(() => {
        try {
          const saved = GameStorage.getItem('newromath_player_xp');
          return saved ? Math.max(0, parseInt(saved, 10)) : 0;
        } catch (e) {
          return 0;
        }
      });
      const [xpNeeded, setXpNeeded] = useState(300);
      const [coins, setCoins] = useState(() => {
        try {
          const saved = GameStorage.getItem('newromath_coins');
          return saved ? Math.max(0, parseInt(saved, 10)) : 2450;
        } catch (e) {
          return 2450;
        }
      });
      const [gems, setGems] = useState(() => {
        try {
          const saved = GameStorage.getItem('newromath_gems');
          return saved ? Math.max(0, parseInt(saved, 10)) : 25;
        } catch (e) {
          return 25;
        }
      });
      const [selectedLevelNum, setSelectedLevelNum] = useState(() => {
        if (queryParamLevel && !isNaN(queryParamLevel)) return Math.max(1, queryParamLevel);
        try {
          const saved = GameStorage.getItem('newromath_selected_level');
          if (saved) return Math.max(1, parseInt(saved, 10));
          const savedUnlocked = GameStorage.getItem('newromath_unlocked_level');
          return savedUnlocked ? Math.max(1, parseInt(savedUnlocked, 10)) : 1;
        } catch (e) {
          return 1;
        }
      });

      // 3D Level Gaming Awards & Profile Avatar State
      const [equippedAvatar, setEquippedAvatar] = useState(() => {
        try {
          const saved = GameStorage.getItem('newromath_player_avatar');
          if (saved) return saved;
        } catch (e) {}
        try {
          const savedUnlocked = parseInt(GameStorage.getItem('newromath_unlocked_level') || '1', 10);
          if (savedUnlocked > 1) {
            const highestSolvedIndex = Math.min(savedUnlocked - 2, 24);
            if (LEVEL_AWARDS[highestSolvedIndex]) {
              return LEVEL_AWARDS[highestSolvedIndex].icon;
            }
          }
        } catch (e) {}
        return '/assets/icon_robot_3d.webp';
      });

      const [awardFilter, setAwardFilter] = useState('all'); // 'all' | 'unlocked' | 'locked'

      useEffect(() => {
        try {
          if (equippedAvatar) {
            GameStorage.setItem('newromath_player_avatar', equippedAvatar);
          }
        } catch (e) {}
      }, [equippedAvatar]);

      // Dynamic Calendar & Daily Challenge System
      const calendarDate = useMemo(() => new Date(), []);
      const currentCalendarYear = calendarDate.getFullYear();
      const currentCalendarMonth = calendarDate.getMonth(); // 0-indexed
      const currentSeasonNum = currentCalendarMonth + 1; // 1-12
      const currentMonthName = useMemo(() => calendarDate.toLocaleString('en-US', { month: 'long' }), [calendarDate]);
      const currentMonthShort = useMemo(() => calendarDate.toLocaleString('en-US', { month: 'short' }), [calendarDate]);
      const daysInCurrentMonth = useMemo(() => new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate(), [currentCalendarYear, currentCalendarMonth]);
      const firstDayOfWeek = useMemo(() => new Date(currentCalendarYear, currentCalendarMonth, 1).getDay(), [currentCalendarYear, currentCalendarMonth]);
      const todayCalendarDay = calendarDate.getDate();

      // Persistent Completed Daily Challenge Days for Current Season
      const [completedDailyDays, setCompletedDailyDays] = useState(() => {
        try {
          const key = `newromath_daily_completed_${currentCalendarYear}_${currentSeasonNum}`;
          const saved = GameStorage.getItem(key);
          if (saved) return JSON.parse(saved);
          const initial = [];
          for (let i = 1; i < todayCalendarDay; i++) {
            initial.push(i);
          }
          return initial;
        } catch (e) {
          return [1, 2, 3, 4, 5, 6, 7, 8];
        }
      });

      useEffect(() => {
        try {
          const key = `newromath_daily_completed_${currentCalendarYear}_${currentSeasonNum}`;
          GameStorage.setItem(key, JSON.stringify(completedDailyDays));
        } catch (e) {}
      }, [completedDailyDays, currentCalendarYear, currentSeasonNum]);

      // Real-time Streak Calculation (Active Streak & Best Monthly Streak)
      const streakDays = useMemo(() => {
        let count = 0;
        let check = completedDailyDays.includes(todayCalendarDay) ? todayCalendarDay : todayCalendarDay - 1;
        while (check >= 1 && completedDailyDays.includes(check)) {
          count++;
          check--;
        }
        return count;
      }, [completedDailyDays, todayCalendarDay]);

      const bestStreakDays = useMemo(() => {
        let maxS = 0;
        let cur = 0;
        for (let d = 1; d <= daysInCurrentMonth; d++) {
          if (completedDailyDays.includes(d)) {
            cur++;
            if (cur > maxS) maxS = cur;
          } else {
            cur = 0;
          }
        }
        return maxS;
      }, [completedDailyDays, daysInCurrentMonth]);

      const [lives, setLives] = useState(3);
      const [selectedCategory, setSelectedCategory] = useState('all');

      // Sync state variables to LocalStorage automatically
      useEffect(() => {
        try { GameStorage.setItem('newromath_unlocked_level', unlockedLevelMax.toString()); } catch (e) {}
      }, [unlockedLevelMax]);

      useEffect(() => {
        try { GameStorage.setItem('newromath_player_level', playerLevel.toString()); } catch (e) {}
      }, [playerLevel]);

      useEffect(() => {
        try { GameStorage.setItem('newromath_player_xp', playerXp.toString()); } catch (e) {}
      }, [playerXp]);

      useEffect(() => {
        try { GameStorage.setItem('newromath_coins', coins.toString()); } catch (e) {}
      }, [coins]);

      useEffect(() => {
        try { GameStorage.setItem('newromath_gems', gems.toString()); } catch (e) {}
      }, [gems]);

      useEffect(() => {
        try { GameStorage.setItem('newromath_selected_level', selectedLevelNum.toString()); } catch (e) {}
      }, [selectedLevelNum]);

      // Active player level dynamically reflects the campaign unlocked level
      const activePlayerLevel = Math.min(25, Math.max(1, unlockedLevelMax));
      const completedLevelsCount = Math.min(25, Math.max(0, unlockedLevelMax - 1));
      const dueLevelsCount = Math.max(0, 25 - completedLevelsCount);
      const campaignProgressPct = Math.min(100, Math.round((completedLevelsCount / 25) * 100));
      const todayFormattedDate = useMemo(() => {
        return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }, []);

      // Live real-time clock for Continue card
      const [currentRealTime, setCurrentRealTime] = useState(() => {
        return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      });

      useEffect(() => {
        const updateTime = () => {
          setCurrentRealTime(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
        };
        const timerId = setInterval(updateTime, 1000);
        return () => clearInterval(timerId);
      }, []);

      // Dynamic Level XP Target and Current Level Progress in Real-Time
      const activeLevelTargetXp = useMemo(() => {
        return getLevelTargetXp(activePlayerLevel);
      }, [activePlayerLevel]);

      const activeLevelCurrentXp = useMemo(() => {
        return Math.min(activeLevelTargetXp, Math.max(0, playerXp % activeLevelTargetXp));
      }, [playerXp, activeLevelTargetXp]);

      // Live leaderboard score & rank (reacts to level, XP and coin balance)
      const LEADERBOARD_BOT_SCORES = [2490680, 2385400, 2290150, 2250680, 2187730, 2128024, 2097730, 2053538];
      const playerScore = 1200000 + activePlayerLevel * 28000 + playerXp * 300 + coins * 35;
      const playerRank = 1 + LEADERBOARD_BOT_SCORES.filter(s => s > playerScore).length;

      // Rewards & Ad State
      const [adModalOpen, setAdModalOpen] = useState(false);
      const [adReward, setAdReward] = useState({ type: 'coins', amount: 250, title: 'Math Speed Boost Sponsor Ad', coinAmount: 250, gemAmount: 15, onComplete: null });
      const [adCountdown, setAdCountdown] = useState(3);
      const todayCrateKey = `${currentCalendarYear}-${currentSeasonNum}-${todayCalendarDay}`;
      const [dailyGiftClaimed, setDailyGiftClaimed] = useState(() => {
        try {
          return GameStorage.getItem('newromath_daily_crate_last_claimed') === todayCrateKey;
        } catch (e) {
          return false;
        }
      });
      const [rewardToast, setRewardToast] = useState(null);
      const triggerRewardToast = (msg) => {
        setRewardToast(msg);
      };

      // Level Entry Fee & Economy Modal States
      const [insufficientFundsModal, setInsufficientFundsModal] = useState({
        isOpen: false,
        targetLvl: 1,
        cost: { coins: 100, gems: 10 },
        missingCoins: 0,
        missingGems: 0
      });
      const [dailyAdPromptModal, setDailyAdPromptModal] = useState({
        isOpen: false,
        targetDay: 1,
        fee: 50,
        reason: 'missed_day'
      });
      const [isTimeOver, setIsTimeOver] = useState(false);
      const [isWrongModalOpen, setIsWrongModalOpen] = useState(false);
      const [isCorrectModalOpen, setIsCorrectModalOpen] = useState(false);

      // Multi-puzzle level progress: which puzzle (stage) of the level the player is on
      const [stageNum, setStageNum] = useState(1);
      const [lastResult, setLastResult] = useState({
        level: 1, stage: 1, total: 10, levelCleared: false,
        solvedText: '', coins: 0, gems: 0, xp: 0
      });
      const stageTotal = getStageCount(selectedLevelNum);

      useEffect(() => {
        if (rewardToast) {
          const timer = setTimeout(() => setRewardToast(null), 3200);
          return () => clearTimeout(timer);
        }
      }, [rewardToast]);

      useEffect(() => {
        let timer;
        if (adModalOpen && adCountdown > 0) {
          timer = setInterval(() => {
            setAdCountdown(c => (c > 1 ? c - 1 : 0));
          }, 1000);
        }
        return () => clearInterval(timer);
      }, [adModalOpen, adCountdown]);

      // Global Ad Watch & Reward System (Powered by Google AdMob Rewarded Video)
      const handleWatchAd = (type, amount, title, extra = {}) => {
        sound.click();
        const payload = {
          type,
          amount,
          title: title || 'Quantum Sponsor Booster',
          coinAmount: extra.coinAmount || (type === 'coins' ? amount : 350),
          gemAmount: extra.gemAmount || (type === 'gems' ? amount : 15),
          onComplete: extra.onComplete || null
        };
        setAdReward(payload);

        if (adMobState.isNative) {
          // Native Android: invoke Google AdMob Rewarded Video Ad directly
          adMobService.showRewarded(() => {
            handleClaimAdReward(payload);
          });
        } else {
          // Web / Browser Preview: show interactive AdMob Rewarded Video demo modal
          setAdModalOpen(true);
        }
      };

      const handleClaimAdReward = (overrideReward = null) => {
        const reward = overrideReward || adReward;
        sound.correct();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        if (reward.type === 'coins') {
          const val = reward.amount || reward.coinAmount || 250;
          setCoins(c => {
            const next = c + val;
            try { GameStorage.setItem('newromath_coins', next.toString()); } catch (e) {}
            return next;
          });
          setRewardToast(`🎉 Ad Reward: +${val.toLocaleString()} Coins Collected!`);
        } else if (reward.type === 'gems') {
          const val = reward.amount || reward.gemAmount || 15;
          setGems(g => {
            const next = g + val;
            try { GameStorage.setItem('newromath_gems', next.toString()); } catch (e) {}
            return next;
          });
          setRewardToast(`💎 Ad Reward: +${val.toLocaleString()} Gems Collected!`);
        } else if (reward.type === 'time') {
          const extraSec = reward.amount || 30;
          setGameTimer(t => t + extraSec);
          setIsTimeOver(false);
          setRewardToast(`⏱️ Extra Time: +${extraSec}s Added! Mission Resumed!`);
        } else {
          // 'both' / supply drop / jackpot
          const cAmt = reward.coinAmount || (reward.type === 'jackpot' ? 600 : 350);
          const gAmt = reward.gemAmount || (reward.type === 'jackpot' ? 20 : 15);
          setCoins(c => {
            const next = c + cAmt;
            try { GameStorage.setItem('newromath_coins', next.toString()); } catch (e) {}
            return next;
          });
          setGems(g => {
            const next = g + gAmt;
            try { GameStorage.setItem('newromath_gems', next.toString()); } catch (e) {}
            return next;
          });
          setRewardToast(`🎉 Ad Reward: +${cAmt} 🪙 & +${gAmt} 💎 Added!`);
        }
        setAdModalOpen(false);
        if (reward.onComplete) {
          reward.onComplete();
        }
      };

      const [levelFilterTab, setLevelFilterTab] = useState('all'); // 'all' | 'easy' | 'medium' | 'hard'
      const [profileMode, setProfileMode] = useState('Classic');
      const [profileDifficulty, setProfileDifficulty] = useState('Easy');
      const [playerName, setPlayerName] = useState(() => {
        try {
          return GameStorage.getItem('newromath_player_name') || 'Guest-JFNZLZ';
        } catch (e) {
          return 'Guest-JFNZLZ';
        }
      });
      const [playerCountry, setPlayerCountry] = useState(() => {
        try {
          return GameStorage.getItem('newromath_player_country') || 'United States';
        } catch (e) {
          return 'United States';
        }
      });
      const [playerPhone, setPlayerPhone] = useState(() => {
        try {
          return GameStorage.getItem('newromath_player_phone') || '';
        } catch (e) {
          return '';
        }
      });
      const [playerEmail, setPlayerEmail] = useState(() => {
        try {
          return GameStorage.getItem('newromath_player_email') || '';
        } catch (e) {
          return '';
        }
      });
      const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
      const [profileFormName, setProfileFormName] = useState(() => playerName);
      const [profileFormCountry, setProfileFormCountry] = useState(() => playerCountry);
      const [profileFormPhone, setProfileFormPhone] = useState(() => playerPhone);
      const [profileFormEmail, setProfileFormEmail] = useState(() => playerEmail);

      const handleOpenProfileModal = () => {
        sound.click();
        setProfileFormName(playerName);
        setProfileFormCountry(playerCountry || 'United States');
        setProfileFormPhone(playerPhone || '');
        setProfileFormEmail(playerEmail || '');
        setIsProfileModalOpen(true);
      };

      const handleSaveProfileModal = (e) => {
        if (e) e.preventDefault();
        sound.celebrate();
        const trimmedName = profileFormName.trim() || 'Guest-JFNZLZ';
        const trimmedCountry = profileFormCountry || 'United States';
        const trimmedPhone = profileFormPhone.trim();
        const trimmedEmail = profileFormEmail.trim();

        setPlayerName(trimmedName);
        setPlayerCountry(trimmedCountry);
        setPlayerPhone(trimmedPhone);
        setPlayerEmail(trimmedEmail);

        try {
          GameStorage.setItem('newromath_player_name', trimmedName);
          GameStorage.setItem('newromath_player_country', trimmedCountry);
          GameStorage.setItem('newromath_player_phone', trimmedPhone);
          GameStorage.setItem('newromath_player_email', trimmedEmail);
        } catch (err) {}

        confetti({ particleCount: 35, spread: 60 });
        setRewardToast('🎉 Player profile updated successfully!');
        setIsProfileModalOpen(false);
      };
      const gameTimerRef = useRef(45);
      const timerContainerRef = useRef(null);
      const timerDisplayRef = useRef(null);
      const gameTimer = gameTimerRef.current;
      const [puzzleAnswers, setPuzzleAnswers] = useState({});
      const puzzleAnswersRef = useRef({});
      const [puzzleHistory, setPuzzleHistory] = useState([]);
      const [selectedPuzzleSlot, setSelectedPuzzleSlot] = useState(null);

      // Flying number animation state (Object Pooled)
      const [flyingPool, setFlyingPool] = useState(INITIAL_FLYING_POOL);
      const spawnFlyingTile = useCallback((tileData) => {
        setFlyingPool(prevPool => {
          let slotIdx = prevPool.findIndex(s => !s.active);
          if (slotIdx === -1) slotIdx = 0;
          const nextPool = [...prevPool];
          nextPool[slotIdx] = {
            ...nextPool[slotIdx],
            ...tileData,
            active: true,
            flightSeq: (nextPool[slotIdx].flightSeq || 0) + 1
          };
          return nextPool;
        });
      }, []);

      const recycleFlyingTile = useCallback((slotId) => {
        setFlyingPool(prevPool => {
          if (!prevPool[slotId]?.active) return prevPool;
          const nextPool = [...prevPool];
          nextPool[slotId] = {
            ...nextPool[slotId],
            active: false
          };
          return nextPool;
        });
      }, []);

      const resetFlyingPool = useCallback(() => {
        setFlyingPool(INITIAL_FLYING_POOL);
      }, []);
      const [impactSlot, setImpactSlot] = useState(null);
      const pendingNumbersRef = useRef(new Set());
      const pendingSlotsRef = useRef(new Set());
      const [pendingNumbers, setPendingNumbers] = useState(new Set());
      const [pendingSlots, setPendingSlots] = useState(new Set());
      const slotRefs = useRef({});
      const trayRefs = useRef({});
      const gameContainerRef = useRef(null);
      const [hintActiveStep, setHintActiveStep] = useState(0);
      const [isGamePaused, setIsGamePaused] = useState(false);
      const [showGamePreferences, setShowGamePreferences] = useState(false);
      const [isDarkMode, setIsDarkMode] = useState(false);
      const [soundEnabled, setSoundEnabled] = useState(true);
      const [hapticsEnabled, setHapticsEnabled] = useState(true);
      const [notificationsEnabled, setNotificationsEnabled] = useState(true);
      const [timerEnabled, setTimerEnabled] = useState(true);
      const [explanationEnabled, setExplanationEnabled] = useState(true);
      const [autoSubmitEnabled, setAutoSubmitEnabled] = useState(false);
      const [largeFontEnabled, setLargeFontEnabled] = useState(true);
      const [divisionSymbol, setDivisionSymbol] = useState('÷');

      // Help & Support Interactive State
      const [helpTab, setHelpTab] = useState('all');
      const [openFaqIndex, setOpenFaqIndex] = useState(0);
      const [feedbackCategory, setFeedbackCategory] = useState('Bug Report');
      const [feedbackEmail, setFeedbackEmail] = useState('');
      const [feedbackText, setFeedbackText] = useState('');
      const [feedbackSent, setFeedbackSent] = useState(false);
      const [feedbackTicketId, setFeedbackTicketId] = useState('');
      const [copiedSupportEmail, setCopiedSupportEmail] = useState(false);

      // Daily Challenge State & Trophy Modal
      const [activeDailyDay, setActiveDailyDay] = useState(todayCalendarDay);
      const [showTrophyModal, setShowTrophyModal] = useState(false);

      // Dedicated Daily Challenge Game State (Completely separated from campaign)
      const [dailyGameDay, setDailyGameDay] = useState(todayCalendarDay);
      const [dailyGamePuzzle, setDailyGamePuzzle] = useState(() => generateDailyChallengePuzzle(currentCalendarYear, currentSeasonNum, todayCalendarDay));
      const [dailyGameAnswers, setDailyGameAnswers] = useState({});
      const [dailyGameHistory, setDailyGameHistory] = useState([]);
      const [dailyGameSelectedSlot, setDailyGameSelectedSlot] = useState(0);
      const [dailyGameTimer, setDailyGameTimer] = useState(90);
      const [dailyGameLives, setDailyGameLives] = useState(3);
      const [isDailyGamePaused, setIsDailyGamePaused] = useState(false);
      const [dailyGameVictoryModal, setDailyGameVictoryModal] = useState(false);
      const [dailyGameDefeatModal, setDailyGameDefeatModal] = useState(false);
      const [dailyGameTimeOver, setDailyGameTimeOver] = useState(false);
      const [dailyHintUsed, setDailyHintUsed] = useState(0);
      const [showDailyInstructionsModal, setShowDailyInstructionsModal] = useState(false);
      const [showMainInstructionsModal, setShowMainInstructionsModal] = useState(false);

      const startDailyChallenge = (dayNum = activeDailyDay) => {
        sound.click();
        const puzzle = generateDailyChallengePuzzle(currentCalendarYear, currentSeasonNum, dayNum);
        setDailyGameDay(dayNum);
        setDailyGamePuzzle(puzzle);
        setDailyGameAnswers({});
        setDailyGameHistory([]);
        setDailyGameSelectedSlot(0);
        setDailyGameTimer(90);
        setDailyGameLives(3);
        setIsDailyGamePaused(false);
        setDailyGameVictoryModal(false);
        setDailyGameDefeatModal(false);
        setDailyGameTimeOver(false);
        setShowDailyInstructionsModal(false);
        setDailyHintUsed(0);
        navigateTo('daily_game');
      };

      // Leaderboard Tab
      const [leaderboardTab, setLeaderboardTab] = useState('global');

      // History Tab and Puzzle Archives
      const [historyTab, setHistoryTab] = useState('history');

      // Persistent Puzzle Records for History
      const [puzzleRecords, setPuzzleRecords] = useState(() => {
        try {
          const stored = GameStorage.getItem('newromath_puzzle_records');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
          }
        } catch (e) {}
        return [
          { id: 'rec-1', eq: '(12 + 8) × 2 - 6 = 34', time: 'Today', level: 3, mode: 'Main Game', solved: true, xp: 45, date: Date.now() - 3600000 },
          { id: 'rec-2', eq: '(15 - 7) × 3 = 24', time: 'Today', level: 2, mode: 'Main Game', solved: true, xp: 35, date: Date.now() - 7200000 },
          { id: 'rec-3', eq: '8 + 6 ÷ 2 = 11', time: 'Yesterday', level: 1, mode: 'Main Game', solved: true, xp: 25, date: Date.now() - 86400000 },
          { id: 'rec-4', eq: '(9 × 4) ÷ 2 = 38', time: 'Yesterday', level: 3, mode: 'Daily Matrix', solved: true, xp: 50, date: Date.now() - 90000000 },
          { id: 'rec-5', eq: '(14 - 7) × 2 = 14', time: 'Dec 12', level: 2, mode: 'Main Game', solved: false, xp: 0, date: Date.now() - 172800000 },
          { id: 'rec-6', eq: '12 + 3 ÷ 5 = 9', time: 'Dec 11', level: 1, mode: 'Daily Matrix', solved: false, xp: 0, date: Date.now() - 259200000 },
        ];
      });

      // Persistent Saved / Bookmarked Puzzle Formula IDs
      const [savedPuzzleIds, setSavedPuzzleIds] = useState(() => {
        try {
          const stored = GameStorage.getItem('newromath_saved_puzzles');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
          }
        } catch (e) {}
        return ['rec-1', 'rec-2'];
      });

      const toggleSavePuzzle = (id) => {
        sound.click();
        setSavedPuzzleIds(prev => {
          const exists = prev.includes(id);
          const next = exists ? prev.filter(x => x !== id) : [...prev, id];
          try { GameStorage.setItem('newromath_saved_puzzles', JSON.stringify(next)); } catch (e) {}
          if (!exists) {
            setRewardToast('🔖 Formula pinned to your Saved Archives!');
          } else {
            setRewardToast('Formula unpinned from Saved');
          }
          return next;
        });
      };

      const handleClearHistory = () => {
        sound.click();
        setPuzzleRecords([]);
        try { GameStorage.setItem('newromath_puzzle_records', JSON.stringify([])); } catch (e) {}
        setRewardToast('🧹 History records cleared');
      };

      // Statistics Tab
      const [statsTab, setStatsTab] = useState('overview');

      // Timer effect in gameplay with Modern Cyber Timeout Trigger
      useEffect(() => {
        let interval = null;
        if (currentScreen === 'game' && !isGamePaused && !isTimeOver) {
          interval = setInterval(() => {
            setGameTimer(gameTimerRef.current - 1);
            if (gameTimerRef.current === 0) {
              setIsTimeOver(true);
              sound.wrong();
            }
          }, 1000);
        }
        return () => clearInterval(interval);
      }, [currentScreen, isGamePaused, isTimeOver]);

      // Timer effect for Daily Challenge (Quantum Countdown with Timeout Trigger)
      useEffect(() => {
        let interval = null;
        if (currentScreen === 'daily_game' && !isDailyGamePaused && !showDailyInstructionsModal && dailyGameTimer > 0 && !dailyGameVictoryModal && !dailyGameDefeatModal && !dailyGameTimeOver) {
          interval = setInterval(() => {
            setDailyGameTimer(prev => {
              if (prev <= 1) {
                sound.wrong();
                setDailyGameTimeOver(true);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
        return () => clearInterval(interval);
      }, [currentScreen, isDailyGamePaused, showDailyInstructionsModal, dailyGameTimer, dailyGameVictoryModal, dailyGameDefeatModal, dailyGameTimeOver]);

      // Level Entry Fee verification and launch flow
      const attemptStartLevel = (targetLvl = selectedLevelNum, bypassFee = false) => {
        const cost = getLevelEntryCost(targetLvl);
        if (bypassFee) {
          startNewPuzzle(targetLvl);
          return;
        }

        if (coins >= cost.coins && gems >= cost.gems) {
          // Deduct entry fee
          setCoins(c => {
            const nextCoins = c - cost.coins;
            try { GameStorage.setItem('newromath_coins', nextCoins.toString()); } catch (e) {}
            return nextCoins;
          });
          setGems(g => {
            const nextGems = g - cost.gems;
            try { GameStorage.setItem('newromath_gems', nextGems.toString()); } catch (e) {}
            return nextGems;
          });
          sound.click();
          setRewardToast(`Mission L${targetLvl} Entry: -${cost.coins} Coins & -${cost.gems} Gems`);
          startNewPuzzle(targetLvl);
        } else {
          sound.wrong();
          setInsufficientFundsModal({
            isOpen: true,
            targetLvl,
            cost,
            missingCoins: Math.max(0, cost.coins - coins),
            missingGems: Math.max(0, cost.gems - gems)
          });
        }
      };

      // Restart mission cleanly after timeout banner
      const restartLevelAfterTimeout = () => {
        sound.click();
        setIsTimeOver(false);
        resetPuzzle(selectedLevelNum);
      };

      // Move on to the next puzzle inside the current level
      const continueToNextStage = () => {
        sound.click();
        setIsCorrectModalOpen(false);
        resetPuzzle(selectedLevelNum);
        navigateTo('game');
      };

      // Retry the same puzzle after a wrong answer
      const retryCurrentStage = () => {
        sound.click();
        setIsWrongModalOpen(false);
        resetPuzzle(selectedLevelNum);
        navigateTo('game');
      };

      // Expose for testing and inspection
      window.__triggerTimeout = () => {
        setIsTimeOver(true);
        sound.error();
      };
      window.__resetTimeout = restartLevelAfterTimeout;
      window.__triggerWrongModal = () => {
        setIsWrongModalOpen(true);
        sound.error();
      };
      window.__triggerCorrectModal = () => {
        setIsCorrectModalOpen(true);
        sound.success();
      };
      window.__showAdMobInterstitial = (force = true) => adMobService.showInterstitial({ force });
      window.__toggleAdMobBanner = () => {
        if (adMobState.bannerVisible) {
          adMobService.hideBanner();
        } else {
          adMobService.showBanner();
        }
      };
      window.__solvePuzzle = () => {
        const solved = {};
        puzzleSlots.forEach(({ slot, answer }) => { solved[slot] = answer; });
        puzzleAnswersRef.current = solved;
        setPuzzleAnswers(solved);
        submitPuzzle(solved);
      };
      window.__setLevel = (targetLvl, customXp = null) => {
        const lvl = Math.max(1, Math.min(25, Number(targetLvl) || 1));
        setUnlockedLevelMax(lvl);
        setPlayerLevel(lvl);
        setSelectedLevelNum(lvl);
        const targetXp = getLevelTargetXp(lvl);
        const nextXp = customXp !== null ? Math.min(targetXp, Math.max(0, Number(customXp) || 0)) : Math.round(targetXp * 0.35);
        setPlayerXp(nextXp);
        if (lvl > 1 && LEVEL_AWARDS[lvl - 2]) {
          setEquippedAvatar(LEVEL_AWARDS[lvl - 2].icon);
          try { GameStorage.setItem('newromath_player_avatar', LEVEL_AWARDS[lvl - 2].icon); } catch (e) {}
        } else if (lvl === 1) {
          setEquippedAvatar('/assets/icon_robot_3d.webp');
          try { GameStorage.setItem('newromath_player_avatar', '/assets/icon_robot_3d.webp'); } catch (e) {}
        }
        try { GameStorage.setItem('newromath_unlocked_level', lvl.toString()); } catch (e) {}
        try { GameStorage.setItem('newromath_player_level', lvl.toString()); } catch (e) {}
        try { GameStorage.setItem('newromath_selected_level', lvl.toString()); } catch (e) {}
        try { GameStorage.setItem('newromath_player_xp', nextXp.toString()); } catch (e) {}
      };
      window.__setXp = (amount) => {
        const val = Math.max(0, Number(amount) || 0);
        setPlayerXp(val);
        try { GameStorage.setItem('newromath_player_xp', val.toString()); } catch (e) {}
      };
      const resetAllProgress = () => {
        setUnlockedLevelMax(1);
        setPlayerLevel(1);
        setSelectedLevelNum(1);
        setPlayerXp(0);
        setStageNum(1);
        setEquippedAvatar('/assets/icon_robot_3d.webp');
        try {
          GameStorage.setItem('newromath_unlocked_level', '1');
          GameStorage.setItem('newromath_player_level', '1');
          GameStorage.setItem('newromath_selected_level', '1');
          GameStorage.setItem('newromath_player_xp', '0');
          GameStorage.setItem('newromath_player_avatar', '/assets/icon_robot_3d.webp');
        } catch (e) {}
        resetPuzzle(1, 1);
        triggerRewardToast('🚀 Campaign reset! Starting fresh from Level 1.');
      };
      window.__resetAllProgress = resetAllProgress;
      window.__triggerInsufficientFunds = () => {
        setInsufficientFundsModal({
          isOpen: true,
          targetLvl: 5,
          cost: { coins: 200, gems: 18 },
          missingCoins: 0,
          missingGems: 11
        });
      };
      // Auto-slide ticker for 3D Champions Reel cards (sliding smoothly left to right)
      const championsReelRef = useRef(null);
      useEffect(() => {
        if (currentScreen !== 'home') return;
        let isPaused = false;
        const container = championsReelRef.current;
        if (!container) return;

        const interval = setInterval(() => {
          if (isPaused) return;
          if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 15) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: 138, behavior: 'smooth' });
          }
        }, 2800);

        const onPause = () => { isPaused = true; };
        const onResume = () => { setTimeout(() => { isPaused = false; }, 2500); };

        container.addEventListener('touchstart', onPause, { passive: true });
        container.addEventListener('touchend', onResume, { passive: true });
        container.addEventListener('mouseenter', onPause);
        container.addEventListener('mouseleave', onResume);

        return () => {
          clearInterval(interval);
          container.removeEventListener('touchstart', onPause);
          container.removeEventListener('touchend', onResume);
          container.removeEventListener('mouseenter', onPause);
          container.removeEventListener('mouseleave', onResume);
        };
      }, [currentScreen]);

      const formatTimer = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      };

      function setGameTimer(nextTimer) {
        gameTimerRef.current = Math.max(0, typeof nextTimer === 'function'
          ? nextTimer(gameTimerRef.current)
          : nextTimer);

        if (timerDisplayRef.current) {
          timerDisplayRef.current.textContent = formatTimer(gameTimerRef.current);
        }
        if (timerContainerRef.current) {
          const warning = gameTimerRef.current <= 15;
          timerContainerRef.current.classList.toggle('animate-timer-warning', warning);
          timerContainerRef.current.classList.toggle('text-red-300', warning);
          timerContainerRef.current.classList.toggle('bg-red-950/80', warning);
          timerContainerRef.current.classList.toggle('border-red-500/80', warning);
          timerContainerRef.current.classList.toggle('text-cyan-200', !warning);
          timerContainerRef.current.classList.toggle('bg-cyan-950/70', !warning);
          timerContainerRef.current.classList.toggle('border-cyan-400/40', !warning);
        }
      }

      const navigateTo = (screen, replaceCurrent = false) => {
        if (screen === currentScreen) return;
        sound.click();
        const stack = navigationStackRef.current;
        const previousIndex = stack.lastIndexOf(screen);
        if (replaceCurrent) {
          navigationStackRef.current = [...stack.slice(0, -1), screen];
          setTransitionDirection('forward');
        } else if (previousIndex >= 0) {
          navigationStackRef.current = stack.slice(0, previousIndex + 1);
          setTransitionDirection('back');
        } else {
          navigationStackRef.current = [...stack, screen];
          setTransitionDirection('forward');
        }
        setCurrentScreen(screen);
        setShowScreenPicker(false);
      };

      const navigateBack = () => {
        const stack = navigationStackRef.current;
        if (stack.length > 1) {
          const target = stack[stack.length - 2];
          navigateTo(target);
        } else if (currentScreen !== 'home') {
          navigateTo('home');
        }
      };
      window.__navigateTo = navigateTo;

      // Native Swipe Navigation (Left-to-Right = Back) and Hardware Back support on Android
      useEffect(() => {
        let touchStartX = 0;
        let touchStartY = 0;

        const onTouchStart = (e) => {
          if (e.touches.length === 1) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
          }
        };

        const onTouchEnd = (e) => {
          if (e.changedTouches.length === 1) {
            // Ignore if swiping inside horizontal scrollable containers (e.g. champions reel)
            if (e.target && e.target.closest && e.target.closest('.overflow-x-auto')) return;

            const deltaX = e.changedTouches[0].clientX - touchStartX;
            const deltaY = e.changedTouches[0].clientY - touchStartY;

            // Prominent horizontal swipe (> 55px and horizontally dominant)
            if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
              if (deltaX > 0) {
                // Swiped Left to Right -> Go Back!
                navigateBack();
              }
            }
          }
        };

        const onHardwareBack = (e) => {
          if (currentScreen !== 'home') {
            if (e && e.preventDefault) e.preventDefault();
            navigateBack();
          }
        };

        window.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd, { passive: true });
        document.addEventListener('backbutton', onHardwareBack);

        return () => {
          window.removeEventListener('touchstart', onTouchStart);
          window.removeEventListener('touchend', onTouchEnd);
          document.removeEventListener('backbutton', onHardwareBack);
        };
      }, [currentScreen]);

      const [puzzleSeed, setPuzzleSeed] = useState(0);
      const [isSpinningReroll, setIsSpinningReroll] = useState(false);

      const activePuzzle = useMemo(() => {
        if (!['game', 'hint', 'correct', 'wrong'].includes(currentScreen)) {
          return { slots: [], rows: [], numbers: [], solvedText: '', hintStep: '', cols: 5 };
        }
        return getMemoizedPuzzle(selectedLevelNum, puzzleSeed, stageNum - 1);
      }, [selectedLevelNum, puzzleSeed, stageNum, currentScreen]);

      // One unique puzzle seed per stage of the selected level (deferred, zero startup delay)
      const stageSeeds = useMemo(() => {
        if (!['game', 'hint', 'correct', 'wrong'].includes(currentScreen)) {
          return [];
        }
        return getStageSeedsForLevel(selectedLevelNum);
      }, [selectedLevelNum, currentScreen]);

      const currentLevelMeta = useMemo(() => {
        return ALL_LEVELS.find(l => l.num === selectedLevelNum) || ALL_LEVELS[0];
      }, [selectedLevelNum]);

      const puzzleSlots = activePuzzle?.slots || [];
      const puzzleRows = activePuzzle?.rows || [];
      const puzzleNumbers = activePuzzle?.numbers || [];

      const getLevelTimer = (lvl, stage = 1) => {
        const total = getStageCount(lvl);
        const ratio = total > 1 ? (Math.max(1, stage) - 1) / (total - 1) : 0;
        let base;
        if (lvl <= 5) base = 55;
        else if (lvl <= 10) base = 48;
        else if (lvl <= 15) base = 42;
        else if (lvl <= 20) base = 38;
        else base = 35;
        return Math.max(25, Math.round(base - ratio * 10));
      };

      const resetPuzzle = (targetLvl = selectedLevelNum, targetStage = stageNum) => {
        puzzleAnswersRef.current = {};
        setPuzzleAnswers({});
        setPuzzleHistory([]);
        setSelectedPuzzleSlot(null);
        pendingNumbersRef.current.clear();
        pendingSlotsRef.current.clear();
        setPendingNumbers(new Set());
        setPendingSlots(new Set());
        resetFlyingPool();
        setIsTimeOver(false);
        setGameTimer(getLevelTimer(targetLvl, targetStage));
      };

      const rerollPuzzle = () => {
        sound.click();
        setIsSpinningReroll(true);
        setPuzzleSeed(s => s + 1);
        puzzleAnswersRef.current = {};
        setPuzzleAnswers({});
        setPuzzleHistory([]);
        setSelectedPuzzleSlot(null);
        pendingNumbersRef.current.clear();
        pendingSlotsRef.current.clear();
        setPendingNumbers(new Set());
        setPendingSlots(new Set());
        resetFlyingPool();
        setIsTimeOver(false);
        setGameTimer(getLevelTimer(selectedLevelNum, stageNum));
        setTimeout(() => setIsSpinningReroll(false), 500);
      };

      const startNewPuzzle = (targetLvl = selectedLevelNum) => {
        setSelectedLevelNum(targetLvl);
        setPlayerLevel(prev => Math.max(prev, targetLvl));
        try { GameStorage.setItem('newromath_selected_level', targetLvl.toString()); } catch (e) {}
        try { GameStorage.setItem('newromath_player_level', Math.max(playerLevel, targetLvl).toString()); } catch (e) {}
        const seeds = getStageSeedsForLevel(targetLvl);
        setPuzzleSeed(seeds[0] !== undefined ? seeds[0] : 101);
        setStageNum(1);
        const lvlObj = ALL_LEVELS.find(l => l.num === targetLvl) || ALL_LEVELS[0];
        setProfileDifficulty(lvlObj.diff);
        setIsTimeOver(false);
        resetPuzzle(targetLvl, 1);
        navigateTo('game');
      };

      const submitPuzzle = (answers) => {
        const correct = puzzleSlots.every(({ slot, answer }) => answers[slot] === answer);
        if (correct) {
          sound.success();
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
          const lvlObj = ALL_LEVELS.find(l => l.num === selectedLevelNum) || { xp: 25, coins: 15 };
          const cost = getLevelEntryCost(selectedLevelNum);
          const total = getStageCount(selectedLevelNum);
          const isFinalStage = stageNum >= total;
          const targetXp = getLevelTargetXp(selectedLevelNum);
          const earnedXp = isFinalStage ? targetXp : Math.max(1, Math.round(targetXp / total));
          const earnedCoins = isFinalStage ? Math.round(cost.coins * 1.8) : Math.max(5, Math.round(cost.coins * 0.06));
          const earnedGems = isFinalStage ? Math.round(cost.gems * 1.3) + 2 : 0;

          if (isFinalStage) {
            setTimeout(() => sound.fanfare(), 320);
          }

          setLastResult({
            level: selectedLevelNum,
            stage: stageNum,
            total,
            levelCleared: isFinalStage,
            solvedText: activePuzzle.solvedText,
            coins: earnedCoins,
            gems: earnedGems,
            xp: earnedXp
          });

          // 1. Earn Coins & Diamond Coins in real-time
          setCoins(c => {
            const nextCoins = c + earnedCoins;
            try { GameStorage.setItem('newromath_coins', nextCoins.toString()); } catch (e) {}
            return nextCoins;
          });
          sound.coin();
          if (earnedGems > 0) {
            setGems(g => {
              const nextGems = g + earnedGems;
              try { GameStorage.setItem('newromath_gems', nextGems.toString()); } catch (e) {}
              return nextGems;
            });
            setTimeout(() => sound.gem(), 120);
          }

          if (isFinalStage) {
            // 2. Level Progression: unlocking next level immediately in real-time
            const nextUnlocked = Math.min(26, selectedLevelNum + 1);
            const nextSelected = Math.min(25, selectedLevelNum + 1);

            // 3. Unlock Next Mission
            setUnlockedLevelMax(prev => {
              const nextVal = Math.max(prev, nextUnlocked);
              try { GameStorage.setItem('newromath_unlocked_level', nextVal.toString()); } catch (e) {}
              return nextVal;
            });

            // 4. Update Player Campaign Level
            setPlayerLevel(prev => {
              const nextVal = Math.min(25, Math.max(prev, nextSelected));
              try { GameStorage.setItem('newromath_player_level', nextVal.toString()); } catch (e) {}
              return nextVal;
            });

            // 5. Select Next Mission
            setSelectedLevelNum(nextSelected);
            try { GameStorage.setItem('newromath_selected_level', nextSelected.toString()); } catch (e) {}

            // 6. Award Modern 3D Gaming Icon & Auto-apply to Player Profile
            const earnedAward = LEVEL_AWARDS.find(a => a.level === selectedLevelNum);
            if (earnedAward) {
              setEquippedAvatar(earnedAward.icon);
              try { GameStorage.setItem('newromath_player_avatar', earnedAward.icon); } catch (e) {}
              triggerRewardToast(`🏆 Level ${selectedLevelNum} Solved! Awarded 3D Avatar: ${earnedAward.title}!`);
            }
          } else {
            // Queue up the next puzzle of this level (different puzzle each stage)
            const nextStage = stageNum + 1;
            setStageNum(nextStage);
            setPuzzleSeed(stageSeeds[nextStage - 1] !== undefined ? stageSeeds[nextStage - 1] : (nextStage - 1) * 1000 + 101);
          }

          // 6. Update Player XP in real-time
          setPlayerXp(prevXp => {
            const totalXp = prevXp + earnedXp;
            try { GameStorage.setItem('newromath_player_xp', totalXp.toString()); } catch (e) {}
            return totalXp;
          });

          // 7. Record Solved Equation to Puzzle History Logs
          if (activePuzzle?.solvedText) {
            setPuzzleRecords(prev => {
              const newRec = {
                id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                eq: activePuzzle.solvedText,
                time: 'Just Now',
                level: selectedLevelNum,
                stage: stageNum,
                mode: 'Main Game',
                solved: true,
                xp: earnedXp,
                date: Date.now()
              };
              const updated = [newRec, ...prev.filter(r => r.eq !== newRec.eq)].slice(0, 50);
              try { GameStorage.setItem('newromath_puzzle_records', JSON.stringify(updated)); } catch (e) {}
              return updated;
            });
          }

          setTimeout(() => setIsCorrectModalOpen(true), 250);
        } else {
          sound.error();
          setLives(l => Math.max(0, l - 1));
          setTimeout(() => setIsWrongModalOpen(true), 250);
        }
      };

      const finalizePlacement = (number, targetSlot) => {
        pendingNumbersRef.current.delete(number);
        pendingSlotsRef.current.delete(targetSlot);
        setPendingNumbers(new Set(pendingNumbersRef.current));
        setPendingSlots(new Set(pendingSlotsRef.current));

        const nextAnswers = { ...puzzleAnswersRef.current, [targetSlot]: number };
        puzzleAnswersRef.current = nextAnswers;
        setPuzzleAnswers(nextAnswers);
        setPuzzleHistory(history => [...history, targetSlot]);

        // Landing impact animation on slot
        setImpactSlot(targetSlot);
        setTimeout(() => setImpactSlot(current => current === targetSlot ? null : current), 420);

        sound.snap();
        if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate([15, 30, 15]); } catch (e) {}
        }

        if (Object.keys(nextAnswers).length === puzzleSlots.length) {
          setTimeout(() => submitPuzzle(nextAnswers), 280);
        }
      };

      const placePuzzleNumber = (number, sourceElement) => {
        if (Object.values(puzzleAnswersRef.current).includes(number)) return;
        if (pendingNumbersRef.current.has(number)) return;

        const targetSlot = (selectedPuzzleSlot !== null && puzzleAnswersRef.current[selectedPuzzleSlot] === undefined && !pendingSlotsRef.current.has(selectedPuzzleSlot))
          ? selectedPuzzleSlot
          : puzzleSlots.findIndex(({ slot: index }) => puzzleAnswersRef.current[index] === undefined && !pendingSlotsRef.current.has(index));

        if (targetSlot < 0) return;

        // Reserve immediately to block repeated clicks
        pendingNumbersRef.current.add(number);
        pendingSlotsRef.current.add(targetSlot);
        setPendingNumbers(new Set(pendingNumbersRef.current));
        setPendingSlots(new Set(pendingSlotsRef.current));
        setSelectedPuzzleSlot(null);

        sound.whoosh();
        if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate(10); } catch (e) {}
        }

        const container = gameContainerRef.current || document.getElementById('root');
        const sourceEl = sourceElement || trayRefs.current[number];
        const targetEl = slotRefs.current[targetSlot];

        if (container && sourceEl && targetEl) {
          const cRect = container.getBoundingClientRect();
          const sRect = sourceEl.getBoundingClientRect();
          const tRect = targetEl.getBoundingClientRect();

          const isValidGeom = sRect.width > 0 && tRect.width > 0 &&
            Number.isFinite(sRect.left) && Number.isFinite(tRect.left) &&
            Number.isFinite(sRect.top) && Number.isFinite(tRect.top);

          if (isValidGeom) {
            const tileId = 'fly-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
            const newFlyTile = {
              id: tileId,
              number: number,
              targetSlot: targetSlot,
              fromX: sRect.left - cRect.left,
              fromY: sRect.top - cRect.top,
              fromW: sRect.width,
              fromH: sRect.height,
              toX: tRect.left - cRect.left,
              toY: tRect.top - cRect.top,
              toW: tRect.width,
              toH: tRect.height,
              isReturn: false
            };

            spawnFlyingTile(newFlyTile);
          } else {
            finalizePlacement(number, targetSlot);
          }
        } else {
          finalizePlacement(number, targetSlot);
        }
      };

      const returnNumberToTray = (number, slot) => {
        sound.whoosh();
        const container = gameContainerRef.current || document.getElementById('root');
        const sourceEl = slotRefs.current[slot];
        const targetEl = trayRefs.current[number];

        if (container && sourceEl && targetEl) {
          const cRect = container.getBoundingClientRect();
          const sRect = sourceEl.getBoundingClientRect();
          const tRect = targetEl.getBoundingClientRect();

          const isValidGeom = sRect.width > 0 && tRect.width > 0 &&
            Number.isFinite(sRect.left) && Number.isFinite(tRect.left) &&
            Number.isFinite(sRect.top) && Number.isFinite(tRect.top);

          if (isValidGeom) {
            const tileId = 'ret-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
            const returnTile = {
              id: tileId,
              number: number,
              targetSlot: slot,
              fromX: sRect.left - cRect.left,
              fromY: sRect.top - cRect.top,
              fromW: sRect.width,
              fromH: sRect.height,
              toX: tRect.left - cRect.left,
              toY: tRect.top - cRect.top,
              toW: tRect.width,
              toH: tRect.height,
              isReturn: true
            };

            spawnFlyingTile(returnTile);
          } else {
            finalizeReturn(number);
          }
        } else {
          finalizeReturn(number);
        }
      };

      const finalizeReturn = (number) => {
        if (pendingNumbersRef.current.has(number)) {
          pendingNumbersRef.current.delete(number);
          setPendingNumbers(new Set(pendingNumbersRef.current));
        }
        sound.pop();
        if (hapticsEnabled && typeof navigator !== 'undefined' && navigator.vibrate) {
          try { navigator.vibrate(10); } catch (e) {}
        }
      };

      const undoPuzzleNumber = () => {
        const lastSlot = puzzleHistory[puzzleHistory.length - 1];
        if (lastSlot === undefined) return;
        const number = puzzleAnswersRef.current[lastSlot];
        if (number === undefined) return;

        const nextAnswers = { ...puzzleAnswersRef.current };
        delete nextAnswers[lastSlot];
        puzzleAnswersRef.current = nextAnswers;
        setPuzzleAnswers(nextAnswers);
        setPuzzleHistory(history => history.slice(0, -1));
        setSelectedPuzzleSlot(lastSlot);

        returnNumberToTray(number, lastSlot);
      };

      // Primary screens list for quick switcher
      const allScreens = [
        { id: 'splash', name: '1. Splash Screen', icon: '🚀' },
        { id: 'onboarding', name: '2. Onboarding', icon: '💡' },
        { id: 'home', name: '3. Home Dashboard', icon: '🏠' },
        { id: 'levels', name: '4. Level Selection', icon: '🎯' },
        { id: 'game', name: '5. Puzzle Gameplay', icon: '🎮' },
        { id: 'hint', name: '6. Hint Bottom Sheet', icon: '💡' },
        { id: 'correct', name: '7. Correct Result', icon: '✅' },
        { id: 'wrong', name: '8. Wrong Result', icon: '❌' },
        { id: 'daily', name: '9. Daily Challenge', icon: '📅' },
        { id: 'stats', name: '10. Statistics', icon: '📊' },
        { id: 'achievements', name: '11. Achievements', icon: '🏆' },
        { id: 'leaderboard', name: '12. Leaderboard', icon: '🏅' },
        { id: 'history', name: '13. Puzzle History', icon: '📜' },
        { id: 'profile', name: '14. Profile', icon: '👤' },
        { id: 'settings', name: '15. Settings', icon: '⚙️' },
        { id: 'help', name: '16. Help & Support', icon: '❓' },
        { id: 'offline', name: '17. Offline Mode', icon: '📡' },
      ];

      // ==========================================
      // STATUS BAR REMOVED PER USER REQUEST
      // ==========================================
      const StatusBar = () => null;

      // ==========================================
      // TOP HEADER NAVIGATION BAR
      // Proper Math Puzzle App Icons & Branding
      // ==========================================
      const TopHeaderNav = ({ active = 'home' }) => {
        const tabs = [
          {
            id: 'home',
            label: 'Home',
            screen: 'home',
            badge: null,
            iconActive: (
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            ),
            iconInactive: (
              <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            ),
          },
          {
            id: 'levels',
            label: 'Levels',
            screen: 'levels',
            badge: null,
            iconActive: (
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 5a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V5zM3 15a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4zm10 0a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z" />
              </svg>
            ),
            iconInactive: (
              <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            ),
          },
          {
            id: 'daily',
            label: 'Daily',
            screen: 'daily',
            badge: '1',
            iconActive: (
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V9h14v11zM9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
              </svg>
            ),
            iconInactive: (
              <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            ),
          },
          {
            id: 'stats',
            label: 'Stats',
            screen: 'stats',
            badge: null,
            iconActive: (
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 19h4V13H4v6zm6 0h4V9h-4v10zm6 0h4V5h-4v14z" />
              </svg>
            ),
            iconInactive: (
              <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
          },
          {
            id: 'achievements',
            label: 'Rewards',
            screen: 'achievements',
            badge: '3',
            iconActive: (
              <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0011 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 003.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
              </svg>
            ),
            iconInactive: (
              <svg className="w-6 h-6 text-slate-400 group-hover:text-slate-600 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 3h14a1 1 0 011 1v2a6 6 0 01-6 6h-4a6 6 0 01-6-6V4a1 1 0 011-1zm1 4a4 4 0 004 4h4a4 4 0 004-4V5H6v2zm6 7v4m-4 4h8" />
              </svg>
            ),
          },
        ];

        return (
          <header className="w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-30 select-none shadow-xs sticky top-0 shrink-0">
            <div className="flex items-center justify-around w-full px-1">
              {tabs.map((tab) => {
                const isActive = active === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigateTo(tab.screen)}
                    className="flex-1 flex flex-col items-center justify-center py-2.5 relative cursor-pointer group"
                    title={tab.label}
                  >
                    <div className="relative flex items-center justify-center">
                      {isActive ? tab.iconActive : tab.iconInactive}
                      {tab.badge && (
                        <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[17px] h-[17px] px-1 flex items-center justify-center border-2 border-white dark:border-slate-900 leading-none shadow-xs">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    {/* Active Blue Indicator Underline */}
                    {isActive && (
                      <div className="absolute bottom-0 inset-x-2 h-[3px] bg-blue-600 rounded-full" />
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => navigateTo('profile')}
                aria-label="Open profile"
                title="Profile"
                className="flex-1 flex items-center justify-center py-2.5 text-slate-400 hover:text-slate-600"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </button>
            </div>
          </header>
        );
      };

      const MainBottomNav = () => {
        const tabs = [
          { id: 'home', label: 'Main', icon: '⌂', path: 'M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3z' },
          { id: 'daily', label: 'Daily', icon: '▦', path: 'M7 2h2v3H7zM15 2h2v3h-2zM4 6h16v14H4zM7 10h3v3H7zM13 10h4v2h-4zM7 15h3v2H7z' },
          { id: 'battle', label: 'Battle', icon: '⚔', path: 'M7 2l3 3-4 4 2 2 4-4 3 3-5 5 2 2-3 3-2-2-3 3-2-2 3-3-2-2zM17 2l5 5-3 3 2 2-2 2-2-2-3 3-2-2 3-3-2-2 2-2 2 2z' },
          { id: 'profile', label: 'Profile', icon: '●', path: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM3 22a9 9 0 0 1 18 0z' },
        ];
        return (
          <nav aria-label="Main navigation" className="reference-bottom-nav z-20 grid shrink-0 grid-cols-4 bg-white px-2 pt-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => navigateTo(tab.id)}
                aria-current={currentScreen === tab.id ? 'page' : undefined}
                className="flex flex-col items-center justify-center gap-0.5"
              >
                <svg className="h-7 w-7" viewBox="0 0 24 24" aria-hidden="true"><path d={tab.path} fill="currentColor" /></svg>
                <span className="text-[11px] font-bold">{tab.label}</span>
              </button>
            ))}
          </nav>
        );
      };

      // ========================================================
      // 1. SPLASH SCREEN (Pixel Perfect to Screen 1)
      // ==========================================
      const renderSplashScreen = () => (
        <div 
          onClick={() => navigateTo('onboarding')}
          className="flex-1 bg-white flex flex-col justify-between items-center text-center px-6 cursor-pointer relative overflow-hidden select-none"
        >
          <StatusBar />
          <div className="my-auto flex flex-col items-center">
            {/* App Icon 2x2 Grid of Rounded Squaricles */}
            <div className="w-24 h-24 rounded-3xl bg-blue-50/70 p-3 shadow-xl shadow-blue-500/10 flex items-center justify-center mb-6 border border-blue-100">
              <div className="grid grid-cols-2 gap-1.5 w-full h-full">
                <div className="rounded-xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-sm">+</div>
                <div className="rounded-xl bg-teal-400 text-white font-extrabold text-xl flex items-center justify-center shadow-sm">+</div>
                <div className="rounded-xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center shadow-sm">+</div>
                <div className="rounded-xl bg-teal-400 text-white font-extrabold text-xl flex items-center justify-center shadow-sm">+</div>
              </div>
            </div>

            <h1 className="text-3xl font-black font-display text-slate-900 tracking-tight">
              Math Puzzle
            </h1>
            <p className="text-xs font-semibold text-slate-400 tracking-widest mt-2 uppercase">
              Think • Solve • Grow
            </p>
          </div>

          {/* Bottom Wave Aesthetic */}
          <div className="w-full relative h-28">
            <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 400 120" fill="none">
              <path d="M0 60C120 10 240 100 400 40V120H0V60Z" fill="#eff6ff" />
              <path d="M0 80C140 40 260 110 400 65V120H0V80Z" fill="#dbeafe" opacity="0.6" />
            </svg>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-300 rounded-full"></div>
          </div>
        </div>
      );

      // ========================================================
      // 2. ONBOARDING SCREEN (Pixel Perfect to Screen 2)
      // ==========================================
      const renderOnboardingScreen = () => (
        <div className="flex-1 bg-white flex flex-col justify-between px-6 pb-6 select-none">
          <div>
            <StatusBar />
            <div className="flex justify-end pt-2">
              <button onClick={() => navigateTo('home')} className="text-sm font-bold text-blue-600 hover:text-blue-700">
                Skip
              </button>
            </div>
          </div>

          {/* Center Graphic */}
          <div className="my-auto flex flex-col items-center text-center">
            <div className="relative w-56 h-56 flex items-center justify-center mb-8">
              {/* Soft Radial Glow */}
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-2xl opacity-60"></div>

              {/* Floating Math Symbols */}
              <div className="absolute top-2 left-6 w-9 h-9 rounded-xl bg-blue-500 text-white font-black text-lg flex items-center justify-center shadow-md animate-float">
                +
              </div>
              <div className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-teal-400 text-white font-black text-lg flex items-center justify-center shadow-md animate-float" style={{ animationDelay: '1s' }}>
                -
              </div>
              <div className="absolute bottom-10 left-6 w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shadow-md animate-float" style={{ animationDelay: '1.5s' }}>
                ÷
              </div>
              <div className="absolute bottom-6 right-8 w-9 h-9 rounded-xl bg-teal-400 text-white font-black text-lg flex items-center justify-center shadow-md animate-float" style={{ animationDelay: '0.5s' }}>
                =
              </div>

              {/* Central Glowing Lightbulb */}
              <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-amber-300 flex items-center justify-center shadow-xl z-10">
                <span className="text-5xl">💡</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 leading-tight">
              Sharpen Your Mind<br />with Math Puzzles
            </h2>
            <p className="text-sm text-slate-500 mt-3 max-w-xs leading-relaxed">
              Fun, challenging and educational puzzles to boost your brain power.
            </p>
          </div>

          {/* Bottom Pagination & Button */}
          <div className="space-y-6">
            {/* Dots */}
            <div className="flex items-center justify-center gap-1.5">
              <div className="w-6 h-2 rounded-full bg-blue-600"></div>
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
              <div className="w-2 h-2 rounded-full bg-slate-300"></div>
            </div>

            <button
              onClick={() => navigateTo('home')}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Next</span>
              <span>→</span>
            </button>
          </div>
        </div>
      );

      // ========================================================
      // 3. HOME DASHBOARD (Pixel Perfect Sci-Fi 3D Arcade UI)
      // ========================================================
      const renderHomeScreen = () => (
        <div className="flex-1 flex flex-col scifi-game-bg select-none overflow-hidden relative text-white">
          {/* Main content container with smooth vertical flow and scroll clearance */}
          <div className="flex-1 overflow-y-auto no-scrollbar px-2.5 pt-0 pb-6 space-y-2 max-w-md mx-auto w-full">
            {/* Top Bar Header (Fully Responsive across all Android screen sizes) */}
            <div className="sticky top-0 z-20 -mx-2.5 scifi-header-bg border-b border-cyan-400/25 flex items-center justify-between gap-1 sm:gap-1.5 px-2 sm:px-2.5 pt-[max(8px,env(safe-area-inset-top))] pb-2 shrink-0 min-w-0 shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-md">
              {/* Left: Modern Cyber-Arcade Profile & Level Capsule */}
              <div 
                onClick={() => { sound.click(); navigateTo('profile'); }} 
                className="group relative cursor-pointer select-none bg-gradient-to-r from-[#14397d]/95 via-[#122f6d]/95 to-[#0e2456]/95 border border-cyan-400/60 hover:border-cyan-300/80 rounded-2xl p-1 pr-1.5 sm:pr-2.5 flex items-center gap-1.5 sm:gap-2 shadow-[0_4px_14px_rgba(0,140,255,0.25),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md transition-all active:scale-95 min-w-0 shrink"
                title="Player Profile"
              >
                {/* 3D Cyber Avatar Frame */}
                <div className="relative shrink-0 w-[30px] h-[30px] sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-900 p-0.5 shadow-[0_0_10px_rgba(0,229,255,0.6)] group-hover:shadow-[0_0_14px_rgba(0,229,255,0.9)] transition-all">
                  <div className="w-full h-full rounded-[10px] bg-gradient-to-b from-[#18366d] to-[#0e2147] overflow-hidden flex items-center justify-center">
                    <img 
                      src={equippedAvatar || "/assets/icon_robot_3d.webp"} 
                      alt="Player Avatar" 
                      decoding="async"
                      className="w-full h-full object-contain p-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
                    />
                  </div>
                  {/* Golden Metallic LV. Badge */}
                  <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-md bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 border border-amber-200 text-amber-950 font-black text-[7px] sm:text-[7.5px] font-display shadow-md tracking-tighter leading-none">
                    LV.{activePlayerLevel}
                  </div>
                </div>

                {/* Level Title & Campaign Progress (Completed & Due) */}
                <div className="flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2 leading-tight">
                    <span className="text-white font-black text-[10px] sm:text-[11px] font-display tracking-wide uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate">
                      Level {activePlayerLevel}
                    </span>
                    <span className={`home-hdr-pro-badge text-[8px] sm:text-[9px] font-black uppercase tracking-wider font-display shrink-0 select-none ${
                      purchaseState.isProUser
                        ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]'
                        : 'text-cyan-200/90 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]'
                    }`}>
                      {purchaseState.isProUser ? 'VIP' : 'FREE'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 min-w-0">
                    <div className="w-[44px] sm:w-[58px] h-1.5 bg-[#0b1c3d] border border-cyan-400/60 rounded-full overflow-hidden p-[1px] shadow-inner relative shrink-0">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-white rounded-full shadow-[0_0_8px_rgba(0,229,255,0.9)] transition-all duration-300" 
                        style={{ width: `${Math.min(100, Math.max(8, campaignProgressPct))}%` }} 
                      />
                    </div>
                    <span className="home-hdr-xp-text text-cyan-200 font-mono font-bold text-[8px] sm:text-[8.5px] tracking-tight whitespace-nowrap drop-shadow shrink-0">
                      {completedLevelsCount}/{dueLevelsCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Modern 3D Tactile Currency Widgets & Cyber Buttons */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {/* 3D Gold Coins Capsule */}
                <div 
                  onClick={() => { sound.click(); navigateTo('rewards'); }}
                  className="group bg-gradient-to-r from-[#1b1c08]/90 via-[#272106]/90 to-[#121102]/90 border border-amber-400/50 hover:border-amber-300 rounded-xl px-1.5 py-0.5 sm:py-1 flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,230,130,0.25)] transition-all active:scale-95 cursor-pointer shrink-0"
                  title="Coins - Tap to Open Rewards & Shop"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 drop-shadow-[0_2px_6px_rgba(245,158,11,0.7)] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <defs>
                      <radialGradient id="homeHdrCoinGrad" cx="35%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#fef08a" />
                        <stop offset="45%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#b45309" />
                      </radialGradient>
                      <linearGradient id="homeHdrCoinRim" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fde047" />
                        <stop offset="100%" stopColor="#78350f" />
                      </linearGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10" fill="url(#homeHdrCoinGrad)" stroke="url(#homeHdrCoinRim)" strokeWidth="1.5" />
                    <circle cx="12" cy="12" r="7.5" fill="none" stroke="#fde047" strokeWidth="0.8" opacity="0.6" />
                    <polygon points="12,6.5 13.6,9.8 17.2,10.3 14.6,12.7 15.2,16.2 12,14.5 8.8,16.2 9.4,12.7 6.8,10.3 10.4,9.8" fill="#fef08a" stroke="#d97706" strokeWidth="0.5" />
                  </svg>
                  <span className="text-amber-300 font-black text-[9.5px] sm:text-[10.5px] font-display tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] tabular-nums">
                    {Math.max(coins, 10).toLocaleString()}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 font-black text-[7.5px] sm:text-[8px] flex items-center justify-center shadow-xs leading-none">
                    +
                  </span>
                </div>

                {/* 3D Cyan Gems Capsule */}
                <div 
                  onClick={() => { sound.click(); navigateTo('rewards'); }}
                  className="group bg-gradient-to-r from-[#071d38]/90 via-[#0a2347]/90 to-[#051429]/90 border border-cyan-400/50 hover:border-cyan-300 rounded-xl px-1.5 py-0.5 sm:py-1 flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(186,230,253,0.25)] transition-all active:scale-95 cursor-pointer shrink-0"
                  title="Diamonds - Tap to Open Rewards & Shop"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 drop-shadow-[0_2px_8px_rgba(0,229,255,0.8)] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id="homeHdrGemTop" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#e0f2fe" />
                        <stop offset="100%" stopColor="#38bdf8" />
                      </linearGradient>
                      <linearGradient id="homeHdrGemBot" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0284c7" />
                        <stop offset="100%" stopColor="#075985" />
                      </linearGradient>
                    </defs>
                    <polygon points="6,4 18,4 22,9 12,21 2,9" fill="url(#homeHdrGemBot)" stroke="#38bdf8" strokeWidth="0.8" strokeLinejoin="round" />
                    <polygon points="6,4 18,4 15,9 9,9" fill="#bae6fd" />
                    <polygon points="2,9 6,4 9,9" fill="#7dd3fc" />
                    <polygon points="18,4 22,9 15,9" fill="#38bdf8" />
                    <polygon points="9,9 15,9 12,21" fill="#0284c7" />
                    <polygon points="2,9 9,9 12,21" fill="#0369a1" />
                    <polygon points="15,9 22,9 12,21" fill="#0c4a6e" />
                    <circle cx="7" cy="6" r="0.8" fill="#ffffff" />
                  </svg>
                  <span className="text-cyan-200 font-black text-[9.5px] sm:text-[10.5px] font-display tracking-tight drop-shadow-[0_0_6px_rgba(0,229,255,0.6)] tabular-nums">
                    {gems.toLocaleString()}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 text-white font-black text-[7.5px] sm:text-[8px] flex items-center justify-center shadow-xs leading-none">
                    +
                  </span>
                </div>


                {/* Tactile Cyber Settings Gear */}
                <button 
                  onClick={() => { sound.click(); navigateTo('settings'); }}
                  className="w-[26px] h-[26px] sm:w-7 sm:h-7 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Settings"
                  aria-label="Settings"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <circle cx="12" cy="12" r="3" strokeWidth="2.2" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Hero Banner */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.6)] border border-cyan-500/20 select-none shrink-0">
              <img 
                src="/assets/hero_scifi_clean.webp" 
                alt="Math Puzzle Hero" 
                decoding="async"
                fetchPriority="high"
                className="w-full h-auto object-contain block pointer-events-none" 
              />
            </div>

            {/* 1. Daily Challenge Card with Dynamic Text & Reduced Play Button */}
            <div 
              onClick={() => { sound.click(); navigateTo('daily'); }}
              className="scifi-card-3d relative w-full cursor-pointer select-none shrink-0 rounded-2xl overflow-hidden"
            >
              <img 
                src="/assets/card_daily_clean.webp?v=5" 
                alt="Daily Challenge" 
                decoding="async"
                className="w-full h-auto object-contain block pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" 
              />

              {/* Dynamic Content Overlay (Right side: 41% to 98% width) */}
              <div 
                className="absolute inset-y-0 right-0 left-[41%] flex flex-col justify-between py-2 sm:py-3 pr-2.5 sm:pr-4 pl-1 pointer-events-none"
                style={{ top: '6%', bottom: '6%' }}
              >
                {/* Grouped Header + Subtitle: reduced gap between title and next line */}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center justify-between gap-1 min-w-0">
                    <span 
                      className="text-white font-black tracking-tight leading-tight block drop-shadow-[0_2px_4px_rgba(0,10,35,0.95)] truncate"
                      style={{ fontSize: 'clamp(13px, 3.6vw, 17px)' }}
                    >
                      Daily <span className="text-cyan-300">Challenge</span>
                    </span>
                    
                    {/* Dynamic Date Badge */}
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-[#0a1e4a]/90 border border-cyan-400/50 text-[8px] sm:text-[9.5px] font-mono font-bold text-cyan-200 shadow-sm shrink-0">
                      <Calendar className="w-2.5 h-2.5 text-cyan-300 shrink-0" />
                      <span>{todayFormattedDate}</span>
                    </div>
                  </div>

                  {/* Subtitle directly beneath title with reduced gap */}
                  <p 
                    className="text-[#cce9ff] font-medium tracking-tight drop-shadow-[0_1px_2px_rgba(0,10,35,0.85)] truncate leading-tight mt-0.5"
                    style={{ fontSize: 'clamp(8.5px, 2.1vw, 10.5px)' }}
                  >
                    Solve today's puzzle and get amazing rewards!
                  </p>
                </div>

                {/* 3D Play Button (Increased width to fit the space) */}
                <div className="flex items-center justify-end pt-0.5 sm:pt-1 pointer-events-auto pr-0.5 sm:pr-1 w-full">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      sound.click();
                      navigateTo('daily');
                    }}
                    className="w-full max-w-[200px] sm:max-w-[225px] py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 text-amber-950 font-black flex items-center justify-center gap-2 shadow-[0_3px_0_#92400e,0_5px_14px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.8)] active:translate-y-0.5 active:shadow-[0_1px_0_#92400e] cursor-pointer transition-all border border-amber-200/60"
                    style={{ fontSize: 'clamp(11.5px, 2.9vw, 13.5px)' }}
                  >
                    <span className="text-[10px] sm:text-xs">▶</span>
                    <span>Play</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Mid Section (2 Cards Side-by-Side: Level & Rewards) */}
            <div className="grid grid-cols-2 gap-2 shrink-0">
              {/* Level Progress Card */}
              <div 
                onClick={() => { sound.click(); navigateTo('levels'); }}
                className="scifi-card-3d relative w-full cursor-pointer select-none rounded-2xl overflow-hidden"
              >
                <img 
                  src="/assets/card_level_clean.webp?v=7" 
                  alt={`Level ${activePlayerLevel}`} 
                  decoding="async"
                  className="w-full h-auto object-contain block pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" 
                />
                {/* Dynamic Level Overlay for active level - pixel-perfect positioning */}
                <div 
                  className="absolute pointer-events-none flex flex-col justify-center items-center text-center select-none"
                  style={{ top: '50%', transform: 'translateY(-50%)', left: '49%', right: '19%' }}
                >
                  <span 
                    className="text-white font-black tracking-tight leading-none block drop-shadow-[0_2px_4px_rgba(0,10,35,0.95)] whitespace-nowrap"
                    style={{ fontSize: 'clamp(12px, 3.5vw, 16px)' }}
                  >
                    Level {activePlayerLevel}
                  </span>
                  <span 
                    className="text-[#d8f2ff] font-bold tracking-tight block drop-shadow-[0_1px_3px_rgba(0,10,35,0.9)] truncate mt-1 leading-tight font-mono whitespace-nowrap"
                    style={{ fontSize: 'clamp(9px, 2.2vw, 11px)' }}
                  >
                    {completedLevelsCount}/{dueLevelsCount}
                  </span>
                </div>
              </div>

              {/* Rewards Card */}
              <div 
                onClick={() => { sound.click(); navigateTo('rewards'); }}
                className="scifi-card-3d relative w-full cursor-pointer select-none rounded-2xl overflow-hidden"
              >
                <img 
                  src="/assets/card_rewards_clean.webp?v=7" 
                  alt="Rewards" 
                  decoding="async"
                  className="w-full h-auto object-contain block pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" 
                />
                {/* Dynamic Rewards Overlay */}
                <div 
                  className="absolute pointer-events-none flex flex-col justify-center items-center text-center select-none"
                  style={{ top: '50%', transform: 'translateY(-50%)', left: '43%', right: '19%' }}
                >
                  <span 
                    className="text-white font-black tracking-tight leading-none block drop-shadow-[0_2px_4px_rgba(0,10,35,0.95)] whitespace-nowrap"
                    style={{ fontSize: 'clamp(12px, 3.5vw, 16px)' }}
                  >
                    Rewards
                  </span>
                  <span 
                    className="text-[#d8f2ff] font-bold tracking-tight block drop-shadow-[0_1px_3px_rgba(0,10,35,0.9)] truncate mt-1 leading-tight font-mono whitespace-nowrap"
                    style={{ fontSize: 'clamp(8.5px, 2.1vw, 10.5px)' }}
                  >
                    Coins & Gems
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Continue Card */}
            <div 
              onClick={() => {
                sound.click();
                attemptStartLevel(activePlayerLevel);
              }}
              className="scifi-card-3d relative w-full cursor-pointer select-none shrink-0 rounded-2xl overflow-hidden"
            >
              <img 
                src="/assets/card_continue_clean_bg.webp" 
                alt="Continue" 
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain block pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" 
              />
              {/* Dynamic Continue Overlay */}
              <div 
                className="absolute pointer-events-none flex flex-col justify-center select-none"
                style={{ top: '50%', transform: 'translateY(-50%)', left: '38%', right: '16%' }}
              >
                <span 
                  className="text-white font-black tracking-tight leading-none block drop-shadow-[0_2px_4px_rgba(0,10,35,0.95)]"
                  style={{ fontSize: 'clamp(15px, 4.2vw, 19px)' }}
                >
                  Continue
                </span>
                <div 
                  className="flex items-center gap-1.5 mt-1 font-bold tracking-tight text-[#38bdf8] drop-shadow-[0_1px_3px_rgba(0,10,35,0.9)] leading-tight"
                  style={{ fontSize: 'clamp(9.5px, 2.5vw, 12px)' }}
                >
                  <svg className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="font-mono">{currentRealTime}</span>
                  <span>{ALL_LEVELS.find(l => l.num === activePlayerLevel)?.diff || 'Easy'}</span>
                </div>
              </div>
            </div>

            {/* 4. New Game Card */}
            <div 
              onClick={() => { sound.click(); navigateTo('levels'); }}
              className="scifi-card-3d relative w-full cursor-pointer select-none shrink-0 rounded-2xl overflow-hidden"
            >
              <img 
                src="/assets/card_newgame_clean_bg.webp" 
                alt="New Game" 
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain block pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" 
              />
              {/* Dynamic New Game Overlay */}
              <div 
                className="absolute pointer-events-none flex flex-col justify-center select-none"
                style={{ top: '50%', transform: 'translateY(-50%)', left: '28%', right: '16%' }}
              >
                <span 
                  className="text-white font-black tracking-tight leading-none block drop-shadow-[0_2px_4px_rgba(0,10,35,0.95)]"
                  style={{ fontSize: 'clamp(15px, 4.2vw, 19px)' }}
                >
                  New Game
                </span>
                <span 
                  className="text-[#e2e8f0] font-bold tracking-tight block drop-shadow-[0_1px_3px_rgba(0,10,35,0.9)] truncate mt-1 leading-tight"
                  style={{ fontSize: 'clamp(9.5px, 2.4vw, 11.5px)' }}
                >
                  Start a fresh challenge
                </span>
              </div>
            </div>

            {/* 5. Champions Live Reel (Sliding Left to Right, 3D Gaming Style) */}
            <div className="pt-1 pb-1 shrink-0 select-none">
              {/* Header Title with live pulsing indicator */}
              <div className="flex items-center justify-between px-1 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-300 text-xs">📐</span>
                  <span className="text-cyan-200 font-extrabold text-[11px] uppercase tracking-wider font-display drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
                    Top Champions
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-cyan-300/80 font-bold tracking-tight">
                  <span>Swipe</span>
                  <span className="animate-pulse">➔</span>
                </div>
              </div>

              {/* Horizontal Sliding Reel Container */}
              <div 
                ref={championsReelRef}
                className="flex gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1.5 px-0.5"
                style={{ scrollSnapType: 'x mandatory' }}
              >
                {[
                  {
                    id: 1,
                    name: "Alex_Prime",
                    country: "United States",
                    flag: "🇺🇸",
                    rank: "Rank #1",
                    rankCol: "from-amber-300 via-amber-400 to-amber-500",
                    rankText: "text-amber-950",
                    levelsCompleted: 25,
                    levelDisplay: "25/25",
                    icon: "/assets/awards/award_lvl_25.webp",
                    cardBg: "from-[#13377a] via-[#1d4f9e] to-[#102e66]",
                    outerRimFrom: "#fef08a",
                    outerRimVia: "#fbbf24",
                    outerRimTo: "#b45309",
                    facetFrom: "#2c1c04",
                    facetTo: "#150d02",
                    innerRimFrom: "#fef08a",
                    innerRimVia: "#f59e0b",
                    innerRimTo: "#92400e",
                    glowColor: "rgba(245, 158, 11, 0.45)",
                    domeBg: "bg-[radial-gradient(circle_at_50%_25%,#2558b8_0%,#163b82_55%,#0d2354_100%)]",
                    countryBg: "bg-[#133270]/90 border border-amber-400/40",
                    countryText: "text-amber-200",
                    rewardsBg: "bg-[#0e285a]/95 border border-amber-400/60",
                    cornerColor: "text-amber-300/50",
                    coins: "50,000",
                    gems: "250",
                  },
                  {
                    id: 2,
                    name: "Elena_Cyber",
                    country: "Japan",
                    flag: "🇯🇵",
                    rank: "Rank #2",
                    rankCol: "from-slate-100 via-slate-200 to-slate-300",
                    rankText: "text-slate-900",
                    levelsCompleted: 23,
                    levelDisplay: "23/25",
                    icon: "/assets/awards/award_lvl_23.webp",
                    cardBg: "from-[#3a1b73] via-[#51239e] to-[#2e155c]",
                    outerRimFrom: "#f3e8ff",
                    outerRimVia: "#c084fc",
                    outerRimTo: "#7e22ce",
                    facetFrom: "#240e40",
                    facetTo: "#130624",
                    innerRimFrom: "#f3e8ff",
                    innerRimVia: "#a855f7",
                    innerRimTo: "#6b21a8",
                    glowColor: "rgba(168, 85, 247, 0.45)",
                    domeBg: "bg-[radial-gradient(circle_at_50%_25%,#682bc9_0%,#451a87_55%,#260d4d_100%)]",
                    countryBg: "bg-[#371970]/90 border border-purple-400/40",
                    countryText: "text-purple-200",
                    rewardsBg: "bg-[#291354]/95 border border-purple-400/60",
                    cornerColor: "text-purple-300/50",
                    coins: "35,000",
                    gems: "180",
                  },
                  {
                    id: 3,
                    name: "Cipher_Nova",
                    country: "Germany",
                    flag: "🇩🇪",
                    rank: "Rank #3",
                    rankCol: "from-amber-600 via-amber-500 to-yellow-600",
                    rankText: "text-amber-950",
                    levelsCompleted: 21,
                    levelDisplay: "21/25",
                    icon: "/assets/awards/award_lvl_21.webp",
                    cardBg: "from-[#094d3c] via-[#0e6952] to-[#073d30]",
                    outerRimFrom: "#d1fae5",
                    outerRimVia: "#34d399",
                    outerRimTo: "#047857",
                    facetFrom: "#062b20",
                    facetTo: "#031711",
                    innerRimFrom: "#d1fae5",
                    innerRimVia: "#10b981",
                    innerRimTo: "#065f46",
                    glowColor: "rgba(16, 185, 129, 0.45)",
                    domeBg: "bg-[radial-gradient(circle_at_50%_25%,#158066_0%,#0c5745_55%,#06362b_100%)]",
                    countryBg: "bg-[#0b4739]/90 border border-emerald-400/40",
                    countryText: "text-emerald-200",
                    rewardsBg: "bg-[#07382d]/95 border border-emerald-400/60",
                    cornerColor: "text-emerald-300/50",
                    coins: "25,000",
                    gems: "120",
                  },
                  {
                    id: 4,
                    name: "Vortex_99",
                    country: "United Kingdom",
                    flag: "🇬🇧",
                    rank: "Rank #4",
                    rankCol: "from-cyan-300 via-cyan-400 to-cyan-500",
                    rankText: "text-cyan-950",
                    levelsCompleted: 19,
                    levelDisplay: "19/25",
                    icon: "/assets/awards/award_lvl_19.webp",
                    cardBg: "from-[#692d0e] via-[#8c3d14] to-[#54240a]",
                    outerRimFrom: "#ffedd5",
                    outerRimVia: "#fb923c",
                    outerRimTo: "#c2410c",
                    facetFrom: "#331204",
                    facetTo: "#1c0902",
                    innerRimFrom: "#ffedd5",
                    innerRimVia: "#f97316",
                    innerRimTo: "#9a3412",
                    glowColor: "rgba(249, 115, 22, 0.45)",
                    domeBg: "bg-[radial-gradient(circle_at_50%_25%,#ad4b1b_0%,#783210_55%,#471d08_100%)]",
                    countryBg: "bg-[#5f280e]/90 border border-orange-400/40",
                    countryText: "text-orange-200",
                    rewardsBg: "bg-[#4a1f0a]/95 border border-orange-400/60",
                    cornerColor: "text-orange-300/50",
                    coins: "18,000",
                    gems: "90",
                  },
                  {
                    id: 5,
                    name: "Aria_Math",
                    country: "Canada",
                    flag: "🇨🇦",
                    rank: "Rank #5",
                    rankCol: "from-fuchsia-300 via-fuchsia-400 to-pink-500",
                    rankText: "text-fuchsia-950",
                    levelsCompleted: 15,
                    levelDisplay: "15/25",
                    icon: "/assets/awards/award_lvl_15.webp",
                    cardBg: "from-[#0b426e] via-[#105a96] to-[#083559]",
                    outerRimFrom: "#cffafe",
                    outerRimVia: "#22d3ee",
                    outerRimTo: "#0891b2",
                    facetFrom: "#08283a",
                    facetTo: "#04151e",
                    innerRimFrom: "#cffafe",
                    innerRimVia: "#06b6d4",
                    innerRimTo: "#0e7490",
                    glowColor: "rgba(6, 182, 212, 0.45)",
                    domeBg: "bg-[radial-gradient(circle_at_50%_25%,#1972b5_0%,#0f4c7d_55%,#092f4f_100%)]",
                    countryBg: "bg-[#0d3f66]/90 border border-cyan-400/40",
                    countryText: "text-cyan-200",
                    rewardsBg: "bg-[#093252]/95 border border-cyan-400/60",
                    cornerColor: "text-cyan-300/50",
                    coins: "12,000",
                    gems: "60",
                  },
                ].map((champ) => (
                  <div
                    key={champ.id}
                    onClick={() => {
                      sound.tap();
                      confetti({ particleCount: 30, spread: 50 });
                      navigateTo('leaderboard');
                    }}
                    className="shrink-0 cursor-pointer select-none transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                      scrollSnapAlign: 'start',
                      filter: `drop-shadow(0 4px 12px ${champ.glowColor}) drop-shadow(0 2px 4px rgba(0,0,0,0.6))`
                    }}
                    title={`${champ.name} - ${champ.rank} (${champ.levelDisplay} Levels Completed)`}
                  >
                    {/* Layer 1: Outer Chamfered Architectural Shell with Outer Glowing Rim */}
                    <div
                      className="relative p-[1.5px] w-[114px] h-[174px]"
                      style={{
                        clipPath: 'polygon(12px 0%, calc(100% - 12px) 0%, 100% 12px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0% calc(100% - 12px), 0% 12px)',
                        background: `linear-gradient(135deg, ${champ.outerRimFrom}, ${champ.outerRimVia}, ${champ.outerRimTo})`,
                      }}
                    >
                      {/* Layer 2: Beveled 3D Architectural Facet / Shelf */}
                      <div
                        className="w-full h-full p-[3px]"
                        style={{
                          clipPath: 'polygon(10.5px 0%, calc(100% - 10.5px) 0%, 100% 10.5px, 100% calc(100% - 10.5px), calc(100% - 10.5px) 100%, 10.5px 100%, 0% calc(100% - 10.5px), 0% 10.5px)',
                          background: `linear-gradient(145deg, ${champ.facetFrom}, ${champ.facetTo})`,
                        }}
                      >
                        {/* Layer 3: Inner Chamfered Glowing Border Rail */}
                        <div
                          className="w-full h-full p-[1.5px]"
                          style={{
                            clipPath: 'polygon(8.5px 0%, calc(100% - 8.5px) 0%, 100% 8.5px, 100% calc(100% - 8.5px), calc(100% - 8.5px) 100%, 8.5px 100%, 0% calc(100% - 8.5px), 0% 8.5px)',
                            background: `linear-gradient(135deg, ${champ.innerRimFrom}, ${champ.innerRimVia}, ${champ.innerRimTo})`,
                          }}
                        >
                          {/* Layer 4: Recessed Interior Card Plate with Content */}
                          <div
                            className={`w-full h-full flex flex-col justify-between relative overflow-hidden p-1.5 pt-2 bg-gradient-to-b ${champ.cardBg}`}
                            style={{
                              clipPath: 'polygon(7.5px 0%, calc(100% - 7.5px) 0%, 100% 7.5px, 100% calc(100% - 7.5px), calc(100% - 7.5px) 100%, 7.5px 100%, 0% calc(100% - 7.5px), 0% 7.5px)',
                              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.65), inset 0 -2px 6px rgba(0,0,0,0.5)',
                            }}
                          >
                            {/* 1. Mathematical Blueprint Coordinate Grid */}
                            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />

                            {/* 2. Top Architectural Drafting Marks (+) in corners */}
                            <span className={`absolute top-1 left-1.5 text-[6.5px] font-mono ${champ.cornerColor} select-none pointer-events-none leading-none`}>+</span>
                            <span className={`absolute top-1 right-1.5 text-[6.5px] font-mono ${champ.cornerColor} select-none pointer-events-none leading-none`}>+</span>
                            <span className={`absolute bottom-1 left-1.5 text-[6.5px] font-mono ${champ.cornerColor} select-none pointer-events-none leading-none`}>+</span>
                            <span className={`absolute bottom-1 right-1.5 text-[6.5px] font-mono ${champ.cornerColor} select-none pointer-events-none leading-none`}>+</span>

                            {/* 3. Glossy Top Glass Sheen */}
                            <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />

                            {/* Top Architectural Blueprint Header: Level Progress Indicator */}
                            <div className="w-full relative z-10 px-0.5">
                              <div className="flex items-center justify-between">
                                <span className={`text-[7px] font-mono font-bold tracking-wider opacity-90 ${champ.countryText} uppercase flex items-center gap-1`}>
                                  <span>COMPLETED</span>
                                </span>
                                <span className={`text-[8px] font-black font-mono leading-none ${champ.countryText} bg-black/40 px-1 py-0.5 rounded border border-white/10 shadow-xs`}>
                                  {champ.levelDisplay}
                                </span>
                              </div>
                              <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent my-0.5" />
                            </div>

                            {/* Center: 3D Champion Avatar Pedestal + Username + Country */}
                            <div className="flex flex-col items-center justify-center relative z-10 my-auto py-0.5">
                              <div className={`relative w-[38px] h-[38px] rounded-full ${champ.domeBg} shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.35),inset_0_-2px_3px_rgba(0,0,0,0.45)] flex items-center justify-center p-0.5 overflow-hidden shrink-0`}>
                                <div className="absolute inset-x-0.5 top-0 h-[45%] bg-gradient-to-b from-white/45 via-white/10 to-transparent rounded-t-full pointer-events-none" />
                                <div className="absolute bottom-0.5 w-5 h-1 rounded-full bg-black/55 blur-[1px] pointer-events-none" />
                                <img 
                                  src={champ.icon} 
                                  alt={champ.name} 
                                  className="w-[28px] h-[28px] object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.65)] relative z-10 transition-transform duration-200 hover:scale-110 active:scale-95" 
                                />
                              </div>

                              <span className="text-white font-black text-[10.5px] font-display tracking-tight text-center truncate w-full mt-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] leading-tight">
                                {champ.name}
                              </span>

                              <div className={`flex items-center justify-center gap-1 ${champ.countryBg} rounded-full px-1.5 py-0.5 mt-0.5 max-w-full shadow-xs`}>
                                <span className="text-[9.5px] shrink-0 leading-none">{champ.flag}</span>
                                <span className={`text-[7.5px] ${champ.countryText} font-bold tracking-tight truncate leading-none`}>
                                  {champ.country}
                                </span>
                              </div>
                            </div>

                            {/* Bottom: 3D Rank Badge + Rewards Capsule */}
                            <div className="flex flex-col gap-0.5 relative z-10 w-full pt-0.5">
                              <div className={`w-full bg-gradient-to-r ${champ.rankCol} ${champ.rankText} text-[8px] font-black uppercase py-0.5 rounded shadow-xs border border-white/50 text-center leading-none tracking-tight`}>
                                {champ.rank}
                              </div>

                              <div className={`flex items-center justify-center gap-1 ${champ.rewardsBg} rounded py-0.5 px-1 shadow-xs leading-none`}>
                                <img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coin" className="w-2.5 h-2.5 object-contain shrink-0" />
                                <span className="text-amber-300 font-black text-[8px] font-display">
                                  {champ.coins}
                                </span>
                                <span className="text-white/30 text-[6.5px]">|</span>
                                <img src="/assets/icon_gem_3d_clean.webp" alt="Gem" className="w-2.5 h-2.5 object-contain shrink-0" />
                                <span className="text-cyan-200 font-black text-[8px] font-display">
                                  {champ.gems}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

      // ========================================================
      // 4. CATEGORIES SCREEN (Deprecated - redirects to Levels)
      // ========================================================
      const renderCategoriesScreen = () => renderLevelSelectScreen();

      // ========================================================
      // 5. LEVEL SELECTION SCREEN (Modern Sci-Fi Arcade Edition - 25 Levels)
      // ========================================================
      const renderLevelSelectScreen = () => {
        const clearedCount = Math.max(0, Math.min(25, unlockedLevelMax - 1));
        const progressPct = Math.round((clearedCount / 25) * 100);

        const filterTabs = [
          { id: 'all', label: 'All', range: '1-25', count: 25 },
          { id: 'easy', label: 'Easy', range: '1-8', count: 8 },
          { id: 'medium', label: 'Medium', range: '9-17', count: 9 },
          { id: 'hard', label: 'Hard', range: '18-25', count: 8 },
        ];

        const filteredLevels = ALL_LEVELS.filter(lvl => {
          if (levelFilterTab === 'easy') return lvl.tier === 'easy';
          if (levelFilterTab === 'medium') return lvl.tier === 'medium';
          if (levelFilterTab === 'hard') return lvl.tier === 'hard';
          return true;
        });

        const getLevelCardTheme = (levelNum, diff, isLocked) => {
          if (isLocked) {
            return {
              cardBorder: 'border-[2px] border-slate-700/60 shadow-[0_4px_16px_rgba(0,0,0,0.5)]',
              cardBg: 'bg-gradient-to-b from-[#131a33] via-[#0d1226] to-[#080c1a]',
              badge: 'border border-slate-500/60 bg-slate-800/80 text-slate-300',
              btnBg: 'bg-slate-800/80 text-slate-400 border border-slate-700/80',
            };
          }

          const themeIdx = (levelNum - 1) % 6;
          switch (themeIdx) {
            case 0: // Emerald / Teal (Warm-Up Ignition)
              return {
                cardBorder: 'border-[2px] border-[#00f5b4] shadow-[0_0_20px_rgba(0,245,180,0.45),inset_0_1px_2px_rgba(255,255,255,0.25)]',
                cardBg: 'bg-gradient-to-b from-[#0e4459] via-[#093041] to-[#05202c]',
                badge: 'border border-emerald-300/80 bg-emerald-900/80 text-emerald-200 font-black shadow-[0_0_8px_rgba(16,185,129,0.5)]',
                btnBg: 'bg-gradient-to-r from-[#0066ff] via-[#0099ff] to-[#00f5b4] text-white shadow-[0_4px_14px_rgba(0,153,255,0.6),inset_0_1px_1px_rgba(255,255,255,0.7)]',
              };
            case 1: // Electric Cyan / Blue (Addition Circuit)
              return {
                cardBorder: 'border-[2px] border-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.45),inset_0_1px_2px_rgba(255,255,255,0.25)]',
                cardBg: 'bg-gradient-to-b from-[#14479e] via-[#0e3375] to-[#092254]',
                badge: 'border border-cyan-300/80 bg-cyan-900/80 text-cyan-200 font-black shadow-[0_0_8px_rgba(6,182,212,0.5)]',
                btnBg: 'bg-gradient-to-r from-[#0055ff] via-[#0088ff] to-[#00d4ff] text-white shadow-[0_4px_14px_rgba(0,136,255,0.6),inset_0_1px_1px_rgba(255,255,255,0.7)]',
              };
            case 2: // Neon Magenta / Purple (Cross Pulse)
              return {
                cardBorder: 'border-[2px] border-[#d946ef] shadow-[0_0_20px_rgba(217,70,239,0.45),inset_0_1px_2px_rgba(255,255,255,0.25)]',
                cardBg: 'bg-gradient-to-b from-[#561585] via-[#3e0d61] to-[#290742]',
                badge: 'border border-fuchsia-300/80 bg-fuchsia-900/80 text-fuchsia-200 font-black shadow-[0_0_8px_rgba(217,70,239,0.5)]',
                btnBg: 'bg-gradient-to-r from-[#9333ea] via-[#c084fc] to-[#e879f9] text-white shadow-[0_4px_14px_rgba(147,51,234,0.6),inset_0_1px_1px_rgba(255,255,255,0.7)]',
              };
            case 3: // Cyber Teal / Cyan (Binary Junction)
              return {
                cardBorder: 'border-[2px] border-[#06b6d4] shadow-[0_0_20px_rgba(6,182,212,0.45),inset_0_1px_2px_rgba(255,255,255,0.25)]',
                cardBg: 'bg-gradient-to-b from-[#0c4e5e] via-[#083845] to-[#052731]',
                badge: 'border border-teal-300/80 bg-teal-900/80 text-teal-200 font-black shadow-[0_0_8px_rgba(20,184,166,0.5)]',
                btnBg: 'bg-gradient-to-r from-[#0284c7] via-[#06b6d4] to-[#14b8a6] text-white shadow-[0_4px_14px_rgba(6,182,212,0.6),inset_0_1px_1px_rgba(255,255,255,0.7)]',
              };
            case 4: // Radiant Gold / Amber (Equation Dash)
              return {
                cardBorder: 'border-[2px] border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.45),inset_0_1px_2px_rgba(255,255,255,0.25)]',
                cardBg: 'bg-gradient-to-b from-[#783c07] via-[#572903] to-[#3b1a01]',
                badge: 'border border-amber-300/80 bg-amber-900/80 text-amber-200 font-black shadow-[0_0_8px_rgba(245,158,11,0.5)]',
                btnBg: 'bg-gradient-to-r from-[#f59e0b] via-[#fbbf24] to-[#fde047] text-amber-950 shadow-[0_4px_14px_rgba(245,158,11,0.6),inset_0_1px_1px_rgba(255,255,255,0.7)] font-black',
              };
            case 5: // Deep Indigo / Cobalt (Number Quest)
            default:
              return {
                cardBorder: 'border-[2px] border-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.45),inset_0_1px_2px_rgba(255,255,255,0.25)]',
                cardBg: 'bg-gradient-to-b from-[#2e3299] via-[#1f226e] to-[#151750]',
                badge: 'border border-indigo-300/80 bg-indigo-900/80 text-indigo-200 font-black shadow-[0_0_8px_rgba(99,102,241,0.5)]',
                btnBg: 'bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#38bdf8] text-white shadow-[0_4px_14px_rgba(99,102,241,0.6),inset_0_1px_1px_rgba(255,255,255,0.7)]',
              };
          }
        };
        return (
          <div className="flex-1 flex flex-col scifi-game-bg select-none overflow-hidden relative text-white">
            <div 
              className="flex-1 overflow-y-auto no-scrollbar px-3 pt-0 space-y-3 max-w-md mx-auto w-full"
              style={{ paddingBottom: 'max(3.5rem, calc(env(safe-area-inset-bottom, 0px) + 2.5rem))' }}
            >
              {/* Sticky Top Header */}
              <div className="sticky top-0 z-20 -mx-3 scifi-header-bg border-b border-cyan-400/20 flex items-center justify-between gap-1.5 px-3 pt-2.5 pb-2 shrink-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <button 
                    onClick={() => { sound.click(); navigateTo('home'); }} 
                    className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                    title="Back to Home"
                  >
                    <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/>
                    </svg>
                  </button>
                </div>

                {/* Currency Capsules */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <div 
                    onClick={() => { sound.click(); navigateTo('rewards'); }}
                    className="group bg-gradient-to-r from-[#1b1c08]/90 via-[#272106]/90 to-[#121102]/90 border border-amber-400/50 hover:border-amber-300 rounded-xl px-1.5 py-1 flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,230,130,0.25)] transition-all active:scale-95 cursor-pointer"
                    title="Coins - Tap to Open Rewards & Shop"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 drop-shadow-[0_2px_6px_rgba(245,158,11,0.7)] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="url(#homeHdrCoinGrad)" stroke="url(#homeHdrCoinRim)" strokeWidth="1.5" />
                      <circle cx="12" cy="12" r="7.5" fill="none" stroke="#fde047" strokeWidth="0.8" opacity="0.6" />
                      <polygon points="12,6.5 13.6,9.8 17.2,10.3 14.6,12.7 15.2,16.2 12,14.5 8.8,16.2 9.4,12.7 6.8,10.3 10.4,9.8" fill="#fef08a" stroke="#d97706" strokeWidth="0.5" />
                    </svg>
                    <span className="text-amber-300 font-black text-[10.5px] font-display tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      {coins.toLocaleString()}
                    </span>
                    <span className="w-3 h-3 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 font-black text-[8px] flex items-center justify-center shadow-xs leading-none">
                      +
                    </span>
                  </div>

                  <div 
                    onClick={() => { sound.click(); navigateTo('rewards'); }}
                    className="group bg-gradient-to-r from-[#071d38]/90 via-[#0a2347]/90 to-[#051429]/90 border border-cyan-400/50 hover:border-cyan-300 rounded-xl px-1.5 py-1 flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(186,230,253,0.25)] transition-all active:scale-95 cursor-pointer"
                    title="Diamonds - Tap to Open Rewards & Shop"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0 drop-shadow-[0_2px_8px_rgba(0,229,255,0.8)] group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                      <polygon points="6,4 18,4 22,9 12,21 2,9" fill="url(#homeHdrGemBot)" stroke="#38bdf8" strokeWidth="0.8" strokeLinejoin="round" />
                      <polygon points="6,4 18,4 15,9 9,9" fill="#bae6fd" />
                      <polygon points="2,9 6,4 9,9" fill="#7dd3fc" />
                      <polygon points="18,4 22,9 15,9" fill="#38bdf8" />
                      <polygon points="9,9 15,9 12,21" fill="#0284c7" />
                      <polygon points="2,9 9,9 12,21" fill="#0369a1" />
                      <polygon points="15,9 22,9 12,21" fill="#0c4a6e" />
                      <circle cx="7" cy="6" r="0.8" fill="#ffffff" />
                    </svg>
                    <span className="text-cyan-200 font-black text-[10.5px] font-display tracking-tight drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]">
                      {gems.toLocaleString()}
                    </span>
                    <span className="w-3 h-3 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 text-white font-black text-[8px] flex items-center justify-center shadow-xs leading-none">
                      +
                    </span>
                  </div>
                </div>
              </div>

              {/* Campaign Progress Card */}
              <div className="bg-gradient-to-r from-[#0d2254] via-[#153473] to-[#0c1f4a] border border-cyan-400/40 rounded-2xl p-3 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />
                <div className="relative z-10 flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏆</span>
                    <span className="text-xs font-black font-display text-white">Campaign Progress</span>
                  </div>
                  <div className="flex items-center gap-1 bg-cyan-950/80 border border-cyan-400/50 px-2 py-0.5 rounded-full">
                    <span className="text-xs font-black font-mono text-cyan-300">{progressPct}%</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="relative z-10 w-full h-2 bg-[#081533] border border-cyan-500/40 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(0,229,255,0.8)] transition-all duration-500"
                    style={{ width: `${Math.max(4, progressPct)}%` }}
                  />
                </div>
              </div>

              {/* Difficulty World Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-black/40 border border-cyan-400/30 rounded-xl">
                {filterTabs.map(tab => {
                  const isActive = levelFilterTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        sound.click();
                        setLevelFilterTab(tab.id);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border border-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.4)] scale-[1.02]'
                          : 'bg-transparent text-cyan-200/70 hover:text-white border border-transparent'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                        isActive ? 'bg-cyan-950/80 text-cyan-200' : 'bg-slate-800/80 text-slate-400'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Jump Ribbon (Horizontal Scroll 1 to 25) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-mono text-cyan-300/80 font-bold uppercase tracking-wider">
                    Quick Jump Ribbon
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">Scroll ➔</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-0.5">
                  {ALL_LEVELS.map(lvl => {
                    const isSelected = selectedLevelNum === lvl.num;
                    const isCompleted = lvl.num < unlockedLevelMax;
                    const isUnlocked = lvl.num <= unlockedLevelMax;

                    return (
                      <button
                        key={lvl.num}
                        onClick={() => {
                          if (!isUnlocked) {
                            sound.wrong();
                            return;
                          }
                          sound.click();
                          setSelectedLevelNum(lvl.num);
                          setPlayerLevel(prev => Math.max(prev, lvl.num));
                        }}
                        title={`Jump to Level ${lvl.num}`}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 font-black border-2 border-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.7)] scale-110 z-10'
                            : isCompleted
                            ? 'bg-gradient-to-b from-emerald-600 to-teal-800 text-white border border-emerald-400/60 shadow-sm hover:scale-105'
                            : isUnlocked
                            ? 'bg-gradient-to-b from-[#1b4394] to-[#12306d] text-cyan-200 border border-cyan-400/50 hover:scale-105'
                            : 'bg-slate-900/60 text-slate-500 border border-slate-700/40 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        {isCompleted ? '✓' : !isUnlocked ? '🔒' : lvl.num}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mission Levels 2-Column Grid (Modern 3D Gaming Card Style) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 pb-3">
                {filteredLevels.map((lvl) => {
                  const isSelected = selectedLevelNum === lvl.num;
                  const isCompleted = lvl.num < unlockedLevelMax;
                  const isUnlocked = lvl.num <= unlockedLevelMax;
                  const isLocked = lvl.num > unlockedLevelMax;
                  const cost = getLevelEntryCost(lvl.num);
                  const theme = getLevelCardTheme(lvl.num, lvl.diff, isLocked);
                  const artIdx = ((lvl.num - 1) % 6) + 1;
                  const artUrl = `/assets/levels/level_art_${artIdx}.webp`;

                  return (
                    <div
                      key={lvl.num}
                      onClick={() => {
                        if (isLocked) {
                          sound.wrong();
                          return;
                        }
                        sound.click();
                        setSelectedLevelNum(lvl.num);
                        attemptStartLevel(lvl.num);
                      }}
                      className={`group relative rounded-[20px] sm:rounded-[22px] p-2 sm:p-2.5 flex flex-col justify-between transition-all duration-200 cursor-pointer overflow-hidden ${
                        theme.cardBorder
                      } ${theme.cardBg} ${
                        isSelected
                          ? 'scale-[1.02] ring-2 ring-white/80 shadow-[0_0_22px_rgba(0,229,255,0.6)] z-10'
                          : 'hover:scale-[1.01]'
                      } ${isLocked ? 'cursor-not-allowed opacity-65' : ''}`}
                    >
                      {/* Top 3D Artwork Banner */}
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-2 bg-[#020617] border border-white/10 shrink-0 shadow-inner">
                        <img
                          src={artUrl}
                          alt={lvl.title}
                          className={`w-full h-full object-cover select-none transition-transform duration-300 ${
                            isLocked ? 'grayscale brightness-65' : 'group-hover:scale-105'
                          }`}
                          loading="lazy"
                        />
                        {/* Subtle glossy sheen */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10 pointer-events-none" />

                        {/* Locked Frost Overlay */}
                        {isLocked && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-slate-900/90 border border-slate-600/80 flex items-center justify-center text-slate-300 shadow-lg text-xs font-bold">
                              🔒
                            </div>
                          </div>
                        )}

                        {/* Completed Checkmark Badge */}
                        {isCompleted && (
                          <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 border border-emerald-300 text-white flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Title & Difficulty Badge */}
                      <div className="flex items-center justify-between gap-1 mb-1 min-w-0">
                        <h4
                          className="text-[11.5px] sm:text-[13px] font-black text-white truncate font-display tracking-tight leading-tight"
                          title={`Level ${lvl.num}: ${lvl.title}`}
                        >
                          {lvl.title}
                        </h4>
                        <span
                          className={`text-[8.5px] sm:text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0 shadow-xs ${theme.badge}`}
                        >
                          <span>{isLocked ? '🔒' : '★'}</span>
                          <span>Lvl {lvl.num}</span>
                        </span>
                      </div>

                      {/* 3 Stars Rating */}
                      <div className="flex items-center gap-0.5 mb-2">
                        {[1, 2, 3].map((starIdx) => (
                          <span
                            key={starIdx}
                            className={`text-xs ${
                              isCompleted
                                ? 'text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.9)]'
                                : 'text-slate-600'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      {/* Bottom Row: Specs Pills & Capsule Play Button */}
                      <div className="flex items-center justify-between gap-1 mt-auto pt-1.5 border-t border-white/5">
                        {/* Specs Pills: Games & Timer */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Games Count */}
                          <span
                            className="flex items-center gap-0.5 text-[9px] text-white font-mono font-bold bg-white/15 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/25 shadow-xs"
                            title="Games in this level"
                          >
                            <span>🎮</span>
                            <span>{getStageCount(lvl.num)}</span>
                          </span>
                          {/* Timer */}
                          <span
                            className="flex items-center gap-0.5 text-[9px] text-white font-mono font-bold bg-white/15 backdrop-blur-sm px-1.5 py-0.5 rounded border border-white/25 shadow-xs"
                            title="Time limit"
                          >
                            <span>⏱️</span>
                            <span>{getLevelTimer(lvl.num)}s</span>
                          </span>
                        </div>

                        {/* 3D Capsule Play Button */}
                        <button
                          type="button"
                          disabled={isLocked}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isLocked) {
                              sound.wrong();
                              return;
                            }
                            sound.click();
                            setSelectedLevelNum(lvl.num);
                            attemptStartLevel(lvl.num);
                          }}
                          className={`shrink-0 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10.5px] sm:text-xs font-black flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${theme.btnBg}`}
                        >
                          <span>{isLocked ? '🔒' : '▶'}</span>
                          <span>{isLocked ? 'Lock' : 'Play'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hero Action Button with Entry Fee summary */}
              {(() => {
                const selectedCost = getLevelEntryCost(selectedLevelNum);
                return (
                  <div className="flex justify-center pb-5 sm:pb-3">
                    <button
                      onClick={() => {
                        sound.click();
                        attemptStartLevel(selectedLevelNum);
                      }}
                      className="w-full max-w-[270px] py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 text-amber-950 font-black shadow-[0_4px_16px_rgba(245,158,11,0.45),inset_0_1px_0_rgba(255,255,255,0.7)] active:scale-[0.98] transition-all flex flex-col items-center justify-center border border-amber-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 text-xs sm:text-[13px] font-black">
                        <span className="text-xs">🚀</span>
                        <span>Launch Mission (Level {selectedLevelNum})</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-amber-950/85 font-mono font-bold mt-0.5">
                        <span className="flex items-center gap-0.5">
                          Fee:
                          <img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coins" className="w-3 h-3 object-contain inline-block shrink-0" />
                          {selectedCost.coins}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <img src="/assets/icon_gem_3d_clean.webp" alt="Diamonds" className="w-3 h-3 object-contain inline-block shrink-0" />
                          {selectedCost.gems}
                        </span>
                        <span className="text-[9px] bg-amber-950/20 px-1 py-0.5 rounded font-sans uppercase font-bold tracking-wider">Play</span>
                      </div>
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      };

      // ========================================================
      // 6. PUZZLE GAMEPLAY (Modern Sci-Fi Arcade Edition)
      const renderGameScreen = () => {
        const trayCount = puzzleNumbers.length;
        const blankCount = puzzleSlots.length;
        const isCompact = blankCount >= 5 || trayCount >= 8;
        const isVeryCompact = blankCount >= 6 || trayCount >= 10;

        // Dynamic board max-width based on tray count and blank slots to guarantee fit on all mobile screens
        const gridMaxWidthClass = (() => {
          if (trayCount >= 11 || blankCount >= 7) return 'max-w-[245px] sm:max-w-[270px]';
          if (trayCount >= 9 || blankCount >= 6) return 'max-w-[265px] sm:max-w-[290px]';
          if (trayCount >= 7 || blankCount >= 5) return 'max-w-[285px] sm:max-w-[310px]';
          if (trayCount >= 6 || blankCount >= 4) return 'max-w-[305px] sm:max-w-[325px]';
          return 'max-w-[325px] sm:max-w-[340px]';
        })();

        const gridGapClass = isVeryCompact ? 'gap-0.5 sm:gap-1' : 'gap-1 sm:gap-1.5 md:gap-2';

        // Responsive typography helpers that adapt dynamically to digit count and screen viewport
        const getTileTextClass = (val) => {
          const str = String(val ?? '');
          const len = str.length;
          if (len >= 3) {
            return isVeryCompact
              ? 'text-[clamp(8px,2vw,10px)] tracking-tighter font-black'
              : isCompact
              ? 'text-[clamp(8.5px,2.2vw,11px)] tracking-tighter font-black'
              : (largeFontEnabled ? 'text-[clamp(10px,2.7vw,13px)] tracking-tight font-black' : 'text-[clamp(9.5px,2.4vw,11.5px)] tracking-tight font-black');
          }
          if (len === 2) {
            return isVeryCompact
              ? 'text-[clamp(10px,2.6vw,12px)] tracking-tight font-black'
              : isCompact
              ? 'text-[clamp(11px,2.9vw,13.5px)] tracking-tight font-black'
              : (largeFontEnabled ? 'text-[clamp(13px,3.6vw,16px)] tracking-tight font-black' : 'text-[clamp(12px,3.2vw,14.5px)] tracking-tight font-black');
          }
          return isVeryCompact
            ? 'text-[clamp(11.5px,3.2vw,14.5px)] font-black'
            : isCompact
            ? 'text-[clamp(13px,3.8vw,16.5px)] font-black'
            : (largeFontEnabled ? 'text-[clamp(16px,4.8vw,22px)] font-black' : 'text-[clamp(14px,4.2vw,19px)] font-black');
        };

        const getOperatorTextClass = () => {
          if (isVeryCompact) return 'text-[clamp(10px,2.8vw,13px)] font-black';
          if (isCompact) return 'text-[clamp(11px,3.2vw,15px)] font-black';
          return largeFontEnabled
            ? 'text-[clamp(14px,4.5vw,20px)] font-black'
            : 'text-[clamp(12px,3.8vw,17px)] font-black';
        };

        const getTrayButtonSizeClass = () => '';

        const getTrayTextClass = (val) => getTileTextClass(val);

        return (
          <div className="flex-1 flex flex-col scifi-game-bg select-none overflow-hidden relative text-white">
          <div 
            className="flex-1 overflow-y-auto no-scrollbar px-3 pt-0 space-y-2.5 max-w-md mx-auto w-full"
            style={{ paddingBottom: 'max(3.5rem, calc(env(safe-area-inset-bottom, 0px) + 2.5rem))' }}
          >
            {/* Top Navigation & HUD Header */}
            <div className="sticky top-0 z-20 -mx-3 scifi-header-bg border-b border-cyan-400/20 flex items-center justify-between gap-1.5 px-3 pt-2 pb-2 shrink-0">
              {/* Left: Back Button */}
              <div className="flex items-center shrink-0">
                <button 
                  onClick={() => { sound.click(); navigateTo('levels'); }} 
                  aria-label="Back to levels" 
                  className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-base font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ‹
                </button>
              </div>

              {/* Center: Level Mission Pill */}
              <div className="flex items-center bg-[#0d255a]/75 backdrop-blur-md border border-cyan-400/50 rounded-full px-3 py-1 shadow-inner shrink-0">
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-cyan-200 font-display">
                  Mission L{selectedLevelNum}
                </span>
              </div>

              {/* Right: Info / Instructions & Reroll Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={() => {
                    sound.click();
                    const proceed = () => setShowMainInstructionsModal(true);
                    adMobService.showInterstitial({ force: true, onClose: proceed });
                  }} 
                  aria-label="Mission Instructions & How to Play" 
                  title="Mission Instructions" 
                  className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706] border border-yellow-200 text-white flex items-center justify-center text-xs font-black shadow-[0_0_12px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ⓘ
                </button>
                <button 
                  onClick={rerollPuzzle} 
                  aria-label="Change all puzzle numbers" 
                  title="Change all puzzle numbers" 
                  className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-base font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden"
                >
                  <span className={`inline-block transition-transform duration-500 ${isSpinningReroll ? 'rotate-180 scale-125 text-white' : ''}`}>
                    ↻
                  </span>
                </button>
              </div>
            </div>

            {/* Appearance Settings Modal */}
            {showGamePreferences && (
              <section role="dialog" aria-label="Puzzle appearance settings" className="fixed inset-x-4 top-16 z-30 max-w-sm mx-auto rounded-3xl bg-gradient-to-b from-[#14285e] to-[#0a1533] border border-cyan-400/60 p-5 text-white shadow-[0_0_35px_rgba(0,229,255,0.5)] animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-cyan-400/20 pb-2 mb-3">
                  <h2 className="text-sm font-black uppercase tracking-wider font-display text-cyan-200">Appearance</h2>
                  <button onClick={() => setShowGamePreferences(false)} className="text-cyan-300 hover:text-white font-bold text-sm">✕</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 mb-2">Display Theme</h3>
                    <div className="flex justify-around bg-[#0b2050]/70 p-2 rounded-2xl border border-cyan-400/30">
                      <button onClick={() => setIsDarkMode(false)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${!isDarkMode ? 'bg-cyan-500 text-blue-950 shadow-md' : 'text-slate-400'}`}>
                        Default Sci-Fi
                      </button>
                      <button onClick={() => setIsDarkMode(true)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isDarkMode ? 'bg-cyan-500 text-blue-950 shadow-md' : 'text-slate-400'}`}>
                        Deep Space
                      </button>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 mb-2">Numeral Font Size</h3>
                    <div className="flex justify-around bg-[#0b2050]/70 p-2 rounded-2xl border border-cyan-400/30">
                      {[true, false].map(isLarge => (
                        <button key={String(isLarge)} onClick={() => setLargeFontEnabled(isLarge)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${largeFontEnabled === isLarge ? 'bg-cyan-500 text-blue-950 shadow-md' : 'text-slate-400'}`}>
                          {isLarge ? 'Large Font' : 'Standard Font'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 mb-2">Division Notation</h3>
                    <div className="flex justify-around bg-[#0b2050]/70 p-2 rounded-2xl border border-cyan-400/30">
                      {['÷', '/', ':'].map(symbol => (
                        <button key={symbol} onClick={() => setDivisionSymbol(symbol)} className={`w-10 h-10 rounded-xl text-base font-black transition-all ${divisionSymbol === symbol ? 'bg-cyan-500 text-blue-950 shadow-md' : 'text-slate-400'}`}>
                          {symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Mission Board Terminal */}
            <section className="flex flex-col rounded-3xl p-2.5 sm:p-4 bg-gradient-to-b from-white/[0.10] via-[#102761]/80 to-[#0b1c45]/90 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.5),inset_0_1.5px_0_rgba(255,255,255,0.22)] relative overflow-hidden backdrop-blur-xl">
              {/* Blueprint Grid Overlay */}
              <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />

              {/* Drafting Corner Crosses */}
              <span className="absolute top-1.5 left-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
              <span className="absolute top-1.5 right-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
              <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
              <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>

              {/* Mission HUD Header: Yellow Background Modern 3D Glassmorphism Section */}
              <div className="relative z-10 flex items-center justify-between px-2.5 py-2 rounded-2xl bg-gradient-to-b from-yellow-300/25 via-amber-400/20 to-yellow-500/15 border border-yellow-300/50 shadow-[0_4px_20px_rgba(245,158,11,0.25),inset_0_1.5px_1.5px_rgba(255,255,255,0.65),inset_0_-1.5px_3px_rgba(180,83,9,0.3)] backdrop-blur-xl mb-2.5 overflow-hidden">
                {/* Luminous Inner Glow Shimmer */}
                <div className="absolute -top-6 left-1/4 w-32 h-12 bg-yellow-300/20 rounded-full blur-md pointer-events-none" />

                {/* Left: 3D Difficulty Badge & Stage Counter */}
                <div className="relative z-10 flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-b from-yellow-200 via-amber-300 to-amber-500 text-amber-950 border border-yellow-100 shadow-[0_2px_4px_rgba(180,83,9,0.4),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all shrink-0">
                    {activePuzzle?.stageDifficulty || profileDifficulty}
                  </span>
                  <div className="px-2 py-0.5 rounded-lg bg-black/35 border border-yellow-400/30 backdrop-blur-md shadow-inner flex items-center">
                    <span className="text-[10px] text-yellow-200 font-mono font-black tracking-wider drop-shadow-xs">
                      GAME {stageNum}/{stageTotal}
                    </span>
                  </div>
                </div>

                {/* Right: 3D Yellow Glass Timer Capsule & 3D Yellow Pause Button */}
                <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                  <div 
                    ref={timerContainerRef} 
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-mono font-black text-xs transition-all backdrop-blur-md ${
                      gameTimer <= 15
                        ? 'animate-timer-warning text-red-100 bg-gradient-to-b from-red-500/80 to-red-800/90 border border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.7),inset_0_1px_1px_rgba(255,255,255,0.5)]'
                        : 'text-yellow-100 bg-gradient-to-b from-yellow-400/25 via-amber-500/35 to-amber-700/40 border border-yellow-300/60 shadow-[0_2px_8px_rgba(245,158,11,0.3),inset_0_1px_1px_rgba(255,255,255,0.55)]'
                    }`}
                  >
                    <span className="text-xs">⏱️</span>
                    <span ref={timerDisplayRef} className="drop-shadow-xs">{formatTimer(gameTimer)}</span>
                  </div>

                  <button 
                    onClick={() => { sound.click(); setIsGamePaused(v => !v); }} 
                    aria-label={isGamePaused ? 'Resume puzzle' : 'Pause puzzle'} 
                    className="w-8 h-8 rounded-xl bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 hover:from-yellow-200 hover:via-amber-300 hover:to-amber-400 border border-yellow-100 text-amber-950 flex items-center justify-center text-xs font-black shadow-[0_3px_0_#b45309,0_4px_10px_rgba(245,158,11,0.45),inset_0_1px_2px_rgba(255,255,255,0.85)] active:translate-y-0.5 active:shadow-[0_1px_0_#b45309] cursor-pointer transition-all"
                  >
                    {isGamePaused ? '▶' : '⏸'}
                  </button>
                </div>
              </div>

              {/* Cross-Math 9x9 Puzzle Grid */}
              <div className="relative z-10 flex justify-center pb-2.5 pt-2 sm:pb-3 sm:pt-3">
                <div className={`w-full ${gridMaxWidthClass} p-0.5 sm:p-1.5 transition-all`}>
                  <div 
                    className={`grid ${gridGapClass} w-full`} 
                    style={{ gridTemplateColumns: `repeat(${activePuzzle.cols || 5}, minmax(0, 1fr))` }}
                    role="group" 
                    aria-label="Cross-math puzzle board"
                  >
                    {puzzleRows.flatMap((row, rowIndex) => row.map((cell, columnIndex) => {
                      if (cell === null) return <div key={`${rowIndex}-${columnIndex}`} className="aspect-square min-w-0" />;
                      const slot = typeof cell === 'object' ? cell.slot : null;
                      const isSlot = slot !== null;
                      const isSelected = isSlot && selectedPuzzleSlot === slot;
                      const isFilled = isSlot && puzzleAnswers[slot] !== undefined;

                      if (isSlot) {
                        const isSlotPending = pendingSlots.has(slot);
                        const hasImpact = impactSlot === slot;
                        return (
                          <button
                            key={`${rowIndex}-${columnIndex}`}
                            ref={el => { if (el) slotRefs.current[slot] = el; }}
                            data-puzzle-slot={slot}
                            onClick={() => {
                              if (isTimeOver) return;
                              sound.click();
                              if (puzzleAnswers[slot] !== undefined) {
                                const num = puzzleAnswers[slot];
                                const nextAnswers = { ...puzzleAnswersRef.current };
                                delete nextAnswers[slot];
                                puzzleAnswersRef.current = nextAnswers;
                                setPuzzleAnswers(nextAnswers);
                                setPuzzleHistory(history => history.filter(item => item !== slot));
                                setSelectedPuzzleSlot(slot);
                                returnNumberToTray(num, slot);
                              } else {
                                setSelectedPuzzleSlot(slot);
                              }
                            }}
                            aria-label={`Puzzle blank ${slot + 1}${puzzleAnswers[slot] !== undefined ? `, ${puzzleAnswers[slot]}` : ''}`}
                            aria-pressed={isSelected}
                            className={`relative flex aspect-square min-w-0 items-center justify-center select-none p-0.5 ${
                              isFilled
                                ? `scifi-tile-slot-filled ${hasImpact ? 'animate-tile-pop' : ''} ${getTileTextClass(puzzleAnswers[slot])}`
                                : isSelected
                                ? 'scifi-tile-slot-selected'
                                : isSlotPending
                                ? 'scifi-tile-slot-target-locked'
                                : 'scifi-tile-slot-empty'
                            }`}
                          >
                            {isFilled ? (
                              <span className="leading-none flex items-center justify-center font-black tracking-tight truncate max-w-full px-0.5 drop-shadow-xs">
                                {puzzleAnswers[slot]}
                              </span>
                            ) : isSlotPending ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping opacity-90" />
                            ) : isSelected ? (
                              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping opacity-80" />
                            ) : (
                              <span className={`${isVeryCompact ? 'text-[8px]' : isCompact ? 'text-[9px]' : 'text-[10px]'} text-cyan-400/50 font-bold leading-none select-none`}>◇</span>
                            )}
                            {hasImpact && <span className="slot-impact-wave" />}
                          </button>
                        );
                      }

                      // Operator or Fixed Number
                      const isOperator = ['+', '-', '−', '=', '×', '÷', divisionSymbol].includes(cell);
                      return (
                        <div 
                          key={`${rowIndex}-${columnIndex}`} 
                          className={`flex aspect-square min-w-0 items-center justify-center select-none p-0.5 ${
                            isOperator
                              ? `scifi-tile-operator ${getOperatorTextClass()}`
                              : `scifi-tile-fixed ${getTileTextClass(cell)}`
                          }`}
                        >
                          <span className="leading-none flex items-center justify-center font-black tracking-tight truncate max-w-full px-0.5">
                            {cell === '÷' ? divisionSymbol : cell}
                          </span>
                        </div>
                      );
                    }))}
                  </div>
                </div>
              </div>

              {/* Number Tray Keyboard (Aligned with Cross-Math Grid and Responsive on All Android Devices) */}
              <div className="relative z-10 flex flex-col items-center pt-2 sm:pt-2.5 border-t border-cyan-400/20 w-full px-0.5">
                <div 
                  className={`w-full ${gridMaxWidthClass} p-0.5 sm:p-1.5 transition-all flex flex-col items-center gap-1.5 sm:gap-2`}
                  style={{ '--tray-gap': isVeryCompact ? '2px' : '4px' }}
                >
                  {puzzleNumbers.length <= 5 ? (
                    <div 
                      className={`grid ${gridGapClass} w-full`} 
                      style={{ gridTemplateColumns: `repeat(${activePuzzle.cols || 5}, minmax(0, 1fr))` }}
                      role="group" 
                      aria-label="Available number tiles"
                    >
                      {puzzleNumbers.map(number => {
                        const isAnswered = Object.values(puzzleAnswers).includes(number);
                        const isPending = pendingNumbers.has(number);
                        const used = isAnswered || isPending;
                        return (
                          <button
                            key={number}
                            ref={el => { if (el) trayRefs.current[number] = el; }}
                            data-tray-number={number}
                            onClick={(e) => {
                              placePuzzleNumber(number, e.currentTarget);
                            }}
                            disabled={used || isGamePaused || isTimeOver}
                            aria-label={`Place number ${number}`}
                            className={`scifi-tile-tray-btn aspect-square min-w-0 w-full p-0.5 select-none ${
                              used ? 'is-used' : ''
                            } ${getTileTextClass(number)}`}
                          >
                            <span className="leading-none flex items-center justify-center font-black tracking-tight truncate max-w-full px-0.5">
                              {number}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      {/* Row 1 */}
                      {(() => {
                        const row1Numbers = puzzleNumbers.slice(0, Math.ceil(puzzleNumbers.length / 2));
                        const k1 = row1Numbers.length;
                        return (
                          <div 
                            className={`grid ${gridGapClass} mx-auto`}
                            style={{ 
                              gridTemplateColumns: `repeat(${k1}, minmax(0, 1fr))`,
                              width: k1 === 5 ? '100%' : k1 < 5 ? `calc(${k1 * 20}% - ${(5 - k1) * 0.2} * var(--tray-gap, 4px))` : '100%'
                            }}
                            role="group"
                            aria-label="Available number tiles row 1"
                          >
                            {row1Numbers.map(number => {
                              const isAnswered = Object.values(puzzleAnswers).includes(number);
                              const isPending = pendingNumbers.has(number);
                              const used = isAnswered || isPending;
                              return (
                                <button
                                  key={number}
                                  ref={el => { if (el) trayRefs.current[number] = el; }}
                                  data-tray-number={number}
                                  onClick={(e) => {
                                    placePuzzleNumber(number, e.currentTarget);
                                  }}
                                  disabled={used || isGamePaused || isTimeOver}
                                  aria-label={`Place number ${number}`}
                                  className={`scifi-tile-tray-btn aspect-square min-w-0 w-full p-0.5 select-none ${
                                    used ? 'is-used' : ''
                                  } ${getTileTextClass(number)}`}
                                >
                                  <span className="leading-none flex items-center justify-center font-black tracking-tight truncate max-w-full px-0.5">
                                    {number}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}

                      {/* Row 2 */}
                      {(() => {
                        const row2Numbers = puzzleNumbers.slice(Math.ceil(puzzleNumbers.length / 2));
                        const k2 = row2Numbers.length;
                        return (
                          <div 
                            className={`grid ${gridGapClass} mx-auto`}
                            style={{ 
                              gridTemplateColumns: `repeat(${k2}, minmax(0, 1fr))`,
                              width: k2 === 5 ? '100%' : k2 < 5 ? `calc(${k2 * 20}% - ${(5 - k2) * 0.2} * var(--tray-gap, 4px))` : '100%'
                            }}
                            role="group"
                            aria-label="Available number tiles row 2"
                          >
                            {row2Numbers.map(number => {
                              const isAnswered = Object.values(puzzleAnswers).includes(number);
                              const isPending = pendingNumbers.has(number);
                              const used = isAnswered || isPending;
                              return (
                                <button
                                  key={number}
                                  ref={el => { if (el) trayRefs.current[number] = el; }}
                                  data-tray-number={number}
                                  onClick={(e) => {
                                    placePuzzleNumber(number, e.currentTarget);
                                  }}
                                  disabled={used || isGamePaused || isTimeOver}
                                  aria-label={`Place number ${number}`}
                                  className={`scifi-tile-tray-btn aspect-square min-w-0 w-full p-0.5 select-none ${
                                    used ? 'is-used' : ''
                                  } ${getTileTextClass(number)}`}
                                >
                                  <span className="leading-none flex items-center justify-center font-black tracking-tight truncate max-w-full px-0.5">
                                    {number}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Bottom Action Controls (Modern 3D Cyber Arcade) */}
            <div 
              className="flex items-center justify-around px-4 pt-3 pb-8 sm:pb-6"
              style={{ paddingBottom: 'max(2.25rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem))' }}
            >
              {/* 1. History & Mission Records Button */}
              <button 
                onClick={() => { sound.click(); navigateTo('history'); }} 
                aria-label="Puzzle history & records" 
                className="relative grid h-[54px] w-[54px] place-items-center rounded-2xl bg-gradient-to-b from-[#2563eb] via-[#1d4ed8] to-[#173887] border-2 border-cyan-400 text-cyan-100 shadow-[0_4px_0_#0c235c,0_6px_16px_rgba(0,229,255,0.35),inset_0_1px_2px_rgba(255,255,255,0.45)] hover:scale-105 active:translate-y-1 active:shadow-[0_1px_0_#0c235c] transition-all cursor-pointer"
                title="Options / History"
              >
                <svg className="w-6 h-6 text-cyan-200 drop-shadow-[0_0_8px_rgba(0,229,255,0.85)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7.5" height="7.5" rx="2.5" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" />
                  <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.5" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" />
                  <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.5" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" />
                  <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.5" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" />
                </svg>
              </button>

              {/* 2. Undo Move Button */}
              <button 
                onClick={undoPuzzleNumber} 
                aria-label="Undo last number" 
                disabled={!puzzleHistory.length} 
                className={`relative grid h-[54px] w-[54px] place-items-center rounded-2xl transition-all ${
                  puzzleHistory.length > 0
                    ? 'bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] border-2 border-cyan-300 text-white shadow-[0_4px_0_#082f49,0_8px_20px_rgba(14,165,233,0.55),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:scale-105 active:translate-y-1 active:shadow-[0_1px_0_#082f49] cursor-pointer'
                    : 'bg-gradient-to-b from-[#1b3670]/80 via-[#152c5c]/85 to-[#0f2249]/90 border-2 border-cyan-500/30 shadow-[0_4px_0_#0b1a38] text-cyan-200/50 cursor-not-allowed opacity-75'
                }`}
                title="Undo Number"
              >
                <svg className={`w-6 h-6 ${puzzleHistory.length > 0 ? 'text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.95)]' : 'text-cyan-300/60'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10h11a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5H9" />
                  <path d="M7 6L3 10l4 4" />
                </svg>
                {puzzleHistory.length > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 border-2 border-white text-slate-950 font-black text-[10px] flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.95)] animate-bounce leading-none">
                    {puzzleHistory.length}
                  </span>
                )}
              </button>

              {/* 3. Quantum Hint / Energy Bulb Button */}
              <button 
                onClick={() => { sound.click(); navigateTo('hint'); }} 
                aria-label="Get a hint" 
                className="relative grid h-[54px] w-[54px] place-items-center rounded-2xl bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border-2 border-cyan-200 shadow-[0_4px_0_#075985,0_8px_24px_rgba(14,165,233,0.65),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:scale-105 active:translate-y-1 active:shadow-[0_1px_0_#075985] transition-all cursor-pointer"
                title="Get Hint"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-cyan-300/40 blur-[3px] animate-pulse pointer-events-none" />
                  <svg className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.95)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a6.5 6.5 0 0 0-6.5 6.5c0 2.4 1.3 4.4 3.2 5.5v1.5a1.8 1.8 0 0 0 1.8 1.8h3a1.8 1.8 0 0 0 1.8-1.8V14c1.9-1.1 3.2-3.1 3.2-5.5A6.5 6.5 0 0 0 12 2z" fill="#bae6fd" stroke="#ffffff" strokeWidth="1.8" />
                    <path d="M9.5 9.5h5" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                    <path d="M10 12.5h4" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                    <path d="M10 19h4" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M10.5 21.5h3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="absolute -bottom-2 rounded-full bg-gradient-to-r from-cyan-200 via-sky-300 to-cyan-400 border border-cyan-950/40 px-2.5 py-0.5 text-[10px] font-black text-cyan-950 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_0_10px_rgba(56,189,248,0.95)] tracking-wider leading-none">
                  HINT
                </span>
              </button>
            </div>
          </div>

          {/* 3D Glassmorphic "Protocol Instructions" Banner Modal for Main Game */}
          {showMainInstructionsModal && (
            <div className="fixed inset-0 z-50 bg-[#06122c]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="relative w-full max-w-[315px] sm:max-w-[335px] rounded-[32px] p-3.5 pt-9 sm:pt-10 bg-gradient-to-b from-white/95 via-[#f0f7ff]/95 to-[#e0efff]/95 border-2 border-white/90 shadow-[0_25px_60px_-10px_rgba(8,24,68,0.6),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(56,189,248,0.2)] text-center overflow-visible max-h-[78vh] sm:max-h-[80vh] flex flex-col">

                {/* Top Close Button (Top-Right) */}
                <button
                  onClick={() => {
                    sound.click();
                    setShowMainInstructionsModal(false);
                  }}
                  aria-label="Close Instructions"
                  title="Close Instructions"
                  className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-blue-100/90 hover:bg-blue-200 border border-white text-[#1e3a8a] flex items-center justify-center font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                {/* 3D Hero + Halo + Arched Banner (Floating Overflow Compact) */}
                <div className="absolute -top-11 sm:-top-12 left-1/2 -translate-x-1/2 w-52 flex flex-col items-center pointer-events-none z-20">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute -bottom-1 w-24 h-10 bg-gradient-to-t from-[#bae6fd] to-white rounded-full blur-[1px] shadow-sm -z-10" />
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border-2 border-cyan-200 flex items-center justify-center text-2xl sm:text-3xl shadow-[0_6px_16px_rgba(14,165,233,0.5),inset_0_2px_4px_rgba(255,255,255,0.7)]">
                      <span className="drop-shadow-md">📐</span>
                    </div>
                  </div>

                  {/* Arched 3D Banner "Instructions" */}
                  <div className="relative -mt-2 w-52 h-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(29,78,216,0.45)] scale-90">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 52" fill="none">
                      <path d="M12 36 L0 26 L12 16 L22 22 L22 34 Z" fill="#1e40af" />
                      <path d="M22 22 L35 14 L35 34 L22 34 Z" fill="#172554" />
                      <path d="M208 36 L220 26 L208 16 L198 22 L198 34 Z" fill="#1e40af" />
                      <path d="M198 22 L185 14 L185 34 L198 34 Z" fill="#172554" />
                      <path d="M18 20 C60 6, 160 6, 202 20 C206 36, 196 46, 185 45 C150 38, 70 38, 35 45 C24 46, 14 36, 18 20 Z" fill="url(#mainInstructionsRibbonGrad)" stroke="#60a5fa" strokeWidth="2" />
                      <defs>
                        <linearGradient id="mainInstructionsRibbonGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="relative z-10 flex items-center justify-center pb-0.5 select-none">
                      <span className="font-black text-sm sm:text-base tracking-wide text-[#fde047] drop-shadow-[0_2px_4px_rgba(180,83,9,0.9)] font-display">
                        Instructions
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center justify-center gap-2 my-1 mt-1 shrink-0">
                  <div className="h-[1.5px] w-8 bg-gradient-to-r from-transparent via-blue-300 to-blue-400 rounded-full" />
                  <div className="w-5 h-5 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-600 shadow-inner">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </div>
                  <div className="h-[1.5px] w-8 bg-gradient-to-l from-transparent via-blue-300 to-blue-400 rounded-full" />
                </div>

                {/* Headline & Description */}
                <h2 className="text-[#152a55] font-black text-xs sm:text-sm tracking-tight font-display mb-0.5 shrink-0">
                  Mission L{selectedLevelNum} // How to Play
                </h2>
                <p className="text-[#4b618a] text-[9px] sm:text-[9.5px] font-semibold px-2 leading-tight mb-1.5 shrink-0">
                  Follow these mission rules to solve the math puzzle grid:
                </p>

                {/* Scrollable Marked Instructions Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 text-left pr-0.5">
                  
                  {/* 1. Crossword Calculation */}
                  <div className="p-1.5 sm:p-2 rounded-xl bg-white/90 border border-blue-200/80 shadow-xs">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs">🔢</span>
                      <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-blue-950 font-display">
                        1. Equation Balance
                      </span>
                    </div>
                    <p className="text-[8.5px] sm:text-[9px] text-slate-700 font-medium leading-tight">
                      Fill all blank target slots on the grid. Every equation evaluates sequentially from left-to-right and top-to-bottom to equal the target result.
                    </p>
                  </div>

                  {/* 2. Cross Junction Intersections */}
                  <div className="p-1.5 sm:p-2 rounded-xl bg-[#eff6ff] border border-cyan-300/80 shadow-xs">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs">🔗</span>
                      <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-blue-900 font-display">
                        2. Intersecting Tiles
                      </span>
                    </div>
                    <p className="text-[8.5px] sm:text-[9px] text-slate-700 font-medium leading-tight">
                      Number tiles placed at intersection points must satisfy <b>both</b> the horizontal row and vertical column equations simultaneously.
                    </p>
                  </div>

                  {/* 3. Tap & Tray Controls */}
                  <div className="p-1.5 sm:p-2 rounded-xl bg-[#faf5ff] border border-purple-300/80 shadow-xs">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs">👆</span>
                      <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-purple-900 font-display">
                        3. Number Placement
                      </span>
                    </div>
                    <p className="text-[8.5px] sm:text-[9px] text-slate-700 font-medium leading-tight">
                      Tap any empty slot on the grid, then tap a number from the green tray below. Use <b>Undo</b> or <b>Reroll ↻</b> anytime!
                    </p>
                  </div>

                  {/* 4. Pro Parity Tip */}
                  <div className="p-1.5 sm:p-2 rounded-xl bg-[#fffbeb] border border-amber-300/80 shadow-xs">
                    <div className="flex items-center gap-1 mb-0.5">
                      <span className="text-xs">💡</span>
                      <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-amber-950 font-display">
                        4. Tactical Math Tip
                      </span>
                    </div>
                    <p className="text-[8.5px] sm:text-[9px] text-slate-700 font-medium leading-tight">
                      Remember: <b>Even + Odd = Odd</b> and <b>Even + Even = Even</b>. Check the target numbers to quickly eliminate impossible tiles!
                    </p>
                  </div>

                </div>

                {/* Action Controls */}
                <div className="pt-2 shrink-0">
                  <button
                    onClick={() => {
                      sound.click();
                      setShowMainInstructionsModal(false);
                    }}
                    aria-label="Resume Mission"
                    className="w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-b from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] border-2 border-blue-200/90 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_3px_0_#1e40af,0_6px_16px_rgba(37,99,235,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_1px_0_#1e40af] transition-all cursor-pointer"
                  >
                    <span>✓</span>
                    <span>Got It! Resume Mission</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* 3D Glassmorphic "Time Out" Banner Modal (Matching Reference Design) */}
          {isTimeOver && (
            <div className="fixed inset-0 z-50 bg-[#06122c]/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Glassmorphic Popup Card */}
              <div className="relative w-full max-w-[320px] sm:max-w-[335px] rounded-[36px] p-5 sm:p-6 pt-14 sm:pt-16 bg-gradient-to-b from-white/95 via-[#f0f7ff]/95 to-[#e0efff]/95 border-2 border-white/90 shadow-[0_25px_60px_-10px_rgba(8,24,68,0.6),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(56,189,248,0.2)] text-center overflow-visible">

                {/* Top Close Button (Top-Right) */}
                <button
                  onClick={() => {
                    sound.click();
                    setIsTimeOver(false);
                    navigateTo('levels');
                  }}
                  aria-label="Close"
                  title="Close"
                  className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-blue-100/90 hover:bg-blue-200 border border-white text-[#1e3a8a] flex items-center justify-center font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                {/* 3D Hourglass Hero + Halo + Arched Banner (Floating Overflow) */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-52 flex flex-col items-center pointer-events-none z-20">
                  {/* Cloud base & Splash petals behind hourglass */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute -bottom-1.5 w-28 h-10 bg-gradient-to-t from-[#bae6fd] to-white rounded-full blur-[1px] shadow-sm -z-10" />

                    {/* Left Splashes */}
                    <svg className="absolute -left-0.5 top-2 w-7 h-7 text-[#38bdf8] drop-shadow-[0_2px_4px_rgba(56,189,248,0.45)] -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <svg className="absolute -left-3 top-6 w-5 h-5 text-[#0ea5e9] drop-shadow-[0_1.5px_3px_rgba(14,165,233,0.35)] -rotate-45" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>

                    {/* Right Splashes */}
                    <svg className="absolute -right-0.5 top-2 w-7 h-7 text-[#38bdf8] drop-shadow-[0_2px_4px_rgba(56,189,248,0.45)] rotate-12 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <svg className="absolute -right-3 top-6 w-5 h-5 text-[#0ea5e9] drop-shadow-[0_1.5px_3px_rgba(14,165,233,0.35)] rotate-45 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>

                    {/* 3D Hourglass SVG Graphic (Sleek Compact Size) */}
                    <svg className="w-20 h-20 drop-shadow-[0_6px_14px_rgba(14,165,233,0.4)]" viewBox="0 0 100 100" fill="none">
                      <ellipse cx="50" cy="18" rx="22" ry="7" fill="url(#timeOutHgBlue)" stroke="#38bdf8" strokeWidth="2" />
                      <ellipse cx="50" cy="16" rx="19" ry="5" fill="#7dd3fc" />
                      <ellipse cx="50" cy="82" rx="22" ry="7" fill="url(#timeOutHgBlue)" stroke="#38bdf8" strokeWidth="2" />
                      <ellipse cx="50" cy="80" rx="19" ry="5" fill="#0284c7" />
                      <path d="M33 20 C33 42, 46 48, 46 50 C46 52, 33 58, 33 80 L67 80 C67 58, 54 52, 54 50 C54 48, 67 42, 67 20 Z" fill="rgba(224, 242, 254, 0.45)" stroke="#38bdf8" strokeWidth="2.5" />
                      <path d="M36 24 C36 38, 46 44, 46 50 C46 56, 36 62, 36 76" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" />
                      <path d="M38 32 C38 43, 47 47, 50 49 C53 47, 62 43, 62 32 Z" fill="url(#timeOutHgGold)" />
                      <ellipse cx="50" cy="32" rx="12" ry="3" fill="#fde047" />
                      <line x1="50" y1="49" x2="50" y2="68" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
                      <path d="M36 78 C38 68, 46 64, 50 64 C54 64, 62 68, 64 78 Z" fill="url(#timeOutHgGold)" />
                      <defs>
                        <linearGradient id="timeOutHgBlue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#38bdf8" />
                          <stop offset="50%" stopColor="#0284c7" />
                          <stop offset="100%" stopColor="#0369a1" />
                        </linearGradient>
                        <linearGradient id="timeOutHgGold" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="40%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#d97706" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  {/* Arched 3D Banner "Time Out" (Clean, Compact, No Stars) */}
                  <div className="relative -mt-2.5 w-48 h-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(29,78,216,0.45)]">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 52" fill="none">
                      <path d="M12 36 L0 26 L12 16 L22 22 L22 34 Z" fill="#1e40af" />
                      <path d="M22 22 L35 14 L35 34 L22 34 Z" fill="#172554" />
                      <path d="M208 36 L220 26 L208 16 L198 22 L198 34 Z" fill="#1e40af" />
                      <path d="M198 22 L185 14 L185 34 L198 34 Z" fill="#172554" />
                      <path d="M18 20 C60 6, 160 6, 202 20 C206 36, 196 46, 185 45 C150 38, 70 38, 35 45 C24 46, 14 36, 18 20 Z" fill="url(#timeOutRibbonGrad)" stroke="#60a5fa" strokeWidth="2" />
                      <defs>
                        <linearGradient id="timeOutRibbonGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="50%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#1d4ed8" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="relative z-10 flex items-center justify-center pb-0.5 select-none">
                      <span className="font-black text-base sm:text-[17px] tracking-tight text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.6)] font-display">
                        Time <span className="text-[#fde047] drop-shadow-[0_2px_4px_rgba(180,83,9,0.8)]">Out</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Clock Divider */}
                <div className="flex items-center justify-center gap-2.5 my-2.5">
                  <div className="h-[1.5px] w-10 bg-gradient-to-r from-transparent via-blue-300 to-blue-400 rounded-full" />
                  <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-600 shadow-inner">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </div>
                  <div className="h-[1.5px] w-10 bg-gradient-to-l from-transparent via-blue-300 to-blue-400 rounded-full" />
                </div>

                {/* Headline & Description */}
                <h2 className="text-[#152a55] font-black text-lg sm:text-xl tracking-tight font-display mb-0.5">
                  Take a short break!
                </h2>
                <p className="text-[#4b618a] text-xs font-semibold px-2 leading-relaxed mb-5">
                  You can continue the game anytime you're ready.
                </p>

                {/* Action Controls */}
                <div className="space-y-2.5">
                  {/* Primary 3D Restart Button */}
                  <button
                    onClick={restartLevelAfterTimeout}
                    aria-label="Restart Level"
                    className="w-full h-12 rounded-full bg-gradient-to-b from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] border-2 border-blue-200/90 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_0_#1e40af,0_8px_20px_rgba(37,99,235,0.4),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#1e40af] transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-white stroke-[2.8] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    <span>Restart</span>
                  </button>

                  {/* Secondary Options: +30s Extra Time (Ad) & Level Select */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      onClick={() => handleWatchAd('time', 30, 'Chronometer Extender Sponsor')}
                      aria-label="Extra Time (+30s)"
                      className="h-10 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 border border-amber-200 text-amber-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_2.5px_0_#b45309,0_5px_12px_rgba(245,158,11,0.3)] active:translate-y-0.5 active:shadow-[0_1px_0_#b45309] transition-all cursor-pointer"
                    >
                      <span>⚡</span>
                      <span>+30s Time</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.click();
                        setIsTimeOver(false);
                        navigateTo('levels');
                      }}
                      aria-label="Levels"
                      className="h-10 rounded-2xl bg-blue-100/90 hover:bg-blue-200/90 border border-blue-300 text-blue-900 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_2.5px_0_#93c5fd] active:translate-y-0.5 active:shadow-[0_1px_0_#93c5fd] transition-all cursor-pointer"
                    >
                      <span>⊞</span>
                      <span>Missions</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 3D Glassmorphic "Calculation Error / Try Again" Banner Modal */}
          {isWrongModalOpen && (
            <div className="fixed inset-0 z-50 bg-[#06122c]/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Glassmorphic Popup Card */}
              <div className="relative w-full max-w-[320px] sm:max-w-[335px] rounded-[36px] p-5 sm:p-6 pt-14 sm:pt-16 bg-gradient-to-b from-white/95 via-[#f0f7ff]/95 to-[#e0efff]/95 border-2 border-white/90 shadow-[0_25px_60px_-10px_rgba(8,24,68,0.6),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(244,63,94,0.2)] text-center overflow-visible">

                {/* Top Close Button (Top-Right) */}
                <button
                  onClick={() => {
                    sound.click();
                    setIsWrongModalOpen(false);
                  }}
                  aria-label="Close"
                  title="Close"
                  className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-rose-100/90 hover:bg-rose-200 border border-white text-rose-800 flex items-center justify-center font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                {/* 3D Hero Pod + Halo + Arched Banner (Floating Overflow) */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-52 flex flex-col items-center pointer-events-none z-20">
                  {/* Cloud base & Splash petals behind icon */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute -bottom-1.5 w-28 h-10 bg-gradient-to-t from-[#fecdd3] to-white rounded-full blur-[1px] shadow-sm -z-10" />

                    {/* Left Splashes */}
                    <svg className="absolute -left-0.5 top-2 w-7 h-7 text-[#fb7185] drop-shadow-[0_2px_4px_rgba(251,113,133,0.45)] -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <svg className="absolute -left-3 top-6 w-5 h-5 text-[#f43f5e] drop-shadow-[0_1.5px_3px_rgba(244,63,94,0.35)] -rotate-45" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>

                    {/* Right Splashes */}
                    <svg className="absolute -right-0.5 top-2 w-7 h-7 text-[#fb7185] drop-shadow-[0_2px_4px_rgba(251,113,133,0.45)] rotate-12 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <svg className="absolute -right-3 top-6 w-5 h-5 text-[#f43f5e] drop-shadow-[0_1.5px_3px_rgba(244,63,94,0.35)] rotate-45 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>

                    {/* 3D Red Alert Sphere Hero (Sleek Compact Size) */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#fb7185] via-[#f43f5e] to-[#be123c] border-[3px] border-white/95 text-white flex items-center justify-center text-3xl font-black shadow-[0_8px_18px_rgba(225,29,72,0.5),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-3px_5px_rgba(159,18,57,0.7)] drop-shadow-[0_6px_14px_rgba(244,63,94,0.35)]">
                      <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] select-none">✕</span>
                    </div>
                  </div>

                  {/* Arched 3D Banner "Try Again" (Clean, Compact, No Stars) */}
                  <div className="relative -mt-2.5 w-48 h-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(190,18,60,0.45)]">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 52" fill="none">
                      <path d="M12 36 L0 26 L12 16 L22 22 L22 34 Z" fill="#9f1239" />
                      <path d="M22 22 L35 14 L35 34 L22 34 Z" fill="#4c0519" />
                      <path d="M208 36 L220 26 L208 16 L198 22 L198 34 Z" fill="#9f1239" />
                      <path d="M198 22 L185 14 L185 34 L198 34 Z" fill="#4c0519" />
                      <path d="M18 20 C60 6, 160 6, 202 20 C206 36, 196 46, 185 45 C150 38, 70 38, 35 45 C24 46, 14 36, 18 20 Z" fill="url(#wrongRibbonGrad)" stroke="#fda4af" strokeWidth="2" />
                      <defs>
                        <linearGradient id="wrongRibbonGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f43f5e" />
                          <stop offset="50%" stopColor="#e11d48" />
                          <stop offset="100%" stopColor="#be123c" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="relative z-10 flex items-center justify-center pb-0.5 select-none">
                      <span className="font-black text-base sm:text-[17px] tracking-tight text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.6)] font-display">
                        Try <span className="text-[#fde047] drop-shadow-[0_2px_4px_rgba(180,83,9,0.8)]">Again</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Alert Divider */}
                <div className="flex items-center justify-center gap-2.5 my-2.5">
                  <div className="h-[1.5px] w-10 bg-gradient-to-r from-transparent via-rose-300 to-rose-400 rounded-full" />
                  <div className="w-6 h-6 rounded-full bg-rose-100 border border-rose-300 flex items-center justify-center text-rose-600 shadow-inner">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div className="h-[1.5px] w-10 bg-gradient-to-l from-transparent via-rose-300 to-rose-400 rounded-full" />
                </div>

                {/* Headline & Description */}
                <h2 className="text-[#4c0519] font-black text-lg sm:text-xl tracking-tight font-display mb-0.5">
                  Calculation Error!
                </h2>
                <p className="text-[#64748b] text-xs font-semibold px-2 leading-relaxed mb-2.5">
                  One or more equations don't balance.
                </p>

                {/* Diagnostic Card */}
                <div className="bg-rose-50/90 border border-rose-200/80 rounded-2xl p-2.5 mb-4 shadow-inner">
                  <span className="text-[9.5px] font-mono text-rose-700/80 block uppercase tracking-wider font-bold">Diagnostic Analysis</span>
                  <span className="text-[11.5px] font-black text-rose-800">Check number placements & signs</span>
                </div>

                {/* Action Controls */}
                <div className="space-y-2.5">
                  {/* Primary 3D Retry Button */}
                  <button
                    onClick={retryCurrentStage}
                    aria-label="Retry Puzzle"
                    className="w-full h-12 rounded-full bg-gradient-to-b from-[#f43f5e] via-[#e11d48] to-[#be123c] border-2 border-rose-200/90 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_0_#9f1239,0_8px_20px_rgba(225,29,72,0.4),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#9f1239] transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-white stroke-[2.8] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    <span>Retry Game ({stageNum}/{stageTotal})</span>
                  </button>

                  {/* Secondary Options: Hint & Mission Select */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      onClick={() => {
                        sound.click();
                        setIsWrongModalOpen(false);
                        navigateTo('hint');
                      }}
                      aria-label="View Hint"
                      className="h-10 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 border border-amber-200 text-amber-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_2.5px_0_#b45309,0_5px_12px_rgba(245,158,11,0.3)] active:translate-y-0.5 active:shadow-[0_1px_0_#b45309] transition-all cursor-pointer"
                    >
                      <span>💡</span>
                      <span>View Hint</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.click();
                        setIsWrongModalOpen(false);
                        navigateTo('levels');
                      }}
                      aria-label="Missions"
                      className="h-10 rounded-2xl bg-blue-100/90 hover:bg-blue-200/90 border border-blue-300 text-blue-900 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_2.5px_0_#93c5fd] active:translate-y-0.5 active:shadow-[0_1px_0_#93c5fd] transition-all cursor-pointer"
                    >
                      <span>⊞</span>
                      <span>Missions</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 3D Glassmorphic "Puzzle Solved / Accomplished" Success Banner Modal */}
          {isCorrectModalOpen && (
            <div className="fixed inset-0 z-50 bg-[#06122c]/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Glassmorphic Popup Card */}
              <div className="relative w-full max-w-[320px] sm:max-w-[335px] rounded-[36px] p-5 sm:p-6 pt-14 sm:pt-16 bg-gradient-to-b from-white/95 via-[#f0fdf4]/95 to-[#dcfce7]/95 border-2 border-white/90 shadow-[0_25px_60px_-10px_rgba(8,24,68,0.6),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(34,197,94,0.2)] text-center overflow-visible">

                {/* Top Close Button (Top-Right) */}
                <button
                  onClick={() => {
                    sound.click();
                    setIsCorrectModalOpen(false);
                  }}
                  aria-label="Close"
                  title="Close"
                  className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-emerald-100/90 hover:bg-emerald-200 border border-white text-emerald-800 flex items-center justify-center font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                {/* 3D Hero Pod + Halo + Arched Banner (Floating Overflow) */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-52 flex flex-col items-center pointer-events-none z-20">
                  {/* Cloud base & Splash petals behind icon */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute -bottom-1.5 w-28 h-10 bg-gradient-to-t from-[#bbf7d0] to-white rounded-full blur-[1px] shadow-sm -z-10" />

                    {/* Left Splashes */}
                    <svg className="absolute -left-0.5 top-2 w-7 h-7 text-[#4ade80] drop-shadow-[0_2px_4px_rgba(74,222,128,0.45)] -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <svg className="absolute -left-3 top-6 w-5 h-5 text-[#22c55e] drop-shadow-[0_1.5px_3px_rgba(34,197,94,0.35)] -rotate-45" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>

                    {/* Right Splashes */}
                    <svg className="absolute -right-0.5 top-2 w-7 h-7 text-[#4ade80] drop-shadow-[0_2px_4px_rgba(74,222,128,0.45)] rotate-12 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <svg className="absolute -right-3 top-6 w-5 h-5 text-[#22c55e] drop-shadow-[0_1.5px_3px_rgba(34,197,94,0.35)] rotate-45 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>

                    {/* 3D Emerald Checkmark Sphere Hero (Sleek Compact Size) */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#4ade80] via-[#22c55e] to-[#15803d] border-[3px] border-white/95 text-white flex items-center justify-center text-3xl font-black shadow-[0_8px_18px_rgba(34,197,94,0.5),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-3px_5px_rgba(21,128,61,0.7)] drop-shadow-[0_6px_14px_rgba(34,197,94,0.35)]">
                      <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] select-none">✓</span>
                    </div>
                  </div>

                  {/* Arched 3D Banner "Solved!" or "Cleared!" (Clean, Compact, No Stars) */}
                  <div className="relative -mt-2.5 w-48 h-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(21,128,61,0.45)]">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 52" fill="none">
                      <path d="M12 36 L0 26 L12 16 L22 22 L22 34 Z" fill="#14532d" />
                      <path d="M22 22 L35 14 L35 34 L22 34 Z" fill="#052e16" />
                      <path d="M208 36 L220 26 L208 16 L198 22 L198 34 Z" fill="#14532d" />
                      <path d="M198 22 L185 14 L185 34 L198 34 Z" fill="#052e16" />
                      <path d="M18 20 C60 6, 160 6, 202 20 C206 36, 196 46, 185 45 C150 38, 70 38, 35 45 C24 46, 14 36, 18 20 Z" fill="url(#correctRibbonGrad)" stroke="#86efac" strokeWidth="2" />
                      <defs>
                        <linearGradient id="correctRibbonGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" />
                          <stop offset="50%" stopColor="#16a34a" />
                          <stop offset="100%" stopColor="#15803d" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="relative z-10 flex items-center justify-center pb-0.5 select-none">
                      <span className="font-black text-base sm:text-[17px] tracking-tight text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.6)] font-display">
                        {lastResult.levelCleared ? (
                          <>Level <span className="text-[#fde047] drop-shadow-[0_2px_4px_rgba(180,83,9,0.8)]">Cleared</span></>
                        ) : (
                          <>Puzzle <span className="text-[#fde047] drop-shadow-[0_2px_4px_rgba(180,83,9,0.8)]">Solved</span></>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Success Divider */}
                <div className="flex items-center justify-center gap-2.5 my-2.5">
                  <div className="h-[1.5px] w-10 bg-gradient-to-r from-transparent via-emerald-300 to-emerald-400 rounded-full" />
                  <div className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shadow-inner">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <div className="h-[1.5px] w-10 bg-gradient-to-l from-transparent via-emerald-300 to-emerald-400 rounded-full" />
                </div>

                {/* Headline & Description */}
                <h2 className="text-[#052e16] font-black text-lg sm:text-xl tracking-tight font-display mb-0.5">
                  {lastResult.levelCleared ? 'Mission Accomplished!' : 'Puzzle Solved!'}
                </h2>
                <p className="text-[#334155] text-xs font-semibold px-2 leading-relaxed mb-2.5">
                  {lastResult.levelCleared
                    ? `Level ${lastResult.level} Cleared • All ${lastResult.total} Puzzles Done!`
                    : `Level ${lastResult.level} • Puzzle ${lastResult.stage} of ${lastResult.total} Complete`}
                </p>

                {/* Solved Math Box */}
                {lastResult.solvedText && (
                  <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-2 mb-2.5 shadow-inner">
                    <span className="text-[9.5px] font-mono text-emerald-700/80 block uppercase tracking-wider font-bold">Solved Equation</span>
                    <span className="text-base sm:text-lg font-black font-mono text-emerald-900">{lastResult.solvedText}</span>
                  </div>
                )}

                {/* Rewards Capsules */}
                <div className="flex items-center gap-2 flex-wrap justify-center mb-4">
                  <div className="bg-white/90 border border-emerald-300 rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                    <span className="text-amber-500">⭐</span>
                    <span className="text-emerald-950 font-black text-xs">+{lastResult.xp} XP</span>
                  </div>
                  <div className="bg-white/90 border border-amber-300 rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                    <img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coins" className="w-4 h-4 object-contain" />
                    <span className="text-amber-950 font-black text-xs">+{lastResult.coins} Coins</span>
                  </div>
                  {lastResult.gems > 0 && (
                    <div className="bg-white/90 border border-sky-300 rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                      <img src="/assets/icon_gem_3d_clean.webp" alt="Diamonds" className="w-4 h-4 object-contain" />
                      <span className="text-sky-950 font-black text-xs">+{lastResult.gems} Gems</span>
                    </div>
                  )}
                </div>

                {/* Action Controls */}
                <div className="space-y-2.5">
                  {/* Primary 3D Next Button */}
                  {lastResult.levelCleared ? (
                    <button
                      onClick={() => {
                        sound.click();
                        setIsCorrectModalOpen(false);
                        attemptStartLevel(Math.min(25, selectedLevelNum));
                      }}
                      aria-label="Next Mission"
                      className="w-full h-12 rounded-full bg-gradient-to-b from-[#4ade80] via-[#22c55e] to-[#15803d] border-2 border-emerald-200/90 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_0_#14532d,0_8px_20px_rgba(34,197,94,0.4),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#14532d] transition-all cursor-pointer"
                    >
                      <span>Next Mission (Level {selectedLevelNum}) →</span>
                    </button>
                  ) : (
                    <button
                      onClick={continueToNextStage}
                      aria-label="Next Puzzle"
                      className="w-full h-12 rounded-full bg-gradient-to-b from-[#4ade80] via-[#22c55e] to-[#15803d] border-2 border-emerald-200/90 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_0_#14532d,0_8px_20px_rgba(34,197,94,0.4),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#14532d] transition-all cursor-pointer"
                    >
                      <span>Next Game ({stageNum}/{stageTotal}) →</span>
                    </button>
                  )}

                  {/* Secondary Options: Missions & Home */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    <button
                      onClick={() => {
                        sound.click();
                        setIsCorrectModalOpen(false);
                        navigateTo('levels');
                      }}
                      aria-label="Missions"
                      className="h-10 rounded-2xl bg-blue-100/90 hover:bg-blue-200/90 border border-blue-300 text-blue-900 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_2.5px_0_#93c5fd] active:translate-y-0.5 active:shadow-[0_1px_0_#93c5fd] transition-all cursor-pointer"
                    >
                      <span>⊞</span>
                      <span>Missions</span>
                    </button>
                    <button
                      onClick={() => {
                        sound.click();
                        setIsCorrectModalOpen(false);
                        navigateTo('home');
                      }}
                      aria-label="Return to Home"
                      className="h-10 rounded-2xl bg-slate-100/90 hover:bg-slate-200/90 border border-slate-300 text-slate-800 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_2.5px_0_#cbd5e1] active:translate-y-0.5 active:shadow-[0_1px_0_#cbd5e1] transition-all cursor-pointer"
                    >
                      <span>🏠</span>
                      <span>Home</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}
          </div>
        );
      };

      // ========================================================
      // 7. HINT BOTTOM SHEET (Modern Sci-Fi Edition - 3 Interactive Steps)
      // ========================================================
      const renderHintScreen = () => {
        const slots = activePuzzle.slots || [];
        const rows = activePuzzle.rows || [];

        const getCellVal = (cell) => {
          if (cell === null || cell === undefined) return '';
          if (typeof cell === 'object' && cell.slot !== undefined) {
            const found = slots.find(s => s.slot === cell.slot);
            return found ? String(found.answer) : `?`;
          }
          return String(cell);
        };

        const getRowEq = (row) => {
          if (!row || row.length < 5) return null;
          const a = getCellVal(row[0]);
          const op = row[1];
          const b = getCellVal(row[2]);
          const eq = row[3];
          const c = getCellVal(row[4]);
          if (!a || !op || !b || eq !== '=' || !c) return null;
          return `${a} ${op} ${b} = ${c}`;
        };

        const getColEq = (colIdx) => {
          if (!rows || rows.length < 5) return null;
          const a = getCellVal(rows[0][colIdx]);
          const op = rows[1][colIdx];
          const b = getCellVal(rows[2][colIdx]);
          const eq = rows[3][colIdx];
          const c = getCellVal(rows[4][colIdx]);
          if (!a || !op || !b || eq !== '=' || !c) return null;
          return `${a} ${op} ${b} = ${c}`;
        };

        const row0Eq = getRowEq(rows[0]) || activePuzzle.solvedText || 'Top Row Balanced';
        const row2Eq = getRowEq(rows[2]);
        const row4Eq = getRowEq(rows[4]);
        const col0Eq = getColEq(0);

        const hintSteps = [
          {
            stepNum: 1,
            title: "Recommended Move • Step 1",
            badge: "TOP ROW ANCHOR",
            equation: `Top row: ${row0Eq}`,
            tip: "Solve the top horizontal row first to lock in the opening anchor tile."
          },
          {
            stepNum: 2,
            title: "Recommended Move • Step 2",
            badge: row2Eq ? "CENTER JUNCTION" : "LEFT COLUMN",
            equation: row2Eq ? `Middle row: ${row2Eq}` : (col0Eq ? `Left col: ${col0Eq}` : `Junction intersection balanced`),
            tip: "Shared junction tiles must satisfy both horizontal and vertical operations."
          },
          {
            stepNum: 3,
            title: "Recommended Move • Step 3",
            badge: "BOTTOM BALANCE",
            equation: row4Eq ? `Bottom row: ${row4Eq}` : `Final row balanced`,
            tip: "Place the remaining numbers from your tray to balance the final equation and complete the matrix."
          }
        ];

        const currentStep = hintSteps[hintActiveStep] || hintSteps[0];

        const handleWatchAdForSolveHint = () => {
          handleWatchAd('hint', 1, 'Quantum Solver Hint Video', {
            onComplete: () => {
              const unfilled = puzzleSlots.find(({ slot }) => puzzleAnswers[slot] === undefined || puzzleAnswers[slot] === null);
              if (unfilled) {
                const nextAnswers = { ...puzzleAnswers, [unfilled.slot]: unfilled.answer };
                puzzleAnswersRef.current = nextAnswers;
                setPuzzleAnswers(nextAnswers);
                setRewardToast(`💡 Free Slot Revealed: Slot ${unfilled.slot + 1} = ${unfilled.answer}!`);
                navigateTo('game');
                setTimeout(() => {
                  submitPuzzle(nextAnswers);
                }, 400);
              } else {
                navigateTo('game');
              }
            }
          });
        };

        return (
          <div className="flex-1 bg-black/75 backdrop-blur-sm flex flex-col justify-end select-none relative">
            <div className="bg-gradient-to-b from-[#132a63] to-[#0b183b] border-t-2 border-cyan-400/70 rounded-t-[32px] p-5 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] text-white space-y-3.5 animate-in slide-in-from-bottom duration-200">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-cyan-400/20 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-300/50 flex items-center justify-center text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                    <svg className="w-5 h-5 text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a6 6 0 0 0-6 6c0 2.2 1.2 4.1 3 5.1V15a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-1.9c1.8-1 3-2.9 3-5.1a6 6 0 0 0-6-6z" fill="#fef08a" stroke="#ffffff" strokeWidth="1.8" />
                      <path d="M9.5 9h5" stroke="#f59e0b" strokeWidth="1.8" />
                      <path d="M10 12h4" stroke="#f59e0b" strokeWidth="1.8" />
                      <path d="M10 20h4" stroke="#ffffff" strokeWidth="2.5" />
                    </svg>
                  </div>
                  <h2 className="text-base font-black font-display text-white">Quantum Hint Terminal</h2>
                </div>
                <button 
                  onClick={() => { sound.click(); navigateTo('game'); }} 
                  aria-label="Close Hint"
                  className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 flex items-center justify-center text-sm font-black hover:text-white cursor-pointer active:scale-95"
                >
                  ✕
                </button>
              </div>

              {/* Instructions Summary */}
              <p className="text-xs font-bold text-cyan-200/90">
                Fill the empty target slots so all intersecting horizontal and vertical equations resolve correctly:
              </p>
              <ol className="text-xs text-slate-300 space-y-1 pl-4 list-decimal">
                <li>First horizontal row balances: <b className="text-cyan-300">{activePuzzle.solvedText}</b>.</li>
                <li>Shared junction tiles must satisfy both intersecting arithmetic operations.</li>
                <li>Tap an empty slot to focus, then press a key in the number tray.</li>
              </ol>

              {/* Step Diagnostic Card (Interactive) */}
              <div className="bg-[#0c1f4c] border border-cyan-400/50 rounded-2xl p-4 shadow-inner relative overflow-hidden transition-all">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 block font-mono">
                    {currentStep.title}
                  </span>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-400/50 text-cyan-300 tracking-wider font-mono">
                    {currentStep.badge}
                  </span>
                </div>
                <div className="text-lg font-black font-mono text-white tracking-wide py-1">
                  {currentStep.equation}
                </div>
                <p className="text-xs text-cyan-200/80 mt-1 leading-relaxed">
                  {currentStep.tip}
                </p>
              </div>

              {/* Interactive Pagination Controls & 3 Dots */}
              <div className="flex items-center justify-between px-1 py-1">
                <button
                  onClick={() => {
                    sound.click();
                    setHintActiveStep(prev => Math.max(0, prev - 1));
                  }}
                  disabled={hintActiveStep === 0}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    hintActiveStep === 0
                      ? 'opacity-30 cursor-not-allowed text-slate-500'
                      : 'bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 hover:text-white cursor-pointer active:scale-95'
                  }`}
                >
                  ‹ Prev
                </button>

                {/* 3 Clickable Pagination Dots */}
                <div className="flex items-center gap-2">
                  {hintSteps.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        sound.click();
                        setHintActiveStep(idx);
                      }}
                      aria-label={`Show Hint Step ${idx + 1}`}
                      title={`Step ${idx + 1}: ${step.badge}`}
                      className={`transition-all duration-300 rounded-full cursor-pointer ${
                        hintActiveStep === idx
                          ? 'w-7 h-2.5 bg-gradient-to-r from-cyan-400 to-sky-300 shadow-[0_0_10px_rgba(0,229,255,0.95)]'
                          : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => {
                    sound.click();
                    setHintActiveStep(prev => Math.min(hintSteps.length - 1, prev + 1));
                  }}
                  disabled={hintActiveStep === hintSteps.length - 1}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    hintActiveStep === hintSteps.length - 1
                      ? 'opacity-30 cursor-not-allowed text-slate-500'
                      : 'bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 hover:text-white cursor-pointer active:scale-95'
                  }`}
                >
                  Next ›
                </button>
              </div>

              {/* Action Buttons: Free Slot Reveal via Ad & Resume */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleWatchAdForSolveHint}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-amber-950 font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-200 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>▶</span>
                  <span>Reveal 1 Number Free (Watch Ad)</span>
                </button>
                <button
                  onClick={() => { sound.click(); navigateTo('game'); }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_16px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Resume Mission
                </button>
              </div>
            </div>
          </div>
        );
      };

      // ========================================================
      // 8. CORRECT RESULT (Modern Sci-Fi Arcade Celebration)
      // ========================================================
      const renderCorrectScreen = () => (
        <div className="flex-1 scifi-game-bg flex flex-col justify-between items-center text-center px-6 py-6 select-none text-white relative overflow-hidden">
          {/* Blueprint Grid */}
          <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />

          <div className="my-auto flex flex-col items-center relative z-10 max-w-xs w-full">
            {/* Celebration Glowing Sphere */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 border-4 border-emerald-300 text-white flex items-center justify-center text-4xl font-black shadow-[0_0_40px_rgba(16,185,129,0.7)] animate-victory-glow mb-4">
              ✓
            </div>
            
            <h2 className="text-2xl font-black font-display text-white tracking-tight">
              {lastResult.levelCleared ? 'MISSION ACCOMPLISHED!' : 'PUZZLE SOLVED!'}
            </h2>
            <p className="text-xs text-cyan-200/80 mt-1">
              {lastResult.levelCleared
                ? `Level ${lastResult.level} Cleared • All ${lastResult.total} Puzzles Done!`
                : `Level ${lastResult.level} • Puzzle ${lastResult.stage} of ${lastResult.total} Complete`}
            </p>

            {/* Level Puzzle Progress */}
            <div className="w-full mt-3 h-2 rounded-full bg-[#030919] border border-cyan-500/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00d2ff] via-[#2f75f7] to-[#a855f7] transition-all duration-500"
                style={{ width: `${Math.round((lastResult.stage / lastResult.total) * 100)}%` }}
              />
            </div>

            {/* Solved Card */}
            <div className="bg-gradient-to-b from-[#142d68] to-[#0d1f47] border border-cyan-400/50 rounded-2xl p-4 my-5 w-full shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
              <span className="text-[10px] font-mono text-cyan-300/80 block mb-1 uppercase tracking-wider">Cross-Math Solved</span>
              <span className="text-2xl font-black font-mono text-white">{lastResult.solvedText}</span>
            </div>

            {/* Rewards Capsules for this result */}
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <div className="bg-black/50 border border-cyan-400/50 rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                <span className="text-amber-300">⭐</span>
                <span className="text-cyan-200 font-black text-xs">+{lastResult.xp} XP</span>
              </div>
              <div className="bg-black/50 border border-amber-400/60 rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                <img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coins" className="w-4 h-4 object-contain" />
                <span className="text-amber-300 font-black text-xs">+{lastResult.coins} Coins</span>
              </div>
              {lastResult.gems > 0 && (
                <div className="bg-black/50 border border-cyan-400/60 rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                  <img src="/assets/icon_gem_3d_clean.webp" alt="Diamonds" className="w-4 h-4 object-contain" />
                  <span className="text-cyan-200 font-black text-xs">+{lastResult.gems} Gems</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full relative z-10 max-w-xs space-y-2.5">
            {lastResult.levelCleared ? (
              <button
                onClick={() => {
                  sound.click();
                  attemptStartLevel(Math.min(25, selectedLevelNum));
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 hover:brightness-110 text-emerald-950 font-black text-base shadow-[0_6px_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all border border-emerald-300 cursor-pointer"
              >
                Next Mission (Level {selectedLevelNum}) →
              </button>
            ) : (
              <button
                onClick={continueToNextStage}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 hover:brightness-110 text-emerald-950 font-black text-base shadow-[0_6px_20px_rgba(16,185,129,0.5)] active:scale-95 transition-all border border-emerald-300 cursor-pointer"
              >
                Next Game ({stageNum}/{stageTotal}) →
              </button>
            )}
            <button
              onClick={() => {
                sound.click();
                navigateTo('home');
              }}
              className="w-full py-3 rounded-2xl bg-[#0e255a]/90 hover:bg-[#14327a] text-cyan-300 font-bold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all border border-cyan-400/40 cursor-pointer"
            >
              ‹ Return to Home
            </button>
          </div>
        </div>
      );

      // ========================================================
      // 9. WRONG RESULT (Modern Sci-Fi Arcade Alert)
      // ========================================================
      const renderWrongScreen = () => (
        <div className="flex-1 scifi-game-bg flex flex-col justify-between items-center text-center px-6 py-6 select-none text-white relative overflow-hidden">
          {/* Blueprint Grid */}
          <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />

          <div className="my-auto flex flex-col items-center relative z-10 max-w-xs w-full">
            {/* Red Circle with Cross */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500 to-red-700 border-4 border-rose-300 text-white flex items-center justify-center text-4xl font-black shadow-[0_0_35px_rgba(244,63,94,0.7)] mb-4">
              ✕
            </div>

            <h2 className="text-2xl font-black font-display text-white tracking-tight">
              CALCULATION ERROR!
            </h2>
            <p className="text-xs text-rose-200/80 mt-1">
              One or more equations don't balance.
            </p>

            {/* Wrong Equation Card */}
            <div className="bg-gradient-to-b from-[#2a1324] to-[#1a0c18] border border-rose-500/50 rounded-2xl p-4 my-5 w-full shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
              <span className="text-[10px] font-mono text-rose-300/80 block mb-1 uppercase tracking-wider">Diagnostic Analysis</span>
              <span className="text-sm font-black font-mono text-rose-300">Check number placements & signs</span>
            </div>
          </div>

          <div className="w-full space-y-2.5 relative z-10 max-w-xs">
            <button
              onClick={retryCurrentStage}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:brightness-110 text-white font-black text-base shadow-[0_6px_20px_rgba(244,63,94,0.4)] active:scale-95 transition-all border border-rose-400 cursor-pointer"
            >
              Retry Game ({stageNum}/{stageTotal})
            </button>
            <button
              onClick={() => {
                sound.click();
                navigateTo('hint');
              }}
              className="w-full py-3.5 rounded-2xl bg-[#0c1c44] border border-cyan-400/50 text-cyan-200 font-black text-sm active:scale-95 transition-all hover:text-white cursor-pointer"
            >
              View Mission Hint
            </button>
          </div>
        </div>
      );

      // ========================================================
      // 10. DAILY CHALLENGE (100% Dynamic Season & Calendar Hub)
      // ========================================================
      const renderDailyScreen = () => {
        const handleClaimDailyGift = () => {
          if (dailyGiftClaimed) return;
          sound.fanfare();
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
          setCoins(c => {
            const next = c + 250;
            try { GameStorage.setItem('newromath_coins', next.toString()); } catch (e) {}
            return next;
          });
          setGems(g => {
            const next = g + 10;
            try { GameStorage.setItem('newromath_gems', next.toString()); } catch (e) {}
            return next;
          });
          try { GameStorage.setItem('newromath_daily_crate_last_claimed', todayCrateKey); } catch (e) {}
          setDailyGiftClaimed(true);
        };

        const handleClaimDailyGiftWithAd = () => {
          if (dailyGiftClaimed) return;
          handleWatchAd('both', 0, 'Daily 2X Supply Booster', {
            coinAmount: 500,
            gemAmount: 20,
            onComplete: () => {
              try { GameStorage.setItem('newromath_daily_crate_last_claimed', todayCrateKey); } catch (e) {}
              setDailyGiftClaimed(true);
            }
          });
        };

        const completedCount = completedDailyDays.filter(d => d <= daysInCurrentMonth).length;
        const monthlyProgressPct = Math.min(100, Math.round((completedCount / daysInCurrentMonth) * 100));

        const isTodaySelected = activeDailyDay === todayCalendarDay;
        const isCompletedDay = completedDailyDays.includes(activeDailyDay);
        const isPastDay = activeDailyDay < todayCalendarDay;
        const isMissedDay = isPastDay && !isCompletedDay;
        const isFutureDay = activeDailyDay > todayCalendarDay;

        const handleStartMissedDayWithCoins = () => {
          sound.click();
          const fee = 50;
          if (coins >= fee) {
            setCoins(c => {
              const next = c - fee;
              try { GameStorage.setItem('newromath_coins', next.toString()); } catch (e) {}
              return next;
            });
            setRewardToast(`Missed Day ${activeDailyDay} Unlocked: -50 Coins`);
            startDailyChallenge(activeDailyDay);
          } else {
            sound.wrong();
            setDailyAdPromptModal({
              isOpen: true,
              targetDay: activeDailyDay,
              fee: fee,
              reason: 'missed_day'
            });
          }
        };

        const handleStartMissedDayWithAd = () => {
          sound.click();
          handleWatchAd('both', 0, `Unlock Missed Day ${activeDailyDay} Free`, {
            coinAmount: 150,
            gemAmount: 10,
            onComplete: () => {
              setRewardToast(`Day ${activeDailyDay} Unlocked Free + 150 Coins!`);
              startDailyChallenge(activeDailyDay);
            }
          });
        };

        // Dynamic calendar matrix with padding for starting day of week
        const calendarCells = [
          ...Array.from({ length: firstDayOfWeek }, () => null),
          ...Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1)
        ];

        // Skeuomorphic Circular Pedestal for Daily Challenge Badges
        const DailySkeuomorphicCircle = ({ 
          icon: IconContent, 
          variant = 'cyan', 
          size = 'md',
          className = '' 
        }) => {
          const config = {
            amber: {
              rim: 'from-amber-200 via-amber-400 to-amber-700 shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_14px_rgba(245,158,11,0.45),inset_0_1.5px_1.5px_rgba(255,255,255,0.9)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#244585_0%,#122752_50%,#061129_100%)] shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.85),inset_0_-1px_1.5px_rgba(255,255,255,0.25)]',
              glow: 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
            },
            cyan: {
              rim: 'from-cyan-200 via-sky-400 to-blue-700 shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_14px_rgba(6,182,212,0.45),inset_0_1.5px_1.5px_rgba(255,255,255,0.9)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#18458a_0%,#0d2857_50%,#041029_100%)] shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.85),inset_0_-1px_1.5px_rgba(255,255,255,0.25)]',
              glow: 'text-cyan-200 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
            },
            emerald: {
              rim: 'from-emerald-200 via-emerald-400 to-teal-700 shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_14px_rgba(16,185,129,0.45),inset_0_1.5px_1.5px_rgba(255,255,255,0.9)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#047857_0%,#065f46_50%,#022c22_100%)] shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.85),inset_0_-1px_1.5px_rgba(255,255,255,0.25)]',
              glow: 'text-emerald-200 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'
            },
            rose: {
              rim: 'from-rose-200 via-rose-400 to-rose-700 shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_14px_rgba(244,63,94,0.45),inset_0_1.5px_1.5px_rgba(255,255,255,0.9)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#881337_0%,#4c0519_50%,#20030b_100%)] shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.85),inset_0_-1px_1.5px_rgba(255,255,255,0.25)]',
              glow: 'text-rose-200 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'
            },
            purple: {
              rim: 'from-purple-200 via-purple-400 to-indigo-700 shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_14px_rgba(168,85,247,0.45),inset_0_1.5px_1.5px_rgba(255,255,255,0.9)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#3b186b_0%,#200b3d_50%,#0e041a_100%)] shadow-[inset_0_2.5px_5px_rgba(0,0,0,0.85),inset_0_-1px_1.5px_rgba(255,255,255,0.25)]',
              glow: 'text-purple-200 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]'
            },
            slate: {
              rim: 'from-slate-300 via-slate-400 to-slate-700 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1.5px_1.5px_rgba(255,255,255,0.6)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#1e293b_0%,#0f172a_50%,#020617_100%)] shadow-[inset_0_2.5px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.2)]',
              glow: 'text-slate-400'
            }
          };

          const s = config[variant] || config.cyan;

          const sizeClasses = {
            sm: 'w-7.5 h-7.5 p-[1px]',
            md: 'w-8.5 h-8.5 p-[1.5px]',
            lg: 'w-10.5 h-10.5 p-[1.5px]',
            xl: 'w-15 h-15 p-[2px]'
          }[size] || 'w-8.5 h-8.5 p-[1.5px]';

          return (
            <div className={`relative ${sizeClasses} rounded-full bg-gradient-to-b ${s.rim} shrink-0 flex items-center justify-center ${className}`}>
              <div className="w-full h-full rounded-full p-[1px] bg-gradient-to-b from-black/85 via-black/45 to-black/85 flex items-center justify-center shadow-inner">
                <div className={`w-full h-full rounded-full ${s.disc} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-x-1 top-0.5 h-[42%] bg-gradient-to-b from-white/45 via-white/10 to-transparent rounded-t-full pointer-events-none" />
                  <div className="absolute bottom-0.5 w-[60%] h-1 rounded-full bg-black/60 blur-[1px] pointer-events-none" />
                  <div className={`relative z-10 flex items-center justify-center ${s.glow}`}>
                    {typeof IconContent === 'string' ? (
                      <span className="leading-none">{IconContent}</span>
                    ) : (
                      IconContent
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        };


        return (
          <div className="flex-1 scifi-game-bg flex flex-col overflow-hidden text-white relative select-none">
            {/* Mathematical Coordinate Blueprint Overlay & Luminous Glass Underlay */}
            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 scifi-ambient-cyan rounded-full pointer-events-none" />
            <div className="absolute top-1/3 -right-20 w-80 h-80 scifi-ambient-blue rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 left-0 w-80 h-80 scifi-ambient-purple rounded-full pointer-events-none" />

            {/* Sticky Modern Sci-Fi Header with Full Balance System */}
            <header className="sticky top-0 z-20 scifi-header-bg border-b border-cyan-400/20 px-3 py-2 shrink-0 backdrop-blur-md">
              <div className="flex items-center justify-between gap-1.5 max-w-md mx-auto w-full">
                <div className="flex items-center gap-2 min-w-0">
                  <button 
                    onClick={() => { sound.click(); navigateTo('home'); }} 
                    aria-label="Back to home" 
                    className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-lg font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    ‹
                  </button>
                  <h1 className="text-xs sm:text-sm font-black font-display tracking-wider bg-gradient-to-r from-cyan-300 via-sky-100 to-white bg-clip-text text-transparent uppercase leading-tight truncate">
                    Daily Challenge
                  </h1>
                </div>

                {/* Currency Capsules & Trophy Button */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Coins Capsule */}
                  <div 
                    onClick={() => {
                      sound.click();
                      if (coins < 50) {
                        setDailyAdPromptModal({
                          isOpen: true,
                          targetDay: activeDailyDay,
                          fee: 50,
                          reason: 'low_balance'
                        });
                      } else {
                        navigateTo('rewards');
                      }
                    }}
                    className="group bg-gradient-to-r from-[#1b1c08]/90 via-[#272106]/90 to-[#121102]/90 border border-amber-400/50 hover:border-amber-300 rounded-xl px-1.5 py-1 flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,230,130,0.25)] transition-all active:scale-95 cursor-pointer"
                    title="Coins - Tap to Open Shop or Watch Ad for Free Coins"
                  >
                    <img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coin" className="w-3.5 h-3.5 object-contain shrink-0 drop-shadow-[0_1px_3px_rgba(245,158,11,0.6)]" />
                    <span className="text-amber-300 font-black text-[10.5px] font-display tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      {coins.toLocaleString()}
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black flex items-center justify-center leading-none">+</span>
                  </div>

                  {/* Gems Capsule */}
                  <div 
                    onClick={() => { sound.click(); navigateTo('rewards'); }}
                    className="group bg-gradient-to-r from-[#031c26]/90 via-[#072d3d]/90 to-[#02141c]/90 border border-cyan-400/50 hover:border-cyan-300 rounded-xl px-1.5 py-1 flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(103,232,249,0.25)] transition-all active:scale-95 cursor-pointer"
                    title="Gems - Tap to Open Rewards & Shop"
                  >
                    <img src="/assets/icon_gem_3d_clean.webp" alt="Gem" className="w-3.5 h-3.5 object-contain shrink-0 drop-shadow-[0_1px_3px_rgba(6,182,212,0.6)]" />
                    <span className="text-cyan-300 font-black text-[10.5px] font-display tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                      {gems.toLocaleString()}
                    </span>
                  </div>

                  {/* Trophy Button */}
                  <button 
                    onClick={() => { sound.click(); setShowTrophyModal(true); }} 
                    aria-label="Awards & Achievements" 
                    className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-sm font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    🏆
                  </button>
                </div>
              </div>
            </header>

            {/* Scrollable Daily Challenge Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-24 space-y-4 relative z-10">

              {/* 1. Hero Season Cup Banner Card (Glassmorphic) */}
              <div className="relative rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-amber-500/15 to-transparent pointer-events-none" />
                <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <DailySkeuomorphicCircle 
                        icon={
                          <img 
                            src="/assets/icon_trophy_3d.webp" 
                            alt="Monthly Trophy" 
                            className="w-10 h-10 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)] transition-transform hover:scale-105" 
                          />
                        }
                        variant="amber" 
                        size="xl"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 font-black text-[8.5px] px-1.5 py-0.2 rounded-full border border-white/80 shadow-[0_2px_6px_rgba(0,0,0,0.5)] leading-none z-20">
                        TOP
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm sm:text-base font-black font-display text-white tracking-wide">
                          {currentMonthName} Cup
                        </h2>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-300/40 backdrop-blur-sm">
                          SEASON {currentSeasonNum}
                        </span>
                      </div>
                    </div>
                  </div>


                </div>

                {/* Progress Bar with Milestone Stats */}
                <div className="relative z-10 mt-3 pt-3 border-t border-white/10">
                  <div className="flex items-center justify-between text-[10.5px] font-bold mb-1">
                    <span className="text-cyan-200">Monthly Progress</span>
                    <span className="text-amber-300 font-mono">
                      {completedCount} / {daysInCurrentMonth} ({monthlyProgressPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black/40 border border-white/15 overflow-hidden p-0.5 shadow-inner backdrop-blur-sm">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.7)] transition-all duration-500"
                      style={{ width: `${monthlyProgressPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[8.5px] text-slate-300/80 font-medium mt-1">
                    <span>{completedCount} Days Completed (★)</span>
                    <span>{Math.max(0, daysInCurrentMonth - completedCount)} Days Remaining</span>
                  </div>
                </div>
              </div>

              {/* 2. Tactile Cyber Calendar Matrix (Glassmorphic) */}
              <div className="rounded-3xl p-3.5 bg-gradient-to-b from-white/[0.12] via-[#0d245c]/65 to-[#071536]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.22)] backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <DailySkeuomorphicCircle 
                      icon={<span className="text-xs leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">📆</span>}
                      variant="cyan" 
                      size="sm"
                    />
                    <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                      {currentMonthName} {currentCalendarYear}
                    </h3>
                  </div>
                  <span className="text-[10px] text-cyan-300/80 font-mono">
                    Today: <strong className="text-cyan-300">Day {todayCalendarDay}</strong>
                  </span>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 text-center text-[10px] font-bold text-sky-300/80 uppercase pb-2 mb-1 border-b border-white/10">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <span key={d}>{d}</span>
                  ))}
                </div>

                {/* Dynamic Days Matrix Grid with Clear Completed & Incomplete Badges */}
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {calendarCells.map((day, i) => {
                    if (!day) {
                      return <div key={i} className="h-11" />;
                    }

                    const isPast = day < todayCalendarDay;
                    const isCurrent = day === todayCalendarDay;
                    const isFuture = day > todayCalendarDay;
                    const isDone = completedDailyDays.includes(day);
                    const isMissed = isPast && !isDone;
                    const isSelected = activeDailyDay === day;

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          sound.tap();
                          setActiveDailyDay(day);
                        }}
                        className={`relative h-11 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95 ${
                          isSelected
                            ? 'bg-gradient-to-b from-cyan-400/50 via-blue-600/60 to-indigo-700/70 border-2 border-cyan-200 text-white shadow-[0_0_18px_rgba(0,229,255,0.85),inset_0_1px_0_rgba(255,255,255,0.6)] scale-105 z-10 backdrop-blur-md ring-2 ring-cyan-300/40'
                            : isCurrent
                            ? isDone
                              ? 'bg-gradient-to-b from-emerald-500/30 to-teal-700/45 border-2 border-emerald-300 text-emerald-100 shadow-[0_0_12px_rgba(16,185,129,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-md'
                              : 'bg-gradient-to-b from-cyan-500/30 to-blue-700/45 border-2 border-cyan-400 text-cyan-200 shadow-[0_0_14px_rgba(0,229,255,0.6),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-md animate-pulse'
                            : isDone
                            ? 'bg-gradient-to-b from-emerald-500/20 via-emerald-600/15 to-[#072418]/60 border border-emerald-400/60 text-emerald-300 hover:border-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md'
                            : isMissed
                            ? 'bg-gradient-to-b from-rose-500/20 via-red-900/20 to-[#180812]/70 border border-rose-500/50 text-rose-300 hover:border-rose-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_0_8px_rgba(244,63,94,0.2)] backdrop-blur-md'
                            : 'bg-white/[0.03] border border-white/10 text-slate-500 backdrop-blur-sm'
                        }`}
                      >
                        <span className={`text-[11.5px] font-black font-display leading-none ${
                          isSelected 
                            ? 'text-white' 
                            : isCurrent 
                            ? (isDone ? 'text-emerald-100' : 'text-cyan-200') 
                            : isDone 
                            ? 'text-emerald-200' 
                            : isMissed 
                            ? 'text-rose-200' 
                            : 'text-slate-400'
                        }`}>
                          {day}
                        </span>

                        {/* Status Dots / Badges */}
                        {isDone && (
                          <div className="flex items-center justify-center text-[8.5px] text-amber-300 leading-none mt-0.5 font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            <span>★</span>
                          </div>
                        )}
                        {isMissed && (
                          <div className="flex items-center justify-center text-[9px] text-rose-400 leading-none mt-0.5 font-black drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            <span>✕</span>
                          </div>
                        )}
                        {!isDone && isCurrent && (
                          <span className="text-[7.5px] font-black uppercase text-cyan-300 bg-cyan-500/25 px-1 py-0.2 rounded border border-cyan-400/40 leading-none mt-0.5">
                            TODAY
                          </span>
                        )}
                        {isFuture && (
                          <span className="text-[8px] text-slate-600 leading-none mt-0.5">
                            🔒
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Status Legend Indicator */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2.5 mt-2.5 border-t border-white/10 text-[9px] font-bold">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                    <span>Completed (★)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-300">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_#f43f5e]" />
                    <span>Missed / Incomplete (✕)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-300">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" />
                    <span>Today</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-500" />
                    <span>Locked (🔒)</span>
                  </div>
                </div>
              </div>

              {/* 3. Selected Day Mission Card (Glassmorphic) */}
              <div className="rounded-3xl p-3.5 bg-gradient-to-b from-white/[0.12] via-[#0d245c]/65 to-[#071536]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.22)] backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <DailySkeuomorphicCircle 
                      icon={
                        isCompletedDay ? (
                          <span className="text-emerald-200 font-black text-sm leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">★</span>
                        ) : isMissedDay ? (
                          <span className="text-rose-200 font-black text-sm leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">✕</span>
                        ) : isTodaySelected ? (
                          <span className="text-sm leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">🎯</span>
                        ) : (
                          <span className="text-xs leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">🔒</span>
                        )
                      }
                      variant={
                        isCompletedDay ? 'emerald' : isMissedDay ? 'rose' : isTodaySelected ? 'cyan' : 'slate'
                      }
                      size="md"
                    />
                    <div>
                      <h3 className="text-xs sm:text-sm font-black font-display text-white tracking-wide">
                        {isTodaySelected ? "Today's Mission" : `Day ${activeDailyDay} Mission`}
                      </h3>
                      <span className="text-[9px] text-slate-300 font-mono">
                        {currentMonthShort} {activeDailyDay}, {currentCalendarYear}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9.5px] font-black uppercase px-2.5 py-0.5 rounded-full border backdrop-blur-md ${
                    isTodaySelected && !isCompletedDay
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_8px_rgba(0,229,255,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : isCompletedDay
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_8px_rgba(16,185,129,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : isMissedDay
                      ? 'bg-rose-500/20 text-rose-300 border-rose-400/50 shadow-[0_0_8px_rgba(244,63,94,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]'
                      : 'bg-white/[0.05] text-slate-400 border-white/10'
                  }`}>
                    {isTodaySelected && !isCompletedDay 
                      ? 'ACTIVE NOW' 
                      : isCompletedDay 
                      ? 'COMPLETED (3★)' 
                      : isMissedDay 
                      ? 'INCOMPLETE / MISSED' 
                      : 'LOCKED'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-2 border-t border-white/10 mt-2">
                  <div className="bg-white/[0.07] rounded-2xl p-2 border border-white/15 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    <span className="text-[9px] text-slate-300 uppercase font-bold block">Difficulty</span>
                    <span className="text-xs font-black text-amber-300 font-display block mt-0.5">
                      {activeDailyDay % 4 === 0 ? 'EXPERT ⚡' : activeDailyDay % 3 === 0 ? 'HARD ⚡' : activeDailyDay % 2 === 0 ? 'TACTICAL' : 'CADET'}
                    </span>
                  </div>
                  <div className="bg-white/[0.07] rounded-2xl p-2 border border-white/15 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    <span className="text-[9px] text-slate-300 uppercase font-bold block">Reward</span>
                    <span className="text-xs font-black text-emerald-300 font-display block mt-0.5">+150 Coins</span>
                  </div>
                  <div className="bg-white/[0.07] rounded-2xl p-2 border border-white/15 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    <span className="text-[9px] text-slate-300 uppercase font-bold block">Bonus</span>
                    <span className="text-xs font-black text-cyan-300 font-display block mt-0.5">+20 Gems</span>
                  </div>
                </div>

                {/* If Missed Day: Streak Repair Banner */}
                {isMissedDay && (
                  <div className="mt-2.5 p-2 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🩹</span>
                      <div className="text-left">
                        <span className="text-[10px] text-amber-200 font-bold block leading-tight">Streak Repair Available</span>
                        <span className="text-[8.5px] text-amber-300/80 leading-none">Recover this date to restore your streak progress</span>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-black text-amber-300 font-mono bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-400/40">
                      50 🪙 or Free Ad
                    </span>
                  </div>
                )}
              </div>

              {/* 4. Daily Supply Crate (Glassmorphic) */}
              <div className="rounded-3xl p-3 bg-gradient-to-b from-white/[0.12] via-[#0f2762]/65 to-[#071330]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.22)] backdrop-blur-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DailySkeuomorphicCircle 
                    icon={
                      <span className="text-xl leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">🎁</span>
                    }
                    variant={dailyGiftClaimed ? 'purple' : 'amber'}
                    size="lg"
                  />
                  <div className="text-xs sm:text-sm font-black font-display text-white">
                    <span>Daily Supply</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleClaimDailyGift}
                    disabled={dailyGiftClaimed}
                    className={`px-2.5 py-1.5 rounded-xl font-black text-[11px] transition-all cursor-pointer ${
                      dailyGiftClaimed
                        ? 'bg-white/[0.05] text-slate-500 border border-white/10 cursor-not-allowed backdrop-blur-sm'
                        : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-[0_0_10px_rgba(251,191,36,0.6)] active:scale-95'
                    }`}
                  >
                    {dailyGiftClaimed ? 'CLAIMED ✓' : 'CLAIM'}
                  </button>
                  {!dailyGiftClaimed && (
                    <button
                      onClick={handleClaimDailyGiftWithAd}
                      className="px-2.5 py-1.5 rounded-xl font-black text-[11px] bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 text-emerald-950 shadow-[0_0_12px_rgba(16,185,129,0.5)] active:scale-95 transition-all cursor-pointer border border-emerald-300 flex items-center gap-1"
                      title="Watch Ad to Double Daily Reward"
                    >
                      <span>▶</span>
                      <span>2X AD</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 5. Primary Action Launch Button (Glassmorphic Cyber) */}
              <div className="pt-1.5 space-y-2">
                {isMissedDay ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={handleStartMissedDayWithCoins}
                      className="w-full py-3.5 rounded-2xl font-black font-display text-xs uppercase tracking-wider bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 border-2 border-amber-200/90 text-amber-950 shadow-[0_4px_0_#b45309,0_8px_20px_rgba(245,158,11,0.35),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#b45309] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coin" className="w-4 h-4 object-contain" />
                      <span>Recover (50 🪙)</span>
                    </button>
                    <button
                      onClick={handleStartMissedDayWithAd}
                      className="w-full py-3.5 rounded-2xl font-black font-display text-xs uppercase tracking-wider bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-600 border-2 border-emerald-200/90 text-white shadow-[0_4px_0_#065f46,0_8px_20px_rgba(16,185,129,0.35),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#065f46] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>▶</span>
                      <span>Watch Ad to Play Free</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => startDailyChallenge(activeDailyDay)}
                    disabled={isFutureDay}
                    className={`w-full py-3.5 rounded-2xl font-black font-display text-sm uppercase tracking-wider transition-all flex items-center justify-center ${
                      isFutureDay
                        ? 'bg-white/[0.05] text-slate-500 border border-white/10 cursor-not-allowed backdrop-blur-sm'
                        : 'bg-gradient-to-r from-cyan-500/90 via-blue-600/95 to-indigo-600/90 border border-white/30 text-white shadow-[0_12px_28px_rgba(0,229,255,0.45),inset_0_1.5px_0_rgba(255,255,255,0.4)] hover:shadow-[0_14px_32px_rgba(0,229,255,0.65)] active:scale-98 cursor-pointer backdrop-blur-md'
                    }`}
                  >
                    <span>
                      {isFutureDay 
                        ? `LOCKED • UNLOCKS ${currentMonthShort.toUpperCase()} ${activeDailyDay}` 
                        : isCompletedDay 
                        ? `REPLAY DAY ${activeDailyDay} ›` 
                        : `START DAY ${activeDailyDay} ›`}
                    </span>
                  </button>
                )}
              </div>

            </div>

            {/* Season Trophy Dialog Modal (Glassmorphic) */}
            {showTrophyModal && (
              <div className="fixed inset-0 z-50 bg-[#06122d]/75 backdrop-blur-xl flex items-center justify-center p-4">
                <div className="w-full max-w-sm rounded-[32px] bg-gradient-to-b from-white/[0.14] via-[#0f2868]/85 to-[#06122d]/90 border border-white/25 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.7),inset_0_1.5px_0_rgba(255,255,255,0.3)] backdrop-blur-2xl relative text-white animate-in fade-in zoom-in-95 duration-200">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400/20 border border-amber-300/50 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-md mb-2">
                      <img src="/assets/icon_trophy_3d.webp" alt="Cup" className="w-12 h-12 object-contain" />
                    </div>
                    <h3 className="text-lg font-black font-display text-white uppercase tracking-wider">
                      {currentMonthName} Cup
                    </h3>
                    <p className="text-xs text-amber-200/80 font-mono mt-0.5">
                      Season {currentSeasonNum} Trophies
                    </p>
                  </div>

                  <div className="space-y-2.5 my-4">
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs">
                      <span className="font-bold flex items-center gap-2"><span>🥉</span> Bronze Cup</span>
                      <span className={completedCount >= 7 ? "text-emerald-300 font-black" : "text-slate-400 font-mono"}>
                        {completedCount >= 7 ? "UNLOCKED ✓" : `${completedCount}/7 Days`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs">
                      <span className="font-bold flex items-center gap-2"><span>🥈</span> Silver Cup</span>
                      <span className={completedCount >= 14 ? "text-emerald-300 font-black" : "text-slate-400 font-mono"}>
                        {completedCount >= 14 ? "UNLOCKED ✓" : `${completedCount}/14 Days`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs">
                      <span className="font-bold flex items-center gap-2"><span>🥇</span> Gold Cup</span>
                      <span className={completedCount >= 21 ? "text-emerald-300 font-black" : "text-slate-400 font-mono"}>
                        {completedCount >= 21 ? "UNLOCKED ✓" : `${completedCount}/21 Days`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white/[0.07] border border-amber-400/40 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-xs">
                      <span className="font-bold text-amber-300 flex items-center gap-2"><span>💎</span> Grand Trophy</span>
                      <span className={completedCount >= daysInCurrentMonth ? "text-amber-300 font-black" : "text-amber-200/60 font-mono"}>
                        {completedCount >= daysInCurrentMonth ? "UNLOCKED 🏆" : `${completedCount}/${daysInCurrentMonth} Days`}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => { sound.click(); setShowTrophyModal(false); }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-wider cursor-pointer shadow-[0_10px_20px_rgba(0,229,255,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Modern Not Enough Coins / Watch Ad Modal */}
            {dailyAdPromptModal.isOpen && (
              <div 
                className="fixed inset-0 z-50 bg-[#06122c]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200"
                onClick={() => setDailyAdPromptModal(prev => ({ ...prev, isOpen: false }))}
              >
                <div 
                  className="relative w-full max-w-[320px] sm:max-w-[335px] rounded-[36px] p-5 sm:p-6 pt-14 sm:pt-16 bg-gradient-to-b from-white/95 via-[#f0f7ff]/95 to-[#e0efff]/95 border-2 border-white/90 shadow-[0_25px_60px_-10px_rgba(8,24,68,0.6),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(56,189,248,0.2)] text-center overflow-visible"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Top Close Button */}
                  <button
                    onClick={() => {
                      sound.click();
                      setDailyAdPromptModal(prev => ({ ...prev, isOpen: false }));
                    }}
                    aria-label="Close"
                    className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-blue-100/90 hover:bg-blue-200 border border-white text-[#1e3a8a] flex items-center justify-center font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>

                  {/* 3D Floating Hero: Coin Pod + Splash Petals + Arched 3D Banner */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-52 flex flex-col items-center pointer-events-none z-20">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -bottom-2 w-28 h-10 bg-gradient-to-t from-[#bae6fd] to-white rounded-full blur-[1px] shadow-sm -z-10" />

                      {/* 3D Circular Gloss Pod for Coin */}
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border-2 border-white/90 shadow-[0_8px_20px_rgba(14,165,233,0.45),inset_0_2px_4px_rgba(255,255,255,0.7)] flex items-center justify-center">
                        <img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coin" className="w-10 h-10 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-rose-500 to-red-600 border-2 border-white flex items-center justify-center shadow-md">
                          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <path d="M12 7v6M12 17h.01" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Arched 3D Banner "Need Coins" */}
                    <div className="relative -mt-2.5 w-48 h-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(29,78,216,0.45)]">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 52" fill="none">
                        <path d="M12 36 L0 26 L12 16 L22 22 L22 34 Z" fill="#1e40af" />
                        <path d="M22 22 L35 14 L35 34 L22 34 Z" fill="#172554" />
                        <path d="M208 36 L220 26 L208 16 L198 22 L198 34 Z" fill="#1e40af" />
                        <path d="M198 22 L185 14 L185 34 L198 34 Z" fill="#172554" />
                        <path d="M18 20 C60 6, 160 6, 202 20 C206 36, 196 46, 185 45 C150 38, 70 38, 35 45 C24 46, 14 36, 18 20 Z" fill="url(#fundsRibbonGrad)" stroke="#60a5fa" strokeWidth="2" />
                      </svg>
                      <div className="relative z-10 flex items-center justify-center pb-1 select-none">
                        <span className="font-black text-base sm:text-[17px] tracking-tight text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.6)] font-display">
                          Need <span className="text-[#fde047] drop-shadow-[0_1.5px_3px_rgba(180,83,9,0.8)]">Coins</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Headline & Description */}
                  <h2 className="text-[#152a55] font-black text-xl tracking-tight font-display mb-1 mt-1">
                    Not Enough Coins!
                  </h2>
                  <p className="text-[#4b618a] text-xs font-semibold px-2 leading-relaxed mb-3">
                    {dailyAdPromptModal.reason === 'missed_day'
                      ? `Recovering missed Day ${dailyAdPromptModal.targetDay} requires ${dailyAdPromptModal.fee} Coins. Watch a quick ad to claim +150 Coins and unlock it free!`
                      : 'You need more Coins to unlock Daily Challenge missions. Watch a quick ad to claim free coins!'}
                  </p>

                  {/* Balance Status Meter */}
                  <div className="mb-4 text-left">
                    <div className="flex items-center gap-2.5 rounded-2xl px-3 py-2 bg-rose-50/90 border border-rose-300/80 shadow-sm">
                      <img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coin" className="w-7 h-7 object-contain shrink-0 drop-shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <div className="h-2 rounded-full bg-slate-200 overflow-hidden border border-slate-300/60">
                          <div 
                            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(8, Math.round((coins / dailyAdPromptModal.fee) * 100)))}%` }}
                          />
                        </div>
                        <div className="mt-1 flex items-center justify-between font-mono font-black text-[11px] leading-none">
                          <span className="text-rose-700">{coins.toLocaleString()} Coins</span>
                          <span className="text-slate-500">/ {dailyAdPromptModal.fee} Needed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        sound.click();
                        const targetDay = dailyAdPromptModal.targetDay;
                        setDailyAdPromptModal(prev => ({ ...prev, isOpen: false }));
                        handleWatchAd('both', 0, 'Daily Challenge Coin Sponsor', {
                          coinAmount: 150,
                          gemAmount: 10,
                          onComplete: () => {
                            setRewardToast(`+150 Coins & +10 Diamonds Claimed! Unlocking Day ${targetDay}...`);
                            setTimeout(() => {
                              startDailyChallenge(targetDay);
                            }, 500);
                          }
                        });
                      }}
                      className="w-full rounded-2xl py-3 bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-600 border-2 border-emerald-200/90 shadow-[0_4px_0_#065f46,0_8px_20px_rgba(16,185,129,0.35),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#065f46] transition-all cursor-pointer flex items-center justify-center gap-2 text-white font-black text-xs uppercase tracking-wide"
                    >
                      <svg className="w-5 h-5 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2.5" y="5" width="19" height="14" rx="3.5" />
                        <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" />
                      </svg>
                      <span>Watch Ad to Unlock Free (+150 🪙)</span>
                    </button>

                    <button
                      onClick={() => {
                        sound.click();
                        setDailyAdPromptModal(prev => ({ ...prev, isOpen: false }));
                        navigateTo('rewards');
                      }}
                      className="w-full py-2.5 rounded-2xl bg-white/80 hover:bg-white border border-blue-200 text-blue-900 font-bold text-xs tracking-wide transition-all cursor-pointer"
                    >
                      Visit Coin Store & Shop
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      };

      // ========================================================
      // 10B. DEDICATED DAILY CHALLENGE QUANTUM MATRIX GAMEPLAY
      // ========================================================
      const renderDailyGameScreen = () => {
        const {
          protocolId = (274 + dailyGameDay),
          difficulty = 'TACTICAL ⚡',
          rowAlpha = { id: 'mul_add', op1: '×', op2: '+' },
          rowBeta = { id: 'add_mul', op1: '+', op2: '×' },
          rowGamma = { id: 'mul_sub', op1: '×', op2: '−' },
          colLink = { op1: '+', op2: '−' },
          targetAlpha = 39,
          targetBeta = 26,
          targetGamma = 18,
          targetLink = 10,
          answers = {},
          trayNumbers = []
        } = dailyGamePuzzle || {};

        const a0 = dailyGameAnswers[0];
        const a1 = dailyGameAnswers[1];
        const a2 = dailyGameAnswers[2];
        const a3 = dailyGameAnswers[3];
        const a4 = dailyGameAnswers[4];
        const a5 = dailyGameAnswers[5];
        const a6 = dailyGameAnswers[6];
        const a7 = dailyGameAnswers[7];
        const a8 = dailyGameAnswers[8];

        // Row 1: Core Alpha
        const alphaFilled = a0 !== undefined && a1 !== undefined && a2 !== undefined;
        const alphaVal = alphaFilled ? evalDailyRow(rowAlpha, a0, a1, a2) : null;
        const isAlphaCorrect = alphaFilled && alphaVal === targetAlpha;

        // Row 2: Core Beta
        const betaFilled = a3 !== undefined && a4 !== undefined && a5 !== undefined;
        const betaVal = betaFilled ? evalDailyRow(rowBeta, a3, a4, a5) : null;
        const isBetaCorrect = betaFilled && betaVal === targetBeta;

        // Row 3: Core Gamma
        const gammaFilled = a6 !== undefined && a7 !== undefined && a8 !== undefined;
        const gammaVal = gammaFilled ? evalDailyRow(rowGamma, a6, a7, a8) : null;
        const isGammaCorrect = gammaFilled && gammaVal === targetGamma;

        // Resonance Link: Column 2 (a1, a4, a7)
        const linkFilled = a1 !== undefined && a4 !== undefined && a7 !== undefined;
        const currentColVal = linkFilled ? evalDailyCol(colLink, a1, a4, a7) : null;
        const isLinkCorrect = linkFilled && currentColVal === targetLink;

        const isAllSynchronized = isAlphaCorrect && isBetaCorrect && isGammaCorrect && isLinkCorrect;

        // Numbers currently placed in any slot (to dim in tray)
        const placedValues = Object.values(dailyGameAnswers);
        const dailyTrayCount = trayNumbers.length;
        const dailyRow1Items = Math.ceil(dailyTrayCount / 2);
        const dailyRow2Items = dailyTrayCount - dailyRow1Items;

        // Responsive element sizing based on tray number count & mobile screen
        const dailySlotSizeClass = (() => {
          if (dailyTrayCount >= 13) return 'w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-lg';
          if (dailyTrayCount >= 11) return 'w-8 h-8 sm:w-9.5 sm:h-9.5 rounded-lg sm:rounded-xl';
          if (dailyTrayCount >= 10) return 'w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl';
          return 'w-9 h-9 sm:w-11 sm:h-11 rounded-xl';
        })();

        const dailyParenSizeClass = (() => {
          if (dailyTrayCount >= 13) return 'w-2 sm:w-2.5 text-xs sm:text-sm';
          if (dailyTrayCount >= 11) return 'w-2.5 sm:w-3 text-sm sm:text-base';
          return 'w-3 sm:w-4 text-base sm:text-lg';
        })();

        const dailyOpSizeClass = (() => {
          if (dailyTrayCount >= 13) return 'w-3.5 sm:w-4 text-xs sm:text-sm';
          if (dailyTrayCount >= 11) return 'w-4 sm:w-4.5 text-sm sm:text-base';
          return 'w-4.5 sm:w-5.5 text-base sm:text-lg';
        })();

        const dailySlotTextClass = (val) => {
          const str = String(val ?? '');
          const len = str.length;
          if (dailyTrayCount >= 13) {
            if (len >= 3) return 'text-[9px] tracking-tight';
            if (len === 2) return 'text-[11px] tracking-tight';
            return 'text-xs sm:text-sm';
          }
          if (dailyTrayCount >= 11) {
            if (len >= 3) return 'text-[10px] tracking-tight';
            if (len === 2) return 'text-xs tracking-tight';
            return 'text-sm sm:text-base';
          }
          if (dailyTrayCount >= 10) {
            if (len >= 3) return 'text-[11px] tracking-tight';
            if (len === 2) return 'text-sm tracking-tight';
            return 'text-base sm:text-lg';
          }
          if (len >= 3) return 'text-xs sm:text-sm tracking-tight';
          return 'text-base sm:text-lg';
        };

        const getDailyTrayButtonSizeClass = (itemsInRow) => {
          if (itemsInRow <= 4) {
            return 'max-w-[46px] sm:max-w-[50px] h-[44px] sm:h-[48px] rounded-xl';
          }
          if (itemsInRow === 5) {
            return 'max-w-[40px] sm:max-w-[45px] h-[39px] sm:h-[44px] rounded-xl';
          }
          if (itemsInRow === 6) {
            return 'max-w-[36px] sm:max-w-[40px] h-[35px] sm:h-[39px] rounded-lg sm:rounded-xl';
          }
          return 'max-w-[31px] sm:max-w-[35px] h-[31px] sm:h-[35px] rounded-md sm:rounded-lg';
        };

        const getDailyTrayTextClass = (val, itemsInRow) => {
          const str = String(val ?? '');
          const len = str.length;
          if (itemsInRow >= 7) {
            if (len >= 3) return 'text-[8.5px] tracking-tighter font-black';
            if (len === 2) return 'text-[10px] tracking-tight font-black';
            return 'text-[11px] font-black';
          }
          if (itemsInRow === 6) {
            if (len >= 3) return 'text-[9.5px] tracking-tighter font-black';
            if (len === 2) return 'text-[11px] tracking-tight font-black';
            return 'text-xs sm:text-sm font-black';
          }
          if (len >= 3) return 'text-[10px] tracking-tight font-black';
          if (len === 2) return 'text-xs sm:text-sm tracking-tight font-black';
          return 'text-xs sm:text-sm font-black';
        };

        // Responsive typography helpers
        const getTileTextClass = (val) => {
          const str = String(val ?? '');
          const len = str.length;
          if (len >= 3) {
            return largeFontEnabled
              ? 'text-[clamp(10px,2.7vw,13px)] tracking-tight font-black'
              : 'text-[clamp(9.5px,2.4vw,11.5px)] tracking-tight font-black';
          }
          if (len === 2) {
            return largeFontEnabled
              ? 'text-[clamp(13px,3.6vw,16px)] tracking-tight font-black'
              : 'text-[clamp(12px,3.2vw,14.5px)] tracking-tight font-black';
          }
          return largeFontEnabled
            ? 'text-[clamp(16px,4.8vw,22px)] font-black'
            : 'text-[clamp(14px,4.2vw,19px)] font-black';
        };

        const getOperatorTextClass = () => {
          return largeFontEnabled
            ? 'text-[clamp(14px,4.5vw,20px)] font-black'
            : 'text-[clamp(12px,3.8vw,17px)] font-black';
        };

        const getTrayTextClass = (val) => {
          const str = String(val ?? '');
          const len = str.length;
          if (len >= 3) {
            return largeFontEnabled
              ? 'text-[clamp(10px,2.6vw,12px)] tracking-tight font-black'
              : 'text-[clamp(9.5px,2.3vw,11px)] tracking-tight font-black';
          }
          if (len === 2) {
            return largeFontEnabled
              ? 'text-[clamp(13px,3.6vw,16px)] tracking-tight font-black'
              : 'text-[clamp(12px,3.2vw,14.5px)] tracking-tight font-black';
          }
          return largeFontEnabled
            ? 'text-[clamp(16px,5vw,22px)] font-black'
            : 'text-[clamp(14px,4.3vw,19px)] font-black';
        };

        // Check victory condition
        const evaluateCompletion = (nextAnswers) => {
          const n0 = nextAnswers[0], n1 = nextAnswers[1], n2 = nextAnswers[2];
          const n3 = nextAnswers[3], n4 = nextAnswers[4], n5 = nextAnswers[5];
          const n6 = nextAnswers[6], n7 = nextAnswers[7], n8 = nextAnswers[8];

          const aOk = n0 !== undefined && n1 !== undefined && n2 !== undefined && 
                      evalDailyRow(rowAlpha, n0, n1, n2) === targetAlpha;
          const bOk = n3 !== undefined && n4 !== undefined && n5 !== undefined && 
                      evalDailyRow(rowBeta, n3, n4, n5) === targetBeta;
          const cOk = n6 !== undefined && n7 !== undefined && n8 !== undefined && 
                      evalDailyRow(rowGamma, n6, n7, n8) === targetGamma;
          const linkOk = n1 !== undefined && n4 !== undefined && n7 !== undefined && 
                         evalDailyCol(colLink, n1, n4, n7) === targetLink;

          if (aOk && bOk && cOk && linkOk) {
            setTimeout(() => {
              sound.correct();
              sound.fanfare();
              confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });

              // Mark day as completed
              setCompletedDailyDays(prev => {
                const next = Array.from(new Set([...prev, dailyGameDay]));
                try {
                  const key = `newromath_daily_completed_${currentCalendarYear}_${currentSeasonNum}`;
                  GameStorage.setItem(key, JSON.stringify(next));
                } catch (e) {}
                return next;
              });

              // Award Rewards (+150 Coins & +20 Gems)
              setCoins(c => {
                const next = c + 150;
                try { GameStorage.setItem('newromath_coins', next.toString()); } catch (e) {}
                return next;
              });
              setGems(g => {
                const next = g + 20;
                try { GameStorage.setItem('newromath_gems', next.toString()); } catch (e) {}
                return next;
              });

              setDailyGameVictoryModal(true);
            }, 300);
          }
        };

        // Place number from tray into active slot
        const placeDailyNumber = (num) => {
          if (isDailyGamePaused || dailyGameTimeOver) return;
          sound.snap();

          const allSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8];
          let targetSlot = dailyGameSelectedSlot;
          if (targetSlot === null || targetSlot === undefined || dailyGameAnswers[targetSlot] !== undefined) {
            const nextEmpty = allSlots.find(s => dailyGameAnswers[s] === undefined);
            if (nextEmpty !== undefined) {
              targetSlot = nextEmpty;
            } else {
              targetSlot = 0;
            }
          }

          const nextAnswers = { ...dailyGameAnswers, [targetSlot]: num };
          setDailyGameAnswers(nextAnswers);
          setDailyGameHistory(prev => [...prev, targetSlot]);

          // Automatically seek next empty slot
          const nextEmpty = allSlots.find(s => s !== targetSlot && nextAnswers[s] === undefined);
          if (nextEmpty !== undefined) {
            setDailyGameSelectedSlot(nextEmpty);
          }

          evaluateCompletion(nextAnswers);
        };

        // Undo last placed number
        const undoDailyNumber = () => {
          if (!dailyGameHistory.length) return;
          sound.pop();
          const lastSlot = dailyGameHistory[dailyGameHistory.length - 1];
          setDailyGameHistory(prev => prev.slice(0, -1));
          setDailyGameAnswers(prev => {
            const next = { ...prev };
            delete next[lastSlot];
            return next;
          });
          setDailyGameSelectedSlot(lastSlot);
        };

        // Quantum Scan Hint
        const handleDailyHint = () => {
          sound.whoosh();
          const allSlots = [0, 1, 2, 3, 4, 5, 6, 7, 8];
          const targetSlot = allSlots.find(s => dailyGameAnswers[s] !== answers[s]);
          if (targetSlot !== undefined) {
            const nextAnswers = { ...dailyGameAnswers, [targetSlot]: answers[targetSlot] };
            setDailyGameAnswers(nextAnswers);
            setDailyGameHistory(prev => [...prev, targetSlot]);
            setDailyGameSelectedSlot(targetSlot);
            setDailyHintUsed(h => h + 1);
            evaluateCompletion(nextAnswers);
          }
        };

        const handleDailyReroll = () => {
          sound.click();
          startDailyChallenge(dailyGameDay);
        };

        const renderSlot = (slotIdx, label) => {
          const val = dailyGameAnswers[slotIdx];
          const isSelected = dailyGameSelectedSlot === slotIdx;
          const isFilled = val !== undefined;
          
          let slotTag = '';
          let slotTheme = '';
          if (slotIdx < 3) {
            slotTag = `α-${slotIdx + 1}`;
            slotTheme = 'alpha';
          } else if (slotIdx < 6) {
            slotTag = `β-${slotIdx - 2}`;
            slotTheme = 'beta';
          } else {
            slotTag = `γ-${slotIdx - 5}`;
            slotTheme = 'gamma';
          }

          return (
            <button
              key={slotIdx}
              onClick={() => {
                if (dailyGameTimeOver) return;
                sound.click();
                if (dailyGameAnswers[slotIdx] !== undefined) {
                  setDailyGameAnswers(prev => {
                    const next = { ...prev };
                    delete next[slotIdx];
                    return next;
                  });
                  setDailyGameHistory(hist => hist.filter(item => item !== slotIdx));
                  setDailyGameSelectedSlot(slotIdx);
                } else {
                  setDailyGameSelectedSlot(slotIdx);
                }
              }}
              aria-label={`Daily Slot ${slotTag}${val !== undefined ? `, ${val}` : ''}`}
              aria-pressed={isSelected}
              className={`relative flex items-center justify-center transition-all select-none cursor-pointer aspect-square shrink-0 ${dailySlotSizeClass} ${
                isSelected
                  ? 'bg-amber-400/25 border-2 border-yellow-300 shadow-[0_0_16px_rgba(251,191,36,0.9),inset_0_0_8px_rgba(251,191,36,0.4)] scale-105 z-20'
                  : isFilled
                  ? `bg-gradient-to-b from-[#2563eb] via-[#1d4ed8] to-[#173887] border-2 border-cyan-300 text-white font-black shadow-[0_4px_0_#0b1d4d,0_6px_12px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.6)] ${getTileTextClass(val)}`
                  : slotTheme === 'alpha'
                  ? 'bg-[#102a63]/55 hover:bg-[#163884]/65 border-2 border-dashed border-cyan-400/80 hover:border-cyan-300 shadow-[inset_0_2px_6px_rgba(8,20,52,0.4),0_0_8px_rgba(0,229,255,0.2)]'
                  : slotTheme === 'beta'
                  ? 'bg-[#211756]/55 hover:bg-[#2c1f72]/65 border-2 border-dashed border-purple-400/80 hover:border-purple-300 shadow-[inset_0_2px_6px_rgba(24,12,60,0.4),0_0_8px_rgba(192,132,252,0.2)]'
                  : 'bg-[#0e2c22]/55 hover:bg-[#133b2e]/65 border-2 border-dashed border-emerald-400/80 hover:border-emerald-300 shadow-[inset_0_2px_6px_rgba(6,32,20,0.4),0_0_8px_rgba(52,211,153,0.2)]'
              }`}
            >
              {isFilled ? (
                <span className={`font-black text-white leading-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${dailySlotTextClass(val)}`}>
                  {val}
                </span>
              ) : isSelected ? (
                <span className="text-amber-300 font-mono font-black text-[10px] sm:text-xs tracking-tight leading-none drop-shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse">
                  {slotTag}
                </span>
              ) : (
                <span className={`font-mono font-black text-[10px] sm:text-xs tracking-tight leading-none ${
                  slotTheme === 'alpha'
                    ? 'text-cyan-200 drop-shadow-[0_0_6px_rgba(0,229,255,0.85)]'
                    : slotTheme === 'beta'
                    ? 'text-purple-200 drop-shadow-[0_0_6px_rgba(192,132,252,0.85)]'
                    : 'text-emerald-200 drop-shadow-[0_0_6px_rgba(52,211,153,0.85)]'
                }`}>
                  {slotTag}
                </span>
              )}
            </button>
          );
        };

        const renderOperator = (symbol, isParen = false) => (
          <div 
            className={`flex items-center justify-center select-none font-black shrink-0 ${
              isParen
                ? `${dailyParenSizeClass} text-sky-200/85 font-bold`
                : `${dailyOpSizeClass} text-cyan-200 drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]`
            }`}
          >
            <span>{symbol}</span>
          </div>
        );

        const renderFixedTarget = (val, isCorrect = false) => (
          <div 
            className={`flex items-center justify-center select-none font-black aspect-square shrink-0 transition-all ${dailySlotSizeClass} ${
              isCorrect
                ? 'bg-gradient-to-b from-[#059669] via-[#047857] to-[#064e3b] border-2 border-emerald-300 text-white shadow-[0_4px_0_#022c22,0_0_14px_rgba(16,185,129,0.7),inset_0_1px_2px_rgba(255,255,255,0.6)]'
                : 'bg-gradient-to-b from-[#2563eb] via-[#1d4ed8] to-[#173887] border-2 border-cyan-300 text-white shadow-[0_4px_0_#0b1d4d,0_6px_12px_rgba(0,0,0,0.45),inset_0_1px_2px_rgba(255,255,255,0.6)]'
            } ${getTileTextClass(val)}`}
          >
            <span className={`drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-none font-black ${dailySlotTextClass(val)}`}>{val}</span>
          </div>
        );

        return (
          <div className="flex-1 flex flex-col scifi-game-bg select-none overflow-hidden relative text-white">
            <div 
              className="flex-1 overflow-y-auto no-scrollbar px-3 pt-0 space-y-2.5 max-w-md mx-auto w-full"
              style={{ paddingBottom: 'max(3.5rem, calc(env(safe-area-inset-bottom, 0px) + 2.5rem))' }}
            >
              {/* Top Navigation & HUD Header (Fully Responsive on All Android Devices) */}
              <div 
                className="sticky top-0 z-20 -mx-3 scifi-header-bg border-b border-cyan-400/20 flex items-center justify-between gap-1 sm:gap-2 px-3 sm:px-3.5 pt-2 pb-2 shrink-0 w-[calc(100%+1.5rem)]"
                style={{ paddingTop: 'max(0.5rem, env(safe-area-inset-top, 0px))' }}
              >
                {/* 1. Left Navigation Controls: Back Button */}
                <div className="flex items-center shrink-0">
                  <button 
                    onClick={() => { sound.click(); navigateTo('daily'); }} 
                    aria-label="Back to daily hub" 
                    title="Back to daily hub"
                    className="w-8 h-8 sm:w-8.5 sm:h-8.5 aspect-square rounded-full bg-gradient-to-b from-[#1e4ba6] via-[#163884] to-[#102a63] border-2 border-cyan-400/80 text-cyan-200 flex items-center justify-center shadow-[0_2px_8px_rgba(0,229,255,0.35),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <svg className="w-4 h-4 text-cyan-200 drop-shadow-[0_0_6px_rgba(0,229,255,0.85)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                </div>

                {/* 2. Center Daily Mission Pill (Compact & Responsive) */}
                <div className="flex items-center justify-center bg-[#0d255a]/80 backdrop-blur-md border border-cyan-400/50 rounded-full px-2.5 sm:px-3 py-1 shadow-inner shrink min-w-0">
                  <span className="text-[9.5px] sm:text-[11px] font-black uppercase tracking-wider text-cyan-200 font-display truncate">
                    DAILY #{protocolId}
                  </span>
                </div>

                {/* 3. Right Navigation Controls: Reset Daily Puzzle Button */}
                <div className="flex items-center shrink-0">
                  <button 
                    onClick={handleDailyReroll} 
                    aria-label="Reset daily puzzle" 
                    title="Reset daily puzzle" 
                    className="w-8 h-8 sm:w-8.5 sm:h-8.5 aspect-square rounded-full bg-gradient-to-b from-[#1e4ba6] via-[#163884] to-[#102a63] border-2 border-cyan-400/80 text-cyan-200 flex items-center justify-center shadow-[0_2px_8px_rgba(0,229,255,0.35),inset_0_1px_2px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden shrink-0 group"
                  >
                    <svg className="w-4 h-4 text-cyan-200 drop-shadow-[0_0_6px_rgba(0,229,255,0.85)] group-hover:rotate-180 transition-transform duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
                      <path d="M21 3v5h-5" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mission Board Terminal Card (Housing Daily Challenge Functions in Unified Cyber Card) */}
              <section className="flex flex-col rounded-3xl p-2.5 sm:p-3.5 bg-gradient-to-b from-white/[0.10] via-[#102761]/80 to-[#0b1c45]/90 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.5),inset_0_1.5px_0_rgba(255,255,255,0.22)] relative overflow-hidden backdrop-blur-xl">
                {/* Blueprint Grid Overlay */}
                <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />

                {/* Drafting Corner Crosses */}
                <span className="absolute top-1.5 left-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
                <span className="absolute top-1.5 right-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
                <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
                <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>

                {/* Mission HUD Header: Yellow Background Modern 3D Glassmorphism Section */}
                <div className="relative z-10 flex items-center justify-between px-2.5 py-2 rounded-2xl bg-gradient-to-b from-yellow-300/25 via-amber-400/20 to-yellow-500/15 border border-yellow-300/50 shadow-[0_4px_20px_rgba(245,158,11,0.25),inset_0_1.5px_1.5px_rgba(255,255,255,0.65),inset_0_-1.5px_3px_rgba(180,83,9,0.3)] backdrop-blur-xl mb-2.5 overflow-hidden">
                  {/* Luminous Inner Glow Shimmer */}
                  <div className="absolute -top-6 left-1/4 w-32 h-12 bg-yellow-300/20 rounded-full blur-md pointer-events-none" />

                  {/* Left: 3D Difficulty Badge & Day Counter */}
                  <div className="relative z-10 flex items-center gap-1.5 min-w-0">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-b from-yellow-200 via-amber-300 to-amber-500 text-amber-950 border border-yellow-100 shadow-[0_2px_4px_rgba(180,83,9,0.4),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all shrink-0">
                      {difficulty}
                    </span>
                    <div className="px-2 py-0.5 rounded-lg bg-black/35 border border-yellow-400/30 backdrop-blur-md shadow-inner flex items-center">
                      <span className="text-[10px] text-yellow-200 font-mono font-black tracking-wider drop-shadow-xs">
                        DAY {dailyGameDay}
                      </span>
                    </div>
                  </div>

                  {/* Right: 3D Yellow Glass Timer Capsule & 3D Yellow Pause Button */}
                  <div className="relative z-10 flex items-center gap-1.5 shrink-0">
                    <div className={`flex items-center gap-1 px-2.5 py-1 rounded-xl font-mono font-black text-xs transition-all backdrop-blur-md ${
                      dailyGameTimer <= 15
                        ? 'animate-timer-warning text-red-100 bg-gradient-to-b from-red-500/80 to-red-800/90 border border-red-300 shadow-[0_0_12px_rgba(239,68,68,0.7),inset_0_1px_1px_rgba(255,255,255,0.5)]'
                        : 'text-yellow-100 bg-gradient-to-b from-yellow-400/25 via-amber-500/35 to-amber-700/40 border border-yellow-300/60 shadow-[0_2px_8px_rgba(245,158,11,0.3),inset_0_1px_1px_rgba(255,255,255,0.55)]'
                    }`}>
                      <span className="text-xs">⏱️</span>
                      <span className="drop-shadow-xs">{formatTimer(dailyGameTimer)}</span>
                    </div>

                    <button 
                      onClick={() => { sound.click(); setIsDailyGamePaused(v => !v); }} 
                      aria-label={isDailyGamePaused ? 'Resume puzzle' : 'Pause puzzle'} 
                      className="w-8 h-8 rounded-xl bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-500 hover:from-yellow-200 hover:via-amber-300 hover:to-amber-400 border border-yellow-100 text-amber-950 flex items-center justify-center text-xs font-black shadow-[0_3px_0_#b45309,0_4px_10px_rgba(245,158,11,0.45),inset_0_1px_2px_rgba(255,255,255,0.85)] active:translate-y-0.5 active:shadow-[0_1px_0_#b45309] cursor-pointer transition-all"
                    >
                      {isDailyGamePaused ? '▶' : '⏸'}
                    </button>
                  </div>
                </div>

                {/* Daily Mathematical Equations Matrix (Clean Arcade Board with 3 Mixed Rows + Connected Link) */}
                <div className="relative z-10 flex flex-col items-center justify-center space-y-1 sm:space-y-1.5 my-2 sm:my-2.5 w-full">
                  
                  {/* Row 1: Core Alpha Equation */}
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full py-0.5">
                    {renderOperator('(', true)}
                    {renderSlot(0, 'α-1')}
                    {renderOperator(rowAlpha.op1)}
                    {renderSlot(1, 'α-2')}
                    {renderOperator(')', true)}
                    {renderOperator(rowAlpha.op2)}
                    {renderSlot(2, 'α-3')}
                    {renderOperator('=')}
                    {renderFixedTarget(targetAlpha, isAlphaCorrect)}
                  </div>

                  {/* Connector 1: Link Operator between Alpha and Beta (Column 2) */}
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full py-0 pointer-events-none select-none">
                    <div className={dailyParenSizeClass} />
                    <div className={dailySlotSizeClass} />
                    <div className={dailyOpSizeClass} />
                    <div className={`${dailySlotSizeClass} flex items-center justify-center`}>
                      <span className="text-cyan-200 text-base sm:text-lg font-black leading-none drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
                        {colLink.op1}
                      </span>
                    </div>
                    <div className={dailyParenSizeClass} />
                    <div className={dailyOpSizeClass} />
                    <div className={dailySlotSizeClass} />
                    <div className={dailyOpSizeClass} />
                    <div className={dailySlotSizeClass} />
                  </div>

                  {/* Row 2: Core Beta Equation */}
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full py-0.5">
                    {renderOperator('(', true)}
                    {renderSlot(3, 'β-1')}
                    {renderOperator(rowBeta.op1)}
                    {renderSlot(4, 'β-2')}
                    {renderOperator(')', true)}
                    {renderOperator(rowBeta.op2)}
                    {renderSlot(5, 'β-3')}
                    {renderOperator('=')}
                    {renderFixedTarget(targetBeta, isBetaCorrect)}
                  </div>

                  {/* Connector 2: Link Operator between Beta and Gamma (Column 2) */}
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full py-0 pointer-events-none select-none">
                    <div className={dailyParenSizeClass} />
                    <div className={dailySlotSizeClass} />
                    <div className={dailyOpSizeClass} />
                    <div className={`${dailySlotSizeClass} flex items-center justify-center`}>
                      <span className="text-cyan-200 text-base sm:text-lg font-black leading-none drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]">
                        {colLink.op2}
                      </span>
                    </div>
                    <div className={dailyParenSizeClass} />
                    <div className={dailyOpSizeClass} />
                    <div className={dailySlotSizeClass} />
                    <div className={dailyOpSizeClass} />
                    <div className={dailySlotSizeClass} />
                  </div>

                  {/* Row 3: Core Gamma Equation */}
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full py-0.5">
                    {renderOperator('(', true)}
                    {renderSlot(6, 'γ-1')}
                    {renderOperator(rowGamma.op1)}
                    {renderSlot(7, 'γ-2')}
                    {renderOperator(')', true)}
                    {renderOperator(rowGamma.op2)}
                    {renderSlot(8, 'γ-3')}
                    {renderOperator('=')}
                    {renderFixedTarget(targetGamma, isGammaCorrect)}
                  </div>

                  {/* Connected Link Status Bar */}
                  <div className="pt-1.5 pb-0.5 w-full flex justify-center">
                    <div className={`flex items-center justify-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] sm:text-xs font-mono font-black transition-all ${
                      isLinkCorrect
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.45)]'
                        : linkFilled && !isLinkCorrect
                        ? 'bg-rose-950/80 border-rose-400/80 text-rose-300 shadow-[0_0_8px_rgba(244,63,94,0.35)]'
                        : 'bg-[#0d2254]/75 border-cyan-400/40 text-cyan-200 shadow-inner'
                    }`}>
                      <span className="text-[11px]">🔗</span>
                      <span className="tracking-tight">LINK: α-2 {colLink.op1} β-2 {colLink.op2} γ-2 = {targetLink}</span>
                      {isLinkCorrect ? (
                        <span className="text-emerald-300 font-sans font-bold text-[9px] bg-emerald-900/60 px-1 rounded border border-emerald-400/60">
                          ✓ LOCKED
                        </span>
                      ) : linkFilled && !isLinkCorrect ? (
                        <span className="text-rose-300 font-sans font-bold text-[9px] bg-rose-900/60 px-1 rounded border border-rose-400/60">
                          ≠ {currentColVal}
                        </span>
                      ) : null}
                    </div>
                  </div>

                </div>

                {/* Number Tray Keyboard (3D Green Tiles in 2 Balanced Rows for All Android Screens) */}
                <div className="relative z-10 flex flex-col items-center gap-1.5 pt-2.5 mt-1 border-t border-cyan-400/20 w-full px-0.5">
                  <div className={`flex items-center justify-center ${dailyRow1Items >= 7 ? 'gap-0.5 sm:gap-1' : 'gap-1 sm:gap-1.5'} w-full`}>
                    {trayNumbers.slice(0, dailyRow1Items).map(number => {
                      const used = placedValues.includes(number);
                      return (
                        <button
                          key={number}
                          onClick={() => placeDailyNumber(number)}
                          disabled={used || isDailyGamePaused || dailyGameTimeOver}
                          aria-label={`Place number ${number}`}
                          className={`grid aspect-square min-w-0 flex-1 ${getDailyTrayButtonSizeClass(dailyRow1Items)} place-items-center p-0.5 transition-all select-none overflow-hidden ${
                            used
                              ? 'opacity-25 scale-95 border border-slate-700 bg-slate-800/40 text-slate-500 cursor-not-allowed'
                              : 'bg-gradient-to-b from-[#1fc786] via-[#10b981] to-[#047857] border-2 border-emerald-300 text-white font-black shadow-[0_3px_0_#064e3b,0_5px_10px_rgba(16,185,129,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_#064e3b] cursor-pointer hover:scale-105'
                          } ${getDailyTrayTextClass(number, dailyRow1Items)}`}
                        >
                          <span className="leading-none flex items-center justify-center font-black truncate max-w-full px-0.5">
                            {number}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className={`flex items-center justify-center ${dailyRow2Items >= 7 ? 'gap-0.5 sm:gap-1' : 'gap-1 sm:gap-1.5'} w-full`}>
                    {trayNumbers.slice(dailyRow1Items).map(number => {
                      const used = placedValues.includes(number);
                      return (
                        <button
                          key={number}
                          onClick={() => placeDailyNumber(number)}
                          disabled={used || isDailyGamePaused || dailyGameTimeOver}
                          aria-label={`Place number ${number}`}
                          className={`grid aspect-square min-w-0 flex-1 ${getDailyTrayButtonSizeClass(dailyRow2Items)} place-items-center p-0.5 transition-all select-none overflow-hidden ${
                            used
                              ? 'opacity-25 scale-95 border border-slate-700 bg-slate-800/40 text-slate-500 cursor-not-allowed'
                              : 'bg-gradient-to-b from-[#1fc786] via-[#10b981] to-[#047857] border-2 border-emerald-300 text-white font-black shadow-[0_3px_0_#064e3b,0_5px_10px_rgba(16,185,129,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_#064e3b] cursor-pointer hover:scale-105'
                          } ${getDailyTrayTextClass(number, dailyRow2Items)}`}
                        >
                          <span className="leading-none flex items-center justify-center font-black truncate max-w-full px-0.5">
                            {number}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Bottom Action Controls (Modern 3D Cyber Arcade Matching Reference Design) */}
              <div 
                className="flex items-center justify-around px-4 pt-3 pb-8 sm:pb-6"
                style={{ paddingBottom: 'max(2.25rem, calc(env(safe-area-inset-bottom, 0px) + 1.5rem))' }}
              >
                {/* 1. Daily Hub / Mission Records Button */}
                <button 
                  onClick={() => { sound.click(); navigateTo('daily'); }} 
                  aria-label="Daily Challenge Hub" 
                  className="relative grid h-[54px] w-[54px] place-items-center rounded-2xl bg-gradient-to-b from-[#2563eb] via-[#1d4ed8] to-[#173887] border-2 border-cyan-400 text-cyan-100 shadow-[0_4px_0_#0c235c,0_6px_16px_rgba(0,229,255,0.35),inset_0_1px_2px_rgba(255,255,255,0.45)] hover:scale-105 active:translate-y-1 active:shadow-[0_1px_0_#0c235c] transition-all cursor-pointer"
                  title="Daily Hub"
                >
                  <svg className="w-6 h-6 text-cyan-200 drop-shadow-[0_0_8px_rgba(0,229,255,0.85)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7.5" height="7.5" rx="2.5" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" />
                    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.5" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" />
                    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.5" fill="rgba(56,189,248,0.15)" stroke="#38bdf8" />
                    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.5" fill="rgba(56,189,248,0.3)" stroke="#38bdf8" />
                  </svg>
                </button>

                {/* 2. Undo Move Button */}
                <button 
                  onClick={undoDailyNumber} 
                  aria-label="Undo last number" 
                  disabled={!dailyGameHistory.length} 
                  className={`relative grid h-[54px] w-[54px] place-items-center rounded-2xl transition-all ${
                    dailyGameHistory.length > 0
                      ? 'bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] border-2 border-cyan-300 text-white shadow-[0_4px_0_#082f49,0_8px_20px_rgba(14,165,233,0.55),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:scale-105 active:translate-y-1 active:shadow-[0_1px_0_#082f49] cursor-pointer'
                      : 'bg-gradient-to-b from-[#1b3670]/80 via-[#152c5c]/85 to-[#0f2249]/90 border-2 border-cyan-500/30 shadow-[0_4px_0_#0b1a38] text-cyan-200/50 cursor-not-allowed opacity-75'
                  }`}
                  title="Undo Number"
                >
                  <svg className={`w-6 h-6 ${dailyGameHistory.length > 0 ? 'text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.95)]' : 'text-cyan-300/60'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 10h11a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5H9" />
                    <path d="M7 6L3 10l4 4" />
                  </svg>
                  {dailyGameHistory.length > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1 rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 border-2 border-white text-slate-950 font-black text-[10px] flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.95)] animate-bounce leading-none">
                      {dailyGameHistory.length}
                    </span>
                  )}
                </button>

                {/* 3. Instructions & Rules Button (Pointed by User Red Arrow) */}
                <button 
                  onClick={() => {
                    sound.click();
                    const proceed = () => setShowDailyInstructionsModal(true);
                    adMobService.showInterstitial({ force: true, onClose: proceed });
                  }} 
                  aria-label="Mission Instructions & How to Play" 
                  className="relative grid h-[54px] w-[54px] place-items-center rounded-2xl bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706] border-2 border-yellow-200 shadow-[0_4px_0_#92400e,0_8px_24px_rgba(245,158,11,0.65),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:scale-105 active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer"
                  title="Mission Instructions"
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-8 h-8 rounded-full bg-amber-300/40 blur-[3px] animate-pulse pointer-events-none" />
                    <svg className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.95)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9.5" stroke="#ffffff" strokeWidth="2.2" fill="rgba(254, 240, 138, 0.3)" />
                      <line x1="12" y1="16" x2="12" y2="11.5" stroke="#ffffff" strokeWidth="2.5" />
                      <circle cx="12" cy="8" r="1.3" fill="#ffffff" />
                    </svg>
                  </div>
                  <span className="absolute -bottom-2 rounded-full bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 border border-amber-950/40 px-2 py-0.5 text-[9px] font-black text-amber-950 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_0_10px_rgba(251,191,36,0.95)] tracking-wider leading-none">
                    INFO
                  </span>
                </button>
              </div>
            </div>

            {/* 3D Glassmorphic "Protocol Instructions" Banner Modal (Compact Height & Reduced Text Sizes) */}
            {showDailyInstructionsModal && (
              <div className="fixed inset-0 z-50 bg-[#06122c]/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative w-full max-w-[315px] sm:max-w-[335px] rounded-[32px] p-3.5 pt-9 sm:pt-10 bg-gradient-to-b from-white/95 via-[#f0f7ff]/95 to-[#e0efff]/95 border-2 border-white/90 shadow-[0_25px_60px_-10px_rgba(8,24,68,0.6),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(56,189,248,0.2)] text-center overflow-visible max-h-[78vh] sm:max-h-[80vh] flex flex-col">

                  {/* Top Close Button (Top-Right) */}
                  <button
                    onClick={() => {
                      sound.click();
                      setShowDailyInstructionsModal(false);
                    }}
                    aria-label="Close Instructions"
                    title="Close Instructions"
                    className="absolute top-3 right-3 z-30 w-7 h-7 rounded-full bg-blue-100/90 hover:bg-blue-200 border border-white text-[#1e3a8a] flex items-center justify-center font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>

                  {/* 3D Hero + Halo + Arched Banner (Floating Overflow Compact) */}
                  <div className="absolute -top-11 sm:-top-12 left-1/2 -translate-x-1/2 w-52 flex flex-col items-center pointer-events-none z-20">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -bottom-1 w-24 h-10 bg-gradient-to-t from-[#bae6fd] to-white rounded-full blur-[1px] shadow-sm -z-10" />

                      {/* 3D Blueprint / Brain Hologram Icon */}
                      <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border-2 border-cyan-200 flex items-center justify-center text-2xl sm:text-3xl shadow-[0_6px_16px_rgba(14,165,233,0.5),inset_0_2px_4px_rgba(255,255,255,0.7)]">
                        <span className="drop-shadow-md">📘</span>
                      </div>
                    </div>

                    {/* Arched 3D Banner "Instructions" */}
                    <div className="relative -mt-2 w-52 h-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(29,78,216,0.45)] scale-90">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 52" fill="none">
                        <path d="M12 36 L0 26 L12 16 L22 22 L22 34 Z" fill="#1e40af" />
                        <path d="M22 22 L35 14 L35 34 L22 34 Z" fill="#172554" />
                        <path d="M208 36 L220 26 L208 16 L198 22 L198 34 Z" fill="#1e40af" />
                        <path d="M198 22 L185 14 L185 34 L198 34 Z" fill="#172554" />
                        <path d="M18 20 C60 6, 160 6, 202 20 C206 36, 196 46, 185 45 C150 38, 70 38, 35 45 C24 46, 14 36, 18 20 Z" fill="url(#dailyInstructionsRibbonGrad)" stroke="#60a5fa" strokeWidth="2" />
                        <defs>
                          <linearGradient id="dailyInstructionsRibbonGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="relative z-10 flex items-center justify-center pb-0.5 select-none">
                        <span className="font-black text-sm sm:text-base tracking-wide text-[#fde047] drop-shadow-[0_2px_4px_rgba(180,83,9,0.9)] font-display">
                          Instructions
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clock / Compass Divider */}
                  <div className="flex items-center justify-center gap-2 my-1 mt-1 shrink-0">
                    <div className="h-[1.5px] w-8 bg-gradient-to-r from-transparent via-blue-300 to-blue-400 rounded-full" />
                    <div className="w-5 h-5 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-600 shadow-inner">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </div>
                    <div className="h-[1.5px] w-8 bg-gradient-to-l from-transparent via-blue-300 to-blue-400 rounded-full" />
                  </div>

                  {/* Headline & Description */}
                  <h2 className="text-[#152a55] font-black text-xs sm:text-sm tracking-tight font-display mb-0.5 shrink-0">
                    Quantum Reactor Calibration
                  </h2>
                  <p className="text-[#4b618a] text-[9px] sm:text-[9.5px] font-semibold px-2 leading-tight mb-1.5 shrink-0">
                    Follow these mission parameters to balance all cores:
                  </p>

                  {/* Scrollable Marked Instructions Content */}
                  <div className="flex-1 overflow-y-auto no-scrollbar space-y-1.5 text-left pr-0.5">
                    
                    {/* 1. System Mission */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-white/90 border border-blue-200/80 shadow-xs">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className="text-xs">🧬</span>
                        <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-blue-950 font-display">
                          Mission Objective
                        </span>
                      </div>
                      <p className="text-[8.5px] sm:text-[9px] text-slate-700 font-medium leading-tight">
                        Balance all <b>3 Reactor Cores</b> simultaneously and lock the central <b>Connected Resonance Link</b> to clear Day {dailyGameDay}.
                      </p>
                    </div>

                    {/* 2. Core Alpha Formula */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-[#eff6ff] border border-cyan-300/80 shadow-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-xs" />
                          <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-blue-900 font-display">
                            Core Alpha // Row 1
                          </span>
                        </div>
                        <span className="text-[8px] font-black text-cyan-800 bg-cyan-100 px-1.5 py-0.5 rounded border border-cyan-200">
                          TARGET = {targetAlpha}
                        </span>
                      </div>
                      <div className="p-1 rounded-lg bg-white/90 border border-cyan-200 font-mono text-[9.5px] sm:text-[10px] font-black text-blue-950 text-center my-0.5">
                        (α-1 {rowAlpha.op1} α-2) {rowAlpha.op2} α-3 = {targetAlpha}
                      </div>
                      <p className="text-[8px] sm:text-[8.5px] text-slate-600 leading-tight">
                        Place data chips in Core Alpha to balance equation 1 to target <b>{targetAlpha}</b>.
                      </p>
                    </div>

                    {/* 3. Core Beta Formula */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-[#faf5ff] border border-purple-300/80 shadow-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-xs" />
                          <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-purple-900 font-display">
                            Core Beta // Row 2
                          </span>
                        </div>
                        <span className="text-[8px] font-black text-purple-800 bg-purple-100 px-1.5 py-0.5 rounded border border-purple-200">
                          TARGET = {targetBeta}
                        </span>
                      </div>
                      <div className="p-1 rounded-lg bg-white/90 border border-purple-200 font-mono text-[9.5px] sm:text-[10px] font-black text-purple-950 text-center my-0.5">
                        (β-1 {rowBeta.op1} β-2) {rowBeta.op2} β-3 = {targetBeta}
                      </div>
                      <p className="text-[8px] sm:text-[8.5px] text-slate-600 leading-tight">
                        Place data chips in Core Beta to balance equation 2 to target <b>{targetBeta}</b>.
                      </p>
                    </div>

                    {/* 4. Core Gamma Formula */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-[#ecfdf5] border border-emerald-300/80 shadow-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" />
                          <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-emerald-900 font-display">
                            Core Gamma // Row 3
                          </span>
                        </div>
                        <span className="text-[8px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                          TARGET = {targetGamma}
                        </span>
                      </div>
                      <div className="p-1 rounded-lg bg-white/90 border border-emerald-200 font-mono text-[9.5px] sm:text-[10px] font-black text-emerald-950 text-center my-0.5">
                        (γ-1 {rowGamma.op1} γ-2) {rowGamma.op2} γ-3 = {targetGamma}
                      </div>
                      <p className="text-[8px] sm:text-[8.5px] text-slate-600 leading-tight">
                        Place data chips in Core Gamma to balance equation 3 to target <b>{targetGamma}</b>.
                      </p>
                    </div>

                    {/* 5. Connected Resonance Link */}
                    <div className="p-1.5 sm:p-2 rounded-xl bg-[#fffbeb] border border-amber-300/80 shadow-xs">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-amber-950 font-display flex items-center gap-1">
                          <span>🔗</span> Connected Resonance Link
                        </span>
                        <span className="text-[8px] font-black text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                          TARGET = {targetLink}
                        </span>
                      </div>
                      <div className="p-1 rounded-lg bg-white/90 border border-amber-200 font-mono text-[9.5px] sm:text-[10px] font-black text-amber-950 text-center my-0.5">
                        α-2 {colLink.op1} β-2 {colLink.op2} γ-2 = {targetLink}
                      </div>
                      <p className="text-[8px] sm:text-[8.5px] text-slate-600 leading-tight">
                        The central column connects all 3 cores vertically! Both rows and the column must balance!
                      </p>
                    </div>

                  </div>

                  {/* Action Controls */}
                  <div className="pt-2 shrink-0">
                    <button
                      onClick={() => {
                        sound.click();
                        setShowDailyInstructionsModal(false);
                      }}
                      aria-label="Continue Mission"
                      className="w-full h-9 sm:h-9.5 rounded-full bg-gradient-to-b from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] border-2 border-blue-200/90 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_3px_0_#1e40af,0_6px_16px_rgba(37,99,235,0.4),inset_0_1.5px_2px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-0.5 active:shadow-[0_1px_0_#1e40af] transition-all cursor-pointer"
                    >
                      <span>✓</span>
                      <span>Got It! Resume Mission</span>
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* 3D Glassmorphic "Time Out" Banner Modal (Identical to Image 2 Reference) */}
            {dailyGameTimeOver && (
              <div className="fixed inset-0 z-50 bg-[#06122c]/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative w-full max-w-[320px] sm:max-w-[335px] rounded-[36px] p-5 sm:p-6 pt-14 sm:pt-16 bg-gradient-to-b from-white/95 via-[#f0f7ff]/95 to-[#e0efff]/95 border-2 border-white/90 shadow-[0_25px_60px_-10px_rgba(8,24,68,0.6),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(56,189,248,0.2)] text-center overflow-visible">

                  {/* Top Close Button */}
                  <button
                    onClick={() => {
                      sound.click();
                      setDailyGameTimeOver(false);
                      navigateTo('daily');
                    }}
                    aria-label="Close"
                    title="Close"
                    className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-blue-100/90 hover:bg-blue-200 border border-white text-[#1e3a8a] flex items-center justify-center font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>

                  {/* 3D Hourglass Hero + Halo + Arched Banner */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-52 flex flex-col items-center pointer-events-none z-20">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -bottom-1.5 w-28 h-10 bg-gradient-to-t from-[#bae6fd] to-white rounded-full blur-[1px] shadow-sm -z-10" />

                      {/* Left Splashes */}
                      <svg className="absolute -left-0.5 top-2 w-7 h-7 text-[#38bdf8] drop-shadow-[0_2px_4px_rgba(56,189,248,0.45)] -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                      <svg className="absolute -left-3 top-6 w-5 h-5 text-[#0ea5e9] drop-shadow-[0_1.5px_3px_rgba(14,165,233,0.35)] -rotate-45" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>

                      {/* Right Splashes */}
                      <svg className="absolute -right-0.5 top-2 w-7 h-7 text-[#38bdf8] drop-shadow-[0_2px_4px_rgba(56,189,248,0.45)] rotate-12 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                      <svg className="absolute -right-3 top-6 w-5 h-5 text-[#0ea5e9] drop-shadow-[0_1.5px_3px_rgba(14,165,233,0.35)] rotate-45 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>

                      {/* 3D Hourglass SVG Graphic (Sleek Compact Size) */}
                      <svg className="w-20 h-20 drop-shadow-[0_6px_14px_rgba(14,165,233,0.4)]" viewBox="0 0 100 100" fill="none">
                        <ellipse cx="50" cy="18" rx="22" ry="7" fill="url(#dailyTimeOutHgBlue)" stroke="#38bdf8" strokeWidth="2" />
                        <ellipse cx="50" cy="16" rx="19" ry="5" fill="#7dd3fc" />
                        <ellipse cx="50" cy="82" rx="22" ry="7" fill="url(#dailyTimeOutHgBlue)" stroke="#38bdf8" strokeWidth="2" />
                        <ellipse cx="50" cy="80" rx="19" ry="5" fill="#0284c7" />
                        <path d="M33 20 C33 42, 46 48, 46 50 C46 52, 33 58, 33 80 L67 80 C67 58, 54 52, 54 50 C54 48, 67 42, 67 20 Z" fill="rgba(224, 242, 254, 0.45)" stroke="#38bdf8" strokeWidth="2.5" />
                        <path d="M36 24 C36 38, 46 44, 46 50 C46 56, 36 62, 36 76" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" />
                        <path d="M38 32 C38 43, 47 47, 50 49 C53 47, 62 43, 62 32 Z" fill="url(#dailyTimeOutHgGold)" />
                        <ellipse cx="50" cy="32" rx="12" ry="3" fill="#fde047" />
                        <line x1="50" y1="49" x2="50" y2="68" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2" />
                        <path d="M36 78 C38 68, 46 64, 50 64 C54 64, 62 68, 64 78 Z" fill="url(#dailyTimeOutHgGold)" />
                        <defs>
                          <linearGradient id="dailyTimeOutHgBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#0284c7" />
                            <stop offset="100%" stopColor="#0369a1" />
                          </linearGradient>
                          <linearGradient id="dailyTimeOutHgGold" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#fef08a" />
                            <stop offset="40%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#d97706" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>

                    {/* Arched 3D Banner "Time Out" (Clean, Compact, No Stars) */}
                    <div className="relative -mt-2.5 w-48 h-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(29,78,216,0.45)]">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 52" fill="none">
                        <path d="M12 36 L0 26 L12 16 L22 22 L22 34 Z" fill="#1e40af" />
                        <path d="M22 22 L35 14 L35 34 L22 34 Z" fill="#172554" />
                        <path d="M208 36 L220 26 L208 16 L198 22 L198 34 Z" fill="#1e40af" />
                        <path d="M198 22 L185 14 L185 34 L198 34 Z" fill="#172554" />
                        <path d="M18 20 C60 6, 160 6, 202 20 C206 36, 196 46, 185 45 C150 38, 70 38, 35 45 C24 46, 14 36, 18 20 Z" fill="url(#dailyTimeOutRibbonGrad)" stroke="#60a5fa" strokeWidth="2" />
                        <defs>
                          <linearGradient id="dailyTimeOutRibbonGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="relative z-10 flex items-center justify-center pb-0.5 select-none">
                        <span className="font-black text-base sm:text-[17px] tracking-tight text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.6)] font-display">
                          Time <span className="text-[#fde047] drop-shadow-[0_2px_4px_rgba(180,83,9,0.8)]">Out</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Clock Divider */}
                  <div className="flex items-center justify-center gap-2.5 my-2.5 mt-3">
                    <div className="h-[1.5px] w-10 bg-gradient-to-r from-transparent via-blue-300 to-blue-400 rounded-full" />
                    <div className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-600 shadow-inner">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                    </div>
                    <div className="h-[1.5px] w-10 bg-gradient-to-l from-transparent via-blue-300 to-blue-400 rounded-full" />
                  </div>

                  {/* Headline & Description */}
                  <h2 className="text-[#152a55] font-black text-lg sm:text-xl tracking-tight font-display mb-0.5">
                    Take a short break!
                  </h2>
                  <p className="text-[#4b618a] text-xs font-semibold px-2 leading-relaxed mb-5">
                    You can continue the game anytime you're ready.
                  </p>

                  {/* Action Controls */}
                  <div className="space-y-2.5">
                    {/* Primary 3D Restart Button */}
                    <button
                      onClick={() => {
                        sound.click();
                        startDailyChallenge(dailyGameDay);
                      }}
                      aria-label="Restart Daily Challenge"
                      className="w-full h-12 rounded-full bg-gradient-to-b from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] border-2 border-blue-200/90 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_0_#1e40af,0_8px_20px_rgba(37,99,235,0.4),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#1e40af] transition-all cursor-pointer"
                    >
                      <svg className="w-5 h-5 text-white stroke-[2.8] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                      </svg>
                      <span>Restart</span>
                    </button>

                    {/* Secondary Options: +30s Extra Time & Daily Hub */}
                    <div className="grid grid-cols-2 gap-2 pt-0.5">
                      <button
                        onClick={() => {
                          sound.click();
                          setDailyGameTimer(t => t + 30);
                          setDailyGameTimeOver(false);
                        }}
                        aria-label="Extra Time (+30s)"
                        className="h-10 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 border border-amber-200 text-amber-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_2.5px_0_#b45309,0_5px_12px_rgba(245,158,11,0.3)] active:translate-y-0.5 active:shadow-[0_1px_0_#b45309] transition-all cursor-pointer"
                      >
                        <span>⚡</span>
                        <span>+30s Time</span>
                      </button>
                      <button
                        onClick={() => {
                          sound.click();
                          setDailyGameTimeOver(false);
                          navigateTo('daily');
                        }}
                        aria-label="Daily Hub"
                        className="h-10 rounded-2xl bg-blue-100/90 hover:bg-blue-200/90 border border-blue-300 text-blue-900 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_2.5px_0_#93c5fd] active:translate-y-0.5 active:shadow-[0_1px_0_#93c5fd] transition-all cursor-pointer"
                      >
                        <span>📅</span>
                        <span>Daily Hub</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3D Glassmorphic "Daily Cleared" Victory Banner Modal */}
            {dailyGameVictoryModal && (
              <div className="fixed inset-0 z-50 bg-[#06122c]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative w-full max-w-[320px] sm:max-w-[335px] rounded-[36px] p-5 sm:p-6 pt-14 sm:pt-16 bg-gradient-to-b from-white/95 via-[#f0fdf4]/95 to-[#dcfce7]/95 border-2 border-white/90 shadow-[0_25px_60px_-10px_rgba(6,78,59,0.5),inset_0_2px_4px_rgba(255,255,255,0.95)] text-center overflow-visible">

                  {/* Floating 3D Trophy / Star + Arched Ribbon */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-52 flex flex-col items-center pointer-events-none z-20">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -bottom-1.5 w-28 h-10 bg-gradient-to-t from-[#bbf7d0] to-white rounded-full blur-[1px] shadow-sm -z-10" />

                      {/* 3D Trophy Graphic (Sleek Compact Size) */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 border-2 border-yellow-200 flex items-center justify-center text-3xl shadow-[0_8px_18px_rgba(245,158,11,0.45),inset_0_2px_4px_rgba(255,255,255,0.8)]">
                        🏆
                      </div>
                    </div>

                    {/* Arched 3D Banner "Daily Cleared" (Clean, Compact, No Stars) */}
                    <div className="relative -mt-2.5 w-48 h-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(5,150,105,0.45)]">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 52" fill="none">
                        <path d="M12 36 L0 26 L12 16 L22 22 L22 34 Z" fill="#047857" />
                        <path d="M22 22 L35 14 L35 34 L22 34 Z" fill="#064e3b" />
                        <path d="M208 36 L220 26 L208 16 L198 22 L198 34 Z" fill="#047857" />
                        <path d="M198 22 L185 14 L185 34 L198 34 Z" fill="#064e3b" />
                        <path d="M18 20 C60 6, 160 6, 202 20 C206 36, 196 46, 185 45 C150 38, 70 38, 35 45 C24 46, 14 36, 18 20 Z" fill="url(#dailyWinRibbonGrad)" stroke="#34d399" strokeWidth="2" />
                        <defs>
                          <linearGradient id="dailyWinRibbonGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#059669" />
                            <stop offset="100%" stopColor="#047857" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="relative z-10 flex items-center justify-center pb-0.5 select-none">
                        <span className="font-black text-base sm:text-[17px] tracking-tight text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.6)] font-display">
                          Daily <span className="text-[#fef08a] drop-shadow-[0_2px_4px_rgba(180,83,9,0.8)]">Cleared</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Headline */}
                  <h2 className="text-[#064e3b] font-black text-lg sm:text-xl tracking-tight font-display mt-2 mb-0.5">
                    Protocol Synchronized!
                  </h2>
                  <p className="text-[#047857] text-xs font-semibold px-2 leading-relaxed mb-3">
                    Day {dailyGameDay} Quantum Matrix Cleared (3★)
                  </p>

                  {/* Rewards Section */}
                  <div className="grid grid-cols-2 gap-2 my-2.5">
                    <div className="p-2 rounded-2xl bg-amber-50 border border-amber-300 shadow-sm flex flex-col items-center">
                      <span className="text-[9.5px] text-amber-800 font-bold uppercase">Reward</span>
                      <span className="text-xs sm:text-sm font-black text-amber-600 font-display mt-0.5">+150 Coins 🪙</span>
                    </div>
                    <div className="p-2 rounded-2xl bg-cyan-50 border border-cyan-300 shadow-sm flex flex-col items-center">
                      <span className="text-[9.5px] text-cyan-800 font-bold uppercase">Bonus</span>
                      <span className="text-xs sm:text-sm font-black text-cyan-600 font-display mt-0.5">+20 Gems 💎</span>
                    </div>
                  </div>

                  {/* Streak Card */}
                  <div className="p-2 rounded-xl bg-orange-100/80 border border-orange-300 text-xs text-orange-900 font-bold mb-3.5 flex items-center justify-center gap-1.5">
                    <span>🔥</span>
                    <span>Streak Extended: {streakDays} Consecutive Days!</span>
                  </div>

                  {/* Primary Return Button */}
                  <button
                    onClick={() => {
                      sound.click();
                      setDailyGameVictoryModal(false);
                      navigateTo('daily');
                    }}
                    className="w-full h-12 rounded-full bg-gradient-to-b from-[#10b981] via-[#059669] to-[#047857] border-2 border-emerald-200/90 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center shadow-[0_4px_0_#064e3b,0_8px_20px_rgba(16,185,129,0.4),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#064e3b] transition-all cursor-pointer"
                  >
                    Collect Rewards & Return to Hub
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      };

      const renderBattleScreen = () => (
        <div className="reference-screen reference-screen-enter flex-1 flex flex-col overflow-hidden bg-[linear-gradient(115deg,#fff3dd_0%,#edf7ff_100%)] px-5 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => navigateTo('home')} aria-label="Back to Home" className="grid h-10 w-10 place-items-center rounded-full bg-white text-xl font-bold text-slate-800 shadow-sm hover:text-blue-600 transition-colors">←</button>
              <h1 className="text-xl font-black">Battle</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navigateTo('leaderboard')} aria-label="Trophy leaderboard" className="grid h-11 w-11 place-items-center rounded-full border border-white bg-white text-2xl text-blue-900 shadow-sm">🏆</button>
              <button onClick={() => navigateTo('help')} aria-label="Battle information" className="grid h-11 w-11 place-items-center rounded-full border border-white bg-white text-lg font-black text-blue-900 shadow-sm">ⓘ</button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="rounded-full bg-slate-700/75 px-3 py-1.5 text-sm font-bold text-white">Oct&nbsp; | &nbsp;◴ 22d 10h</span>
            <button onClick={() => navigateTo('achievements')} className="rounded-full bg-slate-700/70 px-3 py-1 text-sm font-bold text-white">🎟️ &nbsp;13&nbsp; <span className="text-lg text-blue-300">+</span></button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="relative grid h-36 w-36 place-items-center rounded-[34px] border-[10px] border-[#dca9a2] bg-gradient-to-br from-[#f2cbc1] via-[#bf7b72] to-[#8f5662] shadow-[0_12px_25px_rgba(112,65,71,.25)]">
              <span className="text-7xl text-white drop-shadow-md">✦</span>
              <span className="absolute -bottom-5 grid h-12 w-12 place-items-center rounded-full border-4 border-white bg-[#c87875] text-lg font-black text-white shadow">1</span>
            </div>
            <div className="mt-12 flex items-center gap-5 text-lg">
              <span>Wins <b className="text-2xl text-emerald-600">0</b></span>
              <span className="text-slate-400">|</span>
              <span>Losses <b className="text-2xl">0</b></span>
            </div>
            <div className="mt-10 flex w-[78%] items-center">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-white shadow-inner"><div className="h-full w-0 rounded-full bg-blue-500" /></div>
              <span className="-ml-2 text-5xl drop-shadow-md">⚡</span>
            </div>
            <span className="-mt-1 text-sm font-bold text-slate-700">0 / 3</span>
          </div>
          <button onClick={startNewPuzzle} className="reference-primary-button mb-4 w-full rounded-full py-3 text-center text-xl font-black text-white">
            Start
            <span className="block text-xs font-semibold text-white/75">🔒 &nbsp;(0/20)&nbsp;&nbsp;&nbsp; 🎟️ ×1</span>
          </button>
        </div>
      );

      // ========================================================
      // ========================================================
      // 11. STATISTICS (Cyber Arcade Modernization)
      // ========================================================
      const renderStatsScreen = () => {
        const winRate = Math.min(98, Math.max(65, 70 + Math.round((activePlayerLevel * 1.8))));
        const gamesStarted = Math.max(8, activePlayerLevel * 4 + 3);
        const gamesWon = Math.round(gamesStarted * (winRate / 100));
        const totalScore = (coins * 12 + activePlayerLevel * 500).toLocaleString();
        const overallMastery = Math.min(100, Math.max(40, Math.round((activePlayerLevel / 25) * 100)));
        const totalTimeHours = Math.floor(activePlayerLevel * 0.5 + 4);
        const totalTimeMinutes = Math.round((activePlayerLevel * 7) % 60);
        return (
          <div className="flex-1 scifi-game-bg flex flex-col overflow-hidden text-white relative select-none">
            {/* Mathematical Coordinate Blueprint Overlay */}
            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 scifi-ambient-cyan rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 right-0 w-80 h-80 scifi-ambient-blue rounded-full pointer-events-none" />

            {/* Sticky Modern Sci-Fi Header */}
            <header className="sticky top-0 z-20 scifi-header-bg border-b border-cyan-400/20 px-4 pt-3 pb-2.5 shrink-0 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { sound.click(); navigateTo('home'); }} 
                  aria-label="Back to home" 
                  className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-xl font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ‹
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📊</span>
                  <h1 className="text-base sm:text-lg font-black font-display tracking-wider bg-gradient-to-r from-cyan-300 via-sky-100 to-white bg-clip-text text-transparent uppercase">
                    Combat Telemetry
                  </h1>
                </div>
                <button 
                  onClick={() => { sound.click(); navigateTo('leaderboard'); }} 
                  aria-label="Leaderboard" 
                  className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-base font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  🏆
                </button>
              </div>

              {/* Cyber Segmented Pill Tabs */}
              <div className="mt-2.5 flex items-center gap-1.5 p-1 rounded-2xl bg-[#030919]/90 border border-cyan-500/30 shadow-inner">
                {[
                  { id: 'overview', label: 'Overview', icon: '📈' },
                  { id: 'levels', label: 'Levels', icon: '🎮' },
                  { id: 'daily', label: 'Daily', icon: '🔥' },
                ].map((tab) => {
                  const isActive = statsTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      data-tab={tab.id}
                      onClick={() => {
                        sound.click();
                        setStatsTab(tab.id);
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black font-display tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-[0_0_12px_rgba(0,229,255,0.6)] border border-cyan-300/60'
                          : 'text-slate-400 hover:text-cyan-200 hover:bg-white/5'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </header>

            {/* Scrollable Telemetry Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-24 space-y-4 relative z-10">

              {/* TAB 1: OVERVIEW */}
              {statsTab === 'overview' && (
                <>
                  {/* Hero Cyber Mastery Circular Gauge Card */}
                  <div className="relative rounded-3xl p-4 bg-gradient-to-b from-[#102761]/95 via-[#0b1c48]/90 to-[#071330]/95 border border-cyan-400/40 shadow-[0_12px_32px_rgba(0,0,0,0.6)] overflow-hidden">
                    <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-3 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                        <span className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                          Tactical Mastery Index
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#040e24] border border-cyan-400/30 text-cyan-300">
                        TIER: {activePlayerLevel >= 25 ? 'APEX' : activePlayerLevel >= 15 ? 'ELITE' : 'ACTIVE'}
                      </span>
                    </div>

                    {/* Circular Neon Radial Meter & Flank Indicators */}
                    <div className="relative z-10 flex items-center justify-around py-2">
                      {/* Left Flank: Precision */}
                      <div className="text-center">
                        <div className="w-9 h-9 mx-auto rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 text-sm mb-1">
                          🎯
                        </div>
                        <span className="text-base font-black text-emerald-300 font-display block leading-none">
                          {winRate}%
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5 block">
                          Accuracy
                        </span>
                      </div>

                      {/* Center Radial Gauge */}
                      <div className="relative w-36 h-36 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]" viewBox="0 0 36 36">
                          {/* Background Track */}
                          <path
                            className="text-[#081a42]"
                            strokeWidth="3.2"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          {/* Active Neon Progress Arc */}
                          <path
                            stroke="url(#neonGradient)"
                            strokeDasharray={`${overallMastery}, 100`}
                            strokeWidth="3.4"
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <defs>
                            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#00e5ff" />
                              <stop offset="50%" stopColor="#3b82f6" />
                              <stop offset="100%" stopColor="#a855f7" />
                            </linearGradient>
                          </defs>
                        </svg>

                        {/* Center Hologram Text */}
                        <div className="absolute text-center flex flex-col items-center">
                          <span className="text-[9.5px] font-bold text-sky-300/80 uppercase tracking-tight">
                            TOTAL
                          </span>
                          <span className="text-2xl font-black font-display text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] leading-none my-0.5">
                            {overallMastery}%
                          </span>
                          <span className="text-[8.5px] font-mono text-cyan-300 font-bold bg-[#040e24]/90 px-1.5 py-0.2 rounded border border-cyan-400/30">
                            LV.{activePlayerLevel}
                          </span>
                        </div>
                      </div>

                      {/* Right Flank: Total Victories */}
                      <div className="text-center">
                        <div className="w-9 h-9 mx-auto rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-sm mb-1">
                          🧩
                        </div>
                        <span className="text-base font-black text-amber-300 font-display block leading-none">
                          {gamesWon}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5 block">
                          Victories
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 4 Cyber Metric Pillars (2x2 Grid) */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* 1. Puzzles Solved */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-md relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-sm shadow-[0_0_8px_rgba(0,229,255,0.3)]">
                          🧩
                        </div>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                          SOLVED
                        </span>
                      </div>
                      <span className="text-lg font-black font-display text-white block">
                        {gamesWon} <span className="text-xs text-slate-400 font-normal">/ {gamesStarted}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight block mt-0.5">
                        Puzzles Solved
                      </span>
                    </div>

                    {/* 2. Best Streak */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-orange-400/30 shadow-md relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-400/40 flex items-center justify-center text-orange-300 text-sm shadow-[0_0_8px_rgba(249,115,22,0.3)]">
                          🔥
                        </div>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-400/30">
                          ACTIVE
                        </span>
                      </div>
                      <span className="text-lg font-black font-display text-orange-300 block">
                        {streakDays} <span className="text-xs text-slate-300 font-normal">Days</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight block mt-0.5">
                        Consecutive Streak
                      </span>
                    </div>

                    {/* 3. Total Time */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-purple-400/30 shadow-md relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 text-sm shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                          ⏱️
                        </div>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                          RECORDED
                        </span>
                      </div>
                      <span className="text-lg font-black font-display text-purple-300 block">
                        {totalTimeHours}h {totalTimeMinutes}m
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight block mt-0.5">
                        Total Play Time
                      </span>
                    </div>

                    {/* 4. Total Score */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-amber-400/30 shadow-md relative overflow-hidden group">
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-sm shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                          ⚡
                        </div>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                          POINTS
                        </span>
                      </div>
                      <span className="text-lg font-black font-display text-amber-300 block">
                        {totalScore}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-tight block mt-0.5">
                        Combat Score
                      </span>
                    </div>
                  </div>

                  {/* Tactical Weekly Activity Holographic Equalizer Chart */}
                  <div className="rounded-2xl p-4 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-xs">
                          📊
                        </div>
                        <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                          Weekly Tactical Output
                        </h3>
                      </div>
                      <span className="text-[10px] text-cyan-300/80 font-mono">
                        Avg: <strong className="text-emerald-300">14.2s / puzzle</strong>
                      </span>
                    </div>

                    {/* Equalizer Bar Columns */}
                    <div className="h-28 w-full flex items-end justify-between gap-2 px-1 pt-3 pb-1 border-b border-cyan-400/20">
                      {[
                        { day: 'Mon', height: '45%', val: '4', active: false },
                        { day: 'Tue', height: '65%', val: '6', active: false },
                        { day: 'Wed', height: '40%', val: '3', active: false },
                        { day: 'Thu', height: '80%', val: '8', active: false },
                        { day: 'Fri', height: '70%', val: '7', active: false },
                        { day: 'Sat', height: '100%', val: '12', active: true },
                        { day: 'Sun', height: '85%', val: '9', active: true },
                      ].map((bar) => (
                        <div key={bar.day} className="flex-1 flex flex-col items-center h-full justify-end group">
                          <span className={`text-[9px] font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity ${bar.active ? 'text-cyan-300 opacity-100' : 'text-slate-400'}`}>
                            {bar.val}
                          </span>
                          <div className="w-full max-w-[28px] bg-[#050f26] rounded-t-lg p-0.5 h-full flex items-end border border-cyan-500/20">
                            <div 
                              className={`w-full rounded-t-md transition-all duration-500 ${
                                bar.active 
                                  ? 'bg-gradient-to-t from-cyan-500 via-blue-500 to-sky-300 shadow-[0_0_12px_rgba(0,229,255,0.7)]' 
                                  : 'bg-gradient-to-t from-blue-900 to-cyan-700/60'
                              }`}
                              style={{ height: bar.height }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Day Labels */}
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 pt-2 px-1">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span className="text-cyan-300">Sat</span><span className="text-cyan-300">Sun</span>
                    </div>
                  </div>

                  {/* Speed & Precision Live Metrics */}
                  <div className="rounded-2xl p-3.5 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300 text-xs">
                          ⚡
                        </div>
                        <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                          Execution Precision
                        </h3>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Real-time Telemetry</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-[#050f26]/80 border border-cyan-400/20 rounded-xl p-2.5">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Fastest Solve</span>
                        <span className="text-sm font-black text-cyan-300 font-display block mt-0.5">4.2s</span>
                      </div>
                      <div className="bg-[#050f26]/80 border border-cyan-400/20 rounded-xl p-2.5">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Calc Speed</span>
                        <span className="text-sm font-black text-emerald-300 font-display block mt-0.5">8.4 /min</span>
                      </div>
                      <div className="bg-[#050f26]/80 border border-cyan-400/20 rounded-xl p-2.5">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Error Rate</span>
                        <span className="text-sm font-black text-purple-300 font-display block mt-0.5">&lt; 3.2%</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: LEVELS */}
              {statsTab === 'levels' && (
                <div className="space-y-3">
                  {/* Sector Progression Card */}
                  <div className="rounded-2xl p-4 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🎯</span>
                        <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                          Sector Mastery & Tiers
                        </h3>
                      </div>
                      <span className="text-[10px] text-cyan-300 font-mono">
                        Level {activePlayerLevel} / 25
                      </span>
                    </div>

                    <div className="space-y-3">
                      {[
                        { name: 'Cadet Sector', levels: 'Levels 1 - 5', color: 'from-cyan-400 to-blue-500', pct: 100, stars: '5/5', status: 'COMPLETED' },
                        { name: 'Operative Sector', levels: 'Levels 6 - 10', color: 'from-blue-400 to-indigo-500', pct: activePlayerLevel >= 10 ? 100 : Math.max(20, Math.round(((activePlayerLevel - 5) / 5) * 100)), stars: activePlayerLevel >= 10 ? '5/5' : `${Math.max(1, activePlayerLevel - 5)}/5`, status: activePlayerLevel >= 10 ? 'COMPLETED' : 'IN PROGRESS' },
                        { name: 'Veteran Sector', levels: 'Levels 11 - 15', color: 'from-indigo-400 to-purple-500', pct: activePlayerLevel >= 15 ? 100 : activePlayerLevel >= 11 ? Math.round(((activePlayerLevel - 10) / 5) * 100) : 0, stars: activePlayerLevel >= 15 ? '5/5' : activePlayerLevel >= 11 ? `${activePlayerLevel - 10}/5` : '0/5', status: activePlayerLevel >= 15 ? 'COMPLETED' : activePlayerLevel >= 11 ? 'IN PROGRESS' : 'LOCKED' },
                        { name: 'Master Sector', levels: 'Levels 16 - 20', color: 'from-purple-400 to-pink-500', pct: activePlayerLevel >= 20 ? 100 : activePlayerLevel >= 16 ? Math.round(((activePlayerLevel - 15) / 5) * 100) : 0, stars: activePlayerLevel >= 20 ? '5/5' : activePlayerLevel >= 16 ? `${activePlayerLevel - 15}/5` : '0/5', status: activePlayerLevel >= 20 ? 'COMPLETED' : activePlayerLevel >= 16 ? 'IN PROGRESS' : 'LOCKED' },
                        { name: 'Grandmaster Sector', levels: 'Levels 21 - 25', color: 'from-amber-400 to-yellow-500', pct: activePlayerLevel >= 25 ? 100 : activePlayerLevel >= 21 ? Math.round(((activePlayerLevel - 20) / 5) * 100) : 0, stars: activePlayerLevel >= 25 ? '5/5' : activePlayerLevel >= 21 ? `${activePlayerLevel - 20}/5` : '0/5', status: activePlayerLevel >= 25 ? 'APEX' : activePlayerLevel >= 21 ? 'IN PROGRESS' : 'LOCKED' },
                      ].map((sector) => (
                        <div key={sector.name} className="p-3 rounded-xl bg-[#06122d]/90 border border-cyan-500/20">
                          <div className="flex items-center justify-between text-xs font-bold mb-1">
                            <span className="text-white flex items-center gap-1.5">
                              <span>⭐</span> {sector.name}
                            </span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${sector.status === 'COMPLETED' || sector.status === 'APEX' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : sector.status === 'IN PROGRESS' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                              {sector.status}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                            <span>{sector.levels}</span>
                            <span className="font-mono text-cyan-300">Stars: {sector.stars} ({sector.pct}%)</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#030919] border border-cyan-500/30 overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${sector.color} transition-all duration-500`}
                              style={{ width: `${sector.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arithmetic Operations Proficiency */}
                  <div className="rounded-2xl p-4 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-base">🧮</span>
                      <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                        Arithmetic Operator Proficiency
                      </h3>
                    </div>
                    <div className="space-y-2.5">
                      {[
                        { op: '+ Addition', pct: 98, color: 'from-emerald-400 to-cyan-500' },
                        { op: '- Subtraction', pct: 92, color: 'from-cyan-400 to-blue-500' },
                        { op: '× Multiplication', pct: 86, color: 'from-blue-400 to-indigo-500' },
                        { op: '÷ Division', pct: 81, color: 'from-indigo-400 to-purple-500' },
                      ].map((item) => (
                        <div key={item.op} className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className="text-white">{item.op}</span>
                            <span className="text-cyan-300 font-mono">{item.pct}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-[#030919] border border-cyan-500/30 overflow-hidden">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: DAILY */}
              {statsTab === 'daily' && (
                <div className="space-y-3">
                  {/* Daily Combat Streak Banner */}
                  <div className="rounded-3xl p-4 bg-gradient-to-b from-[#102761]/95 via-[#0b1c48]/90 to-[#071330]/95 border border-orange-400/40 shadow-lg relative overflow-hidden">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🔥</span>
                        <h3 className="text-xs font-black font-display uppercase tracking-wider text-orange-200">
                          Daily Mission Telemetry
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-orange-950/80 border border-orange-400/40 text-orange-300">
                        {streakDays} DAY STREAK
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-[#050f26]/80 border border-orange-400/20 rounded-xl p-2.5 text-center">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Current Day</span>
                        <span className="text-base font-black text-orange-300 font-display block mt-0.5">Day {todayCalendarDay} / {daysInCurrentMonth}</span>
                      </div>
                      <div className="bg-[#050f26]/80 border border-orange-400/20 rounded-xl p-2.5 text-center">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Season Solves</span>
                        <span className="text-base font-black text-white font-display block mt-0.5">{completedDailyDays.length} Victories</span>
                      </div>
                    </div>

                    {/* 7-Day Streak Check-in Tracker */}
                    <div className="bg-[#06122d]/90 border border-orange-400/30 rounded-2xl p-3">
                      <span className="text-[10px] font-bold text-slate-300 block mb-2">
                        7-Day Activity Matrix
                      </span>
                      <div className="flex items-center justify-between gap-1.5">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
                          const isDone = i < Math.min(7, streakDays);
                          return (
                            <div key={i} className="flex-1 flex flex-col items-center">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border transition-all ${isDone ? 'bg-gradient-to-br from-orange-400 to-amber-500 border-amber-300 text-slate-950 shadow-[0_0_8px_rgba(251,146,60,0.5)]' : 'bg-[#030919] border-slate-700 text-slate-500'}`}>
                                {isDone ? '✓' : day}
                              </div>
                              <span className="text-[8.5px] font-mono text-slate-400 mt-1">D{i+1}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Monthly Challenge Trophy Card */}
                  <div className="rounded-2xl p-4 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-yellow-600/30 border border-amber-400/50 flex items-center justify-center text-2xl shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                        🏆
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-black font-display text-white">
                          October Season Trophy
                        </div>
                        <div className="text-[10px] text-amber-300 font-mono mt-0.5">
                          28 / 31 Puzzles Completed (90%)
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { sound.click(); navigateTo('daily'); }}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs shadow-[0_0_10px_rgba(0,229,255,0.4)] active:scale-95 transition-all cursor-pointer"
                    >
                      PLAY ›
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Quick Play Action Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    sound.click();
                    navigateTo('game');
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 border border-cyan-300/60 text-white font-black font-display text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>⚡</span>
                  <span>ENTER PUZZLE BATTLE</span>
                  <span>›</span>
                </button>
              </div>

            </div>
          </div>
        );
      };

      // ========================================================
      // 12. ACHIEVEMENTS (Pixel Perfect to Screen 12)
      // ==========================================
      const renderAchievementsScreen = () => {
        const awardTabs = ['▦', '♜', '▤', '⚔'];
        const months = ['Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan', 'Dec', 'Nov'];
        return (
          <div className="flex-1 flex flex-col overflow-hidden bg-white text-[#16171b]">
            <header className="z-10 shrink-0 bg-white px-5 pt-5 pb-3">
              <div className="flex items-center justify-between">
                <button onClick={() => navigateTo('home')} aria-label="Back to main" className="grid h-11 w-11 place-items-center rounded-full bg-[#f1f1f2] text-3xl leading-none text-[#31569a]">‹</button>
                <h1 className="text-xl font-black">Awards</h1><span className="h-11 w-11" />
              </div>
              <div className="mt-4 grid grid-cols-4 rounded-full bg-[#f1f1f1] p-1">
                {awardTabs.map((tab, i) => <button key={tab} onClick={() => i === 1 ? navigateTo('leaderboard') : i === 3 ? navigateTo('battle') : null} className={`rounded-full py-1.5 text-xl ${i === 0 ? 'bg-[#2e64d6] text-white' : 'text-[#8c8c8c]'}`}>{tab}</button>)}
              </div>
            </header>
            <div className="flex-1 overflow-y-auto no-scrollbar px-5 pt-4 pb-6">
              <div className="grid grid-cols-3 gap-x-2 gap-y-4">
                {months.map((month, i) => <button key={month} onClick={() => setActiveDailyDay(i + 1)} className="flex flex-col items-center py-2 active:scale-95 transition-transform"><span className="grid h-[108px] place-items-center text-[70px] opacity-40 grayscale">🏆</span><span className="mt-1 text-sm">{month}</span></button>)}
              </div>
              <div className="my-5 flex items-center gap-3 bg-gradient-to-r from-white via-[#eef3ff] to-white py-4"><span className="h-px flex-1 bg-slate-300" /><span className="text-xl font-bold">2025</span><span className="h-px flex-1 bg-slate-300" /></div>
              <div className="grid grid-cols-3 gap-x-2">
                {['Dec', 'Nov'].map(month => <div key={month} className="flex flex-col items-center py-2"><span className="grid h-[108px] place-items-center text-[70px] opacity-40 grayscale">🏆</span><span className="mt-1 text-sm">{month}</span></div>)}
              </div>
            </div>
          </div>
        );
      };

      // ========================================================
      // ========================================================
      // 13. LEADERBOARD (Modern Sci-Fi Arcade Edition)
      // ========================================================
      const renderLeaderboardScreen = () => {
        const topPlayers = [
          { rank: 4, name: 'Top', flag: '🇭🇰', score: '2,250,680', title: 'Grandmaster IV' },
          { rank: 5, name: 'Guest-Y9PMW', flag: '🇺🇸', score: '2,187,730', title: 'Cyber Ace I' },
          { rank: 6, name: 'Guest-N45T5', flag: '🇿🇦', score: '2,128,024', title: 'Quantum Elite II' },
          { rank: 7, name: 'So So', flag: '🇭🇰', score: '2,097,730', title: 'Neural Legend III' },
          { rank: 8, name: 'Guest-FCNUD', flag: '🇺🇸', score: '2,053,538', title: 'Matrix Master' },
        ];
        const podium = [
          { rank: 2, name: 'Guest-7MUET', flag: '🇱🇦', score: '2,385,400', medal: '🥈', avatar: '/assets/awards/award_lvl_23.webp' },
          { rank: 1, name: 'RW', flag: '🇬🇧', score: '2,490,680', medal: '🥇', avatar: '/assets/awards/award_lvl_25.webp' },
          { rank: 3, name: 'Guest-JFTL4', flag: '🇩🇪', score: '2,290,150', medal: '🥉', avatar: '/assets/awards/award_lvl_24.webp' },
        ];

        return (
          <div className="flex-1 scifi-game-bg flex flex-col overflow-hidden text-white relative select-none">
            {/* Mathematical Coordinate Blueprint Overlay & Luminous Glass Underlay */}
            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 scifi-ambient-cyan rounded-full pointer-events-none" />
            <div className="absolute top-1/3 -right-20 w-80 h-80 scifi-ambient-blue rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 left-0 w-80 h-80 scifi-ambient-purple rounded-full pointer-events-none" />

            {/* Sticky Modern Frosted Glass Header */}
            <header className="sticky top-0 z-20 scifi-header-bg border-b border-white/15 px-4 py-3 shrink-0 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { sound.click(); navigateTo('home'); }} 
                  aria-label="Back to home" 
                  className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#1b4394]/80 to-[#12306d]/80 border border-white/20 text-cyan-200 flex items-center justify-center text-xl font-bold shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ‹
                </button>
                <div />
                <button 
                  onClick={() => { sound.click(); navigateTo('help'); }} 
                  aria-label="Leaderboard information" 
                  className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#1b4394]/80 to-[#12306d]/80 border border-white/20 text-cyan-200 flex items-center justify-center text-base font-bold shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ⓘ
                </button>
              </div>
            </header>

            {/* Scrollable Arena Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-2 space-y-4 relative z-10">

              {/* Champions Arena Podium Stage (Glassmorphic) */}
              <div className="relative rounded-3xl p-3.5 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-400/12 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 flex items-end justify-center gap-2 pt-5 pb-1">
                  {/* Rank 2 (Silver) */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="relative mb-2 flex flex-col items-center">
                      <span className="text-xl -mb-1 filter drop-shadow">🥈</span>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200/90 via-sky-300/80 to-slate-400/90 border-2 border-white/90 p-0.5 shadow-[0_0_16px_rgba(56,189,248,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-md flex items-center justify-center text-xl relative">
                        {podium[0].avatar.startsWith('/') ? (
                          <img src={podium[0].avatar} alt="" className="w-9 h-9 object-contain drop-shadow-md" />
                        ) : (
                          <span>{podium[0].avatar}</span>
                        )}
                        <span className="absolute -bottom-1 -right-1 text-xs">{podium[0].flag}</span>
                      </div>
                      <span className="text-[11px] font-black text-white truncate max-w-[80px] mt-1.5 block drop-shadow-sm">
                        {podium[0].name}
                      </span>
                      <span className="text-[9px] font-mono text-cyan-200 font-bold bg-white/[0.08] px-1.5 py-0.2 rounded-md border border-white/10 mt-0.5">
                        {podium[0].score}
                      </span>
                    </div>
                    {/* Pillar */}
                    <div className="w-full h-24 rounded-t-2xl bg-gradient-to-b from-white/[0.16] via-[#163674]/60 to-black/40 border-t-2 border-x-2 border-cyan-300/70 backdrop-blur-md flex flex-col items-center justify-between py-2 shadow-[0_0_15px_rgba(56,189,248,0.2),inset_0_1px_0_rgba(255,255,255,0.25)]">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-b from-slate-100 to-slate-300 border border-white text-slate-900 font-black text-xs flex items-center justify-center shadow-md">
                        2
                      </div>
                      <span className="text-[9px] font-mono font-black text-cyan-200 tracking-wider">SILVER</span>
                    </div>
                  </div>

                  {/* Rank 1 (Gold Champion - Center Elevated) */}
                  <div className="flex-1 flex flex-col items-center -translate-y-2">
                    <div className="relative mb-2 flex flex-col items-center">
                      <span className="text-2xl -mb-1 animate-bounce filter drop-shadow-[0_0_10px_rgba(251,191,36,0.9)]">👑</span>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-500 border-2 border-yellow-100 p-0.5 shadow-[0_0_24px_rgba(251,191,36,0.7),inset_0_1.5px_0_rgba(255,255,255,0.5)] backdrop-blur-md flex items-center justify-center text-2xl relative">
                        {podium[1].avatar.startsWith('/') ? (
                          <img src={podium[1].avatar} alt="" className="w-11 h-11 object-contain drop-shadow-md" />
                        ) : (
                          <span>{podium[1].avatar}</span>
                        )}
                        <span className="absolute -bottom-1 -right-1 text-sm">{podium[1].flag}</span>
                      </div>
                      <span className="text-xs font-black text-amber-200 truncate max-w-[90px] mt-1.5 block drop-shadow-sm">
                        {podium[1].name}
                      </span>
                      <span className="text-[10px] font-mono text-yellow-300 font-black bg-amber-400/20 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-300/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] mt-0.5">
                        {podium[1].score}
                      </span>
                    </div>
                    {/* Pillar */}
                    <div className="w-full h-32 rounded-t-2xl bg-gradient-to-b from-amber-400/25 via-[#35250c]/60 to-black/50 border-t-2 border-x-2 border-amber-300/90 backdrop-blur-md flex flex-col items-center justify-between py-2.5 shadow-[0_0_25px_rgba(251,191,36,0.3),inset_0_1px_0_rgba(255,255,255,0.3)]">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-500 border-2 border-white text-amber-950 font-black text-sm flex items-center justify-center shadow-lg">
                        1
                      </div>
                      <span className="text-[10px] font-mono font-black text-amber-300 tracking-widest uppercase">CHAMPION</span>
                    </div>
                  </div>

                  {/* Rank 3 (Bronze) */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="relative mb-2 flex flex-col items-center">
                      <span className="text-xl -mb-1 filter drop-shadow">🥉</span>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600/90 via-orange-500/80 to-amber-700/90 border-2 border-orange-200/90 p-0.5 shadow-[0_0_16px_rgba(249,115,22,0.45),inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-md flex items-center justify-center text-xl relative">
                        {podium[2].avatar.startsWith('/') ? (
                          <img src={podium[2].avatar} alt="" className="w-9 h-9 object-contain drop-shadow-md" />
                        ) : (
                          <span>{podium[2].avatar}</span>
                        )}
                        <span className="absolute -bottom-1 -right-1 text-xs">{podium[2].flag}</span>
                      </div>
                      <span className="text-[11px] font-black text-white truncate max-w-[80px] mt-1.5 block drop-shadow-sm">
                        {podium[2].name}
                      </span>
                      <span className="text-[9px] font-mono text-orange-200 font-bold bg-white/[0.08] px-1.5 py-0.2 rounded-md border border-white/10 mt-0.5">
                        {podium[2].score}
                      </span>
                    </div>
                    {/* Pillar */}
                    <div className="w-full h-20 rounded-t-2xl bg-gradient-to-b from-white/[0.14] via-[#2c180e]/60 to-black/40 border-t-2 border-x-2 border-amber-500/70 backdrop-blur-md flex flex-col items-center justify-between py-2 shadow-[0_0_15px_rgba(249,115,22,0.2),inset_0_1px_0_rgba(255,255,255,0.2)]">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-b from-orange-300 to-amber-600 border border-white text-slate-900 font-black text-xs flex items-center justify-center shadow-md">
                        3
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard Table (Ranks 4 - 8) */}
              <div className="space-y-2 pb-2">
                <div className="flex items-center justify-between px-2 text-[10px] font-mono font-black uppercase tracking-wider text-cyan-300/70 pb-0.5">
                  <span>Rank & Player</span>
                  <span>Total Score</span>
                </div>

                {topPlayers.map((player) => (
                  <div 
                    key={player.rank}
                    className="relative group bg-gradient-to-r from-white/[0.10] via-[#0d245c]/55 to-[#071536]/70 border border-white/20 hover:border-cyan-300/60 rounded-2xl p-3 flex items-center justify-between shadow-[0_8px_24px_rgba(2,10,32,0.35),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank Number Keycap */}
                      <div className="w-9 h-9 rounded-xl bg-white/[0.10] border border-white/25 text-cyan-200 font-mono font-black text-sm flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md shrink-0">
                        #{player.rank}
                      </div>

                      {/* Flag & Name */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{player.flag}</span>
                          <span className="font-black text-sm text-white truncate font-display">
                            {player.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-cyan-300/80 block mt-0.5">
                          {player.title}
                        </span>
                      </div>
                    </div>

                    {/* Score Tag */}
                    <div className="shrink-0 flex items-center gap-1.5 bg-black/35 border border-white/15 px-3 py-1.5 rounded-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md">
                      <span className="text-xs">⭐</span>
                      <span className="font-mono font-black text-xs text-cyan-200">
                        {player.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sticky Player Rank Dock (You - Glassmorphic) */}
              <div className="sticky bottom-0 z-20 -mx-3 px-3 py-2.5 bg-[#051029]/80 border-t border-white/20 backdrop-blur-2xl shadow-[0_-12px_32px_rgba(0,0,0,0.7)]">
                <div className="bg-gradient-to-r from-cyan-500/85 via-blue-600/85 to-indigo-600/85 border-2 border-white/40 rounded-2xl p-3 flex items-center justify-between shadow-[0_8px_28px_rgba(0,229,255,0.5),inset_0_1.5px_0_rgba(255,255,255,0.45)] backdrop-blur-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white/95 text-blue-950 font-mono font-black text-sm flex items-center justify-center shadow-md shrink-0">
                      #{playerRank}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🇺🇸</span>
                        <span className="font-black text-sm text-white truncate font-display">
                          Player (YOU)
                        </span>
                        <span className="text-[9px] font-black uppercase bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-full font-mono shadow-xs">
                          ACTIVE
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-100/90 block mt-0.5">
                         Level {activePlayerLevel} • Tier Master
                       </span>
                     </div>
                   </div>

                   <div className="shrink-0 flex items-center gap-1.5 bg-black/30 border border-white/30 px-3 py-1.5 rounded-xl backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]">
                     <span className="text-xs">⭐</span>
                     <span className="font-mono font-black text-xs text-white">
                       {playerScore.toLocaleString()}
                     </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      };

      // ========================================================
      // 14. PUZZLE HISTORY & SAVED ARCHIVES (Modern Sci-Fi Glassmorphism Edition)
      // ========================================================
      const renderHistoryScreen = () => {
        // Filter based on active tab
        const isSavedTab = historyTab === 'saved';
        const displayList = isSavedTab
          ? puzzleRecords.filter(item => savedPuzzleIds.includes(item.id))
          : puzzleRecords;

        const totalSolved = puzzleRecords.filter(r => r.solved).length;
        const savedCount = savedPuzzleIds.length;
        const accuracyRate = puzzleRecords.length > 0 
          ? Math.round((totalSolved / puzzleRecords.length) * 100) 
          : 100;

        const handleCopyEquation = (eq) => {
          sound.click();
          if (navigator?.clipboard?.writeText) {
            navigator.clipboard.writeText(eq).catch(() => {});
          }
          setRewardToast(`📋 Formula copied: ${eq}`);
        };

        return (
          <div className="flex-1 scifi-game-bg flex flex-col overflow-hidden text-white relative select-none">
            {/* Mathematical Coordinate Blueprint Overlay & Luminous Underlays */}
            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 scifi-ambient-cyan rounded-full pointer-events-none" />
            <div className="absolute top-1/3 -right-20 w-80 h-80 scifi-ambient-blue rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 left-0 w-80 h-80 scifi-ambient-purple rounded-full pointer-events-none" />

            {/* Sticky Modern Frosted Glass Header */}
            <header className="sticky top-0 z-20 scifi-header-bg border-b border-white/15 px-4 py-3 shrink-0 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { sound.click(); navigateTo('home'); }} 
                  aria-label="Back to home" 
                  className="w-10 h-10 rounded-2xl bg-white/[0.12] border border-white/20 text-cyan-200 flex items-center justify-center text-xl font-bold shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ‹
                </button>

                <div className="flex flex-col items-center">
                  <h1 className="text-base sm:text-lg font-black font-display tracking-wider bg-gradient-to-r from-cyan-200 via-sky-100 to-white bg-clip-text text-transparent uppercase flex items-center gap-1.5">
                    <span className="drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">📜</span>
                    <span>Puzzle Archives</span>
                  </h1>
                  <span className="text-[10px] font-mono text-cyan-300/80 tracking-widest uppercase">
                    {isSavedTab ? 'Saved Quantum Formulas' : 'Neural Mission Logs'}
                  </span>
                </div>

                <button 
                  onClick={() => {
                    sound.click();
                    if (!isSavedTab) {
                      if (puzzleRecords.length > 0) {
                        handleClearHistory();
                      } else {
                        setRewardToast('No history records to clear');
                      }
                    } else {
                      setRewardToast(`🔖 Total Saved Formulas: ${savedCount}`);
                    }
                  }} 
                  aria-label={!isSavedTab ? "Clear History" : "Saved Count"} 
                  title={!isSavedTab ? "Clear History Logs" : "Saved Formulas Info"}
                  className="w-10 h-10 rounded-2xl bg-white/[0.12] border border-white/20 text-cyan-200 flex items-center justify-center text-xs font-bold shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  {!isSavedTab ? (
                    <svg className="w-4 h-4 text-rose-300/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-amber-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  )}
                </button>
              </div>
            </header>

            {/* Scrollable Arena Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-24 space-y-3.5 relative z-10">

              {/* Glassmorphic Metrics Telemetry Card */}
              <div className="relative rounded-2xl p-3 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_12px_30px_rgba(2,10,32,0.45),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />
                <div className="relative z-10 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/[0.06] border border-white/10 rounded-xl p-2 backdrop-blur-md shadow-inner">
                    <span className="text-[9px] uppercase font-bold text-cyan-300 block tracking-wider">Total Solved</span>
                    <span className="text-base font-black font-mono text-white block mt-0.5">
                      {totalSolved}
                    </span>
                  </div>
                  <div className="bg-white/[0.06] border border-white/10 rounded-xl p-2 backdrop-blur-md shadow-inner">
                    <span className="text-[9px] uppercase font-bold text-amber-300 block tracking-wider">Saved</span>
                    <span className="text-base font-black font-mono text-amber-300 block mt-0.5">
                      {savedCount}
                    </span>
                  </div>
                  <div className="bg-white/[0.06] border border-white/10 rounded-xl p-2 backdrop-blur-md shadow-inner">
                    <span className="text-[9px] uppercase font-bold text-emerald-300 block tracking-wider">Accuracy</span>
                    <span className="text-base font-black font-mono text-emerald-300 block mt-0.5">
                      {accuracyRate}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Segmented Dual Glass Tab Switcher */}
              <div className="p-1.5 rounded-2xl bg-white/[0.08] border border-white/15 backdrop-blur-xl flex items-center gap-1.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)]">
                <button
                  onClick={() => { sound.click(); setHistoryTab('history'); }}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    !isSavedTab
                      ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-[0_4px_16px_rgba(6,182,212,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                      : 'text-cyan-200/70 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>History</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    !isSavedTab ? 'bg-white/20 text-white' : 'bg-white/10 text-cyan-300'
                  }`}>
                    {puzzleRecords.length}
                  </span>
                </button>

                <button
                  onClick={() => { sound.click(); setHistoryTab('saved'); }}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSavedTab
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-[0_4px_16px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]'
                      : 'text-cyan-200/70 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <svg className="w-4 h-4" fill={isSavedTab ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span>Saved</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isSavedTab ? 'bg-white/20 text-white' : 'bg-white/10 text-amber-300'
                  }`}>
                    {savedCount}
                  </span>
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {displayList.map((item) => {
                  const isSaved = savedPuzzleIds.includes(item.id);
                  return (
                    <div 
                      key={item.id} 
                      onClick={() => handleCopyEquation(item.eq)}
                      className={`relative rounded-2xl p-3.5 bg-gradient-to-b from-white/[0.12] via-[#0d2258]/65 to-[#06143c]/80 border transition-all backdrop-blur-xl group overflow-hidden shadow-[0_8px_24px_rgba(2,10,32,0.4),inset_0_1px_0_rgba(255,255,255,0.18)] cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                        isSaved 
                          ? 'border-amber-400/45 hover:border-amber-400/75 shadow-[0_8px_24px_rgba(245,158,11,0.12)]' 
                          : 'border-white/15 hover:border-cyan-400/40'
                      }`}
                    >
                      <div className="absolute inset-0 math-blueprint-grid opacity-10 pointer-events-none" />
                      
                      {/* Luminous Ambient Glow for Saved Items */}
                      {isSaved && (
                        <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-400/15 rounded-full blur-xl pointer-events-none" />
                      )}

                      <div className="relative z-10 flex items-center justify-between gap-3">
                        {/* Left: 3D Holographic Math Tile Icon */}
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-lg backdrop-blur-md ${
                            isSaved
                              ? 'bg-gradient-to-br from-amber-500/30 to-amber-700/50 border-amber-400/60 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.35)]'
                              : 'bg-gradient-to-br from-cyan-500/25 to-blue-600/40 border-cyan-400/40 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                          }`}>
                            <span className="text-base select-none">🔢</span>
                          </div>

                          {/* Equation and Metadata */}
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-black font-mono tracking-wide text-white drop-shadow-[0_0_8px_rgba(56,189,248,0.45)] truncate">
                              {item.eq}
                            </div>
                            <div className="flex items-center flex-wrap gap-1.5 mt-1">
                              <span className="text-[10px] text-slate-300 font-medium flex items-center gap-1">
                                <svg className="w-3 h-3 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {item.time}
                              </span>
                              <span className="text-[9px] px-2 py-0.5 rounded-full font-mono font-bold bg-cyan-950/80 border border-cyan-400/30 text-cyan-300">
                                Level {item.level}
                              </span>
                              {item.mode && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md font-sans font-bold bg-white/[0.08] text-slate-300 border border-white/10 uppercase">
                                  {item.mode}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.inProgress && (
                            <div 
                              title="In Progress"
                              className="px-2 py-1 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold font-mono flex items-center gap-1"
                            >
                              <span>⚡</span>
                            </div>
                          )}

                          {/* Interactive Bookmark / Save Toggle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSavePuzzle(item.id);
                            }}
                            aria-label={isSaved ? "Remove from saved" : "Save formula"}
                            title={isSaved ? "Saved in Archives (Tap to Unpin)" : "Pin to Saved Archives"}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer backdrop-blur-md ${
                              isSaved
                                ? 'bg-gradient-to-b from-amber-500/30 to-amber-700/50 border border-amber-400/60 text-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.45)] hover:scale-110 active:scale-95'
                                : 'bg-white/[0.08] border border-white/20 text-slate-400 hover:text-amber-300 hover:border-amber-400/40 hover:bg-white/[0.14] hover:scale-105 active:scale-95'
                            }`}
                          >
                            <svg 
                              className="w-4 h-4 transition-transform group-hover:scale-110" 
                              fill={isSaved ? "currentColor" : "none"} 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Empty State when no items in tab */}
              {displayList.length === 0 && (
                <div className="py-12 px-6 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 backdrop-blur-xl text-center shadow-[0_12px_32px_rgba(2,10,32,0.4)] flex flex-col items-center">
                  <div className={`w-16 h-16 rounded-3xl border flex items-center justify-center text-3xl mb-4 shadow-xl ${
                    isSavedTab
                      ? 'bg-gradient-to-b from-amber-500/20 to-orange-600/20 border-amber-400/30 text-amber-300 shadow-[0_0_24px_rgba(245,158,11,0.25)]'
                      : 'bg-gradient-to-b from-cyan-500/20 to-blue-600/20 border-cyan-400/30 text-cyan-300 shadow-[0_0_24px_rgba(6,182,212,0.25)]'
                  }`}>
                    {isSavedTab ? '🔖' : '📜'}
                  </div>
                  <h3 className="text-base font-extrabold text-white font-display mb-1">
                    {isSavedTab ? 'No Saved Formulas Yet' : 'No History Logs Recorded'}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-xs leading-relaxed mb-6">
                    {isSavedTab 
                      ? 'Tap the bookmark ribbon on any equation from the History tab to pin it here for rapid study.'
                      : 'Complete math puzzles in Campaign or Daily Challenge to record equations in your neural archives.'}
                  </p>
                  {isSavedTab ? (
                    <button
                      onClick={() => { sound.click(); setHistoryTab('history'); }}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Browse History Archives
                    </button>
                  ) : (
                    <button
                      onClick={() => { sound.click(); navigateTo('game'); }}
                      className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-[0_4px_16px_rgba(6,182,212,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Launch A Puzzle Mission
                    </button>
                  )}
                </div>
              )}

            </div>
          </div>
        );
      };

      // ========================================================
      // 15. PROFILE SCREEN (Modern Sci-Fi Cyber-Arcade Edition)
      // ========================================================
      const renderProfileScreen = () => {
        const winRate = Math.min(98, Math.max(65, 70 + Math.round((activePlayerLevel * 1.8))));
        const gamesStarted = Math.max(8, activePlayerLevel * 4 + 3);
        const gamesWon = Math.round(gamesStarted * (winRate / 100));
        const totalScore = (coins * 12 + activePlayerLevel * 500).toLocaleString();

        const handleSaveName = (e) => {
          if (e) e.preventDefault();
          const trimmed = nameInput.trim();
          if (trimmed) {
            setPlayerName(trimmed);
            try { GameStorage.setItem('newromath_player_name', trimmed); } catch (err) {}
          }
          setIsEditingName(false);
        };

        const ProfileSkeuomorphicCircle = ({ 
          icon: IconContent, 
          variant = 'cyan', 
          size = 'sm', 
          className = ''
        }) => {
          const config = {
            cyan: {
              rim: 'from-cyan-200 via-sky-400 to-blue-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(6,182,212,0.35),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#18458a_0%,#0d2857_50%,#041029_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-cyan-200 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]'
            },
            amber: {
              rim: 'from-amber-200 via-amber-400 to-amber-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(245,158,11,0.35),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#244585_0%,#122752_50%,#061129_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]'
            },
            emerald: {
              rim: 'from-emerald-200 via-emerald-400 to-teal-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#047857_0%,#065f46_50%,#022c22_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-emerald-200 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]'
            },
            sky: {
              rim: 'from-sky-200 via-sky-400 to-blue-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(14,165,233,0.35),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#0369a1_0%,#075985_50%,#082f49_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-sky-200 drop-shadow-[0_0_6px_rgba(14,165,233,0.8)]'
            },
            orange: {
              rim: 'from-amber-200 via-orange-400 to-red-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(249,115,22,0.35),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#c2410c_0%,#9a3412_50%,#431407_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-orange-200 drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]'
            },
            purple: {
              rim: 'from-purple-200 via-purple-400 to-indigo-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(168,85,247,0.35),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#3b186b_0%,#200b3d_50%,#0e041a_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-purple-200 drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]'
            }
          };

          const s = config[variant] || config.cyan;

          const sizeClasses = {
            sm: 'w-7 h-7 p-[1px]',
            md: 'w-7.5 h-7.5 p-[1.5px]',
            lg: 'w-17 h-17 p-[2px]'
          }[size] || 'w-7 h-7 p-[1px]';

          return (
            <div className={`relative ${sizeClasses} rounded-full bg-gradient-to-b ${s.rim} shrink-0 flex items-center justify-center ${className}`}>
              <div className="w-full h-full rounded-full p-[1px] bg-gradient-to-b from-black/80 via-black/40 to-black/80 flex items-center justify-center shadow-inner">
                <div className={`w-full h-full rounded-full ${s.disc} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-x-1 top-0.5 h-[42%] bg-gradient-to-b from-white/45 via-white/10 to-transparent rounded-t-full pointer-events-none" />
                  <div className="absolute bottom-0.5 w-[60%] h-1 rounded-full bg-black/60 blur-[1px] pointer-events-none" />
                  <div className={`relative z-10 flex items-center justify-center ${s.glow}`}>
                    {typeof IconContent === 'string' ? (
                      <img src={IconContent} alt="" className="w-full h-full object-contain" />
                    ) : (
                      IconContent
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        };

        return (
          <div className="flex-1 scifi-game-bg flex flex-col overflow-hidden text-white relative select-none">
            {/* Mathematical Coordinate Blueprint Overlay & Luminous Underlay */}
            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 scifi-ambient-cyan rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 right-0 w-80 h-80 scifi-ambient-blue rounded-full pointer-events-none" />

            {/* Sticky Modern Frosted Glass Header */}
            <header className="sticky top-0 z-20 scifi-header-bg border-b border-white/15 px-4 py-3 shrink-0 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { sound.click(); navigateTo('home'); }} 
                  aria-label="Back to home" 
                  className="w-10 h-10 rounded-2xl bg-white/[0.12] border border-white/20 text-cyan-200 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 text-cyan-200" />
                </button>
                <h1 className="text-base sm:text-lg font-black font-display tracking-wider bg-gradient-to-r from-cyan-200 via-sky-100 to-white bg-clip-text text-transparent uppercase">
                  Player Profile
                </h1>
                <button 
                  onClick={() => { sound.click(); navigateTo('settings'); }} 
                  aria-label="Settings" 
                  className="w-10 h-10 rounded-2xl bg-white/[0.12] border border-white/20 text-cyan-200 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <SettingsIcon className="w-4 h-4 text-cyan-200" />
                </button>
              </div>
            </header>

            {/* Scrollable Profile Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-24 space-y-4 relative z-10">

              {/* Glassmorphic Player Identity Card */}
              <div className="relative rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl overflow-hidden">
                <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />

                {/* Avatar & Player Details */}
                <div className="relative z-10 flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    {/* Skeuomorphic Avatar Pedestal Circle */}
                    <div className="relative w-17 h-17 rounded-full p-[2px] bg-gradient-to-b from-cyan-200 via-sky-400 to-blue-700 shadow-[0_6px_16px_rgba(0,0,0,0.6),0_0_16px_rgba(6,182,212,0.4),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center">
                      <div className="w-full h-full rounded-full p-[1.5px] bg-gradient-to-b from-blue-950 via-[#031533] to-cyan-950 flex items-center justify-center shadow-inner">
                        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_30%,#18458a_0%,#0d2857_50%,#041029_100%)] shadow-[inset_0_3px_6px_rgba(0,0,0,0.8),inset_0_-1.5px_2px_rgba(255,255,255,0.25)] flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-x-2 top-0.5 h-[42%] bg-gradient-to-b from-white/50 via-white/10 to-transparent rounded-t-full pointer-events-none" />
                          <div className="absolute bottom-1 w-8 h-1.5 rounded-full bg-black/60 blur-[1px] pointer-events-none" />
                          <img 
                            src={equippedAvatar || "/assets/icon_robot_3d.webp"} 
                            alt="Player Avatar" 
                            className="w-11 h-11 object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] relative z-10 transition-transform duration-300 hover:scale-110" 
                          />
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 font-black text-[9px] px-1.5 py-0.5 rounded-full border border-white/80 shadow-[0_2px_6px_rgba(0,0,0,0.5)] leading-none z-20">
                      LV.{activePlayerLevel}
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black font-display text-white tracking-wide truncate">
                        {playerName}
                      </h2>
                      {/* Skeuomorphic Edit Profile Button */}
                      <button 
                        onClick={handleOpenProfileModal}
                        aria-label="Edit Profile"
                        title="Edit Profile"
                        className="relative w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-b from-cyan-200 via-sky-400 to-blue-700 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_0_8px_rgba(6,182,212,0.4),inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center active:scale-95 transition-all cursor-pointer hover:scale-105 shrink-0"
                      >
                        <div className="w-full h-full rounded-full p-[1px] bg-gradient-to-b from-blue-950 to-cyan-950 flex items-center justify-center shadow-inner">
                          <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_30%,#18458a_0%,#0d2857_50%,#041029_100%)] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-x-0.5 top-0.5 h-[40%] bg-gradient-to-b from-white/45 to-transparent rounded-t-full pointer-events-none" />
                            <Pencil className="w-3 h-3 text-cyan-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] relative z-10" />
                          </div>
                        </div>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[10px] bg-cyan-400/15 border border-cyan-300/30 text-cyan-200 px-2 py-0.5 rounded-lg font-bold uppercase tracking-wider backdrop-blur-sm">
                        {activePlayerLevel >= 25 ? 'GRANDMASTER' : activePlayerLevel >= 15 ? 'MASTER CADET' : activePlayerLevel >= 5 ? 'CHALLENGER' : 'ROOKIE CADET'}
                      </span>
                      {/* Country Flag Badge */}
                      <span className="text-[9.5px] bg-blue-500/20 border border-cyan-400/40 text-cyan-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 backdrop-blur-sm shadow-xs">
                        <span>{PLAYER_COUNTRIES.find(c => c.name === playerCountry)?.flag || '🌍'}</span>
                        <span className="truncate max-w-[100px]">{playerCountry}</span>
                      </span>
                      {(() => {
                        const activeAward = LEVEL_AWARDS.find(a => a.icon === equippedAvatar);
                        return activeAward ? (
                          <span className="text-[9.5px] bg-amber-400/20 border border-amber-300/40 text-amber-200 px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 backdrop-blur-sm">
                            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                            <span className="truncate max-w-[120px]">{activeAward.title}</span>
                          </span>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </div>

                {/* Level Progress */}
                <div className="relative z-10 mt-3.5 bg-white/[0.06] border border-white/10 rounded-2xl p-2.5 backdrop-blur-md">
                  <div className="flex items-center justify-between text-[10.5px] font-bold mb-1.5">
                    <span className="text-cyan-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
                      <span>Level {activePlayerLevel} Progress</span>
                    </span>
                    <span className="text-sky-200 font-mono">
                      {playerXp} / {xpNeeded} XP
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-black/40 border border-white/15 overflow-hidden p-0.5 shadow-inner">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(0,229,255,0.7)] transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, Math.round((playerXp / xpNeeded) * 100)))}%` }}
                    />
                  </div>
                </div>

                {/* Treasury & Metric Pillars with Skeuomorphic Pedestals */}
                <div className="relative z-10 grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-white/10">
                  <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-xs">
                    <ProfileSkeuomorphicCircle 
                      icon={<img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coins" className="w-4.5 h-4.5 object-contain" />} 
                      variant="amber" 
                      size="sm" 
                      className="mb-1"
                    />
                    <span className="text-xs font-black text-amber-300 font-display leading-none">
                      {coins.toLocaleString()}
                    </span>
                    <span className="text-[8px] text-amber-200/70 font-semibold uppercase tracking-tight mt-0.5">
                      Coins
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-xs">
                    <ProfileSkeuomorphicCircle 
                      icon={<img src="/assets/icon_gem_3d_clean.webp" alt="Diamonds" className="w-4.5 h-4.5 object-contain" />} 
                      variant="cyan" 
                      size="sm" 
                      className="mb-1"
                    />
                    <span className="text-xs font-black text-cyan-300 font-display leading-none">
                      {gems}
                    </span>
                    <span className="text-[8px] text-cyan-200/70 font-semibold uppercase tracking-tight mt-0.5">
                      Diamonds
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-xs">
                    <ProfileSkeuomorphicCircle 
                      icon={<Flame className="w-3.5 h-3.5 text-orange-200 shrink-0" />} 
                      variant="orange" 
                      size="sm" 
                      className="mb-1"
                    />
                    <span className="text-xs font-black text-orange-300 font-display leading-none">
                      {streakDays}d
                    </span>
                    <span className="text-[8px] text-orange-200/70 font-semibold uppercase tracking-tight mt-0.5">
                      Streak
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-2 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-xs">
                    <ProfileSkeuomorphicCircle 
                      icon={<img src="/assets/icon_trophy_3d.webp" alt="Level" className="w-4.5 h-4.5 object-contain" />} 
                      variant="purple" 
                      size="sm" 
                      className="mb-1"
                    />
                    <span className="text-xs font-black text-purple-300 font-display leading-none">
                      Lv.{activePlayerLevel}
                    </span>
                    <span className="text-[8px] text-purple-200/70 font-semibold uppercase tracking-tight mt-0.5">
                      Level
                    </span>
                  </div>
                </div>
              </div>

              {/* Glassmorphic Gameplay Statistics Card with Skeuomorphic Badges */}
              <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl relative overflow-hidden">
                <div className="mb-3 px-1">
                  <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                    Gameplay Statistics
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white/[0.07] border border-white/15 rounded-2xl p-2.5 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-300 uppercase font-bold block mb-1">Puzzles Solved</span>
                      <span className="text-base font-black text-emerald-300 font-display block leading-none">{gamesWon}</span>
                    </div>
                    <ProfileSkeuomorphicCircle 
                      icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />} 
                      variant="emerald" 
                      size="sm" 
                    />
                  </div>

                  <div className="bg-white/[0.07] border border-white/15 rounded-2xl p-2.5 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-300 uppercase font-bold block mb-1">Puzzles Played</span>
                      <span className="text-base font-black text-white font-display block leading-none">{gamesStarted}</span>
                    </div>
                    <ProfileSkeuomorphicCircle 
                      icon={<Gamepad2 className="w-3.5 h-3.5 text-sky-200" />} 
                      variant="sky" 
                      size="sm" 
                    />
                  </div>

                  <div className="bg-white/[0.07] border border-white/15 rounded-2xl p-2.5 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-300 uppercase font-bold block mb-1">Win Accuracy</span>
                      <span className="text-base font-black text-cyan-300 font-display block leading-none">{winRate}%</span>
                    </div>
                    <ProfileSkeuomorphicCircle 
                      icon={<Target className="w-3.5 h-3.5 text-cyan-200" />} 
                      variant="cyan" 
                      size="sm" 
                    />
                  </div>

                  <div className="bg-white/[0.07] border border-white/15 rounded-2xl p-2.5 backdrop-blur-md flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-300 uppercase font-bold block mb-1">Total Score</span>
                      <span className="text-base font-black text-amber-300 font-display block leading-none">{totalScore}</span>
                    </div>
                    <ProfileSkeuomorphicCircle 
                      icon={<Trophy className="w-3.5 h-3.5 text-amber-200" />} 
                      variant="amber" 
                      size="sm" 
                    />
                  </div>
                </div>
              </div>

              {/* Glassmorphic Level Awards & 3D Trophies Gallery Card */}
              <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl relative overflow-hidden">
                <div className="absolute inset-0 math-blueprint-grid opacity-10 pointer-events-none" />

                {/* Header: Title */}
                <div className="relative z-10 mb-3 px-1">
                  <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                    Your Level Awards
                  </h3>
                </div>

                {/* Filter Tabs: All, Unlocked, Locked */}
                <div className="relative z-10 flex items-center gap-1.5 p-1 bg-black/30 border border-white/10 rounded-2xl mb-3.5 backdrop-blur-md">
                  <button
                    onClick={() => { sound.click(); setAwardFilter('all'); }}
                    className={`flex-1 py-1 rounded-xl text-[10.5px] font-bold transition-all cursor-pointer ${
                      awardFilter === 'all'
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    All (25)
                  </button>
                  <button
                    onClick={() => { sound.click(); setAwardFilter('unlocked'); }}
                    className={`flex-1 py-1 rounded-xl text-[10.5px] font-bold transition-all cursor-pointer ${
                      awardFilter === 'unlocked'
                        ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Unlocked ({completedLevelsCount})
                  </button>
                  <button
                    onClick={() => { sound.click(); setAwardFilter('locked'); }}
                    className={`flex-1 py-1 rounded-xl text-[10.5px] font-bold transition-all cursor-pointer ${
                      awardFilter === 'locked'
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Locked ({25 - completedLevelsCount})
                  </button>
                </div>

                {/* Grid of Award Badges */}
                <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-2.5">
                  {LEVEL_AWARDS.filter(award => {
                    const isUnlocked = award.level < unlockedLevelMax;
                    if (awardFilter === 'unlocked') return isUnlocked;
                    if (awardFilter === 'locked') return !isUnlocked;
                    return true;
                  }).map(award => {
                    const isUnlocked = award.level < unlockedLevelMax;
                    const isEquipped = (equippedAvatar === award.icon);

                    return (
                      <div
                        key={award.level}
                        onClick={() => {
                          if (isUnlocked) {
                            sound.pop();
                            setEquippedAvatar(award.icon);
                            try { GameStorage.setItem('newromath_player_avatar', award.icon); } catch (e) {}
                            setRewardToast(`🎉 Equipped Level ${award.level} "${award.title}" avatar!`);
                          } else {
                            sound.click();
                            setRewardToast(`🔒 Locked: Solve Level ${award.level} to unlock "${award.title}"!`);
                          }
                        }}
                        className={`relative group rounded-2xl p-2 flex flex-col items-center text-center transition-all cursor-pointer active:scale-95 border ${
                          isEquipped
                            ? 'bg-gradient-to-b from-cyan-950/70 via-[#0d2a63]/70 to-[#07163c]/80 border-cyan-300 shadow-[0_0_16px_rgba(0,229,255,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] ring-2 ring-cyan-400/60'
                            : isUnlocked
                              ? 'bg-gradient-to-b from-white/[0.12] to-white/[0.04] border-white/20 hover:bg-white/[0.18] hover:border-cyan-300/60 shadow-[0_4px_12px_rgba(0,0,0,0.25)]'
                              : 'bg-black/40 border-white/10 opacity-75 hover:opacity-90'
                        }`}
                      >
                        {/* Level Header Pill */}
                        <div className="w-full flex items-center justify-between mb-1 px-0.5">
                          <span className={`text-[8.5px] font-black font-display tracking-tight px-1.5 py-0.2 rounded-md ${
                            isEquipped
                              ? 'bg-cyan-400 text-slate-950 shadow-xs'
                              : isUnlocked
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-800 text-slate-400'
                          }`}>
                            LV.{award.level}
                          </span>
                          {isEquipped ? (
                            <span className="text-[7px] font-black uppercase tracking-tight bg-cyan-400 text-slate-950 px-1 py-0.2 rounded font-display shadow-xs">
                              ACTIVE
                            </span>
                          ) : isUnlocked ? (
                            <span className="text-[7.5px] font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-400/40 px-1 py-0.2 rounded">
                              EQUIP
                            </span>
                          ) : (
                            <Lock className="w-3 h-3 text-amber-300/80" />
                          )}
                        </div>

                        {/* 3D Skeuomorphic Gaming Medallion */}
                        <div className={`relative w-12 h-12 my-1 rounded-full overflow-hidden flex items-center justify-center p-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1.5px_2px_rgba(255,255,255,0.25),inset_0_-2px_3px_rgba(0,0,0,0.45)] border ${
                          isEquipped 
                            ? 'border-cyan-300 ring-2 ring-cyan-400/60 bg-gradient-to-b from-[#18366d] to-[#0e2147]' 
                            : isUnlocked 
                              ? 'border-white/25 bg-gradient-to-b from-[#163366]/90 via-[#0f244d]/90 to-[#081533]/95 hover:border-cyan-300/60' 
                              : 'border-white/10 bg-black/60 opacity-60'
                        }`}>
                          {/* Skeuomorphic Glass Specular Sheen */}
                          <div className="absolute inset-x-0.5 top-0 h-[45%] bg-gradient-to-b from-white/35 via-white/5 to-transparent rounded-t-full pointer-events-none z-20" />

                          {isUnlocked ? (
                            <img
                              src={award.icon}
                              alt={award.title}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)] relative z-10 transition-transform duration-200 group-hover:scale-115"
                            />
                          ) : (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <img
                                src={award.icon}
                                alt={award.title}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-contain grayscale opacity-25 filter blur-[0.4px] brightness-50"
                              />
                              <div className="absolute inset-0 flex items-center justify-center z-30">
                                <div className="w-6 h-6 rounded-full bg-black/80 border border-white/30 flex items-center justify-center shadow-lg">
                                  <Lock className="w-3.5 h-3.5 text-amber-300" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Award Title */}
                        <span className={`text-[10px] font-black font-display tracking-tight leading-tight line-clamp-1 mt-1 w-full text-center ${
                          isEquipped ? 'text-cyan-200' : isUnlocked ? 'text-white' : 'text-slate-400'
                        }`}>
                          {award.title}
                        </span>

                        {/* Short Status */}
                        <span className="text-[8px] text-slate-400 line-clamp-1 mt-0.5 w-full text-center">
                          {isEquipped ? 'Equipped Avatar' : isUnlocked ? 'Tap to equip' : `Solve Lvl ${award.level}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* ======================================================== */}
            {/* SKEUOMORPHIC PROFILE EDIT BANNER / MODAL */}
            {/* ======================================================== */}
            {isProfileModalOpen && (
              <div 
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-4 overflow-y-auto"
                onClick={() => setIsProfileModalOpen(false)}
              >
                {/* Outer 3D Skeuomorphic Chassis Plate */}
                <div 
                  className="relative w-full max-w-sm rounded-[28px] p-[2.5px] bg-gradient-to-b from-cyan-200 via-sky-500 to-blue-900 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(6,182,212,0.4)] overflow-hidden my-auto select-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Intermediate Beveled Ridge */}
                  <div className="w-full h-full p-[3px] rounded-[26px] bg-gradient-to-b from-[#0e2759] via-[#051433] to-[#020a1c] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.8)]">
                    {/* Inner Tactile Console Surface */}
                    <div className="w-full h-full rounded-[23px] bg-gradient-to-b from-[#0b2452] via-[#081b3d] to-[#040e24] p-4 sm:p-5 relative overflow-hidden shadow-[inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-4px_10px_rgba(0,0,0,0.9)]">
                      {/* Blueprint Grid Watermark */}
                      <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />

                      {/* Top Curved Glass Specular Highlight */}
                      <div className="absolute inset-x-2 top-0 h-32 bg-gradient-to-b from-white/25 via-white/5 to-transparent rounded-t-[23px] pointer-events-none" />

                      {/* Header Bar */}
                      <div className="relative z-10 flex items-center justify-between pb-3.5 mb-3 border-b border-cyan-400/25">
                        <div className="flex items-center gap-2.5">
                          {/* Skeuomorphic Icon Pedestal */}
                          <div className="relative w-9 h-9 rounded-full p-[1.5px] bg-gradient-to-b from-cyan-200 via-sky-400 to-blue-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.9)] flex items-center justify-center shrink-0">
                            <div className="w-full h-full rounded-full p-[1px] bg-gradient-to-b from-blue-950 to-cyan-950 flex items-center justify-center shadow-inner">
                              <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_30%,#18458a_0%,#0d2857_50%,#041029_100%)] shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.8)] flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-x-0.5 top-0.5 h-[40%] bg-gradient-to-b from-white/45 to-transparent rounded-t-full pointer-events-none" />
                                <User className="w-4 h-4 text-cyan-200 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] relative z-10" />
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className="text-sm sm:text-base font-black font-display text-white tracking-wide uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-tight">
                              Player Profile
                            </h3>
                            <span className="text-[10px] text-cyan-300/80 font-bold tracking-tight block">
                              Identity & Contact Information
                            </span>
                          </div>
                        </div>

                        {/* Skeuomorphic 3D Close Button */}
                        <button
                          type="button"
                          onClick={() => { sound.click(); setIsProfileModalOpen(false); }}
                          aria-label="Close"
                          className="relative w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-b from-white/40 via-slate-400 to-slate-700 shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.8)] flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0"
                        >
                          <div className="w-full h-full rounded-full p-[1px] bg-gradient-to-b from-slate-900 to-black flex items-center justify-center shadow-inner">
                            <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_30%,#334155_0%,#1e293b_60%,#0f172a_100%)] flex items-center justify-center">
                              <X className="w-3.5 h-3.5 text-slate-300 drop-shadow" />
                            </div>
                          </div>
                        </button>
                      </div>

                      {/* Form Body */}
                      <form onSubmit={handleSaveProfileModal} className="relative z-10 space-y-3">
                        {/* 1. Name Field */}
                        <div className="space-y-1">
                          <label className="flex items-center justify-between text-[11px] font-bold text-cyan-200 tracking-tight">
                            <span className="flex items-center gap-1">
                              <span>Player Name</span>
                              <span className="text-rose-400">*</span>
                            </span>
                            <span className="text-[9px] font-mono text-cyan-400/60 uppercase">Max 20 chars</span>
                          </label>
                          {/* Skeuomorphic Inset Input Well */}
                          <div className="relative rounded-xl p-[1.5px] bg-gradient-to-b from-[#020b17] via-[#051733] to-[#0c2a57] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.1)]">
                            <div className="flex items-center bg-[#030d1e] rounded-[10px] px-2.5 py-1.5 shadow-[inset_0_2px_5px_rgba(0,0,0,0.95)]">
                              <span className="text-sm mr-2 text-cyan-400/70 shrink-0">👤</span>
                              <input
                                type="text"
                                required
                                maxLength={20}
                                value={profileFormName}
                                onChange={(e) => setProfileFormName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full bg-transparent text-white font-bold text-xs sm:text-sm placeholder:text-slate-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Country Selection Field */}
                        <div className="space-y-1">
                          <label className="flex items-center justify-between text-[11px] font-bold text-cyan-200 tracking-tight">
                            <span className="flex items-center gap-1">
                              <span>Country / Region</span>
                              <span className="text-rose-400">*</span>
                            </span>
                            <span className="text-[9px] font-mono text-cyan-400/60 uppercase">Leaderboard Flag</span>
                          </label>
                          {/* Skeuomorphic Inset Select Well */}
                          <div className="relative rounded-xl p-[1.5px] bg-gradient-to-b from-[#020b17] via-[#051733] to-[#0c2a57] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.1)]">
                            <div className="flex items-center bg-[#030d1e] rounded-[10px] px-2.5 py-1.5 shadow-[inset_0_2px_5px_rgba(0,0,0,0.95)]">
                              <span className="text-base mr-2 shrink-0">
                                {PLAYER_COUNTRIES.find(c => c.name === profileFormCountry)?.flag || '🌍'}
                              </span>
                              <select
                                value={profileFormCountry}
                                onChange={(e) => setProfileFormCountry(e.target.value)}
                                className="w-full bg-transparent text-white font-bold text-xs sm:text-sm outline-none cursor-pointer appearance-none"
                                style={{ colorScheme: 'dark' }}
                              >
                                {PLAYER_COUNTRIES.map((country) => (
                                  <option 
                                    key={country.code} 
                                    value={country.name}
                                    className="bg-[#051433] text-white py-1"
                                  >
                                    {country.name}
                                  </option>
                                ))}
                              </select>
                              <span className="text-[10px] text-cyan-300 pointer-events-none ml-1 shrink-0">▼</span>
                            </div>
                          </div>
                        </div>

                        {/* 3. Phone Number (Optional) */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold tracking-tight">
                            <span className="text-cyan-200">Phone Number</span>
                            <span className="text-[9px] font-mono font-bold text-slate-400 bg-white/[0.08] px-1.5 py-0.5 rounded border border-white/10">
                              Optional
                            </span>
                          </div>
                          {/* Skeuomorphic Inset Input Well */}
                          <div className="relative rounded-xl p-[1.5px] bg-gradient-to-b from-[#020b17] via-[#051733] to-[#0c2a57] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.1)]">
                            <div className="flex items-center bg-[#030d1e] rounded-[10px] px-2.5 py-1.5 shadow-[inset_0_2px_5px_rgba(0,0,0,0.95)]">
                              <span className="text-sm mr-2 text-cyan-400/70 shrink-0">📱</span>
                              <input
                                type="tel"
                                value={profileFormPhone}
                                onChange={(e) => setProfileFormPhone(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                                className="w-full bg-transparent text-white font-bold text-xs sm:text-sm placeholder:text-slate-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 4. Email Address (Optional) */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold tracking-tight">
                            <span className="text-cyan-200">Email Address</span>
                            <span className="text-[9px] font-mono font-bold text-slate-400 bg-white/[0.08] px-1.5 py-0.5 rounded border border-white/10">
                              Optional
                            </span>
                          </div>
                          {/* Skeuomorphic Inset Input Well */}
                          <div className="relative rounded-xl p-[1.5px] bg-gradient-to-b from-[#020b17] via-[#051733] to-[#0c2a57] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_0_rgba(255,255,255,0.1)]">
                            <div className="flex items-center bg-[#030d1e] rounded-[10px] px-2.5 py-1.5 shadow-[inset_0_2px_5px_rgba(0,0,0,0.95)]">
                              <span className="text-sm mr-2 text-cyan-400/70 shrink-0">✉️</span>
                              <input
                                type="email"
                                value={profileFormEmail}
                                onChange={(e) => setProfileFormEmail(e.target.value)}
                                placeholder="player@example.com"
                                className="w-full bg-transparent text-white font-bold text-xs sm:text-sm placeholder:text-slate-500 outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Actions: Save Button & Cancel */}
                        <div className="pt-2 flex flex-col gap-2">
                          {/* Skeuomorphic 3D Save Button */}
                          <button
                            type="submit"
                            className="relative w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 text-amber-950 font-black flex items-center justify-center gap-2 shadow-[0_4px_0_#92400e,0_8px_18px_rgba(245,158,11,0.45),inset_0_1px_1.5px_rgba(255,255,255,0.85)] active:translate-y-1 active:shadow-[0_1px_0_#92400e] cursor-pointer transition-all border border-amber-200/80 uppercase tracking-wider text-xs sm:text-sm overflow-hidden"
                          >
                            {/* Curved specular highlight */}
                            <div className="absolute inset-x-2 top-0 h-1/2 bg-gradient-to-b from-white/45 to-transparent rounded-t-xl pointer-events-none" />
                            <span className="text-xs">💾</span>
                            <span className="relative z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                              Save Profile
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => { sound.click(); setIsProfileModalOpen(false); }}
                            className="w-full py-1.5 text-center text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      };

      // ========================================================
      // 16. SETTINGS SCREEN (Cyber Arcade Modernization)
      // ========================================================
      const renderSettingsScreen = () => {
        const SkeuomorphicIconCircle = ({ 
          icon: IconComponent, 
          variant = 'cyan', 
          active = true,
          className = '' 
        }) => {
          const config = {
            cyan: {
              rim: 'from-cyan-200 via-sky-400 to-blue-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(6,182,212,0.4),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#18458a_0%,#0d2857_50%,#041029_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-cyan-200 drop-shadow-[0_0_6px_rgba(6,182,212,0.8)]'
            },
            teal: {
              rim: 'from-teal-200 via-teal-400 to-emerald-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(20,184,166,0.4),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#115e59_0%,#0f4842_50%,#042f2e_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-teal-200 drop-shadow-[0_0_6px_rgba(20,184,166,0.8)]'
            },
            sky: {
              rim: 'from-sky-200 via-sky-400 to-blue-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(14,165,233,0.4),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#0369a1_0%,#075985_50%,#082f49_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-sky-200 drop-shadow-[0_0_6px_rgba(14,165,233,0.8)]'
            },
            amber: {
              rim: 'from-amber-200 via-amber-400 to-amber-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(245,158,11,0.4),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#244585_0%,#122752_50%,#061129_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-amber-300 drop-shadow-[0_0_6px_rgba(245,158,11,0.8)]'
            },
            emerald: {
              rim: 'from-emerald-200 via-emerald-400 to-teal-700 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(16,185,129,0.4),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#047857_0%,#065f46_50%,#022c22_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-emerald-200 drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]'
            },
            indigo: {
              rim: 'from-indigo-200 via-indigo-400 to-indigo-800 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(99,102,241,0.4),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#312e81_0%,#1e1b4b_50%,#0f172a_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-indigo-200 drop-shadow-[0_0_6px_rgba(99,102,241,0.8)]'
            },
            rose: {
              rim: 'from-rose-200 via-rose-400 to-red-800 shadow-[0_3px_8px_rgba(0,0,0,0.6),0_0_10px_rgba(244,63,94,0.4),inset_0_1px_1px_rgba(255,255,255,0.85)]',
              disc: 'bg-[radial-gradient(circle_at_50%_30%,#881337_0%,#4c0519_50%,#1f020a_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.25)]',
              glow: 'text-rose-200 drop-shadow-[0_0_6px_rgba(244,63,94,0.8)]'
            }
          };

          const s = active ? (config[variant] || config.cyan) : {
            rim: 'from-slate-400/40 via-slate-600/40 to-slate-900/60 shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]',
            disc: 'bg-[radial-gradient(circle_at_50%_30%,#1e293b_0%,#0f172a_50%,#020617_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]',
            glow: 'text-slate-500'
          };

          return (
            <div className={`relative w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-b ${s.rim} shrink-0 flex items-center justify-center transition-all ${className}`}>
              <div className="w-full h-full rounded-full p-[1px] bg-gradient-to-b from-black/80 via-black/40 to-black/80 flex items-center justify-center shadow-inner">
                <div className={`w-full h-full rounded-full ${s.disc} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-x-1 top-0.5 h-[42%] bg-gradient-to-b from-white/45 via-white/10 to-transparent rounded-t-full pointer-events-none" />
                  <div className="absolute bottom-0.5 w-4 h-1 rounded-full bg-black/60 blur-[1px] pointer-events-none" />
                  <div className={`relative z-10 flex items-center justify-center ${s.glow}`}>
                    {React.isValidElement(IconComponent) ? (
                      IconComponent
                    ) : typeof IconComponent === 'function' ? (
                      <IconComponent className="w-4 h-4" />
                    ) : (
                      IconComponent
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        };

        const GlassToggle = ({ checked, onChange, label, sublabel, icon: IconComponent, variant = 'cyan' }) => (
          <div 
            onClick={() => {
              sound.click();
              onChange(!checked);
            }}
            className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.07] border border-white/15 hover:border-white/30 hover:bg-white/[0.1] transition-all cursor-pointer group active:scale-[0.99] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
          >
            <div className="flex items-center gap-3 min-w-0 pr-3">
              {IconComponent && (
                <SkeuomorphicIconCircle 
                  icon={IconComponent} 
                  variant={variant} 
                  active={checked} 
                />
              )}
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {label}
                </div>
                {sublabel && (
                  <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {sublabel}
                  </div>
                )}
              </div>
            </div>
            
            {/* Samsung One UI Style Switch Toggle */}
            <div 
              className={`relative shrink-0 w-11 h-6 rounded-full transition-all duration-300 border p-0.5 ${
                checked 
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-600 border-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.6)]' 
                  : 'bg-black/40 border-white/20 shadow-inner'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md flex items-center justify-center ${
                  checked 
                    ? 'translate-x-5 text-cyan-600' 
                    : 'translate-x-0 text-slate-400'
                }`}
              >
                {checked && <Check className="w-3 h-3 text-cyan-600 stroke-[3]" />}
              </div>
            </div>
          </div>
        );

        const GlassNavRow = ({ label, sublabel, icon: IconComponent, variant = 'cyan', onClick }) => (
          <button 
            onClick={() => {
              sound.click();
              onClick();
            }}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.07] border border-white/15 hover:border-white/30 hover:bg-white/[0.1] transition-all cursor-pointer group active:scale-[0.99] backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] text-left"
          >
            <div className="flex items-center gap-3 min-w-0 pr-3">
              {IconComponent && (
                <SkeuomorphicIconCircle 
                  icon={IconComponent} 
                  variant={variant} 
                  active={true} 
                />
              )}
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white tracking-wide">
                  {label}
                </div>
                {sublabel && (
                  <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {sublabel}
                  </div>
                )}
              </div>
            </div>
            <div className="w-7 h-7 rounded-xl bg-white/[0.08] border border-white/20 flex items-center justify-center text-cyan-300 group-hover:translate-x-0.5 transition-all">
              <ChevronRight className="w-4 h-4 text-cyan-300" />
            </div>
          </button>
        );

        return (
          <div className="flex-1 scifi-game-bg flex flex-col overflow-hidden text-white relative select-none">
            {/* Mathematical Coordinate Blueprint Overlay & Luminous Underlay */}
            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 scifi-ambient-cyan rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 right-0 w-80 h-80 scifi-ambient-blue rounded-full pointer-events-none" />

            {/* Sticky Modern Frosted Glass Header */}
            <header className="sticky top-0 z-20 scifi-header-bg border-b border-white/15 px-4 py-3 shrink-0 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { sound.click(); navigateTo('profile'); }} 
                  aria-label="Back to profile" 
                  className="w-10 h-10 rounded-2xl bg-white/[0.12] border border-white/20 text-cyan-200 flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5 text-cyan-200" />
                </button>
                <h1 className="text-base sm:text-lg font-black font-display tracking-wider bg-gradient-to-r from-cyan-200 via-sky-100 to-white bg-clip-text text-transparent uppercase">
                  Settings
                </h1>
                <div className="w-10 h-10" />
              </div>
            </header>

            {/* Scrollable Settings Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-24 space-y-4 relative z-10">

              {/* 1. Audio & Sensory (Glassmorphic) */}
              <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl relative overflow-hidden">
                <div className="mb-3 px-1">
                  <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                    Audio & Sensory Feedback
                  </h3>
                </div>

                <div className="space-y-2">
                  <GlassToggle 
                    checked={soundEnabled}
                    onChange={(val) => {
                      setSoundEnabled(val);
                      sound.muted = !val;
                      if (val) {
                        setTimeout(() => sound.click(), 50);
                      }
                    }}
                    label="Sound Effects"
                    sublabel="Tactile arcade clicks, fanfare & audio fx"
                    icon={<Volume2 className="w-4 h-4" />}
                    variant="cyan"
                  />
                  <GlassToggle 
                    checked={hapticsEnabled}
                    onChange={(val) => setHapticsEnabled(val)}
                    label="Haptic Feedback"
                    sublabel="Vibration pulses on keypad presses and matches"
                    icon={<Vibrate className="w-4 h-4" />}
                    variant="teal"
                  />
                  <GlassToggle 
                    checked={timerEnabled}
                    onChange={(val) => setTimerEnabled(val)}
                    label="Game Timer"
                    sublabel="Display countdown clock during puzzle battles"
                    icon={<Timer className="w-4 h-4" />}
                    variant="sky"
                  />
                </div>
              </div>

              {/* 2. Gameplay & Display (Glassmorphic) */}
              <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl relative overflow-hidden">
                <div className="mb-3 px-1">
                  <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                    Gameplay & Display
                  </h3>
                </div>

                <div className="space-y-2">
                  <GlassToggle 
                    checked={explanationEnabled}
                    onChange={(val) => setExplanationEnabled(val)}
                    label="Show Explanation Button"
                    sublabel="Reveal step-by-step mathematical reasoning"
                    icon={<Lightbulb className="w-4 h-4" />}
                    variant="amber"
                  />
                  <GlassToggle 
                    checked={autoSubmitEnabled}
                    onChange={(val) => setAutoSubmitEnabled(val)}
                    label="Auto Submit Answer"
                    sublabel="Automatically verify once equation is filled"
                    icon={<Zap className="w-4 h-4" />}
                    variant="emerald"
                  />
                  <GlassToggle 
                    checked={largeFontEnabled}
                    onChange={(val) => setLargeFontEnabled(val)}
                    label="Large Math Font"
                    sublabel="High-legibility enlarged arithmetic tiles"
                    icon={<Type className="w-4 h-4" />}
                    variant="indigo"
                  />

                  {/* Division Symbol Notation Selector */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
                    <div className="flex items-center gap-3">
                      <SkeuomorphicIconCircle 
                        icon={<Divide className="w-4 h-4" />} 
                        variant="indigo" 
                        active={true} 
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white tracking-wide">Division Notation</div>
                        <div className="text-[10px] text-slate-400 font-medium">Choose arithmetic operator symbol</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/15 shadow-inner">
                      {['÷', '/'].map(sym => (
                        <button
                          key={sym}
                          onClick={() => {
                            sound.click();
                            setDivisionSymbol(sym);
                          }}
                          className={`w-9 h-7 rounded-lg text-xs font-black transition-all cursor-pointer ${
                            divisionSymbol === sym
                              ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Information & Help (Glassmorphic) */}
              <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl relative overflow-hidden">
                <div className="mb-3 px-1">
                  <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                    Rules & Help
                  </h3>
                </div>

                <div className="space-y-2">
                  <GlassNavRow 
                    label="How to Play" 
                    sublabel="Master rules, tips & tactical formulas"
                    icon={<BookOpen className="w-4 h-4" />}
                    variant="emerald"
                    onClick={() => navigateTo('help')}
                  />
                </div>
              </div>

              {/* 4. Google Play Membership & Billing (Glassmorphic) */}
              <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-black font-display uppercase tracking-wider text-amber-200">
                    Membership & Billing
                  </h3>
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    purchaseState.isProUser 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                      : 'bg-white/10 text-slate-300 border-white/20'
                  }`}>
                    {purchaseState.isProUser ? 'PRO VIP MEMBER' : 'FREE PLAYER'}
                  </span>
                </div>

                <div className="space-y-2">
                  {!purchaseState.isProUser ? (
                    <button
                      onClick={() => {
                        sound.click();
                        navigateTo('rewards');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-400/40 hover:border-amber-300 transition-all cursor-pointer text-left active:scale-[0.99] backdrop-blur-md"
                    >
                      <div className="flex items-center gap-3">
                        <SkeuomorphicIconCircle 
                          icon={<Crown className="w-4 h-4" />} 
                          variant="amber" 
                          active={true} 
                        />
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-amber-200">Upgrade to PRO VIP Pass</div>
                          <div className="text-[10px] text-amber-300/70 font-medium">Remove ads & get bonus coins + gems</div>
                        </div>
                      </div>
                      <span className="text-xs font-black text-amber-300 px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40">
                        {purchaseService.getPrice('newromath_pro_noads')}
                      </span>
                    </button>
                  ) : (
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 flex items-center gap-3">
                      <SkeuomorphicIconCircle 
                        icon={<Crown className="w-4 h-4" />} 
                        variant="emerald" 
                        active={true} 
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-emerald-200">PRO VIP Lifetime Active</div>
                        <div className="text-[10px] text-emerald-300/70 font-medium">Enjoy unlimited ad-free math puzzles</div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      sound.click();
                      setRewardToast("🔄 Contacting Google Play to restore purchases...");
                      const res = await purchaseService.restorePurchases();
                      if (res.success) {
                        sound.correct();
                        setRewardToast(res.message);
                      } else {
                        sound.wrong();
                        setRewardToast(res.message);
                      }
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-white/[0.07] border border-white/15 hover:bg-white/[0.1] hover:border-white/30 transition-all cursor-pointer text-left active:scale-[0.99] backdrop-blur-md"
                  >
                    <div className="flex items-center gap-3">
                      <SkeuomorphicIconCircle 
                        icon={<RotateCcw className="w-4 h-4" />} 
                        variant="cyan" 
                        active={true} 
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">Restore Google Play Purchases</div>
                        <div className="text-[10px] text-slate-400 font-medium">Recover previous purchases on this account</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-cyan-300" />
                  </button>
                </div>
              </div>

              {/* 5. Campaign Progress Reset (Start Newly) */}
              <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.10] via-[#1a1236]/60 to-[#100c24]/75 border border-rose-500/30 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.15)] backdrop-blur-xl relative overflow-hidden">
                <div className="mb-3 px-1">
                  <h3 className="text-xs font-black font-display uppercase tracking-wider text-rose-300">
                    Campaign Management
                  </h3>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      sound.click();
                      if (window.confirm("Start fresh from Level 1? Your campaign level and unlocked stages will be reset to Level 1.")) {
                        resetAllProgress();
                      }
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/50 transition-all cursor-pointer text-rose-300 font-bold text-xs sm:text-sm active:scale-[0.99] backdrop-blur-md shadow-inner"
                  >
                    <div className="flex items-center gap-3">
                      <SkeuomorphicIconCircle 
                        icon={<Trash2 className="w-4 h-4" />} 
                        variant="rose" 
                        active={true} 
                      />
                      <div className="text-left">
                        <div className="text-xs sm:text-sm font-bold text-rose-200">Start Fresh from Level 1</div>
                        <div className="text-[10px] text-rose-300/70 font-medium">Reset campaign progress to beginning</div>
                      </div>
                    </div>
                    <span className="text-[11px] font-black text-rose-300 px-2.5 py-1 rounded-lg bg-rose-950/70 border border-rose-500/40 shrink-0">
                      Level 1
                    </span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-2 pb-8 text-center space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/15 text-[10.5px] text-cyan-300 font-mono shadow-inner backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> NewroMath v1.0.0
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Think • Solve • Grow
                </div>
              </div>

            </div>
          </div>
        );
      };

      // ========================================================
      // 17. HELP & SUPPORT (Glassmorphic Arcade Style)
      // ==========================================
      const renderHelpScreen = () => {
        const faqItems = [
          {
            q: "How do I earn 3 Stars on each level?",
            a: "To achieve a 3-Star mastery rating: (1) Complete the puzzle without making incorrect equation submissions, (2) Finish before the bonus time milestone, and (3) Use at most 1 hint. Flawless solves award bonus Coins and XP!",
            icon: "⭐"
          },
          {
            q: "How do intersecting equations work?",
            a: "In Cross-Math, whenever a horizontal row and a vertical column cross, they share the exact same number tile. That tile must simultaneously balance both the row equation and the column equation.",
            icon: "📐"
          },
          {
            q: "What order of operations is used?",
            a: "Equations evaluate in straightforward sequential order from left-to-right and top-to-bottom as written on the grid, matching classic arcade crossword math rules.",
            icon: "🔢"
          },
          {
            q: "What happens if I miss a Daily Challenge?",
            a: "You can protect your streak using a Streak Saver shield or unlock missed calendar dates from the calendar view using your earned Coins to keep your Monthly Trophy progress on track.",
            icon: "📅"
          },
          {
            q: "Can I play NewroMath completely offline?",
            a: "Yes! All campaign levels and offline practice modes are fully playable without an internet connection. Your stars, coins, and records will automatically sync to cloud leaderboards once reconnected.",
            icon: "📶"
          },
          {
            q: "How does the Weekly League Leaderboard work?",
            a: "Earn XP across Campaign, Daily Challenges, and Speed Runs to rise through Bronze, Silver, Gold, Diamond, and Master Leagues. The top 10 solvers promote every Sunday midnight with rare reward chests!",
            icon: "🏆"
          }
        ];

        const tabs = [
          { id: 'all', label: 'All Topics', icon: '🌐' },
          { id: 'rules', label: 'How to Play', icon: '📐' },
          { id: 'tools', label: 'Tools & Boosters', icon: '⚡' },
          { id: 'faqs', label: 'FAQs', icon: '❓' },
          { id: 'tips', label: 'Pro Tips', icon: '🧠' },
          { id: 'contact', label: 'Contact & Feedback', icon: '✉️' },
        ];

        const handleSendFeedback = () => {
          if (!feedbackText.trim()) {
            sound.wrong();
            return;
          }
          sound.correct();
          const ticketNumber = `NM-${Math.floor(10000 + Math.random() * 90000)}`;
          setFeedbackTicketId(ticketNumber);
          setFeedbackSent(true);
        };

        const handleCopyEmail = () => {
          sound.click();
          if (navigator && navigator.clipboard) {
            navigator.clipboard.writeText('support@newromath.com');
          }
          setCopiedSupportEmail(true);
          setTimeout(() => setCopiedSupportEmail(false), 2500);
        };

        return (
          <div className="flex-1 scifi-game-bg flex flex-col overflow-hidden text-white relative select-none">
            {/* Mathematical Coordinate Blueprint Overlay & Luminous Underlay */}
            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 scifi-ambient-cyan rounded-full pointer-events-none" />
            <div className="absolute -bottom-24 right-0 w-80 h-80 scifi-ambient-blue rounded-full pointer-events-none" />

            {/* Sticky Modern Frosted Glass Header */}
            <header className="sticky top-0 z-20 scifi-header-bg border-b border-white/15 px-4 py-3 shrink-0 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { 
                    sound.click(); 
                    if (navigationStackRef.current.length > 1) {
                      navigateBack();
                    } else {
                      navigateTo('settings');
                    }
                  }} 
                  aria-label="Back" 
                  className="w-10 h-10 rounded-2xl bg-white/[0.12] border border-white/20 text-cyan-200 flex items-center justify-center text-xl font-bold shadow-[0_4px_16px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ‹
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛟</span>
                  <h1 className="text-base sm:text-lg font-black font-display tracking-wider bg-gradient-to-r from-cyan-200 via-sky-100 to-white bg-clip-text text-transparent uppercase">
                    Help & Support
                  </h1>
                </div>
                <div className="w-10 h-10" />
              </div>

              {/* Horizontal Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2.5 pb-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      sound.click();
                      setHelpTab(tab.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                      helpTab === tab.id
                        ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white shadow-[0_0_14px_rgba(0,229,255,0.5)] border border-cyan-300'
                        : 'bg-white/[0.08] text-slate-300 border border-white/10 hover:bg-white/[0.15] hover:text-white'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </header>

            {/* Scrollable Help Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-24 space-y-4 relative z-10">

              {/* SECTION 1: HOW TO PLAY CROSS-MATH */}
              {(helpTab === 'all' || helpTab === 'rules') && (
                <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-sm text-cyan-300">
                      📐
                    </div>
                    <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                      How to Play Cross-Math
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    Your goal is to complete the intersecting mathematical crossword by placing numbers from your dock into the blank grid tiles so that every row and column forms a valid equation.
                  </p>

                  {/* Visual Intersecting Equation Demonstration */}
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-white/15 shadow-inner mb-3">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 mb-2.5 flex items-center justify-between">
                      <span>Interactive Grid Preview</span>
                      <span className="text-emerald-400">Balanced ✓</span>
                    </div>

                    <div className="space-y-2">
                      {/* Horizontal Equation */}
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="text-slate-400 text-[10px] w-10 shrink-0">ROW:</span>
                        <div className="w-7 h-7 rounded-lg bg-white/[0.12] border border-white/20 flex items-center justify-center font-bold text-white shadow-sm">
                          7
                        </div>
                        <span className="text-cyan-300 font-bold">+</span>
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 border border-cyan-200 flex items-center justify-center font-black text-white shadow-[0_0_8px_rgba(0,229,255,0.6)] animate-pulse">
                          5
                        </div>
                        <span className="text-slate-400 font-bold">=</span>
                        <div className="w-8 h-7 rounded-lg bg-white/[0.18] border border-white/25 flex items-center justify-center font-bold text-emerald-300">
                          12
                        </div>
                      </div>

                      {/* Vertical Equation Intersection Indicator */}
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span className="text-slate-400 text-[10px] w-10 shrink-0">COL:</span>
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 border border-cyan-200 flex items-center justify-center font-black text-white shadow-[0_0_8px_rgba(0,229,255,0.6)]">
                          5
                        </div>
                        <span className="text-cyan-300 font-bold">×</span>
                        <div className="w-7 h-7 rounded-lg bg-white/[0.12] border border-white/20 flex items-center justify-center font-bold text-white shadow-sm">
                          3
                        </div>
                        <span className="text-slate-400 font-bold">=</span>
                        <div className="w-8 h-7 rounded-lg bg-white/[0.18] border border-white/25 flex items-center justify-center font-bold text-emerald-300">
                          15
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 text-[10.5px] text-slate-300 bg-white/[0.06] p-2 rounded-xl border border-white/10">
                      💡 The shared tile <span className="font-bold text-cyan-300">[ 5 ]</span> satisfies both equations simultaneously (<span className="text-white">7 + 5 = 12</span> and <span className="text-white">5 × 3 = 15</span>).
                    </div>
                  </div>

                  {/* Core Mechanics Steps */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-2xl bg-white/[0.06] border border-white/10 flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        1
                      </div>
                      <div>
                        <div className="font-bold text-white text-[11px]">Select & Place</div>
                        <div className="text-[10px] text-slate-300">Tap a number in your dock, then tap the target blank cell to place it.</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-white/[0.06] border border-white/10 flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        2
                      </div>
                      <div>
                        <div className="font-bold text-white text-[11px]">Recall Anytime</div>
                        <div className="text-[10px] text-slate-300">Tap any placed number to instantly send it back to your dock with zero penalty.</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-white/[0.06] border border-white/10 flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        3
                      </div>
                      <div>
                        <div className="font-bold text-white text-[11px]">Color Verification</div>
                        <div className="text-[10px] text-slate-300">Balanced equations glow emerald green, while mismatched totals highlight red.</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-2xl bg-white/[0.06] border border-white/10 flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center shrink-0 text-xs">
                        4
                      </div>
                      <div>
                        <div className="font-bold text-white text-[11px]">3-Star Mastery</div>
                        <div className="text-[10px] text-slate-300">Clear all equations within the target time to unlock the full 3-star rating!</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 2: IN-GAME TOOLS & BOOSTERS */}
              {(helpTab === 'all' || helpTab === 'tools') && (
                <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-sm text-amber-300">
                      ⚡
                    </div>
                    <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                      In-Game Tools & Boosters
                    </h3>
                  </div>

                  <div className="space-y-2">
                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/15 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-lg shrink-0">
                        💡
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">Smart Hint</span>
                          <span className="text-[9px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">50 Coins</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Instantly reveals and secures the correct number in the most bottlenecked blank cell.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/15 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-lg shrink-0">
                        🔄
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">Undo / Board Reset</span>
                          <span className="text-[9px] font-mono text-cyan-300 bg-cyan-400/10 px-2 py-0.5 rounded-md border border-cyan-400/30">Free</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Recalls all placed tiles back into your tray so you can test alternative strategies without penalty.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/15 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-400/20 border border-purple-400/40 flex items-center justify-center text-lg shrink-0">
                        🎲
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">Tray Shuffle</span>
                          <span className="text-[9px] font-mono text-purple-300 bg-purple-400/10 px-2 py-0.5 rounded-md border border-purple-400/30">Free</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Reorders your dock numbers to stimulate pattern recognition and spot complementary factor pairs.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/15 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-400/20 border border-rose-400/40 flex items-center justify-center text-lg shrink-0">
                        🛡️
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white">Streak Saver</span>
                          <span className="text-[9px] font-mono text-rose-300 bg-rose-400/10 px-2 py-0.5 rounded-md border border-rose-400/30">Protective</span>
                        </div>
                        <p className="text-[11px] text-slate-300 mt-0.5">
                          Preserves your daily streak multiplier if you ever miss a calendar puzzle day.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: PRO SOLVING STRATEGIES */}
              {(helpTab === 'all' || helpTab === 'tips') && (
                <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-sm text-purple-300">
                      🧠
                    </div>
                    <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                      Pro Math Strategies
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <div className="flex items-center gap-2 font-bold text-xs text-cyan-300 mb-1">
                        <span>🎯</span> 1. Anchor Multiplication & Division First
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Multiplication and division equations have far fewer valid factor pairs than addition or subtraction. For example, in single digits <span className="font-mono text-white">_ × _ = 28</span> can only be 4 and 7. Solving these first anchors key grid intersections!
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <div className="flex items-center gap-2 font-bold text-xs text-cyan-300 mb-1">
                        <span>🧩</span> 2. Intersection Cross-Checking
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        When two candidate numbers could fit horizontally, inspect the vertical column equation. Only one candidate will satisfy both directions simultaneously.
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10">
                      <div className="flex items-center gap-2 font-bold text-xs text-cyan-300 mb-1">
                        <span>⚖️</span> 3. Parity Elimination (Even vs. Odd)
                      </div>
                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        Use parity rules: <span className="font-mono text-white">Even + Odd = Odd</span> and <span className="font-mono text-white">Even + Even = Even</span>. If the target total is even and your known tile is odd, the missing tile MUST be odd. This cuts possibilities in half!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 4: FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION) */}
              {(helpTab === 'all' || helpTab === 'faqs') && (
                <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-sm text-blue-300">
                      ❓
                    </div>
                    <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                      Frequently Asked Questions
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {faqItems.map((item, index) => {
                      const isOpen = openFaqIndex === index;
                      return (
                        <div
                          key={index}
                          className="rounded-2xl border border-white/15 bg-white/[0.06] overflow-hidden transition-all backdrop-blur-md"
                        >
                          <button
                            onClick={() => {
                              sound.click();
                              setOpenFaqIndex(isOpen ? -1 : index);
                            }}
                            className="w-full p-3 flex items-center justify-between text-left cursor-pointer hover:bg-white/[0.08] transition-all"
                          >
                            <div className="flex items-center gap-2.5 pr-2">
                              <span className="text-sm shrink-0">{item.icon}</span>
                              <span className="text-xs font-bold text-white tracking-wide">
                                {item.q}
                              </span>
                            </div>
                            <div className={`w-6 h-6 rounded-lg bg-white/[0.1] border border-white/20 flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                              ▾
                            </div>
                          </button>
                          {isOpen && (
                            <div className="px-3 pb-3 pt-1 text-[11px] text-slate-300 leading-relaxed border-t border-white/10 bg-black/20">
                              {item.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SECTION 5: DIRECT CONTACT & IN-APP FEEDBACK */}
              {(helpTab === 'all' || helpTab === 'contact') && (
                <div className="rounded-3xl p-4 bg-gradient-to-b from-white/[0.14] via-[#0f2766]/65 to-[#07163c]/80 border border-white/20 shadow-[0_16px_36px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.25)] backdrop-blur-xl relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-sm text-emerald-300">
                      ✉️
                    </div>
                    <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                      Contact & In-App Feedback
                    </h3>
                  </div>

                  {/* Direct Email Pill */}
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/15 flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-sm text-cyan-300 shrink-0">
                        📬
                      </div>
                      <div className="min-w-0">
                        <div className="text-[10px] text-slate-400 font-mono uppercase">Official Developer Support</div>
                        <div className="text-xs font-mono font-bold text-cyan-200 truncate">support@newromath.com</div>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] border border-white/20 text-xs font-bold text-white transition-all active:scale-95 cursor-pointer shrink-0"
                    >
                      {copiedSupportEmail ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>

                  {feedbackSent ? (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-400/40 text-center space-y-2">
                      <div className="w-12 h-12 mx-auto rounded-full bg-emerald-400/20 border border-emerald-400/50 flex items-center justify-center text-2xl">
                        ✓
                      </div>
                      <h4 className="text-sm font-black font-display text-white">Message Received!</h4>
                      <p className="text-xs text-slate-300">
                        Thank you for helping us polish NewroMath. We review submissions within 24-48 hours.
                      </p>
                      <div className="inline-block px-3 py-1 rounded-full bg-black/40 border border-white/20 text-[10px] font-mono text-cyan-300">
                        Ticket Ref: {feedbackTicketId}
                      </div>
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            sound.click();
                            setFeedbackSent(false);
                            setFeedbackText('');
                          }}
                          className="px-4 py-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] border border-white/20 text-xs font-bold text-white transition-all cursor-pointer"
                        >
                          Send Another Message
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Category Selection */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-300 mb-1.5">Select Category</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {['Bug Report', 'Feature Idea', 'Math Question', 'Account'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => {
                                sound.click();
                                setFeedbackCategory(cat);
                              }}
                              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer border ${
                                feedbackCategory === cat
                                  ? 'bg-gradient-to-r from-cyan-400 to-blue-600 text-white border-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                                  : 'bg-white/[0.06] text-slate-300 border-white/10 hover:bg-white/[0.1]'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Optional Email */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-300 mb-1">Your Email (Optional for reply)</div>
                        <input
                          type="email"
                          value={feedbackEmail}
                          onChange={(e) => setFeedbackEmail(e.target.value)}
                          placeholder="e.g. player@example.com"
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        />
                      </div>

                      {/* Message Textarea */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-300 mb-1">Description</div>
                        <textarea
                          rows={3}
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Please provide details about your issue or idea..."
                          className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
                        />
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={handleSendFeedback}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600 text-white font-bold text-xs tracking-wider uppercase shadow-[0_0_16px_rgba(0,229,255,0.5)] border border-cyan-300 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <span>🚀</span>
                        <span>Submit Feedback</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SECTION 6: SYSTEM SPECIFICATIONS & LEGAL */}
              <div className="pt-2 pb-8 text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/15 text-[10.5px] text-cyan-300 font-mono shadow-inner backdrop-blur-md">
                  <span>⚡</span> NewroMath v1.0.0 • Engine Build 2026
                </div>
                <div className="flex items-center justify-center gap-4 text-[10.5px] text-slate-400 font-medium">
                  <button
                    onClick={() => {
                      sound.click();
                      alert("Privacy Policy:\nNewroMath does not collect, sell, or transmit any personal identification data. All gameplay records, coins, and campaign achievements are stored safely on your device and private profile.");
                    }}
                    className="hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => {
                      sound.click();
                      alert("Terms of Service:\nNewroMath is provided free for cognitive mathematics practice, education, and entertainment. Play fair and enjoy sharpening your math mind!");
                    }}
                    className="hover:text-cyan-300 transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      };

      // ========================================================
      // 18. OFFLINE MODE (Pixel Perfect to Screen 18)
      // ==========================================
      const renderOfflineScreen = () => (
        <div className="flex-1 flex flex-col bg-white select-none relative overflow-hidden">
          <StatusBar />

          <div className="my-auto px-6 flex flex-col items-center text-center">
            {/* Crossed Signals Graphic */}
            <div className="w-20 h-20 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center text-3xl shadow-sm mb-6">
              📡
            </div>

            <h2 className="text-2xl font-black font-display text-slate-900">Offline Mode</h2>
            <p className="text-xs text-slate-500 mt-2 max-w-xs leading-relaxed">
              You're offline.<br />No internet connection detected.<br />You can still play saved puzzles and access some features.
            </p>

            <button
              onClick={() => navigateTo('home')}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 mt-6 active:scale-95 transition-all"
            >
              Continue Offline
            </button>

            <button
              onClick={() => navigateTo('home')}
              className="text-xs font-bold text-blue-600 hover:underline mt-4"
            >
              Check Connection
            </button>
          </div>

          {/* Subtle Mountain Landscape Graphic at bottom */}
          <div className="w-full relative h-20">
            <svg className="absolute bottom-0 w-full" viewBox="0 0 400 80" fill="none">
              <path d="M0 50L60 30L140 60L220 20L310 60L400 35V80H0Z" fill="#f1f5f9" />
              <path d="M0 65L80 45L180 70L280 40L400 60V80H0Z" fill="#e2e8f0" opacity="0.6" />
            </svg>
          </div>
        </div>
      );

      // ========================================================
      // 19. REWARDS & SHOP (3D Sci-Fi Arcade Rewards Store)
      // ========================================================
      const renderRewardsScreen = () => {
        const handleClaimDailyGift = () => {
          if (dailyGiftClaimed) return;
          sound.correct();
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.5 } });
          setDailyGiftClaimed(true);
          setCoins(c => c + 350);
          setGems(g => g + 5);
          setRewardToast("🎁 Claimed Daily Gift: +350 Coins & +5 Gems!");
        };

        const handleClaimDailyGiftWithAd = () => {
          if (dailyGiftClaimed) return;
          handleWatchAd('both', 0, 'Daily Double Gift Sponsor', {
            coinAmount: 700,
            gemAmount: 15,
            onComplete: () => {
              setDailyGiftClaimed(true);
            }
          });
        };

        const handleExchangeCoins = (costGems, coinsToGet) => {
          sound.click();
          if (gems >= costGems) {
            setGems(g => g - costGems);
            setCoins(c => c + coinsToGet);
            sound.correct();
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.5 } });
            setRewardToast(`🪙 Exchanged for +${coinsToGet.toLocaleString()} Gold Coins!`);
          } else {
            sound.wrong();
            setRewardToast("❌ Need more Gems! Watch an ad to collect free Gems.");
          }
        };

        const handleBuyPackage = async (sku) => {
          sound.click();
          const pack = IAP_CATALOG.find(p => p.id === sku);
          if (!pack) return;

          setRewardToast(`⏳ Connecting to Google Play Store...`);
          const res = await purchaseService.purchaseProduct(sku);
          if (res.success) {
            if (typeof sound.victory === 'function') {
              sound.victory();
            } else {
              sound.correct();
            }
            confetti({ particleCount: 110, spread: 80, origin: { y: 0.5 } });
            if (pack.type === 'coins') {
              setCoins(c => {
                const next = c + pack.amount;
                try { GameStorage.setItem('newromath_coins', next.toString()); } catch (e) {}
                return next;
              });
              setRewardToast(`🎉 Google Play Purchase: +${pack.amount.toLocaleString()} Coins Added!`);
            } else if (pack.type === 'gems') {
              setGems(g => {
                const next = g + pack.amount;
                try { GameStorage.setItem('newromath_gems', next.toString()); } catch (e) {}
                return next;
              });
              setRewardToast(`💎 Google Play Purchase: +${pack.amount.toLocaleString()} Diamonds Added!`);
            } else if (pack.type === 'pro') {
              setCoins(c => {
                const next = c + 2000;
                try { GameStorage.setItem('newromath_coins', next.toString()); } catch (e) {}
                return next;
              });
              setGems(g => {
                const next = g + 50;
                try { GameStorage.setItem('newromath_gems', next.toString()); } catch (e) {}
                return next;
              });
              setRewardToast(`👑 PRO VIP Pass Activated! Ads Removed + 2,000 🪙 + 50 💎 Added!`);
            }
          } else {
            sound.wrong();
            if (res.error && !res.error.toLowerCase().includes('cancel')) {
              setRewardToast(`❌ ${res.error}`);
            } else {
              setRewardToast(`Purchase was cancelled.`);
            }
          }
        };

        const handleRestorePurchases = async () => {
          sound.click();
          setRewardToast("🔄 Connecting to Google Play to restore purchases...");
          const res = await purchaseService.restorePurchases();
          if (res.success) {
            sound.correct();
            setRewardToast(res.message);
          } else {
            sound.wrong();
            setRewardToast(res.message);
          }
        };

        return (
          <div className="flex-1 flex flex-col scifi-game-bg select-none overflow-hidden relative text-white">
            {/* Top Bar Header */}
            <div className="sticky top-0 z-20 scifi-header-bg border-b border-cyan-400/20 flex items-center justify-between px-3 pt-2.5 pb-2 shrink-0">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigateTo('home')} 
                  className="w-8 h-8 rounded-xl bg-[#133273] border border-cyan-400/60 flex items-center justify-center text-cyan-300 hover:text-white hover:bg-[#1a4294] active:scale-95 transition-all shadow-[0_0_10px_rgba(0,229,255,0.3)] cursor-pointer"
                  title="Back to Home"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                </button>
              </div>

              {/* Right Currencies */}
              {/* Right Currencies */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Coins */}
                <div className="flex items-center gap-1.5 bg-[#0a1f4d]/70 backdrop-blur-md border border-amber-400/50 rounded-xl px-2.5 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <img 
                    src="/assets/icon_gold_coin_3d_clean.webp" 
                    alt="Coins" 
                    className="w-4 h-4 object-contain shrink-0 drop-shadow-[0_2px_4px_rgba(245,158,11,0.6)]" 
                  />
                  <span className="text-amber-300 font-black text-xs font-display tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {coins.toLocaleString()}
                  </span>
                </div>
                {/* Gems */}
                <div className="flex items-center gap-1.5 bg-[#0a1f4d]/70 backdrop-blur-md border border-cyan-400/50 rounded-xl px-2.5 py-1 shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15)]">
                  <img 
                    src="/assets/icon_gem_3d_clean.webp" 
                    alt="Diamonds" 
                    className="w-4 h-4 object-contain shrink-0 drop-shadow-[0_2px_5px_rgba(6,182,212,0.6)]" 
                  />
                  <span className="text-cyan-200 font-black text-xs font-display tracking-tight drop-shadow-[0_0_6px_rgba(0,229,255,0.5)]">
                    {gems.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-8 space-y-4 max-w-md mx-auto w-full">
              
              {/* Toast Notification if present */}
              {rewardToast && (
                <div className="sticky top-2 z-30 bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-cyan-600/90 backdrop-blur-md border border-emerald-300/80 rounded-2xl p-2.5 text-center text-xs font-black shadow-[0_4px_20px_rgba(16,185,129,0.5)] animate-in slide-in-from-top duration-200">
                  {rewardToast}
                </div>
              )}

              {/* 1. Daily Free Gift Banner - Premium Glassmorphism */}
              <div className="relative rounded-[26px] bg-gradient-to-br from-white/[0.12] via-[#15347a]/60 to-[#0c1f4d]/80 backdrop-blur-xl border border-white/25 p-3 sm:p-3.5 shadow-[0_12px_32px_rgba(3,12,38,0.5),inset_0_1.5px_0_rgba(255,255,255,0.25)] flex items-center justify-between gap-2.5 sm:gap-3 overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-400/15 rounded-full blur-2xl pointer-events-none"></div>
                <div className="flex items-center gap-2.5 sm:gap-3 relative z-10 min-w-0 flex-1">
                  <img 
                    src="/assets/reward_gift_dial_full.webp" 
                    alt="Daily Reward" 
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0 drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]" 
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-black text-white truncate">Daily Mystery Chest</h3>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-[9.5px] sm:text-[10px] font-bold text-amber-300 flex items-center gap-1 bg-amber-500/15 border border-amber-400/30 rounded-full px-2 py-0.5 shrink-0">
                        <img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coin" className="w-3 h-3 object-contain" />
                        +350
                      </span>
                      <span className="text-[9.5px] sm:text-[10px] font-bold text-cyan-200 flex items-center gap-1 bg-cyan-500/15 border border-cyan-400/30 rounded-full px-2 py-0.5 shrink-0">
                        <img src="/assets/icon_gem_3d_clean.webp" alt="Gem" className="w-3 h-3 object-contain" />
                        +5
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0 justify-center w-28 sm:w-32 relative z-10">
                  <button
                    disabled={dailyGiftClaimed}
                    onClick={handleClaimDailyGift}
                    className={`w-full py-1.5 sm:py-2 px-2 rounded-xl text-[10.5px] sm:text-xs font-black tracking-wide uppercase transition-all shadow-md active:scale-95 text-center flex items-center justify-center whitespace-nowrap ${
                      dailyGiftClaimed
                        ? 'bg-slate-700/60 border border-slate-600/50 text-slate-400 cursor-not-allowed py-2'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 border border-amber-300 shadow-[0_0_14px_rgba(245,158,11,0.5)] cursor-pointer'
                    }`}
                  >
                    {dailyGiftClaimed ? 'Claimed ✓' : 'Claim Free'}
                  </button>
                  {!dailyGiftClaimed && (
                    <button
                      onClick={handleClaimDailyGiftWithAd}
                      className="w-full py-1.5 sm:py-2 px-2 rounded-xl text-[10.5px] sm:text-xs font-black tracking-wide uppercase transition-all shadow-[0_0_15px_rgba(16,185,129,0.5)] active:scale-95 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 hover:from-emerald-300 hover:to-teal-400 text-emerald-950 border border-emerald-300 cursor-pointer flex items-center justify-center gap-1 whitespace-nowrap"
                      title="Watch Ad to Double Daily Reward"
                    >
                      <span className="text-[9px]">▶</span>
                      <span>2X with Ad</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 2. PRO VIP Pass - Lifetime Ad-Free & Exclusive Member Perks */}
              <div className="relative rounded-[26px] bg-gradient-to-br from-amber-400/20 via-[#27134d]/80 to-[#100624]/95 backdrop-blur-xl border-2 border-amber-400/60 p-4 shadow-[0_14px_36px_rgba(245,158,11,0.25),inset_0_1.5px_0_rgba(255,255,255,0.35)] overflow-hidden">
                <div className="absolute -right-8 -top-8 w-36 h-36 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
                <div className="flex items-start justify-between gap-3 relative z-10 mb-2.5">
                  <div className="flex items-center gap-3">
                    {/* Skeuomorphic VIP Crown Pedestal Circle */}
                    <div className="relative w-13 h-13 rounded-full p-[2px] bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 shadow-[0_5px_15px_rgba(0,0,0,0.6),0_0_16px_rgba(245,158,11,0.4),inset_0_1px_1px_rgba(255,255,255,0.85)] shrink-0 flex items-center justify-center">
                      <div className="w-full h-full rounded-full p-[1.5px] bg-gradient-to-b from-amber-950 via-[#1a0e02] to-amber-900 flex items-center justify-center shadow-inner">
                        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_30%,#244585_0%,#122752_50%,#061129_100%)] shadow-[inset_0_3px_6px_rgba(0,0,0,0.8),inset_0_-1.5px_2px_rgba(255,255,255,0.2)] flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-x-1.5 top-0.5 h-[42%] bg-gradient-to-b from-white/45 via-white/10 to-transparent rounded-t-full pointer-events-none" />
                          <div className="absolute bottom-1 w-6 h-1 rounded-full bg-black/60 blur-[1px] pointer-events-none" />
                          <span className="text-2xl leading-none drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)] relative z-10 transition-transform hover:scale-110 select-none">
                            👑
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-white font-display">
                        PRO VIP Lifetime Pass
                      </h3>
                      <p className="text-[10px] text-amber-200/90 font-medium">
                        Permanent Ad-Free & Master Bundle
                      </p>
                    </div>
                  </div>
                </div>

                {/* Perk Pills */}
                <div className="grid grid-cols-2 gap-2 my-2.5 relative z-10">
                  <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10 flex items-center gap-1.5">
                    <span className="text-sm">🚫</span>
                    <span className="text-[9.5px] font-bold text-slate-200">Remove Ads Forever</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10 flex items-center gap-1.5">
                    <span className="text-sm">🪙</span>
                    <span className="text-[9.5px] font-bold text-amber-300">+2,000 Bonus Coins</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10 flex items-center gap-1.5">
                    <span className="text-sm">💎</span>
                    <span className="text-[9.5px] font-bold text-cyan-200">+50 Bonus Diamonds</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white/[0.06] border border-white/10 flex items-center gap-1.5">
                    <span className="text-sm">👑</span>
                    <span className="text-[9.5px] font-bold text-amber-300">VIP Crown Status</span>
                  </div>
                </div>

                {/* Purchase Action Button */}
                <div className="mt-2.5 relative z-10">
                  {purchaseState.isProUser ? (
                    <div className="w-full py-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                      <span>👑</span>
                      <span>ACTIVE PRO VIP MEMBER ✓</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBuyPackage('newromath_pro_noads')}
                      className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 font-black text-xs uppercase tracking-wider shadow-[0_4px_0_#b45309,0_8px_20px_rgba(245,158,11,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-200"
                    >
                      <span>⚡</span>
                      <span>Unlock PRO Pass — {purchaseService.getPrice('newromath_pro_noads')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* 3. Collect via Ads Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-cyan-400 text-xs">🎬</span>
                    <h2 className="text-[11px] font-extrabold uppercase tracking-wider font-display text-cyan-200">
                      Watch Ads & Collect Free
                    </h2>
                  </div>
                  <span className="text-[9px] font-bold text-cyan-400/80 bg-cyan-950/70 border border-cyan-500/30 rounded-full px-2 py-0.5">
                    Instant
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* Ad Option 1: Gold Coins - Glassmorphic Card */}
                  <div className="relative rounded-[24px] bg-gradient-to-b from-white/[0.10] via-[#0d2250]/70 to-[#071536]/85 backdrop-blur-xl border border-white/20 p-3.5 flex flex-col justify-between items-center text-center shadow-[0_10px_28px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.2)] hover:border-amber-400/40 transition-all">
                    {/* Skeuomorphic Golden Coin Pedestal Circle */}
                    <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 shadow-[0_5px_15px_rgba(0,0,0,0.6),0_0_14px_rgba(245,158,11,0.35),inset_0_1px_1px_rgba(255,255,255,0.8)] mb-2 shrink-0 flex items-center justify-center">
                      <div className="w-full h-full rounded-full p-[1.5px] bg-gradient-to-b from-amber-950 via-[#1a0e02] to-amber-900 flex items-center justify-center shadow-inner">
                        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_30%,#244585_0%,#122752_50%,#061129_100%)] shadow-[inset_0_3px_6px_rgba(0,0,0,0.8),inset_0_-1.5px_2px_rgba(255,255,255,0.2)] flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-x-1.5 top-0.5 h-[42%] bg-gradient-to-b from-white/45 via-white/10 to-transparent rounded-t-full pointer-events-none" />
                          <div className="absolute bottom-1 w-6 h-1 rounded-full bg-black/60 blur-[1px] pointer-events-none" />
                          <img 
                            src="/assets/icon_gold_coin_3d_clean.webp" 
                            alt="Coins" 
                            className="w-8 h-8 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.65)] relative z-10 transition-transform duration-200 hover:scale-110 active:scale-95" 
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-amber-300 font-display">+250 Coins</span>
                    <span className="text-[9.5px] text-slate-300/80 mb-2.5 font-medium">Instant Reward</span>
                    <button
                      onClick={() => handleWatchAd('coins', 250, 'Coin Sponsor Video')}
                      className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-[11px] shadow-[0_3px_0_#b45309,0_6px_14px_rgba(245,158,11,0.35)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer border border-amber-200/80"
                    >
                      <span>▶</span>
                      <span>Watch Ad</span>
                    </button>
                  </div>

                  {/* Ad Option 2: Diamonds - Glassmorphic Card */}
                  <div className="relative rounded-[24px] bg-gradient-to-b from-white/[0.10] via-[#0d2250]/70 to-[#071536]/85 backdrop-blur-xl border border-white/20 p-3.5 flex flex-col justify-between items-center text-center shadow-[0_10px_28px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.2)] hover:border-cyan-400/40 transition-all">
                    {/* Skeuomorphic Diamond Pedestal Circle */}
                    <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-b from-cyan-200 via-sky-400 to-blue-700 shadow-[0_5px_15px_rgba(0,0,0,0.6),0_0_14px_rgba(6,182,212,0.35),inset_0_1px_1px_rgba(255,255,255,0.8)] mb-2 shrink-0 flex items-center justify-center">
                      <div className="w-full h-full rounded-full p-[1.5px] bg-gradient-to-b from-blue-950 via-[#031533] to-cyan-950 flex items-center justify-center shadow-inner">
                        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_30%,#18458a_0%,#0d2857_50%,#041029_100%)] shadow-[inset_0_3px_6px_rgba(0,0,0,0.8),inset_0_-1.5px_2px_rgba(255,255,255,0.2)] flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-x-1.5 top-0.5 h-[42%] bg-gradient-to-b from-white/45 via-white/10 to-transparent rounded-t-full pointer-events-none" />
                          <div className="absolute bottom-1 w-6 h-1 rounded-full bg-black/60 blur-[1px] pointer-events-none" />
                          <img 
                            src="/assets/icon_gem_3d_clean.webp" 
                            alt="Diamonds" 
                            className="w-7 h-7 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.65)] relative z-10 transition-transform duration-200 hover:scale-110 active:scale-95" 
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-black text-cyan-200 font-display">+10 Diamonds</span>
                    <span className="text-[9.5px] text-slate-300/80 mb-2.5 font-medium">Instant Reward</span>
                    <button
                      onClick={() => handleWatchAd('gems', 10, 'Diamond Sponsor Video')}
                      className="w-full py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-blue-950 font-black text-[11px] shadow-[0_3px_0_#0284c7,0_6px_14px_rgba(6,182,212,0.35)] hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer border border-cyan-200/80"
                    >
                      <span>▶</span>
                      <span>Watch Ad</span>
                    </button>
                  </div>
                </div>

                {/* Ad Option 3: Big Jackpot Chest Ad - Glassmorphic Banner */}
                <div className="rounded-[22px] bg-gradient-to-r from-white/[0.10] via-[#1c2c63]/60 to-[#12224d]/80 backdrop-blur-xl border border-white/20 p-2.5 flex items-center justify-between shadow-[0_8px_24px_rgba(2,10,32,0.4),inset_0_1.5px_0_rgba(255,255,255,0.2)]">
                  <div className="flex items-center gap-2.5">
                    {/* Skeuomorphic Purple Pedestal */}
                    <div className="relative w-11 h-11 rounded-full p-[2px] bg-gradient-to-b from-purple-200 via-purple-400 to-indigo-700 shadow-[0_4px_12px_rgba(0,0,0,0.6),0_0_12px_rgba(168,85,247,0.35),inset_0_1px_1px_rgba(255,255,255,0.8)] shrink-0 flex items-center justify-center">
                      <div className="w-full h-full rounded-full p-[1.5px] bg-gradient-to-b from-purple-950 via-[#1e0b36] to-indigo-950 flex items-center justify-center shadow-inner">
                        <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_30%,#3b186b_0%,#200b3d_50%,#0e041a_100%)] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-x-1 top-0.5 h-[40%] bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-full pointer-events-none" />
                          <div className="absolute bottom-0.5 w-5 h-1 rounded-full bg-black/60 blur-[1px] pointer-events-none" />
                          <img src="/assets/icon_chest_3d.webp" alt="Chest" className="w-6 h-6 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] relative z-10 transition-transform duration-200 hover:scale-110 active:scale-95" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs font-black text-purple-200 block">Jackpot Ad Chest</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-amber-300 font-bold flex items-center gap-0.5">
                          <img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coin" className="w-3 h-3 object-contain" />
                          +600
                        </span>
                        <span className="text-[10px] text-cyan-200 font-bold flex items-center gap-0.5">
                          <img src="/assets/icon_gem_3d_clean.webp" alt="Diamond" className="w-3 h-3 object-contain" />
                          +15
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleWatchAd('jackpot', 600, 'Jackpot Mega Sponsor')}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-[10px] border border-purple-300/70 shadow-[0_3px_0_#581c87,0_6px_14px_rgba(168,85,247,0.35)] active:scale-95 transition-all cursor-pointer"
                  >
                    ▶ Watch (15s)
                  </button>
                </div>
              </div>

              {/* 4. Gold Coin Store (Google Play In-App Purchases & Gem Exchange) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <img src="/assets/icon_gold_coin_3d_clean.webp" alt="Coins" className="w-4 h-4 object-contain" />
                    <h2 className="text-[11px] font-extrabold uppercase tracking-wider font-display text-amber-200">
                      Gold Coin Store
                    </h2>
                  </div>
                  <span className="text-[9px] font-bold text-amber-400/80">
                    Google Play or Gems
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {IAP_CATALOG.filter(p => p.type === 'coins').map((pack) => (
                    <div key={pack.id} className="relative rounded-[24px] bg-gradient-to-b from-white/[0.10] via-[#0d2250]/70 to-[#071536]/85 backdrop-blur-xl border border-white/20 p-3 flex flex-col justify-between shadow-[0_10px_28px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.2)] hover:border-amber-400/40 transition-all">
                      {pack.badge && (
                        <span className="absolute -top-1.5 right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 font-black text-[8px] px-2 py-0.5 rounded-full uppercase tracking-tight shadow-sm border border-amber-200/70 z-10">
                          {pack.badge}
                        </span>
                      )}
                      <div className="text-center pt-1 flex flex-col items-center">
                        {/* Skeuomorphic Golden Coin Pedestal Circle */}
                        <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 shadow-[0_5px_15px_rgba(0,0,0,0.6),0_0_14px_rgba(245,158,11,0.35),inset_0_1px_1px_rgba(255,255,255,0.8)] mb-2 shrink-0 flex items-center justify-center">
                          <div className="w-full h-full rounded-full p-[1.5px] bg-gradient-to-b from-amber-950 via-[#1a0e02] to-amber-900 flex items-center justify-center shadow-inner">
                            <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_30%,#244585_0%,#122752_50%,#061129_100%)] shadow-[inset_0_3px_6px_rgba(0,0,0,0.8),inset_0_-1.5px_2px_rgba(255,255,255,0.2)] flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-x-1.5 top-0.5 h-[42%] bg-gradient-to-b from-white/45 via-white/10 to-transparent rounded-t-full pointer-events-none" />
                              <div className="absolute bottom-1 w-6 h-1 rounded-full bg-black/60 blur-[1px] pointer-events-none" />
                              {pack.isCustomImg ? (
                                <img src={pack.customIcon} alt={pack.name} className="w-8 h-8 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.65)] relative z-10 transition-transform duration-200 hover:scale-110 active:scale-95" />
                              ) : (
                                <span className="text-2xl block relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{pack.icon}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <h4 className="text-[11px] font-extrabold text-white leading-tight">{pack.name}</h4>
                        <span className="text-xs font-black text-amber-300 font-display block mt-0.5">
                          +{pack.amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-1 mt-2.5">
                        {pack.gemsCost && (
                          <button
                            onClick={() => handleExchangeCoins(pack.gemsCost, pack.amount)}
                            className="w-full py-1.5 rounded-xl bg-gradient-to-r from-[#0c245c] to-[#123075] hover:brightness-110 border border-cyan-400/50 text-[10px] font-bold text-cyan-200 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer shadow-xs"
                            title="Exchange with Gems"
                          >
                            <img src="/assets/icon_gem_3d_clean.webp" alt="Gem" className="w-3 h-3 object-contain" />
                            <span>{pack.gemsCost} Gems</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleBuyPackage(pack.id)}
                          className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 text-[10px] font-black active:scale-95 transition-all cursor-pointer shadow-[0_2px_0_#b45309] border border-amber-200/80 flex items-center justify-center gap-1"
                        >
                          <span>{purchaseService.getPrice(pack.id)}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Diamond Store (Google Play In-App Purchases) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <img src="/assets/icon_gem_3d_clean.webp" alt="Diamonds" className="w-4 h-4 object-contain" />
                    <h2 className="text-[11px] font-extrabold uppercase tracking-wider font-display text-cyan-200">
                      Diamond Store
                    </h2>
                  </div>
                  <span className="text-[9px] font-bold text-cyan-400/80">
                    Premium Gems
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {IAP_CATALOG.filter(p => p.type === 'gems').map((pack) => (
                    <div key={pack.id} className="relative rounded-[24px] bg-gradient-to-b from-white/[0.10] via-[#0d2250]/70 to-[#071536]/85 backdrop-blur-xl border border-white/20 p-3 flex flex-col justify-between shadow-[0_10px_28px_rgba(2,10,32,0.45),inset_0_1.5px_0_rgba(255,255,255,0.2)] hover:border-cyan-400/40 transition-all">
                      {pack.badge && (
                        <span className="absolute -top-1.5 right-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-blue-950 font-black text-[8px] px-2 py-0.5 rounded-full uppercase tracking-tight shadow-sm border border-cyan-200/70 z-10">
                          {pack.badge}
                        </span>
                      )}
                      <div className="text-center pt-1 flex flex-col items-center">
                        {/* Skeuomorphic Diamond Pedestal Circle */}
                        <div className="relative w-14 h-14 rounded-full p-[2px] bg-gradient-to-b from-cyan-200 via-sky-400 to-blue-700 shadow-[0_5px_15px_rgba(0,0,0,0.6),0_0_14px_rgba(6,182,212,0.35),inset_0_1px_1px_rgba(255,255,255,0.8)] mb-2 shrink-0 flex items-center justify-center">
                          <div className="w-full h-full rounded-full p-[1.5px] bg-gradient-to-b from-blue-950 via-[#031533] to-cyan-950 flex items-center justify-center shadow-inner">
                            <div className="w-full h-full rounded-full bg-[radial-gradient(circle_at_50%_30%,#18458a_0%,#0d2857_50%,#041029_100%)] shadow-[inset_0_3px_6px_rgba(0,0,0,0.8),inset_0_-1.5px_2px_rgba(255,255,255,0.2)] flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-x-1.5 top-0.5 h-[42%] bg-gradient-to-b from-white/45 via-white/10 to-transparent rounded-t-full pointer-events-none" />
                              <div className="absolute bottom-1 w-6 h-1 rounded-full bg-black/60 blur-[1px] pointer-events-none" />
                              {pack.isCustomImg ? (
                                <img src={pack.customIcon} alt={pack.name} className="w-7 h-7 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.65)] relative z-10 transition-transform duration-200 hover:scale-110 active:scale-95" />
                              ) : (
                                <span className="text-2xl block relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{pack.icon}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <h4 className="text-[11px] font-extrabold text-white leading-tight">{pack.name}</h4>
                        <span className="text-xs font-black text-cyan-200 font-display block mt-0.5">
                          +{pack.amount.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleBuyPackage(pack.id)}
                        className="w-full mt-2.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:brightness-110 text-white text-[10px] font-black active:scale-95 transition-all cursor-pointer shadow-[0_2px_0_#0284c7] border border-cyan-300/40 flex items-center justify-center gap-1"
                      >
                        <span>{purchaseService.getPrice(pack.id)}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Google Play Billing Guarantee & Restore Purchases */}
              <div className="rounded-2xl p-3 bg-white/[0.05] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-sm text-emerald-300 shrink-0">
                    🔒
                  </div>
                  <div className="text-[10px] text-slate-300">
                    <span className="font-bold text-white block">Google Play In-App Billing</span>
                    Official, secure encrypted transaction & instant item delivery
                  </div>
                </div>
                <button
                  onClick={handleRestorePurchases}
                  className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-[10px] font-bold text-cyan-200 active:scale-95 transition-all cursor-pointer whitespace-nowrap shadow-xs"
                >
                  🔄 Restore Purchases
                </button>
              </div>

            </div>

            {/* Google Play Transaction Loading Modal */}
            {purchaseState.isLoading && (
              <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
                <div className="rounded-3xl p-5 bg-gradient-to-b from-[#152758] to-[#0a1638] border border-cyan-400/50 shadow-[0_0_30px_rgba(0,229,255,0.4)] flex flex-col items-center text-center max-w-xs w-full animate-in zoom-in-95 duration-200">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-300 flex items-center justify-center text-2xl mb-3 animate-spin">
                    ⚙️
                  </div>
                  <h4 className="text-sm font-black text-white font-display mb-1">
                    Google Play In-App Billing
                  </h4>
                  <p className="text-xs text-cyan-200 font-medium">
                    Connecting to Google Play Store... Please complete the transaction in the Google Play dialog.
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      };

      // ==========================================
      // MAIN SCREEN ROUTER
      // ==========================================
      const renderActiveScreen = () => {
        switch (currentScreen) {
          case 'splash': return renderSplashScreen();
          case 'onboarding': return renderOnboardingScreen();
          case 'home': return renderHomeScreen();
          case 'categories': return renderLevelSelectScreen();
          case 'levels': return renderLevelSelectScreen();
          case 'game': return renderGameScreen();
          case 'hint': return renderHintScreen();
          case 'correct': return renderCorrectScreen();
          case 'wrong': return renderWrongScreen();
          case 'daily': return renderDailyScreen();
          case 'daily_game': return renderDailyGameScreen();
          case 'battle': return renderBattleScreen();
          case 'stats': return renderHomeScreen();
          case 'achievements': return renderAchievementsScreen();
          case 'leaderboard': return renderLeaderboardScreen();
          case 'history': return renderHistoryScreen();
          case 'profile': return renderProfileScreen();
          case 'settings': return renderSettingsScreen();
          case 'help': return renderHelpScreen();
          case 'offline': return renderOfflineScreen();
          case 'rewards': return renderRewardsScreen();
          default: return renderHomeScreen();
        }
      };

      return (
        <div ref={gameContainerRef} className="flex-1 flex flex-col h-full relative font-sans">
          <PageTransition screenKey={currentScreen} direction={transitionDirection} isWaitingForLoad={isPageLoading}>
            {renderActiveScreen()}
          </PageTransition>

          {/* Google AdMob Demo Banner at Bottom (Reserved 50px height, strictly adheres to AdMob layout & separation policies) */}
          {adMobState.bannerVisible && currentScreen !== 'splash' && currentScreen !== 'onboarding' && (
            <AdMobBanner isNative={adMobState.isNative} />
          )}

          {/* Google AdMob Demo Interstitial Ad Fullscreen Modal */}
          <AdMobInterstitialModal
            isOpen={adMobState.interstitialActive}
            onClose={() => adMobService.dismissWebInterstitial()}
          />

          {isPageLoading && <SlidingTileLoader />}

          {/* 3D Cyber-Arcade Flying Number Tiles Layer (Object Pooled - Zero DOM allocations) */}
          <div className="absolute inset-0 pointer-events-none z-[9999] overflow-hidden">
            {flyingPool.map(slot => (
              <PooledFlyingTileItem
                key={slot.slotId}
                slot={slot}
                largeFontEnabled={largeFontEnabled}
                onComplete={(s) => {
                  recycleFlyingTile(s.slotId);
                  if (s.isReturn) {
                    finalizeReturn(s.number);
                  } else {
                    finalizePlacement(s.number, s.targetSlot);
                  }
                }}
              />
            ))}
          </div>
          {/* Cyber Notification Toast Banner */}
          {rewardToast && (
            <div className="fixed top-5 inset-x-4 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="bg-gradient-to-r from-[#0d2254]/95 via-[#153473]/95 to-[#0c1f4a]/95 border-2 border-cyan-400/80 rounded-2xl px-4 py-2.5 shadow-[0_8px_25px_rgba(0,229,255,0.6)] text-white font-black text-xs font-display flex items-center justify-center text-center backdrop-blur-md">
                <span>{rewardToast}</span>
              </div>
            </div>
          )}

          {/* Insufficient Resources — 3D Glassmorphism Banner Modal */}
          {insufficientFundsModal.isOpen && (() => {
            const need = insufficientFundsModal.cost;
            const rows = [
              { key: 'coins', icon: '/assets/icon_gold_coin_3d_clean.webp', have: coins, need: need.coins, tone: 'amber' },
              { key: 'gems', icon: '/assets/icon_gem_3d_clean.webp', have: gems, need: need.gems, tone: 'cyan' }
            ];
            const closeModal = () => {
              sound.click();
              setInsufficientFundsModal(prev => ({ ...prev, isOpen: false }));
            };
            return (
              <div
                className="fixed inset-0 z-50 bg-[#06122c]/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200"
                onClick={closeModal}
              >
                {/* Glassmorphic Popup Card */}
                <div
                  className="relative w-full max-w-[320px] sm:max-w-[335px] rounded-[36px] p-5 sm:p-6 pt-14 sm:pt-16 bg-gradient-to-b from-white/95 via-[#f0f7ff]/95 to-[#e0efff]/95 border-2 border-white/90 shadow-[0_25px_60px_-10px_rgba(8,24,68,0.6),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(56,189,248,0.2)] text-center overflow-visible"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Close Button (Top-Right) */}
                  <button
                    onClick={closeModal}
                    aria-label="Close"
                    title="Close"
                    className="absolute top-3.5 right-3.5 z-30 w-8 h-8 rounded-full bg-blue-100/90 hover:bg-blue-200 border border-white text-[#1e3a8a] flex items-center justify-center font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>

                  {/* 3D Floating Hero: Glowing Coin & Diamond Pod + Splash Petals + Arched 3D Banner */}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-52 flex flex-col items-center pointer-events-none z-20">
                    {/* Cloud base & Splash petals behind hero */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -bottom-2 w-28 h-10 bg-gradient-to-t from-[#bae6fd] to-white rounded-full blur-[1px] shadow-sm -z-10" />

                      {/* Left Splashes */}
                      <svg className="absolute -left-1 top-1.5 w-7 h-7 text-[#38bdf8] drop-shadow-[0_2px_6px_rgba(56,189,248,0.5)] -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                      <svg className="absolute -left-3 top-6 w-5 h-5 text-[#0ea5e9] drop-shadow-[0_2px_4px_rgba(14,165,233,0.4)] -rotate-45" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>

                      {/* Right Splashes */}
                      <svg className="absolute -right-1 top-1.5 w-7 h-7 text-[#38bdf8] drop-shadow-[0_2px_6px_rgba(56,189,248,0.5)] rotate-12 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                      <svg className="absolute -right-3 top-6 w-5 h-5 text-[#0ea5e9] drop-shadow-[0_2px_4px_rgba(14,165,233,0.4)] rotate-45 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>

                      {/* 3D Circular Gloss Pod for Coin & Gem */}
                      <div className="relative w-16 h-16 rounded-full bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border-2 border-white/90 shadow-[0_8px_20px_rgba(14,165,233,0.45),inset_0_2px_4px_rgba(255,255,255,0.7)] flex items-center justify-center">
                        <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                        <img src="/assets/icon_gold_coin_3d_clean.webp" alt="" className="w-8 h-8 object-contain -translate-x-1.5 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
                        <img src="/assets/icon_gem_3d_clean.webp" alt="" className="absolute w-7 h-7 object-contain translate-x-3.5 translate-y-2.5 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
                        {/* Exclamation badge */}
                        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-rose-500 to-red-600 border-2 border-white flex items-center justify-center shadow-md">
                          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <path d="M12 7v6M12 17h.01" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Arched 3D Banner "Need Funds" */}
                    <div className="relative -mt-2.5 w-48 h-10 flex items-center justify-center filter drop-shadow-[0_4px_8px_rgba(29,78,216,0.45)]">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 220 52" fill="none">
                        <path d="M12 36 L0 26 L12 16 L22 22 L22 34 Z" fill="#1e40af" />
                        <path d="M22 22 L35 14 L35 34 L22 34 Z" fill="#172554" />
                        <path d="M208 36 L220 26 L208 16 L198 22 L198 34 Z" fill="#1e40af" />
                        <path d="M198 22 L185 14 L185 34 L198 34 Z" fill="#172554" />
                        <path d="M18 20 C60 6, 160 6, 202 20 C206 36, 196 46, 185 45 C150 38, 70 38, 35 45 C24 46, 14 36, 18 20 Z" fill="url(#fundsRibbonGrad)" stroke="#60a5fa" strokeWidth="2" />
                        <defs>
                          <linearGradient id="fundsRibbonGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="50%" stopColor="#2563eb" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="relative z-10 flex items-center justify-center pb-1 select-none">
                        <span className="font-black text-base sm:text-[17px] tracking-tight text-white drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.6)] font-display">
                          Need <span className="text-[#fde047] drop-shadow-[0_1.5px_3px_rgba(180,83,9,0.8)]">Funds</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coin / Diamond Divider */}
                  <div className="flex items-center justify-center gap-3 my-3">
                    <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-blue-300 to-blue-400 rounded-full" />
                    <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-blue-600 shadow-inner">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 6v12M8 10h8" />
                      </svg>
                    </div>
                    <div className="h-[2px] w-12 bg-gradient-to-l from-transparent via-blue-300 to-blue-400 rounded-full" />
                  </div>

                  {/* Headline & Description */}
                  <h2 className="text-[#152a55] font-black text-xl tracking-tight font-display mb-1">
                    Get More Resources!
                  </h2>
                  <p className="text-[#4b618a] text-xs font-semibold px-2 leading-relaxed mb-4">
                    Claim free rewards or visit the shop to unlock this stage.
                  </p>

                  {/* Have / Need meters with Glassmorphism styling */}
                  <div className="space-y-2 mb-4 text-left">
                    {rows.map(r => {
                      const ok = r.have >= r.need;
                      const pct = Math.min(100, Math.round((r.have / Math.max(1, r.need)) * 100));
                      return (
                        <div
                          key={r.key}
                          className={`flex items-center gap-2.5 rounded-2xl px-3 py-2 border shadow-sm ${
                            ok
                              ? 'bg-emerald-50/90 border-emerald-300/80'
                              : 'bg-rose-50/90 border-rose-300/80'
                          }`}
                        >
                          <img src={r.icon} alt={r.key} className="w-7 h-7 object-contain shrink-0 drop-shadow-sm" />
                          <div className="flex-1 min-w-0">
                            <div className="h-2 rounded-full bg-slate-200 overflow-hidden border border-slate-300/60">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  ok
                                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                    : 'bg-gradient-to-r from-rose-500 to-amber-500'
                                }`}
                                style={{ width: `${Math.max(6, pct)}%` }}
                              />
                            </div>
                            <div className="mt-1 flex items-center justify-between font-mono font-black text-[11px] leading-none">
                              <span className={ok ? 'text-emerald-700' : 'text-rose-700'}>{r.have.toLocaleString()}</span>
                              <span className="text-slate-500">/ {r.need.toLocaleString()}</span>
                            </div>
                          </div>
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                              ok ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                            }`}
                          >
                            {ok ? (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12.5l4.5 4.5L19 7.5" />
                              </svg>
                            ) : (
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
                                <path d="M6 6l12 12M18 6L6 18" />
                              </svg>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-stretch gap-2.5 pt-1">
                    {/* Watch ad: free coins + gems (Glossy 3D Green pill) */}
                    <button
                      aria-label="Watch ad for free coins and gems"
                      title="Watch ad: +350 coins, +15 gems"
                      onClick={() => {
                        sound.click();
                        const targetLvl = insufficientFundsModal.targetLvl;
                        setInsufficientFundsModal(prev => ({ ...prev, isOpen: false }));
                        handleWatchAd('both', 0, 'Quantum Supply Depot Sponsor', {
                          coinAmount: 350,
                          gemAmount: 15,
                          onComplete: () => {
                            setRewardToast(`+350 Coins & +15 Diamonds Claimed! Launching Level ${targetLvl}...`);
                            setTimeout(() => {
                              attemptStartLevel(targetLvl);
                            }, 600);
                          }
                        });
                      }}
                      className="flex-1 rounded-2xl py-2.5 bg-gradient-to-b from-emerald-400 via-emerald-500 to-teal-600 border-2 border-emerald-200/90 shadow-[0_4px_0_#065f46,0_8px_20px_rgba(16,185,129,0.35),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#065f46] transition-all cursor-pointer flex flex-col items-center justify-center gap-1 text-white"
                    >
                      <svg className="w-6 h-6 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2.5" y="5" width="19" height="14" rx="3.5" />
                        <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" />
                      </svg>
                      <span className="flex items-center gap-1 font-mono font-black text-[11px] leading-none drop-shadow-sm">
                        <span>+350</span>
                        <img src="/assets/icon_gold_coin_3d_clean.webp" alt="" className="w-3.5 h-3.5 object-contain" />
                        <span>+15</span>
                        <img src="/assets/icon_gem_3d_clean.webp" alt="" className="w-3.5 h-3.5 object-contain" />
                      </span>
                    </button>

                    {/* Store (Glossy 3D Blue pill) */}
                    <button
                      aria-label="Open store"
                      title="Open store"
                      onClick={() => {
                        sound.click();
                        setInsufficientFundsModal(prev => ({ ...prev, isOpen: false }));
                        navigateTo('rewards');
                      }}
                      className="w-[72px] rounded-2xl bg-gradient-to-b from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] border-2 border-blue-200/90 shadow-[0_4px_0_#1e40af,0_8px_20px_rgba(37,99,235,0.35),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#1e40af] transition-all cursor-pointer flex items-center justify-center text-white"
                    >
                      <svg className="w-7 h-7 text-white stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 4h2.2l2.1 10.2a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.1L20 8H6.2" />
                        <circle cx="9.5" cy="19.2" r="1.4" fill="currentColor" />
                        <circle cx="16.5" cy="19.2" r="1.4" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Google AdMob Demo Rewarded Video Ad Modal */}
          <AdMobRewardedModal
            isOpen={adModalOpen}
            onClose={() => setAdModalOpen(false)}
            onReward={handleClaimAdReward}
            rewardInfo={adReward}
          />
        </div>
      );
    }

    const root = createRoot(document.getElementById('root'));
    root.render(<App />);