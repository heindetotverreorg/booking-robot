import dayjs from 'dayjs'
import { config } from '../../config'
import { RepeatValues } from '../../../types/flow'

export default ({
    date,
    returnDayjsObject = false
} : {
    date : string,
    returnDayjsObject?: boolean
}) => {
    console.log('--- createRepeatingFlowPayload with date: ', date)
    const { repeatValue, iteration } = config

    console.log('--- current iteration: ', iteration) 
    console.log('--- repeat value: ', repeatValue)

    if (iteration <= 1) {
        console.log('--- keep original date')
        return returnDayjsObject ? dayjs(date) : date
    }

    console.log('--- create new date')

    let newDate

    switch (repeatValue) {
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

    if (returnDayjsObject) return newDate

    return returnDayjsObject ? newDate : newDate.format('YYYY-MM-DD')
}
