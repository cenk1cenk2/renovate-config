import { createPreset } from '@lib'

export default createPreset({
  customManagers: [
    {
      depTypeTemplate: 'gitlab-ci-custom-manager-pipelines',
      customType: 'regex',
      managerFilePatterns: ['/\\.gitlab-ci\\.ya?ml$/'],
      matchStringsStrategy: 'combination',
      matchStrings: [/project:\s+['"]?(?<registryUrl>[^'"\s]+)['"]?\s*ref:\s+['"]?(?<packageName>[^@]+)@(?<currentValue>[^'"\s]+)['"]?/.source],
      registryUrlTemplate: 'https://gitlab.kilic.dev/{{{registryUrl}}}',
      extractVersionTemplate: '^{{{packageName}}}@(?<version>.*)$',
      datasourceTemplate: 'gitlab-tags'
    }
  ]
})
