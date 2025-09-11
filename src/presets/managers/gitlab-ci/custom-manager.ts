import { createPreset } from '@lib'

export default createPreset({
  customManagers: [
    {
      customType: 'regex',
      managerFilePatterns: ['/\\.gitlab-ci\\.ya?ml$/'],
      matchStringsStrategy: 'combination',
      matchStrings: [/project:\s+['"]?(?<registryUrl>[^'"]+)['"]?\s*ref:\s+['"]?(?<packageName>[^@]+)@(?<currentValue>[^'"]+)['"]?/.source],
      registryUrlTemplate: 'https://gitlab.kilic.dev/{{{registryUrl}}}',
      extractVersionTemplate: '^{{{packageName}}}@v?(?<version>.*)$',
      datasourceTemplate: 'gitlab-tags',
      versioningTemplate: 'gitlab-tags'
    }
  ]
})
