// A `*_AUTOMERGE` slug belongs to the parameterized `*-automerge-*` preset a consuming repository
// extends once per package, and is deliberately separate from the central group's slug: a grouped
// branch automerges only when every upgrade on it does
// (`dist/workers/repository/updates/generate.js`), so an opt-in sharing a catch-all's branch would
// never merge itself. The docker slugs are the exception, because the only central rule left on
// `docker-minor` automerges too. See the automerge policy in CLAUDE.md.
//
// There are no node or go slugs for the opt-in presets. Those managers already group by dep type and by
// ring, and `groupSlug` is last-match-wins, so an opt-in that named a group would pull the package out of
// the merge request it belongs to. Their presets flip `automerge` and leave grouping alone.
export enum Groups {
  ARGOCD_MINOR = 'argocd-minor',
  ARGOCD_MINOR_AUTOMERGE = 'argocd-minor-automerge',
  ARGOCD_MAJOR = 'argocd-major',
  ARGOCD_MAJOR_AUTOMERGE = 'argocd-major-automerge',

  HELM_MINOR = 'helm-minor',
  HELM_MINOR_AUTOMERGE = 'helm-minor-automerge',
  HELM_MAJOR = 'helm-major',
  HELM_MAJOR_AUTOMERGE = 'helm-major-automerge',

  KUSTOMIZE_MINOR = 'kustomize-minor',
  KUSTOMIZE_MINOR_AUTOMERGE = 'kustomize-minor-automerge',
  KUSTOMIZE_MAJOR = 'kustomize-major',
  KUSTOMIZE_MAJOR_AUTOMERGE = 'kustomize-major-automerge',

  TERRAFORM_MINOR = 'terraform-minor',
  TERRAFORM_MINOR_AUTOMERGE = 'terraform-minor-automerge',
  TERRAFORM_MAJOR = 'terraform-major',
  TERRAFORM_MAJOR_AUTOMERGE = 'terraform-major-automerge',
  TERRAFORM_MONOREPO_MINOR = 'terraform-monorepo-minor',
  TERRAFORM_MONOREPO_MINOR_AUTOMERGE = 'terraform-monorepo-minor-automerge',
  TERRAFORM_MONOREPO_MAJOR = 'terraform-monorepo-major',
  TERRAFORM_MONOREPO_MAJOR_AUTOMERGE = 'terraform-monorepo-major-automerge',

  NODE_MINOR = 'node-minor',
  NODE_DEV = 'node-dev',
  NODE_BUILD = 'node-build',
  NODE_DOCS = 'node-docs',
  NODE_PEER = 'node-peer',
  NODE_PACKAGE_MANAGER = 'node-package-manager',

  GO_MINOR = 'go-minor',

  GITLAB_CI_MINOR = 'gitlab-ci-minor',
  GITLAB_CI_MINOR_AUTOMERGE = 'gitlab-ci-minor-automerge',
  GITLAB_CI_MAJOR = 'gitlab-ci-major',

  ANSIBLE_GALAXY_MINOR = 'ansible-galaxy-minor',
  ANSIBLE_GALAXY_MINOR_AUTOMERGE = 'ansible-galaxy-minor-automerge',
  ANSIBLE_GALAXY_MAJOR = 'ansible-galaxy-major',

  KUBERNETES_MINOR_AUTOMERGE = 'kubernetes-minor-automerge',
  KUBERNETES_MAJOR_AUTOMERGE = 'kubernetes-major-automerge',

  DOCKERFILE_MINOR_AUTOMERGE = 'dockerfile-minor-automerge',
  DOCKERFILE_MAJOR_AUTOMERGE = 'dockerfile-major-automerge',

  PYTHON_MINOR_AUTOMERGE = 'python-minor-automerge',
  PYTHON_MAJOR_AUTOMERGE = 'python-major-automerge',

  RUST_MINOR_AUTOMERGE = 'rust-minor-automerge',
  RUST_MAJOR_AUTOMERGE = 'rust-major-automerge',

  OTEL_BUILDER_MINOR = 'otel-builder-minor',
  OTEL_BUILDER_MINOR_AUTOMERGE = 'otel-builder-minor-automerge',
  OTEL_BUILDER_MAJOR = 'otel-builder-major',

  DOCKER_MINOR = 'docker-minor',
  DOCKER_MAJOR = 'docker-major'
}
