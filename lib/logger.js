'use strict';

const bunyan = require('bunyan');

module.exports = bunyan.createLogger({ name: 'request-service-discovery-v2' });