import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const DateUtils = {
  /**
   * Returns milliseconds until next midnight UTC
   */
  getDelayUntilMidnight(): number {
    const now = dayjs.utc();
    const midnight = now.add(1, 'day').startOf('day');

    return midnight.diff(now);
  },
};
