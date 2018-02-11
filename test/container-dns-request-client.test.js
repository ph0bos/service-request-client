'use strict';

require('./helper');

const Client = require('../').ContainerDNSClient;

// Fixtures
const GET_FIXTURE     = require('./fixtures/get.json');
const OPTIONS_FIXTURE = require('./fixtures/options.json');
const HEAD_FIXTURE    = require('./fixtures/head.json');
const PUT_FIXTURE     = require('./fixtures/put.json');
const POST_FIXTURE    = require('./fixtures/post.json');
const PATCH_FIXTURE   = require('./fixtures/patch.json');
const DELETE_FIXTURE  = require('./fixtures/delete.json');
const HEADERS         = { headers: { 'Content-Type': 'application/json' } };

let sandbox, client;

describe('container-dns-request-client', () => {
  beforeEach(() => {
    client = new Client('service-name', 8001, 'my/service/path/v1', { verbose: true, retries: 2 });

    sandbox = sinon.sandbox.create();
    sandbox.spy(client, '_executeRequest');
    sandbox.stub(client, '_end');
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('#get()', () => {
    it('should return an expected response when called with valid parameters', async () => {
      client._end.yields(null, GET_FIXTURE);

      const expected = {
        statusCode: 200,
        request: { method: 'GET', uri: { href: 'http://localhost:80/resource-name/123' } }
      };

      (await client.get('resource-name/123')).should.containSubset(expected);
      client._executeRequest.callCount.should.equal(1);
    });

    it('should not retry when a request fails due to a client error (4xx)', async () => {
      client._end.yields({ message: 'client error message', isClientError: true });

      try {
        (await client.get('resource-name/123'));
      } catch (err) {
        err.message.should.equal('client error message');
        err.attemptCount.should.equal(1);
        client._executeRequest.callCount.should.equal(1);
      }
    });

    it('should retry 3 times when a request fails due to a server error (5xx)', async () => {
      client._end.yields({ message: 'server error message', isServerError: true });

      try {
        (await client.get('resource-name/123'));
      } catch (err) {
        err.message.should.equal('server error message');
        err.attemptCount.should.equal(3);
        client._executeRequest.callCount.should.equal(1);
      }
    });
  });

  describe('#head()', () => {
    it('should return an expected response when called with valid parameters', async () => {
      client._end.yields(null, HEAD_FIXTURE);

      const expected = {
        statusCode: 200,
        request: { method: 'HEAD', uri: { href: 'http://localhost:80/resource-name/123' } }
      };

      (await client.head('resource-name/123')).should.containSubset(expected);
      client._executeRequest.callCount.should.equal(1);
    });
  });

  describe('#options()', () => {
    it('should return an expected response when called with valid parameters', async () => {
      client._end.yields(null, OPTIONS_FIXTURE);

      const expected = {
        statusCode: 200,
        request: { method: 'OPTIONS', uri: { href: 'http://localhost:80/resource-name/123' } }
      };

      (await client.options('resource-name/123')).should.containSubset(expected);
      client._executeRequest.callCount.should.equal(1);
    });
  });

  describe('#put()', () => {
    it('should return an expected response when called with valid parameters', async () => {
      client._end.yields(null, PUT_FIXTURE);

      const expected = {
        statusCode: 200,
        request: {
          method: 'PUT', uri: { href: 'http://localhost:80/resource-name/123' }, json: true, body: { message: 'hello' }
        }
      };

      (await client.put('resource-name/123', HEADERS, { message: 'hello' })).should.containSubset(expected);
      client._executeRequest.callCount.should.equal(1);
    });
  });

  describe('#post()', () => {
    it('should return an expected response when called with valid parameters', async () => {
      client._end.yields(null, POST_FIXTURE);

      const expected = {
        statusCode: 200,
        request: { method: 'POST', uri: { href: 'http://localhost:80/resource-name/123' }, json: true, body: { message: 'hello' } }
      };

      (await client.post('resource-name/123', HEADERS, { message: 'hello' })).should.containSubset(expected);
      client._executeRequest.callCount.should.equal(1);
    });
  });

  describe('#delete()', () => {
    it('should return an expected response when called with valid parameters', async () => {
      client._end.yields(null, DELETE_FIXTURE);

      const expected = {
        statusCode: 200,
        request: { method: 'DELETE', uri: { href: 'http://localhost:80/resource-name/123' }, json: true, body: { message: 'hello' } }
      };

      (await client.delete('resource-name/123', { headers: HEADERS }, { message: 'hello' })).should.containSubset(expected);
      client._executeRequest.callCount.should.equal(1);
    });
  });

  describe('#patch()', () => {
    it('should return an expected response when called with valid parameters', async () => {
      client._end.yields(null, PATCH_FIXTURE);

      const expected = {
        statusCode: 200,
        request: { method: 'PATCH', uri: { href: 'http://localhost:80/resource-name/123' }, json: true, body: { message: 'hello' } }
      };

      (await client.patch('resource-name/123', HEADERS, { message: 'hello' })).should.containSubset(expected);
      client._executeRequest.callCount.should.equal(1);
    });
  });

  describe('#method()', () => {
    it('should return an expected response when called with valid parameters for a GET request', async () => {
      client._end.yields(null, GET_FIXTURE);

      const expected = {
        statusCode: 200,
        request: { method: 'GET', uri: { href: 'http://localhost:80/resource-name/123' } }
      };

      (await client.method('GET', 'resource-name/123')).should.containSubset(expected);
      client._executeRequest.callCount.should.equal(1);
    });

    it('should return an expected response when called with valid parameters', async () => {
      client._end.yields(null, POST_FIXTURE);

      const expected = {
        statusCode: 200,
        request: { method: 'POST', uri: { href: 'http://localhost:80/resource-name/123' }, json: true, body: { message: 'hello' } }
      };

      (await client.method('POST', 'resource-name/123', HEADERS, { message: 'hello' })).should.containSubset(expected);
      client._executeRequest.callCount.should.equal(1);
    });
  });
});