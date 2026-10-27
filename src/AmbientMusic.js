import { useCallback, useEffect, useRef, useState } from 'react';
import { STEP, BARS, ROOTS, MELODY, sectionOf } from './MusicScore.js';

// '우아한 균열' V2 — darker 28-bar original theme.
// This is synthesized string timbre inspired by plucked Korean string techniques,
// NOT real gayageum/geomungo recordings. No piano instrument or piano patch.
// The reference songs are mood references, not melodies sampled or copied.

const freq = midi => 440 * Math.pow(2, (midi - 69) / 12);

function makePluckBuffer(engine, midi, kind) {
  const key = kind + ':' + midi;
  if (engine.buffers.has(key)) return engine.buffers.get(key);
  const { ctx } = engine;
  const sr = ctx.sampleRate;
  const isBass = kind === 'bass';
  const seconds = isBass ? 3.45 : 2.7;
  const n = Math.ceil(seconds * sr);
  const delay = Math.max(8, Math.round(sr / freq(midi)));
  const ring = new Float32Array(delay);
  let seed = (Math.imul(midi + 23, 1103515245) + (isBass ? 307 : 509)) >>> 0;
  const noise = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2147483648 - 1;
  };
  let low = 0;
  for (let i = 0; i < delay; i++) {
    low = low * (isBass ? .70 : .63) + noise() * (isBass ? .30 : .37);
    ring[i] = low;
  }
  const buffer = ctx.createBuffer(1, n, sr);
  const data = buffer.getChannelData(0);
  const decay = isBass ? .9967 : .9952;
  for (let i = 0; i < n; i++) {
    const p = i % delay;
    const value = ring[p];
    ring[p] = decay * (.51 * value + .49 * ring[(p + 1) % delay]);
    const t = i / sr;
    const attack = Math.min(1, t / (isBass ? .006 : .003));
    const release = Math.min(1, (seconds - t) / .09);
    const touch = Math.exp(-t * 27) * noise() * (isBass ? .036 : .025);
    const bridge = Math.sin(2 * Math.PI * freq(midi) * 3.73 * t) * Math.exp(-t * 27) * .025;
    const bloom = Math.exp(-t * (isBass ? .28 : .47));
    data[i] = Math.tanh((value * 2.15 + touch + bridge) * 1.32) * bloom * attack * Math.max(0, release);
  }
  engine.buffers.set(key, buffer);
  return buffer;
}

function pluck(engine, midi, when, volume = 1, kind = 'lead') {
  const { ctx } = engine;
  const src = ctx.createBufferSource();
  const amp = ctx.createGain();
  const tone = ctx.createBiquadFilter();
  src.buffer = makePluckBuffer(engine, midi, kind === 'bass' ? 'bass' : 'lead');
  tone.type = 'lowpass';
  tone.frequency.value = kind === 'bass' ? 1200 : 2800;
  amp.gain.value = volume * (kind === 'bass' ? .16 : .145);
  src.connect(tone);
  tone.connect(amp);
  amp.connect(kind === 'bass' ? engine.low : engine.strings);
  src.start(when);
  src.onended = () => {
    try { src.disconnect(); tone.disconnect(); amp.disconnect(); } catch (_) {}
  };
}

function airTone(engine, midi, when, duration, volume) {
  const { ctx } = engine;
  const fundamental = ctx.createOscillator();
  const overtone = ctx.createOscillator();
  const overtoneGain = ctx.createGain();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  fundamental.type = 'sine';
  fundamental.frequency.setValueAtTime(freq(midi), when);
  overtone.type = 'triangle';
  overtone.frequency.setValueAtTime(freq(midi) * 1.003, when);
  overtoneGain.gain.value = .11;
  filter.type = 'lowpass';
  filter.frequency.value = 590;
  gain.gain.setValueAtTime(.0001, when);
  gain.gain.linearRampToValueAtTime(Math.max(.0002, volume * .02), when + .9);
  gain.gain.exponentialRampToValueAtTime(.0001, when + duration);
  fundamental.connect(filter);
  overtone.connect(overtoneGain);
  overtoneGain.connect(filter);
  filter.connect(gain);
  gain.connect(engine.air);
  fundamental.start(when);
  overtone.start(when);
  fundamental.stop(when + duration + .05);
  overtone.stop(when + duration + .05);
  fundamental.onended = () => {
    try {
      [fundamental, overtone, overtoneGain, filter, gain].forEach(n => n.disconnect());
    } catch (_) {}
  };
}

function scheduleBar(engine, bar, at) {
  const root = ROOTS[bar];
  const section = sectionOf(bar);
  // Predominantly dry low strings, with asymmetric pulses.
  if (bar > 0) pluck(engine, root, at, section === 'prologue' ? .52 : .72, 'bass');
  if (bar >= 4 && bar <= 23 && bar % 3 !== 1) {
    pluck(engine, root + 7, at + STEP * 4.7, .28, 'bass');
  }
  if (section === 'fracture') {
    pluck(engine, root + 12, at + STEP * 2.5, .15, 'bass');
  }
  if (bar % 2 === 0) {
    airTone(engine, root + 12, at, STEP * 15.6, .75);
  }
  if (bar >= 5 && bar < 24 && bar % 4 === 2) {
    airTone(engine, root + 19, at + STEP * 3, STEP * 8, .22);
  }
  MELODY[bar].forEach((midi, i) => {
    if (midi === null) return;
    const when = at + i * STEP + (i > 0 ? .013 : 0);
    if (section === 'fracture' && (bar + i) % 4 === 0) {
      pluck(engine, midi - 1, when, .12);
    }
    const level = section === 'prologue' ? .48 : section === 'theme' ? .73 : .64;
    pluck(engine, midi, when + (i % 4 ? .009 : 0), level);
  });
  if (bar >= 6 && bar <= 24 && bar % 4 === 2) {
    pluck(engine, root + 24, at + STEP * 6, .19);
  }
}

function createEngine(AudioContextClass) {
  const ctx = new AudioContextClass();
  const master = ctx.createGain();
  master.gain.value = .65;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -20;
  compressor.ratio.value = 2;
  const dark = ctx.createBiquadFilter();
  dark.type = 'lowpass';
  dark.frequency.value = 3400;
  const strings = ctx.createGain();
  const low = ctx.createGain();
  const air = ctx.createGain();
  strings.gain.value = 1.0;
  low.gain.value = .68;
  air.gain.value = .61;
  strings.connect(dark);
  low.connect(dark);
  air.connect(dark);
  dark.connect(compressor);
  compressor.connect(master);
  master.connect(ctx.destination);
  return { ctx, master, strings, low, air, buffers: new Map(), timer: null, nextAt: 0, bar: 0 };
}

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
          setMusicError('브라우저에서 오디오 재생을 지원하지 않습니다.');
          return;
        }
        engine = createEngine(AudioContextClass);
        engineRef.current = engine;
      }
      await engine.ctx.resume();
      if (engineRef.current !== engine || engine.timer !== null) return;
      if (engine.nextAt < engine.ctx.currentTime) engine.nextAt = engine.ctx.currentTime + .075;
      const scheduler = () => {
        while (engine.nextAt < engine.ctx.currentTime + .55) {
          scheduleBar(engine, engine.bar, engine.nextAt);
          engine.bar = (engine.bar + 1) % BARS;
          engine.nextAt += STEP * 8;
        }
      };
      scheduler();
      engine.timer = setInterval(scheduler, 110);
      setMusicError('');
      setIsPlaying(true);
    } catch (_) {
      setMusicError('음악을 재생하지 못했습니다. 브라우저 오디오 설정을 확인해 주세요.');
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
