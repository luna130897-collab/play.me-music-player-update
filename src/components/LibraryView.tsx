import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, 
  HardDrive, 
  Plus, 
  Search, 
  Music, 
  User, 
  Disc, 
  Clock,
  Sparkles,
  ShieldCheck,
  FolderOpen,
  Volume2,
  FolderPlus,
  Check
} from 'lucide-react';
import { Track, Playlist } from '../types';
import { playTactileClick } from '../utils/audioSynth';

interface LibraryViewProps {
  tracks: Track[];
  playlists: Playlist[];
  onPlayTrack: (index: number) => void;
  onAddFiles: (files: FileList | File[]) => void;
  onAddTrackToPlaylist: (playlistId: string, trackId: string) => void;
  onOpenBatchAddModal?: () => void;
  currentTrack: Track | null;
  isPlaying: boolean;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  tracks,
  playlists,
  onPlayTrack,
  onAddFiles,
  onAddTrackToPlaylist,
  onOpenBatchAddModal,
  currentTrack,
  isPlaying,
}) => {
  const [subTab, setSubTab] = useState<'tracks' | 'artists' | 'albums' | 'folders'>('tracks');
  const [search, setSearch] = useState('');
  const [openMenuTrackId, setOpenMenuTrackId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = () => setOpenMenuTrackId(null);
    if (openMenuTrackId) {
      window.addEventListener('click', handleOutsideClick);
    }
    return () => window.removeEventListener('click', handleOutsideClick);
  }, [openMenuTrackId]);

  // Stats
  const totalDuration = tracks.reduce((acc, t) => acc + (t.duration || 0), 0);
  const totalMins = Math.floor(totalDuration / 60);

  // Group by artist
  const artistsMap = tracks.reduce((acc, t) => {
    acc[t.artist] = (acc[t.artist] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Group by album
  const albumsMap = tracks.reduce((acc, t) => {
    acc[t.album] = (acc[t.album] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredTracks = tracks.map((track, originalIndex) => ({ track, originalIndex }))
    .filter(({ track }) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        track.title.toLowerCase().includes(q) ||
        track.artist.toLowerCase().includes(q) ||
        track.album.toLowerCase().includes(q)
      );
    });

  return (
    <div className="w-full glass-morph rounded-2xl p-3 sm:p-4 mb-20 select-none">
      {/* Offline Storage Card Banner */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-pink-200/60 to-rose-100/70 border border-pink-200/80 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center shadow-sm">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold text-slate-800">
                Penyimpanan Pustaka Lokal
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <p className="text-[11px] text-slate-600">
              {tracks.length} Berkas Audio • ±{totalMins} Menit Offline
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenBatchAddModal && (
            <button
              onClick={() => {
                playTactileClick();
                onOpenBatchAddModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              title="Pilih dan masukkan lagu pustaka ke playlist"
            >
              <FolderPlus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Tambah ke Playlist</span>
              <span className="sm:hidden">+ Playlist</span>
            </button>
          )}

          <button
            onClick={() => {
              playTactileClick();
              fileInputRef.current?.click();
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-50 text-pink-700 text-xs font-bold shadow-xs border border-pink-200 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Pindai Audio</span>
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="audio/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onAddFiles(e.target.files);
            }
          }}
        />
      </div>

      {/* Sub-tabs: Semua Lagu | Artis | Album | Folder */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/40 border border-pink-100 mb-3 text-xs font-bold text-slate-600">
        <button
          onClick={() => {
            playTactileClick();
            setSubTab('tracks');
          }}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            subTab === 'tracks' ? 'bg-white text-pink-700 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Semua Lagu
        </button>
        <button
          onClick={() => {
            playTactileClick();
            setSubTab('artists');
          }}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            subTab === 'artists' ? 'bg-white text-pink-700 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Artis
        </button>
        <button
          onClick={() => {
            playTactileClick();
            setSubTab('albums');
          }}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            subTab === 'albums' ? 'bg-white text-pink-700 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Album
        </button>
        <button
          onClick={() => {
            playTactileClick();
            setSubTab('folders');
          }}
          className={`flex-1 py-1.5 rounded-lg transition-colors ${
            subTab === 'folders' ? 'bg-white text-pink-700 shadow-xs' : 'hover:text-slate-900'
          }`}
        >
          Folder
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Cari lagu, musisi, atau album offline..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white/70 border border-pink-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-pink-400 shadow-2xs"
        />
      </div>

      {/* CONTENT: Tracks List */}
      {subTab === 'tracks' && (
        <div className="space-y-1">
          {filteredTracks.map(({ track, originalIndex }) => {
            const isCurrent = currentTrack && track.id === currentTrack.id;
            return (
              <div
                key={track.id}
                onClick={() => {
                  playTactileClick();
                  onPlayTrack(originalIndex);
                }}
                className={`p-2 rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                  isCurrent ? 'bg-pink-200/70 border border-pink-300' : 'hover:bg-white/50'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-pink-100 border border-pink-200 shadow-2xs">
                    {track.coverArt ? (
                      <img src={track.coverArt} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-pink-600">
                        ♫
                      </div>
                    )}
                  </div>
                  <div className="truncate">
                    <p className={`text-xs font-bold truncate leading-tight ${isCurrent ? 'text-pink-900' : 'text-slate-800'}`}>
                      {track.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {track.artist} • {track.format || 'MP3'}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2">
                  {isCurrent && isPlaying && (
                    <Volume2 className="w-3.5 h-3.5 text-pink-600 animate-pulse" />
                  )}
                  <div>
                    <span className="text-[10px] text-black font-mono font-bold block">
                      {Math.floor(track.duration / 60)}:{String(Math.floor(track.duration % 60)).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] text-pink-600 font-extrabold">
                      {track.bitrate || '320k'}
                    </span>
                  </div>

                  {/* Add to Playlist button & dropdown */}
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playTactileClick();
                        setOpenMenuTrackId(openMenuTrackId === track.id ? null : track.id);
                      }}
                      className="p-1.5 rounded-lg bg-white/70 hover:bg-white text-black hover:text-pink-600 border border-pink-200/80 shadow-2xs transition-colors cursor-pointer"
                      title="Tambahkan lagu ini ke Playlist"
                    >
                      <FolderPlus className="w-3.5 h-3.5" />
                    </button>

                    {openMenuTrackId === track.id && (
                      <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-full mt-1 w-48 rounded-xl glass-morph bg-white/95 p-1.5 border border-pink-300 shadow-xl z-30 animate-fadeIn"
                      >
                        <span className="text-[10px] font-extrabold text-black px-2 py-1 block uppercase tracking-wider">
                          Tambah ke Playlist:
                        </span>
                        <div className="space-y-1 max-h-40 overflow-y-auto y2k-scrollbar">
                          {playlists.map((pl) => {
                            const isAlreadyIn = pl.trackIds.includes(track.id);
                            return (
                              <button
                                key={pl.id}
                                onClick={() => {
                                  playTactileClick();
                                  onAddTrackToPlaylist(pl.id, track.id);
                                  setOpenMenuTrackId(null);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                                  isAlreadyIn
                                    ? 'bg-pink-100/70 text-pink-700'
                                    : 'hover:bg-pink-100 text-black'
                                }`}
                              >
                                <span className="truncate">{pl.name}</span>
                                {isAlreadyIn && <Check className="w-3.5 h-3.5 text-pink-600 stroke-[3]" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONTENT: Artists List */}
      {subTab === 'artists' && (
        <div className="space-y-1.5">
          {Object.entries(artistsMap).map(([artistName, count]) => (
            <div
              key={artistName}
              className="p-2.5 rounded-xl bg-white/40 hover:bg-white/60 border border-pink-100 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center font-bold text-sm">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{artistName}</p>
                  <p className="text-[10px] text-slate-500">{count} trek offline</p>
                </div>
              </div>
              <span className="text-[11px] text-pink-600 font-medium">Buka ›</span>
            </div>
          ))}
        </div>
      )}

      {/* CONTENT: Albums List */}
      {subTab === 'albums' && (
        <div className="space-y-1.5">
          {Object.entries(albumsMap).map(([albumName, count]) => (
            <div
              key={albumName}
              className="p-2.5 rounded-xl bg-white/40 hover:bg-white/60 border border-pink-100 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-200 text-rose-700 flex items-center justify-center font-bold text-sm">
                  <Disc className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{albumName}</p>
                  <p className="text-[10px] text-slate-500">{count} trek</p>
                </div>
              </div>
              <span className="text-[11px] text-pink-600 font-medium">Buka ›</span>
            </div>
          ))}
        </div>
      )}

      {/* CONTENT: Folders List */}
      {subTab === 'folders' && (
        <div className="space-y-2">
          <div className="p-3 rounded-xl bg-white/50 border border-pink-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FolderOpen className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-slate-800">/storage/emulated/0/Music</p>
                <p className="text-[10px] text-slate-500">Berkas musik utama Android</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-pink-600">{tracks.length} berkas</span>
          </div>

          <div className="p-3 rounded-xl bg-white/50 border border-pink-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Folder className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-xs font-bold text-slate-800">/storage/emulated/0/Download</p>
                <p className="text-[10px] text-slate-500">Unduhan lagu &amp; nada dering</p>
              </div>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] px-2 py-0.5 rounded bg-pink-100 text-pink-700 font-bold"
            >
              + Buka
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
