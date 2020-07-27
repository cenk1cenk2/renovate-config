import { RenovateConfig } from 'renovate/dist/config/common'

export const GROUP_MINOR: RenovateConfig = {
  depTypeList: [ 'dependencies' ],
  updateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
  rangeStrategy: 'bump',
  labels: [ 'renovate', 'minor', 'automerge' ],
  automerge: true
}

export const GROUP_DEV: RenovateConfig = {
  depTypeList: [ 'devDependencies' ],
  rangeStrategy: 'bump',
  commitMessageSuffix: '[skip ci]',
  labels: [ 'renovate', 'dev-deps', 'automerge' ],
  automerge: true
}

export const GROUP_PEER: RenovateConfig = {
  depTypeList: [ 'peerDependencies' ],
  rangeStrategy: 'widen',
  commitMessageSuffix: '[skip ci]',
  labels: [ 'renovate', 'peer-deps', 'automerge' ],
  automerge: true
}
