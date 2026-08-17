# CRA CLI — Development

## Commands

```bash
npm install          # dependencies
npm run build        # compile TypeScript to dist/
npm run dev          # build and run
npm test             # vitest
npm run test:watch   # vitest in watch mode
npm run start        # run the built CLI
npm link             # put the local build on PATH as cra-cli
```

## Stack

| Concern | Choice |
|---|---|
| Language | TypeScript, ES2022, strict mode |
| Runtime | Node.js 20+, ES modules |
| Prompts | Inquirer.js |
| Output | Chalk and cli-table3 |
| Tests | Vitest |

## Architecture

```
src/
├── index.ts              entry point — shebang, runs the main loop
├── cli/
│   ├── menus.ts          Inquirer menu system
│   ├── prompts.ts        input prompts with validation
│   └── display.ts        formatted terminal output
├── services/
│   ├── tfsa.ts           TFSA room calculations
│   ├── fhsa.ts           FHSA room calculations
│   └── export.ts         CSV export
├── storage/storage.ts    JSON persistence to ~/.cra-cli/data.json
├── types/index.ts        TypeScript interfaces
└── utils/
    ├── constants.ts      annual limits and tax-year constants
    ├── dates.ts          date utilities
    └── validation.ts     input validation
```

Four layers, in dependency order: CLI (menus, prompts, display) → services (business
logic) → storage (persistence), with utils shared throughout.

### Services are pure

The calculation functions in `services/` have no side effects. They take state and return
a result; they do not read files, prompt, or print. That is what makes `tests/tfsa.test.ts`
and `tests/fhsa.test.ts` able to cover the rules directly, and it is the property to
preserve — persistence belongs in `storage/`, presentation in `cli/`.

### Adding an annual limit

New TFSA limits go in `constants.ts`. Nothing else needs to change: room calculation sums
whatever the table contains, so a missing year is silently treated as zero rather than
raising an error. Add the year, then extend the tests.

## Conventions

- Source in `src/`, compiled output in `dist/` (gitignored).
- Strict TypeScript — no `any`.
- Tests in `tests/`, named `*.test.ts`.
- Comments only where they explain a non-obvious *why*.
- Functional style: return new data rather than mutating.
- Transactions use UUID v4 identifiers and ISO `YYYY-MM-DD` dates.

## CI

- **CI** — builds and tests on Node 20.x and 22.x, for every push and pull request.
- **Release** — triggered by publishing a GitHub release; runs tests, then publishes to
  npm with provenance.
- **Dependabot** — weekly npm and Actions updates, ignoring patch versions.
