import { RepeatValues } from "@/types/flow"

const config = {
    isTest: true,
    cronTestTime: '',
    isWeeklyRepeatedFlow: false,
    repeatValue: '',
    customCronString: '',
    iteration: 0
}

const setConfig = ({
    isTest = true,
    cronTestTime = '',
    isWeeklyRepeatedFlow,
    repeatValue,
    customCronString = '',
    iteration
} : {
    isTest? : boolean,
    cronTestTime? : string,
    isWeeklyRepeatedFlow? : boolean,
    repeatValue? : RepeatValues,
    customCronString? : string,
    iteration? : number
}) => {
    if (isWeeklyRepeatedFlow) config.isWeeklyRepeatedFlow = isWeeklyRepeatedFlow
    if (repeatValue) config.repeatValue = repeatValue
    if (iteration) config.iteration = iteration

    config.isTest = isTest
    config.customCronString = customCronString
    config.cronTestTime = cronTestTime
}

export {
    config,
    setConfig
}