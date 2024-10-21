import moment from 'moment-timezone';

export default (dateSelect : { value : string }, bookingThreshold: number = 0) => {
    const now = moment()
    const bookingDate = moment(dateSelect.value);
    const thresholdDate = now.add(bookingThreshold, 'day');

    return bookingDate.isAfter(thresholdDate)
}
