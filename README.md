# GitHub Renovate

Self-hosted instance of Renovate to update GitHub Actions workflows.

Forked from [vidavidorra/github-renovate](https://github.com/vidavidorra/github-renovate).

## Description

This repository is running a self-hosted [Renovate](https://renovate.whitesourcesoftware.com/), which is keeping the GitHub Actions workflows up to date in a bunch of repositories in the [vidavidorra](https://github.com/vidavidorra) organisation. For this, it uses the [github-actions-renovate](https://github.com/vidavidorra/github-action-renovate) action. The [workflow](./.github/workflows/renovate.yml) for this is running on a schedule, to run e.g. every fifteen minutes. It is a little bit less responsive, especially when rebasing a PR, then e.g. using the GitHub Renovate App since this is bound to a schedule. Still, this works wonderful! See the [workflow](./.github/workflows/renovate.yml) and [configuration](./src/config.js) file for details on how this is set up.
