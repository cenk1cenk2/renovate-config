import { createPreset } from '@lib/preset-factory'

/**
 * Auto-merge all minor dependency changes.
 */

export default createPreset({
  minor: {
    automerge: true
  },
  path: {
    automerge: true
  },
  pin: {
    automerge: true
  },
  digest: {
    automerge: true
  }
})
