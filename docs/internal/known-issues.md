# Known Issues — cra-cli

Concrete defects and gaps found while writing this repository's documentation in
August 2026. **Nothing here was changed** — each one needs a code, configuration, or
licensing decision rather than a documentation one.

Ordered by severity. See [`docs/roadmap.md`](../roadmap.md) for the narrative version,
which also covers deliberate non-goals.


**2 open:** 1 high, 1 medium.

## 1. TFSA annual limits stop at 2025, and a missing year is silently zero

**Severity:** High  
**Where:** `src/utils/constants.ts`

**What:** The annual-limit map ends at `2025: 7000`. Contribution room is calculated by summing whatever the table contains, and there is no validation that it reaches the current year.

**Why it matters:** A missing year contributes **zero** with no error and no warning, so every TFSA figure is understated. For a contribution-room calculator that is the worst shape a bug can take: a plausible number that is quietly too low, failing in the direction that looks conservative until someone adds a year and every total jumps.

**Suggested fix:** Add the current year's limit (a factual CRA value). Separately, compare the highest year in the table against the system clock and warn on a gap.

## 2. package.json declares ISC while LICENSE.md is MIT

**Severity:** Medium  
**Where:** `package.json`

**What:** `"license": "ISC"` in the package metadata; `LICENSE.md` is the MIT text after the Wave 1 licensing sweep.

**Why it matters:** This package **is published to npm**, so the registry advertises ISC for a repository that ships MIT.

**Suggested fix:** Set `"license": "MIT"` and publish a patch release.


---

## Also, across every repository

**`.bandit` is present on disk but untracked in git.** Verified in PyWorkout, treklogger,
skyscanner-cli, booking-cli, piggy, and aibot — the config file exists locally in each but
`git ls-files` does not know about it, so none of it reached GitHub.

The August 2026 security sweep therefore looks complete locally and landed nowhere. Worth
checking across all 44 repositories it covered.
