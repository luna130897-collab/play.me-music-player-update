import React, { useState, useRef } from 'react';
import { Track, Playlist } from '../types';
import { X, Plus, Music, Check, FolderPlus, Upload, Sparkles, CheckSquare, Square } from 'lucide-react';
import { playTactileClick } from '../utils/audioSynth';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableTracks: Track[];
  creatorName: string;
  onCreatePlaylist: (playlist: Playlist) => void;
}

const COVER_EMOJIS = ['🎧', '💿', '🎸', '🎹', '✨', '🌸', '🌊', '🌆', '🌙', '🔥'];

export const CreatePlaylistModal: React.FC<CreatePlaylistModalProps> = ({
  isOpen,
  onClose,
  availableTracks,
  creatorName,
  onCreatePlaylist,
}) => {
  const [playlistName, setPlaylistName] = useState('');
  const [customCreator, setCustomCreator] = useState(creatorName);
  const [selectedEmoji, setSelectedEmoji] = useState('🎧');
  const [customCoverUrl, setCustomCoverUrl] = useState<string | null>(null);
  const [selectedTrackIds, setSelectedTrackIds] = useState<string[]>(
    availableTracks.map((t) => t.id)
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const toggleTrack = (id: string) => {
    playTactileClick();
    setSelectedTrackIds((prev) =>
      prev.includes(id) ? prev.filter((tid) => tid !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    playTactileClick();
    setSelectedTrackIds(availableTracks.map((t) => t.id));
  };

  const deselectAll = () => {
    playTactileClick();
    setSelectedTrackIds([]);
  };

  const handleCustomCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      playTactileClick();
      const url = URL.createObjectURL(e.target.files[0]);
      setCustomCoverUrl(url);
    }
  };

  const handleSave = () => {
    if (!playlistName.trim()) return;
    playTactileClick();

    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      name: playlistName.trim(),
      creator: customCreator.trim() || creatorName,
      coverArt: customCoverUrl || undefined,
      coverEmoji: selectedEmoji,
      trackIds: selectedTrackIds,
      createdAt: new Date().toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    onCreatePlaylist(newPlaylist);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/45 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-md glass-morph rounded-2xl p-4 sm:p-5 border border-white/80 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-200/80">
          <div className="flex items-center gap-2">
            <FolderPlus className="w-4 h-4 text-pink-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-tight">
              Buat Playlist &amp; Impor Lagu Lokal
            </h3>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-pink-100 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3.5 my-3 max-h-[70vh] overflow-y-auto y2k-scrollbar pr-1">
          {/* 1. Nama Playlist */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nama Playlist Baru:
            </label>
            <input
              type="text"
              placeholder="Contoh: Playlist Santai Malam, Lagu Roadtrip..."
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white/80 border border-pink-300 text-slate-900 text-sm font-bold focus:outline-none focus:border-pink-500 shadow-2xs"
            />
          </div>

          {/* 2. Nama Pembuat Playlist */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Nama Pembuat:
            </label>
            <input
              type="text"
              value={customCreator}
              onChange={(e) => setCustomCreator(e.target.value)}
              placeholder="Nama pembuat playlist..."
              className="w-full px-3 py-1.5 rounded-xl bg-white/80 border border-pink-300 text-slate-800 text-xs font-semibold focus:outline-none focus:border-pink-500"
            />
          </div>

          {/* 3. Sampul Playlist (Emoji atau Upload Foto) */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Ikon Sampul / Unggah Foto:
            </label>
            <div className="flex items-center gap-2">
              {/* Emojis */}
              <div className="flex-1 flex gap-1.5 overflow-x-auto py-1">
                {COVER_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      playTactileClick();
                      setSelectedEmoji(emoji);
                      setCustomCoverUrl(null);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all shrink-0 cursor-pointer ${
                      selectedEmoji === emoji && !customCoverUrl
                        ? 'bg-pink-500 text-white shadow-xs scale-105'
                        : 'bg-white/60 hover:bg-white border border-pink-200 text-slate-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Upload image button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1.5 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold shrink-0 flex items-center gap-1 border border-pink-200 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>Foto</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleCustomCover}
              />
            </div>
            {customCoverUrl && (
              <div className="mt-1.5 flex items-center gap-2 text-[11px] text-pink-700">
                <img src={customCoverUrl} alt="" className="w-6 h-6 rounded object-cover border" />
                <span>Foto sampul kustom aktif</span>
              </div>
            )}
          </div>

          {/* 4. Impor Lagu dari Perpustakaan Lokal */}
          <div className="p-3 rounded-xl bg-white/60 border border-pink-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-pink-600" />
                <span>Pilih Lagu Lokal ({selectedTrackIds.length}/{availableTracks.length})</span>
              </label>

              <div className="flex items-center gap-2 text-[10px] font-bold text-pink-600">
                <button type="button" onClick={selectAll} className="hover:underline">
                  Pilih Semua
                </button>
                <span>•</span>
                <button type="button" onClick={deselectAll} className="hover:underline">
                  Batalkan
                </button>
              </div>
            </div>

            {/* Checklist of Tracks */}
            <div className="space-y-1.5 max-h-44 overflow-y-auto y2k-scrollbar pr-1">
              {availableTracks.map((track) => {
                const isSelected = selectedTrackIds.includes(track.id);
                return (
                  <div
                    key={track.id}
                    onClick={() => toggleTrack(track.id)}
                    className={`p-2 rounded-lg flex items-center justify-between cursor-pointer text-xs transition-colors ${
                      isSelected
                        ? 'bg-pink-100/90 border border-pink-300 font-bold text-pink-900'
                        : 'bg-white/40 hover:bg-white/70 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-7 h-7 rounded bg-pink-200 shrink-0 overflow-hidden flex items-center justify-center">
                        {track.coverArt ? (
                          <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px]">♫</span>
                        )}
                      </div>
                      <div className="truncate">
                        <p className="truncate leading-tight">{track.title}</p>
                        <p className="text-[10px] text-slate-500 font-normal truncate">{track.artist}</p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-pink-600" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2 border-t border-pink-100">
          <button
            type="button"
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-white/60 hover:bg-white text-slate-700 font-bold text-xs border border-pink-200"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!playlistName.trim()}
            className="flex-1 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Buat &amp; Simpan Playlist
          </button>
        </div>
      </div>
    </div>
  );
};
