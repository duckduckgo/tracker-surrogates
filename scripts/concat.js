/**
 * Builds single file with all surrogates consumed by clients that fetch surrogates from a remote endpoint.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mapping = require('../mapping.json');
const surrogatesDir = path.join(__dirname, '../surrogates');
const buildsDir = path.join(__dirname, '../builds');

let output = `# This file contains "surrogates". Surrogates are small scripts that our apps and extensions serve in place of trackers that cause site breakage when blocked.
# Learn more: https://github.com/duckduckgo/tracker-surrogates`;

function findSurrogateDomain (surrogate) {
    const domain = Object.keys(mapping).find(domainKey =>
        mapping[domainKey].find(([, to]) => (to === surrogate))
    );

    if (domain) {
        return domain;
    }

    return null;
}

fs.readdirSync(surrogatesDir).forEach(filename => {
    const filepath = path.resolve(surrogatesDir, filename);
    const stat = fs.statSync(filepath);

    if (stat.isFile()) {
        const surrogateText = fs.readFileSync(filepath, 'utf-8');
        const surrogateDomain = findSurrogateDomain(filename);

        if (!surrogateDomain) {
            throw new Error(`🛑 Domain for surrogate missing - ${filename}.`);
        }

        // header that clients use to separate surrogates from each other when parsing surrogates file
        output += `
${surrogateDomain}/${filename} application/javascript
${surrogateText}`;
    }
});

if (!fs.existsSync(buildsDir)) {
    fs.mkdirSync(buildsDir);
}

fs.writeFileSync(path.join(buildsDir, 'surrogates-next.txt'), output);

const hash = crypto.createHash('md5').update(output).digest('hex');
console.log('MD5 hash: ', hash);
