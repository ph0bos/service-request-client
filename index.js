'use strict';

const ContainerDNSClient = require('./lib/implementations/container-dns-request');
const HostPortClient     = require('./lib/implementations/host-port-request');

module.exports = { ContainerDNSClient, HostPortClient };