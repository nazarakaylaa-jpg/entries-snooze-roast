// Snooze Button Roast
// https://make.fun/c/u-carbon-forge-snooze-button-roast-14cbafc6
//
// Task: write ONE line roasting an alarm clock that rings at 6 AM on a
// Saturday, 1-200 characters, single line, to <MAKEFUN_OUTPUT_DIR>/entry.txt.
// The house judge compares entries pairwise and keeps the funnier one,
// weighing (most important first):
//   1. it roasts an alarm clock ringing at 6 AM on a Saturday, one line;
//   2. a real laugh: unexpected turn, punchline in the last few words;
//   3. a fresh angle, not the tired "I hate mornings" complaint;
//   4. tight: every word earns its place, sayable in one breath;
//   5. sharp, specific voice with concrete images.
//
// The winning line treats the alarm as an overeager employee who never
// checked the calendar: it turned up for a shift that does not exist, so
// the roast congratulates it on being the only thing in the house with a
// job today. The punchline lands in the last few words, exactly where the
// judge wants it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// One candidate line, scored 0-5 against each of the judge's five
// criteria above (index 0 = criterion 1, ..., index 4 = criterion 5).
// Scores are the author's honest read of the brief, not a model call:
// the final entry is picked by weighted total, criterion 1 first.
type Candidate = {
  text: string;
  // [on-brief, laugh, fresh-angle, tight, specific-voice]
  scores: [number, number, number, number, number];
};

const CANDIDATES: Candidate[] = [
  {
    text: "My alarm rang at 6 AM on a Saturday with the confidence of a man who has never checked a calendar — congratulations, you're the only thing in this house with a job today.",
    // On-brief (alarm, 6 AM, Saturday, one line): full marks. Laugh: the
    // "never checked a calendar" turn is unexpected and the punchline
    // ("job today") pays off at the very end. Fresh: an employee who
    // showed up for a non-existent shift, not a mornings complaint.
    // Tight: 170 chars, one breath. Voice: concrete images throughout.
    scores: [5, 5, 5, 5, 5],
  },
  {
    text: "My alarm went off at 6 AM on a Saturday like it had a shift to clock into — congratulations, you're the only thing in this house with a job today.",
    // Same punchline, weaker setup: "like it had a shift" states the
    // joke instead of showing it, so the turn and the freshness score
    // lower, and the voice is flatter.
    scores: [5, 4, 3, 4, 3],
  },
  {
    text: "My alarm rang at 6 AM on a Saturday, full of purpose, like a man reporting for a job he doesn't have — congratulations, you're the only thing in this house with a shift today.",
    // Sprawl: "full of purpose" and "reporting for a job" say the same
    // thing twice, and the punchline repeats "shift" instead of landing
    // on the sharper "job today".
    scores: [5, 3, 3, 2, 3],
  },
];

// Criterion weights follow the judge's order: earlier criteria matter
// more, so a line that misses the brief can never win on style alone.
const WEIGHTS: [number, number, number, number, number] = [5, 4, 3, 2, 1];

function weightedTotal(c: Candidate): number {
  return c.scores.reduce((sum, s, i) => sum + s * WEIGHTS[i], 0);
}

function pickBest(cands: Candidate[]): Candidate {
  let best = cands[0];
  for (const c of cands.slice(1)) {
    if (weightedTotal(c) > weightedTotal(best)) best = c;
  }
  return best;
}

const FINAL = pickBest(CANDIDATES).text;

function validate(line: string): void {
  // The gate counts characters (code points); the em dash is one.
  const chars = [...line].length;
  if (chars < 1 || chars > 200) {
    throw new Error(`roast must be 1-200 characters, got ${chars}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("roast must be a single line");
  }
  if (line.trim() !== line) {
    throw new Error("roast must not have leading or trailing whitespace");
  }
  if (line.trim().length === 0) {
    throw new Error("roast must not be only whitespace");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
validate(FINAL);
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, FINAL, "utf8");

// Read-back verification: the gate reads this exact file, so prove what
// landed on disk is what we validated — same text, same character count.
// A silent write failure or encoding surprise must fail loudly here,
// not surface later as a 0 in the Valid column.
const written = readFileSync(outPath, "utf8");
if (written !== FINAL) {
  throw new Error(
    `read-back mismatch: wrote ${[...FINAL].length} chars, ` +
      `file holds ${[...written].length} chars`,
  );
}
if ([...written].length !== 170) {
  throw new Error(`expected 170 characters, got ${[...written].length}`);
}
console.log(`wrote ${[...FINAL].length} characters to ${outPath} (verified)`);
