import { readPackageJson } from '@utils/get-package-json'

const pkg = readPackageJson()
const presetPrefix = pkg.pkg.name.split('/')[0]

export function createScope (name: string): string {
  return `${presetPrefix}:${name}`
}
