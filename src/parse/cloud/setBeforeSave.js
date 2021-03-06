const getClasses = require('../schema/getClasses');

module.exports = async (Parse) => {
  const schemaClasses = await getClasses();
  for (const schemaClass of schemaClasses) {
    Parse.Cloud.beforeSave(schemaClass.className, (req) => {
      if (!req.user) {
        return;
      }

      req.object.set('owner', req.user);

      const roleACL = new Parse.ACL();
      roleACL.setWriteAccess(req.user, true);
      roleACL.setRoleReadAccess('Developer', true);

      req.object.set('ACL', roleACL);
    });
  }
};
