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
    skip?: boolean,
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
    replaceValue?: string,
    hasPossiblePaymentAccount?: boolean,
    paymentTries?: number,
}

enum StepNames {
    login ='login',
    selectSport = 'selectSport',
    selectDate = 'selectDate',
    selectCourtAndTime = 'selectCourtAndTime',
    selectLongestPlaytime = 'selectLongestPlaytime',
    confirmBooking = 'confirmBooking',
    selectPeople = 'selectPeople',
    selectPeopleSubmit = 'selectPeopleSubmit',
    closePeopleModal = 'closePeopleModal'
}

enum ActionNames {
    input ='input',
    select = 'select',
    click = 'click'
}

export type { Flow, Step, Action }
export { StepNames, ActionNames }