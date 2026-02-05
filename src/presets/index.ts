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

  // manager: python

  PYTHON = 'python',

  // manager: rust

  RUST = 'rust',

  // manager: kubernetes

  KUBERNETES = 'kubernetes',

  // manager: kubernetes

  KUSTOMIZE = 'kustomize',

  KUSTOMIZE_MINOR_HELM_RELEASES = 'kustomize-minor-helm-releases',
  KUSTOMIZE_MAJOR_HELM_RELEASES = 'kustomize-major-helm-releases',

  // manager: helm

  HELM = 'helm',

  HELM_GROUP_MINOR = 'helm-group-minor',
  HELM_GROUP_MAJOR = 'helm-group-major',

  // manager: terraform

  TERRAFORM = 'terraform',
  TERRAFORM_CUSTOM_MANAGER = 'terraform-custom-manager',

  TERRAFORM_MINOR_HELM_RELEASES = 'terraform-minor-helm-releases',
  TERRAFORM_GROUP_MINOR_MODULES = 'terraform-group-minor-modules',
  TERRAFORM_GROUP_MINOR_PROVIDERS = 'terraform-group-minor-providers',
  TERRAFORM_GROUP_MAJOR = 'terraform-group-major',

  // manager: ansible-galaxy

  ANSIBLE_GALAXY = 'ansible-galaxy',

  ANSIBLE_GALAXY_GROUP_MINOR_ROLES = 'ansible-galaxy-group-minor-roles',

  // manager: dockerfile

  DOCKERFILE = 'dockerfile',

  // manager: gitlab-ci

  GITLAB_CI = 'gitlab-ci',
  GITLAB_CI_CUSTOM_MANAGER = 'gitlab-ci-custom-manager',

  GITLAB_CI_MINOR_UPDATES = 'gitlab-ci-minor-updates',

  // manager: otel-builder

  OPENTELEMETRY_COLLECTOR_BUILDER = 'opentelemetry-collector-builder',

  // manager: argocd

  ARGOCD = 'argocd',

  ARGOCD_GROUP_MINOR = 'argocd-group-minor',
  ARGOCD_GROUP_MAJOR = 'argocd-group-major',

  // datasource: docker

  DATASOURCE_DOCKER = 'datasource-docker'
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

  // manager: node

  [Preset.NODE]: import('./managers/node/manager.js').then((m) => m.default),

  [Preset.NODE_NO_RING]: import('./managers/node/ring-none.js').then((m) => m.default),
  [Preset.NODE_SLOW_RING]: import('./managers/node/ring-slow.js').then((m) => m.default),
  [Preset.NODE_FAST_RING]: import('./managers/node/ring-fast.js').then((m) => m.default),
  [Preset.NODE_GROUP_DEV_DEPENDENCIES]: import('./managers/node/group-dev-dependencies.js').then((m) => m.default),
  [Preset.NODE_GROUP_MINOR_DEPENDENCIES]: import('./managers/node/group-minor-dependencies.js').then((m) => m.default),
  [Preset.NODE_GROUP_PEER_DEPENDENCIES]: import('./managers/node/group-peer-dependencies.js').then((m) => m.default),

  // manager: go

  [Preset.GO]: import('./managers/go/manager.js').then((m) => m.default),

  [Preset.GO_GROUP_MINOR_DEPENDENCIES]: import('./managers/go/group-minor-dependencies.js').then((m) => m.default),
  [Preset.GO_SLOW_RING_PACKAGES]: import('./managers/go/ring-slow.js').then((m) => m.default),
  [Preset.GO_FAST_RING_PACKAGES]: import('./managers/go/ring-fast.js').then((m) => m.default),

  // manager: python

  [Preset.PYTHON]: import('./managers/python-pep621/manager.js').then((m) => m.default),

  // manager: rust

  [Preset.RUST]: import('./managers/rust-cargo/manager.js').then((m) => m.default),

  // manager: kubernetes
  [Preset.KUBERNETES]: import('./managers/kubernetes/manager.js').then((m) => m.default),

  // manager: kubernetes

  [Preset.KUSTOMIZE]: import('./managers/kustomize/manager.js').then((m) => m.default),

  [Preset.KUSTOMIZE_MINOR_HELM_RELEASES]: import('./managers/kustomize/group-minor-helm-releases.js').then((m) => m.default),
  [Preset.KUSTOMIZE_MAJOR_HELM_RELEASES]: import('./managers/kustomize/group-major.js').then((m) => m.default),

  // manager: helm

  [Preset.HELM]: import('./managers/helm/manager.js').then((m) => m.default),
  [Preset.HELM_GROUP_MINOR]: import('./managers/helm/group-minor.js').then((m) => m.default),
  [Preset.HELM_GROUP_MAJOR]: import('./managers/helm/group-major.js').then((m) => m.default),

  // manager: terraform

  [Preset.TERRAFORM]: import('./managers/terraform/manager.js').then((m) => m.default),
  [Preset.TERRAFORM_CUSTOM_MANAGER]: import('./managers/terraform/custom-manager.js').then((m) => m.default),

  [Preset.TERRAFORM_MINOR_HELM_RELEASES]: import('./managers/terraform/group-minor-helm-releases.js').then((m) => m.default),
  [Preset.TERRAFORM_GROUP_MINOR_MODULES]: import('./managers/terraform/group-minor-modules.js').then((m) => m.default),
  [Preset.TERRAFORM_GROUP_MINOR_PROVIDERS]: import('./managers/terraform/group-minor-providers.js').then((m) => m.default),
  [Preset.TERRAFORM_GROUP_MAJOR]: import('./managers/terraform/group-major.js').then((m) => m.default),

  // manager: ansible-galaxy

  [Preset.ANSIBLE_GALAXY]: import('./managers/ansible-galaxy/manager.js').then((m) => m.default),

  [Preset.ANSIBLE_GALAXY_GROUP_MINOR_ROLES]: import('./managers/ansible-galaxy/group-minor-roles.js').then((m) => m.default),

  // manager: dockerfile

  [Preset.DOCKERFILE]: import('./managers/dockerfile/manager.js').then((m) => m.default),

  // manager: gitlab-ci

  [Preset.GITLAB_CI]: import('./managers/gitlab-ci/manager.js').then((m) => m.default),
  [Preset.GITLAB_CI_CUSTOM_MANAGER]: import('./managers/gitlab-ci/custom-manager.js').then((m) => m.default),

  [Preset.GITLAB_CI_MINOR_UPDATES]: import('./managers/gitlab-ci/group-minor-updates.js').then((m) => m.default),

  // manager: otel-builder

  [Preset.OPENTELEMETRY_COLLECTOR_BUILDER]: import('./managers/otel-builder/manager.js').then((m) => m.default),

  // manager: argocd

  [Preset.ARGOCD]: import('./managers/argocd/manager.js').then((m) => m.default),

  [Preset.ARGOCD_GROUP_MINOR]: import('./managers/argocd/group-minor.js').then((m) => m.default),
  [Preset.ARGOCD_GROUP_MAJOR]: import('./managers/argocd/group-major.js').then((m) => m.default),

  // datasource: docker

  [Preset.DATASOURCE_DOCKER]: import('./datasources/docker/datasource.js').then((m) => m.default)
}
