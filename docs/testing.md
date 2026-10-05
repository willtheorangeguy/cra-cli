# Testing

CRA CLI tests its TFSA and FHSA calculations with Vitest.

## Test stack

| Tool | Purpose |
| --- | --- |
| Vitest | Runs the TFSA and FHSA service tests |
| TypeScript | Compiles the application in CI before tests run |

## Running the tests

```bash
npm test
```

Vitest runs the files matching `tests/*.test.ts`.

### A single test file

```bash
npx vitest run tests/tfsa.test.ts
```

## Test layout

```text
tests/
├── tfsa.test.ts
└── fhsa.test.ts
```

## Writing new tests

Add calculation tests to the matching account test file. The service functions accept profile and transaction data and return calculated values, so tests can exercise the rules without driving the prompt interface.

{{ support() }}
