'use strict';

const fs = require('fs');

/**
 * Read file
 * @param filepath
 * @returns {Promise}
 */
function getFileContent(filepath) {
  return new Promise((resolve, reject) =>
    fs.readFile(filepath, 'utf8', (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf);
      }
    })
  );
}

module.exports = getFileContent;
