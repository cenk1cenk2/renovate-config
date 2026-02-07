import type { PackageRule } from 'renovate/dist/config/types.js'

import { Managers } from '@constants'

export const NODE_GROUP_MINOR: PackageRule = {
  matchDepTypes: ['dependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  labels: ['renovate', 'minor', 'automerge'],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_DEV: PackageRule = {
  matchDepTypes: ['devDependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  commitMessageSuffix: '[skip ci]',
  labels: ['renovate', 'dev-deps', 'automerge'],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_BUILD: PackageRule = {
  matchDepTypes: ['devDependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  semanticCommitType: 'build',
  commitMessageSuffix: '',
  labels: ['renovate', 'build-deps', 'automerge'],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_DOCS: PackageRule = {
  matchDepTypes: ['devDependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  semanticCommitType: 'docs',
  commitMessageSuffix: '',
  labels: ['renovate', 'build-deps', 'automerge'],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_PEER: PackageRule = {
  matchDepTypes: ['peerDependencies', 'optionalDependencies'],
  rangeStrategy: 'widen',
  commitMessageSuffix: '[skip ci]',
  labels: ['renovate', 'peer-deps', 'automerge'],
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
  labels: ['renovate', 'engines', 'automerge'],
  commitMessageSuffix: '[skip ci]',
  automerge: true
}
