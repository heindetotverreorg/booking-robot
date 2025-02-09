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
    customCronString = '',
    repeatValueTest
} : {
    isTest? : boolean,
    cronTestTime? : string,
    isWeeklyRepeatedFlow? : boolean,
    repeatValue? : string,
    customCronString? : string,
    repeatValueTest? : string
}) => {
    if (repeatValue) config.repeatValue = repeatValue
    if (repeatValueTest) config.repeatValue = repeatValueTest

    config.isTest = isTest
    config.customCronString = customCronString
    config.cronTestTime = cronTestTime
    config.isWeeklyRepeatedFlow = isWeeklyRepeatedFlow as boolean
}


const setIteration = (iteration: number) => {
    config.iteration = iteration
}

export {
    config,
    setConfig,
    setIteration
}