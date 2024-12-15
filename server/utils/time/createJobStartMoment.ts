import moment from 'moment-timezone';

export default (bookingDate : string, bookingThreshold : number) => {
    return moment(bookingDate)
        .set({
            hours: 0,
            minutes: 0 
        })
        .subtract(bookingThreshold, 'day');
}