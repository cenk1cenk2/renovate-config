import { Logger } from '@utils/logger'
import fs from 'fs-extra'
import { join } from 'path'
import pkgDir from 'pkg-dir'

export function readPackageJson (pathOnly?: boolean): { pkg?: Record<string, any>, path: string } {
  const logger = Logger.prototype.getInstance()

  const root = pkgDir.sync(__dirname)

  if (!root) {
    logger.fatal('Can not find the root of the project.')
    process.exit(127)
  }

  const pkgJsonPath = join(root, './package.json')

  if (pathOnly) {
    return { path: pkgJsonPath }
  }

  logger.debug(`Root directory of the project: ${root}`)

  try {
    return { pkg: fs.readJsonSync(pkgJsonPath), path: pkgJsonPath }
  } catch {
    logger.fatal(`Can not read package.json at project root at "${pkgJsonPath}".`)
    process.exit(127)
  }
}
