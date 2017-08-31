'use strict';

const PORT = 8080;

const http = require('http');
const url = require('url');

const isFileExist = require('./libs/isFileExist.js');
const getFileContent = require('./libs/getFileContent.js');
const getMimeType = require('./libs/getMimeType.js');

/**
 * Error handler
 * @param res
 * @returns {function(*)}
 */
function onError(res) {
  return (err) => {
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });

    const error = {
      status: 'error',
      reason: err ? err.toString() : 'Unknown error',
    };

    return res.end(JSON.stringify(error));
  };
}

/**
 * Request handler
 * @param req
 * @param res
 * @returns {Promise}
 */
function onRequest(req, res) {
  let pathname = url.parse(req.url).pathname;

  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filepath = `${__dirname}${pathname}`;
  const contentType = getMimeType(filepath);

  return isFileExist(filepath)
    .then(() => getFileContent(filepath))
    .then((content) => {
      res.writeHead(200, {
        'Content-Type': `${contentType}; charset=utf-8`,
      });

      return res.end(content);
    })
    .catch(onError(res));
}

http.createServer(onRequest).listen(PORT, () => console.log(`Server listening on port ${PORT}`));
