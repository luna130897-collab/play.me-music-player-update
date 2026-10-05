import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Volume2, 
  VolumeX, 
  Heart,
  Moon,
  ChevronUp
} from 'lucide-react';
import { Track, RepeatMode } from '../types';
import { playTactileClick } from '../utils/audioSynth';

interface BottomPlayerBarProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  volume: number;
  sleepTimer: number | null;
  isVisible?: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onToggleLike: (id: string) => void;
  onOpenLyricsVisual: () => void;
}

function formatTime(sec: number): string {
  if (isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const BottomPlayerBar: React.FC<BottomPlayerBarProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  repeatMode,
  isShuffle,
  volume,
  sleepTimer,
  isVisible = true,
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onVolumeChange,
  onToggleRepeat,
  onToggleShuffle,
  onToggleLike,
  onOpenLyricsVisual,
}) => {
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className={`fixed bottom-0 inset-x-0 z-40 p-2 sm:p-3 pointer-events-none flex justify-center transition-all duration-500 ease-out transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-32 opacity-0'
      }`}
    >
      <div className="w-full max-w-2xl glass-morph rounded-2xl p-2.5 sm:p-3 border border-white/80 shadow-2xl backdrop-blur-2xl pointer-events-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-2.5">
          {/* =========================================================================
              LEFT: NOW PLAYING + THUMBNAIL + TITLE + ARTIST (Clickable to open Lirik/Visual)
             ========================================================================= */}
          <div 
            onClick={() => {
              playTactileClick();
              onOpenLyricsVisual();
            }}
            className="flex items-center gap-2.5 w-full sm:w-1/3 min-w-0 cursor-pointer group"
            title="Klik untuk membuka Lirik & Visual Fullscreen"
          >
            {/* Square thumbnail */}
            <div className="w-11 h-11 rounded-lg overflow-hidden border border-pink-200 shadow-2xs shrink-0 bg-pink-100 flex items-center justify-center relative">
              {currentTrack?.coverArt ? (
                <img
                  src={currentTrack.coverArt}
                  alt={currentTrack.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white font-bold text-xs">
                  ♫
                </div>
              )}
            </div>

            {/* Song Meta */}
            <div className="truncate flex-1">
              <div className="flex items-center gap-1 text-[10px] text-black font-bold leading-none mb-0.5">
                <span>Now playing...</span>
                <ChevronUp className="w-3 h-3 text-pink-500 group-hover:-translate-y-0.5 transition-transform" />
              </div>
              <div className="flex items-center gap-1.5 truncate">
                <span className="text-xs sm:text-sm font-extrabold text-black truncate group-hover:text-pink-600 transition-colors">
                  {currentTrack?.title || 'No Song Selected'}
                </span>
                {currentTrack && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playTactileClick();
                      onToggleLike(currentTrack.id);
                    }}
                    className="hover:scale-110 transition-transform shrink-0"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        currentTrack.isLiked
                          ? 'fill-pink-500 text-pink-500'
                          : 'text-black/30 hover:text-pink-500'
                      }`}
                    />
                  </button>
                )}
              </div>
              <span className="text-[11px] text-black font-semibold truncate block">
                {currentTrack?.artist || 'Select a track to play'}
              </span>
            </div>
          </div>

          {/* =========================================================================
              CENTER: TRANSPORT CONTROLS + SCRUBBER BAR
             ========================================================================= */}
          <div className="flex flex-col items-center w-full sm:w-2/5">
            {/* Controls Row: Shuffle | Prev | Play/Pause | Next | Repeat */}
            <div className="flex items-center gap-3 mb-1">
              {/* Shuffle */}
              <button
                onClick={() => {
                  playTactileClick();
                  onToggleShuffle();
                }}
                className={`p-1.5 rounded-full transition-colors ${
                  isShuffle ? 'text-pink-600 bg-pink-100' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="Acak Lagu (Shuffle)"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>

              {/* Prev */}
              <button
                onClick={() => {
                  playTactileClick();
                  onPrev();
                }}
                className="p-1.5 rounded-full text-slate-700 hover:text-pink-600 transition-colors"
                title="Lagu Sebelumnya"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>

              {/* Play / Pause circle */}
              <button
                onClick={() => {
                  playTactileClick();
                  onTogglePlay();
                }}
                className="w-8 h-8 rounded-full bg-pink-500 hover:bg-pink-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-all"
                title={isPlaying ? 'Jeda' : 'Putar'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={() => {
                  playTactileClick();
                  onNext();
                }}
                className="p-1.5 rounded-full text-slate-700 hover:text-pink-600 transition-colors"
                title="Lagu Berikutnya"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>

              {/* Repeat */}
              <button
                onClick={() => {
                  playTactileClick();
                  onToggleRepeat();
                }}
                className={`p-1.5 rounded-full transition-colors ${
                  repeatMode !== 'off' ? 'text-pink-600 bg-pink-100' : 'text-slate-400 hover:text-slate-700'
                }`}
                title={`Ulangi: ${repeatMode}`}
              >
                {repeatMode === 'one' ? (
                  <Repeat1 className="w-3.5 h-3.5" />
                ) : (
                  <Repeat className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Seekbar: 0:35 ------○------ 1:58 */}
            <div className="w-full flex items-center gap-2">
              <span className="text-[10px] text-black font-mono font-bold tabular-nums min-w-[28px] text-right">
                {formatTime(currentTime)}
              </span>

              <div className="relative flex-1 flex items-center">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={(e) => onSeek(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-pink-200/80 rounded-full appearance-none cursor-pointer pink-slider"
                  style={{
                    background: `linear-gradient(to right, var(--theme-accent) 0%, var(--theme-accent) ${progressPercent}%, var(--theme-accent-light) ${progressPercent}%, var(--theme-accent-light) 100%)`,
                  }}
                />
              </div>

              <span className="text-[10px] text-black font-mono font-bold tabular-nums min-w-[28px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* =========================================================================
              RIGHT: VOLUME CONTROL & SLEEP TIMER BADGE
             ========================================================================= */}
          <div className="hidden sm:flex items-center justify-end gap-2 w-1/4">
            {sleepTimer !== null && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-100/90 px-2 py-0.5 rounded-full">
                <Moon className="w-3 h-3" />
                <span>{Math.ceil(sleepTimer / 60)}m</span>
              </div>
            )}

            <button
              onClick={() => onVolumeChange(volume === 0 ? 0.8 : 0)}
              className="text-slate-500 hover:text-pink-600 transition-colors"
              title={volume === 0 ? 'Aktifkan Suara' : 'Bisukan Suara'}
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-pink-600" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-18 h-1.5 bg-pink-200 rounded-full appearance-none cursor-pointer pink-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
