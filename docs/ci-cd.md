# CI/CD

GitHub Actions builds and tests on pushes and pull requests, and publishes the npm package when a GitHub release is published.

## Workflows

<div class="wt-reference" markdown>

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `ci.yml` | Push and pull request to any branch | Installs dependencies, builds, and runs Vitest on Node 20 and 22 |
| `release.yml` | Published GitHub release | Builds, tests, and publishes to npm with provenance |
| `docs.yml` | Push to `main` or `master` affecting docs, or manual dispatch | Builds and deploys the MkDocs site |
| `docs-lint.yml` | Pull request affecting docs or config | Runs the shared docs lint and strict build |

</div>

## Release process

Publishing a GitHub release triggers `release.yml`. The workflow installs dependencies, builds, runs the test suite, then publishes the package to npm using the `NPM_TOKEN` repository secret.

{{ support() }}
