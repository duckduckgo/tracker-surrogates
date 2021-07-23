/**
 * Runs all surrogates inside of a (fake) browser enviroment to check for obvious runtime issues.
 */
const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const { exit } = require('process');
const surrogatesDir = path.join(__dirname, '../surrogates');

const allSurrogates = fs.readdirSync(surrogatesDir).map(filename => {
    const filepath = path.resolve(surrogatesDir, filename);
    const stat = fs.statSync(filepath);

    if (stat.isFile()) {
        let resolve, reject;
        // eslint-disable-next-line promise/param-names
        const promise = new Promise((res, rej) => { resolve = res; reject = rej; });

        const surrogateText = fs.readFileSync(filepath, 'utf-8');

        const virtualConsole = new jsdom.VirtualConsole();

        virtualConsole.on('jsdomError', (e) => {
            reject(`🛑 ${filename} fails with error "${e}"`);
        });

        // eslint-disable-next-line no-new
        const dom = new jsdom.JSDOM(`<body><script>${surrogateText}</script></body>`, { runScripts: 'dangerously', virtualConsole });

        dom.window.addEventListener('DOMContentLoaded', () => resolve());

        return promise;
    } else {
        return Promise.resolve();
    }
});

Promise.all(allSurrogates)
    .catch(e => {
        console.log(e);
        exit(1);
    });
