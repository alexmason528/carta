/* eslint consistent-return:0 */

const express = require('express');
const cors = require('cors')
const logger = require('./logger');
const argv = require('minimist')(process.argv.slice(2));
const setup = require('./middlewares/frontendMiddleware');
const mongoose = require('mongoose');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false;
const resolve = require('path').resolve;
const app = express();
const bodyParser = require('body-parser');

let mongoUri = isDev ? 'mongodb://localhost:27017/carta' : 'mongodb://heroku_mhwps3cx:585m6idt8moae9v55h3oh504dh@ds149934.mlab.com:49934/heroku_mhwps3cx';

mongoose.connect(mongoUri, {
  useMongoClient: true,
  /* other options */
});

require('dotenv').config();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
// In production we need to pass these values in instead of relying on webpack

app.use(cors());
app.use(bodyParser.json());
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 3000;

// Start your app.

app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});
