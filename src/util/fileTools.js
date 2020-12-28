const fs = require('fs');
const path = require('path');

/**
 * read path info
 * @param {string} path file path 
 */
function getStat(path) {
    return new Promise((resolve, reject) => {
        fs.stat(path, (err, stats) => {
            if (err) {
                resolve(false);
            } else {
                resolve(stats);
            }
        })
    })
}

/**
  * make dir 
  * @param {string} dir directory
  */
function mkdir(dir) {
    return new Promise((resolve, reject) => {
        fs.mkdir(dir, err => {
            if (err) {
                resolve(false);
            } else {
                resolve(true);
            }
        })
    })
}

/**
  * Determines if the path exists, or creates it if it doesn't
  * @param {string} dir directory
  */
async function dirExists(dir) {
    let isExists = await getStat(dir);
    // if path exist and isn't file then, return true 
    if (isExists && isExists.isDirectory()) {
        return true;
    } else if (isExists) {
        // if path exist but is file, return false
        return false;
    }
    //if the path does not exist, take the superior path
    let tempDir = path.parse(dir).dir;
    //recursive util superior path exist and create
    let status = await dirExists(tempDir);
    let mkdirStatus;
    if (status) {
        mkdirStatus = await mkdir(dir);
    }
    return mkdirStatus;
}

module.exports = { dirExists };
