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
    const { repeatValue, iteration } = config

    if (iteration === 1) return date

    let newDate

    switch (repeatValue) {
        case RepeatValues.DAILY:
            newDate = dayjs(date).add(1, 'days')
        case RepeatValues.EVERY_OTHER_DAY:
            newDate = dayjs(date).add(2, 'days')
        case RepeatValues.WEEKLY:
            newDate = dayjs(date).add(1, 'week')
        case RepeatValues.BI_WEEKLY:
            newDate = dayjs(date).add(2, 'week')
        case RepeatValues.MONTHLY:
            newDate = dayjs(date).add(1, 'month')
        default:
            newDate = dayjs(date).add(1, 'week')
    }

    if (returnDayjsObject) return newDate

    return newDate.format('YYYY-MM-DD')
}
