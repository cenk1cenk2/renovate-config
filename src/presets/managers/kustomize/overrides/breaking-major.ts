import { Labels } from '@constants'
import { createBreakingMajorRule, createPreset } from '@lib'
import { Managers } from '@managers'

// Opt-in per repository whose own contract breaks when a kustomize helm chart major lands. Extended after
// `default/default`, where `commitMessagePrefix` is last-match-wins and so wins over the unmarked default.
export default createPreset({
  packageRules: [
    createBreakingMajorRule({
      addLabels: [Labels.RENOVATE, Labels.OVERRIDE],
      matchManagers: [Managers.KUSTOMIZE],
      matchDepTypes: ['HelmChart']
    })
  ]
})
