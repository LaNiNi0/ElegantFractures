import { useCallback, useEffect, useRef, useState } from 'react';

// Short, original instrumental sketch for the story's lock screen.
// No downloaded/copyrighted music is embedded. A mastered MP3 can replace
// this Web Audio demo later without changing the phone's player interface.
const TEMPO = 76;
const STEP = 60 / TEMPO / 2;
const MELODY = [
  [62, null, 65, null, 69, 67, null, 64],
  [62, null, 65, 67, 69, null, 65, null],
  [69, null, 67, null, 64, null, 72, null],
  [67, null, 64, 62, null, 64, 60, null],
  [62, null, 65, 69, null, 72, null, 69],
  [70, null, 69, 65, null, 62, null, 65],
  [69, null, 72, 74, null, 72, 69, null],
  [67, 65, null, 64, 62, null, null, null],
];
const HARMONIES = [
  [50, 57, 62, 65], // Dm
  [46, 53, 58, 62], // Bbmaj7
  [53, 60, 65, 69], // Fmaj7
  [48, 55, 60, 64], // C
  [50, 57, 62, 65],
  [46, 53, 58, 62],
  [53, 60, 65, 69],
  [48, 55, 60, 64],
];
const frequency = midi => 440 * Math.pow(2, (midi - 69) / 12);

function tone(ctx, destination, midi, time, length, peak, shape, attack) {
  const oscillator = ctx.createOscillator();
  const amplitude = ctx.createGain();
  oscillator.type = shape;
  oscillator.frequency.setValueAtTime(frequency(midi), time);
  amplitude.gain.setValueAtTime(0.0001, time);
  amplitude.gain.linearRampToValueAtTime(peak, time + attack);
  amplitude.gain.exponentialRampToValueAtTime(0.0001, time + length);
  oscillator.connect(amplitude);
  amplitude.connect(destination);
  oscillator.start(time);
  oscillator.stop(time + length + 0.03);
  oscillator.onended = () => {
    try { oscillator.disconnect(); amplitude.disconnect(); } catch (_) {}
  };
}

// Sparse, synthetic plucked-string texture inspired by gayageum articulations.
// This is a synthesized timbre, not a recording or sample of a real instrument.
function pluckedString(ctx, destination, midi, time) {
  const fundamental = ctx.createOscillator();
  const overtone = ctx.createOscillator();
  const overtoneGain = ctx.createGain();
  const amplitude = ctx.createGain();
  const warmth = ctx.createBiquadFilter();
  const length = STEP * 2.7;
  const freq = frequency(midi);
  fundamental.type = 'triangle';
  fundamental.frequency.setValueAtTime(freq, time);
  overtone.type = 'sine';
  overtone.frequency.setValueAtTime(freq * 2.003, time);
  overtoneGain.gain.value = 0.19;
  warmth.type = 'lowpass';
  warmth.frequency.setValueAtTime(2200, time);
  warmth.frequency.exponentialRampToValueAtTime(650, time + length);
  amplitude.gain.setValueAtTime(0.0001, time);
  amplitude.gain.linearRampToValueAtTime(0.033, time + 0.006);
  amplitude.gain.exponentialRampToValueAtTime(0.0001, time + length);
  fundamental.connect(warmth);
  overtone.connect(overtoneGain);
  overtoneGain.connect(warmth);
  warmth.connect(amplitude);
  amplitude.connect(destination);
  fundamental.start(time);
  overtone.start(time);
  fundamental.stop(time + length + 0.04);
  overtone.stop(time + length + 0.04);
  fundamental.onended = () => {
    [fundamental, overtone, overtoneGain, warmth, amplitude].forEach(node => {
      try { node.disconnect(); } catch (_) {}
    });
  };
}

function scheduleNote(engine, index, time) {
  const { ctx, output } = engine;
  const bar = Math.floor(index / 8) % HARMONIES.length;
  const position = index % 8;
  if (position === 0) {
    for (const midi of HARMONIES[bar]) {
      tone(ctx, output, midi, time, STEP * 7.85, 0.028, 'sine', 0.34);
    }
    tone(ctx, output, HARMONIES[bar][0] - 12, time, STEP * 6.2, 0.024, 'sine', 0.24);
  }
  // Only a couple of very soft plucks each bar: traditional color, not a folk lead.
  if (position === 2 || position === 6) {
    const voice = position === 2 ? 2 : 1;
    pluckedString(ctx, output, HARMONIES[bar][voice] + 12, time);
  }
  const melodyNote = MELODY[bar][position];
  if (melodyNote !== null) {
    tone(ctx, output, melodyNote, time, STEP * 2.6, 0.07, 'triangle', 0.012);
    tone(ctx, output, melodyNote + 12, time + 0.01, STEP * 1.4, 0.012, 'sine', 0.013);
  }
}

// Web Audio starts only from a user interaction (browser autoplay policy).
export function useAmbientMusic() {
  const engineRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicError, setMusicError] = useState('');

  const pause = useCallback(() => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.timer !== null) {
      clearInterval(engine.timer);
      engine.timer = null;
    }
    engine.ctx.suspend().catch(() => {});
    setIsPlaying(false);
  }, []);

  const play = useCallback(async () => {
    try {
      let engine = engineRef.current;
      if (!engine) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          setMusicError('이 브라우저는 오디오 재생을 지원하지 않습니다.');
          return;
        }
        const ctx = new AudioContextClass();
        const output = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2700;
        output.gain.value = 0.24; // restrained quiet background volume
        output.connect(filter);
        filter.connect(ctx.destination);
        engine = { ctx, output, timer: null, index: 0, nextAt: 0 };
        engineRef.current = engine;
      }
      await engine.ctx.resume();
      if (engineRef.current !== engine || engine.timer !== null) return;
      if (engine.nextAt < engine.ctx.currentTime) {
        engine.nextAt = engine.ctx.currentTime + 0.08;
      }
      const schedule = () => {
        while (engine.nextAt < engine.ctx.currentTime + 0.4) {
          scheduleNote(engine, engine.index % 64, engine.nextAt);
          engine.index += 1;
          engine.nextAt += STEP;
        }
      };
      schedule();
      engine.timer = setInterval(schedule, 100);
      setMusicError('');
      setIsPlaying(true);
    } catch (_) {
      setMusicError('음악을 시작하지 못했습니다. 브라우저의 소리 설정을 확인해 주세요.');
      setIsPlaying(false);
    }
  }, []);

  const toggleMusic = useCallback(() => {
    if (isPlaying) pause();
    else void play();
  }, [isPlaying, pause, play]);

  useEffect(() => () => {
    const engine = engineRef.current;
    if (!engine) return;
    if (engine.timer !== null) clearInterval(engine.timer);
    engine.ctx.close().catch(() => {});
    engineRef.current = null;
  }, []);

  return { isPlaying, toggleMusic, musicError };
}
