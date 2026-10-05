# Usage

## First run

You are asked two things:

- **Your birth year.** TFSA room accumulates from the year you turn 18, or 2009,
  whichever is later — so this determines your entire contribution history.
- **Whether you have an FHSA, and when it was opened.** FHSA room starts accruing when
  the account is opened, not when you become eligible.

Both are stored locally and can be changed later under Settings.

## The main menu

```text
? What would you like to do?
❯ 📊 TFSA - Tax-Free Savings Account
  🏠 FHSA - First Home Savings Account
  ⚙️  Settings
  👋 Exit
```

## What each account supports

| Action | TFSA | FHSA |
| --- | --- | --- |
| View current contribution room | Yes | Yes |
| Add a contribution, with date | Yes | Yes |
| Record a withdrawal | Yes | No |
| View transaction history | Yes | Yes |
| Project room five years ahead | Yes | Yes |
| Export transactions to CSV | Yes | Yes |
| Undo the last entry | Yes | Yes |
| Reset the account | Yes | Yes |

Withdrawals exist only for TFSA because FHSA withdrawals do not restore room — see
[Contribution rules](contribution-rules.md).

## Dates matter

Every contribution and withdrawal is recorded against a date, not just an amount. This is
not bookkeeping detail: TFSA withdrawal room is restored on **1 January of the following
year**, so a withdrawal dated 31 December and one dated 1 January differ by a full year in
when that room comes back. Enter the real date.

## Where your data lives

| Platform | Path |
| --- | --- |
| Windows | `C:\Users\<username>\.cra-cli\data.json` |
| macOS and Linux | `~/.cra-cli/data.json` |

A plain JSON file, local to your machine, sent nowhere. Back it up as you would any other
personal record — nothing here can reconstruct your history if the file is lost, and the
CRA's own figures lag by a year.

Transactions carry UUID v4 identifiers and ISO `YYYY-MM-DD` dates.

## Exporting

The CSV export produces one row per transaction, suitable for a spreadsheet or for
attaching to your own records. It is a copy, not a move — exporting changes nothing.

## Undo and reset

**Undo** removes the most recent entry for that account. It is single-step, so it recovers
a mistyped amount, not a session's worth of them.

**Reset** clears an account's data entirely. There is no undo for reset; export first if
the history matters.
