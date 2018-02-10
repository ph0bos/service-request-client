'use strict';

const AbstractRequest = require('../abstract-request');
const resolver        = require('../resolvers/container-dns-resolver');

/**
 *
 */
class ContainerDNSRequest extends AbstractRequest {

  /**
   *
   * @param host
   * @param port
   * @param servicePath
   * @param options
   */
  constructor(host, port, servicePath, options = {}) {
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
