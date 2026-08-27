import { Labels } from '@constants'
import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per chart whose major version tracks an upstream dependency bump rather than a chart-level
// breaking change. replacement updates stay banned outright by policy.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'helm',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.HELM_MAJOR_AUTOMERGE,
      matchManagers: [Managers.HELM],
      automerge: true,
      addLabels: [Labels.RENOVATE],
      matchPackageNames: ['{{arg0}}']
    })
  ]
})
