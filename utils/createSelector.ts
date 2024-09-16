import type { Action } from '@/types/flow'

export default (action : Action) => {
    const { selector } = action

    const value = action.value as string

    console.log(action)

    const regex = /cal_\{([^}]+)\}/;
    const match = value.match(regex);

    console.log(match, selector)

    return ''
}