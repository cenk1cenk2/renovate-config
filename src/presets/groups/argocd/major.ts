import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'argocd',
      updateType: 'major',
      slug: Groups.ARGOCD_MAJOR,
      managers: [Managers.ARGOCD]
    }),
    createMultiDirectoryGroupRule({
      name: 'argocd',
      updateType: 'major',
      slug: Groups.ARGOCD_MAJOR_AUTOMERGE,
      managers: [Managers.ARGOCD],
      automerge: true,
      packageNames: ['git@gitlab.kilic.dev:cluster/charts/chart-prometheus-operator.git', 'git@gitlab.kilic.dev:cluster/charts/chart-opentelemetry-operator.git']
    })
  ]
})
