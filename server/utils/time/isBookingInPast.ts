import dayjs from 'dayjs';


export default (dateSelect : { value : string }, timeCourtSelect : { value : string }) => {
    const now = dayjs()
    const [time] = timeCourtSelect.value
    const [hours, minutes] = time.split(':')
    const bookingDate = dayjs(dateSelect.value)
        .set('hour', parseInt(hours))
        .set('minute', parseInt(minutes));

    return bookingDate.isBefore(now) || bookingDate.isSame(now)
}
