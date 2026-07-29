import type { PackageRule } from 'renovate/dist/config/types.js'

import { Labels } from '@constants'
import { Managers } from '@managers'

export const NODE_GROUP_MINOR: PackageRule = {
  matchDepTypes: ['dependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  addLabels: [Labels.AUTOMERGE],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_DEV: PackageRule = {
  matchDepTypes: ['devDependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  commitMessageSuffix: '[skip ci]',
  addLabels: [Labels.DEP_DEV, Labels.AUTOMERGE],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_BUILD: PackageRule = {
  matchDepTypes: ['devDependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  semanticCommitType: 'build',
  commitMessageSuffix: '',
  addLabels: [Labels.DEP_BUILD, Labels.AUTOMERGE],
  automerge: true,
  matchManagers: [Managers.NODE]
}

export const NODE_GROUP_DOCS: PackageRule = {
  matchDepTypes: ['devDependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  semanticCommitType: 'docs',
  commitMessageSuffix: '',
  addLabels: [Labels.DEP_DOCS, Labels.AUTOMERGE],
  automerge: true,
  matchManagers: [Managers.NODE]
}

// renovate rejects a rule that sets both `matchUpdateTypes` and `rangeStrategy`, so the range strategy
// lives in its own rule — the same split the dependency and devDependency groups already use.
export const NODE_GROUP_PEER: PackageRule = {
  matchDepTypes: ['peerDependencies', 'optionalDependencies'],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  commitMessageSuffix: '[skip ci]',
  addLabels: [Labels.DEP_PEER, Labels.AUTOMERGE],
  automerge: true,
  matchManagers: [Managers.NODE]
}

// Deliberately unbounded by update type. A rule carrying `matchUpdateTypes` does not match at the
// pre-lookup stage, where `updateType` is still undefined and `rangeStrategy` is consumed — and it
// would leave major updates un-disabled.
export const NODE_RANGE_PEER: PackageRule = {
  matchManagers: [Managers.NODE],
  matchDepTypes: ['peerDependencies', 'optionalDependencies'],
  rangeStrategy: 'widen'
}

export const NODE_GROUP_ENGINES: PackageRule = {
  matchManagers: [Managers.NODE],
  matchDepTypes: ['engines']
}

export const PACKAGE_MANAGERS = ['pnpm', 'yarn', 'npm', 'bun']

export const NODE_BUILD_PACKAGES = [
  'typescript',
  'tsup',
  'tsdown',
  'prettier',
  'eslint',
  '@cenk1cenk2/eslint-config',
  '@swc/core',
  '@types/jest',
  'jest',
  'ts-jest',
  '/^eslint-plugin-/',
  '/^jest/'
]

export const NODE_DOCS_PACKAGES = ['typedoc', 'typedoc-plugin-markdown', '/^vitepress/', '/^markdown-it/']

// The dev group is the catch-all for devDependencies, so it has to exclude everything the more specific
// dep groups claim. `addLabels` accumulates and cannot be unset, so overlapping here would put two
// `dep:` values on one merge request permanently.
export const NODE_DEV_CLAIMED_PACKAGES = [...NODE_BUILD_PACKAGES, ...NODE_DOCS_PACKAGES, ...PACKAGE_MANAGERS]

export const NODE_DEV_PACKAGES = ['*', ...NODE_DEV_CLAIMED_PACKAGES.map((name) => `!${name}`)]

// Unbounded so a major bump still lands in the group; the automerge rule below re-enables merging for
// the non-breaking update types only.
export const NODE_GROUP_PACKAGE_MANAGER: PackageRule = {
  matchManagers: [Managers.NODE],
  matchDepNames: PACKAGE_MANAGERS,
  addLabels: [Labels.DEP_PACKAGE_MANAGER],
  commitMessageSuffix: '[skip ci]',
  automerge: false
}

export const NODE_AUTOMERGE_PACKAGE_MANAGER: PackageRule = {
  matchManagers: [Managers.NODE],
  matchDepNames: PACKAGE_MANAGERS,
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  addLabels: [Labels.AUTOMERGE],
  automerge: true
}

export const NODE_RANGE_PACKAGE_MANAGER: PackageRule = {
  matchManagers: [Managers.NODE],
  matchDepNames: PACKAGE_MANAGERS,
  rangeStrategy: 'widen'
}
