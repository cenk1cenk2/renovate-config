import { createPreset } from '@lib/preset-factory'
import { createScope } from '@lib/scope-factory'

export default createPreset({
  extends: [ createScope('base'), createScope('lockFile'), createScope('groupMinorDependencies'), createScope('groupDevDependencies'), createScope('slowring') ]
})
