const express = require('express');
const proxy = require('express-http-proxy');
const prerenderPage = require('./prerender-page');

const isFileName = filename => /\.[a-z]*?$/.test(filename);

function prerenderMiddleware(proxyUrl) {
    const router = express.Router();
    const { render } = prerenderPage();
    router.use(async (req, res, next) => {
        const url = `${proxyUrl}${req.url}`;
        if (isFileName(url)) {
            next();
        } else {
            const html = await render(url);
            res.end(html);
        }
    });
    router.use(proxy(proxyUrl));
    return router;
}

module.exports = function createServer(proxyUrl) {
    const server = express();
    server.use(prerenderMiddleware(proxyUrl));
    server.listen(1337, () => {
        console.log('server started at http://localhost:1337');
    });
};
