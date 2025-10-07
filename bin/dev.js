#!/usr/bin/env tsx

import oclif from '@oclif/core'

async function main() {
  // In dev mode -> use ts-node and dev plugins
  process.env.NODE_ENV = 'development'

  // In dev mode, always show stack traces
  oclif.settings.debug = true

  await import('source-map-support').then((lib) => lib.install())

  await import('@cenk1cenk2/oclif-common').then((mod) => mod.setup())

  const { execute } = await import('@oclif/core')

  await execute({ development: true, dir: import.meta.url })
}

await main()
