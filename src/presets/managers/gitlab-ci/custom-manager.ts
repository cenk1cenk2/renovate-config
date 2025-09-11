import { createPreset } from '@lib'

export default createPreset({
  customManagers: [
    {
      customType: 'regex',
      managerFilePatterns: ['/\\.gitlab-ci\\.ya?ml$/'],
      // eslint-disable-next-line stylistic/quotes
      matchStrings: [`project: ['"]?(?<depName>[^/]+/[^/]+)['"]?\n.*ref: (?<packageName>[^@]+)@(?<currentValue>[^"\\s]+)`],
      datasourceTemplate: 'gitlab-tags',
      registryUrlTemplate: 'https://gitlab.kilic.dev',
      packageNameTemplate: '{{{depName}}}',
      extractVersionTemplate: '^{{{packageName}}}@v?(?<version>.*)$'
    }
  ]
})
