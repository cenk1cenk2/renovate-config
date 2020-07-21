module.exports = {
  platform: 'github',
  gitAuthor: 'renovate-bot <renovate@kilic.dev>',
  enabledManagers: [ 'github-actions', 'ansible', 'ansible-galaxy', 'docker-compose', 'dockerfile', 'droneci', 'git-submodules', 'gomod', 'kubernetes', 'npm', 'nvm' ],
  logLevel: 'info',
  masterIssueTitle: '[renovate-bot] Update Dependencies',
  onboarding: true,
  onboardingPrTitle: '[renovate-bot] Configure',
  onboardingConfig: {
    extends: [ '@cenk1cenk2' ]
  },
  repositories: [
    'cenk1cenk2/renovate',
    'cenk1cenk2/eslint-config',
    'cenk1cenk2/boilerplate-oclif',
    'cenk1cenk2/listr2',
    'cenk1cenk2/servicecmd',
    'cenk1cenk2/drone-track-repository'
  ]
}
