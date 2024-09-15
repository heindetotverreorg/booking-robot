import puppeteer from 'puppeteer';

export default defineEventHandler(async (event) => {
    const {
        email = 'mpoortvliet8570',
        password = '10*Matthias'
    } = await readBody(event)

    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    try {
        await page.goto('https://bent.baanreserveren.nl/reservations');

        await page.$eval('input[name="username"]', (el, email) => {
            el.value = email
    
            return el.value
        }, email);
        await page.$eval('input[name="password"]', (el, password) => {
            el.value = password
    
            return el.value
        }, password);
        await page.waitForSelector('.button3')
        await page.click('.button3')
    
        const response = await page.$eval('body', el => {
            return el.innerHTML
        });
    
        await browser.close();
    
        return response;
    } catch (error) {
        console.error(error)

        return error
    }
});