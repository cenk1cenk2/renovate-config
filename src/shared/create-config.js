/* eslint-disable no-console */
import { defaultPackageRules, defaultOptions } from '@settings/default'

/**
 * @param {string[]} repositories
 * @param {{ defaultOptions?: boolean; defaultPackageRules?: boolean; override?: any; }} [options]
 */
export function createConfiguration (repositories, options) {
  let setup = {}

  setup = { ...setup, repositories }

  if (options.defaultOptions) {
    setup = { ...setup, ...defaultOptions }
  }

  if (options.defaultPackageRules) {
    setup = { ...setup, ...defaultPackageRules }
  }

  if (options.override) {
    setup = { ...setup, ...options.override }
  }

  console.log('Config file generated.')
  console.log(setup)

  return setup
}