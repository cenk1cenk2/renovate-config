import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'kustomize',
      updateType: 'minor',
      slug: Groups.KUSTOMIZE_MINOR,
      managers: [Managers.KUSTOMIZE],
      depTypes: ['HelmChart']
    }),
    createMultiDirectoryGroupRule({
      name: 'kustomize',
      updateType: 'minor',
      slug: Groups.KUSTOMIZE_MINOR_AUTOMERGE,
      managers: [Managers.KUSTOMIZE],
      automerge: true,
      depTypes: ['HelmChart'],
      sourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/grafana/helm-charts', 'https://gitlab.com/gitlab-org/charts/gitlab-runner'],
      packageNames: ['prometheus-blackbox-exporter', 'alloy', 'gitlab-runner']
    })
  ]
})
