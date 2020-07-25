// https://docs.renovatebot.com/configuration-options/#schedule
// https://docs.renovatebot.com/presets-schedule/
export enum SCHEDULE {
  WEEKDAYS = 'every weekday',
  WEEKENDS = 'every weekend',
  MONTHLY = 'before 1am on the first day of the month',
  WEEKLY = 'before 1am on Monday',
  DAILY = 'before 1am',
  TWICE_A_DAY = 'before 1 am and before 1 pm',
  ANY = 'at any time'
}
