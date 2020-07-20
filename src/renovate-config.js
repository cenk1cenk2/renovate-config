module.exports = {
  repositories: [ 'cenk1cenk2/renovate', 'cenk1cenk2/boilerplate-oclif' ],
  extends: [ 'config:base', ':masterIssue', ':pinDependencies', ':timezone(Europe/Vienna)' ],
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
  packageRules: [
    {
      updateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
      automerge: true
    },
    {
      depTypeList: [ 'devDependencies' ],
      automerge: true
    }
  ],
  prCreation: 'not-pending'
  // baseBranches: [ 'master', 'develop', 'beta', 'alpha', 'rc' ]
}
