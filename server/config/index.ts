const config = {
    isTest: true,
    cronTestTime: ''
}

const setConfig = ({
    isTest = true,
    cronTestTime = ''
} : {
    isTest : boolean,
    cronTestTime : string
}) => {
    config.isTest = isTest
    config.cronTestTime = cronTestTime
}

export {
    config,
    setConfig
}