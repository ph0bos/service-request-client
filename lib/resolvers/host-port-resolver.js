'use strict';

/**
 * Simple Host Port Resolver.
 */
class HostPortResolver {
  constructor () {

  }

  /**
   * Basic host and port resolver.
   *
   * @param hostName
   * @param port
   * @returns {Promise.<*>}
   */
  async resolve(hostName, port = 80) {
    if (!hostName || hostName.length === 0) {
      return Promise.reject(new Error('hostname must be provided'));
    }

    return Promise.resolve(`${hostName}:${port}`);
  }
}

module.exports = new HostPortResolver();