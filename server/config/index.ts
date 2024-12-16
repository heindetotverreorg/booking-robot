import { RepeatValues } from "@/types/flow"

const config = {
    isTest: true,
    cronTestTime: '',
    isWeeklyRepeatedFlow: false,
    repeatValue: RepeatValues.WEEKLY,
    customCronString: ''
}

const setConfig = ({
    isTest = true,
    cronTestTime = '',
    isWeeklyRepeatedFlow = false,
    repeatValue = RepeatValues.WEEKLY,
    customCronString = ''
} : {
    isTest : boolean,
    cronTestTime : string,
    isWeeklyRepeatedFlow : boolean,
    repeatValue : RepeatValues,
    customCronString : string
}) => {
    config.isTest = isTest
    config.cronTestTime = cronTestTime,
    config.isWeeklyRepeatedFlow = isWeeklyRepeatedFlow
    config.repeatValue = repeatValue
    config.customCronString = customCronString
}

export {
    config,
    setConfig
}