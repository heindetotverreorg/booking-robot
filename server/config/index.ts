const config = {
    isTest: true
}

const setConfig = ({
    isTest = true
} : {
    isTest : boolean
}) => {
    config.isTest = isTest
}

export {
    config,
    setConfig
}