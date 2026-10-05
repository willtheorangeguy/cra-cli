# Configuration

CRA CLI has no command-line flags, environment variables, or separate configuration file. Settings are the profile values saved with your transaction history.

## Profile settings

The Settings menu lets you view or update your birth year and FHSA opening date. The birth year determines TFSA eligibility; the FHSA opening date determines when FHSA room starts accruing.

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| Birth year | integer | Set during first run | Year used to calculate the first eligible TFSA contribution year |
| FHSA opening date | ISO date or unset | Set during first run | Date the FHSA was opened; room accrues from its year |

## Data file

The profile and transactions are stored as JSON at `~/.cra-cli/data.json` on macOS and Linux, or `C:\Users\<username>\.cra-cli\data.json` on Windows. There are no precedence rules: the CLI reads this file directly and saves changes locally.

A complete working invocation is:

```bash
cra-cli
```

The first run prompts for the profile values. Later runs load the saved file and show the main menu.

{{ support() }}
