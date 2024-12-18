import { Dayjs } from 'dayjs'
import { config } from '../../config'
import { RepeatValues } from '../../../types/flow'

export default (date : Dayjs) => {
    const { repeatValue } = config
    switch (repeatValue) {
        case RepeatValues.DAILY:
            return `${date.minute()} ${date.hour()} * * *`
        case RepeatValues.EVERY_OTHER_DAY:
            return `${date.minute()} ${date.hour()} */2 * *`
        case RepeatValues.WEEKLY:
            return `${date.minute()} ${date.hour()} * * ${date.day()}`
        case RepeatValues.BI_WEEKLY:
            return `${date.minute()} ${date.hour()} * * ${date.day()}/2`
        case RepeatValues.MONTHLY:
            return `${date.minute()} ${date.hour()} ${date.date()} * *`;
        default:
            return `${date.minute()} ${date.hour()} * * ${date.day()}`
    }
}