import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'argocd',
      updateType: 'major',
      groupSlug: Groups.ARGOCD_MAJOR,
      matchManagers: [Managers.ARGOCD]
    }),
    createMultiDirectoryGroupRule({
      name: 'argocd',
      updateType: 'major',
      groupSlug: Groups.ARGOCD_MAJOR_AUTOMERGE,
      matchManagers: [Managers.ARGOCD],
      automerge: true,
      matchPackageNames: ['git@gitlab.kilic.dev:cluster/charts/chart-prometheus-operator.git', 'git@gitlab.kilic.dev:cluster/charts/chart-opentelemetry-operator.git']
    })
  ]
})
