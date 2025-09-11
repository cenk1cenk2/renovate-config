import { createPreset } from '@lib'

export default createPreset({
  customManagers: [
    {
      depTypeTemplate: 'gitlab-ci-custom-manager-pipelines',
      customType: 'regex',
      managerFilePatterns: ['/\\.gitlab-ci\\.ya?ml$/'],
      matchStringsStrategy: 'combination',
      matchStrings: [/project:\s+['"]?(?<packageName>[^'"\s]+)['"]?\s*ref:\s+['"]?(?<subpackageName>[^@]+)@(?<currentValue>[^'"\s]+)['"]?/.source],
      registryUrlTemplate: 'https://gitlab.kilic.dev/',
      extractVersionTemplate: '^{{{subpackageName}}}@(?<version>.*)$',
      datasourceTemplate: 'gitlab-tags',
      versioningTemplate: 'semver'
    }
  ]
})
