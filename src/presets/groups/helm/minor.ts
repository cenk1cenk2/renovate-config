import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'helm',
      matchUpdateTypes: ['minor', 'patch'],
      commitType: 'feat',
      groupSlug: Groups.HELM_MINOR,
      matchManagers: [Managers.HELM]
    })
  ]
})
