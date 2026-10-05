import React, { useState, useRef } from 'react';
import { Playlist } from '../types';
import { X, Upload, Check, Trash2, Image, Sparkles, Camera } from 'lucide-react';
import { playTactileClick } from '../utils/audioSynth';
import { PLAYLIST_PRESET_COVERS, SNEAKERS_PRESET_COVER } from '../utils/playlistCoverPresets';

interface ChangePlaylistCoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlist: Playlist;
  onSaveCover: (playlistId: string, newCoverArt?: string, newEmoji?: string, newName?: string) => void;
}

const EMOJI_OPTIONS = ['👟', '🎧', '💿', '🎸', '🎹', '🌸', '⚡', '🌙', '🐱', '✨', '🏝️', '🛹'];

export const ChangePlaylistCoverModal: React.FC<ChangePlaylistCoverModalProps> = ({
  isOpen,
  onClose,
  playlist,
  onSaveCover,
}) => {
  const [playlistName, setPlaylistName] = useState<string>(playlist.name);
  const [selectedCover, setSelectedCover] = useState<string | undefined>(
    playlist.coverArt || (playlist.id === 'playlist-1' ? SNEAKERS_PRESET_COVER : undefined)
  );
  const [selectedEmoji, setSelectedEmoji] = useState<string>(playlist.coverEmoji || '🎧');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      playTactileClick();
      const url = URL.createObjectURL(e.target.files[0]);
      setSelectedCover(url);
    }
  };

  const handleSave = () => {
    playTactileClick();
    onSaveCover(playlist.id, selectedCover, selectedEmoji, playlistName.trim() || playlist.name);
    onClose();
  };

  const handleResetToDefault = () => {
    playTactileClick();
    if (playlist.id === 'playlist-1') {
      setSelectedCover(SNEAKERS_PRESET_COVER);
    } else {
      setSelectedCover(undefined);
    }
    setSelectedEmoji('🎧');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-md glass-morph rounded-2xl p-4 sm:p-5 border border-white/80 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-200/80">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-pink-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-black uppercase tracking-tight">
              Ganti Sampul Playlist
            </h3>
          </div>
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="p-1 rounded-lg hover:bg-pink-100 text-black transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 my-3.5 max-h-[72vh] overflow-y-auto y2k-scrollbar pr-1">
          {/* Current Live Preview */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-white/60 border border-pink-200/80">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-pink-400 shadow-md shrink-0 bg-pink-100 flex items-center justify-center relative">
              {selectedCover ? (
                <img src={selectedCover} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-pink-300 to-rose-200 flex items-center justify-center text-3xl">
                  {selectedEmoji}
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-pink-600 bg-pink-100 px-2 py-0.5 rounded-md">
                Pratinjau Sampul Baru
              </span>
              <h4 className="text-sm font-black text-black truncate mt-1">
                {playlistName || playlist.name}
              </h4>
              <p className="text-[11px] text-black font-semibold mt-0.5">
                {selectedCover ? 'Gambar Kustom / Preset' : `Ikon Emoji: ${selectedEmoji}`}
              </p>
            </div>
          </div>

          {/* Edit Nama Playlist */}
          <div>
            <label className="text-xs font-bold text-black block mb-1.5">
              Nama Playlist:
            </label>
            <input
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold rounded-xl bg-white/85 border border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 text-black shadow-xs"
              placeholder="Masukkan nama playlist..."
            />
          </div>

          {/* 1. Upload from Gallery / Storage */}
          <div>
            <label className="text-xs font-bold text-black block mb-1.5">
              1. Unggah Gambar Bebas dari Galeri HP / Komputer:
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  playTactileClick();
                  fileInputRef.current?.click();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Pilih Foto dari Galeri</span>
              </button>

              {selectedCover && (
                <button
                  onClick={handleResetToDefault}
                  className="p-2.5 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  title="Kembalikan ke Sampul Awal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          {/* 2. Preset Aesthetic Artwork Covers */}
          <div>
            <label className="text-xs font-bold text-black block mb-2">
              2. Atau Pilih Sampul Estetik Bawaan:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLAYLIST_PRESET_COVERS.map((preset) => {
                const isSelected = selectedCover === preset.dataUrl;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      playTactileClick();
                      setSelectedCover(preset.dataUrl);
                    }}
                    className={`p-1.5 rounded-xl border text-left flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/95 border-pink-500 shadow-sm ring-2 ring-pink-400'
                        : 'bg-white/50 hover:bg-white/80 border-pink-200/80'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-black/10 shadow-2xs">
                      <img src={preset.dataUrl} alt={preset.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-bold text-black text-center truncate w-full">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Preset Emoji Option */}
          <div>
            <label className="text-xs font-bold text-black block mb-1.5">
              3. Atau Gunakan Ikon Emoji:
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 y2k-scrollbar">
              {EMOJI_OPTIONS.map((emoji) => {
                const isSelected = !selectedCover && selectedEmoji === emoji;
                return (
                  <button
                    key={emoji}
                    onClick={() => {
                      playTactileClick();
                      setSelectedCover(undefined);
                      setSelectedEmoji(emoji);
                    }}
                    className={`w-9 h-9 text-lg rounded-xl shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-pink-500 text-white scale-110 shadow-sm'
                        : 'bg-white/60 hover:bg-white border border-pink-200'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-pink-200/70 flex items-center justify-end gap-2">
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-white/70 hover:bg-white text-black text-xs font-bold border border-pink-200 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>Simpan Sampul</span>
          </button>
        </div>
      </div>
    </div>
  );
};
