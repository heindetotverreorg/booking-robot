import moment from 'moment-timezone';

// const timeZoneOffset = moment().tz('Europe/Amsterdam').utcOffset() / 60;

export default (bookingDate : string, bookingThreshold : number) => {
    return moment(bookingDate)
        // .set({ hours: 0 - timeZoneOffset, minutes: 0 })
        .subtract(bookingThreshold, 'day');
}