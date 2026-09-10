import { Labels } from '@constants'
import { Datasources } from '@datasources'
import { createNoBreakingMajorRule, createPreset } from '@lib'

// Restates the central default, which already leaves a docker image major unmarked. Here so a repository can
// declare the intent rather than inherit it, and so the declaration survives a change of the central default.
export default createPreset({
  packageRules: [
    createNoBreakingMajorRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchDatasources: [Datasources.DOCKER]
    })
  ]
})
