'use strict';
export default function(sequelize, DataTypes) {
  var Contact = sequelize.define('Contact', {
    contactId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: {
        args: true,
        msg: 'contact already exists'
      },
      validate: {
        isUUID: {
          args: 4,
          msg: 'id must be uuid'
        }
      }
    },
  }, {
  });

  Contact.associate = (models) => {
    Contact.belongsTo(models.User, {
      foreignKey: 'ownerId',
      onCascade: 'DELETE'
    });
  }
  return Contact;
};