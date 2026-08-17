# CRA CLI — FAQ

## Is this affiliated with the CRA?

No. It is a personal tracking tool that implements published CRA rules. Always verify
against [CRA My Account](https://www.canada.ca/en/revenue-agency/services/e-services/e-services-individuals/account-individuals.html)
before contributing.

## Does my financial data leave my machine?

No. Everything is a JSON file in your home directory. There is no server, no account, and
no network call anywhere in the tool.

## Why does it ask for my birth year?

Because TFSA room accumulates from the year you turn 18, or 2009, whichever is later. Your
birth year determines your entire contribution history, not just your eligibility today.

## Why is my contribution room lower than CRA My Account says?

Two likely reasons, and one is a known defect:

1. **You have not entered your full contribution history.** Room is derived from your
   transactions, not stored, so it is only correct once the history is in.
2. **The annual limits table stops at 2025.** A missing year contributes zero, silently, so
   figures for later years are understated. See [Roadmap](./roadmap.md).

Note the CRA's own figure lags — it reflects contributions reported by your institution,
which can be a year behind.

## Why doesn't my withdrawal show as available room?

Because it is not yet. TFSA withdrawal room returns on **1 January of the following year**,
not immediately. Withdrawing and re-contributing in the same calendar year is the standard
way people over-contribute by accident, and it costs 1% per month on the excess.

## Why can't I record an FHSA withdrawal?

FHSA withdrawals do not restore room, so there is nothing for the calculation to do with
one. See [Contribution rules](./rules.md).

## Does it track my investment returns?

No. It tracks **room**, not balances. Gains inside a TFSA do not consume room and losses do
not restore it — but the tool does not know your balance at all.

## Does it calculate over-contribution penalties?

No. The 1% monthly charge is documented in [Contribution rules](./rules.md) but not
computed or displayed.

## Can I edit the data file directly?

Yes. It is plain JSON with UUID identifiers and ISO dates. That is deliberate — personal
financial records should outlive the tool that wrote them.

## What happens if I lose the file?

Nothing can reconstruct it. Back it up, or export to CSV regularly.

## Can undo recover more than one mistake?

No — undo is single-step. It fixes a mistyped amount, not a session's worth of them. Reset
has no undo at all, so export first if the history matters.

## Why does npm say the license is ISC when the repo says MIT?

`package.json` still declares ISC while `LICENSE.md` is MIT. That is a known
inconsistency — see [Roadmap](./roadmap.md).
