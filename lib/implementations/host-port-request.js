'use strict';

const AbstractRequestClient = require('../abstract-request-client');
const resolver = require('../resolvers/host-port-resolver');

/**
 *
 */
class HostPortRequest extends AbstractRequestClient {

  /**
   *
   * @param host
   * @param port
   * @param servicePath
   * @param options
   */
  constructor(host, port, servicePath, options = {}) {
    super(options);

    this.host = host;
    this.port = port;
    this.servicePath = servicePath;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  async resolveServiceBaseURL() {
    const hostPort = await resolver.resolve(this.host, this.port);
    return Promise.resolve(`${this.request.protocol}://${hostPort}/${this.servicePath}`);
  }
}

module.exports = HostPortRequest;
