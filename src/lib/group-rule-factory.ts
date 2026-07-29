import type { PackageRule } from 'renovate/dist/config/types.js'

import { Labels } from '@constants'

export interface MultiDirectoryGroupRule extends PackageRule {
  name: string
  updateType: 'minor' | 'major'
}

const MATCH_UPDATE_TYPES: Record<MultiDirectoryGroupRule['updateType'], PackageRule['matchUpdateTypes']> = {
  minor: ['minor', 'patch'],
  major: ['major']
}

const SEMANTIC_COMMIT_TYPES: Record<MultiDirectoryGroupRule['updateType'], string> = {
  minor: 'feat',
  major: 'perf'
}

// Multi-directory managers (argocd, helm, kustomize, terraform) resolve the same dependency once per
// package file, so every rule has to disambiguate the branch and the commit message by directory.
// Everything past `name` and `updateType` is an ordinary PackageRule and passes straight through, so
// callers keep renovate's own vocabulary and can override any derived field.
export function createMultiDirectoryGroupRule({ name, updateType, ...rule }: MultiDirectoryGroupRule): PackageRule {
  const addLabels = [...(rule.automerge ? [Labels.AUTOMERGE] : []), ...(rule.addLabels ?? [])]

  // No `enabled: true` default. It is last-match-wins, so emitting it would silently re-enable
  // dependencies that an earlier, more specific rule deliberately disabled.
  return {
    automerge: false,
    matchUpdateTypes: MATCH_UPDATE_TYPES[updateType],
    additionalBranchPrefix: '{{packageFileDir}}-',
    groupName: `${name} all ${updateType}${rule.automerge ? ' automerge' : ''} dependency updates`,
    commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
    extends: [`:semanticCommitTypeAll(${SEMANTIC_COMMIT_TYPES[updateType]})`],
    ...rule,
    ...(addLabels.length > 0 && { addLabels })
  }
}
