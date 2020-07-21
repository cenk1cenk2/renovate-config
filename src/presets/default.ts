import { createPreset } from '@lib/preset-factory'
import { createScope } from '@lib/scope-factory'

export default createPreset({
  extends: [ createScope('base'), createScope('devDependencies'), createScope('minorDependencies'), createScope('groupTogether'), createScope('slowring') ]
})
