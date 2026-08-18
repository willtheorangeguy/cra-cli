# CRA CLI — Architecture

## Layout

```
src/
├── index.ts              entry point — shebang, runs the main loop
├── cli/
│   ├── menus.ts          Inquirer menu system
│   ├── prompts.ts        input prompts with validation
│   └── display.ts        formatted terminal output (Chalk, cli-table3)
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

## Layers

```
   cli/          menus, prompts, display
     │
     ▼
   services/     pure calculation — no side effects
     │
     ▼
   storage/      JSON read and write

   utils/        shared by all three
```

Four layers in dependency order, with `utils/` available throughout.

## Services are pure

The calculation functions in `services/` have **no side effects**. They take state and
return a result; they do not read files, prompt, or print.

That is the property that makes `tests/tfsa.test.ts` and `tests/fhsa.test.ts` able to test
the CRA rules directly, without mocking a filesystem or driving a prompt library. It is
also the constraint to preserve: persistence belongs in `storage/`, presentation in `cli/`.
A calculation that needs to save something is a sign the wrong layer is doing the work.

## Data model

Everything lives in one JSON file:

| Platform | Path |
|---|---|
| Windows | `C:\Users\<username>\.cra-cli\data.json` |
| macOS and Linux | `~/.cra-cli/data.json` |

Transactions carry UUID v4 identifiers and ISO `YYYY-MM-DD` dates. There is no database,
no migration system, and no server — the file is readable and hand-editable, which is
appropriate for personal financial records that need to outlive the tool.

The corollary: **nothing can reconstruct your history if the file is lost.** Back it up.

## Room is derived, never stored

Contribution room is not a field. It is recomputed from your birth year, the annual limits
table, and your transaction history every time it is displayed.

That is why entering historical contributions matters, and why a missing annual limit in
`constants.ts` silently changes every figure — see below.

## Annual limits

TFSA limits live in `utils/constants.ts` as a year-to-amount map. Room calculation sums
whatever the table contains.

**A missing year contributes zero and raises nothing.** There is no validation that the
table extends to the current year, so an out-of-date constants file produces understated
room rather than an error. Adding a year requires only the map entry; the calculation picks
it up automatically. See [Roadmap](./roadmap.md).

## Functional style

The codebase returns new data rather than mutating, uses strict TypeScript with no `any`,
and compiles from `src/` to a gitignored `dist/`. Comments appear only where they explain a
non-obvious *why*.
