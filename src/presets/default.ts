import { createPreset } from '@lib/preset-factory'
import { createScope } from '@lib/scope-factory'

/**
 * Default Renovate preset.
 */

export default createPreset({
  extends: [ createScope('base'), createScope('devDependencies'), createScope('minorDependencies'), createScope('groupTogether'), createScope('monthly') ]
})
