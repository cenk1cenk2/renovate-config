import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// No automerge rule here, by policy: a major bump is a breaking change and needs a human.
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
