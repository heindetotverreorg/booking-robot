import moment from 'moment-timezone';
import { config } from '@/server/config';

const timeZoneOffset = moment().tz('Europe/Amsterdam').utcOffset() / 60;

const createTestBookingMoment = (bookingDate : string) => {
    const [hours, minutes] = config.cronTestTime.split(':')
    return moment(bookingDate).set({ hours: parseInt(hours) - timeZoneOffset, minutes: parseInt(minutes) })
}

const createBookingMoment = (bookingDate : string, bookingThreshold : number) => {
    return moment(bookingDate)
        .set({ hours: 0 - timeZoneOffset, minutes: 0 })
        .subtract(bookingThreshold, 'day');
}

const convertDateToRequiredFormat = (dateString: string, format: string): string => {
    let [year, month, day] = dateString.split('-')
    
    month = parseInt(month, 10).toString()
    day = parseInt(day, 10).toString()

    const formattedDate = format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)

    return formattedDate
}

const isDateOutsideOfBookingThreshold = (dateSelect : { value : string }, bookingThreshold: number = 0) => {
    const now = moment()
    const bookingDate = moment(dateSelect.value);
    const thresholdDate = now.add(bookingThreshold, 'day');

    return bookingDate.isAfter(thresholdDate)
}

const isBookingInPast = (dateSelect : { value : string }, timeCourtSelect : { value : string }) => {
    const now = moment()
    const [time] = timeCourtSelect.value
    const [hours, minutes] = time.split(':')
    const bookingDate = moment(dateSelect.value)
        .set('hour', parseInt(hours))
        .set('minute', parseInt(minutes));

    return bookingDate.isBefore(now) || bookingDate.isSame(now)
}

export {
    createTestBookingMoment,
    createBookingMoment,
    convertDateToRequiredFormat,
    isDateOutsideOfBookingThreshold,
    isBookingInPast
}