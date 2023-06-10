const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');

const pkg = require('../package.json');

const SEMVER_REGEX = /^(\d+)\.(\d+)\.(\d+)-?(.*)$/;
const versionMatch = SEMVER_REGEX.exec(pkg.version);
if (!versionMatch) {
    throw new Error('Unexpected version number: ' + pkg.version);
}

const major = versionMatch[1];
const minor = versionMatch[2];
const patch = versionMatch[3];

const configFile = path.resolve(__dirname, '..', 'plugin.xml');
updateVersion(configFile, /version="\d+\.\d+\.\d+"/, `version="${major}.${minor}.${patch}"`);


function updateVersion(file, searchValue, replacementValue) {
    const originalContent = fs.readFileSync(file, 'utf8');
    const updatedContent = originalContent.replace(searchValue, replacementValue);

    console.log(`updating file: ${file}`);
    fs.writeFileSync(file, updatedContent, 'utf8');

    // committing the version bumps on the project configs
    exec(`git add ${file}`);
}