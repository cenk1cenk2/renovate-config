import { Labels } from '@constants'
import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per chart, argument passed by the consuming repository. matchDepTypes must mirror the
// catch-all in the group preset — omitting it makes the rule match nothing silently.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'kustomize',
      matchUpdateTypes: ['minor', 'patch'],
      commitType: 'feat',
      groupSlug: Groups.KUSTOMIZE_MINOR_AUTOMERGE,
      matchManagers: [Managers.KUSTOMIZE],
      matchDepTypes: ['HelmChart'],
      automerge: true,
      addLabels: [Labels.RENOVATE],
      matchPackageNames: ['{{arg0}}']
    })
  ]
})
