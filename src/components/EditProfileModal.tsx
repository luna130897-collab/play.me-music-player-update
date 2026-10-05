import React, { useState } from 'react';
import { X, User, Check, Sparkles } from 'lucide-react';
import { playTactileClick } from '../utils/audioSynth';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorName: string;
  creatorAvatar: string;
  onSaveProfile: (name: string, avatar: string) => void;
}

const AVATAR_OPTIONS = ['🐱', '🐰', '🎧', '✨', '💿', '🌸', '🦊', '⚡', '🛸', '👾'];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  creatorName,
  creatorAvatar,
  onSaveProfile,
}) => {
  const [nameInput, setNameInput] = useState(creatorName);
  const [selectedAvatar, setSelectedAvatar] = useState(creatorAvatar);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!nameInput.trim()) return;
    playTactileClick();
    onSaveProfile(nameInput.trim(), selectedAvatar);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/45 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-sm glass-morph rounded-2xl p-4 sm:p-5 border border-white/80 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-200/80">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-pink-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-tight">
              Ubah Nama Pembuat Playlist
            </h3>
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

        <div className="space-y-4 my-4">
          {/* Avatar Selector */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Pilih Ikon Avatar Profil:
            </label>
            <div className="flex flex-wrap gap-2">
              {AVATAR_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    playTactileClick();
                    setSelectedAvatar(emoji);
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all cursor-pointer ${
                    selectedAvatar === emoji
                      ? 'bg-pink-500 text-white shadow-md scale-110 ring-2 ring-pink-300'
                      : 'bg-white/60 hover:bg-white text-slate-700 border border-pink-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Nama Pembuat (Ganti nama &apos;{creatorName}&apos;):
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Masukkan nama pembuat Anda..."
              className="w-full px-3 py-2 rounded-xl bg-white/80 border border-pink-300 text-slate-900 text-sm font-bold focus:outline-none focus:border-pink-500 shadow-2xs"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Nama ini akan otomatis ditampilkan pada kartu playlist dan info trek.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2 border-t border-pink-100">
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-white/60 hover:bg-white text-slate-700 font-bold text-xs border border-pink-200"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={!nameInput.trim()}
            className="flex-1 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Simpan Nama
          </button>
        </div>
      </div>
    </div>
  );
};
