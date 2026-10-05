# CRA CLI

CRA CLI is an interactive Node.js tool for tracking TFSA and FHSA contributions and calculating available contribution room from your transaction history.

## Key features

- Calculates TFSA room from age eligibility, annual limits, contributions, and prior-year withdrawals.
- Calculates FHSA room from account opening date, annual carry-forward, and lifetime limits.
- Records dated contributions and TFSA withdrawals in a local JSON file.
- Shows transaction history and five-year room projections.
- Exports transaction history to CSV and supports undoing the latest transaction.

## Quick start

```bash
npm install -g cra-cli
cra-cli
```

See [Getting started](getting-started.md) for the first-run walkthrough.

## Where to next

<div class="wt-grid" markdown>

[:material-rocket-launch: **Getting started**<br>Set up a profile and enter your history](getting-started.md){ .wt-card }

[:material-download: **Installation**<br>Install from npm or run from source](installation.md){ .wt-card }

[:material-tune: **Configuration**<br>Profile settings and local data](configuration.md){ .wt-card }

[:material-sitemap: **Architecture**<br>Calculation, storage, and CLI layers](architecture.md){ .wt-card }

[:material-api: **API**<br>Interactive menu reference](api.md){ .wt-card }

[:material-hand-heart: **Contribution rules**<br>Limits and calculation boundaries](contribution-rules.md){ .wt-card }

</div>

## Support

{{ support() }}
