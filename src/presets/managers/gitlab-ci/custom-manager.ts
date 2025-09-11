import { createPreset } from '@lib'

export default createPreset({
  customManagers: [
    {
      customType: 'regex',
      managerFilePatterns: ['/\\.gitlab-ci\\.ya?ml$/'],
      matchStrings: ['project: [\'"](?<depName>[^/]+/[^/]+)[\'"]\n.*ref: (?<packageName>[^@]+)@(?<currentValue>[^"\\s]+)'],
      datasourceTemplate: 'git-tags',
      registryUrlTemplate: 'https://gitlab.kilic.dev',
      packageNameTemplate: '{{{depName}}}',
      extractVersionTemplate: '^{{{packageName}}}@v?(?<version>.*)$'
    }
  ]
})
