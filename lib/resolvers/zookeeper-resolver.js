'use strict';

/**
 * ZooKeeper Resolver.
 */
class ZookeeperResolver {
  constructor () {

  }

  /**
   * Resolve service location using ZooKeeper.
   *
   * TODO: Implement.
   *
   * @param serviceName
   * @returns {Promise.<*>}
   */
  async resolve(serviceName) {
    return Promise.reject(new Error('ZooKeeper resolver not implemented'));
  }
}

module.exports = new ZookeeperResolver();