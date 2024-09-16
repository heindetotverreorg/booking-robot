import type { Action } from '@/types/flow'

type FunctionMap = {
    [key: string]: Function;
};

export default (action : Action) => {
    const { selector, value, format } = action

    const extractedFunctionName = extractValue(selector)
    const selectorCreationFunction = validateExtractedValue(extractedFunctionName) as Function
    const newSelector = selectorCreationFunction(value, format)

    if (selector.includes(`{${selectorCreationFunction.name}}`)) {
        action.selector = action.selector.replace(`{${selectorCreationFunction.name}}`, newSelector);
    }

    return action.selector
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
    convertDateToRequiredFormat
};