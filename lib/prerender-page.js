const puppeteer = require('puppeteer');

module.exports = function prerenderPage() {
    const browserPromise = puppeteer.launch();

    function render(url) {
        return new Promise(async resolve => {
            const browser = await browserPromise;
            const page = await browser.newPage();
            const pageNavigation = page.goto(url, { waitUntil: 'networkidle2' });

            await page.exposeFunction('@@prerender-doneRendering', async html => {
                resolve(html);
                console.log('---');
                console.log(html);
                console.log('---');
                await pageNavigation;
                await page.close();
            });
            await page.exposeFunction('@@prerender-isPrerenderServer', async () => {
                return true;
            });
        });
    }
    return { render };
};
