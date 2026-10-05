# Development

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
| --- | --- |
| Language | TypeScript, ES2022, strict mode |
| Runtime | Node.js 20+, ES modules |
| Prompts | Inquirer.js |
| Output | Chalk and cli-table3 |
| Tests | Vitest |

## Architecture

Layers, the data model, and why contribution room is derived rather than stored are
documented separately in [Architecture](./architecture.md).

### Adding an annual limit

New TFSA limits go in `src/utils/constants.ts`. Nothing else needs to change: room
calculation sums whatever the table contains, so a missing year is silently treated as zero
rather than raising an error. Add the year, then extend the tests.

This is currently outstanding — the table stops at 2025. See [Roadmap](./roadmap.md).

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
