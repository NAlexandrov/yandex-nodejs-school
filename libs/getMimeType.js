'use strict';

/**
 * Try to detect mime type
 * @param filepath
 * @returns {String}
 */
function getMimeType(filepath) {
  const extenstion = filepath.split('.').pop();

  switch (extenstion) {
    case 'json':
      return 'application/json';
    case 'js':
      return 'application/javascript';
    case 'css':
      return 'text/css';
    default:
      return 'text/html';
  }
}

module.exports = getMimeType;
