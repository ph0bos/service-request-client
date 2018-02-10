'use strict';

/**
 * Consul Resolver.
 */
class ConsulResolver {
  constructor () {

  }

  /**
   * Resolve service location using Consul.
   *
   * TODO: Implement.
   *
   * @param serviceName
   * @returns {Promise.<*>}
   */
  async resolve(serviceName) {
    return Promise.reject(new Error('Consul resolver not implemented'));
  }
}

module.exports = new ConsulResolver();