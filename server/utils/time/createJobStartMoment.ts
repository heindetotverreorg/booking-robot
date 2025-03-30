import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';

function isDST(timestamp: any) {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    
    const amsterdamTime = dayjs.tz(timestamp, "Europe/Amsterdam")
    const utcTime = amsterdamTime.utc()
    const differenceInHours = amsterdamTime.diff(utcTime, 'hour');

    console.log('differenceInHours', differenceInHours)
     
    return differenceInHours !== 1
}

export default (bookingDate : string, bookingThreshold : number) => {
    if (isDST(dayjs().format('YYYY-MM-DD HH:mm:ss'))) {
        console.log('-- is daylight saving time')
        return dayjs(bookingDate)
            .subtract(bookingThreshold, 'day')
            .set('hour', 0)
            .set('minute', 0)
            .subtract(1, 'hour')
    }

    console.log('-- is not daylight saving time')
    return dayjs(bookingDate)
        .subtract(bookingThreshold, 'day')
        .set('hour', 0)
        .set('minute', 0)
        .subtract(2, 'hour')
}