# API

CRA CLI exposes an interactive terminal interface through the `cra-cli` command. It has no command-line flags or non-interactive command mode.

## `cra-cli`

Run the interactive tracker. On first launch it asks for a birth year and whether an FHSA has been opened. Later launches load the saved profile and show this menu:

```text
? What would you like to do?
❯ 📊 TFSA - Tax-Free Savings Account
  🏠 FHSA - First Home Savings Account
  ⚙️  Settings
  👋 Exit
```

| Menu choice | Actions |
| --- | --- |
| TFSA | View room, add contributions or withdrawals, view history, project room, export CSV, undo the last transaction, or reset TFSA data |
| FHSA | View room, add contributions, view history, project room, export CSV, undo the last transaction, or reset FHSA data |
| Settings | View or update the profile |
| Exit | Save and leave the CLI |

```bash
cra-cli
```

{{ support() }}
