'use strict';

// tests for list-game-sessions
// Generated by serverless-mocha-plugin

const mochaPlugin = require('serverless-mocha');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('list-game-sessions', '../../../src/functions/list-game-sessions.js', 'handler');
const AWS = require('aws-sdk-mock');
const AWS_SDK = require('aws-sdk');
AWS.setSDKInstance(AWS_SDK);

describe('list-game-sessions', () => {
  before((done) => {
    done();
  });

  it('implement tests here', async () => {
    const response = await wrapped.run({});
    expect(response).to.not.be.empty;
  });
});
