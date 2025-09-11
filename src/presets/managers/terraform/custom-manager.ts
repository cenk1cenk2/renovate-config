import { createPreset } from '@lib'

export const DEP_TYPE_TERRAFORM_MANAGER_MONOREPO = 'gitlab-ci-custom-manager-pipelines'

export default createPreset({
  customManagers: [
    {
      depTypeTemplate: DEP_TYPE_TERRAFORM_MANAGER_MONOREPO,
      customType: 'regex',
      managerFilePatterns: ['/\\.tf$/'],
      matchStringsStrategy: 'combination',
      // source = "git::git@gitlab.kilic.dev:terraform/tf-modules.git//reloader?ref=reloader@1.0.6"
      matchStrings: [/"git::git@(?<registryUrl>[^:]*):(?<packageName>[^.]*)(\.git)?\/\/.*\?ref=(?<depName>.*)@(?<currentValue>[^"]+)"/.source],
      extractVersionTemplate: '^{{{depName}}}@(?<version>.*)$',
      registryUrlTemplate: 'https://{{{registryUrl}}}',
      datasourceTemplate: 'gitlab-tags',
      versioningTemplate: 'semver'
    }
  ]
})
