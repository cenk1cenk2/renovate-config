import { Labels } from '@constants'
import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per chart repository whose major version tracks an upstream dependency bump. argocd uses git
// URLs as package names with no matchSourceUrls — the argument is a git URL, not a chart name.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'argocd',
      matchUpdateTypes: ['major'],
      commitType: 'perf',
      groupSlug: Groups.ARGOCD_MAJOR_AUTOMERGE,
      matchManagers: [Managers.ARGOCD],
      automerge: true,
      addLabels: [Labels.RENOVATE],
      matchPackageNames: ['{{arg0}}']
    })
  ]
})
