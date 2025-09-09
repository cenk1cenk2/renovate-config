import type { RenovateConfig } from 'renovate/dist/config/types.js'

export type Presets = Record<Preset, Promise<RenovateConfig>>

export enum Preset {
  DEFAULT = 'default',
  BASE = 'base',
  LOCK_FILE = 'lock-file',

  // tests

  NO_TESTS = 'no-tests',

  // branches
  BRANCH_DEVELOP = 'branch-develop',
  BRANCH_BETA = 'branch-beta',

  // manager: node

  NODE = 'node',

  NODE_NO_RING = 'node-no-ring',
  NODE_SLOW_RING = 'node-slow-ring',
  NODE_FAST_RING = 'node-fast-ring',
  NODE_GROUP_DEV_DEPENDENCIES = 'node-group-dev-dependencies',
  NODE_GROUP_MINOR_DEPENDENCIES = 'node-group-minor-dependencies',
  NODE_GROUP_PEER_DEPENDENCIES = 'node-group-peer-dependencies',

  // manager: go

  GO = 'go',

  GO_GROUP_MINOR_DEPENDENCIES = 'go-group-minor-dependencies',
  GO_SLOW_RING_PACKAGES = 'go-slow-ring-packages',
  GO_FAST_RING_PACKAGES = 'go-fast-ring-packages',

  // manager: kubernetes

  KUSTOMIZE = 'kustomize',

  KUSTOMIZE_MINOR_HELM_RELEASES = 'kustomize-minor-helm-releases',

  // manager: terraform

  TERRAFORM = 'terraform',

  TERRAFORM_MINOR_HELM_RELEASES = 'terraform-minor-helm-releases',
  TERRAFORM_GROUP_MINOR_MODULES = 'terraform-group-minor-modules',
  TERRAFORM_GROUP_MINOR_PROVIDERS = 'terraform-group-minor-providers'
}

export const PRESETS: Presets = {
  [Preset.DEFAULT]: import('./default.js').then((m) => m.default),

  // generic

  [Preset.BASE]: import('./base.js').then((m) => m.default),
  [Preset.LOCK_FILE]: import('./lock-file.js').then((m) => m.default),

  // branches

  [Preset.BRANCH_DEVELOP]: import('./branches/branch-develop.js').then((m) => m.default),
  [Preset.BRANCH_BETA]: import('./branches/branch-beta.js').then((m) => m.default),

  // tests

  [Preset.NO_TESTS]: import('./tests/no-tests.js').then((m) => m.default),

  // language: node

  [Preset.NODE]: import('./managers/node/manager.js').then((m) => m.default),

  [Preset.NODE_NO_RING]: import('./managers/node/ring-none.js').then((m) => m.default),
  [Preset.NODE_SLOW_RING]: import('./managers/node/ring-slow.js').then((m) => m.default),
  [Preset.NODE_FAST_RING]: import('./managers/node/ring-fast.js').then((m) => m.default),
  [Preset.NODE_GROUP_DEV_DEPENDENCIES]: import('./managers/node/group-dev-dependencies.js').then((m) => m.default),
  [Preset.NODE_GROUP_MINOR_DEPENDENCIES]: import('./managers/node/group-minor-dependencies.js').then((m) => m.default),
  [Preset.NODE_GROUP_PEER_DEPENDENCIES]: import('./managers/node/group-peer-dependencies.js').then((m) => m.default),

  // language: go

  [Preset.GO]: import('./managers/go/manager.js').then((m) => m.default),

  [Preset.GO_GROUP_MINOR_DEPENDENCIES]: import('./managers/go/group-minor-dependencies.js').then((m) => m.default),
  [Preset.GO_SLOW_RING_PACKAGES]: import('./managers/go/ring-slow.js').then((m) => m.default),
  [Preset.GO_FAST_RING_PACKAGES]: import('./managers/go/ring-fast.js').then((m) => m.default),

  // language: kubernetes

  [Preset.KUSTOMIZE]: import('./managers/kustomize/manager.js').then((m) => m.default),

  [Preset.KUSTOMIZE_MINOR_HELM_RELEASES]: import('./managers/kustomize/group-minor-helm-releases.js').then((m) => m.default),

  // language: terraform

  [Preset.TERRAFORM]: import('./managers/terraform/manager.js').then((m) => m.default),

  [Preset.TERRAFORM_MINOR_HELM_RELEASES]: import('./managers/terraform/group-minor-helm-releases.js').then((m) => m.default),
  [Preset.TERRAFORM_GROUP_MINOR_MODULES]: import('./managers/terraform/group-minor-modules.js').then((m) => m.default),
  [Preset.TERRAFORM_GROUP_MINOR_PROVIDERS]: import('./managers/terraform/group-minor-providers.js').then((m) => m.default)
}
