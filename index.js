const { spawn } = require('child_process');
const createServer = require('./lib/create-server');

const time = ms => new Promise(r => setTimeout(r, ms));

(async () => {
    spawn('npx', ['parcel', 'public/index.html']);
    await time(400);
    createServer('http://localhost:1234/');
})();
