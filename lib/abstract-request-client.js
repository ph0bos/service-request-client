'use strict';

const util    = require('util');
const retry   = require('retry');
const unirest = require('unirest');
const uuid    = require('uuid');
const check   = require('check-types');
const log     = require('./logger');

const REQUEST_PROTOCOL                = 'http';
const REQUEST_TIMEOUT_MS              = 5000;
const RETRY_DEFAULTS                  = { retries: 2, minTimeout: 75, maxTimeout: 750 };
const METHODS_ALLOWED                 = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"];
const DEFAULT_CORRELATION_HEADER_NAME = 'X-CorrelationID';

/**
 *
 */
class AbstractRequestClient {

  /**
   *
   * @param containerName
   * @param containerPort
   * @param serviceName
   * @param options
   */
  constructor(options = {}) {
    if (new.target === AbstractRequestClient) {
      throw new TypeError("Cannot construct AbstractRequestClient instances directly, please extend");
    }

    this.verbose = options.verbose || false;

    // Correlation
    this.correlationHeaderName = options.correlationHeaderName || DEFAULT_CORRELATION_HEADER_NAME;

    // HTTP request
    this.request          = {};
    this.request.protocol = options.protocol || REQUEST_PROTOCOL;
    this.request.timeout  = options.timeoutMs || REQUEST_TIMEOUT_MS;

    // Retry
    this.retry            = {};
    this.retry.retries    = (options.retries || options.retries >= 0) ? options.retries : RETRY_DEFAULTS.retries;
    this.retry.minTimeout = options.minTimeoutMs || RETRY_DEFAULTS.minTimeout;
    this.retry.maxTimeout = options.maxTimeoutMs || RETRY_DEFAULTS.maxTimeout;
  }

  /**
   * Perform a GET request.
   *
   * @param uri
   * @param options
   * @returns {Promise}
   */
  async get(uri, options = {}) {
    check.assert.string(uri, 'uri [string] must be provided');
    check.assert.maybe.object(options, 'options [object] must be provided');

    return this.method('GET', uri, options, null);
  }

  /**
   * Perform an OPTIONS request.
   *
   * @param uri
   * @param options
   * @returns {Promise}
   */
  async options(uri, options = {}) {
    check.assert.string(uri, 'uri [string] must be provided');
    check.assert.maybe.object(options, 'options [object] must be provided');

    return this.method('OPTIONS', uri, options, null);
  }

  /**
   * Perform a POST request.
   *
   * @param uri
   * @param options
   * @param body
   * @returns {Promise}
   */
  async post(uri, options = {}, body) {
    check.assert.string(uri, 'uri [string] must be provided');
    check.assert.maybe.object(options, 'options [object] must be provided');

    return this.method('POST', uri, options, body);
  }

  /**
   * Perform a PUT request.
   *
   * @param uri
   * @param options
   * @param body
   * @returns {Promise}
   */
  async put(uri, options = {}, body) {
    check.assert.string(uri, 'uri [string] must be provided');
    check.assert.maybe.object(options, 'options [object] must be provided');

    return this.method('PUT', uri, options, body);
  }

  /**
   * Perform a DELETE request.
   *
   * @param uri
   * @param options
   * @param body
   * @returns {Promise}
   */
  async delete(uri, options = {}, body) {
    check.assert.string(uri, 'uri [string] must be provided');
    check.assert.maybe.object(options, 'options [object] must be provided');

    return this.method('DELETE', uri, options, body);
  }

  /**
   * Perform a HEAD request.
   *
   * @param uri
   * @param options
   * @param body
   * @returns {Promise}
   */
  async head(uri, options = {}, body) {
    check.assert.string(uri, 'uri [string] must be provided');
    check.assert.maybe.object(options, 'options [object] must be provided');

    return this.method('HEAD', uri, options, body);
  }

  /**
   * Perform a PATCH request.
   *
   * @param uri
   * @param options
   * @param body
   * @returns {Promise}
   */
  async patch(uri, options = {}, body) {
    check.assert.string(uri, 'uri [string] must be provided');
    check.assert.maybe.object(options, 'options [object] must be provided');

    return this.method('PATCH', uri, options, body);
  }

  /**
   *
   * @param method
   * @param uri
   * @param options
   * @param body
   * @returns {Promise}
   */
  async method(method, uri, options = {}, body) {
    check.assert.string(method, 'method [string] must be provided');
    check.assert.string(uri, 'uri [string] must be provided');
    check.assert.maybe.object(options, 'options [object] must be provided');

    return new Promise((resolve, reject) => {
      if (!method){
        return reject(new Error('HTTP method must be defined'));
      }

      if (METHODS_ALLOWED.indexOf(method.toUpperCase()) == -1){
        return reject(new Error('Unrecognised method:' + method));
      }

      this._executeRequest(method, uri, options, body, (err, res) => {
        if (err) return reject(err);
        resolve(res);
      });
    });
  }

  /**
   *
   * @returns {string}
   * @private
   */
  async resolveServiceBaseURL() {
    return `${this.request.protocol}://localhost`;
  }

  /**
   *
   * @param method
   * @param uri
   * @param options
   * @param body
   * @param callback
   * @private
   */
  async _executeRequest(method, uri, options = {}, body, callback) {
    let headers = {};
    let query   = {};

    if (!options || options === null) {
      options = {};
    }

    if (options.headers) {
      headers = options.headers;
    }

    if (options.query) {
      query = options.query;
    }

    if (!options.correlationId) {
      options.correlationId = uuid.v4();
    }

    headers[this.correlationHeaderName] = options.correlationId;

    const requestLog = log.child({ correlationId: options.correlationId }, true);

    const operation = retry.operation(this.retry);

    operation.attempt(async (attemptCount) => {

      // Inherit
      let baseUrl;

      try {
        baseUrl = await this.resolveServiceBaseURL();
      } catch (err) {
        if (operation.attempts() >= this.retry.retries) return callback(new Error('unable to resolve service location'));
      }

      const url = `${baseUrl}/${uri}`;

      const request = this._applyRequestDefaults(unirest(method, url, headers, body));

      if (query) {
        request.query(query);
      }

      if (this.verbose) {
        requestLog.info({ method: method, url: url, headers: headers, query: query, attempt: attemptCount }, "performing request");
      }

      this._end(request, (err, res) => {
        if (err) {
          // If the error is not an object, add the error as a message to a new error object.
          if (typeof err !== "object"){
            err = { message: err };
          }

          err.attemptCount = attemptCount;

          requestLog.error({ error: err, method: method, url: url, headers: headers, query: query, attempt: attemptCount }, "request failed with an error");

          if (!err.isClientError && operation.retry(err)) return;
        } else {
          if (this.verbose) {
            requestLog.info({ method: method, url: url, headers: headers, query: query, attempt: attemptCount }, "request completed successfully");
          }
        }

        callback(err, res);
      });
    });
  }

  /**
   * Handle the unirest request end.
   *
   * @param request
   * @param callback
   * @private
   */
  _end(request, callback) {
    request.end((res) => {
      if (res.serverError) {
        return callback({ error: res.body, causedBy: res.error, isServerError: true }, res);
      }

      if (res.clientError) {
        return callback({ error: res.body, causedBy: res.error, isClientError: true }, res);
      }

      callback({ error: res.error, body: res.body }, res);
    });
  }

  /**
   *
   * @param request
   * @private
   */
  _applyRequestDefaults(request = {}) {
    request.timeout(this.request.timeout);
    return request;
  }
}

module.exports = AbstractRequestClient;