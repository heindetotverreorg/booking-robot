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
    if (repeatValue) config.repeatValue = repeatValue

    config.isTest = isTest
    config.customCronString = customCronString
    config.cronTestTime = cronTestTime
    config.isWeeklyRepeatedFlow = isWeeklyRepeatedFlow as boolean
}


const setIteration = (iteration: number) => {
    console.log('--- set iteration')
    console.log('--- current iteration: ', config.iteration)
    console.log('--- new iteration: ', iteration)
    config.iteration = iteration
}

export {
    config,
    setConfig,
    setIteration
}