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
  TERRAFORM_MAJOR = 'terraform-major',
  TERRAFORM_MONOREPO_MINOR = 'terraform-monorepo-minor',
  TERRAFORM_MONOREPO_MAJOR = 'terraform-monorepo-major',

  NODE_MINOR = 'node-minor',
  NODE_DEV = 'node-dev',
  NODE_BUILD = 'node-build',
  NODE_DOCS = 'node-docs',
  NODE_PEER = 'node-peer',
  NODE_PACKAGE_MANAGER = 'node-package-manager',

  GO_MINOR = 'go-minor',

  GITLAB_CI_MINOR = 'gitlab-ci-minor',

  ANSIBLE_GALAXY_MINOR = 'ansible-galaxy-minor',

  OTEL_BUILDER_MINOR = 'otel-builder-minor',

  DOCKER_MINOR = 'docker-minor'
}
