import { Managers } from '@constants'
import { createPreset } from '@lib'

export default createPreset({
  enabledManagers: [Managers.REGEX],
  customManagers: [
    {
      customType: 'regex',
      managerFilePatterns: ['/\\.gitlab-ci\\.ya?ml$/'],
      matchStrings: ['project: [\'"](?<depName>[^/]+/[^/]+)[\'"]\n.*ref: (?<packageName>[^@]+)@(?<currentValue>[^"\\s]+)'],
      datasourceTemplate: 'git-tags',
      registryUrlTemplate: 'https://gitlab.kilic.dev',
      packageNameTemplate: '{{{depName}}}',
      extractVersionTemplate: '^{{{packageName}}}@v?(?<version>.*)$'
    },
    {
      customType: 'regex',
      managerFilePatterns: ['.*.tf'],
      matchStrings: ['git::https://gitlab.kilic.dev/(?<depName>[^/]+/[^/]+).git//(?<packageName>[^?]+)\\?ref=(?<currentValue>[^"\\s]+)'],
      datasourceTemplate: 'git-tags',
      registryUrlTemplate: 'https://gitlab.kilic.dev',
      packageNameTemplate: '{{{depName}}}',
      extractVersionTemplate: '^{{{packageName}}}@v?(?<version>.*)$'
    }
  ]
})
