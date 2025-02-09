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

export type { Flow, Step, Action }
export { StepNames, ActionNames }