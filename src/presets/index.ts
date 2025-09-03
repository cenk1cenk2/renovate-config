import type { RenovateConfig } from 'renovate/dist/config/types.js'

export type Presets = Record<Preset, Promise<RenovateConfig>>

export enum Preset {
  DEFAULT = 'default',
  BASE = 'base',
  LOCK_FILE = 'lock-file',
  NO_TESTS = 'no-tests',
  BRANCH_DEVELOP = 'branch-develop',
  BRANCH_BETA = 'branch-beta',

  // language: node

  NODE = 'node',

  NODE_NO_RING = 'node-no-ring',
  NODE_SLOW_RING = 'node-slow-ring',
  NODE_FAST_RING = 'node-fast-ring',
  NODE_GROUP_DEV_DEPENDENCIES = 'node-group-dev-dependencies',
  NODE_GROUP_MINOR_DEPENDENCIES = 'node-group-minor-dependencies',
  NODE_GROUP_PEER_DEPENDENCIES = 'node-group-peer-dependencies',

  // language: go

  GO = 'go',

  GO_GROUP_MINOR_DEPENDENCIES = 'go-group-minor-dependencies',
  GO_SLOW_RING_PACKAGES = 'go-slow-ring-packages',
  GO_FAST_RING_PACKAGES = 'go-fast-ring-packages',

  // language: kubernetes

  KUBERNETES = 'kubernetes',
  KUBERNETES_GROUP_MINOR_DEPENDENCIES = 'kubernetes-group-minor-dependencies'
}

export const PRESETS: Presets = {
  [Preset.DEFAULT]: import('./default.js').then((m) => m.default),

  // generic

  [Preset.BASE]: import('./base.js').then((m) => m.default),
  [Preset.LOCK_FILE]: import('./dependency-groups/lock-file.js').then((m) => m.default),

  // branches

  [Preset.BRANCH_DEVELOP]: import('./branches/branch-develop.js').then((m) => m.default),
  [Preset.BRANCH_BETA]: import('./branches/branch-beta.js').then((m) => m.default),

  // tests

  [Preset.NO_TESTS]: import('./tests/no-tests.js').then((m) => m.default),

  // language: node

  [Preset.NODE]: import('./language/node.js').then((m) => m.default),

  [Preset.NODE_NO_RING]: import('./rings/node/no-ring.js').then((m) => m.default),
  [Preset.NODE_SLOW_RING]: import('./rings/node/slow-ring.js').then((m) => m.default),
  [Preset.NODE_FAST_RING]: import('./rings/node/fast-ring.js').then((m) => m.default),
  [Preset.NODE_GROUP_DEV_DEPENDENCIES]: import('./dependency-groups/node/group-dev-dependencies.js').then((m) => m.default),
  [Preset.NODE_GROUP_MINOR_DEPENDENCIES]: import('./dependency-groups/node/group-minor-dependencies.js').then((m) => m.default),
  [Preset.NODE_GROUP_PEER_DEPENDENCIES]: import('./dependency-groups/node/group-peer-dependencies.js').then((m) => m.default),

  // language: go

  [Preset.GO]: import('./language/go.js').then((m) => m.default),

  [Preset.GO_GROUP_MINOR_DEPENDENCIES]: import('./dependency-groups/go/group-minor-dependencies.js').then((m) => m.default),
  [Preset.GO_SLOW_RING_PACKAGES]: import('./rings/go/slow-ring.js').then((m) => m.default),
  [Preset.GO_FAST_RING_PACKAGES]: import('./rings/go/fast-ring.js').then((m) => m.default),

  // language: kubernetes

  [Preset.KUBERNETES]: import('./language/kubernetes.js').then((m) => m.default),
  [Preset.KUBERNETES_GROUP_MINOR_DEPENDENCIES]: import('./dependency-groups/kubernetes/group-minor-dependencies.js').then((m) => m.default)
}
