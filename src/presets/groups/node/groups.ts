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

export const NODE_GROUP_PACKAGE_MANAGER: PackageRule = {
  matchManagers: [Managers.NODE],
  matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
  matchDepNames: PACKAGE_MANAGERS,
  addLabels: [Labels.DEP_PACKAGE_MANAGER, Labels.AUTOMERGE],
  commitMessageSuffix: '[skip ci]',
  automerge: true
}

export const NODE_RANGE_PACKAGE_MANAGER: PackageRule = {
  matchManagers: [Managers.NODE],
  matchDepNames: PACKAGE_MANAGERS,
  rangeStrategy: 'widen'
}
