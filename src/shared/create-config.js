import { defaultPackageRules, defaultOptions } from '@settings/default'

/**
 * @param {string[]} repositories
 * @param {{ sharedOptions?: boolean; defaultPackageRules?: boolean; override?: any; }} [options]
 */
export function createConfiguration (repositories, options) {
  let setup = {}

  setup = { ...setup, repositories }

  if (options.sharedOptions) {
    setup = { ...setup, ...defaultOptions }
  }

  if (options.defaultPackageRules) {
    setup = { ...setup, ...defaultPackageRules }
  }

  if (options.override) {
    setup = { ...setup, ...options.override }
  }

  return setup
}