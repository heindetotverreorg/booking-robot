interface Flow {
    name: string,
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
    value?: string | number | (string | number)[],
    waitSelector?: string,
    delay?: number,
    format?: string
}

export type { Flow, Step, Action }