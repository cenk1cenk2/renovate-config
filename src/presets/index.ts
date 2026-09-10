import type { RenovateConfig } from 'renovate/dist/config/types.js'

export type Presets = Record<Preset, Promise<RenovateConfig>>

export enum Preset {
  // real presets (no prefix)
  DEFAULT = 'default',
  BASE = 'base',
  LOCK_FILE = 'lock-file',
  NO_TESTS = 'no-tests',

  // branches
  BRANCH_DEVELOP = 'branch-develop',
  BRANCH_BETA = 'branch-beta',

  // managers
  MANAGER_NODE = 'manager-node',
  MANAGER_GO = 'manager-go',
  MANAGER_PYTHON = 'manager-python',
  MANAGER_RUST = 'manager-rust',
  MANAGER_KUBERNETES = 'manager-kubernetes',
  MANAGER_KUSTOMIZE = 'manager-kustomize',
  MANAGER_HELM = 'manager-helm',
  MANAGER_TERRAFORM = 'manager-terraform',
  MANAGER_TERRAFORM_CUSTOM = 'manager-terraform-custom',
  MANAGER_ANSIBLE_GALAXY = 'manager-ansible-galaxy',
  MANAGER_DOCKERFILE = 'manager-dockerfile',
  MANAGER_GITLAB_CI = 'manager-gitlab-ci',
  MANAGER_GITLAB_CI_CUSTOM = 'manager-gitlab-ci-custom',
  MANAGER_OTEL_BUILDER = 'manager-otel-builder',
  MANAGER_ARGOCD = 'manager-argocd',

  // datasources
  DATASOURCE_DOCKER = 'datasource-docker',

  // groups
  GROUP_NODE_MINOR_DEPENDENCIES = 'group-node-minor-dependencies',
  GROUP_NODE_DEV_DEPENDENCIES = 'group-node-dev-dependencies',
  GROUP_NODE_PEER_DEPENDENCIES = 'group-node-peer-dependencies',
  GROUP_GO_MINOR_DEPENDENCIES = 'group-go-minor-dependencies',
  GROUP_KUSTOMIZE_MINOR_HELM_RELEASES = 'group-kustomize-minor-helm-releases',
  GROUP_KUSTOMIZE_MAJOR = 'group-kustomize-major',
  GROUP_HELM_MINOR = 'group-helm-minor',
  GROUP_HELM_MAJOR = 'group-helm-major',
  GROUP_TERRAFORM_MINOR_HELM_RELEASES = 'group-terraform-minor-helm-releases',
  GROUP_TERRAFORM_MINOR_MODULES = 'group-terraform-minor-modules',
  GROUP_TERRAFORM_MINOR_PROVIDERS = 'group-terraform-minor-providers',
  GROUP_TERRAFORM_MAJOR = 'group-terraform-major',
  GROUP_PYTHON_MINOR_DEPENDENCIES = 'group-python-minor-dependencies',
  GROUP_ANSIBLE_GALAXY_MINOR_ROLES = 'group-ansible-galaxy-minor-roles',
  GROUP_GITLAB_CI_MINOR_UPDATES = 'group-gitlab-ci-minor-updates',
  GROUP_ARGOCD_MINOR = 'group-argocd-minor',
  GROUP_ARGOCD_MAJOR = 'group-argocd-major',
  GROUP_BY_UNIT = 'group-by-unit',

  // rings
  RING_NODE_NONE = 'ring-node-none',
  RING_NODE_SLOW = 'ring-node-slow',
  RING_NODE_FAST = 'ring-node-fast',
  RING_GO_SLOW = 'ring-go-slow',
  RING_GO_FAST = 'ring-go-fast',

  // automerge — parameterized, opt-in per package. Nothing here is reachable from `default`; a
  // consuming repository extends one of these once per package, after `default`, so its `automerge: true`
  // lands after the group catch-all that says false. They are registered last for the same reason.
  MANAGER_HELM_AUTOMERGE_MINOR = 'manager-helm-automerge-minor',
  MANAGER_HELM_AUTOMERGE_MAJOR = 'manager-helm-automerge-major',
  MANAGER_KUSTOMIZE_AUTOMERGE_MINOR = 'manager-kustomize-automerge-minor',
  MANAGER_KUSTOMIZE_AUTOMERGE_MAJOR = 'manager-kustomize-automerge-major',
  MANAGER_ARGOCD_AUTOMERGE_MINOR = 'manager-argocd-automerge-minor',
  MANAGER_ARGOCD_AUTOMERGE_MAJOR = 'manager-argocd-automerge-major',
  MANAGER_OTEL_BUILDER_AUTOMERGE_MINOR = 'manager-otel-builder-automerge-minor',
  MANAGER_OTEL_BUILDER_AUTOMERGE_MAJOR = 'manager-otel-builder-automerge-major',
  MANAGER_TERRAFORM_AUTOMERGE_MINOR = 'manager-terraform-automerge-minor',
  MANAGER_TERRAFORM_AUTOMERGE_MAJOR = 'manager-terraform-automerge-major',
  MANAGER_TERRAFORM_CUSTOM_AUTOMERGE_MINOR = 'manager-terraform-custom-automerge-minor',
  MANAGER_TERRAFORM_CUSTOM_AUTOMERGE_MAJOR = 'manager-terraform-custom-automerge-major',
  MANAGER_NODE_AUTOMERGE_MINOR = 'manager-node-automerge-minor',
  MANAGER_NODE_AUTOMERGE_MAJOR = 'manager-node-automerge-major',
  MANAGER_GO_AUTOMERGE_MINOR = 'manager-go-automerge-minor',
  MANAGER_GO_AUTOMERGE_MAJOR = 'manager-go-automerge-major',
  MANAGER_PYTHON_AUTOMERGE_MINOR = 'manager-python-automerge-minor',
  MANAGER_PYTHON_AUTOMERGE_MAJOR = 'manager-python-automerge-major',
  MANAGER_RUST_AUTOMERGE_MINOR = 'manager-rust-automerge-minor',
  MANAGER_RUST_AUTOMERGE_MAJOR = 'manager-rust-automerge-major',
  MANAGER_KUBERNETES_AUTOMERGE_MINOR = 'manager-kubernetes-automerge-minor',
  MANAGER_KUBERNETES_AUTOMERGE_MAJOR = 'manager-kubernetes-automerge-major',
  MANAGER_DOCKERFILE_AUTOMERGE_MINOR = 'manager-dockerfile-automerge-minor',
  MANAGER_DOCKERFILE_AUTOMERGE_MAJOR = 'manager-dockerfile-automerge-major',
  MANAGER_ANSIBLE_GALAXY_AUTOMERGE_MINOR = 'manager-ansible-galaxy-automerge-minor',
  MANAGER_ANSIBLE_GALAXY_AUTOMERGE_MAJOR = 'manager-ansible-galaxy-automerge-major',
  MANAGER_GITLAB_CI_AUTOMERGE_MINOR = 'manager-gitlab-ci-automerge-minor',
  MANAGER_GITLAB_CI_AUTOMERGE_MAJOR = 'manager-gitlab-ci-automerge-major',
  MANAGER_GITLAB_CI_CUSTOM_AUTOMERGE_MINOR = 'manager-gitlab-ci-custom-automerge-minor',
  MANAGER_GITLAB_CI_CUSTOM_AUTOMERGE_MAJOR = 'manager-gitlab-ci-custom-automerge-major',
  DATASOURCE_DOCKER_AUTOMERGE_MINOR = 'datasource-docker-automerge-minor',
  DATASOURCE_DOCKER_AUTOMERGE_MAJOR = 'datasource-docker-automerge-major',

  // breaking marker — parameterized, opt-in per manager. A repository extends one of these once, after
  // `default`, to say whether a dependency major of that manager breaks its own contract. Nothing here is
  // reachable from `default`; they are registered last for the same reason the automerge presets are.
  MANAGER_HELM_BREAKING_MAJOR = 'manager-helm-breaking-major',
  MANAGER_HELM_NON_BREAKING_MAJOR = 'manager-helm-non-breaking-major',
  MANAGER_KUSTOMIZE_BREAKING_MAJOR = 'manager-kustomize-breaking-major',
  MANAGER_KUSTOMIZE_NON_BREAKING_MAJOR = 'manager-kustomize-non-breaking-major',
  MANAGER_ARGOCD_BREAKING_MAJOR = 'manager-argocd-breaking-major',
  MANAGER_ARGOCD_NON_BREAKING_MAJOR = 'manager-argocd-non-breaking-major',
  MANAGER_TERRAFORM_BREAKING_MAJOR = 'manager-terraform-breaking-major',
  MANAGER_TERRAFORM_NON_BREAKING_MAJOR = 'manager-terraform-non-breaking-major',
  MANAGER_TERRAFORM_CUSTOM_BREAKING_MAJOR = 'manager-terraform-custom-breaking-major',
  MANAGER_TERRAFORM_CUSTOM_NON_BREAKING_MAJOR = 'manager-terraform-custom-non-breaking-major',
  MANAGER_NODE_BREAKING_MAJOR = 'manager-node-breaking-major',
  MANAGER_NODE_NON_BREAKING_MAJOR = 'manager-node-non-breaking-major',
  MANAGER_GO_BREAKING_MAJOR = 'manager-go-breaking-major',
  MANAGER_GO_NON_BREAKING_MAJOR = 'manager-go-non-breaking-major',
  MANAGER_PYTHON_BREAKING_MAJOR = 'manager-python-breaking-major',
  MANAGER_PYTHON_NON_BREAKING_MAJOR = 'manager-python-non-breaking-major',
  MANAGER_RUST_BREAKING_MAJOR = 'manager-rust-breaking-major',
  MANAGER_RUST_NON_BREAKING_MAJOR = 'manager-rust-non-breaking-major',
  MANAGER_KUBERNETES_BREAKING_MAJOR = 'manager-kubernetes-breaking-major',
  MANAGER_KUBERNETES_NON_BREAKING_MAJOR = 'manager-kubernetes-non-breaking-major',
  MANAGER_DOCKERFILE_BREAKING_MAJOR = 'manager-dockerfile-breaking-major',
  MANAGER_DOCKERFILE_NON_BREAKING_MAJOR = 'manager-dockerfile-non-breaking-major',
  MANAGER_ANSIBLE_GALAXY_BREAKING_MAJOR = 'manager-ansible-galaxy-breaking-major',
  MANAGER_ANSIBLE_GALAXY_NON_BREAKING_MAJOR = 'manager-ansible-galaxy-non-breaking-major',
  MANAGER_GITLAB_CI_BREAKING_MAJOR = 'manager-gitlab-ci-breaking-major',
  MANAGER_GITLAB_CI_NON_BREAKING_MAJOR = 'manager-gitlab-ci-non-breaking-major',
  MANAGER_GITLAB_CI_CUSTOM_BREAKING_MAJOR = 'manager-gitlab-ci-custom-breaking-major',
  MANAGER_GITLAB_CI_CUSTOM_NON_BREAKING_MAJOR = 'manager-gitlab-ci-custom-non-breaking-major',
  MANAGER_OTEL_BUILDER_BREAKING_MAJOR = 'manager-otel-builder-breaking-major',
  MANAGER_OTEL_BUILDER_NON_BREAKING_MAJOR = 'manager-otel-builder-non-breaking-major',
  DATASOURCE_DOCKER_BREAKING_MAJOR = 'datasource-docker-breaking-major',
  DATASOURCE_DOCKER_NON_BREAKING_MAJOR = 'datasource-docker-non-breaking-major'
}

export const PRESETS: Presets = {
  [Preset.DEFAULT]: import('./default.js').then((m) => m.default),

  [Preset.BASE]: import('./base.js').then((m) => m.default),
  [Preset.LOCK_FILE]: import('./lock-file.js').then((m) => m.default),
  [Preset.NO_TESTS]: import('./no-tests.js').then((m) => m.default),

  // branches

  [Preset.BRANCH_DEVELOP]: import('./branches/develop.js').then((m) => m.default),
  [Preset.BRANCH_BETA]: import('./branches/beta.js').then((m) => m.default),

  // managers

  [Preset.MANAGER_NODE]: import('./managers/node/manager.js').then((m) => m.default),
  [Preset.MANAGER_GO]: import('./managers/go/manager.js').then((m) => m.default),
  [Preset.MANAGER_PYTHON]: import('./managers/python-pep621/manager.js').then((m) => m.default),
  [Preset.MANAGER_RUST]: import('./managers/rust-cargo/manager.js').then((m) => m.default),
  [Preset.MANAGER_KUBERNETES]: import('./managers/kubernetes/manager.js').then((m) => m.default),
  [Preset.MANAGER_KUSTOMIZE]: import('./managers/kustomize/manager.js').then((m) => m.default),
  [Preset.MANAGER_HELM]: import('./managers/helm/manager.js').then((m) => m.default),
  [Preset.MANAGER_TERRAFORM]: import('./managers/terraform/manager.js').then((m) => m.default),
  [Preset.MANAGER_TERRAFORM_CUSTOM]: import('./managers/terraform/custom-manager.js').then((m) => m.default),
  [Preset.MANAGER_ANSIBLE_GALAXY]: import('./managers/ansible-galaxy/manager.js').then((m) => m.default),
  [Preset.MANAGER_DOCKERFILE]: import('./managers/dockerfile/manager.js').then((m) => m.default),
  [Preset.MANAGER_GITLAB_CI]: import('./managers/gitlab-ci/manager.js').then((m) => m.default),
  [Preset.MANAGER_GITLAB_CI_CUSTOM]: import('./managers/gitlab-ci/custom-manager.js').then((m) => m.default),
  [Preset.MANAGER_OTEL_BUILDER]: import('./managers/otel-builder/manager.js').then((m) => m.default),
  [Preset.MANAGER_ARGOCD]: import('./managers/argocd/manager.js').then((m) => m.default),

  // datasources

  [Preset.DATASOURCE_DOCKER]: import('./datasources/docker/datasource.js').then((m) => m.default),

  // groups

  [Preset.GROUP_NODE_MINOR_DEPENDENCIES]: import('./groups/node/minor-dependencies.js').then((m) => m.default),
  [Preset.GROUP_NODE_DEV_DEPENDENCIES]: import('./groups/node/dev-dependencies.js').then((m) => m.default),
  [Preset.GROUP_NODE_PEER_DEPENDENCIES]: import('./groups/node/peer-dependencies.js').then((m) => m.default),
  [Preset.GROUP_GO_MINOR_DEPENDENCIES]: import('./groups/go/minor-dependencies.js').then((m) => m.default),
  [Preset.GROUP_KUSTOMIZE_MINOR_HELM_RELEASES]: import('./groups/kustomize/minor-helm-releases.js').then((m) => m.default),
  [Preset.GROUP_KUSTOMIZE_MAJOR]: import('./groups/kustomize/major.js').then((m) => m.default),
  [Preset.GROUP_HELM_MINOR]: import('./groups/helm/minor.js').then((m) => m.default),
  [Preset.GROUP_HELM_MAJOR]: import('./groups/helm/major.js').then((m) => m.default),
  [Preset.GROUP_TERRAFORM_MINOR_HELM_RELEASES]: import('./groups/terraform/minor-helm-releases.js').then((m) => m.default),
  [Preset.GROUP_TERRAFORM_MINOR_MODULES]: import('./groups/terraform/minor-modules.js').then((m) => m.default),
  [Preset.GROUP_TERRAFORM_MINOR_PROVIDERS]: import('./groups/terraform/minor-providers.js').then((m) => m.default),
  [Preset.GROUP_TERRAFORM_MAJOR]: import('./groups/terraform/major.js').then((m) => m.default),
  [Preset.GROUP_PYTHON_MINOR_DEPENDENCIES]: import('./groups/python/minor-dependencies.js').then((m) => m.default),
  [Preset.GROUP_ANSIBLE_GALAXY_MINOR_ROLES]: import('./groups/ansible-galaxy/minor-roles.js').then((m) => m.default),
  [Preset.GROUP_GITLAB_CI_MINOR_UPDATES]: import('./groups/gitlab-ci/minor-updates.js').then((m) => m.default),
  [Preset.GROUP_ARGOCD_MINOR]: import('./groups/argocd/minor.js').then((m) => m.default),
  [Preset.GROUP_ARGOCD_MAJOR]: import('./groups/argocd/major.js').then((m) => m.default),
  [Preset.GROUP_BY_UNIT]: import('./groups/by-unit.js').then((m) => m.default),

  // rings

  [Preset.RING_NODE_NONE]: import('./rings/node/none.js').then((m) => m.default),
  [Preset.RING_NODE_SLOW]: import('./rings/node/slow.js').then((m) => m.default),
  [Preset.RING_NODE_FAST]: import('./rings/node/fast.js').then((m) => m.default),
  [Preset.RING_GO_SLOW]: import('./rings/go/slow.js').then((m) => m.default),
  [Preset.RING_GO_FAST]: import('./rings/go/fast.js').then((m) => m.default),

  // automerge

  [Preset.MANAGER_HELM_AUTOMERGE_MINOR]: import('./managers/helm/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_HELM_AUTOMERGE_MAJOR]: import('./managers/helm/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_KUSTOMIZE_AUTOMERGE_MINOR]: import('./managers/kustomize/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_KUSTOMIZE_AUTOMERGE_MAJOR]: import('./managers/kustomize/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_ARGOCD_AUTOMERGE_MINOR]: import('./managers/argocd/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_ARGOCD_AUTOMERGE_MAJOR]: import('./managers/argocd/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_OTEL_BUILDER_AUTOMERGE_MINOR]: import('./managers/otel-builder/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_OTEL_BUILDER_AUTOMERGE_MAJOR]: import('./managers/otel-builder/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_TERRAFORM_AUTOMERGE_MINOR]: import('./managers/terraform/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_TERRAFORM_AUTOMERGE_MAJOR]: import('./managers/terraform/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_TERRAFORM_CUSTOM_AUTOMERGE_MINOR]: import('./managers/terraform/custom-automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_TERRAFORM_CUSTOM_AUTOMERGE_MAJOR]: import('./managers/terraform/custom-automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_NODE_AUTOMERGE_MINOR]: import('./managers/node/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_NODE_AUTOMERGE_MAJOR]: import('./managers/node/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_GO_AUTOMERGE_MINOR]: import('./managers/go/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_GO_AUTOMERGE_MAJOR]: import('./managers/go/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_PYTHON_AUTOMERGE_MINOR]: import('./managers/python-pep621/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_PYTHON_AUTOMERGE_MAJOR]: import('./managers/python-pep621/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_RUST_AUTOMERGE_MINOR]: import('./managers/rust-cargo/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_RUST_AUTOMERGE_MAJOR]: import('./managers/rust-cargo/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_KUBERNETES_AUTOMERGE_MINOR]: import('./managers/kubernetes/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_KUBERNETES_AUTOMERGE_MAJOR]: import('./managers/kubernetes/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_DOCKERFILE_AUTOMERGE_MINOR]: import('./managers/dockerfile/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_DOCKERFILE_AUTOMERGE_MAJOR]: import('./managers/dockerfile/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_ANSIBLE_GALAXY_AUTOMERGE_MINOR]: import('./managers/ansible-galaxy/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_ANSIBLE_GALAXY_AUTOMERGE_MAJOR]: import('./managers/ansible-galaxy/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_GITLAB_CI_AUTOMERGE_MINOR]: import('./managers/gitlab-ci/automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_GITLAB_CI_AUTOMERGE_MAJOR]: import('./managers/gitlab-ci/automerge-major.js').then((m) => m.default),
  [Preset.MANAGER_GITLAB_CI_CUSTOM_AUTOMERGE_MINOR]: import('./managers/gitlab-ci/custom-automerge-minor.js').then((m) => m.default),
  [Preset.MANAGER_GITLAB_CI_CUSTOM_AUTOMERGE_MAJOR]: import('./managers/gitlab-ci/custom-automerge-major.js').then((m) => m.default),
  [Preset.DATASOURCE_DOCKER_AUTOMERGE_MINOR]: import('./datasources/docker/automerge-minor.js').then((m) => m.default),
  [Preset.DATASOURCE_DOCKER_AUTOMERGE_MAJOR]: import('./datasources/docker/automerge-major.js').then((m) => m.default),

  // breaking marker

  [Preset.MANAGER_HELM_BREAKING_MAJOR]: import('./managers/helm/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_HELM_NON_BREAKING_MAJOR]: import('./managers/helm/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_KUSTOMIZE_BREAKING_MAJOR]: import('./managers/kustomize/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_KUSTOMIZE_NON_BREAKING_MAJOR]: import('./managers/kustomize/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_ARGOCD_BREAKING_MAJOR]: import('./managers/argocd/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_ARGOCD_NON_BREAKING_MAJOR]: import('./managers/argocd/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_TERRAFORM_BREAKING_MAJOR]: import('./managers/terraform/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_TERRAFORM_NON_BREAKING_MAJOR]: import('./managers/terraform/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_TERRAFORM_CUSTOM_BREAKING_MAJOR]: import('./managers/terraform/custom-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_TERRAFORM_CUSTOM_NON_BREAKING_MAJOR]: import('./managers/terraform/custom-non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_NODE_BREAKING_MAJOR]: import('./managers/node/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_NODE_NON_BREAKING_MAJOR]: import('./managers/node/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_GO_BREAKING_MAJOR]: import('./managers/go/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_GO_NON_BREAKING_MAJOR]: import('./managers/go/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_PYTHON_BREAKING_MAJOR]: import('./managers/python-pep621/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_PYTHON_NON_BREAKING_MAJOR]: import('./managers/python-pep621/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_RUST_BREAKING_MAJOR]: import('./managers/rust-cargo/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_RUST_NON_BREAKING_MAJOR]: import('./managers/rust-cargo/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_KUBERNETES_BREAKING_MAJOR]: import('./managers/kubernetes/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_KUBERNETES_NON_BREAKING_MAJOR]: import('./managers/kubernetes/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_DOCKERFILE_BREAKING_MAJOR]: import('./managers/dockerfile/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_DOCKERFILE_NON_BREAKING_MAJOR]: import('./managers/dockerfile/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_ANSIBLE_GALAXY_BREAKING_MAJOR]: import('./managers/ansible-galaxy/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_ANSIBLE_GALAXY_NON_BREAKING_MAJOR]: import('./managers/ansible-galaxy/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_GITLAB_CI_BREAKING_MAJOR]: import('./managers/gitlab-ci/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_GITLAB_CI_NON_BREAKING_MAJOR]: import('./managers/gitlab-ci/non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_GITLAB_CI_CUSTOM_BREAKING_MAJOR]: import('./managers/gitlab-ci/custom-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_GITLAB_CI_CUSTOM_NON_BREAKING_MAJOR]: import('./managers/gitlab-ci/custom-non-breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_OTEL_BUILDER_BREAKING_MAJOR]: import('./managers/otel-builder/breaking-major.js').then((m) => m.default),
  [Preset.MANAGER_OTEL_BUILDER_NON_BREAKING_MAJOR]: import('./managers/otel-builder/non-breaking-major.js').then((m) => m.default),
  [Preset.DATASOURCE_DOCKER_BREAKING_MAJOR]: import('./datasources/docker/breaking-major.js').then((m) => m.default),
  [Preset.DATASOURCE_DOCKER_NON_BREAKING_MAJOR]: import('./datasources/docker/non-breaking-major.js').then((m) => m.default)
}

export const FILES: Record<string, Preset[]> = {
  ['default.json']: Object.values(Preset)
}
