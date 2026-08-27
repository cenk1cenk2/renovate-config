import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'kustomize',
      matchUpdateTypes: ['minor', 'patch'],
      commitType: 'feat',
      groupSlug: Groups.KUSTOMIZE_MINOR,
      matchManagers: [Managers.KUSTOMIZE],
      matchDepTypes: ['HelmChart']
    })
  ]
})
