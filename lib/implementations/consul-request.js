'use strict';

const AbstractRequest = require('../abstract-request');
const resolver        = require('../resolvers/consul-resolver');

/**
 *
 */
class ConsulRequest extends AbstractRequest {

  /**
   *
   * @param host
   * @param port
   * @param servicePath
   * @param options
   */
  constructor(host, port, servicePath, options = {}) {
    super(options);
    this.serviceName = serviceName;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  async resolveServiceBaseURL() {
    const hostPort = await resolver.resolve(this.serviceName);
    return Promise.resolve(`${this.request.protocol}://${hostPort}/${this.serviceName}`);
  }
}

module.exports = ConsulRequest;
