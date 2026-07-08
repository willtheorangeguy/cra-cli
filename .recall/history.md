# Recall History — cra-cli


## Session d89cf19a — 2026-07-08 11:30

**You:** I just tried to setup the CLI and got this erorr: "╔═══════════════════════════════════════════════╗
║          CRA CLI - Contribution Tracker       ║
║     Track your TFSA and FHSA contributions    ║
╚═══════════════════════════════════════════════╝


Welcome! Let's set up your profile.

✔ What year were you born? 2004
✔ Have you opened an FHSA (First Home Savings Account)? Yes
✔ When did you open your FHSA? (YYYY-MM-DD) 2026-01-01

✓ Profile setup complete!

An error occurred: UnknownPromptTypeError: Prompt type "list" is not registered. Available prompt types: checkbox, confirm, editor, expand, input, number, password, rawlist, search, select
    at PromptsRunner.prepareQuestion (file:///mnt/d/W/willtheorangeguy/cra-cli/node_modules/inquirer/dist/ui/prompt.js:156:19)
    at PromptsRunner.fetchAnswer (file:///mnt/d/W/willtheorangeguy/cra-cli/node_modules/inquirer/dist/ui/prompt.js:202:37)
    at PromptsRunner.run (file:///mnt/d/W/willtheorangeguy/cra-cli/node_modules/inquirer/dist/ui/prompt.js:118:47)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async showMainMenu (file:///mnt/d/W/willtheorangeguy/cra-cli/dist/cli/menus.js:30:24)
    at async runMainLoop (file:///mnt/d/W/willtheorangeguy/cra-cli/dist/cli/menus.js:333:28)"

**Claude:** The recent `inquirer` bump (13.4.1 → 14.0.2, commit 7835f8b) likely removed the `list` prompt type in favor of `select`. Let me check the source.
  - `Grep: type:\s*["']list["']`
  - `Grep: type:\s*["']list["']`

**Claude:** Confirmed — `inquirer` v14 dropped the `list` prompt type in favor of `select` (same API/behavior). All 6 occurrences need updating.
  - `Bash: grep -rn "type: 'list'" src/cli/prompts.ts src/cli/menus.ts`
  - `Grep: type:\s*["']list["']`

**Claude:** Now let's fix all 5, replacing `'list'` with `'select'`.
  - `Bash: cd "D:/W/willtheorangeguy/cra-cli" && sed -i "s/type: 'list',/type: 'select',/g" src/cli/prompts.ts src/cli/menus.ts && grep -rn "type: '" src/cli/prompts.ts sr`
  - `Read: D:\W\willtheorangeguy\cra-cli\src\cli\menus.ts`

**Claude:** These use standard `name`/`value` choice objects, which `select` supports identically to the old `list` type — no other changes needed. Let's build and quickly verify.
  - `Bash: cd "D:/W/willtheorangeguy/cra-cli" && npm run build 2>&1 | tail -50`
  - `PowerShell: npm run build 2>&1 | Select-Object -Last 60`
  - `PowerShell: npx tsc --noEmit 2>&1 | Select-Object -Last 60`
  - `PowerShell: Test-Path node_modules\.bin\tsc.cmd; Test-Path node_modules\typescript`
  - `PowerShell: Get-ChildItem node_modules\.bin | Select-Object -First 20; Write-Host "---"; Get-ChildItem node_modules\typescript\bin`

**Claude:** That's a broken symlink (repo was likely installed under WSL). Let's invoke the compiler directly via node.
  - `PowerShell: node node_modules\typescript\bin\tsc --noEmit 2>&1 | Select-Object -Last 60`

**Claude:** Type-check passes cleanly. Now let's build and do a quick smoke test of the CLI to confirm the menu renders correctly.
  - `PowerShell: node node_modules\typescript\bin\tsc 2>&1 | Select-Object -Last 60`
  - `Bash: cd "D:/W/willtheorangeguy/cra-cli" && grep -n "type: 'list'\|type: \"list\"" dist/cli/menus.js dist/cli/prompts.js 2>&1`

**Claude:** Good, the compiled `dist` output is updated and clean. Now let's smoke-test the CLI interactively to confirm the main menu renders.
  - `Bash: cd "D:/W/willtheorangeguy/cra-cli" && printf 'exit\n' | node dist/cli/index.js 2>&1 | head -60 || true`
  - `Glob: dist/**/*.js`
  - `Bash: cd "D:/W/willtheorangeguy/cra-cli" && printf 'exit\n' | node dist/index.js 2>&1 | head -60 || true`
  - `Grep: homedir|\.cra-cli|configDir|dataDir`
  - `Bash: cd "D:/W/willtheorangeguy/cra-cli" && printf '2000\nn\n\n' | timeout 10 node dist/index.js 2>&1 | head -80 || true`

**Claude:** The original error message itself confirms this: it listed `select` as an available prompt type, but not `list`. That's a direct root-cause match — `inquirer` v14 renamed/replaced `list` with `select`.

Let's also check if there are existing tests covering this to make sure nothing else references the old type.
  - `Grep: 'list'|"list"`

**Claude:** No remaining references. Let's also check for a CHANGELOG or existing test suite to run.
  - `Bash: cd "D:/W/willtheorangeguy/cra-cli" && cat package.json | grep -A5 '"scripts"'`
  - `PowerShell: node node_modules\vitest\vitest.mjs run 2>&1 | Select-Object -Last 80`

**Claude:** Fixed. The root cause: `inquirer` was bumped from 13.4.1 → 14.0.2 (commit 7835f8b), which removed the `list` prompt type — the error message itself confirms `select` is the registered replacement (same API, `name`/`value` choices work identically).

I updated all 5 occurrences of `type: 'list'` → `type: 'select'` in `src/cli/menus.ts` (4) and `src/cli/prompts.ts` (1), then rebuilt (`tsc`, no errors) and confirmed `dist/` no longer contains any `list` prompt type.

Note: I couldn't run `npm test` here — this repo's `node_modules` appears to have been installed under WSL (native `rolldown` binary is linux-only), so `vitest` fails on native bindings when run from native Windows PowerShell. That's a pre-existing environment mismatch unrelated to this fix; if you normally run the CLI from WSL, that's likely also where you should reinstall/test (`rm -rf node_modules && npm install`) if it acts up there too.

The menus should now work correctly — try running it again with `npm start` from the same environment it was set up in (WSL, per the original error paths).
