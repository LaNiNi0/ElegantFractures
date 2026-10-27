import { useCallback, useEffect, useRef, useState } from 'react';

// Unlike Web Audio, an HTML media element uses the iOS media playback route,
// including when the phone is set to silent. Sound is a build-generated,
// original instrumental WAV, so desktop and mobile hear the same arrangement.
const AUDIO_URL = import.meta.env.BASE_URL + 'audio/elegant-fractures-theme.wav';

export function useAmbientMusic() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [musicError, setMusicError] = useState('');

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return audioRef.current;
    const audio = new Audio(AUDIO_URL);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.92;
    audio.playsInline = true;
    audio.onplaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
      setMusicError('');
    };
    audio.onpause = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
    audio.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
      setMusicError('음원을 불러오지 못했어요. 페이지를 새로고침한 뒤 다시 눌러주세요.');
    };
    audio.onwaiting = () => setIsLoading(true);
    audio.oncanplay = () => setIsLoading(false);
    audioRef.current = audio;

    // Browser/system Now Playing controls, where supported.
    if ('mediaSession' in navigator && typeof window.MediaMetadata === 'function') {
      try {
        navigator.mediaSession.metadata = new window.MediaMetadata({
          title: '우아한 균열',
          artist: ' ',
          album: '우아한 균열'
        });
        navigator.mediaSession.setActionHandler('play', () => {
          const attempt = audio.play();
          if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
        });
        navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      } catch (_) {
        // Unsupported media-session actions must not prevent playback.
      }
    }
    return audio;
  }, []);

  const toggleMusic = useCallback(() => {
    const audio = ensureAudio();
    if (!audio.paused) {
      audio.pause();
      return;
    }
    setMusicError('');
    setIsLoading(true);
    try {
      // play() must be invoked synchronously from the user's click on iOS.
      // Do not await setup/decoding or AudioContext.resume() before this call.
      const attempt = audio.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(err => {
          setIsPlaying(false);
          setIsLoading(false);
          setMusicError(
            err?.name === 'NotAllowedError'
              ? '재생이 제한됐어요. 잠금화면에서 재생 버튼을 다시 눌러주세요.'
              : '음악을 재생하지 못했어요. 페이지를 새로고침한 뒤 다시 시도해 주세요.'
          );
        });
      }
    } catch (_) {
      setIsLoading(false);
      setIsPlaying(false);
      setMusicError('음악을 재생하지 못했어요. 다시 시도해 주세요.');
    }
  }, [ensureAudio]);

  useEffect(() => () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.onplaying = null;
    audio.onpause = null;
    audio.onerror = null;
    audio.onwaiting = null;
    audio.oncanplay = null;
    audio.removeAttribute('src');
    audio.load();
    audioRef.current = null;
  }, []);

  return { isPlaying, isLoading, toggleMusic, musicError };
}
