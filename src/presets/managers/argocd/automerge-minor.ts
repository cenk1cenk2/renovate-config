import { Labels } from '@constants'
import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'
import { ARGOCD_MINOR_UPDATE_TYPES } from '@presets/groups/argocd/minor.js'

// Opt-in per chart repository, argument passed by the consuming repository. argocd uses git URLs as
// package names with no matchSourceUrls — the argument is a git URL, not a chart name.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'argocd',
      matchUpdateTypes: [...ARGOCD_MINOR_UPDATE_TYPES],
      commitType: 'feat',
      groupSlug: Groups.ARGOCD_MINOR_AUTOMERGE,
      matchManagers: [Managers.ARGOCD],
      automerge: true,
      addLabels: [Labels.RENOVATE],
      matchPackageNames: ['{{arg0}}']
    })
  ]
})
