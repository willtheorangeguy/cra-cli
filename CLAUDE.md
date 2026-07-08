# CLAUDE.md

## Project Overview

CRA CLI is a Node.js command-line application for tracking Canadian tax-advantaged account contributions (TFSA and FHSA). It calculates available contribution room based on Canada Revenue Agency rules.

**Published to npm as `cra-cli`.** Version 1.0.0, ISC license.

## Tech Stack

- **Language:** TypeScript (ES2022, strict mode)
- **Runtime:** Node.js 20+ (ES modules)
- **CLI Framework:** Inquirer.js for interactive prompts
- **Testing:** Vitest
- **CI:** GitHub Actions (Node 20.x, 22.x)

## Commands

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript to dist/
npm run dev          # Build + run
npm test             # Run tests (vitest)
npm run test:watch   # Run tests in watch mode
npm run start        # Run built CLI
npm link             # Link for local CLI testing
```

## Project Structure

```
src/
  index.ts              # Entry point (shebang, runs main loop)
  cli/
    menus.ts            # Interactive menu system (Inquirer)
    prompts.ts          # User input prompts with validation
    display.ts          # Formatted terminal output (Chalk, cli-table3)
  services/
    tfsa.ts             # TFSA contribution room calculations
    fhsa.ts             # FHSA contribution room calculations
    export.ts           # CSV export
  storage/
    storage.ts          # JSON file persistence (~/.cra-cli/data.json)
  types/
    index.ts            # TypeScript interfaces
  utils/
    constants.ts        # Annual limits, tax year constants
    dates.ts            # Date utilities
    validation.ts       # Input validation
tests/
  tfsa.test.ts          # TFSA unit tests
  fhsa.test.ts          # FHSA unit tests
```

## Architecture

- **Separation of concerns:** CLI layer (menus/prompts/display), services (business logic), storage (persistence), utils (shared helpers)
- **Pure calculation functions** in services — no side effects
- **Data stored** as JSON at `~/.cra-cli/data.json`
- **Transactions** use UUID v4 IDs and ISO date strings (YYYY-MM-DD)

## Key Business Rules

- **TFSA:** Annual limits from 2009-2025 (defined in `constants.ts`). Eligibility starts at age 18 or 2009. Withdrawal room restores Jan 1 of the following year.
- **FHSA:** $8,000/year, $40,000 lifetime. Max $8,000 carry-forward per year. Expires after 15 years or at age 71.

## Conventions

- All source in `src/`, compiled output in `dist/` (gitignored)
- Strict TypeScript — no `any` types
- Tests live in `tests/` directory, named `*.test.ts`
- No comments unless explaining non-obvious "why"
- Functional style — prefer returning new data over mutation

## CI/CD

- **CI workflow:** Runs on all pushes and PRs. Builds and tests on Node 20.x and 22.x.
- **Release workflow:** Triggered by GitHub release publication. Runs tests then publishes to npm with provenance.
- **Dependabot:** Weekly npm and Actions updates, ignoring patch versions.
