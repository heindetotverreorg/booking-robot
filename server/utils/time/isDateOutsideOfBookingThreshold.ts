import dayjs from 'dayjs';

export default (dateSelect : { value : string }, timeCourtSelect: { value : string[] }, bookingThreshold: number = 0) => {
    const now = dayjs()
    const [bookingTime] = timeCourtSelect.value;
    const bookingMoment = dayjs(`${dateSelect.value} ${bookingTime}:00`, 'YYYY-MM-DD HH:mm');

    const thresholdDate = now.add(bookingThreshold, 'hours');

    return bookingMoment.isAfter(thresholdDate) || false
}
