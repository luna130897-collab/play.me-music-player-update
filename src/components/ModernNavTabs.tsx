import React from 'react';
import { ListMusic, Library, Mic2, Sliders, Moon } from 'lucide-react';
import { MainNavTab } from '../types';
import { playTactileClick } from '../utils/audioSynth';

interface ModernNavTabsProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  sleepTimerRemaining: number | null;
}

export const ModernNavTabs: React.FC<ModernNavTabsProps> = ({
  activeTab,
  onSelectTab,
  sleepTimerRemaining,
}) => {
  const tabs = [
    {
      id: 'playlist' as MainNavTab,
      label: 'Daftar Putar',
      icon: ListMusic,
    },
    {
      id: 'library' as MainNavTab,
      label: 'Pustaka Lokal',
      icon: Library,
    },
    {
      id: 'lyrics' as MainNavTab,
      label: 'Lirik & Visual',
      icon: Mic2,
    },
    {
      id: 'equalizer' as MainNavTab,
      label: 'Studio EQ',
      icon: Sliders,
      badge: sleepTimerRemaining ? `${Math.ceil(sleepTimerRemaining / 60)}m` : undefined,
    },
  ];

  return (
    <nav className="w-full glass-morph rounded-2xl p-1.5 my-2.5 shadow-sm border border-white/80 select-none">
      <div className="grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                playTactileClick();
                onSelectTab(tab.id);
              }}
              className={`relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
                isActive
                  ? 'bg-white/85 text-pink-700 font-extrabold shadow-sm'
                  : 'text-black font-bold hover:text-pink-600 hover:bg-white/40'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 text-[9px] font-bold px-1 rounded-full bg-pink-500 text-white shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] leading-tight tracking-tight truncate max-w-full">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
