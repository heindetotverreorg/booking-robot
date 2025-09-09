import dayjs from 'dayjs';

export default (dateSelect : { value : string }, bookingThreshold: number = 0) => {
    const now = dayjs()
    const bookingDate = dayjs(dateSelect.value);
    // const thresholdDate = now.add(bookingThreshold, 'day');
    const thresholdDate = now.add(72, 'hours');

    console.log('bookingDate: ', bookingDate.format('YYYY-MM-DD HH:mm:ss'))
    console.log('thresholdDate: ', thresholdDate.format('YYYY-MM-DD HH:mm:ss'))

    return bookingDate.isAfter(thresholdDate) || false
}
