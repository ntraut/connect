const {
  MONGO_DB_NAME,
  MONGO_HOST,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_PORT,
  PARSE_APP_NAME,
  PARSE_APP_ID,
  PARSE_FILE_KEY,
  PARSE_MASTER_KEY,
  PARSE_READONLY_MASTER_KEY,
} = require('./../config');

var ParseServer = require('parse-server').ParseServer;

module.exports = new ParseServer({
  databaseURI: `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`,
  cloud: __dirname + './../parse/cloud/main.js',
  appId: PARSE_APP_ID,
  fileKey: PARSE_FILE_KEY,
  masterKey: PARSE_MASTER_KEY,
  readOnlyMasterKey: PARSE_READONLY_MASTER_KEY,
  appName: PARSE_APP_NAME,
  allowClientClassCreation: false,
  enableAnonymousUsers: false,
  maxLimit: 100,
});
