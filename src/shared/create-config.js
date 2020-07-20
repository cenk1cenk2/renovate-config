/* eslint-disable no-console */
import { defaultPackageRules, defaultOptions } from '@settings/default'
import merge from 'deepmerge'

/**
 * @param {string[]} repositories
 * @param {{ defaultOptions?: boolean; defaultPackageRules?: boolean; override?: any; }} [options]
 */
export function createConfiguration (repositories, options) {
  let setup = { repositories }

  if (options.defaultOptions) {
    setup = merge(setup, defaultOptions)
  }

  if (options.defaultPackageRules) {
    setup = merge(setup, defaultPackageRules)
  }

  if (options.override) {
    setup = merge(setup, options.override)
  }

  console.log('Config file generated.')
  console.log(setup)

  return setup
}