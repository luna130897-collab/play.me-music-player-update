import { useState, useEffect, useRef, useCallback } from 'react';
import { Track, RepeatMode, AudioFXSettings, PlaybackSource } from '../types';
import { 
  generateSoftSpotTrack, 
  generateDevilInITrack, 
  generateWolfcatTrack, 
  generateGoldenHourTrack, 
  playTactileClick 
} from '../utils/audioSynth';
import { 
  SOFT_SPOT_COVER, 
  SLIPKNOT_COVER, 
  WOLFCAT_COVER, 
  GOLDEN_HOUR_COVER 
} from '../utils/coverArt';
import { parseAudioMetadata } from '../utils/id3Parser';

const DEFAULT_AUDIO_FX: AudioFXSettings = {
  bassBoost: 6,
  treble: 2,
  playbackRate: 1.0,
  virtualizer: true,
};

export function useAudioPlayer() {
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [activeQueue, setActiveQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [playbackSource, setPlaybackSource] = useState<PlaybackSource>({
    type: 'playlist',
    id: 'playlist-1',
    name: 'Selonjoraaannn',
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>('all');
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.85);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [beatEnergy, setBeatEnergy] = useState<number>(0);
  const [audioFX, setAudioFX] = useState<AudioFXSettings>(DEFAULT_AUDIO_FX);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const bassFilterRef = useRef<BiquadFilterNode | null>(null);
  const trebleFilterRef = useRef<BiquadFilterNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize demo tracks on mount
  useEffect(() => {
    let isCancelled = false;

    async function loadDemoTracks() {
      try {
        const softSpotUrl = await generateSoftSpotTrack();
        const devilUrl = await generateDevilInITrack();
        const wolfcatUrl = await generateWolfcatTrack();
        const goldenHourUrl = await generateGoldenHourTrack();

        if (isCancelled) return;

        const demoTracks: Track[] = [
          {
            id: 'track-1',
            title: 'soft spot',
            artist: 'Piri, Tommy Villiers',
            album: 'soft spot',
            dateAdded: 'July 21, 2022',
            duration: 220,
            url: softSpotUrl,
            coverArt: SOFT_SPOT_COVER,
            isLiked: true,
            format: 'FLAC 24-bit',
            bitrate: '940 kbps',
            fileSize: '24.8 MB',
            lyrics: [
              'You hit me like a summer rain',
              'Wash away all the heavy pain',
              'Got a soft spot right inside my heart',
              'Dancing through the midnight dark',
              'Every whisper feels like velvet skies',
              'I see the universe inside your eyes',
              'Never wanna wake up from this dream',
              'Drifting down the river stream',
            ],
          },
          {
            id: 'track-2',
            title: 'The Devil in I',
            artist: 'Slipknot',
            album: '.5 The Gray Chapter',
            dateAdded: 'July 19, 2022',
            duration: 343,
            url: devilUrl,
            coverArt: SLIPKNOT_COVER,
            isLiked: true,
            format: 'MP3 Stereo',
            bitrate: '320 kbps',
            fileSize: '13.2 MB',
            lyrics: [
              'Undo these handcuffs, let me breathe',
              'The world you know is crumbling deep',
              'Step inside, see the devil in I',
              'Too many times we stood and died',
              'You will not see me fall tonight',
              'Under the cold and darkened sky',
              'Step inside, walk with the fire',
              'Reaching through the barbed wire',
            ],
          },
          {
            id: 'track-3',
            title: 'Wolfcat',
            artist: 'Still Woozy',
            album: 'Wolfcat',
            dateAdded: 'July 01, 2022',
            duration: 174,
            url: wolfcatUrl,
            coverArt: WOLFCAT_COVER,
            isLiked: true,
            explicit: true,
            format: 'MP3 Stereo',
            bitrate: '320 kbps',
            fileSize: '7.1 MB',
            lyrics: [
              'Floating on a cloud in the living room',
              'Watching yellow flowers bloom',
              'Wolfcat purring on the wooden floor',
              'Tell me what we are waiting for',
              'Sunlight spilling through the kitchen glass',
              'Hoping this sunny afternoon will last',
              'Take my hand and let the world spin slow',
              'Nowhere else we need to go',
            ],
          },
          {
            id: 'track-4',
            title: 'golden hour',
            artist: 'JVKE',
            album: 'this is what ____ feels like',
            dateAdded: 'June 14, 2022',
            duration: 209,
            url: goldenHourUrl,
            coverArt: GOLDEN_HOUR_COVER,
            isLiked: true,
            format: 'AAC High-Res',
            bitrate: '320 kbps',
            fileSize: '8.2 MB',
            lyrics: [
              'It was just two lovers sittin’ in the car',
              'Listening to Blonde, fallin’ for each other',
              'Pink and orange skies, feelin’ super enterprise',
              'Ain’t nothin’ else that I’d rather do',
              'Than sit right here and look at you',
              'I was all alone with the love of my life',
              'She’s got glitter for skin, my radiant beam in the night',
              'I don’t need no light to see you shine',
              'It’s your golden hour, you slow down time',
            ],
          },
        ];

        setAllTracks(demoTracks);
        setActiveQueue(demoTracks);
        setCurrentIndex(0);
        setIsReady(true);
      } catch (err) {
        console.error('Failed to generate initial demo tracks', err);
        setIsReady(true);
      }
    }

    loadDemoTracks();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Web Audio Graph
  const initAudioGraph = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioCtxRef.current = ctx;

      const source = ctx.createMediaElementSource(audioRef.current);
      sourceNodeRef.current = source;

      const bass = ctx.createBiquadFilter();
      bass.type = 'lowshelf';
      bass.frequency.value = 120;
      bass.gain.value = audioFX.bassBoost;
      bassFilterRef.current = bass;

      const treble = ctx.createBiquadFilter();
      treble.type = 'highshelf';
      treble.frequency.value = 3600;
      treble.gain.value = audioFX.treble;
      trebleFilterRef.current = treble;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const gain = ctx.createGain();
      gain.gain.value = volume;
      gainNodeRef.current = gain;

      source.connect(bass);
      bass.connect(treble);
      treble.connect(analyser);
      analyser.connect(gain);
      gain.connect(ctx.destination);
    } catch (e) {
      console.warn('Web Audio initialization error:', e);
    }
  }, [audioFX.bassBoost, audioFX.treble, volume]);

  // Sync Audio FX changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = audioFX.playbackRate;
      audioRef.current.volume = volume;
    }
    if (bassFilterRef.current) {
      bassFilterRef.current.gain.value = audioFX.bassBoost;
    }
    if (trebleFilterRef.current) {
      trebleFilterRef.current.gain.value = audioFX.treble;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [audioFX, volume]);

  // Sleep timer interval countdown
  useEffect(() => {
    if (sleepTimer === null) return;

    const interval = setInterval(() => {
      setSleepTimer((prev) => {
        if (prev === null || prev <= 1) {
          if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimer]);

  // Beat analyzer for visualizer sync
  useEffect(() => {
    const updateAudioMeters = () => {
      if (analyserRef.current && isPlaying) {
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < 4; i++) sum += data[i] || 0;
        setBeatEnergy(sum / (4 * 255));
      } else if (!isPlaying) {
        setBeatEnergy(0);
      }
      animFrameRef.current = requestAnimationFrame(updateAudioMeters);
    };

    animFrameRef.current = requestAnimationFrame(updateAudioMeters);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  const currentTrack = activeQueue[currentIndex] || null;

  // PLAY FROM QUEUE: Strictly sets queue to the chosen source list (e.g. Selonjoraaannn or Pustaka Lokal)
  const playFromQueue = useCallback(async (queue: Track[], index: number, source: PlaybackSource) => {
    if (!queue || queue.length === 0 || !queue[index]) return;
    initAudioGraph();

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    setActiveQueue(queue);
    setPlaybackSource(source);
    setCurrentIndex(index);

    if (audioRef.current) {
      audioRef.current.src = queue[index].url;
      audioRef.current.load();
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Playback error:', err);
      }
    }
  }, [initAudioGraph]);

  // Toggle play/pause
  const togglePlay = useCallback(async () => {
    playTactileClick();
    initAudioGraph();

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume();
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src && currentTrack) {
        audioRef.current.src = currentTrack.url;
      }
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn('Play error:', err);
      }
    }
  }, [isPlaying, currentTrack, initAudioGraph]);

  // Next Track - strictly within activeQueue
  const nextTrack = useCallback(() => {
    playTactileClick();
    if (activeQueue.length === 0) return;
    let nextIdx = currentIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * activeQueue.length);
    } else if (nextIdx >= activeQueue.length) {
      nextIdx = 0;
    }
    playFromQueue(activeQueue, nextIdx, playbackSource);
  }, [activeQueue, currentIndex, isShuffle, playFromQueue, playbackSource]);

  // Prev Track - strictly within activeQueue
  const prevTrack = useCallback(() => {
    playTactileClick();
    if (activeQueue.length === 0) return;
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      return;
    }
    let prevIdx = currentIndex - 1;
    if (prevIdx < 0) prevIdx = activeQueue.length - 1;
    playFromQueue(activeQueue, prevIdx, playbackSource);
  }, [activeQueue, currentIndex, currentTime, playFromQueue, playbackSource]);

  // Seek
  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Repeat
  const toggleRepeat = useCallback(() => {
    playTactileClick();
    setRepeatMode((prev) => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  // Shuffle
  const toggleShuffle = useCallback(() => {
    playTactileClick();
    setIsShuffle((prev) => !prev);
  }, []);

  // Like toggle
  const toggleLike = useCallback((id: string) => {
    setAllTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isLiked: !t.isLiked } : t))
    );
    setActiveQueue((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isLiked: !t.isLiked } : t))
    );
  }, []);

  // Add to Queue (next up)
  const playNext = useCallback((id: string) => {
    playTactileClick();
    const trackToMove = allTracks.find((t) => t.id === id);
    if (!trackToMove) return;

    setActiveQueue((prev) => {
      const withoutTrack = prev.filter((t) => t.id !== id);
      const insertAt = Math.min(currentIndex + 1, withoutTrack.length);
      return [
        ...withoutTrack.slice(0, insertAt),
        trackToMove,
        ...withoutTrack.slice(insertAt),
      ];
    });
  }, [allTracks, currentIndex]);

  // Add Local Files with ID3 Metadata & Album Cover extraction!
  const addLocalFiles = useCallback(async (files: FileList | File[]) => {
    playTactileClick();
    const fileArray = Array.from(files);
    const newTracks: Track[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      let title = file.name.replace(/\.[^/.]+$/, '');
      let artist = 'Local Artist';
      let album = 'Memori Internal / Unduhan';

      if (title.includes(' - ')) {
        const parts = title.split(' - ');
        artist = parts[0].trim();
        title = parts.slice(1).join(' - ').trim();
      }

      let coverArtUrl = '';
      try {
        const meta = await parseAudioMetadata(file);
        if (meta.title) title = meta.title;
        if (meta.artist) artist = meta.artist;
        if (meta.album) album = meta.album;
        if (meta.coverArtUrl) coverArtUrl = meta.coverArtUrl;
      } catch (err) {
        console.warn('ID3 parse skipped:', err);
      }

      const fileUrl = URL.createObjectURL(file);
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
      const ext = file.name.split('.').pop()?.toUpperCase() || 'AUDIO';
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1) + ' MB';

      newTracks.push({
        id: `local-${Date.now()}-${i}-${Math.random()}`,
        title: title || file.name,
        artist: artist,
        album: album,
        dateAdded: dateStr,
        duration: 180,
        url: fileUrl,
        coverArt: coverArtUrl,
        isLocal: true,
        isLiked: false,
        format: `${ext} Offline`,
        bitrate: '320 kbps',
        fileSize: sizeMb,
        lyrics: [
          '♪ Memutar berkas audio lokal dari perangkat',
          `Berkas: ${file.name}`,
          `Artis: ${artist} • Album: ${album}`,
          `Format: ${ext} • Ukuran: ${sizeMb}`,
          'Audio diputar secara offline dengan equalizer studio aktif',
        ],
      });
    }

    if (newTracks.length > 0) {
      setAllTracks((prev) => [...prev, ...newTracks]);
    }
  }, []);

  // Remove track
  const removeTrack = useCallback((id: string) => {
    playTactileClick();
    setAllTracks((prev) => prev.filter((t) => t.id !== id));
    setActiveQueue((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx === -1) return prev;
      const updated = prev.filter((t) => t.id !== id);
      if (idx === currentIndex) {
        if (updated.length > 0) {
          const nextI = Math.min(idx, updated.length - 1);
          setCurrentIndex(nextI);
          if (audioRef.current) {
            audioRef.current.src = updated[nextI].url;
            if (isPlaying) audioRef.current.play();
          }
        } else {
          if (audioRef.current) audioRef.current.pause();
          setIsPlaying(false);
        }
      } else if (idx < currentIndex) {
        setCurrentIndex((c) => c - 1);
      }
      return updated;
    });
  }, [currentIndex, isPlaying]);

  // Audio element listeners
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onLoadedMetadata = () => {
      setDuration(el.duration || 0);
      setActiveQueue((prev) =>
        prev.map((t, idx) =>
          idx === currentIndex && (!t.duration || t.duration === 180)
            ? { ...t, duration: el.duration }
            : t
        )
      );
    };
    const onEnded = () => {
      if (repeatMode === 'one') {
        el.currentTime = 0;
        el.play();
      } else if (repeatMode === 'all') {
        nextTrack();
      } else {
        if (currentIndex < activeQueue.length - 1) {
          nextTrack();
        } else {
          setIsPlaying(false);
          el.currentTime = 0;
        }
      }
    };

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('loadedmetadata', onLoadedMetadata);
    el.addEventListener('ended', onEnded);

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('loadedmetadata', onLoadedMetadata);
      el.removeEventListener('ended', onEnded);
    };
  }, [currentIndex, nextTrack, activeQueue.length, repeatMode]);

  return {
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
    isReady,
    beatEnergy,
    audioFX,
    sleepTimer,
    audioRef,
    analyserRef,
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
  };
}
