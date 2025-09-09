import dayjs from 'dayjs';

export default (dateSelect : { value : string }, timeCourtSelect: { value : string[] }, bookingThreshold: number = 0) => {
    const now = dayjs()
    const [bookingTime] = timeCourtSelect.value;
    const bookingMoment = dayjs(`${dateSelect.value} ${bookingTime}:00`, 'YYYY-MM-DD HH:mm');

    const thresholdDate = now.add(72, 'hours');

    console.log('bookingMoment: ', bookingMoment.format('YYYY-MM-DD HH:mm:ss'))
    console.log('thresholdDate: ', thresholdDate.format('YYYY-MM-DD HH:mm:ss'))

    return bookingMoment.isAfter(thresholdDate) || false
}
