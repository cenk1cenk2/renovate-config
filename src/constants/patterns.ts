import { PackageRule } from 'renovate/dist/config/types.js'

import { Managers } from './managers.js'

export const NODE_GROUP_MINOR: PackageRule = {
  matchDepTypes: [ 'dependencies' ],
  matchUpdateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
  rangeStrategy: 'bump',
  labels: [ 'renovate', 'minor', 'automerge' ],
  automerge: true,
  matchManagers: [ Managers.NODE ]
}

export const NODE_GROUP_DEV: PackageRule = {
  matchDepTypes: [ 'devDependencies' ],
  matchUpdateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
  rangeStrategy: 'bump',
  commitMessageSuffix: '[skip ci]',
  labels: [ 'renovate', 'dev-deps', 'automerge' ],
  automerge: true,
  matchManagers: [ Managers.NODE ]
}

export const NODE_GROUP_BUILD: PackageRule = {
  matchDepTypes: [ 'devDependencies' ],
  matchUpdateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
  rangeStrategy: 'bump',
  semanticCommitType: 'build',
  commitMessageSuffix: '',
  labels: [ 'renovate', 'build-deps', 'automerge' ],
  automerge: true,
  matchManagers: [ Managers.NODE ]
}

export const NODE_GROUP_DOCS: PackageRule = {
  matchDepTypes: [ 'devDependencies' ],
  matchUpdateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
  rangeStrategy: 'bump',
  semanticCommitType: 'docs',
  commitMessageSuffix: '',
  labels: [ 'renovate', 'build-deps', 'automerge' ],
  automerge: true,
  matchManagers: [ Managers.NODE ]
}

export const NODE_GROUP_PEER: PackageRule = {
  matchDepTypes: [ 'peerDependencies', 'optionalDependencies' ],
  rangeStrategy: 'widen',
  commitMessageSuffix: '[skip ci]',
  labels: [ 'renovate', 'peer-deps', 'automerge' ],
  automerge: true,
  matchManagers: [ Managers.NODE ]
}

export const GO_GROUP_MINOR: PackageRule = {
  matchUpdateTypes: [ 'minor', 'patch', 'digest' ],
  labels: [ 'renovate', 'minor', 'automerge' ],
  automerge: true,
  matchManagers: [ Managers.GO ]
}
