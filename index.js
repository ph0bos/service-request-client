'use strict';

const ContainerDNSClient = require('./lib/implementations/container-dns-request-client');
const HostPortClient = require('./lib/implementations/host-port-request-client');

module.exports = { ContainerDNSClient, HostPortClient };