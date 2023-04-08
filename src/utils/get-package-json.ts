import { join } from 'path'

import { fs } from '@cenk1cenk2/oclif-common'
import { Logger } from '@utils/logger'

export function readPackageJson (pathOnly?: boolean): { pkg?: Record<string, any>, path: string } {
  const logger = new Logger()

  const root = process.cwd()

  if (!root) {
    logger.fatal('Can not find the root of the project.')
    process.exit(127)
  }

  const pkgJsonPath = join(root, './package.json')

  if (pathOnly) {
    return { path: pkgJsonPath }
  }

  logger.info(`Root directory of the project: ${root}`)

  try {
    return { pkg: fs.readJsonSync(pkgJsonPath), path: pkgJsonPath }
  } catch {
    logger.fatal(`Can not read package.json at project root at "${pkgJsonPath}".`)
    process.exit(127)
  }
}
