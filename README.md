<!-- Logo -->
<h1 align="center">CRA CLI</h1>

<!-- Copy -->
<h4 align="center">Track your TFSA and FHSA contributions and work out how much room you actually have left, from the terminal.</h4>

<!-- Badges -->
<div align="center">
  <img alt="GitHub Issues" src="https://img.shields.io/github/issues/willtheorangeguy/cra-cli">
  <img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/willtheorangeguy/cra-cli">
  <img alt="License" src="https://img.shields.io/github/license/willtheorangeguy/cra-cli">
  <img alt="CI" src="https://img.shields.io/github/actions/workflow/status/willtheorangeguy/cra-cli/ci.yml">
  <img alt="npm" src="https://img.shields.io/npm/v/cra-cli">
</div>

<!-- Navigation -->
<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#support">Support</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

## Key Features

- Contribution room for both TFSA and FHSA, calculated from CRA rules rather than entered by hand.
- Contributions and withdrawals recorded with dates, so room restores on the right January 1st.
- Full transaction history, with an undo for the last entry.
- Five-year room projections for each account.
- CSV export of every transaction.
- Entirely local — your data never leaves the machine.

## Installation

```bash
npm install -g cra-cli
cra-cli
```

Requires Node.js 20 or higher. See [`docs/installation.md`](docs/installation.md) to run from source instead.

## Usage

Run `cra-cli` and answer the prompts. The first run asks for your birth year, which sets when TFSA eligibility began, and whether you have an FHSA. After that it is a menu.

## Documentation

Full documentation lives in [`docs/`](docs/README.md):
[Installation](docs/installation.md) · [Usage](docs/usage.md) · [Contribution rules](docs/rules.md) · [Development](docs/development.md)

## Support

Open a [GitHub Discussion](https://github.com/willtheorangeguy/cra-cli/discussions/new) or file an [issue](https://github.com/willtheorangeguy/cra-cli/issues/new/choose).

## Contributing

Contributions welcome. See the org-wide [Contributing Guide](https://github.com/willtheorangeguy/.github/blob/main/CONTRIBUTING.md) and [Code of Conduct](https://github.com/willtheorangeguy/.github/blob/main/CODE_OF_CONDUCT.md).

## License

MIT — see [`LICENSE.md`](LICENSE.md).

> **Not affiliated with the Canada Revenue Agency, and not tax advice.** This is a personal tracking tool. Confirm your real contribution room in CRA My Account before contributing — over-contributing to a TFSA costs 1% per month. Known limits of the calculation are in [`docs/rules.md`](docs/rules.md).
