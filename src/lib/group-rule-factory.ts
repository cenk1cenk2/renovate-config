import type { PackageRule } from 'renovate/dist/config/types.js'

import { Labels } from '@constants'

export interface MultiDirectoryGroupRule extends PackageRule {
  name: string
  commitType: string
  matchUpdateTypes: NonNullable<PackageRule['matchUpdateTypes']>
}

// Multi-directory managers (argocd, helm, kustomize, terraform) resolve the same dependency once per
// package file, so every rule has to disambiguate the branch and the commit message by directory.
// `matchUpdateTypes` and `commitType` are passed in by the caller rather than derived from a discriminator,
// so the factory never bakes in an update-type set or a commit type. Everything past `name` and
// `commitType` is an ordinary PackageRule and passes straight through, so callers keep renovate's own
// vocabulary and can override any derived field.
export function createMultiDirectoryGroupRule({ name, commitType, ...rule }: MultiDirectoryGroupRule): PackageRule {
  const addLabels = [...(rule.automerge ? [Labels.AUTOMERGE] : []), ...(rule.addLabels ?? [])]
  const updateType = rule.matchUpdateTypes.includes('major') ? 'major' : 'minor'

  // No `enabled: true` default. It is last-match-wins, so emitting it would silently re-enable
  // dependencies that an earlier, more specific rule deliberately disabled.
  return {
    automerge: false,
    additionalBranchPrefix: '{{packageFileDir}}-',
    groupName: `${name} all ${updateType}${rule.automerge ? ' automerge' : ''} dependency updates`,
    commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
    extends: [`:semanticCommitTypeAll(${commitType})`],
    ...rule,
    ...(addLabels.length > 0 && { addLabels })
  }
}
