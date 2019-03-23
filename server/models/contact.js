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
      },
      references: {
        model: 'Users',
        key: 'id'
      }
    },
  }, {
  });

  Contact.associate = (models) => {
    Contact.belongsTo(models.User, {
      foreignKey: 'userId',
      onCascade: 'DELETE'
    });

    Contact.hasMany(models.Message, {
      foreignKey: 'receiverId',
      onCascade: 'DELETE'
    })
  }
  return Contact;
};