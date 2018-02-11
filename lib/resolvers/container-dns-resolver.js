'use strict';

/**
 * Docker Container DNS Resolver.
 */
class ContainerDNSResolver {
  constructor () {

  }

  /**
   * Container DNS (e.g. Docker Service Name) resolver.
   *
   * @param serviceName
   * @param port
   * @returns {Promise.<*>}
   */
  async resolve(serviceName, port = 80) {
    if (!serviceName || serviceName.length === 0) {
      return Promise.reject(new Error('service name must be provided'));
    }

    return Promise.resolve(`${serviceName}:${port}`);
  }
}

module.exports = new ContainerDNSResolver();