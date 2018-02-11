'use strict';

require('../helper');

const resolver = require('../../lib/resolvers/host-port-resolver');

describe('container-dns-resolver', () => {
  describe('#resolve()', () => {
    it('should return an expected response when provided with a name and port', async () => {
      const host = await resolver.resolve('www.google.com', 8001);
      host.should.equal('www.google.com:8001');
    });

    it('should return an expected response when provided with a name and default the port to 80', async () => {
      const host = await resolver.resolve('www.google.com');
      host.should.equal('www.google.com:80');
    });

    it('should throw an error when no hostname is provided', async () => {
      try {
        await resolver.resolve(null, 8001);
      } catch (err) {
        err.message.should.equal('hostname must be provided');
      }
    });
  });
});