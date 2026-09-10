import { Labels } from '@constants'
import { Datasources } from '@datasources'
import { createBreakingMajorRule, createPreset } from '@lib'

// Opt-in per repository whose own contract breaks when a docker image major lands. Extended after
// `default/default`, where `commitMessagePrefix` is last-match-wins and so wins over the unmarked default.
export default createPreset({
  packageRules: [
    createBreakingMajorRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchDatasources: [Datasources.DOCKER]
    })
  ]
})
