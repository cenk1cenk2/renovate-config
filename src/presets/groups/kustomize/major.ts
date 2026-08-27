import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'kustomize',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.KUSTOMIZE_MAJOR,
      matchManagers: [Managers.KUSTOMIZE],
      matchDepTypes: ['HelmChart']
    })
  ]
})
