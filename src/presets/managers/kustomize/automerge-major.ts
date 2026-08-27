import { Labels } from '@constants'
import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per chart whose major version tracks an upstream dependency bump. matchDepTypes must mirror
// the catch-all in the group preset — omitting it makes the rule match nothing silently.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'kustomize',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.KUSTOMIZE_MAJOR_AUTOMERGE,
      matchManagers: [Managers.KUSTOMIZE],
      matchDepTypes: ['HelmChart'],
      automerge: true,
      addLabels: [Labels.RENOVATE],
      matchPackageNames: ['{{arg0}}']
    })
  ]
})
