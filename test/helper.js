'use strict';

/**
 * Test Helper
 *
 * Allows for common test modules to be imported and configured globally
 */

// Test Runner
global.mocha = require('mocha');

// Mocking/Stubbing
global.sinon = require('sinon');

// Chai Assertions
global.chai = require('chai');
global.chai.use(require("chai-as-promised"));
global.chai.use(require('chai-subset'));
global.chai.should();
