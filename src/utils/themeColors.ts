import { ThemePresetId } from '../types';

export interface ThemeColorPalette {
  accent: string;
  accentText: string;
  accentBtnText: string;
  hover: string;
  dark: string;
  light: string;
  subtle: string;
  border: string;
  gradient: string;
  isDark: boolean;
}

export const THEME_COLOR_MAP: Record<ThemePresetId, ThemeColorPalette> = {
  'pastel-yellow': {
    accent: '#eab308',
    accentText: '#854d0e', // Rich amber-800, crystal clear on light backgrounds
    accentBtnText: '#0f172a', // Crisp dark text on yellow buttons
    hover: '#ca8a04',
    dark: '#a16207',
    light: 'rgba(234, 179, 8, 0.22)',
    subtle: 'rgba(234, 179, 8, 0.35)',
    border: 'rgba(202, 138, 4, 0.42)',
    gradient: 'linear-gradient(135deg, #facc15 0%, #f59e0b 100%)',
    isDark: false,
  },
  'pitch-black': {
    accent: '#ffffff',
    accentText: '#ffffff',
    accentBtnText: '#000000', // Bold black text on white buttons
    hover: '#e2e8f0',
    dark: '#94a3b8',
    light: 'rgba(255, 255, 255, 0.16)',
    subtle: 'rgba(255, 255, 255, 0.26)',
    border: 'rgba(255, 255, 255, 0.32)',
    gradient: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)',
    isDark: true,
  },
  'deep-navy': {
    accent: '#38bdf8',
    accentText: '#38bdf8',
    accentBtnText: '#020b1c', // Deep navy text on sky blue buttons
    hover: '#0ea5e9',
    dark: '#0284c7',
    light: 'rgba(56, 189, 248, 0.20)',
    subtle: 'rgba(56, 189, 248, 0.35)',
    border: 'rgba(56, 189, 248, 0.42)',
    gradient: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 100%)',
    isDark: true,
  },
  'soft-pink': {
    accent: '#ec4899',
    accentText: '#be185d', // Deep berry pink, clear contrast on light pink
    accentBtnText: '#ffffff',
    hover: '#db2777',
    dark: '#9d174d',
    light: 'rgba(236, 72, 153, 0.18)',
    subtle: 'rgba(236, 72, 153, 0.30)',
    border: 'rgba(236, 72, 153, 0.38)',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    isDark: false,
  },
  'cyber-magenta': {
    accent: '#ff007f',
    accentText: '#ff3399',
    accentBtnText: '#ffffff',
    hover: '#e00070',
    dark: '#c00060',
    light: 'rgba(255, 0, 127, 0.22)',
    subtle: 'rgba(255, 0, 127, 0.36)',
    border: 'rgba(255, 0, 127, 0.45)',
    gradient: 'linear-gradient(135deg, #ff007f 0%, #a21caf 100%)',
    isDark: true,
  },
  'midnight-amethyst': {
    accent: '#c084fc',
    accentText: '#d8b4fe',
    accentBtnText: '#0b0412',
    hover: '#a855f7',
    dark: '#9333ea',
    light: 'rgba(192, 132, 252, 0.22)',
    subtle: 'rgba(192, 132, 252, 0.36)',
    border: 'rgba(192, 132, 252, 0.45)',
    gradient: 'linear-gradient(135deg, #c084fc 0%, #7c3aed 100%)',
    isDark: true,
  },
  'emerald-mint': {
    accent: '#10b981',
    accentText: '#065f46', // Deep forest emerald, 100% readable
    accentBtnText: '#ffffff',
    hover: '#059669',
    dark: '#047857',
    light: 'rgba(16, 185, 129, 0.20)',
    subtle: 'rgba(16, 185, 129, 0.35)',
    border: 'rgba(16, 185, 129, 0.42)',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    isDark: false,
  },
  'ice-cyan': {
    accent: '#06b6d4',
    accentText: '#0369a1', // Deep ocean navy, 100% readable
    accentBtnText: '#ffffff',
    hover: '#0891b2',
    dark: '#0e7490',
    light: 'rgba(6, 182, 212, 0.20)',
    subtle: 'rgba(6, 182, 212, 0.35)',
    border: 'rgba(6, 182, 212, 0.42)',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
    isDark: false,
  },
};

/**
 * Applies CSS custom variables to the document element
 */
export function applyThemeColors(preset: ThemePresetId, customAccent?: string) {
  const palette = THEME_COLOR_MAP[preset] || THEME_COLOR_MAP['pastel-yellow'];
  const accent = customAccent || palette.accent;
  const hover = customAccent ? customAccent : palette.hover;
  const dark = customAccent ? customAccent : palette.dark;
  const light = customAccent ? `${customAccent}28` : palette.light;
  const subtle = customAccent ? `${customAccent}45` : palette.subtle;
  const border = customAccent ? `${customAccent}66` : palette.border;
  const gradient = customAccent ? `linear-gradient(135deg, ${customAccent} 0%, #f43f5e 100%)` : palette.gradient;

  // Calculate button text contrast for custom colors
  let accentBtnText = palette.accentBtnText;
  let accentText = palette.accentText;

  if (customAccent) {
    const hex = customAccent.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      accentBtnText = yiq >= 140 ? '#0f172a' : '#ffffff';
      accentText = yiq >= 140 ? (palette.isDark ? '#f8fafc' : '#713f12') : customAccent;
    }
  }

  const root = document.documentElement;
  if (palette.isDark) {
    root.classList.add('dark-theme-mode');
    root.classList.remove('light-theme-mode');
  } else {
    root.classList.add('light-theme-mode');
    root.classList.remove('dark-theme-mode');
  }

  root.style.setProperty('--theme-accent', accent);
  root.style.setProperty('--theme-accent-text', accentText);
  root.style.setProperty('--theme-accent-btn-text', accentBtnText);
  root.style.setProperty('--theme-accent-hover', hover);
  root.style.setProperty('--theme-accent-dark', dark);
  root.style.setProperty('--theme-accent-light', light);
  root.style.setProperty('--theme-accent-subtle', subtle);
  root.style.setProperty('--theme-accent-border', border);
  root.style.setProperty('--theme-gradient', gradient);
}
