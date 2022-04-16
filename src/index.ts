import fs from 'fs-extra'

import presets from './presets'
import { readPackageJson } from '@utils/get-package-json'
import { Logger } from '@utils/logger'

async function bootstrap (): Promise<void> {
  const logger = Logger.prototype.getInstance()

  logger.direct('Renovate Config Creator')

  const pkg = readPackageJson()

  const pkgRenovateConfig: Record<string, unknown> = {}

  Object.entries(presets).forEach(([ name, preset ]) => {
    logger.info(`Processing preset: ${name}`)
    logger.debug(JSON.stringify(preset, null, 2))

    pkgRenovateConfig[name] = preset
  })

  if (process.env.NODE_ENV !== 'develop') {
    pkg.pkg['renovate-config'] = pkgRenovateConfig

    await fs.writeFile(pkg.path, JSON.stringify(pkg.pkg, null, 2), { encoding: 'utf8' })

    logger.success(`Wrote configuration to package.json@"${pkg.path}".`)
  } else {
    logger.success('A dry run has completed. Not writing changes.')
  }
}

bootstrap()
