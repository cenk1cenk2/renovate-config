// https://docs.renovatebot.com/configuration-options/#schedule
// https://docs.renovatebot.com/presets-schedule/
export enum SCHEDULE {
  EVERY_MONDAY = 'before 1am on Monday',
  WEEKDAYS = 'every weekday',
  MONTHLY = 'before 1am on the first day of the month',
  DAILY = 'before 1am',
  ANY = 'at any time'
}
