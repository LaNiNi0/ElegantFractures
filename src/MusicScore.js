// '우아한 균열' V2: original shadowed string theme, 28 bars, 68 BPM (~99 s).
// Sparse and modal; not an arrangement or transcription of any reference song.
export const THEME_TITLE = '우아한 균열';
export const TEMPO = 68;
export const BEATS_PER_BAR = 4;
export const STEP = 60 / TEMPO / 2;
export const BARS = 28;

// D minor/phrygian, deliberately under-resolved in the central section.
export const ROOTS = [
 38,39,34,38, 38,39,34,33, 38,39,34,33,
 38,39,37,33, 38,39,37,38, 34,38,39,33, 38,34,39,38
];
// Notes are MIDI numbers; null is a deliberate held silence.
export const MELODY = [
 [null,null,null,null,62,null,null,null],
 [null,null,null,63,null,null,null,null],
 [null,null,58,null,null,null,60,null],
 [null,null,null,null,null,null,null,null],
 [62,null,null,65,null,63,null,null],
 [62,null,null,58,null,null,60,null],
 [62,null,65,null,null,69,null,null],
 [67,null,null,63,null,62,null,null],
 [65,null,null,63,null,62,null,null],
 [63,null,65,null,67,null,null,null],
 [69,null,null,65,null,63,null,null],
 [62,null,null,null,58,null,null,null],
 [62,null,63,null,65,null,64,null],
 [63,null,65,null,66,null,65,null],
 [61,null,63,null,67,null,65,null],
 [64,null,63,null,62,null,61,null],
 [62,null,65,null,63,null,62,null],
 [63,null,null,66,null,67,null,65],
 [61,null,62,null,65,null,63,null],
 [62,null,null,58,null,61,null,null],
 [62,null,null,65,null,63,null,null],
 [62,null,65,null,67,null,null,null],
 [63,null,65,null,62,null,60,null],
 [62,null,null,58,null,null,null,null],
 [62,null,null,63,null,null,null,null],
 [58,null,null,62,null,null,null,null],
 [63,null,62,null,null,null,null,null],
 [62,null,null,null,null,null,null,null],
];
export const sectionOf = bar =>
  bar < 4 ? 'prologue' :
  bar < 12 ? 'theme' :
  bar < 20 ? 'fracture' : 'return';
