export enum CronPatterns {
  EVERY_SECOND = '* * * * * *',
  EVERY_2_SECONDS = '*/2 * * * * *',
  EVERY_5_SECONDS = '*/5 * * * * *',
  EVERY_10_SECONDS = '*/10 * * * * *',
  EVERY_15_SECONDS = '*/15 * * * * *',
  EVERY_30_SECONDS = '*/30 * * * * *',

  EVERY_MINUTE = '* * * * *',
  EVERY_2_MINUTES = '*/2 * * * *',
  EVERY_5_MINUTES = '*/5 * * * *',
  EVERY_10_MINUTES = '*/10 * * * *',
  EVERY_15_MINUTES = '*/15 * * * *',
  EVERY_30_MINUTES = '*/30 * * * *',

  EVERY_HOUR = '0 * * * *',
  EVERY_2_HOURS = '0 */2 * * *',
  EVERY_3_HOURS = '0 */3 * * *',
  EVERY_4_HOURS = '0 */4 * * *',
  EVERY_6_HOURS = '0 */6 * * *',
  EVERY_12_HOURS = '0 */12 * * *',

  DAILY_AT_MIDNIGHT = '0 0 * * *',
  DAILY_AT_1AM = '0 1 * * *',
  DAILY_AT_6AM = '0 6 * * *',
  DAILY_AT_NOON = '0 12 * * *',
  DAILY_AT_6PM = '0 18 * * *',
  DAILY_AT_11PM = '0 23 * * *',

  WEEKLY_ON_MONDAY = '0 0 * * 1',
  WEEKLY_ON_TUESDAY = '0 0 * * 2',
  WEEKLY_ON_WEDNESDAY = '0 0 * * 3',
  WEEKLY_ON_THURSDAY = '0 0 * * 4',
  WEEKLY_ON_FRIDAY = '0 0 * * 5',
  WEEKLY_ON_SATURDAY = '0 0 * * 6',
  WEEKLY_ON_SUNDAY = '0 0 * * 0',

  MONTHLY_ON_FIRST = '0 0 1 * *',
  MONTHLY_ON_FIFTEENTH = '0 0 15 * *',
  MONTHLY_ON_LAST_DAY = '0 0 L * *',

  QUARTERLY_ON_FIRST = '0 0 1 1,4,7,10 *',
}
