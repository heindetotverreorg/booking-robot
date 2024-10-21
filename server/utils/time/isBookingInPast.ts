import moment from 'moment-timezone';

export default (dateSelect : { value : string }, timeCourtSelect : { value : string }) => {
    const now = moment()
    const [time] = timeCourtSelect.value
    const [hours, minutes] = time.split(':')
    const bookingDate = moment(dateSelect.value)
        .set('hour', parseInt(hours))
        .set('minute', parseInt(minutes));

    return bookingDate.isBefore(now) || bookingDate.isSame(now)
}
