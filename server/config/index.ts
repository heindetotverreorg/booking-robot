const config = {
    isTest: true,
    cronTestTime: '',
    isWeeklyRepeatedFlow: false,
    repeatValue: '',
    customCronString: '',
    iteration: 0,
    people: ['']
}

const setConfig = ({
    isTest = false,
    cronTestTime = '',
    isWeeklyRepeatedFlow,
    repeatValue,
    customCronString = '',
    repeatValueTest,
    people = []
} : {
    isTest? : boolean,
    cronTestTime? : string,
    isWeeklyRepeatedFlow? : boolean,
    repeatValue? : string,
    customCronString? : string,
    repeatValueTest? : string,
    people? : string[]
}) => {
    if (repeatValue) config.repeatValue = repeatValue
    if (repeatValueTest) config.repeatValue = repeatValueTest

    config.isTest = isTest
    config.customCronString = customCronString
    config.cronTestTime = cronTestTime
    config.isWeeklyRepeatedFlow = isWeeklyRepeatedFlow as boolean
    config.people = people as string[]

    if (config.isTest) {
        console.log('--- test mode enbabled')
    }
}


const setIteration = (iteration: number) => {
    config.iteration = iteration
}

export {
    config,
    setConfig,
    setIteration
}