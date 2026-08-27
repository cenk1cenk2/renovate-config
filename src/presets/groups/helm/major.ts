import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'helm',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.HELM_MAJOR,
      matchManagers: [Managers.HELM]
    })
  ]
})
