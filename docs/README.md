# CRA CLI — Documentation

An interactive Node.js CLI for tracking TFSA and FHSA contributions. Contribution room is
derived from CRA rules and your transaction history rather than typed in, which is the
whole point — the number the CRA shows you is a year out of date the moment you contribute.

```
cra-cli/
├── docs/
│   ├── README.md          this page
│   ├── installation.md    npm, from source, requirements
│   ├── usage.md           menus, data storage, export
│   ├── rules.md           the TFSA and FHSA rules this tool implements
│   └── development.md     architecture, tests, CI
└── src/
    ├── index.ts           entry point
    ├── cli/               menus, prompts, display
    ├── services/          TFSA and FHSA calculations, CSV export
    ├── storage/           JSON persistence
    ├── types/             TypeScript interfaces
    └── utils/             annual limits, dates, validation
```

## Pages

- [Installation](./installation.md) — global install, running from source
- [Usage](./usage.md) — first run, menus, where your data lives, exporting
- [Contribution rules](./rules.md) — annual limits, room formulas, and what this tool does not model
- [Development](./development.md) — architecture, tests, CI

## Before you rely on a number

The calculations follow published CRA rules, but this is a personal tool, not a filing
system. [rules.md](./rules.md) sets out both what is implemented and what is deliberately
not — read it before treating a projection as authoritative.
