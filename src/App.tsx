import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import { TopGifStage } from './components/TopGifStage';
import { ModernNavTabs } from './components/ModernNavTabs';
import { PlaylistHeader } from './components/PlaylistHeader';
import { InlineNowPlayingCard } from './components/InlineNowPlayingCard';
import { PlaylistTable } from './components/PlaylistTable';
import { LibraryView } from './components/LibraryView';
import { LyricsVisualView } from './components/LyricsVisualView';
import { EqualizerTimerView } from './components/EqualizerTimerView';
import { BottomPlayerBar } from './components/BottomPlayerBar';
import { GifUploadModal } from './components/GifUploadModal';
import { TrackDetailModal } from './components/TrackDetailModal';
import { ThemeModal } from './components/ThemeModal';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ChangePlaylistCoverModal } from './components/ChangePlaylistCoverModal';
import { AddSongsToPlaylistModal } from './components/AddSongsToPlaylistModal';
import { GifPresetId, MainNavTab, Track, ThemeConfig, Playlist } from './types';
import { applyThemeColors } from './utils/themeColors';

const INITIAL_PLAYLISTS: Playlist[] = [
  {
    id: 'playlist-1',
    name: 'Selonjoraaannn',
    creator: 'voidcat101',
    coverArt: '',
    trackIds: ['track-1', 'track-2', 'track-3', 'track-4'],
    createdAt: 'July 21, 2022',
  },
  {
    id: 'playlist-2',
    name: 'Lofi Chill Sore',
    creator: 'voidcat101',
    coverEmoji: '☕',
    trackIds: ['track-1', 'track-3', 'track-4'],
    createdAt: 'August 05, 2022',
  },
];

export default function App() {
  const {
    allTracks,
    activeQueue,
    currentTrack,
    currentIndex,
    playbackSource,
    isPlaying,
    currentTime,
    duration,
    repeatMode,
    isShuffle,
    volume,
    beatEnergy,
    audioFX,
    sleepTimer,
    audioRef,
    setVolume,
    setAudioFX,
    setSleepTimer,
    playFromQueue,
    togglePlay,
    nextTrack,
    prevTrack,
    seek,
    toggleRepeat,
    toggleShuffle,
    toggleLike,
    playNext,
    addLocalFiles,
    removeTrack,
  } = useAudioPlayer();

  const [activeTab, setActiveTab] = useState<MainNavTab>('playlist');
  const [currentGifId, setCurrentGifId] = useState<GifPresetId>('gif-1');
  const [customMediaUrl, setCustomMediaUrl] = useState<string | undefined>(undefined);
  const [customMediaType, setCustomMediaType] = useState<'gif' | 'video' | undefined>(undefined);
  
  // Playlist & Creator Name Management
  const [creatorName, setCreatorName] = useState<string>('voidcat101');
  const [creatorAvatar, setCreatorAvatar] = useState<string>('🐱');
  const [playlists, setPlaylists] = useState<Playlist[]>(INITIAL_PLAYLISTS);
  const [activePlaylistId, setActivePlaylistId] = useState<string>('playlist-1');

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isCreatePlaylistOpen, setIsCreatePlaylistOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [isChangeCoverOpen, setIsChangeCoverOpen] = useState<boolean>(false);
  const [isAddSongsModalOpen, setIsAddSongsModalOpen] = useState<boolean>(false);
  const [detailTrack, setDetailTrack] = useState<Track | null>(null);

  // Scroll detection to hide Now Playing at the top and reveal it when scrolling down
  const [isScrolledDown, setIsScrolledDown] = useState<boolean>(false);

  React.useEffect(() => {
    const handleScroll = () => {
      // Reveal Now Playing when scrolled down past ~60px
      setIsScrolledDown(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial state
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme & Custom Background Configuration
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    preset: 'pastel-yellow',
    customBgUrl: null,
    bgBlur: 0,
    bgDim: 0.1,
  });

  // Dynamically apply accent color palette to all pink UI assets
  useEffect(() => {
    applyThemeColors(themeConfig.preset, themeConfig.customAccentColor);
  }, [themeConfig.preset, themeConfig.customAccentColor]);

  // Active playlist object
  const activePlaylist = playlists.find((p) => p.id === activePlaylistId) || playlists[0] || {
    id: 'playlist-1',
    name: 'Selonjoraaannn',
    creator: creatorName,
    trackIds: ['track-1', 'track-2', 'track-3', 'track-4'],
    createdAt: 'July 21, 2022',
  };

  // Tracks belonging strictly to current playlist
  const playlistTracks = allTracks.filter((t) =>
    activePlaylist.trackIds.length > 0 ? activePlaylist.trackIds.includes(t.id) : true
  );

  const handleUploadMedia = (file: File) => {
    const url = URL.createObjectURL(file);
    const isVideo = file.type.startsWith('video/');
    setCustomMediaUrl(url);
    setCustomMediaType(isVideo ? 'video' : 'gif');
    setCurrentGifId('custom');
  };

  const handleSetMediaUrl = (url: string, type: 'gif' | 'video') => {
    setCustomMediaUrl(url);
    setCustomMediaType(type);
    setCurrentGifId('custom');
  };

  // Create new playlist imported from local library
  const handleCreatePlaylist = (newPl: Playlist) => {
    setPlaylists((prev) => [...prev, newPl]);
    setActivePlaylistId(newPl.id);
  };

  // Update creator profile name & avatar
  const handleSaveProfile = (name: string, avatar: string) => {
    setCreatorName(name);
    setCreatorAvatar(avatar);
    setPlaylists((prev) =>
      prev.map((pl) => (pl.creator === creatorName ? { ...pl, creator: name } : pl))
    );
  };

  // Update playlist cover thumbnail, emoji & name
  const handleSavePlaylistCover = (
    playlistId: string,
    newCoverArt?: string,
    newEmoji?: string,
    newName?: string
  ) => {
    setPlaylists((prev) =>
      prev.map((pl) =>
        pl.id === playlistId
          ? {
              ...pl,
              coverArt: newCoverArt,
              coverEmoji: newEmoji || pl.coverEmoji,
              name: newName ? newName.trim() : pl.name,
            }
          : pl
      )
    );
  };

  // Quick rename playlist directly on click
  const handleRenamePlaylist = (playlistId: string, newName: string) => {
    if (!newName.trim()) return;
    setPlaylists((prev) =>
      prev.map((pl) => (pl.id === playlistId ? { ...pl, name: newName.trim() } : pl))
    );
  };

  // Add tracks from library to a playlist
  const handleAddTracksToPlaylist = (playlistId: string, trackIdsToAdd: string[]) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id === playlistId) {
          const merged = [...new Set([...pl.trackIds, ...trackIdsToAdd])];
          return { ...pl, trackIds: merged };
        }
        return pl;
      })
    );
  };

  const handleAddSingleTrackToPlaylist = (playlistId: string, trackId: string) => {
    handleAddTracksToPlaylist(playlistId, [trackId]);
  };

  // When files are added directly to the active playlist
  const handleAddFilesToPlaylist = async (files: FileList | File[]) => {
    const prevCount = allTracks.length;
    await addLocalFiles(files);
    // Automatically link new tracks to the active playlist
    setTimeout(() => {
      setPlaylists((prev) =>
        prev.map((pl) => {
          if (pl.id === activePlaylist.id) {
            return {
              ...pl,
              trackIds: [...new Set([...pl.trackIds, ...allTracks.slice(prevCount).map((t) => t.id)])],
            };
          }
          return pl;
        })
      );
    }, 100);
  };

  // Preset Theme Background Styling
  const getThemeBaseClass = () => {
    if (themeConfig.customBgUrl) return 'bg-transparent text-slate-900';
    switch (themeConfig.preset) {
      case 'pitch-black':
        return 'bg-[#030303] text-white dark-theme-mode';
      case 'deep-navy':
        return 'bg-[#020b1c] text-white dark-theme-mode';
      case 'cyber-magenta':
        return 'bg-[#180216] text-pink-100 dark-theme-mode';
      case 'midnight-amethyst':
        return 'bg-[#0b0412] text-slate-100 dark-theme-mode';
      case 'emerald-mint':
        return 'bg-[#ecfdf5] text-slate-800 light-theme-mode';
      case 'ice-cyan':
        return 'bg-[#f0f9ff] text-slate-800 light-theme-mode';
      case 'soft-pink':
        return 'bg-[#fce7f3] text-slate-800 light-theme-mode';
      case 'pastel-yellow':
      default:
        return 'bg-[#fefce8] text-slate-800 light-theme-mode';
    }
  };

  return (
    <div className={`min-h-screen w-full relative overflow-x-hidden pb-12 transition-colors duration-500 ${getThemeBaseClass()} ${themeConfig.customBgUrl ? 'custom-theme-active' : ''}`}>
      {/* Real HTML5 Audio Element connected to Web Audio Graph */}
      <audio ref={audioRef} crossOrigin="anonymous" preload="auto" />

      {/* =========================================================================
          DYNAMIC BACKGROUND: CUSTOM IMAGE / WALLPAPER OR PRESET GLASS GLOW
         ========================================================================= */}
      {themeConfig.customBgUrl ? (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <img
            src={themeConfig.customBgUrl}
            alt=""
            className="w-full h-full object-cover transition-all duration-300"
            style={{
              filter: `blur(${themeConfig.bgBlur}px)`,
              transform: `scale(${1 + (themeConfig.bgBlur > 0 ? 0.08 : 0)})`,
            }}
          />
          <div 
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0, 0, 0, ${themeConfig.bgDim})` }}
          />
        </div>
      ) : (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          {themeConfig.preset === 'cyber-magenta' ? (
            <>
              <div 
                className="absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full bg-fuchsia-600/50 blur-[90px] transition-transform duration-300"
                style={{ transform: `scale(${isPlaying ? 1 + beatEnergy * 0.2 : 1})` }}
              />
              <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-pink-600/40 blur-[85px]" />
              <div className="absolute -bottom-24 left-1/4 w-[450px] h-96 rounded-full bg-purple-700/50 blur-[95px]" />
            </>
          ) : themeConfig.preset === 'midnight-amethyst' ? (
            <>
              <div 
                className="absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full bg-purple-900/60 blur-[90px] transition-transform duration-300"
                style={{ transform: `scale(${isPlaying ? 1 + beatEnergy * 0.15 : 1})` }}
              />
              <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-indigo-900/50 blur-[85px]" />
              <div className="absolute -bottom-24 left-1/4 w-[450px] h-96 rounded-full bg-slate-900/80 blur-[95px]" />
            </>
          ) : themeConfig.preset === 'emerald-mint' ? (
            <>
              <div 
                className="absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full bg-emerald-300/60 blur-[80px] transition-transform duration-300"
                style={{ transform: `scale(${isPlaying ? 1 + beatEnergy * 0.15 : 1})` }}
              />
              <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-teal-200/70 blur-[80px]" />
              <div className="absolute -bottom-24 left-1/4 w-[450px] h-96 rounded-full bg-green-200/50 blur-[90px]" />
            </>
          ) : themeConfig.preset === 'ice-cyan' ? (
            <>
              <div 
                className="absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full bg-cyan-300/60 blur-[80px] transition-transform duration-300"
                style={{ transform: `scale(${isPlaying ? 1 + beatEnergy * 0.15 : 1})` }}
              />
              <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-sky-200/70 blur-[80px]" />
              <div className="absolute -bottom-24 left-1/4 w-[450px] h-96 rounded-full bg-blue-200/50 blur-[90px]" />
            </>
          ) : themeConfig.preset === 'pitch-black' ? (
            <>
              <div 
                className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-zinc-800/40 blur-[85px] transition-transform duration-300"
                style={{ transform: `scale(${isPlaying ? 1 + beatEnergy * 0.15 : 1})` }}
              />
              <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-neutral-900/70 blur-[90px]" />
              <div className="absolute -bottom-24 left-1/4 w-[450px] h-[450px] rounded-full bg-stone-900/60 blur-[95px]" />
            </>
          ) : themeConfig.preset === 'deep-navy' ? (
            <>
              <div 
                className="absolute -top-24 -left-24 w-[450px] h-[450px] rounded-full bg-blue-900/60 blur-[85px] transition-transform duration-300"
                style={{ transform: `scale(${isPlaying ? 1 + beatEnergy * 0.15 : 1})` }}
              />
              <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-sky-950/70 blur-[90px]" />
              <div className="absolute -bottom-24 left-1/4 w-[450px] h-[450px] rounded-full bg-indigo-950/70 blur-[95px]" />
            </>
          ) : themeConfig.preset === 'soft-pink' ? (
            <>
              <div 
                className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-pink-300/60 blur-[75px] transition-transform duration-300"
                style={{ transform: `scale(${isPlaying ? 1 + beatEnergy * 0.15 : 1})` }}
              />
              <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-rose-200/70 blur-[80px]" />
              <div className="absolute -bottom-24 left-1/4 w-[450px] h-[450px] rounded-full bg-fuchsia-200/50 blur-[90px]" />
            </>
          ) : (
            <>
              <div 
                className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-yellow-300/60 blur-[75px] transition-transform duration-300"
                style={{ transform: `scale(${isPlaying ? 1 + beatEnergy * 0.15 : 1})` }}
              />
              <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-amber-200/70 blur-[80px]" />
              <div className="absolute -bottom-24 left-1/4 w-[450px] h-[450px] rounded-full bg-orange-200/50 blur-[90px]" />
            </>
          )}
        </div>
      )}

      {/* =========================================================================
          MAIN CONTAINER (Sized to Standard Android Screen: max-w-[430px])
         ========================================================================= */}
      <main className="w-full max-w-[430px] sm:max-w-2xl min-h-screen mx-auto px-3 sm:px-4 py-2 sm:py-4 flex flex-col items-center">
        {/* 1. TOP HERO ANIMATION / VISUALIZER (GIF DI ATAS TETAP TERLIHAT!) */}
        <TopGifStage
          currentGifId={currentGifId}
          onSelectGif={setCurrentGifId}
          isPlaying={isPlaying}
          beatEnergy={beatEnergy}
          customMediaUrl={customMediaUrl}
          customMediaType={customMediaType}
          onOpenUploadModal={() => setIsUploadModalOpen(true)}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
        />

        {/* 2. MODERN NAVIGATION TAB BAR */}
        <ModernNavTabs
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          sleepTimerRemaining={sleepTimer}
        />

        {/* 3. CONDITIONAL MAIN VIEWS ACCORDING TO USER'S CONTEXT */}
        {activeTab === 'playlist' && (
          <>
            {/* 1. MENU SEDANG MEMUTAR DARI... */}
            <InlineNowPlayingCard
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              repeatMode={repeatMode}
              isShuffle={isShuffle}
              beatEnergy={beatEnergy}
              playlistName={playbackSource.name}
              className="mb-3"
              onTogglePlay={togglePlay}
              onNext={nextTrack}
              onPrev={prevTrack}
              onSeek={seek}
              onToggleRepeat={toggleRepeat}
              onToggleShuffle={toggleShuffle}
              onToggleLike={toggleLike}
            />

            {/* 2. PANEL / MENU PLAYLIST (TEPAT DI BAWAH MENU SEDANG MEMUTAR) */}
            <PlaylistHeader
              playlists={playlists}
              activePlaylist={activePlaylist}
              onSelectPlaylist={(id) => {
                setActivePlaylistId(id);
                // When switching playlist, if playing from playlist, auto-sync
                const chosen = playlists.find((p) => p.id === id);
                if (chosen) {
                  const tracks = allTracks.filter((t) => chosen.trackIds.includes(t.id));
                  if (tracks.length > 0) {
                    playFromQueue(tracks, 0, { type: 'playlist', id: chosen.id, name: chosen.name });
                  }
                }
              }}
              creatorName={creatorName}
              creatorAvatar={creatorAvatar}
              songCount={playlistTracks.length}
              onOpenThemeModal={() => setIsThemeModalOpen(true)}
              onOpenCreatePlaylist={() => setIsCreatePlaylistOpen(true)}
              onOpenEditProfile={() => setIsEditProfileOpen(true)}
              onOpenChangeCover={() => setIsChangeCoverOpen(true)}
              onRenamePlaylist={handleRenamePlaylist}
            />

            {/* 3. DAFTAR LAGU PLAYLIST DI BAWAHNYA (HANYA BERISI LAGU DARI PLAYLIST TERSEBUT!) */}
            <PlaylistTable
              tracks={playlistTracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={(idx) => {
                playFromQueue(playlistTracks, idx, {
                  type: 'playlist',
                  id: activePlaylist.id,
                  name: activePlaylist.name,
                });
              }}
              onTogglePlay={() => {
                if (playbackSource.id !== activePlaylist.id || playbackSource.type !== 'playlist') {
                  playFromQueue(playlistTracks, 0, {
                    type: 'playlist',
                    id: activePlaylist.id,
                    name: activePlaylist.name,
                  });
                } else {
                  togglePlay();
                }
              }}
              onToggleLike={toggleLike}
              onAddFiles={handleAddFilesToPlaylist}
              onSelectTrackForDetail={setDetailTrack}
              onOpenAddSongsModal={() => setIsAddSongsModalOpen(true)}
            />
          </>
        )}

        {activeTab === 'library' && (
          <>
            {/* Jika sedang memutar, tampilkan Now Playing Card di Pustaka Lokal */}
            {currentTrack && (
              <InlineNowPlayingCard
                currentTrack={currentTrack}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                repeatMode={repeatMode}
                isShuffle={isShuffle}
                beatEnergy={beatEnergy}
                playlistName={playbackSource.name}
                onTogglePlay={togglePlay}
                onNext={nextTrack}
                onPrev={prevTrack}
                onSeek={seek}
                onToggleRepeat={toggleRepeat}
                onToggleShuffle={toggleShuffle}
                onToggleLike={toggleLike}
              />
            )}

            {/* DAFTAR LAGU PUSTAKA LOKAL (HANYA BERISI DARI PUSTAKA LOKAL!) */}
            <LibraryView
              tracks={allTracks}
              playlists={playlists}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayTrack={(idx) => {
                playFromQueue(allTracks, idx, {
                  type: 'library',
                  id: 'library',
                  name: 'Pustaka Lokal',
                });
              }}
              onAddFiles={addLocalFiles}
              onAddTrackToPlaylist={handleAddSingleTrackToPlaylist}
              onOpenBatchAddModal={() => setIsAddSongsModalOpen(true)}
            />
          </>
        )}

        {activeTab === 'lyrics' && (
          <LyricsVisualView
            currentTrack={currentTrack}
            isPlaying={isPlaying}
            currentTime={currentTime}
            duration={duration}
            beatEnergy={beatEnergy}
            currentGifId={currentGifId}
            onSeek={seek}
          />
        )}

        {activeTab === 'equalizer' && (
          <EqualizerTimerView
            audioFX={audioFX}
            onChangeFX={(partial) => setAudioFX((prev) => ({ ...prev, ...partial }))}
            sleepTimer={sleepTimer}
            onSetSleepTimer={setSleepTimer}
          />
        )}
      </main>

      {/* =========================================================================
          4. BOTTOM PERSISTENT PLAYER BAR (NOW PLAYING YANG MELAYANG DI BAWAH)
          Tersembunyi di awal halaman utama atas, dan muncul meluncur naik saat scroll ke bawah
         ========================================================================= */}
      <BottomPlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        repeatMode={repeatMode}
        isShuffle={isShuffle}
        volume={volume}
        sleepTimer={sleepTimer}
        isVisible={isScrolledDown}
        onTogglePlay={togglePlay}
        onNext={nextTrack}
        onPrev={prevTrack}
        onSeek={seek}
        onVolumeChange={setVolume}
        onToggleRepeat={toggleRepeat}
        onToggleShuffle={toggleShuffle}
        onToggleLike={toggleLike}
        onOpenLyricsVisual={() => setActiveTab('lyrics')}
      />

      {/* 5. MODALS */}
      {/* Upload Custom GIF / Video Modal */}
      <GifUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadMedia={handleUploadMedia}
        onSetMediaUrl={handleSetMediaUrl}
      />

      {/* Track Detail & Action Modal */}
      <TrackDetailModal
        track={detailTrack}
        isOpen={detailTrack !== null}
        onClose={() => setDetailTrack(null)}
        onPlayNext={playNext}
        onToggleLike={toggleLike}
        onRemoveTrack={removeTrack}
      />

      {/* Theme & Custom Background Modal */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        themeConfig={themeConfig}
        onUpdateTheme={(partial) => setThemeConfig((prev) => ({ ...prev, ...partial }))}
      />

      {/* Create Playlist Modal (Import from Local Library) */}
      <CreatePlaylistModal
        isOpen={isCreatePlaylistOpen}
        onClose={() => setIsCreatePlaylistOpen(false)}
        availableTracks={allTracks}
        creatorName={creatorName}
        onCreatePlaylist={handleCreatePlaylist}
      />

      {/* Edit Profile Modal (Change Creator Name) */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        creatorName={creatorName}
        creatorAvatar={creatorAvatar}
        onSaveProfile={handleSaveProfile}
      />

      {/* Change Playlist Cover Thumbnail Modal */}
      <ChangePlaylistCoverModal
        isOpen={isChangeCoverOpen}
        onClose={() => setIsChangeCoverOpen(false)}
        playlist={activePlaylist}
        onSaveCover={handleSavePlaylistCover}
      />

      {/* Add Songs to Playlist from Local Library Modal */}
      <AddSongsToPlaylistModal
        isOpen={isAddSongsModalOpen}
        onClose={() => setIsAddSongsModalOpen(false)}
        playlist={activePlaylist}
        availableTracks={allTracks}
        onAddTracksToPlaylist={handleAddTracksToPlaylist}
        onScanNewFiles={handleAddFilesToPlaylist}
      />
    </div>
  );
}
