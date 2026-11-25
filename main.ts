// Snooze Button Roast
// https://make.fun/c/u-carbon-forge-snooze-button-roast-14cbafc6
//
// The program writes one roast of an alarm clock that rings at 6 AM on a
// Saturday (1-200 characters, a single line, punchline at the end) to
// <MAKEFUN_OUTPUT_DIR>/entry.txt.
//
// The joke: the alarm behaves like an overeager employee who never checked
// the calendar — it shows up for a shift that does not exist, so the roast
// congratulates it on being the only thing in the house with a job today.
// The turn ("never checked a calendar") is the fresh angle, and the
// punchline pays off in the last few words.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Candidates tried (final pass). All are 1 line, <= 200 chars.
// Chosen wins: "never checked a calendar" is a concrete, fresh image the
// other two lack — alt2 drops it for a flat "shift to clock into", and
// alt3 sprawls and ends on the weaker "shift today" instead of "job today".
const CANDIDATES = [
  "My alarm rang at 6 AM on a Saturday with the confidence of a man who has never checked a calendar — congratulations, you're the only thing in this house with a job today.",
  "My alarm went off at 6 AM on a Saturday like it had a shift to clock into — congratulations, you're the only thing in this house with a job today.",
  "My alarm rang at 6 AM on a Saturday, full of purpose, like a man reporting for a job he doesn't have — congratulations, you're the only thing in this house with a shift today.",
] as const;

// Index 0: the funniest candidate — setup, fresh angle, punchline last.
const CHOSEN = 0;

const ROAST = CANDIDATES[CHOSEN];

function validate(line: string): void {
  const chars = [...line].length; // code points, as the gate counts characters
  if (chars < 1 || chars > 200) {
    throw new Error(`roast must be 1-200 characters, got ${chars}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("roast must be a single line");
  }
  if (line.trim() !== line) {
    throw new Error("roast must not have leading or trailing whitespace");
  }
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
validate(ROAST);
writeFileSync(join(outDir, "entry.txt"), ROAST, "utf8");
console.log(
  `wrote ${[...ROAST].length} characters to ${join(outDir, "entry.txt")}`,
);
