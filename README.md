# GitHub Renovate

[![Build Status](https://drone.kilic.dev/api/badges/cenk1cenk2/renovate/status.svg)](https://drone.kilic.dev/cenk1cenk2/renovate) ![lint](https://github.com/cenk1cenk2/renovate/workflows/lint/badge.svg) ![renovate](https://github.com/cenk1cenk2/renovate/workflows/renovate/badge.svg) [![Version](https://img.shields.io/npm/v/@cenk1cenk2/renovate-config.svg)](https://npmjs.org/package/@cenk1cenk2/renovate-config) [![Downloads/week](https://img.shields.io/npm/dw/@cenk1cenk2/renovate-config.svg)](https://npmjs.org/package/@cenk1cenk2/renovate-config) [![Dependencies](https://img.shields.io/librariesio/release/npm/@cenk1cenk2/renovate-config)](https://npmjs.org/package/@cenk1cenk2/renovate-config) [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

Forked from [vidavidorra/github-renovate](https://github.com/vidavidorra/github-renovate) + [ScaleLeap/renovate-config](https://github.com/ScaleLeap/renovate-config).

<!-- toc -->

- [Description](#description)

<!-- tocstop -->

## Description

Self-hosted instance of Renovate to update GitHub Actions workflows.

This repository is running a self-hosted [Renovate](https://renovate.whitesourcesoftware.com/), which is keeping the GitHub Actions workflows up to date in a bunch of repositories in the [vidavidorra](https://github.com/vidavidorra) organisation. For this, it uses the [github-actions-renovate](https://github.com/vidavidorra/github-action-renovate) action. The [workflow](./.github/workflows/renovate.yml) for this is running on a schedule, to run e.g. every fifteen minutes. It is a little bit less responsive, especially when rebasing a PR, then e.g. using the GitHub Renovate App since this is bound to a schedule. Still, this works wonderful! See the [workflow](./.github/workflows/renovate.yml) and [configuration](./src/config.js) file for details on how this is set up.
