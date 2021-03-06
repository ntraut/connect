const mongoose = require('mongoose');
const nock = require('nock');
const { EventEmitter, once } = require('events');

const configMock = require('./__mock__/config');

configMock.MONGO_URI = 'mongodb://localhost:46347/connect';
process.env = Object.assign(process.env, configMock);
jest.mock('../src/config', () => configMock);

// Set up a default API server for testing with default configuration.
const ConnectServer = require('../src/connectServer');
const AuthService = require('../src/api/services/auth');

function bindServer() {
  let server;

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeAll(async () => {
    const event = new EventEmitter();
    server = await ConnectServer.start(configMock.APP_PORT, event);
    await once(event, 'parse-init');
  });

  afterAll(async () => {
    if (server) {
      await server.server.close();
      server = undefined;
    }
  });
}

function bindGithub() {
  beforeAll(() => {
    nock(`https://github.com`)
      .persist()
      .post('/login/oauth/access_token')
      .reply(200, {
        access_token: 'test-access-token',
      });

    nock(`https://api.github.com`).persist().get('/user').reply(200, {
      login: 'user',
      id: 1,
      company: 'tester',
      email: 'noreply@sample.fr',
    });
  });

  afterAll(() => nock.cleanAll());
}

function bindAll() {
  bindServer();
  bindGithub();
}

async function getJwtToken() {
  const authService = new AuthService();
  return authService.connectUser('lambda_github_code');
}

module.exports = {
  bindAll,
  bindServer,
  bindGithub,
  getJwtToken,
};
