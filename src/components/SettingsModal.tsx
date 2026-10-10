import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Check, X, Volume2, VolumeX, Smartphone } from 'lucide-react';

export const SettingsModal: React.FC = () => {
  const activeModal = useGameStore(s => s.activeModal);
  const settings = useGameStore(s => s.settings);
  const updateSettings = useGameStore(s => s.updateSettings);
  const setActiveModal = useGameStore(s => s.setActiveModal);

  if (activeModal !== 'settings') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-sm bg-white dark:bg-game-darkCard rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Settings & Preferences
          </h2>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Section (Matching image ghkghyuo.PNG) */}
        <div className="space-y-3">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Theme
          </span>
          <div className="flex items-center gap-6">
            {/* Light Theme */}
            <button
              onClick={() => updateSettings({ theme: 'light' })}
              className={`relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                settings.theme === 'light'
                  ? 'border-blue-600 bg-white ring-2 ring-blue-500/30'
                  : 'border-slate-300 bg-slate-100'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-white shadow-inner" />
              {settings.theme === 'light' && (
                <Check className="w-4 h-4 text-blue-600 absolute" />
              )}
            </button>

            {/* Dark Theme */}
            <button
              onClick={() => updateSettings({ theme: 'dark' })}
              className={`relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                settings.theme === 'dark'
                  ? 'border-blue-500 bg-[#1e293b] ring-2 ring-blue-500/30'
                  : 'border-slate-400 bg-[#0f172a]'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-slate-800" />
              {settings.theme === 'dark' && (
                <Check className="w-4 h-4 text-blue-400 absolute" />
              )}
            </button>
          </div>
        </div>

        {/* Large Font Section (Matching image ghkghyuo.PNG) */}
        <div className="space-y-3">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Large Font
          </span>
          <div className="flex items-center gap-6">
            {/* Standard Font */}
            <button
              onClick={() => updateSettings({ largeFont: false })}
              className={`relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center font-bold text-lg ${
                !settings.largeFont
                  ? 'border-blue-600 text-blue-600'
                  : 'border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              A
              {!settings.largeFont && (
                <Check className="w-3.5 h-3.5 text-blue-600 absolute bottom-0.5 right-0.5" />
              )}
            </button>

            {/* Large Font */}
            <button
              onClick={() => updateSettings({ largeFont: true })}
              className={`relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center font-extrabold text-2xl ${
                settings.largeFont
                  ? 'border-blue-600 text-blue-600 ring-2 ring-blue-500/30'
                  : 'border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400'
              }`}
            >
              A
              {settings.largeFont && (
                <Check className="w-3.5 h-3.5 text-blue-600 absolute bottom-0.5 right-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Division Sign Section (Matching image ghkghyuo.PNG) */}
        <div className="space-y-3">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Division sign
          </span>
          <div className="flex items-center gap-4">
            {(['÷', '/', ':'] as const).map(sign => (
              <button
                key={sign}
                onClick={() => updateSettings({ divisionSign: sign })}
                className={`relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center text-xl font-bold ${
                  settings.divisionSign === sign
                    ? 'border-blue-600 text-blue-600 ring-2 ring-blue-500/30'
                    : 'border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                {sign}
                {settings.divisionSign === sign && (
                  <Check className="w-3.5 h-3.5 text-blue-600 absolute bottom-0.5 right-0.5" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Audio & Haptics */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              Sound Effects
            </span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={e => updateSettings({ soundEnabled: e.target.checked })}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Haptic Feedback
            </span>
            <input
              type="checkbox"
              checked={settings.hapticsEnabled}
              onChange={e => updateSettings({ hapticsEnabled: e.target.checked })}
              className="w-5 h-5 accent-blue-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Done Button */}
        <button
          onClick={() => setActiveModal('none')}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-center active:scale-95 transition-all shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

