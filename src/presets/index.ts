import { RenovateConfig } from 'renovate/dist/config/types.js'

export type Presets = Record<Preset, Promise<RenovateConfig>>

export enum Preset {
  DEFAULT = 'default',
  BASE = 'base',
  LOCK_FILE = 'lock-file',
  NO_TESTS = 'no-tests',
  SLOW_RING = 'slow-ring',
  FAST_RING = 'fast-ring',
  GROUP_DEV_DEPENDENCIES = 'group-dev-dependencies',
  GROUP_MINOR_DEPENDENCIES = 'group-minor-dependencies',
  GROUP_PEER_DEPENDENCIES = 'group-peer-dependencies',
  BRANCH_DEVELOP = 'branch-develop',
  BRANCH_BETA = 'branch-beta'
}

export const PRESETS: Presets = {
  [Preset.DEFAULT]: import('./default.js').then((m) => m.default),
  [Preset.BASE]: import('./base.js').then((m) => m.default),
  [Preset.LOCK_FILE]: import('./dependency-groups/lock-file.js').then((m) => m.default),
  [Preset.NO_TESTS]: import('./no-tests.js').then((m) => m.default),
  [Preset.SLOW_RING]: import('./rings/slow-ring.js').then((m) => m.default),
  [Preset.FAST_RING]: import('./rings/fast-ring.js').then((m) => m.default),
  [Preset.GROUP_DEV_DEPENDENCIES]: import('./dependency-groups/group-dev-dependencies.js').then((m) => m.default),
  [Preset.GROUP_MINOR_DEPENDENCIES]: import('./dependency-groups/group-minor-dependencies.js').then((m) => m.default),
  [Preset.GROUP_PEER_DEPENDENCIES]: import('./dependency-groups/group-peer-dependencies.js').then((m) => m.default),
  [Preset.BRANCH_DEVELOP]: import('./branches/branch-develop.js').then((m) => m.default),
  [Preset.BRANCH_BETA]: import('./branches/branch-beta.js').then((m) => m.default)
}
