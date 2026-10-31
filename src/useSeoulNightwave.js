import { useCallback, useEffect, useRef, useState } from 'react';

// Add the downloaded, licensed MP3 to public/audio/u_98673jp944-seoul-nightwave-448478.mp3.
export const NIGHTWAVE_SOURCE = 'https://pixabay.com/music/electro-seoul-nightwave-448478/';
const NIGHTWAVE_AUDIO = import.meta.env.BASE_URL + 'audio/u_98673jp944-seoul-nightwave-448478.mp3';

export function useSeoulNightwave() {
  const audioRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [isMissing, setIsMissing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicError, setMusicError] = useState('');

  useEffect(() => {
    const audio = new Audio(NIGHTWAVE_AUDIO);
    audio.preload = 'none';
    audio.loop = true;
    audio.volume = 0.25;
    audioRef.current = audio;
    const controller = new AbortController();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsPlaying(false);
      setMusicError('음원을 불러올 수 없습니다.');
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);

    // Guard against 404s and GitHub Pages HTML fallbacks.
    fetch(NIGHTWAVE_AUDIO, { method: 'HEAD', signal: controller.signal })
      .then(response => {
        const type = response.headers.get('content-type') || '';
        if (!response.ok || !type.toLowerCase().startsWith('audio/')) {
          setIsMissing(true);
          return;
        }
        setIsReady(true);
      })
      .catch(() => {
        if (!controller.signal.aborted) setIsMissing(true);
      });

    return () => {
      controller.abort();
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.removeAttribute('src');
      audio.load();
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, []);

  const toggleMusic = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !isReady) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    try {
      setMusicError('');
      // Start only when the visitor taps the button (mobile autoplay policy).
      await audio.play();
    } catch {
      setMusicError('음악 재생이 차단되었습니다. 다시 눌러 주세요.');
      setIsPlaying(false);
    }
  }, [isReady]);

  return { isPlaying, isReady, isMissing, musicError, toggleMusic };
}
