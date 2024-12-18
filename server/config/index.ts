import { RepeatValues } from "@/types/flow"

const config = {
    isTest: false,
    cronTestTime: '',
    isWeeklyRepeatedFlow: false,
    repeatValue: RepeatValues.WEEKLY,
    customCronString: '',
    iteration: 0
}

const setConfig = ({
    isTest = false,
    cronTestTime = '',
    isWeeklyRepeatedFlow = false,
    repeatValue = RepeatValues.WEEKLY,
    customCronString = '',
    iteration = 0
} : {
    isTest? : boolean,
    cronTestTime? : string,
    isWeeklyRepeatedFlow? : boolean,
    repeatValue? : RepeatValues,
    customCronString? : string,
    iteration? : number
}) => {
    if (isTest) config.isTest = isTest
    if (cronTestTime) config.cronTestTime = cronTestTime
    if (isWeeklyRepeatedFlow) config.isWeeklyRepeatedFlow = isWeeklyRepeatedFlow
    if (repeatValue) config.repeatValue = repeatValue
    if (customCronString) config.customCronString = customCronString
    if (iteration) config.iteration = iteration
}

export {
    config,
    setConfig
}