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

export const NODE_GROUP_PEER: PackageRule = {
  matchDepTypes: ['peerDependencies', 'optionalDependencies'],
  rangeStrategy: 'widen',
  commitMessageSuffix: '[skip ci]',
  addLabels: [Labels.DEP_PEER, Labels.AUTOMERGE],
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
  addLabels: [Labels.DEP_PACKAGE_MANAGER, Labels.AUTOMERGE],
  commitMessageSuffix: '[skip ci]',
  automerge: true
}
