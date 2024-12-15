import moment from 'moment-timezone';
import { config } from '@/server/config';

const timeZoneOffset = moment().tz('Europe/Amsterdam').utcOffset() / 60;

export default  (bookingDate : string) => {
    const [hours, minutes] = config.cronTestTime.split(':')
    return moment().set({ hours: parseInt(hours) - timeZoneOffset, minutes: parseInt(minutes) })
}