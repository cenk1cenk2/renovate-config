import { createPreset } from '@lib/preset-factory'

/**
 * Some packages are updated very often, but we don't always need the latest features
 * and thus we only want to update once a month.
 */

export default createPreset({
  packageRules: [
    {
      packageNames: [ 'node' ],
      enabled: false
    }
  ]
})
