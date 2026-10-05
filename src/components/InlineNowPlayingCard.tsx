import React from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1, 
  Heart, 
  Disc3, 
  Volume2, 
  Sparkles 
} from 'lucide-react';
import { Track, RepeatMode } from '../types';
import { playTactileClick } from '../utils/audioSynth';

interface InlineNowPlayingCardProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  repeatMode: RepeatMode;
  isShuffle: boolean;
  beatEnergy: number;
  playlistName: string;
  className?: string;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSeek: (time: number) => void;
  onToggleRepeat: () => void;
  onToggleShuffle: () => void;
  onToggleLike: (id: string) => void;
}

function formatTime(sec: number): string {
  if (isNaN(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const InlineNowPlayingCard: React.FC<InlineNowPlayingCardProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  repeatMode,
  isShuffle,
  beatEnergy,
  playlistName,
  className = '',
  onTogglePlay,
  onNext,
  onPrev,
  onSeek,
  onToggleRepeat,
  onToggleShuffle,
  onToggleLike,
}) => {
  if (!currentTrack) return null;

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`w-full glass-morph rounded-2xl p-3 sm:p-4 relative overflow-hidden select-none border border-white/80 shadow-md ${className}`}>
      {/* Top Banner Tag: Sedang Memutar dari Playlist */}
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-pink-200/60 text-xs">
        <div className="flex items-center gap-1.5 text-pink-700 font-bold">
          <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'animate-pulse' : ''}`} />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider">
            SEDANG MEMUTAR DARI: {playlistName}
          </span>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-200/60 text-pink-800">
          {currentTrack.format || 'AUDIO OFFLINE'}
        </span>
      </div>

      {/* Main Track Info & Cover Area */}
      <div className="flex items-center gap-3.5 mb-3">
        {/* Cover Art Frame with spinning disc badge */}
        <div 
          className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-pink-300 shadow-sm shrink-0 bg-pink-100 flex items-center justify-center transition-transform duration-200"
          style={{ transform: `scale(${isPlaying ? 1 + beatEnergy * 0.05 : 1})` }}
        >
          {currentTrack.coverArt ? (
            <img
              src={currentTrack.coverArt}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-pink-300 to-rose-200 flex items-center justify-center text-pink-700 font-bold text-xl">
              ♪
            </div>
          )}

          {/* Mini spinning vinyl icon */}
          <div className="absolute top-1 right-1 p-1 rounded-full bg-black/40 backdrop-blur-md">
            <Disc3 
              className={`w-3.5 h-3.5 text-white ${isPlaying ? 'animate-spin' : ''}`}
              style={{ animationDuration: '3s' }}
            />
          </div>
        </div>

        {/* Track Title, Artist, Album, and Like Button */}
        <div className="flex-1 flex flex-col justify-center min-w-0 pr-1">
          <div className="flex items-center justify-between gap-1">
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900 truncate leading-snug">
              {currentTrack.title}
            </h3>
            <button
              onClick={() => {
                playTactileClick();
                onToggleLike(currentTrack.id);
              }}
              className="p-1 hover:scale-110 transition-transform shrink-0"
              title={currentTrack.isLiked ? 'Hapus dari Suka' : 'Sukai Lagu'}
            >
              <Heart
                className={`w-4 h-4 ${
                  currentTrack.isLiked
                    ? 'fill-pink-500 text-pink-500'
                    : 'text-slate-300 hover:text-pink-400'
                }`}
              />
            </button>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-pink-700 truncate">
            {currentTrack.artist}
          </p>

          <p className="text-[11px] text-black font-semibold truncate mt-0.5">
            Album: {currentTrack.album}
          </p>
        </div>
      </div>

      {/* =========================================================================
          TRANSPORT CONTROLS ROW & SCRUBBER SEEKBAR
         ========================================================================= */}
      <div className="flex items-center justify-center gap-4 mb-2">
        {/* Shuffle */}
        <button
          onClick={() => {
            playTactileClick();
            onToggleShuffle();
          }}
          className={`p-1.5 rounded-full transition-colors ${
            isShuffle ? 'text-pink-600 bg-pink-100' : 'text-slate-400 hover:text-slate-700'
          }`}
          title="Acak Lagu"
        >
          <Shuffle className="w-4 h-4" />
        </button>

        {/* Prev */}
        <button
          onClick={() => {
            playTactileClick();
            onPrev();
          }}
          className="p-1.5 rounded-full text-slate-700 hover:text-pink-600 transition-colors cursor-pointer"
          title="Lagu Sebelumnya"
        >
          <SkipBack className="w-4 h-4 fill-current" />
        </button>

        {/* Big Play/Pause button */}
        <button
          onClick={() => {
            playTactileClick();
            onTogglePlay();
          }}
          className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 active:scale-95 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
          title={isPlaying ? 'Jeda' : 'Putar'}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Next */}
        <button
          onClick={() => {
            playTactileClick();
            onNext();
          }}
          className="p-1.5 rounded-full text-slate-700 hover:text-pink-600 transition-colors cursor-pointer"
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
            <Repeat1 className="w-4 h-4" />
          ) : (
            <Repeat className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Progress seekbar */}
      <div className="flex items-center gap-2 px-1">
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
  );
};
