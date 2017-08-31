'use strict';

const fs = require('fs');

/**
 * Check if file exist
 * @param filepath
 * @returns {Promise}
 */
function isFileExist(filepath) {
  return new Promise((resolve, reject) =>
    fs.exists(filepath, (isExist) => {
      if (isExist) {
        resolve(true);
      } else {
        reject('File not found');
      }
    })
  );
}

module.exports = isFileExist;
