import type { Action, Step } from '@/types/flow'
import { Page } from 'puppeteer';

export const runApiMethod = async ({
    steps,
    page,
    payload,
    url
} : {
    steps: Step[],
    page: Page,
    payload: Record<string, Action>,
    url: string
}) => {
    const URL_TO_POST = 'https://bent.baanreserveren.nl/reservations/confirm'
}