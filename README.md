# CRA CLI - TFSA & FHSA Contribution Tracker

A command-line application to track your Canadian tax-advantaged account contributions and calculate your available contribution room based on CRA (Canada Revenue Agency) rules.

## Features

### TFSA (Tax-Free Savings Account)
- 📈 View current contribution room
- ➕ Add contributions with date tracking
- ➖ Record withdrawals (automatically added back to room the following year)
- 📋 View complete transaction history
- 🔮 Project contribution room for the next 5 years
- 💾 Export transactions to CSV
- ↩️ Undo last transaction
- 🗑️ Reset account data

### FHSA (First Home Savings Account)
- 📈 View current contribution room
- ➕ Add contributions with date tracking
- 📋 View complete transaction history
- 🔮 Project contribution room for the next 5 years
- 💾 Export transactions to CSV
- ↩️ Undo last contribution
- 🗑️ Reset account data

## Installation

### Prerequisites
- Node.js 18 or higher

### Install globally
```bash
npm install -g cra-cli
```

### Or run from source
```bash
git clone https://github.com/willtheorangeguy/cra-cli.git
cd cra-cli
npm install
npm run build
npm link
```

## Usage

Run the CLI:
```bash
cra-cli
```

On first run, you'll be prompted to set up your profile:
- Your birth year (used to calculate TFSA eligibility from age 18)
- Whether you've opened an FHSA (and when)

### Main Menu
```
? What would you like to do?
❯ 📊 TFSA - Tax-Free Savings Account
  🏠 FHSA - First Home Savings Account
  ⚙️  Settings
  👋 Exit
```

## How Contribution Room Works

### TFSA Rules

**Annual Limits (Historical)**
| Year | Limit |
|------|-------|
| 2009-2012 | $5,000 |
| 2013-2014 | $5,500 |
| 2015 | $10,000 |
| 2016-2018 | $5,500 |
| 2019-2022 | $6,000 |
| 2023 | $6,500 |
| 2024-2025 | $7,000 |

**Room Calculation:**
```
TFSA Room = Sum of annual limits (from age 18 or 2009, whichever is later)
          - Total contributions made
          + Withdrawals from previous years
```

**Key Points:**
- You start accumulating room from the year you turn 18, or 2009, whichever is later
- Unused room carries forward indefinitely
- Withdrawals are added back to your room on January 1 of the following year
- Over-contributions incur a 1% monthly penalty

### FHSA Rules

**Limits:**
- Annual limit: $8,000
- Lifetime limit: $40,000
- Carry-forward: Maximum $8,000 of unused room per year
- Duration: Account can be open for 15 years or until age 71

**Room Calculation:**
```
Year 1: $8,000
Year 2+: $8,000 + min($8,000, unused room from previous year)
Maximum room per year: $16,000
```

**Key Points:**
- Must be a first-time home buyer to open
- Cannot exceed $40,000 lifetime contributions
- Unused room carries forward (capped at $8,000 per year)
- Account must be closed after 15 years or when you turn 71

## Data Storage

Your data is stored locally in:
- **Windows:** `C:\Users\<username>\.cra-cli\data.json`
- **macOS/Linux:** `~/.cra-cli/data.json`

## Development

### Build
```bash
npm run build
```

### Run tests
```bash
npm test
```

### Run in development
```bash
npm run dev
```

## Project Structure
```
cra-cli/
├── src/
│   ├── index.ts              # Entry point
│   ├── cli/
│   │   ├── menus.ts          # Interactive menus
│   │   ├── prompts.ts        # User input prompts
│   │   └── display.ts        # Formatted output
│   ├── services/
│   │   ├── tfsa.ts           # TFSA calculations
│   │   ├── fhsa.ts           # FHSA calculations
│   │   └── export.ts         # CSV export
│   ├── storage/
│   │   └── storage.ts        # JSON file storage
│   ├── utils/
│   │   ├── constants.ts      # Annual limits
│   │   ├── dates.ts          # Date utilities
│   │   └── validation.ts     # Input validation
│   └── types/
│       └── index.ts          # TypeScript interfaces
└── tests/
    ├── tfsa.test.ts          # TFSA tests
    └── fhsa.test.ts          # FHSA tests
```

## Disclaimer

This tool is for personal tracking purposes only. It is not affiliated with the Canada Revenue Agency. Always verify your contribution room with official CRA sources (My Account) before making contributions. The calculations are based on publicly available CRA rules but may not account for all edge cases.

## License

MIT License — see [LICENSE.md](LICENSE.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
