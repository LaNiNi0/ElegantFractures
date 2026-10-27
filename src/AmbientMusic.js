import { useCallback, useEffect, useRef, useState } from 'react';
import { TEMPO, STEP, BARS, HARMONIES, MELODY, sectionOf } from './MusicScore.js';

// 우아한 균열 — original ~101s five-part main-theme arrangement.
// A small Web Audio ensemble inspired by the articulations of gayageum,
// geomungo and saenghwang. These are original synthesized sounds, not
// recordings of traditional instruments or an imitation of a reference melody.
// A licensed live-instrument master can replace the synthesis later.

const midiHz = midi => 440 * Math.pow(2, (midi - 69) / 12);
const tiny = 0.0001;

function envelope(gain, when, peak, attack, end) {
  gain.gain.setValueAtTime(tiny, when);
  gain.gain.linearRampToValueAtTime(Math.max(tiny, peak), when + attack);
  gain.gain.exponentialRampToValueAtTime(tiny, Math.max(when + attack + 0.03, end));
}

function releaseNodes(nodes, oscillator, stopAt) {
  oscillator.onended = () => {
    for (const node of nodes) {
      try { node.disconnect(); } catch (_) {}
    }
  };
  oscillator.stop(stopAt);
}

function stringPluck(engine, midi, when, volume = 1, duration = STEP * 2.45) {
  const { ctx, plucks, noise } = engine;
  const hz = midiHz(midi);
  const carrier = ctx.createOscillator();
  const harmonic = ctx.createOscillator();
  const harmonicGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  carrier.type = 'triangle';
  carrier.frequency.setValueAtTime(hz * 1.012, when);
  carrier.frequency.exponentialRampToValueAtTime(hz, when + 0.115);
  harmonic.type = 'sine';
  harmonic.frequency.setValueAtTime(hz * 2.006, when);
  harmonicGain.gain.value = 0.22;
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3550, when);
  filter.frequency.exponentialRampToValueAtTime(880, when + duration);
  envelope(amp, when, 0.085 * volume, 0.006, when + duration);
  carrier.connect(filter);
  harmonic.connect(harmonicGain);
  harmonicGain.connect(filter);
  filter.connect(amp);
  amp.connect(plucks);

  const finger = ctx.createBufferSource();
  const fingerAmp = ctx.createGain();
  finger.buffer = noise;
  fingerAmp.gain.setValueAtTime(0.018 * volume, when);
  fingerAmp.gain.exponentialRampToValueAtTime(tiny, when + 0.055);
  finger.connect(fingerAmp);
  fingerAmp.connect(plucks);
  finger.start(when);
  finger.stop(when + 0.060);

  carrier.start(when);
  harmonic.start(when);
  releaseNodes([carrier, harmonic, harmonicGain, filter, amp, finger, fingerAmp], carrier, when + duration + 0.04);
  harmonic.stop(when + duration + 0.04);
}

function geomungo(engine, midi, when, volume = 1) {
  const { ctx, bass } = engine;
  const hz = midiHz(midi);
  const low = ctx.createOscillator();
  const strike = ctx.createOscillator();
  const strikeLevel = ctx.createGain();
  const tone = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  low.type = 'triangle';
  low.frequency.setValueAtTime(hz * 1.008, when);
  low.frequency.exponentialRampToValueAtTime(hz, when + .09);
  strike.type = 'sawtooth';
  strike.frequency.value = hz;
  strikeLevel.gain.value = .16;
  tone.type = 'lowpass';
  tone.frequency.setValueAtTime(1600, when);
  tone.frequency.exponentialRampToValueAtTime(350, when + 1.5);
  envelope(amp, when, .105 * volume, .009, when + 1.8);
  low.connect(tone);
  strike.connect(strikeLevel);
  strikeLevel.connect(tone);
  tone.connect(amp);
  amp.connect(bass);
  low.start(when);
  strike.start(when);
  releaseNodes([low, strike, strikeLevel, tone, amp], low, when + 1.84);
  strike.stop(when + 1.84);
}

function saenghwangBreath(engine, midi, when, volume = 1, length = STEP * 7.7) {
  const { ctx, air } = engine;
  const freq = midiHz(midi);
  const reed = ctx.createOscillator();
  const breath = ctx.createOscillator();
  const breathLevel = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const amp = ctx.createGain();
  reed.type = 'sine';
  reed.frequency.value = freq;
  breath.type = 'triangle';
  breath.frequency.value = freq * 1.003;
  breathLevel.gain.value = .19;
  filter.type = 'lowpass';
  filter.frequency.value = 1700;
  envelope(amp, when, .024 * volume, .52, when + length);
  reed.connect(filter);
  breath.connect(breathLevel);
  breathLevel.connect(filter);
  filter.connect(amp);
  amp.connect(air);
  reed.start(when);
  breath.start(when);
  releaseNodes([reed, breath, breathLevel, filter, amp], reed, when + length + .05);
  breath.stop(when + length + .05);
}

function distantPiano(engine, midi, when, volume = 1) {
  const { ctx, plucks } = engine;
  const freq = midiHz(midi);
  const fundamental = ctx.createOscillator();
  const overtone = ctx.createOscillator();
  const overtoneGain = ctx.createGain();
  const amp = ctx.createGain();
  fundamental.type = 'sine';
  fundamental.frequency.value = freq;
  overtone.type = 'triangle';
  overtone.frequency.value = freq * 2;
  overtoneGain.gain.value = .17;
  envelope(amp, when, .039 * volume, .012, when + STEP * 4.3);
  fundamental.connect(amp);
  overtone.connect(overtoneGain);
  overtoneGain.connect(amp);
  amp.connect(plucks);
  fundamental.start(when);
  overtone.start(when);
  releaseNodes([fundamental, overtone, overtoneGain, amp], fundamental, when + STEP * 4.35);
  overtone.stop(when + STEP * 4.35);
}

function scheduleBar(engine, bar, when) {
  const chord = HARMONIES[bar];
  const phrase = MELODY[bar];
  const section = sectionOf(bar);
  const endFade = bar >= 29 ? Math.max(.35, (32 - bar) / 3.7) : 1;
  const tension = section === 'fracture';
  const intimate = section === 'opening' || section === 'ending';
  const baseVolume = (intimate ? .65 : .95) * endFade;

  // Low struck string, less regular in the opening and coda.
  if (bar !== 0 && bar < 31) geomungo(engine, chord[0], when, baseVolume * (tension ? 1.17 : .87));
  if (tension && bar % 2 === 0) geomungo(engine, chord[0] + 12, when + STEP * 4, .33);

  // The airy organ-like layer makes the old instruments feel contemporary.
  const upper = chord.slice(-2);
  upper.forEach((note, i) => saenghwangBreath(engine, note, when + .03 + i * .09, baseVolume * (tension ? .88 : 1) * (i ? .80 : 1)));

  phrase.forEach((note, beat) => {
    if (note === null) return;
    const offset = beat * STEP;
    // Subtle unresolved touch in the middle, never lifted from any reference track.
    if (tension && (bar + beat) % 7 === 0) {
      stringPluck(engine, note + 1, when + offset, .18, STEP * .47);
    }
    stringPluck(engine, note, when + offset + (beat % 4 === 0 ? 0 : .012), baseVolume * (tension ? .92 : 1), STEP * (beat % 4 === 0 ? 2.9 : 2.2));
  });

  // Sparse piano 'light': more of a reflection than another foreground melody.
  if (bar >= 4 && bar < 29 && bar % 2 === 1) {
    distantPiano(engine, chord.at(-1) + 12, when + STEP * 3.8, .45 * endFade);
  }
  if (section === 'return' && bar % 4 === 0) {
    stringPluck(engine, chord[2] + 12, when + STEP * 5.9, .37, STEP * 3.6);
  }
}

function makeReverb(ctx) {
  const seconds = 1.45;
  const samples = Math.round(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, samples, ctx.sampleRate);
  let seed = 88112;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296 * 2 - 1;
  };
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < samples; i++) {
      const decay = Math.pow(1 - i / samples, 3.7);
      data[i] = random() * decay * .34;
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = buffer;
  return convolver;
}

function setupAudio(AudioContextClass) {
  const ctx = new AudioContextClass();
  const master = ctx.createGain();
  master.gain.value = .42;
  const dry = ctx.createGain();
  dry.gain.value = .87;
  const wet = ctx.createGain();
  wet.gain.value = .20;
  const reverb = makeReverb(ctx);
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -22;
  comp.ratio.value = 2.1;
  comp.attack.value = .012;
  comp.release.value = .22;
  const eq = ctx.createBiquadFilter();
  eq.type = 'lowpass';
  eq.frequency.value = 6300;
  const mix = ctx.createGain();
  mix.connect(dry);
  mix.connect(reverb);
  reverb.connect(wet);
  dry.connect(eq);
  wet.connect(eq);
  eq.connect(comp);
  comp.connect(master);
  master.connect(ctx.destination);
  const plucks = ctx.createGain();
  const bass = ctx.createGain();
  const air = ctx.createGain();
  plucks.gain.value = 1;
  bass.gain.value = .67;
  air.gain.value = 1;
  plucks.connect(mix);
  bass.connect(mix);
  air.connect(mix);
  const noise = ctx.createBuffer(1, Math.round(.08 * ctx.sampleRate), ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return { ctx, plucks, bass, air, noise, timer: null, nextAt: 0, bar: 0 };
}

// User gesture required. Music survives navigating the in-story phone apps.
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
        engine = setupAudio(AudioContextClass);
        engineRef.current = engine;
      }
      await engine.ctx.resume();
      if (engineRef.current !== engine || engine.timer !== null) return;
      if (engine.nextAt < engine.ctx.currentTime) engine.nextAt = engine.ctx.currentTime + .06;
      const scheduler = () => {
        while (engine.nextAt < engine.ctx.currentTime + .62) {
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
