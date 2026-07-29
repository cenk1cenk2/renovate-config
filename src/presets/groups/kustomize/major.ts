import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'kustomize',
      updateType: 'major',
      groupSlug: Groups.KUSTOMIZE_MAJOR,
      matchManagers: [Managers.KUSTOMIZE],
      matchDepTypes: ['HelmChart']
    }),
    createMultiDirectoryGroupRule({
      name: 'kustomize',
      updateType: 'major',
      groupSlug: Groups.KUSTOMIZE_MAJOR_AUTOMERGE,
      matchManagers: [Managers.KUSTOMIZE],
      matchDepTypes: ['HelmChart'],
      automerge: true,
      matchSourceUrls: ['https://github.com/prometheus-community/helm-charts', 'https://github.com/grafana/helm-charts', 'https://gitlab.com/gitlab-org/charts/gitlab-runner'],
      matchPackageNames: ['prometheus-blackbox-exporter', 'alloy', 'gitlab-runner']
    })
  ]
})
