import { Dayjs } from 'dayjs'
import { config } from '../../config'
import { RepeatValues } from '../../../constants'

export default (date : Dayjs) => {
    const { repeatValue } = config
    switch (true) {
        case repeatValue === RepeatValues.TEST:
            return `*/2 * * * *`
        case repeatValue === RepeatValues.DAILY:
            return `${date.minute()} ${date.hour()} * * *`
        case repeatValue === RepeatValues.EVERY_OTHER_DAY:
            return `${date.minute()} ${date.hour()} */2 * *`
        case repeatValue === RepeatValues.WEEKLY:
            return `${date.minute()} ${date.hour()} * * ${date.day()}`
        case repeatValue === RepeatValues.BI_WEEKLY:
            return `${date.minute()} ${date.hour()} * * ${date.day()}/2`
        case repeatValue === RepeatValues.MONTHLY:
            return `${date.minute()} ${date.hour()} ${date.date()} * *`;
        default:
            return `${date.minute()} ${date.hour()} * * ${date.day()}`
    }
}