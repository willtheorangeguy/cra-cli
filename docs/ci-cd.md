# CI/CD

GitHub Actions builds and tests on pushes and pull requests, and publishes the npm and GitHub Packages versions when a GitHub release is published.

## Workflows

<div class="wt-reference" markdown>

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `ci.yml` | Push and pull request to any branch | Installs dependencies, builds, and runs Vitest on Node 20 and 22 |
| `release.yml` | Published GitHub release | Checks the tag against `package.json`, builds, tests, and publishes `@willtheorangeguy/cra-cli` to npm and GitHub Packages |
| `docs.yml` | Push to `main` or `master` affecting docs, or manual dispatch | Builds and deploys the MkDocs site |
| `docs-lint.yml` | Pull request affecting docs or config | Runs the shared docs lint and strict build |

</div>

## Release process

Publishing a GitHub release triggers `release.yml`. The workflow checks that the release tag matches the version in `package.json`, installs dependencies, builds, runs the test suite, then publishes the package to npm and GitHub Packages.

The first npm version must use the `NPM_TOKEN` repository secret because npm requires the package to exist before you can configure trusted publishing. After the first version is published, configure npm trusted publishing for this repository and `.github/workflows/release.yml`; later runs use that OpenID Connect connection when `NPM_TOKEN` is absent. GitHub Packages uses the workflow's `GITHUB_TOKEN`.

{{ support() }}
