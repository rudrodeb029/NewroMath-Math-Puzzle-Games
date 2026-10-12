import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import confetti from 'canvas-confetti';
import './index.css';


    // ==========================================
    // SOUND SYNTHESIZER
    // ==========================================
    class SoundEngine {
      constructor() {
        this.ctx = null;
        this.muted = false;
      }
      init() {
        if (!this.ctx) {
          const AudioCtx = window.AudioContext || window.webkitAudioContext;
          if (AudioCtx) this.ctx = new AudioCtx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
      }
      tap() {
        this.click();
      }
      click() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      }
      correct() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.07);
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.07 + 0.18);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + i * 0.07);
          osc.stop(this.ctx.currentTime + i * 0.07 + 0.18);
        });
      }
      wrong() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(140, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
      }
      whoosh() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450, this.ctx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(1400, this.ctx.currentTime + 0.12);
          filter.frequency.exponentialRampToValueAtTime(380, this.ctx.currentTime + 0.25);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(300, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(620, this.ctx.currentTime + 0.1);
          osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.25);

          gain.gain.setValueAtTime(0.09, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.25);
        } catch (e) {}
      }
      snap() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(760, this.ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(290, this.ctx.currentTime + 0.08);
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.08);
        } catch (e) {}
      }
    }
    const sound = new SoundEngine();

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

    // Warm the image cache in idle time so later pages open instantly (no loader needed)
    const PREFETCH_ASSETS = [
      '/assets/icon_brain_3d.png', '/assets/icon_chest_3d.png', '/assets/icon_gamepad_3d.png',
      '/assets/icon_gem_3d_clean.png', '/assets/icon_gold_coin_3d_clean.png', '/assets/icon_star_3d.png',
      '/assets/icon_stopwatch_3d.png', '/assets/icon_target_3d.png', '/assets/icon_trophy_3d.png',
      '/assets/reward_gift_dial_full.png'
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
    // 3D CYBER-ARCADE FLYING TILE ANIMATOR
    // ==========================================
    function FlyingTileItem({ tile, onFinish, largeFontEnabled }) {
      const elRef = useRef(null);

      useEffect(() => {
        const el = elRef.current;
        if (!el) return;

        const dx = tile.toX - tile.fromX;
        const dy = tile.toY - tile.fromY;

        // Parabolic ballistic arc:
        // Curves sideways slightly towards the center of the board
        const arcX = dx * 0.12 + (dx > 0 ? 16 : -16);
        const arcY = dy * 0.5 + (tile.isReturn ? 28 : -38);
        const midX = tile.fromX + dx * 0.5 + arcX;
        const midY = tile.fromY + arcY;
        const tilt = (dx > 0 ? 12 : -12) * (tile.isReturn ? -1 : 1);
        const targetScaleX = tile.fromW ? tile.toW / tile.fromW : 1;
        const targetScaleY = tile.fromH ? tile.toH / tile.fromH : 1;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const animation = el.animate([
          {
            transform: `translate3d(${tile.fromX}px, ${tile.fromY}px, 0) scale(1, 1) rotate(0deg)`,
            opacity: 1
          },
          {
            offset: 0.45,
            transform: `translate3d(${midX}px, ${midY}px, 0) scale(1.12, 1.12) rotate(${tilt}deg)`,
            opacity: 1
          },
          {
            transform: `translate3d(${tile.toX}px, ${tile.toY}px, 0) scale(${targetScaleX}, ${targetScaleY}) rotate(0deg)`,
            opacity: 1
          }
        ], {
          duration: reducedMotion ? 120 : 300,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          fill: 'forwards'
        });

        animation.onfinish = () => {
          onFinish(tile);
        };

        return () => {
          try { animation.cancel(); } catch (e) {}
        };
      }, []);

      return (
        <div
          ref={elRef}
          className={`scifi-flying-tile ${tile.isReturn ? 'scifi-flying-tile-return' : ''} pointer-events-none absolute select-none flex items-center justify-center font-black ${
            largeFontEnabled ? 'text-[clamp(20px,6.5vw,30px)]' : 'text-[clamp(16px,5vw,24px)]'
          }`}
          style={{
            left: 0,
            top: 0,
            width: `${tile.fromW}px`,
            height: `${tile.fromH}px`,
            boxSizing: 'border-box',
            willChange: 'transform, opacity'
          }}
        >
          <div className="scifi-flying-trail-halo" />
          <span className="relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {tile.number}
          </span>
        </div>
      );
    }

    // ==========================================
    // CROSS-MATH PUZZLE TEMPLATES DATABASE
    // Multiple distinct mathematically verified cross-math layouts
    // ==========================================
        const PUZZLE_TEMPLATES = [
      {
        id: 0,
        cols: 5,
        solvedText: '3 + 5 = 8',
        hintStep: 'Top row: 3 + 5 = 8',
        slots: [{"slot":0,"row":0,"column":0,"answer":3},{"slot":1,"row":0,"column":2,"answer":5},{"slot":2,"row":2,"column":4,"answer":6},{"slot":3,"row":4,"column":2,"answer":7}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '8'],
        ['+', null, '+', null, '+'],
        ['4', '+', '2', '=', { slot: 2 }],
        ['=', null, '=', null, '='],
        ['7', '+', { slot: 3 }, '=', '14']
        ],
        numbers: [3,5,6,7,9,12],
      },
      {
        id: 1,
        cols: 5,
        solvedText: '6 + 9 = 15',
        hintStep: 'Top row: 6 + 9 = 15',
        slots: [{"slot":0,"row":0,"column":0,"answer":6},{"slot":1,"row":0,"column":2,"answer":9},{"slot":2,"row":2,"column":4,"answer":8},{"slot":3,"row":4,"column":2,"answer":12}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '15'],
        ['+', null, '+', null, '+'],
        ['5', '+', '3', '=', { slot: 2 }],
        ['=', null, '=', null, '='],
        ['11', '+', { slot: 3 }, '=', '23']
        ],
        numbers: [6,9,8,12,10,14],
      },
      {
        id: 2,
        cols: 5,
        solvedText: '7 + 8 = 15',
        hintStep: 'Top row: 7 + 8 = 15',
        slots: [{"slot":0,"row":0,"column":0,"answer":7},{"slot":1,"row":2,"column":0,"answer":9},{"slot":2,"row":2,"column":2,"answer":4},{"slot":3,"row":2,"column":4,"answer":13},{"slot":4,"row":4,"column":2,"answer":12}],
        rows: [
        [{ slot: 0 }, '+', '8', '=', '15'],
        ['+', null, '+', null, '+'],
        [{ slot: 1 }, '+', { slot: 2 }, '=', { slot: 3 }],
        ['=', null, '=', null, '='],
        ['16', '+', { slot: 4 }, '=', '28']
        ],
        numbers: [7,9,4,13,12,10],
      },
      {
        id: 3,
        cols: 5,
        solvedText: '9 − 4 = 5',
        hintStep: 'Top row: 9 − 4 = 5',
        slots: [{"slot":0,"row":0,"column":0,"answer":9},{"slot":1,"row":0,"column":2,"answer":4},{"slot":2,"row":2,"column":0,"answer":6},{"slot":3,"row":2,"column":4,"answer":4},{"slot":4,"row":4,"column":0,"answer":15}],
        rows: [
        [{ slot: 0 }, '-', { slot: 1 }, '=', '5'],
        ['+', null, '+', null, '+'],
        [{ slot: 2 }, '-', '2', '=', { slot: 3 }],
        ['=', null, '=', null, '='],
        [{ slot: 4 }, '-', '6', '=', '9']
        ],
        numbers: [9,4,6,15,8,11],
      },
      {
        id: 4,
        cols: 5,
        solvedText: '5 + 8 = 13',
        hintStep: 'Top row: 5 + 8 = 13',
        slots: [{"slot":0,"row":0,"column":0,"answer":5},{"slot":1,"row":0,"column":2,"answer":8},{"slot":2,"row":2,"column":0,"answer":6},{"slot":3,"row":2,"column":4,"answer":7},{"slot":4,"row":4,"column":2,"answer":9}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '13'],
        ['+', null, null, null, '+'],
        [{ slot: 2 }, null, null, null, { slot: 3 }],
        ['=', null, null, null, '='],
        ['11', '+', { slot: 4 }, '=', '20']
        ],
        numbers: [5,8,6,7,9,14],
      },
      {
        id: 5,
        cols: 5,
        solvedText: '12 + 6 = 18',
        hintStep: 'Top row: 12 + 6 = 18',
        slots: [{"slot":0,"row":0,"column":0,"answer":12},{"slot":1,"row":0,"column":2,"answer":6},{"slot":2,"row":2,"column":0,"answer":8},{"slot":3,"row":4,"column":2,"answer":11},{"slot":4,"row":2,"column":4,"answer":13}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '18'],
        ['+', null, '+', null, '+'],
        [{ slot: 2 }, '+', '5', '=', { slot: 4 }],
        ['=', null, '=', null, '='],
        ['20', '+', { slot: 3 }, '=', '31']
        ],
        numbers: [12,6,8,11,13,17],
      },
      {
        id: 6,
        cols: 5,
        solvedText: '8 + 7 = 15',
        hintStep: 'Top row: 8 + 7 = 15',
        slots: [{"slot":0,"row":0,"column":0,"answer":8},{"slot":1,"row":0,"column":2,"answer":7},{"slot":2,"row":2,"column":0,"answer":5},{"slot":3,"row":2,"column":4,"answer":9},{"slot":4,"row":4,"column":2,"answer":11}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '15'],
        ['+', null, null, null, '+'],
        [{ slot: 2 }, null, null, null, { slot: 3 }],
        ['=', null, null, null, '='],
        ['13', '+', { slot: 4 }, '=', '24']
        ],
        numbers: [8,7,5,9,11,16],
      },
      {
        id: 7,
        cols: 5,
        solvedText: '14 + 11 = 25',
        hintStep: 'Top row: 14 + 11 = 25',
        slots: [{"slot":0,"row":0,"column":0,"answer":14},{"slot":1,"row":0,"column":2,"answer":11},{"slot":2,"row":2,"column":2,"answer":7},{"slot":3,"row":4,"column":0,"answer":23},{"slot":4,"row":2,"column":4,"answer":16}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '25'],
        ['+', null, '+', null, '+'],
        ['9', '+', { slot: 2 }, '=', { slot: 4 }],
        ['=', null, '=', null, '='],
        [{ slot: 3 }, '+', '18', '=', '41']
        ],
        numbers: [14,11,7,23,16,20],
      },
      {
        id: 8,
        cols: 5,
        solvedText: '15 + 12 = 27',
        hintStep: 'Top row: 15 + 12 = 27',
        slots: [{"slot":0,"row":0,"column":0,"answer":15},{"slot":1,"row":0,"column":2,"answer":12},{"slot":2,"row":2,"column":0,"answer":10},{"slot":3,"row":2,"column":2,"answer":8},{"slot":4,"row":4,"column":2,"answer":20}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '27'],
        ['+', null, '+', null, '+'],
        [{ slot: 2 }, '+', { slot: 3 }, '=', '18'],
        ['=', null, '=', null, '='],
        ['25', '+', { slot: 4 }, '=', '45']
        ],
        numbers: [15,12,10,8,20,25],
      },
      {
        id: 9,
        cols: 5,
        solvedText: '11 + 14 = 25',
        hintStep: 'Top row: 11 + 14 = 25',
        slots: [{"slot":0,"row":0,"column":0,"answer":11},{"slot":1,"row":0,"column":2,"answer":14},{"slot":2,"row":2,"column":0,"answer":9},{"slot":3,"row":2,"column":4,"answer":8},{"slot":4,"row":4,"column":2,"answer":13}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '25'],
        ['+', null, null, null, '+'],
        [{ slot: 2 }, null, null, null, { slot: 3 }],
        ['=', null, null, null, '='],
        ['20', '+', { slot: 4 }, '=', '33']
        ],
        numbers: [11,14,9,8,13,19],
      },
      {
        id: 10,
        cols: 5,
        solvedText: '18 − 7 = 11',
        hintStep: 'Top row: 18 − 7 = 11',
        slots: [{"slot":0,"row":0,"column":0,"answer":18},{"slot":1,"row":0,"column":2,"answer":7},{"slot":2,"row":2,"column":0,"answer":12},{"slot":3,"row":2,"column":4,"answer":7},{"slot":4,"row":4,"column":2,"answer":12}],
        rows: [
        [{ slot: 0 }, '-', { slot: 1 }, '=', '11'],
        ['+', null, '+', null, '+'],
        [{ slot: 2 }, '-', '5', '=', { slot: 3 }],
        ['=', null, '=', null, '='],
        ['30', '-', { slot: 4 }, '=', '18']
        ],
        numbers: [18,7,12,15,21,30],
      },
      {
        id: 11,
        cols: 5,
        solvedText: '16 + 13 = 29',
        hintStep: 'Top row: 16 + 13 = 29',
        slots: [{"slot":0,"row":0,"column":0,"answer":16},{"slot":1,"row":0,"column":2,"answer":13},{"slot":2,"row":2,"column":2,"answer":9},{"slot":3,"row":4,"column":0,"answer":27},{"slot":4,"row":4,"column":4,"answer":49}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '29'],
        ['+', null, '+', null, '+'],
        ['11', '+', { slot: 2 }, '=', '20'],
        ['=', null, '=', null, '='],
        [{ slot: 3 }, '+', '22', '=', { slot: 4 }]
        ],
        numbers: [16,13,9,27,49,35],
      },
      {
        id: 12,
        cols: 5,
        solvedText: '14 + 12 = 26',
        hintStep: 'Top row: 14 + 12 = 26',
        slots: [{"slot":0,"row":0,"column":0,"answer":14},{"slot":1,"row":0,"column":2,"answer":12},{"slot":2,"row":2,"column":0,"answer":10},{"slot":3,"row":2,"column":4,"answer":13},{"slot":4,"row":4,"column":2,"answer":15}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '26'],
        ['+', null, null, null, '+'],
        [{ slot: 2 }, null, null, null, { slot: 3 }],
        ['=', null, null, null, '='],
        ['24', '+', { slot: 4 }, '=', '39']
        ],
        numbers: [14,12,10,13,15,22],
      },
      {
        id: 13,
        cols: 5,
        solvedText: '20 + 15 = 35',
        hintStep: 'Top row: 20 + 15 = 35',
        slots: [{"slot":0,"row":0,"column":0,"answer":20},{"slot":1,"row":0,"column":2,"answer":15},{"slot":2,"row":2,"column":0,"answer":14},{"slot":3,"row":2,"column":4,"answer":24},{"slot":4,"row":4,"column":2,"answer":25}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '35'],
        ['+', null, '+', null, '+'],
        [{ slot: 2 }, '+', '10', '=', { slot: 3 }],
        ['=', null, '=', null, '='],
        ['34', '+', { slot: 4 }, '=', '59']
        ],
        numbers: [20,15,14,24,25,31],
      },
      {
        id: 14,
        cols: 5,
        solvedText: '22 + 17 = 39',
        hintStep: 'Top row: 22 + 17 = 39',
        slots: [{"slot":0,"row":0,"column":0,"answer":22},{"slot":1,"row":0,"column":2,"answer":17},{"slot":2,"row":2,"column":2,"answer":11},{"slot":3,"row":4,"column":0,"answer":38},{"slot":4,"row":2,"column":4,"answer":27}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '39'],
        ['+', null, '+', null, '+'],
        ['16', '+', { slot: 2 }, '=', { slot: 4 }],
        ['=', null, '=', null, '='],
        [{ slot: 3 }, '+', '28', '=', '66']
        ],
        numbers: [22,17,11,38,27,45],
      },
      {
        id: 15,
        cols: 5,
        solvedText: '18 + 15 = 33',
        hintStep: 'Top row: 18 + 15 = 33',
        slots: [{"slot":0,"row":0,"column":0,"answer":18},{"slot":1,"row":0,"column":2,"answer":15},{"slot":2,"row":2,"column":0,"answer":12},{"slot":3,"row":2,"column":4,"answer":14},{"slot":4,"row":4,"column":2,"answer":17}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '33'],
        ['+', null, null, null, '+'],
        [{ slot: 2 }, null, null, null, { slot: 3 }],
        ['=', null, null, null, '='],
        ['30', '+', { slot: 4 }, '=', '47']
        ],
        numbers: [18,15,12,14,17,26],
      },
      {
        id: 16,
        cols: 5,
        solvedText: '25 + 18 = 43',
        hintStep: 'Top row: 25 + 18 = 43',
        slots: [{"slot":0,"row":0,"column":0,"answer":25},{"slot":1,"row":0,"column":2,"answer":18},{"slot":2,"row":2,"column":0,"answer":19},{"slot":3,"row":2,"column":4,"answer":33},{"slot":4,"row":4,"column":2,"answer":32}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '43'],
        ['+', null, '+', null, '+'],
        [{ slot: 2 }, '+', '14', '=', { slot: 3 }],
        ['=', null, '=', null, '='],
        ['44', '+', { slot: 4 }, '=', '76']
        ],
        numbers: [25,18,19,33,32,40],
      },
      {
        id: 17,
        cols: 5,
        solvedText: '28 + 21 = 49',
        hintStep: 'Top row: 28 + 21 = 49',
        slots: [{"slot":0,"row":0,"column":0,"answer":28},{"slot":1,"row":0,"column":2,"answer":21},{"slot":2,"row":2,"column":2,"answer":16},{"slot":3,"row":4,"column":0,"answer":50},{"slot":4,"row":2,"column":4,"answer":38}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '49'],
        ['+', null, '+', null, '+'],
        ['22', '+', { slot: 2 }, '=', { slot: 4 }],
        ['=', null, '=', null, '='],
        [{ slot: 3 }, '+', '37', '=', '87']
        ],
        numbers: [28,21,16,50,38,55],
      },
      {
        id: 18,
        cols: 5,
        solvedText: '24 + 19 = 43',
        hintStep: 'Top row: 24 + 19 = 43',
        slots: [{"slot":0,"row":0,"column":0,"answer":24},{"slot":1,"row":0,"column":2,"answer":19},{"slot":2,"row":2,"column":0,"answer":15},{"slot":3,"row":2,"column":4,"answer":19},{"slot":4,"row":4,"column":2,"answer":23}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '43'],
        ['+', null, null, null, '+'],
        [{ slot: 2 }, null, null, null, { slot: 3 }],
        ['=', null, null, null, '='],
        ['39', '+', { slot: 4 }, '=', '62']
        ],
        numbers: [24,19,15,23,31,44],
      },
      {
        id: 19,
        cols: 5,
        solvedText: '32 + 24 = 56',
        hintStep: 'Top row: 32 + 24 = 56',
        slots: [{"slot":0,"row":0,"column":0,"answer":32},{"slot":1,"row":0,"column":2,"answer":24},{"slot":2,"row":2,"column":0,"answer":25},{"slot":3,"row":2,"column":4,"answer":44},{"slot":4,"row":4,"column":2,"answer":43}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '56'],
        ['+', null, '+', null, '+'],
        [{ slot: 2 }, '+', '19', '=', { slot: 3 }],
        ['=', null, '=', null, '='],
        ['57', '+', { slot: 4 }, '=', '100']
        ],
        numbers: [32,24,25,44,43,60],
      },
      {
        id: 20,
        cols: 5,
        solvedText: '35 + 27 = 62',
        hintStep: 'Top row: 35 + 27 = 62',
        slots: [{"slot":0,"row":0,"column":0,"answer":35},{"slot":1,"row":0,"column":2,"answer":27},{"slot":2,"row":2,"column":2,"answer":21},{"slot":3,"row":4,"column":0,"answer":63},{"slot":4,"row":4,"column":4,"answer":111}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '62'],
        ['+', null, '+', null, '+'],
        ['28', '+', { slot: 2 }, '=', '49'],
        ['=', null, '=', null, '='],
        [{ slot: 3 }, '+', '48', '=', { slot: 4 }]
        ],
        numbers: [35,27,21,63,111,75],
      },
      {
        id: 21,
        cols: 5,
        solvedText: '30 + 26 = 56',
        hintStep: 'Top row: 30 + 26 = 56',
        slots: [{"slot":0,"row":0,"column":0,"answer":30},{"slot":1,"row":0,"column":2,"answer":26},{"slot":2,"row":2,"column":0,"answer":20},{"slot":3,"row":2,"column":4,"answer":22},{"slot":4,"row":4,"column":2,"answer":28}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '56'],
        ['+', null, null, null, '+'],
        [{ slot: 2 }, null, null, null, { slot: 3 }],
        ['=', null, null, null, '='],
        ['50', '+', { slot: 4 }, '=', '78']
        ],
        numbers: [30,26,20,22,28,52],
      },
      {
        id: 22,
        cols: 5,
        solvedText: '40 + 31 = 71',
        hintStep: 'Top row: 40 + 31 = 71',
        slots: [{"slot":0,"row":0,"column":0,"answer":40},{"slot":1,"row":0,"column":2,"answer":31},{"slot":2,"row":2,"column":0,"answer":32},{"slot":3,"row":2,"column":4,"answer":56},{"slot":4,"row":4,"column":2,"answer":55}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '71'],
        ['+', null, '+', null, '+'],
        [{ slot: 2 }, '+', '24', '=', { slot: 3 }],
        ['=', null, '=', null, '='],
        ['72', '+', { slot: 4 }, '=', '127']
        ],
        numbers: [40,31,32,56,55,78],
      },
      {
        id: 23,
        cols: 5,
        solvedText: '45 + 35 = 80',
        hintStep: 'Top row: 45 + 35 = 80',
        slots: [{"slot":0,"row":0,"column":0,"answer":45},{"slot":1,"row":0,"column":2,"answer":35},{"slot":2,"row":2,"column":2,"answer":28},{"slot":3,"row":4,"column":0,"answer":81},{"slot":4,"row":4,"column":2,"answer":63}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '80'],
        ['+', null, '+', null, '+'],
        ['36', '+', { slot: 2 }, '=', '64'],
        ['=', null, '=', null, '='],
        [{ slot: 3 }, '+', { slot: 4 }, '=', '144']
        ],
        numbers: [45,35,28,81,63,99],
      },
      {
        id: 24,
        cols: 5,
        solvedText: '50 + 42 = 92',
        hintStep: 'Top row: 50 + 42 = 92',
        slots: [{"slot":0,"row":0,"column":0,"answer":50},{"slot":1,"row":0,"column":2,"answer":42},{"slot":2,"row":2,"column":0,"answer":40},{"slot":3,"row":2,"column":4,"answer":73},{"slot":4,"row":4,"column":0,"answer":90},{"slot":5,"row":4,"column":2,"answer":75}],
        rows: [
        [{ slot: 0 }, '+', { slot: 1 }, '=', '92'],
        ['+', null, '+', null, '+'],
        [{ slot: 2 }, '+', '33', '=', { slot: 3 }],
        ['=', null, '=', null, '='],
        [{ slot: 4 }, '+', { slot: 5 }, '=', '165']
        ],
        numbers: [50,42,40,73,90,75],
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
      { num: 5, title: 'Logic Step', diff: 'Easy', range: '201 - 250', xp: 30, coins: 18, tag: 'GATE', tier: 'easy', cost: getLevelEntryCost(5) },
      { num: 6, title: 'Sub-Zero Drift', diff: 'Easy', range: '251 - 300', xp: 30, coins: 20, tag: 'DRIFT', tier: 'easy', cost: getLevelEntryCost(6) },
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

    // ==========================================
    // PROCEDURAL CROSS-MATH GENERATOR
    // Generates 100% verified, unique, attractive 5x5 puzzles with new numbers
    // ==========================================
    function generateCrossMathPuzzle(levelNum, seed = 0) {
      if (seed === 0) {
        const idx = (Math.max(1, levelNum) - 1) % PUZZLE_TEMPLATES.length;
        return PUZZLE_TEMPLATES[idx];
      }

      let s = Math.abs((levelNum * 7919 + seed * 9973 + 12345)) % 233280;
      const rnd = (min, max) => {
        s = (s * 9301 + 49297) % 233280;
        const r = s / 233280;
        return Math.floor(min + r * (max - min + 1));
      };

      const isHard = levelNum >= 18;
      const isMedium = levelNum >= 9 && levelNum < 18;
      const useSubtraction = (levelNum % 4 === 0) || (seed % 3 === 1);

      const minVal = isHard ? 12 : isMedium ? 6 : 2;
      const maxVal = isHard ? 30 : isMedium ? 16 : 9;

      let X, Y, A, B, Z, C, D, E, F, opR = '+';

      for (let attempt = 0; attempt < 250; attempt++) {
        if (useSubtraction) {
          opR = '-';
          Y = rnd(minVal, maxVal);
          Z = rnd(minVal, maxVal);
          X = Y + Z;

          B = rnd(minVal, maxVal);
          C = rnd(minVal, maxVal);
          A = B + C;

          D = X + A;
          E = Y + B;
          F = Z + C;
        } else {
          opR = '+';
          X = rnd(minVal, maxVal);
          Y = rnd(minVal, maxVal);
          A = rnd(minVal, maxVal);
          B = rnd(minVal, maxVal);

          Z = X + Y;
          C = A + B;
          D = X + A;
          E = Y + B;
          F = Z + C;
        }

        const allNums = [X, Y, Z, A, B, C, D, E, F];
        if (new Set(allNums).size === 9) {
          const valMap = {
            '0,0': X, '0,2': Y, '0,4': Z,
            '2,0': A, '2,2': B, '2,4': C,
            '4,0': D, '4,2': E, '4,4': F
          };

          const blankCandidates = ['0,0', '0,2', '2,0', '2,2', '2,4', '4,0', '4,2'];
          blankCandidates.sort(() => (rnd(0, 10) > 5 ? 1 : -1));
          const blankCount = isHard ? 5 : 4;
          const blankKeys = blankCandidates.slice(0, blankCount);

          const slots = [];
          const slotIndices = {};
          blankKeys.forEach((key, idx) => {
            const [r, c] = key.split(',').map(Number);
            slots.push({ slot: idx, row: r, column: c, answer: valMap[key] });
            slotIndices[key] = idx;
          });

          const getCell = (r, c) => {
            const key = `${r},${c}`;
            if (key in slotIndices) return { slot: slotIndices[key] };
            return String(valMap[key]);
          };

          const rows = [
            [getCell(0,0), opR, getCell(0,2), '=', getCell(0,4)],
            ['+', null, '+', null, '+'],
            [getCell(2,0), opR, getCell(2,2), '=', getCell(2,4)],
            ['=', null, '=', null, '='],
            [getCell(4,0), opR, getCell(4,2), '=', getCell(4,4)],
          ];

          const answers = slots.map(sl => sl.answer);
          const distractors = [rnd(minVal, maxVal + 6), rnd(minVal, maxVal + 14)];
          const numbers = [...new Set([...answers, ...distractors])];
          while (numbers.length < 6) {
            numbers.push(rnd(minVal, maxVal + 20));
          }
          numbers.sort(() => (rnd(0, 10) > 5 ? 1 : -1));

          return {
            cols: 5,
            solvedText: `${X} ${opR} ${Y} = ${Z}`,
            hintStep: `Top row: ${X} ${opR} ${Y} = ${Z}`,
            slots,
            rows,
            numbers: numbers.slice(0, 6),
          };
        }
      }

      const idx = (Math.max(1, levelNum) - 1) % PUZZLE_TEMPLATES.length;
      return PUZZLE_TEMPLATES[idx];
    }

    // Fast memoization cache for procedural cross-math generation
    const puzzleCache = new Map();
    function getMemoizedPuzzle(levelNum, seed = 0) {
      const key = `${levelNum}_${seed}`;
      if (puzzleCache.has(key)) return puzzleCache.get(key);
      const result = generateCrossMathPuzzle(levelNum, seed);
      if (puzzleCache.size > 200) {
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
        let seed = st * 101;
        let guard = 0;
        while (guard < 40) {
          const text = getMemoizedPuzzle(levelNum, seed).solvedText;
          if (!seen.has(text)) { seen.add(text); break; }
          seed += 1;
          guard += 1;
        }
        seeds.push(seed);
      }
      levelStageSeedsCache.set(levelNum, seeds);
      return seeds;
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

      // Sliding-tile loader: appears only when a page takes noticeably long to load
      const isPageLoading = useSmartPageLoader(currentScreen);
      useEffect(() => { prefetchAssetsWhenIdle(); }, []);

      // Gameplay State & Level Progression (Loaded from URL or LocalStorage)
      const queryParamLevel = (typeof window !== 'undefined' && parseInt(new URLSearchParams(window.location.search).get('level') || '', 10)) || null;

      const [unlockedLevelMax, setUnlockedLevelMax] = useState(() => {
        if (queryParamLevel && !isNaN(queryParamLevel)) return Math.max(1, queryParamLevel);
        try {
          const saved = localStorage.getItem('newromath_unlocked_level');
          return saved ? Math.max(1, parseInt(saved, 10)) : 3;
        } catch (e) {
          return 3;
        }
      });

      // Player Global State
      const [playerLevel, setPlayerLevel] = useState(() => {
        if (queryParamLevel && !isNaN(queryParamLevel)) return Math.max(1, queryParamLevel);
        try {
          const saved = localStorage.getItem('newromath_player_level');
          if (saved) return Math.max(1, parseInt(saved, 10));
          const savedUnlocked = localStorage.getItem('newromath_unlocked_level');
          return savedUnlocked ? Math.max(1, parseInt(savedUnlocked, 10)) : 3;
        } catch (e) {
          return 3;
        }
      });
      const [playerXp, setPlayerXp] = useState(() => {
        try {
          const saved = localStorage.getItem('newromath_player_xp');
          return saved ? Math.max(0, parseInt(saved, 10)) : 112;
        } catch (e) {
          return 112;
        }
      });
      const [xpNeeded, setXpNeeded] = useState(300);
      const [coins, setCoins] = useState(() => {
        try {
          const saved = localStorage.getItem('newromath_coins');
          return saved ? Math.max(0, parseInt(saved, 10)) : 2450;
        } catch (e) {
          return 2450;
        }
      });
      const [gems, setGems] = useState(() => {
        try {
          const saved = localStorage.getItem('newromath_gems');
          return saved ? Math.max(0, parseInt(saved, 10)) : 25;
        } catch (e) {
          return 25;
        }
      });
      const [selectedLevelNum, setSelectedLevelNum] = useState(() => {
        if (queryParamLevel && !isNaN(queryParamLevel)) return Math.max(1, queryParamLevel);
        try {
          const saved = localStorage.getItem('newromath_selected_level');
          if (saved) return Math.max(1, parseInt(saved, 10));
          const savedUnlocked = localStorage.getItem('newromath_unlocked_level');
          return savedUnlocked ? Math.max(1, parseInt(savedUnlocked, 10)) : 3;
        } catch (e) {
          return 3;
        }
      });
      const [streakDays, setStreakDays] = useState(5);
      const [lives, setLives] = useState(3);
      const [selectedCategory, setSelectedCategory] = useState('all');

      // Sync state variables to LocalStorage automatically
      useEffect(() => {
        try { localStorage.setItem('newromath_unlocked_level', unlockedLevelMax.toString()); } catch (e) {}
      }, [unlockedLevelMax]);

      useEffect(() => {
        try { localStorage.setItem('newromath_player_level', playerLevel.toString()); } catch (e) {}
      }, [playerLevel]);

      useEffect(() => {
        try { localStorage.setItem('newromath_player_xp', playerXp.toString()); } catch (e) {}
      }, [playerXp]);

      useEffect(() => {
        try { localStorage.setItem('newromath_coins', coins.toString()); } catch (e) {}
      }, [coins]);

      useEffect(() => {
        try { localStorage.setItem('newromath_gems', gems.toString()); } catch (e) {}
      }, [gems]);

      useEffect(() => {
        try { localStorage.setItem('newromath_selected_level', selectedLevelNum.toString()); } catch (e) {}
      }, [selectedLevelNum]);

      // Active player level dynamically reflects the highest attained level
      const activePlayerLevel = Math.max(unlockedLevelMax, playerLevel, selectedLevelNum);

      // Live leaderboard score & rank (reacts to level, XP and coin balance)
      const LEADERBOARD_BOT_SCORES = [2490680, 2385400, 2290150, 2250680, 2187730, 2128024, 2097730, 2053538];
      const playerScore = 1200000 + activePlayerLevel * 28000 + playerXp * 300 + coins * 35;
      const playerRank = 1 + LEADERBOARD_BOT_SCORES.filter(s => s > playerScore).length;

      // Rewards & Ad State
      const [adModalOpen, setAdModalOpen] = useState(false);
      const [adReward, setAdReward] = useState({ type: 'coins', amount: 250, title: 'Math Speed Boost Sponsor Ad', coinAmount: 250, gemAmount: 15, onComplete: null });
      const [adCountdown, setAdCountdown] = useState(3);
      const [dailyGiftClaimed, setDailyGiftClaimed] = useState(false);
      const [rewardToast, setRewardToast] = useState(null);

      // Level Entry Fee & Economy Modal States
      const [insufficientFundsModal, setInsufficientFundsModal] = useState({
        isOpen: false,
        targetLvl: 1,
        cost: { coins: 100, gems: 10 },
        missingCoins: 0,
        missingGems: 0
      });
      const [isTimeOver, setIsTimeOver] = useState(false);

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

      // Global Ad Watch & Reward System
      const handleWatchAd = (type, amount, title, extra = {}) => {
        sound.click();
        setAdReward({
          type,
          amount,
          title: title || 'Quantum Sponsor Booster',
          coinAmount: extra.coinAmount || (type === 'coins' ? amount : 350),
          gemAmount: extra.gemAmount || (type === 'gems' ? amount : 15),
          onComplete: extra.onComplete || null
        });
        setAdCountdown(3);
        setAdModalOpen(true);
      };

      const handleClaimAdReward = () => {
        sound.correct();
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
        if (adReward.type === 'coins') {
          const val = adReward.amount || adReward.coinAmount || 250;
          setCoins(c => {
            const next = c + val;
            try { localStorage.setItem('newromath_coins', next.toString()); } catch (e) {}
            return next;
          });
          setRewardToast(`🎉 Ad Reward: +${val.toLocaleString()} Coins Collected!`);
        } else if (adReward.type === 'gems') {
          const val = adReward.amount || adReward.gemAmount || 15;
          setGems(g => {
            const next = g + val;
            try { localStorage.setItem('newromath_gems', next.toString()); } catch (e) {}
            return next;
          });
          setRewardToast(`💎 Ad Reward: +${val.toLocaleString()} Gems Collected!`);
        } else if (adReward.type === 'time') {
          const extraSec = adReward.amount || 30;
          setGameTimer(t => t + extraSec);
          setIsTimeOver(false);
          setRewardToast(`⏱️ Extra Time: +${extraSec}s Added! Mission Resumed!`);
        } else {
          // 'both' / supply drop
          const cAmt = adReward.coinAmount || 350;
          const gAmt = adReward.gemAmount || 15;
          setCoins(c => {
            const next = c + cAmt;
            try { localStorage.setItem('newromath_coins', next.toString()); } catch (e) {}
            return next;
          });
          setGems(g => {
            const next = g + gAmt;
            try { localStorage.setItem('newromath_gems', next.toString()); } catch (e) {}
            return next;
          });
          setRewardToast(`⚡ Supply Drop: +${cAmt} 🪙 & +${gAmt} 💎 Added!`);
        }
        setAdModalOpen(false);
        if (adReward.onComplete) {
          adReward.onComplete();
        }
      };

      const [levelFilterTab, setLevelFilterTab] = useState('all'); // 'all' | 'easy' | 'medium' | 'hard'
      const [profileMode, setProfileMode] = useState('Classic');
      const [profileDifficulty, setProfileDifficulty] = useState('Easy');
      const [playerName, setPlayerName] = useState(() => {
        try {
          return localStorage.getItem('newromath_player_name') || 'Guest-JFNZLZ';
        } catch (e) {
          return 'Guest-JFNZLZ';
        }
      });
      const [isEditingName, setIsEditingName] = useState(false);
      const [nameInput, setNameInput] = useState(() => {
        try {
          return localStorage.getItem('newromath_player_name') || 'Guest-JFNZLZ';
        } catch (e) {
          return 'Guest-JFNZLZ';
        }
      });
      const gameTimerRef = useRef(45);
      const timerContainerRef = useRef(null);
      const timerDisplayRef = useRef(null);
      const gameTimer = gameTimerRef.current;
      const [puzzleAnswers, setPuzzleAnswers] = useState({});
      const puzzleAnswersRef = useRef({});
      const [puzzleHistory, setPuzzleHistory] = useState([]);
      const [selectedPuzzleSlot, setSelectedPuzzleSlot] = useState(null);

      // Flying number animation state
      const [flyingTiles, setFlyingTiles] = useState([]);
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

      // Daily Challenge State
      const [activeDailyDay, setActiveDailyDay] = useState(9);

      // Leaderboard Tab
      const [leaderboardTab, setLeaderboardTab] = useState('global');

      // History Tab
      const [historyTab, setHistoryTab] = useState('history');

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
            try { localStorage.setItem('newromath_coins', nextCoins.toString()); } catch (e) {}
            return nextCoins;
          });
          setGems(g => {
            const nextGems = g - cost.gems;
            try { localStorage.setItem('newromath_gems', nextGems.toString()); } catch (e) {}
            return nextGems;
          });
          sound.click();
          setRewardToast(`⚡ Mission L${targetLvl} Entry: -${cost.coins} Coins & -${cost.gems} Gems`);
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

      // Move on to the next puzzle inside the current level (no extra entry fee)
      const continueToNextStage = () => {
        sound.click();
        resetPuzzle(selectedLevelNum);
        navigateTo('game');
      };

      // Retry the same puzzle after a wrong answer (progress in the level is kept)
      const retryCurrentStage = () => {
        sound.click();
        resetPuzzle(selectedLevelNum);
        navigateTo('game');
      };

      // Expose for testing and inspection
      window.__triggerTimeout = () => {
        setIsTimeOver(true);
        sound.wrong();
      };
      window.__resetTimeout = restartLevelAfterTimeout;
      window.__solvePuzzle = () => {
        const solved = {};
        puzzleSlots.forEach(({ slot, answer }) => { solved[slot] = answer; });
        puzzleAnswersRef.current = solved;
        setPuzzleAnswers(solved);
        submitPuzzle(solved);
      };
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
        return getMemoizedPuzzle(selectedLevelNum, puzzleSeed);
      }, [selectedLevelNum, puzzleSeed, currentScreen]);

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

      const getLevelTimer = (lvl) => {
        if (lvl <= 5) return 50;
        if (lvl <= 10) return 45;
        if (lvl <= 15) return 40;
        if (lvl <= 20) return 35;
        return 30;
      };

      const resetPuzzle = (targetLvl = selectedLevelNum) => {
        puzzleAnswersRef.current = {};
        setPuzzleAnswers({});
        setPuzzleHistory([]);
        setSelectedPuzzleSlot(null);
        pendingNumbersRef.current.clear();
        pendingSlotsRef.current.clear();
        setPendingNumbers(new Set());
        setPendingSlots(new Set());
        setFlyingTiles([]);
        setIsTimeOver(false);
        setGameTimer(getLevelTimer(targetLvl));
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
        setFlyingTiles([]);
        setIsTimeOver(false);
        setGameTimer(getLevelTimer(selectedLevelNum));
        setTimeout(() => setIsSpinningReroll(false), 500);
      };

      const startNewPuzzle = (targetLvl = selectedLevelNum) => {
        setSelectedLevelNum(targetLvl);
        setPlayerLevel(prev => Math.max(prev, targetLvl));
        try { localStorage.setItem('newromath_selected_level', targetLvl.toString()); } catch (e) {}
        try { localStorage.setItem('newromath_player_level', Math.max(playerLevel, targetLvl).toString()); } catch (e) {}
        setPuzzleSeed(0);
        setStageNum(1);
        const lvlObj = ALL_LEVELS.find(l => l.num === targetLvl) || ALL_LEVELS[0];
        setProfileDifficulty(lvlObj.diff);
        setIsTimeOver(false);
        resetPuzzle(targetLvl);
        navigateTo('game');
      };

      const submitPuzzle = (answers) => {
        const correct = puzzleSlots.every(({ slot, answer }) => answers[slot] === answer);
        sound.click();
        if (correct) {
          sound.correct();
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
          const lvlObj = ALL_LEVELS.find(l => l.num === selectedLevelNum) || { xp: 15, coins: 10 };
          const cost = getLevelEntryCost(selectedLevelNum);
          const total = getStageCount(selectedLevelNum);
          const isFinalStage = stageNum >= total;
          const levelXp = lvlObj.xp || 20;

          // Reward for this puzzle: small per-puzzle payout, full payout on the level's last puzzle
          const earnedXp = isFinalStage ? levelXp : Math.max(1, Math.round(levelXp / total));
          const earnedCoins = isFinalStage ? Math.round(cost.coins * 1.8) : Math.max(5, Math.round(cost.coins * 0.06));
          const earnedGems = isFinalStage ? Math.round(cost.gems * 1.3) + 2 : 0;

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

          // 1. Earn Coins & Diamond Coins
          setCoins(c => {
            const nextCoins = c + earnedCoins;
            try { localStorage.setItem('newromath_coins', nextCoins.toString()); } catch (e) {}
            return nextCoins;
          });
          if (earnedGems > 0) {
            setGems(g => {
              const nextGems = g + earnedGems;
              try { localStorage.setItem('newromath_gems', nextGems.toString()); } catch (e) {}
              return nextGems;
            });
          }

          // 2. Level Progression only when the final puzzle of the level is solved
          const nextLvl = isFinalStage ? Math.min(25, selectedLevelNum + 1) : selectedLevelNum;

          if (isFinalStage) {
            // 3. Unlock Next Mission
            setUnlockedLevelMax(prev => {
              const nextVal = Math.max(prev, nextLvl);
              try { localStorage.setItem('newromath_unlocked_level', nextVal.toString()); } catch (e) {}
              return nextVal;
            });

            // 4. Update Player Campaign Level
            setPlayerLevel(prev => {
              const nextVal = Math.max(prev, nextLvl);
              try { localStorage.setItem('newromath_player_level', nextVal.toString()); } catch (e) {}
              return nextVal;
            });

            // 5. Select Next Mission
            setSelectedLevelNum(nextLvl);
            try { localStorage.setItem('newromath_selected_level', nextLvl.toString()); } catch (e) {}
          } else {
            // Queue up the next puzzle of this level (different puzzle each stage)
            setStageNum(stageNum + 1);
            setPuzzleSeed(stageSeeds[stageNum] !== undefined ? stageSeeds[stageNum] : stageNum * 101);
          }

          // 6. Update Player XP & Level-up wrap
          setPlayerXp(prevXp => {
            const totalXp = prevXp + earnedXp;
            if (totalXp >= 300) {
              setPlayerLevel(lvl => {
                const upgradedLvl = Math.max(lvl + 1, nextLvl);
                try { localStorage.setItem('newromath_player_level', upgradedLvl.toString()); } catch (e) {}
                return upgradedLvl;
              });
              const remainingXp = totalXp % 300;
              try { localStorage.setItem('newromath_player_xp', remainingXp.toString()); } catch (e) {}
              return remainingXp;
            }
            try { localStorage.setItem('newromath_player_xp', totalXp.toString()); } catch (e) {}
            return totalXp;
          });

          setTimeout(() => navigateTo('correct', true), 300);
        } else {
          sound.wrong();
          setLives(l => Math.max(0, l - 1));
          setTimeout(() => navigateTo('wrong', true), 300);
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

          setFlyingTiles(prev => [...prev, newFlyTile]);
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

          setFlyingTiles(prev => [...prev, returnTile]);
        }
      };

      const finalizeReturn = (number) => {
        sound.snap();
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
        { id: 'categories', name: '4. Categories', icon: '📑' },
        { id: 'levels', name: '5. Level Selection', icon: '🎯' },
        { id: 'game', name: '6. Puzzle Gameplay', icon: '🎮' },
        { id: 'hint', name: '7. Hint Bottom Sheet', icon: '💡' },
        { id: 'correct', name: '8. Correct Result', icon: '✅' },
        { id: 'wrong', name: '9. Wrong Result', icon: '❌' },
        { id: 'daily', name: '10. Daily Challenge', icon: '📅' },
        { id: 'stats', name: '11. Statistics', icon: '📊' },
        { id: 'achievements', name: '12. Achievements', icon: '🏆' },
        { id: 'leaderboard', name: '13. Leaderboard', icon: '🏅' },
        { id: 'history', name: '14. Puzzle History', icon: '📜' },
        { id: 'profile', name: '15. Profile', icon: '👤' },
        { id: 'settings', name: '16. Settings', icon: '⚙️' },
        { id: 'help', name: '17. Help & Support', icon: '❓' },
        { id: 'offline', name: '18. Offline Mode', icon: '📡' },
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
            id: 'categories',
            label: 'Levels',
            screen: 'categories',
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
                className="group relative cursor-pointer select-none bg-gradient-to-r from-[#0e255a]/95 via-[#0a1a3e]/90 to-[#071330]/85 border border-cyan-400/40 hover:border-cyan-300/80 rounded-2xl p-1 pr-1.5 sm:pr-2.5 flex items-center gap-1.5 sm:gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-md transition-all active:scale-95 min-w-0 shrink"
                title="Player Profile"
              >
                {/* 3D Cyber Avatar Frame */}
                <div className="relative shrink-0 w-[30px] h-[30px] sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-900 p-0.5 shadow-[0_0_10px_rgba(0,229,255,0.6)] group-hover:shadow-[0_0_14px_rgba(0,229,255,0.9)] transition-all">
                  <div className="w-full h-full rounded-[10px] bg-[#0c1a3a] overflow-hidden flex items-center justify-center">
                    <img 
                      src="/assets/icon_robot_3d.png" 
                      alt="Player Avatar" 
                      decoding="async"
                      className="w-full h-full object-cover scale-110 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
                    />
                  </div>
                  {/* Golden Metallic LV. Badge */}
                  <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-md bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 border border-amber-200 text-amber-950 font-black text-[7px] sm:text-[7.5px] font-display shadow-md tracking-tighter leading-none">
                    LV.{activePlayerLevel}
                  </div>
                </div>

                {/* Level Title & XP Bar */}
                <div className="flex flex-col justify-center min-w-0">
                  <div className="flex items-center gap-1 sm:gap-1.5 leading-tight">
                    <span className="text-white font-black text-[10px] sm:text-[11px] font-display tracking-wide uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] truncate">
                      Level {activePlayerLevel}
                    </span>
                    <span className="home-hdr-pro-badge px-1 py-0.2 rounded text-[6.5px] sm:text-[7px] font-black uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 font-mono shrink-0">
                      PRO
                    </span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 mt-0.5 sm:mt-1 min-w-0">
                    <div className="w-[44px] sm:w-[60px] h-1.5 bg-[#050f24] border border-cyan-400/50 rounded-full overflow-hidden p-[1px] shadow-inner relative shrink-0">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-white rounded-full shadow-[0_0_8px_rgba(0,229,255,0.9)] transition-all duration-300" 
                        style={{ width: `${Math.min(100, Math.max(12, ((playerXp % 300) / 300) * 100))}%` }} 
                      />
                    </div>
                    <span className="home-hdr-xp-text text-cyan-300 font-mono font-bold text-[7px] sm:text-[7.5px] tracking-tight whitespace-nowrap drop-shadow shrink-0">
                      {playerXp % 300}/300
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

                {/* Tactile Cyber Stats Button */}
                <button 
                  onClick={() => { sound.click(); navigateTo('stats'); }}
                  className="w-[26px] h-[26px] sm:w-7 sm:h-7 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                  title="Statistics"
                  aria-label="Statistics"
                >
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </button>

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
                src="/assets/hero_scifi_clean.png" 
                alt="Math Puzzle Hero" 
                decoding="async"
                fetchPriority="high"
                className="w-full h-auto object-contain block pointer-events-none" 
              />
            </div>

            {/* 1. Daily Challenge Card (Native sharp chamfered cut corners) */}
            <div 
              onClick={() => navigateTo('daily')}
              className="scifi-card-3d relative w-full cursor-pointer select-none shrink-0"
            >
              <img 
                src="/assets/card_daily_clean.png?v=4" 
                alt="Daily Challenge" 
                decoding="async"
                className="w-full h-auto object-contain block pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" 
              />
            </div>

            {/* 2. Mid Section (2 Cards Side-by-Side: Level & Rewards) */}
            <div className="grid grid-cols-2 gap-2 shrink-0">
              {/* Level Progress Card */}
              <div 
                onClick={() => { sound.click(); navigateTo('levels'); }}
                className="scifi-card-3d relative w-full cursor-pointer select-none rounded-2xl overflow-hidden"
              >
                <img 
                  src="/assets/card_level_clean.png?v=6" 
                  alt={`Level ${activePlayerLevel}`} 
                  decoding="async"
                  className="w-full h-auto object-contain block pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" 
                />
                {/* Dynamic Level Overlay for active level - pixel-perfect positioning */}
                <div 
                  className="absolute pointer-events-none flex flex-col justify-start select-none"
                  style={{ top: '20%', left: '57%', right: '4%' }}
                >
                  <span 
                    className="text-white font-black tracking-tight leading-none block drop-shadow-[0_2px_4px_rgba(0,10,35,0.95)]"
                    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Arial Black', sans-serif", fontSize: 'clamp(15px, 4.2vw, 19px)' }}
                  >
                    Level {activePlayerLevel}
                  </span>
                  <span 
                    className="text-[#d8f2ff] font-bold tracking-tight block drop-shadow-[0_1px_3px_rgba(0,10,35,0.9)]"
                    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif", fontSize: 'clamp(9px, 2.4vw, 11px)', marginTop: '4px' }}
                  >
                    {activePlayerLevel >= 25 ? 'Master Achieved!' : 'Keep going!'}
                  </span>
                </div>
              </div>

              {/* Rewards Card */}
              <div 
                onClick={() => { sound.click(); navigateTo('rewards'); }}
                className="scifi-card-3d relative w-full cursor-pointer select-none"
              >
                <img 
                  src="/assets/card_rewards_scifi.png?v=9" 
                  alt="Rewards" 
                  decoding="async"
                  className="w-full h-auto object-contain block pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" 
                />
              </div>
            </div>

            {/* 3. Continue Card */}
            <div 
              onClick={() => {
                sound.click();
                attemptStartLevel(activePlayerLevel);
              }}
              className="scifi-card-3d relative w-full cursor-pointer select-none shrink-0"
            >
              <img 
                src="/assets/card_continue_clean.png?v=4" 
                alt="Continue" 
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain block pointer-events-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]" 
              />
            </div>

            {/* 4. New Game Card */}
            <div 
              onClick={() => navigateTo('categories')}
              className="scifi-card-3d relative w-full cursor-pointer select-none shrink-0"
            >
              <img 
                src="/assets/card_newgame_clean.png?v=4" 
                alt="New Game" 
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-contain block pointer-events-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" 
              />
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
                    icon: "/assets/icon_trophy_3d.png",
                    cardBg: "from-[#0d2760] via-[#15367c] to-[#0e2a66]",
                    borderCol: "border-amber-400/70",
                    blueprintTag: "ARCH: Φ-1.618",
                    mathFormula: "e^(iπ)+1=0",
                    mathSymbol: "∑",
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
                    icon: "/assets/icon_robot_3d.png",
                    cardBg: "from-[#29175a] via-[#3a207a] to-[#22134c]",
                    borderCol: "border-purple-400/70",
                    blueprintTag: "CALC: ∫f(x)dx",
                    mathFormula: "lim 1/x=0",
                    mathSymbol: "∫",
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
                    icon: "/assets/icon_chest_3d.png",
                    cardBg: "from-[#073229] via-[#0b483c] to-[#052922]",
                    borderCol: "border-emerald-400/70",
                    blueprintTag: "GEO: a²+b²=c²",
                    mathFormula: "sin²θ+cos²θ=1",
                    mathSymbol: "Δ",
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
                    icon: "/assets/icon_gamepad_3d.png",
                    cardBg: "from-[#4a1e0b] via-[#66280e] to-[#361608]",
                    borderCol: "border-orange-400/70",
                    blueprintTag: "MATRIX: [3×3]",
                    mathFormula: "det(A-λI)=0",
                    mathSymbol: "λ",
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
                    icon: "/assets/icon_target_3d.png",
                    cardBg: "from-[#082b4a] via-[#0d3d66] to-[#06223b]",
                    borderCol: "border-cyan-400/70",
                    blueprintTag: "TRIG: π≈3.14",
                    mathFormula: "f'(x)=2x+7",
                    mathSymbol: "π",
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
                    className={`math-arch-card shrink-0 cursor-pointer select-none transition-transform hover:scale-[1.03] active:scale-[0.97] border-[1.5px] ${champ.borderCol} bg-gradient-to-b ${champ.cardBg}`}
                    style={{ scrollSnapAlign: 'start' }}
                    title={`${champ.name} - ${champ.rank}`}
                  >
                    <div className="w-[112px] h-[170px] p-2 flex flex-col justify-between relative overflow-hidden pt-3">
                      {/* 1. Mathematical Blueprint Coordinate Grid */}
                      <div className="absolute inset-0 math-blueprint-grid opacity-25 pointer-events-none" />

                      {/* 2. Architectural Drafting Corner Marks (+) */}
                      <span className="absolute top-1 left-1.5 text-[8px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
                      <span className="absolute top-1 right-1.5 text-[8px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
                      <span className="absolute bottom-1 left-1.5 text-[8px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
                      <span className="absolute bottom-1 right-1.5 text-[8px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>

                      {/* Glossy top glass reflection */}
                      <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-white/20 via-white/5 to-transparent rounded-t-[16px] pointer-events-none" />

                      {/* Center: 3D Champion Avatar / Icon + Username + Country */}
                      <div className="flex flex-col items-center justify-center relative z-10 my-auto py-1">
                        <div className="w-13 h-13 rounded-2xl bg-black/40 border-2 border-cyan-400/50 flex items-center justify-center p-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                          <img 
                            src={champ.icon} 
                            alt={champ.name} 
                            loading="lazy"
                            decoding="async"
                            className="w-10 h-10 object-contain drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]" 
                          />
                        </div>

                        {/* Username */}
                        <span className="text-white font-black text-[11px] font-display tracking-tight text-center truncate w-full mt-1.5 drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] leading-tight">
                          {champ.name}
                        </span>

                        {/* Country Name + Flag Pill */}
                        <div className="flex items-center justify-center gap-1 bg-black/35 border border-cyan-400/30 rounded-full px-1.5 py-0.5 mt-1 max-w-full">
                          <span className="text-[10px] shrink-0 leading-none">{champ.flag}</span>
                          <span className="text-[8px] text-cyan-200 font-bold tracking-tight truncate leading-none">
                            {champ.country}
                          </span>
                        </div>
                      </div>

                      {/* Bottom: 3D Rank Badge + Rewards Capsule */}
                      <div className="flex flex-col gap-1 relative z-10 w-full pt-1">
                        {/* 3D Rank Badge */}
                        <div className={`w-full bg-gradient-to-r ${champ.rankCol} ${champ.rankText} text-[8.5px] font-black uppercase py-0.5 rounded-md shadow-xs border border-white/50 text-center leading-none tracking-tight`}>
                          {champ.rank}
                        </div>

                        {/* Rewards Capsule (Coins + Gems) */}
                        <div className="flex items-center justify-center gap-1 bg-[#06142e]/90 border border-amber-400/50 rounded-md py-0.5 px-1 shadow-xs leading-none">
                          <img src="/assets/icon_gold_coin_3d_clean.png" alt="Coin" className="w-3 h-3 object-contain shrink-0" />
                          <span className="text-amber-300 font-black text-[8.5px] font-display">
                            {champ.coins}
                          </span>
                          <span className="text-white/30 text-[7px]">|</span>
                          <img src="/assets/icon_gem_3d_clean.png" alt="Gem" className="w-2.5 h-2.5 object-contain shrink-0" />
                          <span className="text-cyan-200 font-black text-[8.5px] font-display">
                            {champ.gems}
                          </span>
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
      // 4. CATEGORIES SCREEN (Modern Sci-Fi Arcade Edition)
      // ========================================================
      const renderCategoriesScreen = () => {
        const allCategories = [
          { id: 'add', name: 'Addition', tier: 'basic', desc: 'Master Sums & Mental Math', color: 'from-emerald-400 to-teal-600', borderColor: 'border-emerald-400/50', icon: '+', levels: '20 Levels', progress: 100, tag: 'FOUNDATION' },
          { id: 'sub', name: 'Subtraction', tier: 'basic', desc: 'Difference & Mental Agility', color: 'from-rose-400 to-red-600', borderColor: 'border-rose-400/50', icon: '−', levels: '20 Levels', progress: 85, tag: 'CORE MATH' },
          { id: 'mul', name: 'Multiplication', tier: 'intermediate', desc: 'Rapid Factors & Timed Grids', color: 'from-purple-400 to-indigo-600', borderColor: 'border-purple-400/50', icon: '×', levels: '25 Levels', progress: 60, tag: 'FACTORS' },
          { id: 'div', name: 'Division', tier: 'intermediate', desc: 'Quotients & Fractional Logic', color: 'from-cyan-400 to-blue-600', borderColor: 'border-cyan-400/50', icon: '÷', levels: '25 Levels', progress: 40, tag: 'QUOTIENT' },
          { id: 'mix', name: 'Mixed Operations', tier: 'advanced', desc: 'Ultimate Cross-Math Brain Teasers', color: 'from-amber-400 to-orange-500', borderColor: 'border-amber-400/50', icon: '🔣', levels: '30 Levels', progress: 20, tag: 'CHALLENGE' },
        ];

        const filteredCategories = allCategories.filter(cat => {
          if (selectedCategory === 'all' || !selectedCategory) return true;
          return cat.tier === selectedCategory;
        });

        return (
          <div className="flex-1 flex flex-col scifi-game-bg select-none overflow-hidden relative text-white">
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-0 pb-6 space-y-3 max-w-md mx-auto w-full">
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
                      {Math.max(coins, 10).toLocaleString()}
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

              {/* Holographic Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {['All', 'Basic', 'Intermediate', 'Advanced'].map((tab, idx) => {
                  const isSelected = selectedCategory === tab.toLowerCase() || (idx === 0 && selectedCategory === 'all');
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        sound.click();
                        setSelectedCategory(tab.toLowerCase());
                      }}
                      className={`px-3.5 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white border border-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.6)] scale-105'
                          : 'bg-[#102454]/80 text-cyan-200/70 border border-cyan-500/30 hover:border-cyan-400/70 hover:text-white active:scale-95'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* 3D Cyber Category Cards */}
              <div className="space-y-2.5 pb-4">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => {
                      sound.click();
                      navigateTo('levels');
                    }}
                    className="math-arch-card relative bg-gradient-to-r from-[#142d68] via-[#1a3a85] to-[#12285a] border-[1.5px] border-cyan-400/50 rounded-2xl p-3 shadow-[0_6px_18px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-cyan-300 hover:shadow-[0_8px_24px_rgba(0,229,255,0.35)] transition-all cursor-pointer active:scale-[0.98] group overflow-hidden"
                  >
                    {/* Architectural Blueprint Grid */}
                    <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
                    
                    {/* Corner Marks */}
                    <span className="absolute top-1 left-1.5 text-[8px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
                    <span className="absolute top-1 right-1.5 text-[8px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>

                    <div className="relative z-10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 3D Operation Badge */}
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} border border-white/40 text-white flex items-center justify-center font-black text-2xl shadow-[0_0_15px_rgba(0,0,0,0.4)] shrink-0 group-hover:scale-105 transition-transform`}>
                          {cat.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-extrabold text-white font-display tracking-tight truncate">{cat.name}</h3>
                            <span className="bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 font-extrabold text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-tight">
                              {cat.tag}
                            </span>
                          </div>
                          <p className="text-[10px] text-cyan-200/70 truncate mt-0.5">{cat.desc}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="w-20 h-1.5 bg-[#0a183b] border border-cyan-400/40 rounded-full overflow-hidden p-0.5 shadow-inner">
                              <div 
                                className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                                style={{ width: `${cat.progress}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-mono text-cyan-300/90 font-bold">
                              {cat.levels} • {cat.progress}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right chevron action */}
                      <div className="w-8 h-8 rounded-xl bg-cyan-950/70 border border-cyan-400/50 text-cyan-300 flex items-center justify-center text-sm font-black shadow-inner shrink-0 group-hover:translate-x-1 group-hover:border-cyan-300 group-hover:text-white transition-all">
                        ➔
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      };

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
                    onClick={() => { sound.click(); navigateTo('categories'); }} 
                    className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                    title="Back to Categories"
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
                    <div>
                      <span className="text-xs font-black font-display text-white">Campaign Progress</span>
                      <span className="text-[10px] font-mono text-cyan-300 block">
                        {clearedCount} of 25 Missions Completed
                      </span>
                    </div>
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

              {/* Mission Levels List (Filtered) */}
              <div className="space-y-2.5 pb-2">
                {filteredLevels.map((lvl) => {
                  const isSelected = selectedLevelNum === lvl.num;
                  const isCompleted = lvl.num < unlockedLevelMax;
                  const isUnlocked = lvl.num <= unlockedLevelMax;
                  const isLocked = lvl.num > unlockedLevelMax;

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
                      className={`math-arch-card relative rounded-2xl p-3.5 flex items-center justify-between transition-all cursor-pointer overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#173a87] via-[#1d47a3] to-[#143274] border-2 border-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.45)] animate-level-selected'
                          : isCompleted
                          ? 'bg-gradient-to-r from-[#0d2a54] via-[#133568] to-[#0c2244] border-[1.5px] border-emerald-400/60 shadow-[0_4px_14px_rgba(0,0,0,0.4)] hover:border-emerald-300'
                          : isLocked
                          ? 'bg-gradient-to-r from-[#0d1c3e]/70 via-[#10224d]/70 to-[#0b1733]/70 border border-slate-700/50 opacity-60 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#132c66] via-[#1a3880] to-[#112759] border-[1.5px] border-cyan-400/50 hover:border-cyan-300 shadow-[0_4px_14px_rgba(0,0,0,0.4)]'
                      }`}
                    >
                      {/* Blueprint Grid */}
                      <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />

                      <div className="relative z-10 flex items-center gap-3.5 min-w-0">
                        {/* 3D Level Keycap */}
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border shadow-md ${
                          isCompleted
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-700 border-emerald-300 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                            : isSelected || isUnlocked
                            ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 border-cyan-200 text-white shadow-[0_0_14px_rgba(0,229,255,0.6)]'
                            : 'bg-slate-800/80 border-slate-600 text-slate-400'
                        }`}>
                          {isCompleted ? '✓' : isLocked ? '🔒' : lvl.num}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white font-display">
                              Level {lvl.num}
                            </span>
                            <span className="text-xs text-cyan-200/90 font-bold truncate max-w-[130px]">
                              {lvl.title}
                            </span>
                          </div>
                          {/* Essential Mission Requirements Only */}
                          {(() => {
                            const cost = getLevelEntryCost(lvl.num);
                            return (
                              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                                {/* Puzzles in this level */}
                                <span className="flex items-center gap-1 text-[10px] text-emerald-200 font-mono font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-400/30" title="Puzzles in this level">
                                  <span>🎮</span>
                                  <span>{getStageCount(lvl.num)}</span>
                                </span>
                                {/* Timer */}
                                <span className="flex items-center gap-1 text-[10px] text-cyan-200/90 font-mono font-bold bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-400/30">
                                  <span>⏱️</span>
                                  <span>{getLevelTimer(lvl.num)}s</span>
                                </span>
                                {/* Fee: Gold Coins */}
                                <span className="flex items-center gap-1 text-[10px] text-amber-300 font-extrabold font-mono bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-400/40 shadow-xs" title="Entry Coins">
                                  <img src="/assets/icon_gold_coin_3d_clean.png" alt="Coins" className="w-3.5 h-3.5 object-contain inline-block shrink-0" />
                                  <span>{cost.coins}</span>
                                </span>
                                {/* Fee: Diamonds */}
                                <span className="flex items-center gap-1 text-[10px] text-cyan-200 font-extrabold font-mono bg-sky-950/70 px-1.5 py-0.5 rounded border border-cyan-400/40 shadow-xs" title="Entry Diamonds">
                                  <img src="/assets/icon_gem_3d_clean.png" alt="Diamonds" className="w-3.5 h-3.5 object-contain inline-block shrink-0" />
                                  <span>{cost.gems}</span>
                                </span>
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Right Status Badge */}
                      <div className="relative z-10 flex items-center gap-2 shrink-0">
                        {isCompleted ? (
                          <div className="flex items-center gap-1.5">
                            <div className="flex text-amber-300 text-xs">
                              ⭐⭐⭐
                            </div>
                            <div className="w-6 h-6 rounded-full bg-emerald-500 border border-emerald-300 text-white flex items-center justify-center text-xs font-black shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                              ✓
                            </div>
                          </div>
                        ) : isUnlocked ? (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-400 text-blue-950 shadow-sm animate-pulse">
                              PLAY ▶
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-slate-900/80 border border-slate-700/60 rounded-full px-2 py-0.5">
                            <span className="text-slate-400 text-xs">🔒</span>
                            <span className="text-[9px] text-slate-400 font-mono">Lvl {lvl.num - 1}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Hero Action Button with Entry Fee summary */}
              {(() => {
                const selectedCost = getLevelEntryCost(selectedLevelNum);
                return (
                  <button
                    onClick={() => {
                      sound.click();
                      attemptStartLevel(selectedLevelNum);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 text-amber-950 font-black text-base shadow-[0_6px_22px_rgba(245,158,11,0.5),inset_0_1px_0_rgba(255,255,255,0.6)] active:scale-[0.98] transition-all flex flex-col items-center justify-center border border-amber-200 cursor-pointer mb-8 sm:mb-6"
                  >
                    <div className="flex items-center gap-2">
                      <span>🚀</span>
                      <span>Launch Mission (Level {selectedLevelNum})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-amber-950/85 font-mono font-black mt-0.5">
                      <span>Entry Fee: 🪙 {selectedCost.coins}</span>
                      <span>•</span>
                      <span>💎 {selectedCost.gems}</span>
                      <span className="text-[9.5px] bg-amber-950/20 px-1.5 py-0.5 rounded font-sans uppercase font-bold tracking-wider">Play</span>
                    </div>
                  </button>
                );
              })()}
            </div>
          </div>
        );
      };

      // ========================================================
      // 6. PUZZLE GAMEPLAY (Modern Sci-Fi Arcade Edition)
      const renderGameScreen = () => (
        <div className="flex-1 flex flex-col scifi-game-bg select-none overflow-hidden relative text-white">
          <div 
            className="flex-1 overflow-y-auto no-scrollbar px-3 pt-0 space-y-2.5 max-w-md mx-auto w-full"
            style={{ paddingBottom: 'max(3.5rem, calc(env(safe-area-inset-bottom, 0px) + 2.5rem))' }}
          >
            {/* Top Navigation & HUD Header */}
            <div className="sticky top-0 z-20 -mx-3 scifi-header-bg border-b border-cyan-400/20 flex items-center justify-between gap-1.5 px-3 pt-2 pb-2 shrink-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <button 
                  onClick={() => { sound.click(); navigateTo('levels'); }} 
                  aria-label="Back to levels" 
                  className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-base font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ‹
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

              {/* Level Mission Pill */}
              <div className="flex items-center gap-1.5 bg-black/40 border border-cyan-400/40 rounded-full px-2.5 py-1 shadow-inner shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-cyan-200 font-display">
                  Mission L{selectedLevelNum}
                </span>
              </div>

              {/* Currency Capsules: Gold Coins & Diamonds */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Gold Coins */}
                <div 
                  onClick={() => { sound.click(); navigateTo('rewards'); }}
                  className="group bg-gradient-to-r from-[#1b1c08]/90 via-[#272106]/90 to-[#121102]/90 border border-amber-400/60 hover:border-amber-300 rounded-xl px-1.5 py-1 flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,230,130,0.3)] transition-all active:scale-95 cursor-pointer"
                  title="Coins - Tap for Rewards & Shop"
                  aria-label={`Coin Balance: ${coins}`}
                >
                  <img 
                    src="/assets/icon_gold_coin_3d_clean.png" 
                    alt="Coin" 
                    className="w-3.5 h-3.5 shrink-0 drop-shadow-[0_2px_4px_rgba(245,158,11,0.7)] group-hover:scale-110 transition-transform" 
                  />
                  <span className="text-amber-300 font-black text-[10px] sm:text-[11px] font-display tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    {coins.toLocaleString()}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-gradient-to-b from-amber-400 to-amber-600 text-amber-950 font-black text-[8px] flex items-center justify-center shadow-xs leading-none">
                    +
                  </span>
                </div>

                {/* Diamonds */}
                <div 
                  onClick={() => { sound.click(); navigateTo('rewards'); }}
                  className="group bg-gradient-to-r from-[#071d38]/90 via-[#0a2347]/90 to-[#051429]/90 border border-cyan-400/60 hover:border-cyan-300 rounded-xl px-1.5 py-1 flex items-center gap-1 shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(186,230,253,0.25)] transition-all active:scale-95 cursor-pointer"
                  title="Diamonds - Tap for Rewards & Shop"
                  aria-label={`Diamond Balance: ${gems}`}
                >
                  <img 
                    src="/assets/icon_gem_3d_clean.png" 
                    alt="Diamond" 
                    className="w-3.5 h-3.5 shrink-0 drop-shadow-[0_2px_6px_rgba(0,229,255,0.8)] group-hover:scale-110 transition-transform" 
                  />
                  <span className="text-cyan-200 font-black text-[10px] sm:text-[11px] font-display tracking-tight drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]">
                    {gems.toLocaleString()}
                  </span>
                  <span className="w-3 h-3 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 text-white font-black text-[8px] flex items-center justify-center shadow-xs leading-none">
                    +
                  </span>
                </div>
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
                    <div className="flex justify-around bg-black/30 p-2 rounded-2xl border border-cyan-400/20">
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
                    <div className="flex justify-around bg-black/30 p-2 rounded-2xl border border-cyan-400/20">
                      {[true, false].map(isLarge => (
                        <button key={String(isLarge)} onClick={() => setLargeFontEnabled(isLarge)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${largeFontEnabled === isLarge ? 'bg-cyan-500 text-blue-950 shadow-md' : 'text-slate-400'}`}>
                          {isLarge ? 'Large Font' : 'Standard Font'}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-300 mb-2">Division Notation</h3>
                    <div className="flex justify-around bg-black/30 p-2 rounded-2xl border border-cyan-400/20">
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
            <section className="flex flex-col rounded-3xl p-3 sm:p-4 bg-gradient-to-b from-[#102761]/95 to-[#0b1c45]/95 border border-cyan-400/40 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden backdrop-blur-md">
              {/* Blueprint Grid Overlay */}
              <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />

              {/* Drafting Corner Crosses */}
              <span className="absolute top-1.5 left-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
              <span className="absolute top-1.5 right-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
              <span className="absolute bottom-1.5 left-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>
              <span className="absolute bottom-1.5 right-2 text-[9px] font-mono text-cyan-300/40 select-none pointer-events-none leading-none">+</span>

              {/* Mission HUD Header: Difficulty, Timer, and Pause */}
              <div className="relative z-10 flex items-center justify-between px-1 pb-3 text-xs font-bold border-b border-cyan-400/20">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-400/50 text-emerald-300">
                    {profileDifficulty}
                  </span>
                  <span className="text-[10px] text-cyan-300/70 font-mono">PUZZLE {stageNum}/{stageTotal}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div ref={timerContainerRef} className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono font-black text-xs transition-colors ${
                    gameTimer <= 15
                      ? 'animate-timer-warning text-red-300 bg-red-950/80 border border-red-500/80'
                      : 'text-cyan-200 bg-cyan-950/70 border border-cyan-400/40'
                  }`}>
                    <span>⏱️</span>
                    <span ref={timerDisplayRef}>{formatTimer(gameTimer)}</span>
                  </div>

                  <button 
                    onClick={() => { sound.click(); setIsGamePaused(v => !v); }} 
                    aria-label={isGamePaused ? 'Resume puzzle' : 'Pause puzzle'} 
                    className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-400/50 text-cyan-300 flex items-center justify-center text-xs font-black shadow-inner active:scale-95 cursor-pointer"
                  >
                    {isGamePaused ? '▶' : '⏸'}
                  </button>
                </div>
              </div>

              {/* Cross-Math 9x9 Puzzle Grid */}
              <div className="relative z-10 flex justify-center pb-3 pt-3">
                <div className="w-full max-w-[340px] p-2.5 sm:p-3 rounded-2xl bg-[#081538]/70 border border-cyan-500/20 backdrop-blur-sm shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
                  <div 
                    className="grid gap-1.5 sm:gap-2 w-full" 
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
                            className={`relative flex aspect-square min-w-0 items-center justify-center select-none ${
                              isFilled
                                ? `scifi-tile-slot-filled ${hasImpact ? 'animate-tile-pop' : ''} ${largeFontEnabled ? 'text-[clamp(17px,5.5vw,26px)]' : 'text-[clamp(14px,4.5vw,22px)]'}`
                                : isSelected
                                ? `scifi-tile-slot-selected ${largeFontEnabled ? 'text-[clamp(17px,5.5vw,26px)]' : 'text-[clamp(14px,4.5vw,22px)]'}`
                                : isSlotPending
                                ? 'scifi-tile-slot-target-locked'
                                : 'scifi-tile-slot-empty'
                            }`}
                          >
                            {isFilled ? (
                              puzzleAnswers[slot]
                            ) : isSlotPending ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-cyan-300 animate-ping opacity-90" />
                            ) : isSelected ? (
                              <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping opacity-80" />
                            ) : (
                              <span className="text-[10px] text-cyan-400/50 font-bold leading-none select-none">◇</span>
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
                          className={`flex aspect-square min-w-0 items-center justify-center select-none ${
                            isOperator
                              ? `scifi-tile-operator ${largeFontEnabled ? 'text-[clamp(16px,5vw,24px)]' : 'text-[clamp(13px,4vw,20px)]'}`
                              : `scifi-tile-fixed ${largeFontEnabled ? 'text-[clamp(17px,5.5vw,26px)]' : 'text-[clamp(14px,4.5vw,22px)]'}`
                          }`}
                        >
                          {cell === '÷' ? divisionSymbol : cell}
                        </div>
                      );
                    }))}
                  </div>
                </div>
              </div>

              {/* Number Tray Keyboard */}
              <div className="relative z-10 flex items-center justify-center gap-2 pt-4 border-t border-cyan-400/20">
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
                      className={`grid aspect-square min-w-0 flex-1 max-w-[54px] place-items-center rounded-xl transition-all ${
                        used
                          ? 'opacity-25 scale-95 border border-slate-700 bg-slate-800/40 text-slate-500 cursor-not-allowed'
                          : 'bg-gradient-to-b from-[#1fc786] via-[#10b981] to-[#047857] border-2 border-emerald-300 text-white font-black shadow-[0_4px_0_#064e3b,0_6px_12px_rgba(16,185,129,0.35)] active:translate-y-1 active:shadow-[0_1px_0_#064e3b] cursor-pointer hover:scale-105'
                      } ${largeFontEnabled ? 'text-[clamp(20px,6.5vw,32px)]' : 'text-[clamp(17px,5.5vw,26px)]'}`}
                    >
                      {number}
                    </button>
                  );
                })}
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
                onClick={() => { sound.click(); undoPuzzleNumber(); }} 
                aria-label="Undo last number" 
                disabled={!puzzleHistory.length} 
                className={`relative grid h-[54px] w-[54px] place-items-center rounded-2xl transition-all ${
                  puzzleHistory.length > 0
                    ? 'bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985] border-2 border-cyan-300 text-white shadow-[0_4px_0_#082f49,0_8px_20px_rgba(14,165,233,0.55),inset_0_1px_2px_rgba(255,255,255,0.6)] hover:scale-105 active:translate-y-1 active:shadow-[0_1px_0_#082f49] cursor-pointer'
                    : 'bg-gradient-to-b from-[#142854] via-[#0f1f45] to-[#0a1533] border-2 border-cyan-700/60 shadow-[0_4px_0_#070f24] text-cyan-300/70 cursor-not-allowed'
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
                className="relative grid h-[54px] w-[54px] place-items-center rounded-2xl bg-gradient-to-b from-[#fbbf24] via-[#f59e0b] to-[#d97706] border-2 border-yellow-200 shadow-[0_4px_0_#92400e,0_8px_24px_rgba(245,158,11,0.65),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:scale-105 active:translate-y-1 active:shadow-[0_1px_0_#92400e] transition-all cursor-pointer"
                title="Get Hint"
              >
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-8 h-8 rounded-full bg-amber-300/40 blur-[3px] animate-pulse pointer-events-none" />
                  <svg className="w-7 h-7 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.95)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a6.5 6.5 0 0 0-6.5 6.5c0 2.4 1.3 4.4 3.2 5.5v1.5a1.8 1.8 0 0 0 1.8 1.8h3a1.8 1.8 0 0 0 1.8-1.8V14c1.9-1.1 3.2-3.1 3.2-5.5A6.5 6.5 0 0 0 12 2z" fill="#fef08a" stroke="#ffffff" strokeWidth="1.8" />
                    <path d="M9.5 9.5h5" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                    <path d="M10 12.5h4" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                    <path d="M10 19h4" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M10.5 21.5h3" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="absolute -bottom-2 rounded-full bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 border border-amber-950/40 px-2.5 py-0.5 text-[10px] font-black text-amber-950 shadow-[0_2px_6px_rgba(0,0,0,0.5),0_0_10px_rgba(251,191,36,0.95)] tracking-wider leading-none">
                  ×1
                </span>
              </button>
            </div>
          </div>

          {/* 3D Glassmorphic "Time Out" Banner Modal (Matching Reference Design) */}
          {isTimeOver && (
            <div className="fixed inset-0 z-50 bg-[#06122c]/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Glassmorphic Popup Card */}
              <div className="relative w-full max-w-[325px] sm:max-w-[340px] rounded-[38px] p-6 pt-14 bg-gradient-to-b from-white/95 via-[#f0f7ff]/95 to-[#e0efff]/95 border-2 border-white/90 shadow-[0_25px_60px_-10px_rgba(8,24,68,0.6),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(56,189,248,0.2)] text-center overflow-visible">

                {/* Top Close Button (Top-Right) */}
                <button
                  onClick={() => {
                    sound.click();
                    setIsTimeOver(false);
                    navigateTo('levels');
                  }}
                  aria-label="Close"
                  title="Close"
                  className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-blue-100/90 hover:bg-blue-200 border border-white text-[#1e3a8a] flex items-center justify-center font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>

                {/* 3D Hourglass Hero + Halo + Arched Banner (Floating Overflow) */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 flex flex-col items-center pointer-events-none z-20">
                  {/* Cloud base & Splash petals behind hourglass */}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute -bottom-2 w-32 h-14 bg-gradient-to-t from-[#bae6fd] to-white rounded-full blur-[1px] shadow-sm -z-10" />

                    {/* Left Splashes */}
                    <svg className="absolute -left-1 top-2 w-9 h-9 text-[#38bdf8] drop-shadow-[0_2px_6px_rgba(56,189,248,0.5)] -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <svg className="absolute -left-4 top-8 w-6 h-6 text-[#0ea5e9] drop-shadow-[0_2px_4px_rgba(14,165,233,0.4)] -rotate-45" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>

                    {/* Right Splashes */}
                    <svg className="absolute -right-1 top-2 w-9 h-9 text-[#38bdf8] drop-shadow-[0_2px_6px_rgba(56,189,248,0.5)] rotate-12 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                    <svg className="absolute -right-4 top-8 w-6 h-6 text-[#0ea5e9] drop-shadow-[0_2px_4px_rgba(14,165,233,0.4)] rotate-45 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>

                    {/* Sparkle Stars */}
                    <div className="absolute -top-3 -left-3 text-amber-400 font-bold text-lg select-none">✦</div>
                    <div className="absolute -top-2 -right-3 text-amber-400 font-bold text-lg select-none">✦</div>

                    {/* 3D Hourglass SVG Graphic */}
                    <svg className="w-24 h-24 drop-shadow-[0_8px_16px_rgba(14,165,233,0.45)]" viewBox="0 0 100 100" fill="none">
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

                  {/* Arched 3D Banner "Time Out" */}
                  <div className="relative -mt-3 w-56 h-12 flex items-center justify-center filter drop-shadow-[0_6px_12px_rgba(29,78,216,0.5)]">
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
                    <div className="relative z-10 flex items-center justify-center gap-1.5 pb-1 select-none">
                      <span className="text-amber-300 text-sm filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">⭐</span>
                      <span className="font-black text-xl tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] font-display">
                        Time <span className="text-[#fde047] drop-shadow-[0_2px_4px_rgba(180,83,9,0.8)]">Out</span>
                      </span>
                      <span className="text-amber-300 text-sm filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">⭐</span>
                    </div>
                  </div>
                </div>

                {/* Clock Divider */}
                <div className="flex items-center justify-center gap-3 my-3">
                  <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-blue-300 to-blue-400 rounded-full" />
                  <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-blue-600 shadow-inner">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                  </div>
                  <div className="h-[2px] w-12 bg-gradient-to-l from-transparent via-blue-300 to-blue-400 rounded-full" />
                </div>

                {/* Headline & Description */}
                <h2 className="text-[#152a55] font-black text-xl tracking-tight font-display mb-1">
                  Take a short break!
                </h2>
                <p className="text-[#4b618a] text-xs font-semibold px-2 leading-relaxed mb-6">
                  You can continue the game anytime you're ready.
                </p>

                {/* Action Controls */}
                <div className="space-y-3">
                  {/* Primary 3D Restart Button */}
                  <button
                    onClick={restartLevelAfterTimeout}
                    aria-label="Restart Level"
                    className="w-full h-12 rounded-full bg-gradient-to-b from-[#3b82f6] via-[#2563eb] to-[#1d4ed8] border-2 border-blue-200/90 text-white font-black text-base flex items-center justify-center gap-2 shadow-[0_5px_0_#1e40af,0_10px_25px_rgba(37,99,235,0.45),inset_0_2px_3px_rgba(255,255,255,0.7)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#1e40af] transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 text-white stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5" />
                    </svg>
                    <span>Restart</span>
                  </button>

                  {/* Secondary Options: +30s Extra Time (Ad) & Level Select */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => handleWatchAd('time', 30, 'Chronometer Extender Sponsor')}
                      aria-label="Extra Time (+30s)"
                      className="h-10 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 border border-amber-200 text-amber-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_3px_0_#b45309,0_6px_16px_rgba(245,158,11,0.35)] active:translate-y-0.5 active:shadow-[0_1px_0_#b45309] transition-all cursor-pointer"
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
                      className="h-10 rounded-2xl bg-blue-100/90 hover:bg-blue-200/90 border border-blue-300 text-blue-900 font-black text-xs flex items-center justify-center gap-1.5 shadow-[0_3px_0_#93c5fd] active:translate-y-0.5 active:shadow-[0_1px_0_#93c5fd] transition-all cursor-pointer"
                    >
                      <span>⊞</span>
                      <span>Missions</span>
                    </button>
                  </div>
                </div>

                {/* Corner Water Droplets Decorations */}
                <div className="absolute bottom-3 left-3 pointer-events-none opacity-80">
                  <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.69l3.5 3.5a5 5 0 1 1-7 0z" />
                  </svg>
                </div>
                <div className="absolute bottom-3 right-3 pointer-events-none opacity-80">
                  <svg className="w-6 h-6 text-sky-400 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.69l3.5 3.5a5 5 0 1 1-7 0z" />
                  </svg>
                </div>

              </div>
            </div>
          )}
        </div>
      );

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

              {/* Resume Button */}
              <button
                onClick={() => { sound.click(); navigateTo('game'); }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 text-white font-black text-sm shadow-[0_0_16px_rgba(0,229,255,0.4)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Resume Mission
              </button>
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
                <img src="/assets/icon_gold_coin_3d_clean.png" alt="Coins" className="w-4 h-4 object-contain" />
                <span className="text-amber-300 font-black text-xs">+{lastResult.coins} Coins</span>
              </div>
              {lastResult.gems > 0 && (
                <div className="bg-black/50 border border-cyan-400/60 rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm">
                  <img src="/assets/icon_gem_3d_clean.png" alt="Diamonds" className="w-4 h-4 object-contain" />
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
                Next Puzzle ({stageNum}/{stageTotal}) →
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
              Retry Puzzle ({stageNum}/{stageTotal})
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
      // 10. DAILY CHALLENGE (Pixel Perfect to Screen 10)
      // ========================================================
      // 10. DAILY CHALLENGE (Cyber Arcade Modernization)
      // ========================================================
      const renderDailyScreen = () => {
        const handleClaimDailyGift = () => {
          if (dailyGiftClaimed) return;
          sound.fanfare();
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
          setCoins(c => {
            const next = c + 250;
            try { localStorage.setItem('newromath_coins', next.toString()); } catch (e) {}
            return next;
          });
          setGems(g => {
            const next = g + 10;
            try { localStorage.setItem('newromath_gems', next.toString()); } catch (e) {}
            return next;
          });
          setDailyGiftClaimed(true);
        };

        const handleLaunchDailyPuzzle = () => {
          sound.click();
          const targetLvl = Math.min(25, Math.max(1, 10 + activeDailyDay));
          startNewPuzzle(targetLvl);
        };

        const isToday = activeDailyDay === 9;
        const isCompleted = activeDailyDay < 9;
        const isLocked = activeDailyDay > 9;

        return (
          <div className="flex-1 scifi-game-bg flex flex-col overflow-hidden text-white relative select-none">
            {/* Mathematical Coordinate Blueprint Overlay */}
            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Sticky Modern Sci-Fi Header */}
            <header className="sticky top-0 z-20 scifi-header-bg border-b border-cyan-400/20 px-4 py-3 shrink-0 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { sound.click(); navigateTo('home'); }} 
                  aria-label="Back to home" 
                  className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-xl font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ‹
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📅</span>
                  <div className="text-center">
                    <h1 className="text-base sm:text-lg font-black font-display tracking-wider bg-gradient-to-r from-cyan-300 via-sky-100 to-white bg-clip-text text-transparent uppercase leading-tight">
                      Daily Challenge
                    </h1>
                    <span className="text-[10px] text-cyan-300/80 font-mono tracking-widest uppercase block">
                      October 2026 Season
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => { sound.click(); navigateTo('achievements'); }} 
                  aria-label="Awards & Achievements" 
                  className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-base font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  🏆
                </button>
              </div>
            </header>

            {/* Scrollable Daily Challenge Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-24 space-y-4 relative z-10">

              {/* 1. Hero Season Cup Banner Card */}
              <div className="relative rounded-3xl p-4 bg-gradient-to-b from-[#122e6b] via-[#0d2354] to-[#071536] border border-amber-400/40 shadow-[0_12px_32px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-48 bg-gradient-to-l from-amber-500/15 to-transparent pointer-events-none" />
                <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/25 to-yellow-600/35 border-2 border-amber-400/70 flex items-center justify-center shadow-[0_0_16px_rgba(251,191,36,0.4)]">
                        <img 
                          src="/assets/icon_trophy_3d.png" 
                          alt="Monthly Trophy" 
                          className="w-10 h-10 object-contain drop-shadow-[0_2px_8px_rgba(255,200,0,0.5)]" 
                        />
                      </div>
                      <span className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1 rounded-full shadow-xs">
                        TOP
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm sm:text-base font-black font-display text-white tracking-wide">
                          October Cyber Cup
                        </h2>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                          SEASON 10
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-200/90 font-medium mt-0.5">
                        Solve 31 daily missions for the Cyber Grand Trophy
                      </div>
                    </div>
                  </div>

                  {/* Streak Flame Pill */}
                  <div className="shrink-0 flex flex-col items-center justify-center px-2.5 py-1.5 rounded-2xl bg-[#09183d]/90 border border-orange-400/40 shadow-xs">
                    <span className="text-base leading-none">🔥</span>
                    <span className="text-xs font-black text-orange-300 font-display mt-0.5 leading-none">
                      {streakDays}d
                    </span>
                    <span className="text-[8px] text-orange-200/70 font-semibold uppercase tracking-tight mt-0.5">
                      Streak
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative z-10 mt-3 pt-3 border-t border-cyan-400/15">
                  <div className="flex items-center justify-between text-[10.5px] font-bold mb-1">
                    <span className="text-cyan-300">Monthly Mission Progress</span>
                    <span className="text-amber-300 font-mono">28 / 31 Solved (90%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#030919] border border-cyan-500/30 overflow-hidden p-0.5 shadow-inner">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 shadow-[0_0_10px_rgba(251,191,36,0.7)] transition-all duration-500"
                      style={{ width: '90%' }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Tactile Cyber Calendar Matrix (Month View) */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-xs">
                      📆
                    </div>
                    <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                      October 2026 Mission Matrix
                    </h3>
                  </div>
                  <span className="text-[10px] text-cyan-300/80 font-mono">
                    Today: <strong className="text-cyan-300">Day 9</strong>
                  </span>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 text-center text-[10px] font-bold text-sky-300/80 uppercase pb-2 mb-1 border-b border-cyan-400/20">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <span key={d}>{d}</span>
                  ))}
                </div>

                {/* 7x5 Days Matrix */}
                <div className="grid grid-cols-7 gap-1.5 text-center">
                  {[null, null, null, null, ...Array.from({ length: 31 }, (_, i) => i + 1)].map((day, i) => {
                    if (!day) {
                      return <div key={i} className="h-10" />;
                    }

                    const isPast = day < 9;
                    const isCurrent = day === 9;
                    const isFuture = day > 9;
                    const isSelected = activeDailyDay === day;

                    return (
                      <button
                        key={i}
                        onClick={() => {
                          sound.tap();
                          setActiveDailyDay(day);
                        }}
                        className={`relative h-10 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95 ${
                          isSelected
                            ? 'bg-gradient-to-b from-cyan-500/40 to-blue-600/50 border-2 border-cyan-300 text-white shadow-[0_0_14px_rgba(0,229,255,0.8)] scale-105 z-10'
                            : isCurrent
                            ? 'bg-gradient-to-b from-cyan-900/60 to-blue-950/70 border-2 border-cyan-400/80 text-cyan-200 shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                            : isPast
                            ? 'bg-[#061a3d]/90 border border-emerald-400/40 text-emerald-300 hover:border-emerald-300'
                            : 'bg-[#030919]/60 border border-slate-800 text-slate-500 hover:text-slate-400'
                        }`}
                      >
                        <span className={`text-xs font-black font-display leading-none ${isPast ? 'text-emerald-200' : isCurrent ? 'text-cyan-200' : isSelected ? 'text-white' : 'text-slate-400'}`}>
                          {day}
                        </span>

                        {/* Status Dots / Badges */}
                        {isPast && (
                          <span className="text-[8px] text-amber-300 leading-none mt-0.5">
                            ★
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[7.5px] font-black uppercase text-cyan-300 leading-none mt-0.5">
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
              </div>

              {/* 3. Selected Day Mission Telemetry Card */}
              <div className="rounded-2xl p-4 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-sm">
                      🎯
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black font-display text-white tracking-wide">
                        {isToday ? "Today's Daily Mission" : `Day ${activeDailyDay} Mission Brief`}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        October {activeDailyDay}, 2026 • Protocol #{274 + activeDailyDay}
                      </span>
                    </div>
                  </div>

                  <span className={`text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full border ${
                    isToday
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                      : isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {isToday ? 'ACTIVE NOW' : isCompleted ? 'COMPLETED (3★)' : 'LOCKED'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-cyan-400/15 my-2">
                  <div className="bg-[#050f26]/80 rounded-xl p-2 border border-cyan-500/20">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Difficulty</span>
                    <span className="text-xs font-black text-amber-300 font-display block mt-0.5">
                      {activeDailyDay % 3 === 0 ? 'HARD ⚡' : activeDailyDay % 2 === 0 ? 'MEDIUM' : 'CADET'}
                    </span>
                  </div>
                  <div className="bg-[#050f26]/80 rounded-xl p-2 border border-cyan-500/20">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Reward</span>
                    <span className="text-xs font-black text-emerald-300 font-display block mt-0.5">+150 Coins</span>
                  </div>
                  <div className="bg-[#050f26]/80 rounded-xl p-2 border border-cyan-500/20">
                    <span className="text-[9px] text-slate-400 uppercase font-bold block">Bonus</span>
                    <span className="text-xs font-black text-cyan-300 font-display block mt-0.5">+20 Gems</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300/90 leading-relaxed mt-2">
                  {isToday 
                    ? "Solve today's high-speed quantum arithmetic matrix. Precision completion awards full coins, gems, and extends your active streak!"
                    : isCompleted
                    ? "This daily challenge was successfully solved with a 3-star rating. You can replay anytime to train speed and precision."
                    : `This daily challenge unlocks automatically on October ${activeDailyDay}, 2026.`}
                </p>
              </div>

              {/* 4. Daily Supply Crate (Daily Login Bonus) */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-r from-[#102761] via-[#0b1c48] to-[#071330] border border-cyan-400/30 shadow-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-xl shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                    🎁
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black font-display text-white flex items-center gap-1.5">
                      <span>Daily Cyber Supply Crate</span>
                      {dailyGiftClaimed ? (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">CLAIMED</span>
                      ) : (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950">READY</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {dailyGiftClaimed ? 'Next free crate available tomorrow!' : "Claim today's free +250 Coins & +10 Gems"}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleClaimDailyGift}
                  disabled={dailyGiftClaimed}
                  className={`px-3 py-1.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                    dailyGiftClaimed
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.6)] active:scale-95'
                  }`}
                >
                  {dailyGiftClaimed ? 'CLAIMED ✓' : 'CLAIM FREE'}
                </button>
              </div>

              {/* 5. Primary Action Launch Button */}
              <div className="pt-2">
                <button
                  onClick={handleLaunchDailyPuzzle}
                  disabled={isLocked}
                  className={`w-full py-4 rounded-2xl font-black font-display text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                    isLocked
                      ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 border border-cyan-300/60 text-white shadow-[0_0_20px_rgba(0,229,255,0.5)] hover:shadow-[0_0_25px_rgba(0,229,255,0.7)] active:scale-98 cursor-pointer'
                  }`}
                >
                  <span>⚡</span>
                  <span>
                    {isLocked 
                      ? `LOCKED • UNLOCKS OCT ${activeDailyDay}` 
                      : isCompleted 
                      ? `REPLAY DAY ${activeDailyDay} CHALLENGE ›` 
                      : `START DAY ${activeDailyDay} DAILY PUZZLE ›`}
                  </span>
                </button>
              </div>

            </div>
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
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

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
                        <span className="text-base font-black text-orange-300 font-display block mt-0.5">Day {activeDailyDay} / 31</span>
                      </div>
                      <div className="bg-[#050f26]/80 border border-orange-400/20 rounded-xl p-2.5 text-center">
                        <span className="text-[9px] text-slate-400 uppercase font-bold block">Season Solves</span>
                        <span className="text-base font-black text-white font-display block mt-0.5">28 Victories</span>
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
          { rank: 2, name: 'Guest-7MUET', flag: '🇱🇦', score: '2,385,400', medal: '🥈', avatar: '🤖' },
          { rank: 1, name: 'RW', flag: '🇬🇧', score: '2,490,680', medal: '🥇', avatar: '⚡' },
          { rank: 3, name: 'Guest-JFTL4', flag: '🇩🇪', score: '2,290,150', medal: '🥉', avatar: '🎯' },
        ];

        return (
          <div className="flex-1 scifi-game-bg flex flex-col overflow-hidden text-white relative select-none">
            {/* Blueprint Grid Overlay */}
            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />

            {/* Sticky Modern Header */}
            <header className="sticky top-0 z-20 scifi-header-bg border-b border-cyan-400/20 px-4 py-3 shrink-0">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { sound.click(); navigateTo('home'); }} 
                  aria-label="Back to home" 
                  className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-xl font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ‹
                </button>
                <div />
                <button 
                  onClick={() => { sound.click(); navigateTo('help'); }} 
                  aria-label="Leaderboard information" 
                  className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-base font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ⓘ
                </button>
              </div>
            </header>

            {/* Scrollable Arena Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-2 space-y-4 relative z-10">

              {/* Champions Arena Podium Stage */}
              <div className="relative rounded-3xl p-3.5 bg-gradient-to-b from-[#102761]/90 to-[#081538]/95 border border-cyan-400/40 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] overflow-hidden">
                <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
                
                <div className="relative z-10 flex items-end justify-center gap-2 pt-5 pb-1">
                  {/* Rank 2 (Silver) */}
                  <div className="flex-1 flex flex-col items-center">
                    <div className="relative mb-2 flex flex-col items-center">
                      <span className="text-xl -mb-1 filter drop-shadow">🥈</span>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-200 via-sky-300 to-slate-400 border-2 border-white p-0.5 shadow-[0_0_14px_rgba(56,189,248,0.4)] flex items-center justify-center text-xl relative">
                        <span>{podium[0].avatar}</span>
                        <span className="absolute -bottom-1 -right-1 text-xs">{podium[0].flag}</span>
                      </div>
                      <span className="text-[11px] font-black text-white truncate max-w-[80px] mt-1.5 block">
                        {podium[0].name}
                      </span>
                      <span className="text-[9px] font-mono text-cyan-300/90 font-bold">
                        {podium[0].score}
                      </span>
                    </div>
                    {/* Pillar */}
                    <div className="w-full h-24 rounded-t-2xl bg-gradient-to-b from-[#1e3a6d] via-[#142852] to-[#0c1833] border-t-2 border-x-2 border-cyan-300/80 flex flex-col items-center justify-between py-2 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-b from-slate-200 to-slate-400 border border-white text-slate-900 font-black text-xs flex items-center justify-center shadow-md">
                        2
                      </div>
                      <span className="text-[9px] font-mono font-black text-cyan-300 tracking-wider">SILVER</span>
                    </div>
                  </div>

                  {/* Rank 1 (Gold Champion - Center Elevated) */}
                  <div className="flex-1 flex flex-col items-center -translate-y-2">
                    <div className="relative mb-2 flex flex-col items-center">
                      <span className="text-2xl -mb-1 animate-bounce filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">👑</span>
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 border-2 border-yellow-100 p-0.5 shadow-[0_0_22px_rgba(251,191,36,0.7)] flex items-center justify-center text-2xl relative">
                        <span>{podium[1].avatar}</span>
                        <span className="absolute -bottom-1 -right-1 text-sm">{podium[1].flag}</span>
                      </div>
                      <span className="text-xs font-black text-amber-200 truncate max-w-[90px] mt-1.5 block">
                        {podium[1].name}
                      </span>
                      <span className="text-[10px] font-mono text-yellow-300 font-black bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-400/40 mt-0.5">
                        {podium[1].score}
                      </span>
                    </div>
                    {/* Pillar */}
                    <div className="w-full h-32 rounded-t-2xl bg-gradient-to-b from-[#3b2d11] via-[#241a08] to-[#120d04] border-t-2 border-x-2 border-amber-300 flex flex-col items-center justify-between py-2.5 shadow-[0_0_25px_rgba(251,191,36,0.35)]">
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
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 via-orange-500 to-amber-800 border-2 border-orange-200 p-0.5 shadow-[0_0_14px_rgba(249,115,22,0.4)] flex items-center justify-center text-xl relative">
                        <span>{podium[2].avatar}</span>
                        <span className="absolute -bottom-1 -right-1 text-xs">{podium[2].flag}</span>
                      </div>
                      <span className="text-[11px] font-black text-white truncate max-w-[80px] mt-1.5 block">
                        {podium[2].name}
                      </span>
                      <span className="text-[9px] font-mono text-orange-300/90 font-bold">
                        {podium[2].score}
                      </span>
                    </div>
                    {/* Pillar */}
                    <div className="w-full h-20 rounded-t-2xl bg-gradient-to-b from-[#2e190e] via-[#1f1009] to-[#0f0704] border-t-2 border-x-2 border-amber-500/80 flex flex-col items-center justify-between py-2 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-b from-orange-300 to-amber-600 border border-white text-slate-900 font-black text-xs flex items-center justify-center shadow-md">
                        3
                      </div>
                      <span className="text-[9px] font-mono font-black text-amber-400 tracking-wider">BRONZE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leaderboard Table (Ranks 4 - 8) */}
              <div className="space-y-2 pb-2">
                <div className="flex items-center justify-between px-2 text-[10px] font-mono font-black uppercase tracking-wider text-cyan-300/60 pb-0.5">
                  <span>Rank & Player</span>
                  <span>Total Score</span>
                </div>

                {topPlayers.map((player) => (
                  <div 
                    key={player.rank}
                    className="relative group bg-gradient-to-r from-[#102761]/90 via-[#0d1e45]/90 to-[#081538]/90 border border-cyan-400/30 hover:border-cyan-400/80 rounded-2xl p-3 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Rank Number Keycap */}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#1b3d82] to-[#0d1f47] border border-cyan-400/50 text-cyan-200 font-mono font-black text-sm flex items-center justify-center shadow-inner shrink-0">
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
                        <span className="text-[10px] font-mono text-cyan-300/70 block mt-0.5">
                          {player.title}
                        </span>
                      </div>
                    </div>

                    {/* Score Tag */}
                    <div className="shrink-0 flex items-center gap-1.5 bg-black/40 border border-cyan-400/30 px-3 py-1.5 rounded-xl shadow-inner">
                      <span className="text-xs">⭐</span>
                      <span className="font-mono font-black text-xs text-cyan-200">
                        {player.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sticky Player Rank Dock (You) */}
              <div className="sticky bottom-0 z-20 -mx-3 px-3 py-2 bg-[#07132e]/95 border-t-2 border-cyan-400/60 backdrop-blur-md shadow-[0_-8px_25px_rgba(0,0,0,0.8)]">
                <div className="bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#1e40af] border-2 border-cyan-300 rounded-2xl p-3 flex items-center justify-between shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white text-blue-950 font-mono font-black text-sm flex items-center justify-center shadow-md shrink-0">
                      #{playerRank}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">🇺🇸</span>
                        <span className="font-black text-sm text-white truncate font-display">
                          Player (YOU)
                        </span>
                        <span className="text-[9px] font-black uppercase bg-emerald-400 text-emerald-950 px-1.5 py-0.2 rounded-full font-mono">
                          ACTIVE
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-100/90 block mt-0.5">
                         Level {activePlayerLevel} • Tier Master
                       </span>
                     </div>
                   </div>

                   <div className="shrink-0 flex items-center gap-1.5 bg-black/40 border border-cyan-200/50 px-3 py-1.5 rounded-xl">
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
      // 14. PUZZLE HISTORY / SAVED (Pixel Perfect to Screen 14)
      // ==========================================
      const renderHistoryScreen = () => {
        const historyItems = [
          { eq: '(12 + 8) × 2 - 6 = 34', time: 'Today • Level 3', solved: true },
          { eq: '(15 - 7) × 3 = 24', time: 'Today • Level 2', solved: true },
          { eq: '8 + 6 ÷ 2 = 11', time: 'Yesterday • Level 1', solved: true },
          { eq: '(9 × 4) ÷ 2 = 38', time: 'Yesterday • Level 3', solved: true },
          { eq: '(14 - 7) × 2 = 14', time: 'Dec 12 • Level 2', solved: false },
          { eq: '12 + 3 ÷ 5 = 9', time: 'Dec 11 • Level 1', solved: false },
        ];

        return (
          <div className="flex-1 flex flex-col bg-slate-50 select-none overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3">
              <StatusBar />

              {/* Header */}
              <div className="flex items-center gap-3 pt-1 pb-3">
                <button onClick={() => navigateTo('home')} className="p-1 text-slate-600 hover:text-slate-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <h1 className="text-base font-black font-display text-slate-900">Puzzle History</h1>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 mb-4">
                {['History', 'Saved'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setHistoryTab(tab.toLowerCase())}
                    className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      historyTab === tab.toLowerCase()
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* History Items */}
              <div className="space-y-2.5 pb-4">
                {historyItems.map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-mono text-xs">
                        🔢
                      </div>
                      <div>
                        <span className="text-xs font-bold font-mono text-slate-800 block">{item.eq}</span>
                        <span className="text-[10px] text-slate-400">{item.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.solved && <span className="text-emerald-500 font-bold text-xs">✓</span>}
                      <span className="text-slate-300 text-sm">🔖</span>
                    </div>
                  </div>
                ))}
              </div>
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
            try { localStorage.setItem('newromath_player_name', trimmed); } catch (err) {}
          }
          setIsEditingName(false);
        };

        return (
          <div className="flex-1 scifi-game-bg flex flex-col overflow-hidden text-white relative select-none">
            {/* Mathematical Coordinate Blueprint Overlay */}
            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Sticky Modern Sci-Fi Header */}
            <header className="sticky top-0 z-20 scifi-header-bg border-b border-cyan-400/20 px-4 py-3 shrink-0">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { sound.click(); navigateTo('home'); }} 
                  aria-label="Back to home" 
                  className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-xl font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ‹
                </button>
                <div />
                <button 
                  onClick={() => { sound.click(); navigateTo('settings'); }} 
                  aria-label="Settings" 
                  className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-base font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ⚙
                </button>
              </div>
            </header>

            {/* Scrollable Profile Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-24 space-y-4 relative z-10">

              {/* 1. Cyber-Cadet Hero Identity Card */}
              <div className="relative rounded-3xl p-4 bg-gradient-to-b from-[#102761]/95 via-[#0b1c48]/90 to-[#071330]/95 border border-cyan-400/40 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] overflow-hidden">
                <div className="absolute inset-0 math-blueprint-grid opacity-15 pointer-events-none" />

                {/* Top: Avatar & Name Details */}
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* 3D Cadet Avatar with Golden Level Badge */}
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#193d88] via-[#0e255a] to-[#081538] border-2 border-cyan-400/80 p-1 shadow-[0_0_16px_rgba(0,229,255,0.4)] flex items-center justify-center overflow-hidden">
                        <img 
                          src="/assets/icon_robot_3d.png" 
                          alt="Cadet Avatar" 
                          className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" 
                        />
                      </div>
                      <div className="absolute -bottom-2 -right-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-amber-950 font-black text-[9px] px-1.5 py-0.5 rounded-full border border-white/70 shadow-sm leading-none">
                        LV.{activePlayerLevel}
                      </div>
                    </div>

                    {/* Name, Status & Country */}
                    <div className="min-w-0">
                      {isEditingName ? (
                        <form onSubmit={handleSaveName} className="flex items-center gap-1.5 mb-1">
                          <input 
                            type="text" 
                            value={nameInput} 
                            onChange={(e) => setNameInput(e.target.value)} 
                            maxLength={15}
                            autoFocus
                            className="bg-[#06142e] border border-cyan-400 rounded-lg px-2 py-0.5 text-xs text-white font-bold outline-none w-28"
                          />
                          <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black px-2 py-1 rounded-md">
                            OK
                          </button>
                        </form>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <h2 className="text-base sm:text-lg font-black font-display text-white tracking-wide truncate">
                            {playerName}
                          </h2>
                          <button 
                            onClick={() => { setNameInput(playerName); setIsEditingName(true); }}
                            aria-label="Edit Name"
                            className="w-5 h-5 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-[10px] flex items-center justify-center hover:bg-cyan-800 transition-colors cursor-pointer"
                          >
                            ✎
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] bg-gradient-to-r from-blue-600/80 to-indigo-600/80 border border-blue-400/40 text-cyan-200 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                          {activePlayerLevel >= 25 ? 'GRAND MASTER' : activePlayerLevel >= 10 ? 'CYBER VETERAN' : 'PRO CADET'}
                        </span>
                        <span className="text-xs text-slate-300">🇺🇸 USA</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 3D Trophy Crest */}
                  <div className="relative shrink-0 flex flex-col items-center justify-center px-2 py-1.5 rounded-2xl bg-gradient-to-b from-[#1b4394]/60 to-[#0c204d]/80 border border-cyan-400/40 shadow-inner">
                    <img src="/assets/icon_trophy_3d.png" alt="Trophy" className="w-8 h-8 object-contain drop-shadow-[0_2px_6px_rgba(255,200,0,0.5)]" />
                    <span className="text-[8.5px] font-black text-amber-300 uppercase tracking-tight mt-0.5">
                      RANK #{playerRank}
                    </span>
                  </div>
                </div>

                {/* Middle: Dynamic Neon XP Progress */}
                <div className="relative z-10 mt-4 bg-[#06122d]/80 border border-cyan-500/25 rounded-2xl p-2.5">
                  <div className="flex items-center justify-between text-[10.5px] font-bold mb-1.5">
                    <span className="text-cyan-300 flex items-center gap-1">
                      <span>⚡</span> Level {activePlayerLevel} Progress
                    </span>
                    <span className="text-sky-200 font-mono">
                      {playerXp} / {xpNeeded} XP ({Math.min(100, Math.round((playerXp / xpNeeded) * 100))}%)
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#030919] border border-cyan-500/40 overflow-hidden p-0.5 shadow-inner">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-[#00d2ff] via-[#2f75f7] to-[#a855f7] shadow-[0_0_12px_rgba(0,210,255,0.8)] transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(12, Math.round((playerXp / xpNeeded) * 100)))}%` }}
                    />
                  </div>
                </div>

                {/* Bottom: 4 Treasury & Metric Pillars */}
                <div className="relative z-10 grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-cyan-400/15">
                  {/* 1. Coins */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#09183d]/90 border border-amber-400/30 shadow-xs">
                    <img src="/assets/icon_gold_coin_3d_clean.png" alt="Coins" className="w-4 h-4 object-contain mb-0.5" />
                    <span className="text-xs font-black text-amber-300 font-display leading-none">
                      {coins.toLocaleString()}
                    </span>
                    <span className="text-[8.5px] text-amber-200/70 font-semibold uppercase tracking-tight mt-0.5">
                      Coins
                    </span>
                  </div>

                  {/* 2. Gems */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#09183d]/90 border border-cyan-400/30 shadow-xs">
                    <img src="/assets/icon_gem_3d_clean.png" alt="Gems" className="w-4 h-4 object-contain mb-0.5" />
                    <span className="text-xs font-black text-cyan-300 font-display leading-none">
                      {gems}
                    </span>
                    <span className="text-[8.5px] text-cyan-200/70 font-semibold uppercase tracking-tight mt-0.5">
                      Diamonds
                    </span>
                  </div>

                  {/* 3. Streak */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#09183d]/90 border border-orange-400/30 shadow-xs">
                    <span className="text-sm mb-0.5">🔥</span>
                    <span className="text-xs font-black text-orange-300 font-display leading-none">
                      {streakDays}d
                    </span>
                    <span className="text-[8.5px] text-orange-200/70 font-semibold uppercase tracking-tight mt-0.5">
                      Streak
                    </span>
                  </div>

                  {/* 4. Level */}
                  <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-[#09183d]/90 border border-purple-400/30 shadow-xs">
                    <img src="/assets/icon_star_3d.png" alt="Level" className="w-4 h-4 object-contain mb-0.5" />
                    <span className="text-xs font-black text-purple-300 font-display leading-none">
                      Lv.{activePlayerLevel}
                    </span>
                    <span className="text-[8.5px] text-purple-200/70 font-semibold uppercase tracking-tight mt-0.5">
                      Tier
                    </span>
                  </div>
                </div>
              </div>



              {/* 4. Cyber Performance Statistics Cards */}
              {/* Card 1: Battle Records */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-sm">
                      🎮
                    </div>
                    <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                      Battle Performance
                    </h3>
                  </div>
                  <span className="text-[10px] text-cyan-300/70 font-mono">
                    Win Rate: <strong className="text-emerald-300">{winRate}%</strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#050f26]/80 border border-cyan-400/20 rounded-xl p-2 text-center">
                    <span className="text-[9px] text-sky-300/80 uppercase font-bold block">Puzzles Played</span>
                    <span className="text-sm font-black text-white font-display block mt-0.5">{gamesStarted}</span>
                  </div>
                  <div className="bg-[#050f26]/80 border border-cyan-400/20 rounded-xl p-2 text-center">
                    <span className="text-[9px] text-emerald-300/80 uppercase font-bold block">Puzzles Solved</span>
                    <span className="text-sm font-black text-emerald-300 font-display block mt-0.5">{gamesWon}</span>
                  </div>
                  <div className="bg-[#050f26]/80 border border-cyan-400/20 rounded-xl p-2 text-center">
                    <span className="text-[9px] text-amber-300/80 uppercase font-bold block">Total Score</span>
                    <span className="text-sm font-black text-amber-300 font-display block mt-0.5">{totalScore}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Speed & Precision */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-sm">
                      ⏱️
                    </div>
                    <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                      Speed & Precision
                    </h3>
                  </div>
                  <span className="text-[10px] text-sky-300/70 font-mono">Real-time Metrics</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#050f26]/80 border border-cyan-400/20 rounded-xl p-2 flex items-center justify-between">
                    <span className="text-[10px] text-sky-200 font-semibold">Best Time</span>
                    <span className="text-xs font-black text-emerald-300 font-mono">00:38s</span>
                  </div>
                  <div className="bg-[#050f26]/80 border border-cyan-400/20 rounded-xl p-2 flex items-center justify-between">
                    <span className="text-[10px] text-sky-200 font-semibold">Average Pace</span>
                    <span className="text-xs font-black text-cyan-300 font-mono">01:14s</span>
                  </div>
                  <div className="bg-[#050f26]/80 border border-cyan-400/20 rounded-xl p-2 flex items-center justify-between">
                    <span className="text-[10px] text-sky-200 font-semibold">Max Streak</span>
                    <span className="text-xs font-black text-orange-300 font-mono">{streakDays} Days</span>
                  </div>
                  <div className="bg-[#050f26]/80 border border-cyan-400/20 rounded-xl p-2 flex items-center justify-between">
                    <span className="text-[10px] text-sky-200 font-semibold">Hints Consumed</span>
                    <span className="text-xs font-black text-purple-300 font-mono">3 Hints</span>
                  </div>
                </div>
              </div>

              {/* 5. Honors & Badges Showcase */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏅</span>
                    <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                      Cadet Honors & Badges
                    </h3>
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold">3 / 4 Unlocked</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Badge 1 */}
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#06142e]/90 border border-amber-400/40 shadow-xs">
                    <img src="/assets/icon_brain_3d.png" alt="Badge" className="w-7 h-7 object-contain shrink-0 drop-shadow" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-black text-white truncate">Logic Prodigy</div>
                      <div className="text-[9px] text-amber-300 font-semibold">Master Level 3</div>
                    </div>
                  </div>

                  {/* Badge 2 */}
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#06142e]/90 border border-cyan-400/40 shadow-xs">
                    <img src="/assets/icon_stopwatch_3d.png" alt="Badge" className="w-7 h-7 object-contain shrink-0 drop-shadow" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-black text-white truncate">Speed Demon</div>
                      <div className="text-[9px] text-cyan-300 font-semibold">Under 45s</div>
                    </div>
                  </div>

                  {/* Badge 3 */}
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#06142e]/90 border border-purple-400/40 shadow-xs">
                    <img src="/assets/icon_gem_3d_clean.png" alt="Badge" className="w-7 h-7 object-contain shrink-0 drop-shadow" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-black text-white truncate">Gem Tycoon</div>
                      <div className="text-[9px] text-purple-300 font-semibold">25+ Diamonds</div>
                    </div>
                  </div>

                  {/* Badge 4 (Locked) */}
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-[#06142e]/50 border border-slate-600/30 opacity-70">
                    <div className="w-7 h-7 rounded-lg bg-slate-800/80 flex items-center justify-center text-sm shrink-0">
                      🔒
                    </div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-black text-slate-300 truncate">Grand Master</div>
                      <div className="text-[9px] text-slate-400 font-semibold">Reach Level 25</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. Action Controls */}
              <div className="flex items-center gap-3 pt-2">
                <button 
                  onClick={() => {
                    sound.tap();
                    if (confirm('Reset your profile game statistics?')) {
                      sound.click();
                      alert('Statistics have been reset.');
                    }
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-rose-500/40 bg-rose-950/30 text-rose-300 hover:bg-rose-900/40 active:scale-95 text-xs font-bold font-display uppercase tracking-wider transition-all text-center shadow-[0_0_10px_rgba(244,63,94,0.2)] cursor-pointer"
                >
                  Reset Stats
                </button>
                <button 
                  onClick={() => {
                    sound.click();
                    confetti({ particleCount: 40, spread: 60 });
                    alert(`Profile of ${playerName} ready to share!`);
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black font-display text-xs uppercase tracking-wider active:scale-95 transition-all text-center shadow-[0_4px_16px_rgba(0,210,255,0.4)] cursor-pointer"
                >
                  Share Profile
                </button>
              </div>

            </div>
          </div>
        );
      };

      // ========================================================
      // 16. SETTINGS SCREEN (Cyber Arcade Modernization)
      // ========================================================
      const renderSettingsScreen = () => {
        const CyberToggle = ({ checked, onChange, label, sublabel, icon }) => (
          <div 
            onClick={() => {
              sound.click();
              onChange(!checked);
            }}
            className="flex items-center justify-between p-3 rounded-xl bg-[#071536]/80 border border-cyan-400/20 hover:border-cyan-400/40 hover:bg-[#091b42]/80 transition-all cursor-pointer group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0 pr-3">
              {icon && (
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 border transition-all ${checked ? 'bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_8px_rgba(0,229,255,0.25)]' : 'bg-slate-800/40 border-slate-700/50 text-slate-400'}`}>
                  {icon}
                </div>
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
            
            {/* Cyber Neon Pill Toggle */}
            <div 
              className={`relative shrink-0 w-12 h-6 rounded-full transition-all duration-300 border p-0.5 ${
                checked 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.6)]' 
                  : 'bg-[#030919] border-slate-700/80 shadow-inner'
              }`}
            >
              <div 
                className={`w-5 h-5 rounded-full bg-white transition-all duration-300 shadow-md flex items-center justify-center text-[9px] font-black ${
                  checked 
                    ? 'translate-x-6 text-cyan-600' 
                    : 'translate-x-0 text-slate-400'
                }`}
              >
                {checked ? '✓' : ''}
              </div>
            </div>
          </div>
        );

        const CyberNavRow = ({ label, sublabel, icon, onClick, badge }) => (
          <button 
            onClick={() => {
              sound.click();
              onClick();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#071536]/80 border border-cyan-400/20 hover:border-cyan-400/40 hover:bg-[#0c2254]/80 transition-all cursor-pointer group active:scale-[0.99] text-left"
          >
            <div className="flex items-center gap-3 min-w-0 pr-3">
              {icon && (
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-sm shrink-0 text-cyan-300 group-hover:scale-105 group-hover:border-cyan-400/60 transition-transform">
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white tracking-wide flex items-center gap-2">
                  {label}
                  {badge && (
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40">
                      {badge}
                    </span>
                  )}
                </div>
                {sublabel && (
                  <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                    {sublabel}
                  </div>
                )}
              </div>
            </div>
            <div className="w-7 h-7 rounded-lg bg-[#040e24] border border-cyan-400/30 flex items-center justify-center text-cyan-400 text-sm font-black group-hover:translate-x-0.5 group-hover:text-cyan-200 transition-all">
              ›
            </div>
          </button>
        );

        return (
          <div className="flex-1 scifi-game-bg flex flex-col overflow-hidden text-white relative select-none">
            {/* Mathematical Coordinate Blueprint Overlay */}
            <div className="absolute inset-0 math-blueprint-grid opacity-20 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Sticky Modern Sci-Fi Header */}
            <header className="sticky top-0 z-20 scifi-header-bg border-b border-cyan-400/20 px-4 py-3 shrink-0 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { sound.click(); navigateTo('profile'); }} 
                  aria-label="Back to profile" 
                  className="w-10 h-10 rounded-xl bg-gradient-to-b from-[#1b4394] to-[#12306d] border border-cyan-400/70 text-cyan-300 flex items-center justify-center text-xl font-bold shadow-[0_0_12px_rgba(0,229,255,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  ‹
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚙️</span>
                  <h1 className="text-base sm:text-lg font-black font-display tracking-wider bg-gradient-to-r from-cyan-300 via-sky-100 to-white bg-clip-text text-transparent uppercase">
                    System Settings
                  </h1>
                </div>
                <div className="w-10 h-10" />
              </div>
            </header>

            {/* Scrollable Settings Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-24 space-y-4 relative z-10">

              {/* 1. Treasury & Store Quick Jump Banner */}
              <div className="relative rounded-2xl p-3.5 bg-gradient-to-r from-[#122e6b] via-[#0d2354] to-[#071536] border border-amber-400/40 shadow-[0_8px_24px_rgba(0,0,0,0.5)] overflow-hidden flex items-center justify-between">
                <div className="absolute right-0 top-0 bottom-0 w-36 bg-gradient-to-l from-amber-500/15 to-transparent pointer-events-none" />
                <div className="relative z-10 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/30 to-amber-600/30 border border-amber-400/60 flex items-center justify-center shadow-[0_0_12px_rgba(251,191,36,0.3)]">
                    <img src="/assets/icon_gem_3d_clean.png" alt="Treasury" className="w-7 h-7 object-contain" />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-black font-display text-white tracking-wide flex items-center gap-1.5">
                      <span>CYBER TREASURY & STORE</span>
                      <span className="text-[9px] font-black px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded-full">HOT</span>
                    </div>
                    <div className="text-[10px] text-amber-200/80 font-medium mt-0.5">
                      Unlock avatars, power-ups & daily rewards
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => { sound.click(); navigateTo('achievements'); }}
                  className="relative z-10 shrink-0 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black text-xs shadow-[0_0_10px_rgba(251,191,36,0.5)] active:scale-95 transition-all cursor-pointer"
                >
                  VISIT ›
                </button>
              </div>

              {/* 2. Audio & Haptics Group */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-sm text-cyan-300">
                    🔊
                  </div>
                  <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                    Audio & Sensory Feedback
                  </h3>
                </div>

                <div className="space-y-2">
                  <CyberToggle 
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
                    icon="🎵"
                  />
                  <CyberToggle 
                    checked={hapticsEnabled}
                    onChange={(val) => setHapticsEnabled(val)}
                    label="Haptic Feedback"
                    sublabel="Vibration pulses on keypad presses and matches"
                    icon="📳"
                  />
                  <CyberToggle 
                    checked={timerEnabled}
                    onChange={(val) => setTimerEnabled(val)}
                    label="Game Timer"
                    sublabel="Display countdown clock during puzzle battles"
                    icon="⏱️"
                  />
                </div>
              </div>

              {/* 3. Gameplay Preferences Group */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-sm text-indigo-300">
                    🎮
                  </div>
                  <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                    Gameplay & Display
                  </h3>
                </div>

                <div className="space-y-2">
                  <CyberToggle 
                    checked={explanationEnabled}
                    onChange={(val) => setExplanationEnabled(val)}
                    label="Show Explanation Button"
                    sublabel="Reveal step-by-step mathematical reasoning"
                    icon="💡"
                  />
                  <CyberToggle 
                    checked={autoSubmitEnabled}
                    onChange={(val) => setAutoSubmitEnabled(val)}
                    label="Auto Submit Answer"
                    sublabel="Automatically verify once the equation is filled"
                    icon="⚡"
                  />
                  <CyberToggle 
                    checked={largeFontEnabled}
                    onChange={(val) => setLargeFontEnabled(val)}
                    label="Large Cyber Font"
                    sublabel="High-legibility enlarged arithmetic tiles"
                    icon="🔍"
                  />

                  {/* Division Symbol Notation Selector */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#071536]/80 border border-cyan-400/20">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-sm text-indigo-300">
                        ➗
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white tracking-wide">Division Notation</div>
                        <div className="text-[10px] text-slate-400 font-medium">Choose arithmetic operator symbol</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#030919] p-1 rounded-xl border border-cyan-500/30 shadow-inner">
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

              {/* 4. Support & Community Group */}
              <div className="rounded-2xl p-3.5 bg-gradient-to-b from-[#0e245a]/90 to-[#071536]/95 border border-cyan-400/30 shadow-lg relative overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-sm text-emerald-300">
                    🌐
                  </div>
                  <h3 className="text-xs font-black font-display uppercase tracking-wider text-cyan-200">
                    Community & Assistance
                  </h3>
                </div>

                <div className="space-y-2">
                  <CyberNavRow 
                    label="How to Play" 
                    sublabel="Master rules, tips & tactical formulas"
                    icon="📖"
                    onClick={() => navigateTo('help')}
                  />
                  <CyberNavRow 
                    label="Send Feedback" 
                    sublabel="Report bugs or suggest new game features"
                    icon="💬"
                    onClick={() => navigateTo('help')}
                  />
                  <CyberNavRow 
                    label="Become a Volunteer Translator" 
                    sublabel="Help localize NewroMath for global players"
                    icon="🌍"
                    onClick={() => navigateTo('help')}
                  />
                  <CyberNavRow 
                    label="Redeem Promo Code" 
                    sublabel="Enter secret voucher for bonus coins & gems"
                    icon="🎁"
                    badge="VOUCHER"
                    onClick={() => {
                      const code = prompt('Enter your Cyber Promo Code:');
                      if (code && code.trim()) {
                        sound.fanfare();
                        alert(`Promo code "${code.trim().toUpperCase()}" submitted! Rewards will synchronize shortly.`);
                      }
                    }}
                  />
                </div>
              </div>

              {/* 5. System & Legal Footer */}
              <div className="pt-2 pb-8 text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#050f26]/90 border border-cyan-500/30 text-[10.5px] text-cyan-300 font-mono shadow-inner">
                  <span className="text-cyan-400">⚡</span> NEWROMATH CYBER ENGINE v1.0.0
                </div>
                <div className="flex items-center justify-center gap-3 text-xs font-semibold text-sky-400/80 pt-1">
                  <button onClick={() => navigateTo('help')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                    Privacy Policy
                  </button>
                  <span className="text-slate-600">•</span>
                  <button onClick={() => navigateTo('help')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                    Terms of Service
                  </button>
                  <span className="text-slate-600">•</span>
                  <button onClick={() => navigateTo('help')} className="hover:text-cyan-300 transition-colors cursor-pointer">
                    Support
                  </button>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  © 2026 NewroMath Systems. All rights reserved.
                </div>
              </div>

            </div>
          </div>
        );
      };

      // ========================================================
      // 17. HELP & SUPPORT (Pixel Perfect to Screen 17)
      // ==========================================
      const renderHelpScreen = () => {
        const supportItems = [
          { label: 'FAQs', desc: 'Find answers to common questions', icon: '❓' },
          { label: 'Contact Us', desc: 'Get in touch with our team', icon: '✉️' },
          { label: 'Report a Problem', desc: 'Help us improve the app', icon: '⚠️' },
          { label: 'Feedback', desc: 'Share your thoughts', icon: '💬' },
        ];

        return (
          <div className="flex-1 flex flex-col bg-slate-50 select-none overflow-hidden">
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 py-3">
              <StatusBar />

              {/* Header */}
              <div className="flex items-center gap-3 pt-1 pb-3">
                <button onClick={() => navigateTo('settings')} className="p-1 text-slate-600 hover:text-slate-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <h1 className="text-base font-black font-display text-slate-900">Help & Support</h1>
              </div>

              {/* Cards List */}
              <div className="space-y-2.5 my-2 pb-4">
                {supportItems.map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:border-slate-300 active:scale-[0.99] transition-all">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900">{item.label}</h3>
                        <p className="text-[10px] text-slate-400">{item.desc}</p>
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm">›</span>
                  </div>
                ))}
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

        const handleBuyPackage = (type, amount, price) => {
          sound.click();
          sound.correct();
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
          if (type === 'coins') {
            setCoins(c => c + amount);
            setRewardToast(`🎉 Purchase Successful: +${amount.toLocaleString()} Coins!`);
          } else {
            setGems(g => g + amount);
            setRewardToast(`💎 Purchase Successful: +${amount.toLocaleString()} Gems!`);
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
              <div className="flex items-center gap-2">
                {/* Coins */}
                <div className="flex items-center gap-1 bg-[#0d2250]/80 border border-amber-400/50 rounded-full px-2 py-0.5 shadow-xs">
                  <span className="text-xs">🪙</span>
                  <span className="text-amber-300 font-black text-xs font-display">
                    {coins.toLocaleString()}
                  </span>
                </div>
                {/* Gems */}
                <div className="flex items-center gap-1 bg-[#0d2250]/80 border border-cyan-400/50 rounded-full px-2 py-0.5 shadow-xs">
                  <span className="text-xs">💎</span>
                  <span className="text-cyan-200 font-black text-xs font-display">
                    {gems.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pt-3 pb-8 space-y-4 max-w-md mx-auto w-full">
              
              {/* Toast Notification if present */}
              {rewardToast && (
                <div className="sticky top-2 z-30 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 border border-emerald-300/80 rounded-xl p-2.5 text-center text-xs font-black shadow-[0_4px_20px_rgba(16,185,129,0.5)] animate-in slide-in-from-top duration-200">
                  {rewardToast}
                </div>
              )}

              {/* 1. Daily Free Gift Banner */}
              <div className="relative rounded-2xl bg-gradient-to-r from-[#17307a] via-[#214399] to-[#122b6d] border border-cyan-400/40 p-3.5 shadow-[0_6px_20px_rgba(0,229,255,0.25)] flex items-center justify-between gap-3 overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-400/10 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-center gap-3">
                  <img 
                    src="/assets/reward_gift_dial_full.png" 
                    alt="Daily Reward" 
                    className="w-14 h-14 object-contain shrink-0 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)] animate-pulse" 
                  />
                  <div>
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-300 block">Daily Free Bonus</span>
                    <h3 className="text-xs font-black text-white">Daily Mystery Chest</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-amber-300 flex items-center gap-0.5">🪙 +350</span>
                      <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-0.5">💎 +5</span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={dailyGiftClaimed}
                  onClick={handleClaimDailyGift}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wide uppercase transition-all shadow-md active:scale-95 shrink-0 ${
                    dailyGiftClaimed
                      ? 'bg-slate-700/60 border border-slate-600/50 text-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 border border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.5)] cursor-pointer'
                  }`}
                >
                  {dailyGiftClaimed ? 'Claimed ✓' : 'Claim Free'}
                </button>
              </div>

              {/* 2. Collect via Ads Section */}
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

                <div className="grid grid-cols-2 gap-2">
                  {/* Ad Option 1: Gold Coins */}
                  <div className="bg-gradient-to-b from-[#132c66] to-[#0d1d45] border border-amber-400/40 rounded-2xl p-3 flex flex-col justify-between items-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-400/50 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(245,158,11,0.3)] mb-1.5">
                      🪙
                    </div>
                    <span className="text-xs font-black text-amber-300">+250 Coins</span>
                    <span className="text-[9px] text-slate-300 mb-2">Instant Reward</span>
                    <button
                      onClick={() => handleWatchAd('coins', 250, 'Coin Sponsor Video')}
                      className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-black text-[11px] shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>▶</span>
                      <span>Watch Ad</span>
                    </button>
                  </div>

                  {/* Ad Option 2: Diamonds */}
                  <div className="bg-gradient-to-b from-[#132c66] to-[#0d1d45] border border-cyan-400/40 rounded-2xl p-3 flex flex-col justify-between items-center text-center shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-400/20 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(6,182,212,0.3)] mb-1.5">
                      💎
                    </div>
                    <span className="text-xs font-black text-cyan-200">+10 Diamonds</span>
                    <span className="text-[9px] text-slate-300 mb-2">Instant Reward</span>
                    <button
                      onClick={() => handleWatchAd('gems', 10, 'Diamond Sponsor Video')}
                      className="w-full py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-blue-950 font-black text-[11px] shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>▶</span>
                      <span>Watch Ad</span>
                    </button>
                  </div>
                </div>

                {/* Ad Option 3: Big Jackpot Chest Ad */}
                <div className="bg-gradient-to-r from-[#173070] via-[#214399] to-[#12285a] border border-purple-400/40 rounded-2xl p-2.5 flex items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-lg">
                      👑
                    </div>
                    <div>
                      <span className="text-xs font-black text-purple-200 block">Jackpot Ad Chest</span>
                      <span className="text-[10px] text-amber-300 font-bold">🪙 +600 Coins & 💎 +15 Gems</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleWatchAd('jackpot', 600, 'Jackpot Mega Sponsor')}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-[10px] border border-purple-300/70 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    ▶ Watch (15s)
                  </button>
                </div>
              </div>

              {/* 3. Gold Coin Store */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-400 text-xs">🪙</span>
                    <h2 className="text-[11px] font-extrabold uppercase tracking-wider font-display text-amber-200">
                      Gold Coin Store
                    </h2>
                  </div>
                  <span className="text-[9px] font-bold text-amber-400/80">
                    Use Gems or Buy
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'c1', name: 'Handful of Gold', coins: 1500, gemsCost: 10, price: '$0.99', badge: null, icon: '🪙' },
                    { id: 'c2', name: 'Pouch of Gold', coins: 5000, gemsCost: 25, price: '$1.99', badge: 'POPULAR', icon: '💰' },
                    { id: 'c3', name: 'Chest of Gold', coins: 15000, gemsCost: 65, price: '$4.99', badge: 'BEST VALUE', icon: '📦' },
                    { id: 'c4', name: 'Vault of Gold', coins: 45000, gemsCost: 160, price: '$9.99', badge: 'MEGA PACK', icon: '🏦' },
                  ].map((pack) => (
                    <div key={pack.id} className="relative bg-gradient-to-b from-[#11295e] to-[#0a1a3e] border border-amber-400/30 rounded-2xl p-2.5 flex flex-col justify-between shadow-md">
                      {pack.badge && (
                        <span className="absolute -top-1.5 right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-amber-950 font-black text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-tight shadow-xs">
                          {pack.badge}
                        </span>
                      )}
                      <div className="text-center pt-1">
                        <span className="text-2xl block mb-1">{pack.icon}</span>
                        <h4 className="text-[11px] font-extrabold text-white leading-tight">{pack.name}</h4>
                        <span className="text-xs font-black text-amber-300 font-display block mt-0.5">
                          +{pack.coins.toLocaleString()}
                        </span>
                      </div>

                      <div className="space-y-1 mt-2.5">
                        <button
                          onClick={() => handleExchangeCoins(pack.gemsCost, pack.coins)}
                          className="w-full py-1 rounded-lg bg-[#0e275c] hover:bg-[#163a82] border border-cyan-400/50 text-[10px] font-bold text-cyan-200 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer shadow-xs"
                          title="Exchange with Gems"
                        >
                          <span>💎</span>
                          <span>{pack.gemsCost} Gems</span>
                        </button>
                        <button
                          onClick={() => handleBuyPackage('coins', pack.coins, pack.price)}
                          className="w-full py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-amber-950 text-[10px] font-black active:scale-95 transition-all cursor-pointer shadow-xs"
                        >
                          {pack.price}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Diamond Store */}
              <div className="space-y-2">
                <div className="flex items-center justify-between px-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-cyan-400 text-xs">💎</span>
                    <h2 className="text-[11px] font-extrabold uppercase tracking-wider font-display text-cyan-200">
                      Diamond Store
                    </h2>
                  </div>
                  <span className="text-[9px] font-bold text-cyan-400/80">
                    Premium Gems
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'g1', name: 'Pile of Gems', gems: 50, price: '$0.99', badge: null, icon: '💎' },
                    { id: 'g2', name: 'Crystal Casket', gems: 200, price: '$2.99', badge: 'HOT', icon: '✨' },
                    { id: 'g3', name: 'Crown of Gems', gems: 600, price: '$6.99', badge: 'POPULAR', icon: '👑' },
                    { id: 'g4', name: 'Diamond Mountain', gems: 2000, price: '$19.99', badge: 'BEST DEAL', icon: '🏔️' },
                  ].map((pack) => (
                    <div key={pack.id} className="relative bg-gradient-to-b from-[#11295e] to-[#0a1a3e] border border-cyan-400/40 rounded-2xl p-2.5 flex flex-col justify-between shadow-md">
                      {pack.badge && (
                        <span className="absolute -top-1.5 right-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-blue-950 font-black text-[8px] px-1.5 py-0.5 rounded-full uppercase tracking-tight shadow-xs">
                          {pack.badge}
                        </span>
                      )}
                      <div className="text-center pt-1">
                        <span className="text-2xl block mb-1">{pack.icon}</span>
                        <h4 className="text-[11px] font-extrabold text-white leading-tight">{pack.name}</h4>
                        <span className="text-xs font-black text-cyan-200 font-display block mt-0.5">
                          +{pack.gems.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => handleBuyPackage('gems', pack.gems, pack.price)}
                        className="w-full mt-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:brightness-110 text-white text-[10px] font-black active:scale-95 transition-all cursor-pointer shadow-xs border border-cyan-300/40"
                      >
                        {pack.price}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
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
          case 'categories': return renderCategoriesScreen();
          case 'levels': return renderLevelSelectScreen();
          case 'game': return renderGameScreen();
          case 'hint': return renderHintScreen();
          case 'correct': return renderCorrectScreen();
          case 'wrong': return renderWrongScreen();
          case 'daily': return renderDailyScreen();
          case 'battle': return renderBattleScreen();
          case 'stats': return renderStatsScreen();
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

          {isPageLoading && <SlidingTileLoader />}

          {/* 3D Cyber-Arcade Flying Number Tiles Layer */}
          {flyingTiles.length > 0 && (
            <div className="absolute inset-0 pointer-events-none z-[9999] overflow-hidden">
              {flyingTiles.map(tile => (
                <FlyingTileItem
                  key={tile.id}
                  tile={tile}
                  largeFontEnabled={largeFontEnabled}
                  onFinish={(t) => {
                    setFlyingTiles(prev => prev.filter(item => item.id !== t.id));
                    if (t.isReturn) {
                      finalizeReturn(t.number);
                    } else {
                      finalizePlacement(t.number, t.targetSlot);
                    }
                  }}
                />
              ))}
            </div>
          )}
          {/* Cyber Notification Toast Banner */}
          {rewardToast && (
            <div className="fixed top-5 inset-x-4 z-50 flex justify-center pointer-events-none animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="bg-gradient-to-r from-[#0d2254]/95 via-[#153473]/95 to-[#0c1f4a]/95 border-2 border-cyan-400/80 rounded-2xl px-4 py-2.5 shadow-[0_8px_25px_rgba(0,229,255,0.6)] text-white font-black text-xs font-display flex items-center gap-2 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span>{rewardToast}</span>
              </div>
            </div>
          )}

          {/* Insufficient Resources — 3D Glassmorphism Banner Modal */}
          {insufficientFundsModal.isOpen && (() => {
            const need = insufficientFundsModal.cost;
            const rows = [
              { key: 'coins', icon: '/assets/icon_gold_coin_3d_clean.png', have: coins, need: need.coins, tone: 'amber' },
              { key: 'gems', icon: '/assets/icon_gem_3d_clean.png', have: gems, need: need.gems, tone: 'cyan' }
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
                  className="relative w-full max-w-[325px] sm:max-w-[340px] rounded-[38px] p-6 pt-14 bg-gradient-to-b from-white/95 via-[#f0f7ff]/95 to-[#e0efff]/95 border-2 border-white/90 shadow-[0_25px_60px_-10px_rgba(8,24,68,0.6),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(56,189,248,0.2)] text-center overflow-visible"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Close Button (Top-Right) */}
                  <button
                    onClick={closeModal}
                    aria-label="Close"
                    title="Close"
                    className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-blue-100/90 hover:bg-blue-200 border border-white text-[#1e3a8a] flex items-center justify-center font-black active:scale-90 transition-all cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>

                  {/* 3D Floating Hero: Glowing Coin & Diamond Pod + Splash Petals + Arched 3D Banner */}
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 flex flex-col items-center pointer-events-none z-20">
                    {/* Cloud base & Splash petals behind hero */}
                    <div className="relative flex items-center justify-center">
                      <div className="absolute -bottom-2 w-32 h-14 bg-gradient-to-t from-[#bae6fd] to-white rounded-full blur-[1px] shadow-sm -z-10" />

                      {/* Left Splashes */}
                      <svg className="absolute -left-1 top-2 w-9 h-9 text-[#38bdf8] drop-shadow-[0_2px_6px_rgba(56,189,248,0.5)] -rotate-12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                      <svg className="absolute -left-4 top-8 w-6 h-6 text-[#0ea5e9] drop-shadow-[0_2px_4px_rgba(14,165,233,0.4)] -rotate-45" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>

                      {/* Right Splashes */}
                      <svg className="absolute -right-1 top-2 w-9 h-9 text-[#38bdf8] drop-shadow-[0_2px_6px_rgba(56,189,248,0.5)] rotate-12 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                      <svg className="absolute -right-4 top-8 w-6 h-6 text-[#0ea5e9] drop-shadow-[0_2px_4px_rgba(14,165,233,0.4)] rotate-45 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>

                      {/* Sparkle Stars */}
                      <div className="absolute -top-3 -left-3 text-amber-400 font-bold text-lg select-none">✦</div>
                      <div className="absolute -top-2 -right-3 text-amber-400 font-bold text-lg select-none">✦</div>

                      {/* 3D Circular Gloss Pod for Coin & Gem */}
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border-2 border-white/90 shadow-[0_8px_20px_rgba(14,165,233,0.45),inset_0_2px_4px_rgba(255,255,255,0.7)] flex items-center justify-center">
                        <div className="absolute inset-1 rounded-full bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                        <img src="/assets/icon_gold_coin_3d_clean.png" alt="" className="w-10 h-10 object-contain -translate-x-1.5 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
                        <img src="/assets/icon_gem_3d_clean.png" alt="" className="absolute w-8 h-8 object-contain translate-x-4 translate-y-3 drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]" />
                        {/* Exclamation badge */}
                        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-rose-500 to-red-600 border-2 border-white flex items-center justify-center shadow-md">
                          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <path d="M12 7v6M12 17h.01" />
                          </svg>
                        </span>
                      </div>
                    </div>

                    {/* Arched 3D Banner "Need Funds" */}
                    <div className="relative -mt-3 w-56 h-12 flex items-center justify-center filter drop-shadow-[0_6px_12px_rgba(29,78,216,0.5)]">
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
                      <div className="relative z-10 flex items-center justify-center gap-1.5 pb-1 select-none">
                        <span className="text-amber-300 text-sm filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">⭐</span>
                        <span className="font-black text-xl tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] font-display">
                          Need <span className="text-[#fde047] drop-shadow-[0_2px_4px_rgba(180,83,9,0.8)]">Funds</span>
                        </span>
                        <span className="text-amber-300 text-sm filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">⭐</span>
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
                            setRewardToast(`⚡ +350 Coins & +15 Diamonds Claimed! Launching Level ${targetLvl}...`);
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
                        <img src="/assets/icon_gold_coin_3d_clean.png" alt="" className="w-3.5 h-3.5 object-contain" />
                        <span>+15</span>
                        <img src="/assets/icon_gem_3d_clean.png" alt="" className="w-3.5 h-3.5 object-contain" />
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

                  {/* Corner Water Droplets Decorations */}
                  <div className="absolute bottom-3 left-3 pointer-events-none opacity-80">
                    <svg className="w-6 h-6 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l3.5 3.5a5 5 0 1 1-7 0z" />
                    </svg>
                  </div>
                  <div className="absolute bottom-3 right-3 pointer-events-none opacity-80">
                    <svg className="w-6 h-6 text-sky-400 scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.69l3.5 3.5a5 5 0 1 1-7 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Interactive Global Simulated Ad Modal */}
          {adModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-gradient-to-b from-[#14285e] to-[#0b1736] border border-cyan-400/60 rounded-3xl p-5 max-w-xs w-full shadow-[0_0_30px_rgba(0,229,255,0.4)] text-center space-y-4">
                {/* Ad Header with Countdown */}
                <div className="flex items-center justify-between border-b border-cyan-400/20 pb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-cyan-300">
                    ⚡ Sponsor Video
                  </span>
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded-full border border-amber-400/30">
                    {adCountdown > 0 ? `Reward in ${adCountdown}s` : 'Reward Ready! ✓'}
                  </span>
                </div>

                {/* Ad Creative Simulation */}
                <div className="h-40 rounded-2xl bg-gradient-to-br from-[#1d4ed8] via-[#1e3a8a] to-[#0f172a] border border-cyan-400/30 p-3 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="text-4xl mb-2 animate-bounce">
                    {adReward.type === 'coins' ? '🪙' : adReward.type === 'gems' ? '💎' : adReward.type === 'time' ? '⏱️' : '⚡'}
                  </div>
                  <span className="text-xs font-black text-white">{adReward.title}</span>
                  <span className="text-[10px] text-cyan-200 mt-1">
                    {adReward.type === 'both'
                      ? `Get +${adReward.coinAmount || 350} Coins & +${adReward.gemAmount || 15} Gems`
                      : adReward.type === 'time'
                      ? `Get +${adReward.amount || 30}s Extra Time`
                      : `Get +${adReward.amount || 250} ${adReward.type === 'coins' ? 'Coins' : 'Diamonds'}`}
                  </span>
                  <div className="mt-3 flex items-center gap-1.5 text-[9px] text-slate-300 bg-black/30 px-2 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Verified Sponsor Partner</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    disabled={adCountdown > 0}
                    onClick={handleClaimAdReward}
                    className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md ${
                      adCountdown > 0
                        ? 'bg-slate-700/60 text-slate-400 border border-slate-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-emerald-950 border border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] active:scale-95 cursor-pointer'
                    }`}
                  >
                    {adCountdown > 0 ? `Please Wait (${adCountdown}s)...` : `Collect Reward!`}
                  </button>

                  <button
                    onClick={() => setAdModalOpen(false)}
                    className="text-[10px] text-slate-400 hover:text-white font-bold cursor-pointer"
                  >
                    Close Ad
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    const root = createRoot(document.getElementById('root'));
    root.render(<App />);
  