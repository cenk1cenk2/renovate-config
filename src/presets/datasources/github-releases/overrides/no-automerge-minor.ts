import { Labels } from '@constants'
import { Datasources } from '@datasources'
import { createNoAutomergeRule, createPreset } from '@lib'

// Opt-in per package that must not be merged unattended. Nothing automerges a github release centrally, so this
// states an intent the central config already holds; `groupName: null` still moves the package to its own branch.
export default createPreset({
  packageRules: [
    createNoAutomergeRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchPackageNames: ['{{arg0}}'],
      matchUpdateTypes: ['minor', 'patch', 'pin', 'digest'],
      matchDatasources: [Datasources.GITHUB_RELEASES]
    })
  ]
})
