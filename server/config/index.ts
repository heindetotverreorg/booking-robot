import { RepeatValues } from "@/types/flow"

const config = {
    isTest: true,
    cronTestTime: '',
    isWeeklyRepeatedFlow: false,
    repeatValue: RepeatValues.WEEKLY
}

const setConfig = ({
    isTest = true,
    cronTestTime = '',
    isWeeklyRepeatedFlow = false,
    repeatValue = RepeatValues.WEEKLY
} : {
    isTest : boolean,
    cronTestTime : string,
    isWeeklyRepeatedFlow : boolean,
    repeatValue : RepeatValues
}) => {
    config.isTest = isTest
    config.cronTestTime = cronTestTime,
    config.isWeeklyRepeatedFlow = isWeeklyRepeatedFlow
    config.repeatValue = repeatValue
}

export {
    config,
    setConfig
}