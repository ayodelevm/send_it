'use strict';
export default function(sequelize, DataTypes) {
  var Message = sequelize.define('Message', {
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
    message: DataTypes.STRING,
    status: DataTypes.ENUM('failed', 'pending', 'sent'),
  }, {
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      onCascade: 'DELETE',
    });

    Message.belongsTo(models.Contact, {
      foreignKey: 'receiverId',
      onCascade: 'DELETE',
    });
  }
  return Message;
};