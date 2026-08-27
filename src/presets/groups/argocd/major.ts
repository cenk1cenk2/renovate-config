import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'argocd',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.ARGOCD_MAJOR,
      matchManagers: [Managers.ARGOCD]
    })
  ]
})
