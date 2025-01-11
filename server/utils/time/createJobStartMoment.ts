import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);
dayjs.extend(timezone);

console.log('RUN WITH DETIMEZONING IN createJobStartMoment.ts')

export default (bookingDate : string, bookingThreshold : number) => {
    return dayjs(bookingDate)
        .subtract(bookingThreshold, 'day')
        .set('hour', 0)
        .set('minute', 0)
        // .tz('Europe/Amsterdam')
}