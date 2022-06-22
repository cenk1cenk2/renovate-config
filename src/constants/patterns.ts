import { RenovateConfig } from 'renovate/dist/config/types'

export const GROUP_MINOR: RenovateConfig = {
  matchDepTypes: [ 'dependencies', 'require' ],
  matchUpdateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
  rangeStrategy: 'bump',
  labels: [ 'renovate', 'minor', 'automerge' ],
  automerge: true
}

export const GROUP_DEV: RenovateConfig = {
  matchDepTypes: [ 'devDependencies' ],
  rangeStrategy: 'bump',
  commitMessageSuffix: '[skip ci]',
  labels: [ 'renovate', 'dev-deps', 'automerge' ],
  automerge: true
}

export const GROUP_PEER: RenovateConfig = {
  matchDepTypes: [ 'peerDependencies' ],
  rangeStrategy: 'widen',
  commitMessageSuffix: '[skip ci]',
  labels: [ 'renovate', 'peer-deps', 'automerge' ],
  automerge: true
}
