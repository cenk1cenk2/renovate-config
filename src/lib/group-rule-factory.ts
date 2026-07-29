import type { PackageRule } from 'renovate/dist/config/types.js'

import { Labels } from '@constants'
import type { Groups } from '@groups'
import type { Managers } from '@managers'

export interface MultiDirectoryGroupRule {
  name: string
  updateType: 'minor' | 'major'
  slug: Groups
  managers: Managers[]
  automerge?: boolean
  updateTypes?: PackageRule['matchUpdateTypes']
  depTypes?: string[]
  sourceUrls?: string[]
  packageNames?: string[]
  labels?: Labels[]
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
export function createMultiDirectoryGroupRule(rule: MultiDirectoryGroupRule): PackageRule {
  const { name, updateType, slug, managers, automerge = false, updateTypes, depTypes, sourceUrls, packageNames, labels = [] } = rule
  const addLabels = [...(automerge ? [Labels.AUTOMERGE] : []), ...labels]

  return {
    enabled: true,
    matchUpdateTypes: updateTypes ?? MATCH_UPDATE_TYPES[updateType],
    additionalBranchPrefix: '{{packageFileDir}}-',
    groupName: `${name} all ${updateType}${automerge ? ' automerge' : ''} dependency updates`,
    groupSlug: slug,
    commitMessageExtra: 'to {{{newValue}}} [{{packageFileDir}}]',
    automerge,
    extends: [`:semanticCommitTypeAll(${SEMANTIC_COMMIT_TYPES[updateType]})`],
    matchManagers: managers,
    ...(depTypes && { matchDepTypes: depTypes }),
    ...(sourceUrls && { matchSourceUrls: sourceUrls }),
    ...(packageNames && { matchPackageNames: packageNames }),
    ...(addLabels.length > 0 && { addLabels })
  }
}
