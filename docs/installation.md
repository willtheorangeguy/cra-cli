# CRA CLI — Installation

## Requirements

Node.js 20 or higher. CI builds and tests against Node 20.x and 22.x, and the codebase
targets ES2022 with ES modules.

## From npm

```bash
npm install -g cra-cli
cra-cli
```

## From source

```bash
git clone https://github.com/willtheorangeguy/cra-cli.git
cd cra-cli
npm install
npm run build
npm link
```

`npm link` puts the local build on your `PATH` as `cra-cli`, so you can run your working
copy the same way you would the published package. `npm run build` compiles TypeScript
into `dist/`, which is gitignored — there is no committed build output, so this step is
required rather than optional.

## Verify

```bash
cra-cli
```

The first run prompts for your profile. Nothing is written until you answer.

## Next

[Usage](./usage.md), or [Contribution rules](./rules.md) for what the calculations do.
