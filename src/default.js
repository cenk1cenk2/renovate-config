const config = {
  extends: [ 'config:base', ':masterIssue', ':timezone(Europe/Vienna)' ],
  ignorePresets: [ ':prHourlyLimit2' ],
  lockFileMaintenance: {
    enabled: true
  },
  major: {
    stabilityDays: 3
  },
  prCreation: 'not-pending',
  packageRules: [
    {
      updateTypes: [ 'minor', 'patch', 'pin', 'digest' ],
      automerge: true
    },
    {
      depTypeList: [ 'devDependencies' ],
      automerge: true
    }
  ]
}

export default config
