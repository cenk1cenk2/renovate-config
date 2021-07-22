import { readPackageJson } from '@utils/get-package-json'
import { Logger } from '@utils/logger'
import fs from 'fs-extra'

import presets from './presets'

async function bootstrap (): Promise<void> {
  const logger = Logger.prototype.getInstance()

  logger.direct('Renovate Config Creator')

  const pkg = readPackageJson()

  const pkgRenovateConfig: Record<string, unknown> = {}

  Object.keys(presets)
    .sort()
    .forEach((key) => {
      logger.info(`Processing preset: ${key}`)
      logger.debug(JSON.stringify(presets[key], null, 2))

      pkgRenovateConfig[key] = presets[key]
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
