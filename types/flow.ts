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
    value?: string | number | (string | number)[],
    waitSelector?: string,
    delay?: number,
    format?: string
}

enum StepNames {
    login ='login',
    selectSport = 'selectSport',
    selectDate = 'selectDate',
    selectCourtAndTime = 'selectCourtAndTime',
    selectLongestPlaytime = 'selectLongestPlaytime'
}

export type { Flow, Step, Action }
export { StepNames }