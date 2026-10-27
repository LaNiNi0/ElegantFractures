// Generate a static, mobile-friendly PCM WAV for the in-world soundtrack.
// Run automatically before Vite build so iPhone uses native <audio> playback
// rather than Web Audio's separate iOS ringer/silent audio channel.
import { mkdirSync, writeFileSync } from 'node:fs';
import { STEP, BARS, ROOTS, MELODY, sectionOf } from '../src/MusicScore.js';

const SR = 24000;
const durationSeconds = BARS * 8 * STEP + 3.15;
const samples = Math.ceil(durationSeconds * SR);
const mix = new Float32Array(samples);
const hz = midi => 440 * Math.pow(2, (midi - 69) / 12);
const clamp = (x, min, max) => Math.max(min, Math.min(max, x));
const cachedStrings = new Map();

function stringSample(midi, bass = false) {
  const key = midi + (bass ? '_bass' : '_lead');
  if (cachedStrings.has(key)) return cachedStrings.get(key);
  // Deterministic, softly damped feedback-string synthesis; no piano sample.
  const seconds = bass ? 3.3 : 2.5;
  const n = Math.round(seconds * SR);
  const delay = Math.max(7, Math.round(SR / hz(midi)));
  const ring = new Float32Array(delay);
  let seed = (Math.imul(midi + 25, 1103515245) + (bass ? 307 : 509)) >>> 0;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 2147483648 - 1;
  };
  let lowpass = 0;
  for (let i = 0; i < delay; i++) {
    lowpass = lowpass * (bass ? .70 : .60) + random() * (bass ? .30 : .40);
    ring[i] = lowpass;
  }
  const wave = new Float32Array(n);
  const damping = bass ? .9967 : .9950;
  const f = hz(midi);
  for (let i = 0; i < n; i++) {
    const p = i % delay;
    const v = ring[p];
    ring[p] = damping * (.51 * v + .49 * ring[(p + 1) % delay]);
    const t = i / SR;
    const attack = Math.min(1, t / (bass ? .006 : .003));
    const tail = Math.min(1, (seconds - t) / .11);
    const finger = Math.exp(-t * 26) * random() * (bass ? .038 : .026);
    const bridge = Math.sin(2 * Math.PI * f * 3.73 * t) * Math.exp(-t * 28) * .022;
    wave[i] = Math.tanh((v * 2.2 + finger + bridge) * 1.3)
      * Math.exp(-t * (bass ? .28 : .48)) * attack * Math.max(0, tail);
  }
  cachedStrings.set(key, wave);
  return wave;
}

function addPluck(midi, time, volume = 1, bass = false) {
  const wave = stringSample(midi, bass);
  const start = Math.round(time * SR);
  for (let i = 0; i < wave.length && i + start < samples; i++) {
    if (i + start >= 0) mix[i + start] += wave[i] * volume * (bass ? .24 : .19);
  }
}

function addAir(midi, time, seconds, volume) {
  const start = Math.round(time * SR);
  const count = Math.min(Math.round(seconds * SR), samples - start);
  const f = hz(midi);
  for (let i = 0; i < count; i++) {
    const t = i / SR;
    const a = clamp(t / .75, 0, 1);
    const r = clamp((seconds - t) / 1.3, 0, 1);
    const slowBreath = 0.91 + .09 * Math.sin(2 * Math.PI * .18 * t);
    const carrier = Math.sin(2 * Math.PI * f * t);
    const reed = Math.sin(2 * Math.PI * f * 1.003 * t) * .11;
    mix[start + i] += (carrier + reed) * a * r * slowBreath * volume * .025;
  }
}

for (let bar = 0; bar < BARS; bar++) {
  const t = bar * 8 * STEP;
  const root = ROOTS[bar];
  const section = sectionOf(bar);
  // Start audibly; avoid the faint opening silence being mistaken for failure.
  addPluck(root, t, section === 'prologue' ? .50 : .74, true);
  if (bar >= 4 && bar <= 23 && bar % 3 !== 1) {
    addPluck(root + 7, t + STEP * 4.7, .28, true);
  }
  if (section === 'fracture') {
    addPluck(root + 12, t + STEP * 2.5, .15, true);
  }
  if (bar % 2 === 0) addAir(root + 12, t, STEP * 15.6, .75);
  if (bar >= 5 && bar < 24 && bar % 4 === 2) {
    addAir(root + 19, t + STEP * 3, STEP * 8, .22);
  }
  MELODY[bar].forEach((midi, i) => {
    if (midi == null) return;
    const when = t + i * STEP + (i > 0 ? .022 : 0);
    if (section === 'fracture' && (bar + i) % 4 === 0) {
      addPluck(midi - 1, when, .12);
    }
    const volume = section === 'prologue' ? .48 : section === 'theme' ? .73 : .64;
    addPluck(midi, when, volume);
  });
  if (bar >= 6 && bar <= 24 && bar % 4 === 2) addPluck(root + 24, t + STEP * 6, .19);
}

// Small diffuse room reflections; not a big cinematic piano hall.
for (const [delaySec, volume] of [[.14,.085],[.27,.065],[.42,.045]]) {
  const delay = Math.round(delaySec * SR);
  for (let i = samples - 1; i >= delay; i--) {
    mix[i] += mix[i - delay] * volume;
  }
}

// Gentle high-frequency smoothing and safe output normalization.
let lp = 0;
let maxPeak = .00001;
for (let i = 0; i < samples; i++) {
  lp = lp * .28 + mix[i] * .72;
  mix[i] = Math.tanh(lp * 1.22);
  maxPeak = Math.max(maxPeak, Math.abs(mix[i]));
}
const gain = .88 / maxPeak;
const wav = Buffer.allocUnsafe(44 + samples * 2);
wav.write('RIFF', 0, 4, 'ascii');
wav.writeUInt32LE(36 + samples * 2, 4);
wav.write('WAVE', 8, 4, 'ascii');
wav.write('fmt ', 12, 4, 'ascii');
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(SR, 24);
wav.writeUInt32LE(SR * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36, 4, 'ascii');
wav.writeUInt32LE(samples * 2, 40);
for (let i = 0; i < samples; i++) {
  wav.writeInt16LE(Math.round(clamp(mix[i] * gain, -.999, .999) * 32767), 44 + 2 * i);
}
mkdirSync('public/audio', { recursive: true });
const output = 'public/audio/elegant-fractures-theme.wav';
writeFileSync(output, wav);
console.log('Wrote '+output+' ('+(wav.length/1024/1024).toFixed(2)+' MiB, '+durationSeconds.toFixed(1)+'s)');
