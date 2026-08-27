import { Labels } from '@constants'
import { Groups } from '@groups'
import { createMultiDirectoryGroupRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per package: the consuming repository extends this once per chart it wants automerged and
// passes the chart name as the argument. Boundedness is the consumer's contract — renovate substitutes
// the argument before this repo ever sees it, so a glob passed here would widen the rule silently.
export default createPreset({
  packageRules: [
    createMultiDirectoryGroupRule({
      name: 'helm',
      matchUpdateTypes: ['minor', 'patch'],
      commitType: 'feat',
      groupSlug: Groups.HELM_MINOR_AUTOMERGE,
      matchManagers: [Managers.HELM],
      automerge: true,
      addLabels: [Labels.RENOVATE],
      matchPackageNames: ['{{arg0}}']
    })
  ]
})
