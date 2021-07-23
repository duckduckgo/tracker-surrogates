/**
 * Tests mapping.json file for missing surrogate files, invalid match rules and checks for unused surrogates.
 */
const fs = require('fs');
const path = require('path');
const mapping = require('../mapping.json');
const surrogatesDir = path.join(__dirname, '../surrogates');
const URL = require('url').URL;

const knownSurrogates = [];

fs.readdirSync(surrogatesDir).forEach(filename => {
    const filepath = path.resolve(surrogatesDir, filename);
    const stat = fs.statSync(filepath);

    if (stat.isFile()) {
        knownSurrogates.push(filename);
    }
});

const seen = new Set();

Object.keys(mapping).forEach(domainKey => {
    const surrogateMappings = mapping[domainKey];

    surrogateMappings.forEach(([from, to]) => {
        if (!from.startsWith(domainKey)) {
            console.error(`🛑 Rule doesn't match domain - "${from}" doesn't match "${domainKey}"`);
            process.exit(1);
        }

        try {
            // eslint-disable-next-line no-new
            new URL(`https://${from}`);
        } catch (e) {
            console.error(`🛑 Rule is not a valid URL - "${from}"`);
            process.exit(1);
        }

        if (!knownSurrogates.includes(to)) {
            console.error(`🛑 Mapping file contains unknown surrogate - ${to}`);
            process.exit(1);
        }

        seen.add(to);
    });
});

knownSurrogates.forEach(name => {
    if (!seen.has(name)) {
        console.error(`🛑 One of the surrogates is not mentioned in the mapping file - ${name}`);
        process.exit(1);
    }
});
