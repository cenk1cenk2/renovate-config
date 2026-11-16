import { Labels } from '@constants'
import { createPreset } from '@lib'
import { Managers } from '@managers'

export const DEP_TYPE_KARGO_WAREHOUSE = 'kargo-warehouse'

export const EXCLUDE_KARGO_PROMOTE_FILES = ['!**/.promote/**']

const MANAGER_FILE_PATTERNS = ['/(^|\\/)\\.promote\\/.+\\.ya?ml$/']
const SUBSCRIPTION_LINES = /(?:[ \t]+[^\s-][^\n]*\n)*?/.source
const CONSTRAINT_VALUE = /[ \t]*["']?(?<currentValue>[~^][^"'\s]+)["']?/.source

export default createPreset({
  enabledManagers: [Managers.REGEX],
  customManagers: [
    {
      depTypeTemplate: DEP_TYPE_KARGO_WAREHOUSE,
      customType: 'regex',
      managerFilePatterns: MANAGER_FILE_PATTERNS,
      matchStringsStrategy: 'any',
      matchStrings: [
        /- image:[ \t]*\n/.source +
          SUBSCRIPTION_LINES +
          /[ \t]+repoURL:[ \t]*["']?(?<depName>[^"'\s]+)["']?[ \t]*\n/.source +
          SUBSCRIPTION_LINES +
          /[ \t]+constraint:/.source +
          CONSTRAINT_VALUE
      ],
      datasourceTemplate: 'docker',
      versioningTemplate: 'npm'
    },
    {
      depTypeTemplate: DEP_TYPE_KARGO_WAREHOUSE,
      customType: 'regex',
      managerFilePatterns: MANAGER_FILE_PATTERNS,
      matchStringsStrategy: 'any',
      matchStrings: [
        /- chart:[ \t]*\n/.source +
          SUBSCRIPTION_LINES +
          /[ \t]+repoURL:[ \t]*["']?(?<registryUrl>https?:\/\/[^"'\s]+)["']?[ \t]*\n/.source +
          SUBSCRIPTION_LINES +
          /[ \t]+name:[ \t]*["']?(?<depName>[^"'\s]+)["']?[ \t]*\n/.source +
          SUBSCRIPTION_LINES +
          /[ \t]+semverConstraint:/.source +
          CONSTRAINT_VALUE,
        /- chart:[ \t]*\n/.source +
          SUBSCRIPTION_LINES +
          /[ \t]+repoURL:[ \t]*["']?oci:\/\/(?<depName>[^"'\s]+)["']?[ \t]*\n/.source +
          SUBSCRIPTION_LINES +
          /[ \t]+semverConstraint:/.source +
          CONSTRAINT_VALUE
      ],
      datasourceTemplate: '{{#if registryUrl}}helm{{else}}docker{{/if}}',
      versioningTemplate: 'npm'
    },
    {
      depTypeTemplate: DEP_TYPE_KARGO_WAREHOUSE,
      customType: 'regex',
      managerFilePatterns: MANAGER_FILE_PATTERNS,
      matchStringsStrategy: 'any',
      matchStrings: [
        /- git:[ \t]*\n/.source +
          SUBSCRIPTION_LINES +
          /[ \t]+repoURL:[ \t]*["']?(?<url>https:\/\/(?<host>[^/"'\s]+)\/(?<project>[^"'\s]+?)(?:\.git)?)["']?[ \t]*\n/.source +
          SUBSCRIPTION_LINES +
          /[ \t]+semverConstraint:/.source +
          CONSTRAINT_VALUE
      ],
      depNameTemplate: '{{{project}}}',
      packageNameTemplate: '{{#if (equals host \'gitlab.kilic.dev\')}}{{{project}}}{{else}}{{{url}}}{{/if}}',
      registryUrlTemplate: 'https://{{{host}}}',
      datasourceTemplate: '{{#if (equals host \'gitlab.kilic.dev\')}}gitlab-tags{{else}}git-tags{{/if}}',
      versioningTemplate: 'npm'
    }
  ],
  packageRules: [
    {
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_KARGO_WAREHOUSE],
      rangeStrategy: 'replace',
      automerge: false,
      commitMessageTopic: 'kargo constraint {{{depName}}}'
    },
    {
      matchManagers: [Managers.REGEX],
      matchDepTypes: [DEP_TYPE_KARGO_WAREHOUSE],
      addLabels: [Labels.RENOVATE, Labels.MANAGER_KARGO, Labels.AREA_INFRASTRUCTURE]
    }
  ]
})
