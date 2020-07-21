module.exports = {
  platform: 'github',
  gitAuthor: 'renovate-bot <renovate@kilic.dev>',
  enabledManagers: [ 'github-actions', 'ansible', 'ansible-galaxy', 'docker-compose', 'dockerfile', 'droneci', 'git-submodules', 'gomod', 'kubernetes', 'npm', 'nvm' ],
  logLevel: 'info',
  masterIssueTitle: '[renovate-bot] Update Dependencies',
  onboarding: true,
  onboardingPrTitle: '[renovate-bot] Configure',
  onboardingConfig: {
    extends: [ 'github>cenk1cenk2/renovate:src/index' ]
  },
  repositories: [
    'cenk1cenk2/renovate',
    'cenk1cenk2/boilerplate-oclif'
  ]
}
