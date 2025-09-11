import { createPreset } from '@lib'

export const DEP_TYPE_GITLAB_CI_CUSTOM_MANAGER_PIPELINES = 'gitlab-ci-custom-manager-pipelines'

export default createPreset({
  customManagers: [
    {
      depTypeTemplate: DEP_TYPE_GITLAB_CI_CUSTOM_MANAGER_PIPELINES,
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
