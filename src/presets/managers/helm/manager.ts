import { Managers } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  enabledManagers: [Managers.HELM, Managers.HELM_VALUES]
})
