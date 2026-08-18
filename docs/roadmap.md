# CRA CLI — Roadmap

Known gaps, observed from the code. Limitations, not a schedule.

## Defects

**The TFSA annual limits table stops at 2025.** `src/utils/constants.ts` defines limits
through `2025: 7000` and no further. Room is calculated by summing whatever the table
contains, so a missing year contributes **zero** — with no error, no warning, and no
validation that the table reaches the current year.

For a contribution-room calculator this is the worst shape a bug can take: it produces a
plausible number that is quietly too low, and it fails in the direction that looks
conservative right up until someone adds a year and every figure jumps. Adding the entry is
a one-line change; the calculation picks it up automatically.

**`package.json` declares `"license": "ISC"` while `LICENSE.md` is MIT.** The package is
published to npm, so the registry advertises ISC for a repository that ships an MIT
licence.

## Gaps

**No validation that the limits table is current.** The root cause of the defect above.
Comparing the highest year in `constants.ts` against the system clock and warning on a gap
would turn a silent wrong answer into a visible one.

**Over-contribution penalties are documented but not calculated.** The 1% monthly charge is
the main thing this tool exists to help you avoid, and it is described in
[Contribution rules](./rules.md) rather than computed. A projected penalty on an
over-contribution would close the loop.

**Undo is single-step.** It recovers a mistyped amount, not a bad session. Reset has no
undo at all.

**No import.** Export to CSV exists; there is no way back in. Recovering from a lost data
file means re-entering everything by hand.

## Not modelled

Stated in [Contribution rules](./rules.md), repeated here because each is a deliberate
boundary rather than an oversight:

- Investment growth or loss — room is tracked, balances are not.
- Qualifying withdrawals and transfers — FHSA-to-RRSP, home purchase, TFSA transfers
  between institutions.
- Non-resident status, which changes how room accrues.
- Future annual limits, which are indexed to inflation and announced yearly. Projections
  assume the most recent known limit continues.

## Non-goals

- **Filing or reporting.** This is a personal tracker. Nothing here is submitted anywhere.
- **Tax advice.** The rules are implemented as published; the interpretation is yours.
- **Cloud sync.** Financial data staying on one machine in a plain JSON file is the design,
  not a limitation to fix.
