import { createPreset } from '@lib'

export const DEP_TYPE_TERRAFORM_MANAGER_MONOREPO = 'terraform-manager-git-monorepo'

export default createPreset({
  customManagers: [
    {
      depTypeTemplate: DEP_TYPE_TERRAFORM_MANAGER_MONOREPO,
      customType: 'regex',
      managerFilePatterns: ['/\\.tf$/'],
      matchStringsStrategy: 'any',
      // source = "git::git@gitlab.kilic.dev:terraform/tf-modules.git//reloader?ref=reloader@1.0.6"
      matchStrings: [
        /"git::git@(?<registryUrl>[^:]+):(?<packageName>[^.]+)(\.git)?\/\/.*\?ref=(?<depName>.+)@(?<currentValue>[^"]+)"/.source,
        /"git::git@(?<registryUrl>[^:]+):(?<packageName>[^.]+)(\.git)?\/\/(?<depName>[^?"]+)"/.source
      ],
      extractVersionTemplate: '^{{{depName}}}@(?<version>.*)$',
      currentValueTemplate: '{{#if currentValue }}{{{ currentValue }}}{{else}}0.0.0{{/if}}',
      registryUrlTemplate: 'https://{{{registryUrl}}}',
      datasourceTemplate: 'gitlab-tags',
      versioningTemplate: 'semver'
    }
  ]
})
