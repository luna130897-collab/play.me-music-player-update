import React from 'react';
import { Track } from '../types';
import { X, PlayCircle, Heart, Info, Trash2, HardDrive, Music, Shield } from 'lucide-react';
import { playTactileClick } from '../utils/audioSynth';

interface TrackDetailModalProps {
  track: Track | null;
  isOpen: boolean;
  onClose: () => void;
  onPlayNext: (id: string) => void;
  onToggleLike: (id: string) => void;
  onRemoveTrack: (id: string) => void;
}

export const TrackDetailModal: React.FC<TrackDetailModalProps> = ({
  track,
  isOpen,
  onClose,
  onPlayNext,
  onToggleLike,
  onRemoveTrack,
}) => {
  if (!isOpen || !track) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm glass-morph rounded-2xl p-4 sm:p-5 border border-white/80 shadow-2xl relative select-none">
        {/* Top Header with Cover and Meta */}
        <div className="flex items-start justify-between pb-3 border-b border-pink-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden bg-pink-100 border border-pink-200 shrink-0">
              {track.coverArt ? (
                <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-pink-600">
                  ♫
                </div>
              )}
            </div>
            <div className="truncate">
              <h4 className="text-sm font-extrabold text-slate-900 truncate">{track.title}</h4>
              <p className="text-xs text-slate-600 truncate">{track.artist}</p>
              <p className="text-[10px] text-pink-600 font-semibold">{track.album}</p>
            </div>
          </div>

          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-pink-100 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Menu List */}
        <div className="space-y-1.5 my-3">
          <button
            onClick={() => {
              onPlayNext(track.id);
              onClose();
            }}
            className="w-full p-2.5 rounded-xl hover:bg-white/80 flex items-center gap-3 text-xs font-bold text-slate-700 transition-colors"
          >
            <PlayCircle className="w-4 h-4 text-pink-600" />
            <span>Putar Berikutnya (Play Next)</span>
          </button>

          <button
            onClick={() => {
              onToggleLike(track.id);
              onClose();
            }}
            className="w-full p-2.5 rounded-xl hover:bg-white/80 flex items-center gap-3 text-xs font-bold text-slate-700 transition-colors"
          >
            <Heart className={`w-4 h-4 ${track.isLiked ? 'fill-pink-500 text-pink-500' : 'text-slate-400'}`} />
            <span>{track.isLiked ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}</span>
          </button>

          {/* Technical Audio Metadata Card */}
          <div className="p-3 rounded-xl bg-white/60 border border-pink-100 space-y-1 text-[11px] text-slate-600">
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Format Berkas:</span>
              <span className="font-mono text-slate-800 font-bold">{track.format || 'MP3 Stereo'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Bitrate Audio:</span>
              <span className="font-mono text-slate-800 font-bold">{track.bitrate || '320 kbps'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Ukuran Berkas:</span>
              <span className="font-mono text-slate-800 font-bold">{track.fileSize || '10.2 MB'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-slate-500">Tanggal Ditambahkan:</span>
              <span className="font-mono text-slate-800">{track.dateAdded}</span>
            </div>
          </div>

          <button
            onClick={() => {
              onRemoveTrack(track.id);
              onClose();
            }}
            className="w-full p-2.5 rounded-xl hover:bg-rose-50 flex items-center gap-3 text-xs font-bold text-rose-600 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-500" />
            <span>Hapus dari Daftar Putar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
