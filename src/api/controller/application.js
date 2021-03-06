const ApplicationService = require('../services/application');
const createValidator = require('./validator/applicationCreate');
const logger = require('../../logger');

module.exports = {
  list: async (req, res) => {
    try {
      const applicationService = new ApplicationService();
      const applications = await applicationService.list(req.auth.developer);

      return res.send(applications);
    } catch (err) {
      logger.error(err);
      return res.sendStatus(500);
    }
  },
  get: async (req, res) => {
    try {
      const applicationService = new ApplicationService();
      const application = await applicationService.get(
        req.auth.developer,
        req.params.id,
      );

      if (!application) {
        return res.sendStatus(404);
      }

      return res.send(application);
    } catch (err) {
      logger.error(err);
      return res.sendStatus(500);
    }
  },
  create: async (req, res) => {
    try {
      const validatorErrors = createValidator(req.body);

      if (validatorErrors) {
        return res.status(400).send(validatorErrors);
      }

      const applicationService = new ApplicationService();
      const application = await applicationService.create(
        req.auth.developer,
        req.body,
      );

      return res.send(application);
    } catch (err) {
      logger.error(err);
      return res.sendStatus(500);
    }
  },
  update: async (req, res) => {
    try {
      const validatorErrors = createValidator(req.body);

      if (validatorErrors) {
        return res.status(400).send(validatorErrors);
      }

      const applicationService = new ApplicationService();
      const application = await applicationService.update(
        req.params.id,
        req.auth.developer,
        req.body,
      );

      return res.send(application);
    } catch (err) {
      logger.error(err);
      return res.sendStatus(500);
    }
  },
};
