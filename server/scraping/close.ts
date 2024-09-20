import { Browser } from 'puppeteer';

export const close = async (browser : Browser) => {
    console.log('wait 10 seconds before closing browser')
    await doDelay(10000);
    await browser.close();
};