# Contribution rules

The rules this tool implements, and where its model stops. Annual limits live in
`src/utils/constants.ts`; the calculations are pure functions in `src/services/`.

## TFSA

### Annual limits

| Year | Limit |
| --- | --- |
| 2009–2012 | $5,000 |
| 2013–2014 | $5,500 |
| 2015 | $10,000 |
| 2016–2018 | $5,500 |
| 2019–2022 | $6,000 |
| 2023 | $6,500 |
| 2024–2025 | $7,000 |

> **The table ends at 2025.** `constants.ts` defines no limit beyond that year, so room for
> any later year is not accrued and the figures this tool reports will be **understated**
> until the constant is added. Check the current limit against
> [CRA My Account](https://www.canada.ca/en/revenue-agency/services/e-services/e-services-individuals/account-individuals.html)
> and treat the output as a lower bound in the meantime.

### Room calculation

```text
TFSA room = sum of annual limits from the later of age 18 or 2009
          - total contributions made
          + withdrawals from previous years
```

### What follows from that

- Room accrues from the year you turn 18, or 2009, whichever is later. It does not depend
  on having opened an account.
- Unused room carries forward indefinitely. There is no expiry.
- **Withdrawals return as room on 1 January of the following year, not immediately.**
  Withdrawing and re-contributing in the same calendar year is the most common way people
  over-contribute by accident.
- Over-contributions are penalised at 1% per month on the excess, for every month it
  remains.

## FHSA

### Limits

| Rule | Value |
| --- | --- |
| Annual limit | $8,000 |
| Lifetime limit | $40,000 |
| Maximum carry-forward | $8,000 per year |
| Maximum room in any one year | $16,000 |
| Account lifetime | 15 years, or until age 71 |

### Room calculation

```text
Year 1:   $8,000
Year 2+:  $8,000 + min($8,000, unused room from the previous year)
```

### What follows from that

- Room starts when the account is **opened**, not when you become eligible — unlike the
  TFSA, waiting does not bank room.
- Carry-forward is capped at one year's worth, so unused room does not compound the way
  TFSA room does.
- The $40,000 lifetime cap is absolute regardless of accumulated annual room.
- You must be a first-time home buyer to open one.
- The account must close after 15 years or when you turn 71, whichever comes first.

## What this tool does not model

Worth knowing before trusting a projection:

- **Investment growth or loss.** Room is tracked, not balances. Gains inside a TFSA do not
  consume room, and losses do not restore it — but this tool does not know your balance at all.
- **Over-contribution penalties.** The 1% monthly charge is described here but not
  calculated or displayed.
- **Qualifying withdrawals or transfers** — FHSA-to-RRSP transfers, home purchases,
  TFSA transfers between institutions.
- **Non-resident status**, which changes how room accrues.
- **Future annual limits**, which are indexed to inflation and announced yearly. Projections
  assume the most recent known limit continues.

Verify against CRA My Account before acting on anything here.
