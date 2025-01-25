interface Flow {
    name: StepNames,
    id: string,
    type: string,
    url: string,
    bookingThreshold: number,
    steps: Step[]
}

interface Step {
    name: string,
    actions: Action[],
}

interface Action {
    type: string,
    key: string,
    selector: string,
    parentSelector?: string,
    value?: string | number | (string | number)[] | boolean,
    waitSelector?: string,
    waitSelectorHidden?: string,
    delay?: number,
    replaceValue?: string
}

enum StepNames {
    login ='login',
    selectSport = 'selectSport',
    selectDate = 'selectDate',
    selectCourtAndTime = 'selectCourtAndTime',
    selectLongestPlaytime = 'selectLongestPlaytime',
    confirmBooking = 'confirmBooking'
}

enum ActionNames {
    input ='input',
    select = 'select',
    click = 'click'
}

enum RepeatValues {
    TEST = 'Elke minuut',
    DAILY = 'Elke dag',
    EVERY_OTHER_DAY = 'Om de dag',
    WEEKLY = 'Elke week',
    BI_WEEKLY = 'Elke twee weken',
    MONTHLY = 'Elke maand'
}

export type { Flow, Step, Action }
export { StepNames, ActionNames, RepeatValues }