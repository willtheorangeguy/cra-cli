# CRA CLI — Documentation

An interactive Node.js CLI for tracking TFSA and FHSA contributions. Contribution room is
derived from CRA rules and your transaction history rather than typed in, which is the
whole point — the number the CRA shows you is a year out of date the moment you contribute.

```
cra-cli/
├── docs/
│   ├── README.md          this page
│   ├── quickstart.md      install, first run, entering history
│   ├── installation.md    npm, from source, requirements
│   ├── architecture.md    layers, data model, why room is derived
│   ├── usage.md           menus, data storage, export
│   ├── rules.md           the TFSA and FHSA rules this tool implements
│   ├── development.md     commands, stack, conventions, CI
│   ├── faq.md             privacy, room discrepancies, what is not tracked
│   ├── troubleshooting.md wrong numbers, build problems, lost data
│   └── roadmap.md         known defects and deliberate non-goals
└── src/
    ├── index.ts           entry point
    ├── cli/               menus, prompts, display
    ├── services/          TFSA and FHSA calculations, CSV export
    ├── storage/           JSON persistence
    ├── types/             TypeScript interfaces
    └── utils/             annual limits, dates, validation
```

## Pages

- [Quickstart](./quickstart.md) — install, answer two questions, enter your history
- [Installation](./installation.md) — global install, running from source
- [Architecture](./architecture.md) — layers, the data model, why room is never stored
- [Usage](./usage.md) — first run, menus, where your data lives, exporting
- [Contribution rules](./rules.md) — annual limits, room formulas, what is not modelled
- [Development](./development.md) — commands, stack, conventions, CI
- [FAQ](./faq.md) — privacy, why room differs from CRA My Account, what is not tracked
- [Troubleshooting](./troubleshooting.md) — wrong figures, build failures, lost data
- [Roadmap](./roadmap.md) — known defects and non-goals

## Before you rely on a number

The calculations follow published CRA rules, but this is a personal tool, not a filing
system — and **the TFSA limits table currently stops at 2025**, which understates room for
later years. [rules.md](./rules.md) sets out what is implemented;
[roadmap.md](./roadmap.md) sets out what is broken.
