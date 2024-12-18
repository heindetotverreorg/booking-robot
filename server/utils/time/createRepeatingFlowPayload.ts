import dayjs from 'dayjs'
import { config } from '../../config'
import { RepeatValues } from '../../../types/flow'

export default (date : string) => {
    const { repeatValue, iteration } = config

    if (iteration === 1) return date

    switch (repeatValue) {
        case RepeatValues.DAILY:
            return dayjs(date).add(1, 'days').format('YYYY-MM-DD')
        case RepeatValues.EVERY_OTHER_DAY:
            return dayjs(date).add(2, 'days').format('YYYY-MM-DD')
        case RepeatValues.WEEKLY:
            return dayjs(date).add(1, 'week').format('YYYY-MM-DD')
        case RepeatValues.BI_WEEKLY:
            return dayjs(date).add(2, 'week').format('YYYY-MM-DD')
        case RepeatValues.MONTHLY:
            return dayjs(date).add(1, 'month').format('YYYY-MM-DD')
        default:
            return dayjs(date).add(1, 'week').format('YYYY-MM-DD')
    }
}
