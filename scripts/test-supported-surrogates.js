// Ensures supportedSurrogates.json is up to date.

const fs = require('fs');
const path = require('path');

const surrogatesDir = path.join(__dirname, '..', 'surrogates');

const actualSurrogates = new Set();
let supportedSurrogates = require('../supportedSurrogates.json');
supportedSurrogates = new Set(supportedSurrogates);
let failed = false;

for (const surrogate of fs.readdirSync(surrogatesDir)) {
    if (!supportedSurrogates.has(surrogate)) {
        console.error(
            '🛑 Surrogate missing from supportedSurrogates.json:',
            surrogate
        );
        failed = true;
    }

    actualSurrogates.add(surrogate);
}

for (const surrogate of supportedSurrogates) {
    if (!actualSurrogates.has(surrogate)) {
        console.error(
            '🛑 Unknown surrogate found in supportedSurrogates.json:',
            surrogate
        );
        failed = true;
    }
}

if (failed) process.exit(1);
