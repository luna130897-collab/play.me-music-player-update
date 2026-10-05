import React from 'react';
import { AudioFXSettings } from '../types';
import { Sliders, Zap, Radio, Sparkles, Moon, Clock, RotateCcw, Volume2 } from 'lucide-react';
import { playTactileClick } from '../utils/audioSynth';

interface EqualizerTimerViewProps {
  audioFX: AudioFXSettings;
  onChangeFX: (partial: Partial<AudioFXSettings>) => void;
  sleepTimer: number | null; // seconds remaining
  onSetSleepTimer: (seconds: number | null) => void;
}

export const EqualizerTimerView: React.FC<EqualizerTimerViewProps> = ({
  audioFX,
  onChangeFX,
  sleepTimer,
  onSetSleepTimer,
}) => {
  const timerPresets = [
    { label: '15 Menit', seconds: 15 * 60 },
    { label: '30 Menit', seconds: 30 * 60 },
    { label: '45 Menit', seconds: 45 * 60 },
    { label: '60 Menit', seconds: 60 * 60 },
  ];

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="w-full glass-morph rounded-2xl p-4 sm:p-5 mb-20 select-none space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-pink-200/70">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-pink-600" />
          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">
            Studio Equalizer &amp; Waktu Tidur
          </h3>
        </div>

        <button
          onClick={() => {
            playTactileClick();
            onChangeFX({
              bassBoost: 6,
              treble: 2,
              playbackRate: 1.0,
              virtualizer: true,
            });
          }}
          className="flex items-center gap-1 text-[11px] font-bold text-pink-600 hover:text-pink-700 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Standar</span>
        </button>
      </div>

      {/* =========================================================================
          1. EQUALIZER CONTROLS
         ========================================================================= */}
      {/* Bass Boost */}
      <div className="p-3.5 rounded-xl bg-white/50 border border-pink-200/70 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <Zap className="w-4 h-4 text-pink-500" />
            <span>Mega Bass Booster (Subwoofer)</span>
          </div>
          <span className="text-xs font-mono font-bold text-pink-600">
            +{audioFX.bassBoost} dB
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={15}
          step={1}
          value={audioFX.bassBoost}
          onChange={(e) => onChangeFX({ bassBoost: parseInt(e.target.value) })}
          className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer pink-slider"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>Rata (0dB)</span>
          <span>Bertenaga (+6dB)</span>
          <span>Ultra Bass (+15dB)</span>
        </div>
      </div>

      {/* Treble & Vocal Clarity */}
      <div className="p-3.5 rounded-xl bg-white/50 border border-pink-200/70 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <Radio className="w-4 h-4 text-rose-500" />
            <span>Kejernihan Vokal &amp; Treble</span>
          </div>
          <span className="text-xs font-mono font-bold text-rose-600">
            {audioFX.treble >= 0 ? `+${audioFX.treble}` : audioFX.treble} dB
          </span>
        </div>

        <input
          type="range"
          min={-6}
          max={12}
          step={1}
          value={audioFX.treble}
          onChange={(e) => onChangeFX({ treble: parseInt(e.target.value) })}
          className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer pink-slider"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>Hangat (-6dB)</span>
          <span>Natural (0dB)</span>
          <span>Kristal Jernih (+12dB)</span>
        </div>
      </div>

      {/* Playback Tempo & Pitch (Nightcore / Slowed) */}
      <div className="p-3.5 rounded-xl bg-white/50 border border-pink-200/70 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Kecepatan Tempo (Nightcore / Slowed)</span>
          </div>
          <span className="text-xs font-mono font-bold text-amber-600">
            {audioFX.playbackRate}x {audioFX.playbackRate > 1.0 ? '⚡ Nightcore' : audioFX.playbackRate < 1.0 ? '🐢 Slowed' : ''}
          </span>
        </div>

        <input
          type="range"
          min={0.7}
          max={1.4}
          step={0.05}
          value={audioFX.playbackRate}
          onChange={(e) => onChangeFX({ playbackRate: parseFloat(e.target.value) })}
          className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer pink-slider"
        />

        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
          <span>0.7x (Slowed)</span>
          <span>1.0x (Normal)</span>
          <span>1.4x (Fast)</span>
        </div>
      </div>

      {/* =========================================================================
          2. SLEEP TIMER (PENGATUR WAKTU TIDUR)
         ========================================================================= */}
      <div className="p-3.5 rounded-xl bg-white/50 border border-pink-200/70 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
            <Moon className="w-4 h-4 text-indigo-500" />
            <span>Pengatur Waktu Tidur (Sleep Timer)</span>
          </div>
          {sleepTimer !== null && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 animate-pulse">
              {formatTimer(sleepTimer)}
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-500">
          Musik akan otomatis berhenti secara perlahan saat waktu tidur habis.
        </p>

        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {timerPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                playTactileClick();
                onSetSleepTimer(preset.seconds);
              }}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                sleepTimer !== null && Math.abs(sleepTimer - preset.seconds) < 5
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-pink-100 text-slate-700 border border-pink-100'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {sleepTimer !== null && (
          <button
            onClick={() => {
              playTactileClick();
              onSetSleepTimer(null);
            }}
            className="w-full py-1 mt-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 text-center"
          >
            Batalkan Waktu Tidur
          </button>
        )}
      </div>
    </div>
  );
};
