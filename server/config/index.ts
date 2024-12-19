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
    isTest = false,
    cronTestTime = '',
    isWeeklyRepeatedFlow,
    repeatValue,
    customCronString = ''
} : {
    isTest? : boolean,
    cronTestTime? : string,
    isWeeklyRepeatedFlow? : boolean,
    repeatValue? : RepeatValues,
    customCronString? : string
}) => {
    if (isWeeklyRepeatedFlow) config.isWeeklyRepeatedFlow = isWeeklyRepeatedFlow
    if (repeatValue) config.repeatValue = repeatValue

    config.isTest = isTest
    config.customCronString = customCronString
    config.cronTestTime = cronTestTime

    console.log('LATEST CONFIG STATE:', config)
}


const setIteration = (iteration: number) => {
    config.iteration = iteration
}

export {
    config,
    setConfig,
    setIteration
}