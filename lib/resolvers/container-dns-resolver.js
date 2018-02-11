'use strict';

/**
 * Docker Container DNS Resolver.
 */
class ContainerDNSResolver {
  constructor () {

  }

  /**
   *
   * @param name
   * @param port
   * @returns {Promise.<*>}
   */
  async resolve(name, port = 80) {
    return Promise.resolve(`${name}:${port}`);
  }
}

module.exports = new ContainerDNSResolver();