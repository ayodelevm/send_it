'use strict';
export default function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique: {
        args: true,
        msg: 'id already exists'
      },
      validate: {
        isUUID: {
          args: 4,
          msg: 'id must be uuid'
        }
      }
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phoneNumber: DataTypes.STRING
  }, {
  });
  User.associate = (models) => {
    User.hasMany(models.Contact, {
      foreignKey: 'userId',
      onCascade: 'DELETE'
    });

    User.hasMany(models.Message, {
      foreignKey: 'userId',
      // as: 'sender',
      onCascade: 'DELETE'
    })
  }
  return User;
};