import { Managers } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  enabledManagers: [Managers.KUBERNETES],
  managerFilePatterns: [
    '.deploy/*/**.yaml',
    '!.deploy/**/kustomization.yaml',
    '!.deploy/**/templates',
    '!.deploy/**/files',
    '!.deploy/**/values',
    '!.deploy/**/values.yaml',
    '!.deploy/**/chart.yaml'
  ]
})
