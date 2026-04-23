import type { PackageRule } from 'renovate/dist/config/types.js'

import { Labels } from '@constants'
import { Managers } from '@managers'

export const NODE_GROUP_MINOR: PackageRule = {
  matchDepTypes: ['dependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  labels: [Labels.RENOVATE, Labels.MINOR, Labels.AUTOMERGE],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_DEV: PackageRule = {
  matchDepTypes: ['devDependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  commitMessageSuffix: '[skip ci]',
  labels: [Labels.RENOVATE, Labels.DEV_DEPS, Labels.AUTOMERGE],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_BUILD: PackageRule = {
  matchDepTypes: ['devDependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  semanticCommitType: 'build',
  commitMessageSuffix: '',
  labels: [Labels.RENOVATE, Labels.BUILD_DEPS, Labels.AUTOMERGE],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_DOCS: PackageRule = {
  matchDepTypes: ['devDependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  semanticCommitType: 'docs',
  commitMessageSuffix: '',
  labels: [Labels.RENOVATE, Labels.BUILD_DEPS, Labels.AUTOMERGE],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_PEER: PackageRule = {
  matchDepTypes: ['peerDependencies', 'optionalDependencies'],
  rangeStrategy: 'widen',
  commitMessageSuffix: '[skip ci]',
  labels: [Labels.RENOVATE, Labels.PEER_DEPS, Labels.AUTOMERGE],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_ENGINES: PackageRule = {
  matchManagers: [Managers.NODE],
  matchDepTypes: ['engines']
}

export const NODE_GROUP_PACKAGE_MANAGER: PackageRule = {
  matchManagers: [Managers.NODE],
  rangeStrategy: 'widen',
  matchDepNames: ['pnpm', 'yarn', 'npm', 'bun'],
  labels: [Labels.RENOVATE, Labels.ENGINES, Labels.AUTOMERGE],
  commitMessageSuffix: '[skip ci]',
  automerge: true
}
