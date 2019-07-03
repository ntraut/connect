const auth = require('./../services/auth');
const logger = require('./../../logger');

module.exports = {
  github: async (req, res) => {
    try {
      const jwt = await auth.connectUser(req.body.code);

      res.send(jwt);
    } catch (err) {
      logger(err);
      res.sendStatus(500);
    }
  },
};
