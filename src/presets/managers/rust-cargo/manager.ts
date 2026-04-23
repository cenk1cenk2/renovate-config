import { Labels } from '@constants'
import { Managers } from '@managers'
import { createPreset } from '@lib'

export default createPreset({
  enabledManagers: [Managers.RUST_CARGO],
  packageRules: [
    {
      matchManagers: [Managers.RUST_CARGO],
      addLabels: [Labels.RUST]
    }
  ]
})
