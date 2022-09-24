import { PackageRule } from 'renovate/dist/config/types'

import { Managers } from './managers'

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
  rangeStrategy: 'bump',
  commitMessageSuffix: '[skip ci]',
  labels: [ 'renovate', 'dev-deps', 'automerge' ],
  automerge: true,
  matchManagers: [ Managers.NODE ]
}

export const NODE_GROUP_PEER: PackageRule = {
  matchDepTypes: [ 'peerDependencies' ],
  rangeStrategy: 'widen',
  commitMessageSuffix: '[skip ci]',
  labels: [ 'renovate', 'peer-deps', 'automerge' ],
  automerge: true,
  matchManagers: [ Managers.NODE ]
}

export const GO_GROUP_MINOR: PackageRule = {
  matchUpdateTypes: [ 'minor', 'patch' ],
  labels: [ 'renovate', 'minor', 'automerge' ],
  automerge: true,
  matchManagers: [ Managers.GO ]
}
