// Labels compose additively: every rule contributes its own axis through `addLabels`, and renovate
// unions them with the single `labels` declared in the base preset. `labels` overwrites where
// `addLabels` accumulates, so nothing outside the base preset may use `labels`.
export enum Labels {
  RENOVATE = 'renovate',
  AUTOMERGE = 'automerge',

  UPDATE_MINOR = 'update:minor',
  UPDATE_MAJOR = 'update:major',

  AREA_INFRASTRUCTURE = 'area:infrastructure',
  AREA_PIPELINES = 'area:pipelines',

  DEP_DEV = 'dep:dev',
  DEP_BUILD = 'dep:build',
  DEP_DOCS = 'dep:docs',
  DEP_PEER = 'dep:peer',
  DEP_ENGINES = 'dep:engines',
  DEP_LOCK = 'dep:lock',

  MANAGER_ANSIBLE_GALAXY = 'manager:ansible-galaxy',
  MANAGER_ARGOCD = 'manager:argocd',
  MANAGER_DOCKERFILE = 'manager:dockerfile',
  MANAGER_GITLAB_CI = 'manager:gitlab-ci',
  MANAGER_GO = 'manager:go',
  MANAGER_HELM = 'manager:helm',
  MANAGER_KUBERNETES = 'manager:kubernetes',
  MANAGER_KUSTOMIZE = 'manager:kustomize',
  MANAGER_NODE = 'manager:node',
  MANAGER_OTEL_BUILDER = 'manager:otel-builder',
  MANAGER_PYTHON = 'manager:python',
  MANAGER_RUST = 'manager:rust',
  MANAGER_TERRAFORM = 'manager:terraform',

  DATASOURCE_DOCKER = 'datasource:docker',

  RING_FAST = 'ring:fast',
  RING_SLOW = 'ring:slow'
}
