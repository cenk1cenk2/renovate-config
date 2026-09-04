// https://docs.renovatebot.com/configuration-options/#schedule
// https://docs.renovatebot.com/presets-schedule/
//
// The runner fires on a UTC cron every 6 hours while renovate evaluates these windows in `TIMEZONE`, so
// the two never line up and a window narrower than the cadence can contain no run at all. `before 1am`
// used to mean that literally: nothing on a daily or weekly schedule was ever created. Keep every hour
// bound wide enough to hold at least two runs under both CET and CEST.
export enum SCHEDULE {
  WEEKDAYS = 'every weekday',
  WEEKENDS = 'every weekend',
  MONTHLY = 'before 9am on the first day of the month',
  WEEKLY = 'before 9am on Monday',
  DAILY = 'before 9am',
  ANY = 'at any time'
}

// https://docs.renovatebot.com/configuration-options/#minimumreleaseage
export const MINIMUM_RELEASE_AGE = '7 days'
