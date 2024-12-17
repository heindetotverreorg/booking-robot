import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);

export default (bookingDate : string, bookingThreshold : number) => {
    return dayjs(bookingDate)
        .tz('Europe/Amsterdam')
        .set('hour', 0)
        .set('minute', 0)
        .subtract(bookingThreshold, 'day');
}