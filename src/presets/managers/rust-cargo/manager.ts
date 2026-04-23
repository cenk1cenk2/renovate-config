import { Labels } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export default createPreset({
  enabledManagers: [Managers.RUST_CARGO],
  packageRules: [
    {
      matchManagers: [Managers.RUST_CARGO],
      addLabels: [Labels.RUST]
    }
  ]
})
