'use strict';

const AbstractRequestClient = require('../abstract-request-client');
const resolver = require('../resolvers/container-dns-resolver');

/**
 *
 */
class ContainerDNSRequest extends AbstractRequestClient {

  /**
   *
   * @param host
   * @param port
   * @param servicePath
   * @param options
   */
  constructor(containerName, containerPort, servicePath, options = {}) {
    super(options);

    this.containerName = containerName;
    this.containerPort = containerPort;
    this.servicePath = servicePath;
  }

  /**
   *
   * @returns {string}
   * @private
   */
  async resolveServiceBaseURL() {
    const hostPort = await resolver.resolve(this.containerName, this.containerPort);
    return Promise.resolve(`${this.request.protocol}://${hostPort}/${this.servicePath}`);
  }
}

module.exports = ContainerDNSRequest;
