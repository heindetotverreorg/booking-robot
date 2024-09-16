import type { Action } from '@/types/flow'

type FunctionMap = {
    [key: string]: Function;
};

export default (action : Action) => {
    let { value, format, selector } = action

    const occurences = action.selector.match(/{(.*?)}/g) || []

    if (!Array.isArray(value)) {
        value = [value as string]
    }

    occurences.forEach((_, index) => {
        const extractedFunctionName = extractValue(selector)
        const selectorCreationFunction = validateExtractedValue(extractedFunctionName) as Function
        const newSelector = selectorCreationFunction(value[index], format)
    
        if (selector.includes(`{${selectorCreationFunction.name}}`)) {
            selector = selector.replace(`{${selectorCreationFunction.name}}`, newSelector);
        }
    })

    return selector
}

function extractValue(inputString : string) {
    const match = inputString.match(/\{(.*?)\}/);
    if (match) {
        return match[1];
    }
    return '';
}

function validateExtractedValue(functionName: string) {
    if (functionMap[functionName]) {
        return functionMap[functionName];
    } else {
        throw new Error(`selectorCreationFunction ${functionName} not found`);
    }
}

const functionMap: FunctionMap = {
    convertDateToRequiredFormat,
    getBookingTime,
    getBookingCourt
};