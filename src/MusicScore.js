// Original instrumental score for '우아한 균열'.
// 32 bars x 4 beats at 76 BPM (about 1m 41s), seamlessly looping.
// Expressive modes are inspired by modern gugak aesthetics; no existing melody is copied.
export const THEME_TITLE = '우아한 균열';
export const TEMPO = 76;
export const BEATS_PER_BAR = 4;
export const STEP = 60 / TEMPO / 2;
export const BARS = 32;

// Chords written low to high as MIDI pitches, with roots in the low register.
// I. 서막 (1–4), II. 회상 (5–12), III. 균열 (13–20),
// IV. 잔향 (21–28), V. 여백 (29–32).
export const HARMONIES = [
 [38,50,53,57,64], [46,53,57,62], [43,50,53,57], [45,52,57,62],
 [38,50,53,57,64], [46,53,57,62], [41,48,52,57], [48,55,62,64],
 [38,50,53,57,64], [46,53,57,62], [43,50,53,57], [45,52,55,62],
 [43,50,53,57], [46,53,57,62], [45,52,55,58], [38,50,53,57,64],
 [46,53,57,62], [48,55,62,64], [43,50,53,57], [45,52,55,58],
 [38,50,53,57,64], [41,48,52,57], [46,53,57,62], [45,52,57,62],
 [43,50,53,57], [46,53,57,62], [38,50,53,57,64], [48,55,62,64],
 [46,53,57,62], [45,52,55,62], [38,50,53,57,64], [38,50,53,57,64],
];

// Original eight-eighth-note phrases. null = silence; the spaces matter.
export const MELODY = [
 [null,null,69,null,null,67,null,65],
 [null,null,65,null,69,null,null,null],
 [null,69,null,67,null,65,null,null],
 [62,null,65,null,null,null,null,null],
 [69,null,72,null,74,null,72,null],
 [69,null,null,67,65,null,62,null],
 [65,null,69,null,72,null,74,null],
 [72,null,69,null,67,null,null,null],
 [69,null,72,null,74,null,77,null],
 [76,null,74,null,72,null,69,null],
 [67,null,69,null,72,69,null,67],
 [65,null,64,null,62,null,null,null],
 [74,null,76,77,null,76,74,null],
 [72,70,null,69,67,null,65,null],
 [69,null,70,null,74,73,null,72],
 [69,null,67,65,null,64,62,null],
 [65,null,69,70,69,null,65,null],
 [69,null,72,74,73,72,70,null],
 [69,null,70,72,null,76,74,null],
 [72,null,70,69,null,65,62,null],
 [69,null,72,null,74,null,72,null],
 [69,null,null,65,67,null,69,null],
 [72,null,74,null,77,null,74,null],
 [72,null,69,null,67,null,65,null],
 [67,null,69,null,72,null,69,null],
 [65,null,69,null,72,null,74,null],
 [72,null,69,null,65,null,64,null],
 [62,null,65,null,69,null,null,null],
 [65,null,null,67,null,69,null,null],
 [72,null,69,null,65,null,62,null],
 [69,null,null,65,null,62,null,null],
 [62,null,null,null,null,null,null,null],
];

export const sectionOf = bar =>
  bar < 4 ? 'opening' :
  bar < 12 ? 'memory' :
  bar < 20 ? 'fracture' :
  bar < 28 ? 'return' : 'ending';
