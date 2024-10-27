const config = {
    isTest: true,
    cronTestTime: '',
    isWeeklyRepeatedFlow: false
}

const setConfig = ({
    isTest = true,
    cronTestTime = '',
    isWeeklyRepeatedFlow = false
} : {
    isTest : boolean,
    cronTestTime : string,
    isWeeklyRepeatedFlow : boolean
}) => {
    config.isTest = isTest
    config.cronTestTime = cronTestTime,
    config.isWeeklyRepeatedFlow = isWeeklyRepeatedFlow
}

export {
    config,
    setConfig
}