# Getting started

This guide takes you from installation to a profile whose contribution room reflects your recorded history.

## Prerequisites

| Requirement | Minimum version | Check with |
| --- | --- | --- |
| Node.js | 20 | `node --version` |

npm is installed with Node.js. Check it with `npm --version`.

## Install

```bash
npm install -g @willtheorangeguy/cra-cli
```

Other installation options are covered in [Installation](installation.md).

## First run

1. Start the CLI.

    ```bash
    cra-cli
    ```

    ```text
    Welcome! Let's set up your profile.
    ? What year were you born?
    ```

2. Enter your birth year, then answer whether you have opened an FHSA. If you have, enter its opening date.

    ```text
    Have you opened an FHSA (First Home Savings Account)?
    Profile setup complete!
    ```

3. Choose TFSA or FHSA from the main menu and record your historical transactions with their actual dates.

    ```text
    What would you like to do?
    ```

The menu offers TFSA, FHSA, Settings, and Exit. Your profile and transactions are stored locally after setup.

## What just happened

CRA CLI created a local profile and derives room from your profile, annual limits, and transaction history. Entering your complete history is necessary for the displayed room to match your records.

## Next steps

- [Usage](usage.md) — menus, storage, exports, undo, and reset
- [Contribution rules](contribution-rules.md) — how room is calculated
- [Troubleshooting](troubleshooting.md) — diagnose unexpected figures

{{ support() }}
