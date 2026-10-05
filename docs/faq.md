# FAQ

## Common questions

???+ question "Why is my contribution room lower than CRA My Account?"

    Check that you entered your full contribution history and set the correct birth year. The TFSA annual limits table currently ends at 2025, so later years add no room. The CRA figure may also lag contributions reported by financial institutions. Verify against [CRA My Account](https://www.canada.ca/en/revenue-agency/services/e-services/e-services-individuals/account-individuals.html).

??? question "Why does a TFSA withdrawal not restore room right away?"

    The tool adds withdrawal room on January 1 of the following year. A withdrawal made during this year does not increase the room available for another contribution this year.

??? question "Where does CRA CLI save my data?"

    It stores profile and transaction data in `.cra-cli/data.json` under your home directory. On macOS and Linux, that is `~/.cra-cli/data.json`; on Windows, it is under your user profile directory. The file is local JSON and is not uploaded by the CLI.

??? question "Why can’t I record an FHSA withdrawal?"

    The CLI records FHSA contributions only. FHSA withdrawals do not restore contribution room in its calculation model.

## Troubleshooting

### `cra-cli: command not found`

**Cause.** The global npm executable directory is not on your `PATH`, or the package has not been installed globally.

**Fix.** Install the package globally with `npm install -g @willtheorangeguy/cra-cli`, or link the source checkout.

{{ support() }}
