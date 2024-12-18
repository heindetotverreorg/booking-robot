import { RepeatValues } from "@/types/flow"

const config = {
    isTest: false,
    cronTestTime: '',
    isWeeklyRepeatedFlow: false,
    repeatValue: '',
    customCronString: '',
    iteration: 0
}

const setConfig = ({
    isTest,
    cronTestTime,
    isWeeklyRepeatedFlow,
    repeatValue,
    customCronString,
    iteration
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