# Installation

<!-- markdownlint-disable MD046 -->

Install CRA CLI from npm or link a local source checkout onto your `PATH`.

## Requirements

| Requirement | Version | Notes |
| --- | --- | --- |
| Node.js | 20 or later | CI also builds on Node 22 |
| npm | Bundled with Node.js | Used to install and build the package |

## Install

=== "npm"

    ```bash
    npm install -g @willtheorangeguy/cra-cli
    cra-cli
    ```

=== "From source"

    ```bash
    git clone https://github.com/willtheorangeguy/cra-cli.git
    cd cra-cli
    npm install
    npm link
    ```

    `npm link` compiles TypeScript and makes the local `cra-cli` command available on your `PATH`.

## Verify the installation

Run the command and check that it opens the interactive setup or main menu:

```bash
cra-cli
```

## Upgrading

```bash
npm install -g @willtheorangeguy/cra-cli@latest
```

## Uninstalling

```bash
npm uninstall -g @willtheorangeguy/cra-cli
```

For a source checkout linked with `npm link`, run `npm unlink -g` in the checkout. This does not remove your data file at `~/.cra-cli/data.json` (or the equivalent home directory path on Windows).

{{ support() }}
