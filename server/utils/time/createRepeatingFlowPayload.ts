import dayjs from 'dayjs'
import { config } from '../../config'
import { RepeatValues } from '../../../types/flow'

export default ({
    date
} : {
    date : string
}) => {
    console.log('--- createRepeatingFlowPayload with date: ', date)
    const { repeatValue, iteration } = config

    console.log('--- current iteration: ', iteration) 

    if (iteration <= 1) {
        console.log('--- keep original date')
        console.log('--- original date: ', date)
        return date
    }

    console.log('--- create new date')

    let newDate

    switch (repeatValue) {
        case RepeatValues.TEST:
            newDate = dayjs(date).add(1 * iteration, 'days')
        case RepeatValues.DAILY:
            newDate = dayjs(date).add(1 * iteration, 'days')
        case RepeatValues.EVERY_OTHER_DAY:
            newDate = dayjs(date).add(2 * iteration, 'days')
        case RepeatValues.WEEKLY:
            newDate = dayjs(date).add(1 * iteration, 'week')
        case RepeatValues.BI_WEEKLY:
            newDate = dayjs(date).add(2 * iteration, 'week')
        case RepeatValues.MONTHLY:
            newDate = dayjs(date).add(1 * iteration, 'month')
        default:
            newDate = dayjs(date).add(1 * iteration, 'week')
    }

    console.log('--- original date: ', date)
    console.log('--- repeat value: ', repeatValue)
    console.log('--- new date: ', newDate.format('YYYY-MM-DD'))

    return newDate.format('YYYY-MM-DD')
}
