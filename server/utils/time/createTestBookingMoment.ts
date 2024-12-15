import moment from 'moment-timezone';
import { config } from '@/server/config';


export default  (bookingDate : string) => {
    const timeZoneOffset = moment().tz('Europe/Amsterdam').utcOffset() / 60;
    console.log('timeZoneOffset', timeZoneOffset)

    const [hours, minutes] = config.cronTestTime.split(':')
    return moment()
    .set({
        // hours: parseInt(hours) - timeZoneOffset,
        hours: parseInt(hours),
        minutes: parseInt(minutes)
    })
}