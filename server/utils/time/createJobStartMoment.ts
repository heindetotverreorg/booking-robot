import dayjs from 'dayjs';

export default (bookingDate : string, bookingThreshold : number) => {
    return dayjs(bookingDate)
        .set('hour', 0)
        .set('minute', 0)
        .subtract(bookingThreshold, 'day');
}