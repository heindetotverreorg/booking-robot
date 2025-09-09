import dayjs from 'dayjs';

export default (bookingDate : string, time : string, bookingThreshold : number) => {
    console.log('-- is not daylight saving time')

    return dayjs(`${bookingDate}T${time}:00`)
        .subtract(72, 'hours')
}