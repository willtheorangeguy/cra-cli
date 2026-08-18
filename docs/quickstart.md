# CRA CLI — Quickstart

## 1. Install

```bash
npm install -g cra-cli
```

Requires Node.js 20 or higher. To run from source instead, see
[Installation](./installation.md).

## 2. Run it

```bash
cra-cli
```

## 3. Answer two questions

The first run asks for:

- **Your birth year.** TFSA room accumulates from the year you turn 18, or 2009, whichever
  is later — so this determines your entire contribution history, not just your age.
- **Whether you have an FHSA, and when it was opened.** Unlike the TFSA, FHSA room starts
  accruing when the account is *opened*. Waiting banks nothing.

Nothing is written until you answer. Both can be changed later under Settings.

## 4. Record what you have already contributed

Contribution room is derived from your history, so it is only correct once your history is
in. Enter past contributions with their **real dates** — TFSA withdrawal room returns on
1 January of the following year, so a date entered carelessly moves room by a full year.

## What you get

```
? What would you like to do?
❯ 📊 TFSA - Tax-Free Savings Account
  🏠 FHSA - First Home Savings Account
  ⚙️  Settings
  👋 Exit
```

Each account offers current room, transaction history, a five-year projection, CSV export,
undo, and reset.

## Before you act on a number

Check it against [CRA My Account](https://www.canada.ca/en/revenue-agency/services/e-services/e-services-individuals/account-individuals.html).
This is a personal tracking tool, not a filing system, and
**[the TFSA limits table currently stops at 2025](./roadmap.md)** — which means figures for
later years are understated. [Contribution rules](./rules.md) sets out both what is
implemented and what is not.

## Then what

- [Usage](./usage.md) — menus, data storage, export, undo
- [Contribution rules](./rules.md) — the CRA rules this implements
- [Troubleshooting](./troubleshooting.md) — if a number looks wrong
