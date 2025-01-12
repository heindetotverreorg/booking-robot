import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

function isDST(timestamp: any) {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    
    const osloTime = dayjs.tz(timestamp, "Europe/Oslo")
    const utcTime = osloTime.utc()
    const differenceInHours = osloTime.diff(utcTime, 'hour');
     
    return differenceInHours !== 1
}

export default (bookingDate : string, bookingThreshold : number) => {
    console.log('now', dayjs().format('YYYY-MM-DD HH:mm:ss'))
    console.log('isDST', isDST(dayjs().format('YYYY-MM-DD HH:mm:ss')))

    return dayjs(bookingDate)
        .subtract(bookingThreshold, 'day')
        .set('hour', 0)
        .set('minute', 0)
        .tz('Europe/Amsterdam')
}