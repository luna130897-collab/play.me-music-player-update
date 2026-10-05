import React, { useRef } from 'react';
import { ThemeConfig, ThemePresetId } from '../types';
import { X, Palette, Image, Upload, Check, Trash2, Sparkles, Sliders } from 'lucide-react';
import { playTactileClick } from '../utils/audioSynth';
import { THEME_COLOR_MAP } from '../utils/themeColors';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeConfig: ThemeConfig;
  onUpdateTheme: (partial: Partial<ThemeConfig>) => void;
}

export const THEME_PRESETS: { id: ThemePresetId; label: string; bgClass: string; accent: string }[] = [
  {
    id: 'pitch-black',
    label: 'Onyx Pitch Black (Hitam)',
    bgClass: 'from-black via-zinc-950 to-neutral-900',
    accent: '#ffffff',
  },
  {
    id: 'deep-navy',
    label: 'Deep Navy Blue (Biru Tua Gelap)',
    bgClass: 'from-slate-950 via-blue-950 to-indigo-950',
    accent: '#38bdf8',
  },
  {
    id: 'pastel-yellow',
    label: 'Warm Pastel Yellow (Kuning)',
    bgClass: 'from-amber-100 via-yellow-50 to-orange-100',
    accent: '#eab308',
  },
  {
    id: 'soft-pink',
    label: 'Soft Pastel Pink',
    bgClass: 'from-pink-200 via-rose-100 to-fuchsia-100',
    accent: '#ec4899',
  },
  {
    id: 'cyber-magenta',
    label: 'Cyber Y2K Magenta',
    bgClass: 'from-fuchsia-950 via-purple-900 to-pink-900',
    accent: '#ff007f',
  },
  {
    id: 'midnight-amethyst',
    label: 'Midnight Dark Glass',
    bgClass: 'from-slate-950 via-purple-950 to-zinc-900',
    accent: '#a855f7',
  },
  {
    id: 'emerald-mint',
    label: 'Emerald Mint Glass',
    bgClass: 'from-emerald-100 via-teal-50 to-green-100',
    accent: '#10b981',
  },
  {
    id: 'ice-cyan',
    label: 'Crystal Ice Cyan',
    bgClass: 'from-cyan-100 via-sky-50 to-blue-100',
    accent: '#06b6d4',
  },
];

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  themeConfig,
  onUpdateTheme,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      playTactileClick();
      const url = URL.createObjectURL(e.target.files[0]);
      onUpdateTheme({ customBgUrl: url, bgBlur: 0, bgDim: 0.1 });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/45 backdrop-blur-md animate-fadeIn select-none">
      <div className="w-full max-w-md glass-morph rounded-2xl p-4 sm:p-5 border border-white/80 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-200/80">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-pink-600" />
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-tight">
              Tema &amp; Latar Belakang Kustom
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

        <div className="space-y-4 my-3 max-h-[75vh] overflow-y-auto y2k-scrollbar pr-1">
          {/* Section 1: Presets Tema Warna */}
          <div>
            <label className="text-xs font-bold text-black block mb-2">
              Pilih Warna Tema Transparan:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {THEME_PRESETS.map((preset) => {
                const isSelected = themeConfig.preset === preset.id && !themeConfig.customAccentColor;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      playTactileClick();
                      onUpdateTheme({ preset: preset.id, customAccentColor: undefined });
                    }}
                    className={`p-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/90 border-pink-500 shadow-sm ring-1 ring-pink-400'
                        : 'bg-white/50 hover:bg-white/70 border-pink-200/70'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-white shadow-xs"
                        style={{ backgroundColor: preset.accent }}
                      />
                      <span className="text-xs font-bold text-black">
                        {preset.label}
                      </span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-pink-600 stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Custom Accent Color Picker */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-white/60 border border-pink-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                  style={{ backgroundColor: themeConfig.customAccentColor || (THEME_COLOR_MAP[themeConfig.preset]?.accent || '#ec4899') }}
                />
                <div>
                  <span className="text-xs font-bold text-black block leading-tight">Warna Aksen UI Bebas</span>
                  <span className="text-[10px] text-black/70">Ubah seluruh tombol &amp; aset warna UI</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={themeConfig.customAccentColor || (THEME_COLOR_MAP[themeConfig.preset]?.accent || '#ec4899')}
                  onChange={(e) => {
                    playTactileClick();
                    onUpdateTheme({ customAccentColor: e.target.value });
                  }}
                  className="w-8 h-8 rounded-lg cursor-pointer border border-white/60 bg-transparent p-0"
                  title="Pilih Warna Aksen Bebas"
                />
                {themeConfig.customAccentColor && (
                  <button
                    onClick={() => {
                      playTactileClick();
                      onUpdateTheme({ customAccentColor: undefined });
                    }}
                    className="text-[11px] font-bold text-rose-600 hover:underline px-1 py-0.5"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Custom Background from Gallery / Local File */}
          <div className="p-3.5 rounded-xl bg-white/60 border border-pink-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-pink-600" />
                <span>Wallpaper Kustom dari Galeri / Berkas</span>
              </label>

              {themeConfig.customBgUrl && (
                <button
                  onClick={() => {
                    playTactileClick();
                    onUpdateTheme({ customBgUrl: null });
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-600 hover:text-rose-700"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Hapus Foto</span>
                </button>
              )}
            </div>

            {themeConfig.customBgUrl ? (
              <div className="relative w-full h-28 rounded-xl overflow-hidden border border-pink-300 shadow-inner group">
                <img
                  src={themeConfig.customBgUrl}
                  alt="Custom Wallpaper"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-bold shadow-md cursor-pointer"
                  >
                    Ganti Foto Lain
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 rounded-xl border-2 border-dashed border-pink-300 hover:border-pink-400 bg-pink-50/50 hover:bg-pink-100/50 flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                <Upload className="w-5 h-5 text-pink-500 mb-1" />
                <span className="text-xs font-bold text-slate-700">
                  Pilih Foto dari Galeri HP / Komputer
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Mendukung JPG, PNG, WEBP (foto pribadi, anime, lanskap)
                </span>
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleCustomBgUpload}
            />

            {/* Sliders for Blur & Dimming (When custom background is active) */}
            {themeConfig.customBgUrl && (
              <div className="space-y-2 pt-2 border-t border-pink-100">
                {/* Blur Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Efek Blur Latar:</span>
                    <span>{themeConfig.bgBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    step={1}
                    value={themeConfig.bgBlur}
                    onChange={(e) => onUpdateTheme({ bgBlur: parseInt(e.target.value) })}
                    className="w-full h-1.5 bg-pink-200 rounded-full appearance-none cursor-pointer pink-slider"
                  />
                </div>

                {/* Dimming Slider */}
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                    <span>Kecerahan / Lapisan Kaca:</span>
                    <span>{Math.round((1 - themeConfig.bgDim) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={0.65}
                    step={0.05}
                    value={themeConfig.bgDim}
                    onChange={(e) => onUpdateTheme({ bgDim: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-pink-200 rounded-full appearance-none cursor-pointer pink-slider"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2">
          <button
            onClick={() => {
              playTactileClick();
              onClose();
            }}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            Terapkan &amp; Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
