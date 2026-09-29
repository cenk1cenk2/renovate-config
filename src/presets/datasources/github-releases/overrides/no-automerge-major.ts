import { Labels } from '@constants'
import { Datasources } from '@datasources'
import { createNoAutomergeRule, createPreset } from '@lib'

// The major twin, kept for symmetry with the minor twin and so the declaration survives a change of the central default.
export default createPreset({
  packageRules: [
    createNoAutomergeRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchPackageNames: ['{{arg0}}'],
      matchUpdateTypes: ['major'],
      matchDatasources: [Datasources.GITHUB_RELEASES]
    })
  ]
})
