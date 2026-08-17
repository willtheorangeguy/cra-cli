# CRA CLI — Troubleshooting

## Contribution room looks too low

Work through these in order:

1. **Is your full history entered?** Room is derived from transactions, not stored. An
   empty history produces maximum room; a partial one produces a figure that is wrong in
   whichever direction the gap falls.
2. **Is the current year in the limits table?** `src/utils/constants.ts` currently defines
   TFSA limits only through 2025. A missing year contributes **zero, silently** — no error,
   no warning. This understates room for any later year. See [Roadmap](./roadmap.md).
3. **Is your birth year right?** Check under Settings. It sets when accrual began.

## Contribution room looks too high

Usually a missing contribution rather than a bug. Also check that you have not entered the
same contribution twice under different dates — the history view lists everything.

## A withdrawal did not increase my room

Expected, if it was this year. TFSA withdrawal room returns on 1 January of the **following**
year. Check the date on the transaction; entering the wrong one shifts that by a year.

## `cra-cli: command not found`

**Installed globally:** confirm the install and that npm's global bin is on your `PATH`.

**Running from source:** you probably skipped the build.

```bash
npm run build
npm link
```

`dist/` is gitignored, so there is no committed build output — `npm link` without a build
links nothing.

## Node version errors

Node 20 or higher. The codebase targets ES2022 with ES modules, and CI builds against 20.x
and 22.x. Older versions may fail on module resolution rather than with a clear message.

## I reset an account by mistake

There is no undo for reset. If you exported to CSV beforehand, re-enter from that;
otherwise the history is gone. Undo is single-step and applies to the last transaction
only.

## My data file disappeared

| Platform | Path |
|---|---|
| Windows | `C:\Users\<username>\.cra-cli\data.json` |
| macOS and Linux | `~/.cra-cli/data.json` |

Nothing can reconstruct it — there is no server copy. If the file exists but the tool does
not see it, check it is valid JSON; a hand edit that broke the syntax will prevent loading.

## The projection looks wrong

Projections assume the most recent **known** annual limit continues. Since limits are
indexed to inflation and announced yearly, and the table stops at 2025, projections inherit
that staleness. They also model no investment growth. See
[Contribution rules](./rules.md#what-this-tool-does-not-model).
