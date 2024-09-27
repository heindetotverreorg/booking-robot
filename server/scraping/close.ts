import { Browser } from 'puppeteer';

export const close = async (browser : Browser) => {
    await browser.close();
};