export const sharedOptions = {
  extends: [ 'config:base', ':masterIssue', ':timezone(Europe/Vienna)' ],
  ignorePresets: [ ':prHourlyLimit2' ],
  platform: 'github',
  gitAuthor: 'renovate-bot <renovate@kilic.dev>',
  enabledManagers: [ 'github-actions', 'ansible', 'ansible-galaxy', 'docker-compose', 'dockerfile', 'droneci', 'git-submodules', 'gomod', 'kubernetes', 'npm', 'nvm' ],
  logLevel: 'info',
  masterIssueTitle: 'Update Dependencies (renovate-bot)',
  onboarding: true,
  lockFileMaintenance: {
    enabled: true
  },
  major: {
    stabilityDays: 3
  },
  prCreation: 'not-pending'
}

export const defaultPackageRules = [
  {
    updateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
    automerge: true
  },
  {
    depTypeList: [ 'devDependencies' ],
    automerge: true
  }
]
