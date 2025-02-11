import dayjs from 'dayjs'
import { config } from '../../config'
import { RepeatValues } from '../../../constants'

export default ({
    date
} : {
    date : string
}) => {
    const { repeatValue, iteration } = config

    if (iteration <= 1) {
        console.log('--- keep original date')
        return date
    }

    console.log('--- create new date')

    switch (true) {
        case repeatValue === RepeatValues.DAILY:
            return  dayjs(date).add(1, 'days').format('YYYY-MM-DD')
        case repeatValue === RepeatValues.EVERY_OTHER_DAY:
            return  dayjs(date).add(2, 'days').format('YYYY-MM-DD')
        case repeatValue === RepeatValues.WEEKLY:
            return  dayjs(date).add(1, 'week').format('YYYY-MM-DD')
        case repeatValue === RepeatValues.BI_WEEKLY:
            return  dayjs(date).add(2, 'week').format('YYYY-MM-DD')
        case repeatValue === RepeatValues.MONTHLY:
            return  dayjs(date).add(1, 'month').format('YYYY-MM-DD')
        case repeatValue === RepeatValues.TEST:
            return  dayjs(date).add(1, 'days').format('YYYY-MM-DD')
        default:
            return  dayjs(date).add(1, 'week').format('YYYY-MM-DD')
    }
}
