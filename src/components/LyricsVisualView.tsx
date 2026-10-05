import React, { useState } from 'react';
import { Track, GifPresetId } from '../types';
import { Disc3, Mic2, Sparkles, Volume2, Music, Check } from 'lucide-react';
import { playTactileClick } from '../utils/audioSynth';

interface LyricsVisualViewProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  beatEnergy: number;
  currentGifId: GifPresetId;
  onSeek: (time: number) => void;
}

export const LyricsVisualView: React.FC<LyricsVisualViewProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  beatEnergy,
  onSeek,
}) => {
  const [viewMode, setViewMode] = useState<'lyrics' | 'artwork'>('lyrics');

  const lyrics = currentTrack?.lyrics || [
    '♪ Tidak ada berkas lirik (.lrc) yang tersemat',
    'Menikmati melodi instrumen musik...',
  ];

  // Calculate current active lyric line based on track progress
  const progressRatio = duration > 0 ? currentTime / duration : 0;
  const activeLineIndex = Math.min(
    Math.floor(progressRatio * lyrics.length),
    lyrics.length - 1
  );

  return (
    <div className="w-full glass-morph rounded-2xl p-4 sm:p-5 mb-20 select-none relative overflow-hidden">
      {/* Top Header Mode Switcher: Lirik Berjalan vs Seni Cover */}
      <div className="flex items-center justify-between pb-3 border-b border-pink-200/70 mb-3">
        <div className="flex items-center gap-2">
          <Mic2 className="w-4 h-4 text-pink-600" />
          <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-tight">
            Lirik &amp; Penampil Visual
          </h3>
        </div>

        <div className="flex items-center p-0.5 rounded-xl bg-pink-100/70 border border-pink-200 text-xs font-bold">
          <button
            onClick={() => {
              playTactileClick();
              setViewMode('lyrics');
            }}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'lyrics' ? 'bg-white text-pink-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Lirik
          </button>
          <button
            onClick={() => {
              playTactileClick();
              setViewMode('artwork');
            }}
            className={`px-3 py-1 rounded-lg transition-colors ${
              viewMode === 'artwork' ? 'bg-white text-pink-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Cover Seni
          </button>
        </div>
      </div>

      {/* Track Meta Chip */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 border border-pink-200/60 mb-4">
        <div className="truncate">
          <p className="text-xs font-extrabold text-slate-900 truncate">
            {currentTrack?.title || 'Belum Ada Lagu'}
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            {currentTrack?.artist || 'Pilih lagu untuk memutar'} • {currentTrack?.album}
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-200 text-pink-800 shrink-0">
          {currentTrack?.format || 'OFFLINE AUDIO'}
        </span>
      </div>

      {/* VIEW 1: SYNCED LYRICS */}
      {viewMode === 'lyrics' ? (
        <div className="space-y-3 py-2 text-center max-h-[340px] overflow-y-auto y2k-scrollbar px-2">
          {lyrics.map((line, idx) => {
            const isActive = idx === activeLineIndex && isPlaying;
            const isPast = idx < activeLineIndex;

            return (
              <p
                key={idx}
                onClick={() => {
                  playTactileClick();
                  // Seek roughly to this line's position
                  const targetSec = (idx / lyrics.length) * duration;
                  onSeek(targetSec);
                }}
                className={`transition-all duration-300 cursor-pointer rounded-lg py-1 px-2 ${
                  isActive
                    ? 'text-lg sm:text-xl font-extrabold text-pink-700 bg-pink-200/60 shadow-xs scale-102'
                    : isPast
                    ? 'text-sm font-semibold text-slate-400'
                    : 'text-sm font-medium text-slate-600 hover:text-slate-800'
                }`}
              >
                {line}
              </p>
            );
          })}
        </div>
      ) : (
        /* VIEW 2: LARGE ARTWORK & LIVE BEAT AURA */
        <div className="flex flex-col items-center justify-center py-4">
          <div 
            className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden shadow-xl border-2 border-white/90 relative bg-pink-100 transition-transform duration-200"
            style={{ transform: `scale(${isPlaying ? 1 + beatEnergy * 0.08 : 1})` }}
          >
            {currentTrack?.coverArt ? (
              <img src={currentTrack.coverArt} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-pink-400 bg-gradient-to-tr from-pink-200 to-rose-100">
                <Music className="w-16 h-16 stroke-1 mb-2" />
                <span className="font-bold text-xs text-pink-800">OFFLINE MUSIC</span>
              </div>
            )}

            {/* Spinning vinyl badge */}
            <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-md">
              <Disc3 className={`w-4 h-4 text-white ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }} />
            </div>
          </div>

          <div className="mt-4 text-center">
            <h4 className="font-extrabold text-base text-slate-900">{currentTrack?.title}</h4>
            <p className="text-xs text-slate-600">{currentTrack?.artist}</p>
            <p className="text-[10px] text-pink-600 font-bold mt-1">
              Bitrate: {currentTrack?.bitrate || '320 kbps'} • Ukuran: {currentTrack?.fileSize || 'Offline'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
