import type { Action } from '@/types/flow'

export default (action : Action) => {
    const { selector } = action

    return selector.includes('{') && selector.includes('}')
}