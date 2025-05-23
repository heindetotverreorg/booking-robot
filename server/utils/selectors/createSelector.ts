import type { Action } from '@/types/flow'
import getBookingTime from '@/server/utils/selectors/getBookingTime'
import getBookingCourt from '@/server/utils/selectors/getBookingCourt'
import getBookingDate from '@/server/utils/selectors/getBookingDate';
import convertDateToRequiredFormat from '@/server/utils/time/convertDateToRequiredFormat'

type FunctionMap = {
    [key: string]: Function;
};

export default (action : Action) => {
    let { value, replaceValue, selector } = action

    const occurences = action.selector.match(/{(.*?)}/g) || []

    if (!Array.isArray(value)) {
        value = [value as string]
    }

    occurences.forEach((_, index) => {
        const extractedFunctionName = extractValue(selector)
        const selectorCreationFunction = validateExtractedValue(extractedFunctionName) as Function
        const newSelector = selectorCreationFunction(value[index], replaceValue)
    
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
    getBookingDate,
    getBookingTime,
    getBookingCourt
};