import models from '../models';
import ValidatorClass from '../utils/validator';
import { errorFunction } from '../utils'
const { Op } = models.Sequelize;

export const createUser = () => {
  return (req, res, next) => {
    const queryOptions = { phoneNumber: req.body.phoneNumber };
    const enums = ['phoneNumber', 'firstName', 'lastName'];

    return ValidatorClass.validateExistence('User', queryOptions, enums, req.body)
    .then(({ isValid, errors }) => {
      if (!isValid) throw errors;

      return models.User.create({ ...req.body }, {
        fields: [...enums, 'id']
      })
    })
    .then(createdUser => res.status(201).json({
      createdUser,
      message: 'User created successfully!'
    }))
    .catch(error => next(error))
  }
}

export const addContact = () => {
  return (req, res, next) => {
    const enums = ['ownerId', 'contactId'];
    const { isValid, errors } = ValidatorClass.validateFieldsSync(enums, req.body)

    if(!isValid) return next(errors);

    return models.User.findAll({
      where: {
        id: [req.body.ownerId, req.body.contactId],
      }
    })
    .then((foundUsers) => {
      if (!foundUsers.length) throw errorFunction('user or contact does not exist', 404);

      const userInstance = foundUsers.find((instance) => instance.id === req.body.ownerId);
      const contactInstance = foundUsers.find((instance) => instance.id === req.body.contactId);

      if (!userInstance) throw errorFunction('user does not exist', 404);
      if (!contactInstance) throw errorFunction('contact does not exist', 404);

      return userInstance.createContact({ contactId: contactInstance.id })
    })
    .then(() => res.status(200).json({
      message: 'Contact added successfully!'
    }))
    .catch(error => next(error))
  }
}

export const sendMessage = () => {
  return (req, res, next) => {
    const enums = ['senderId', 'receiverId', 'message', 'status'];
    const { isValid, errors } = ValidatorClass.validateFieldsSync(enums, req.body);

    if(!isValid) return next(errors);

    return models.User.findAll({
      where: {
        id: [req.body.senderId, req.body.receiverId],
      }
    }).then((foundUsers) => {
      if (!foundUsers.length) throw errorFunction('user or contact does not exist', 404);

      const senderInstance = foundUsers.find((instance) => instance.id === req.body.senderId);
      const receiverInstance = foundUsers.find((instance) => instance.id === req.body.receiverId);
      req.senderInstance = senderInstance;

      if (!senderInstance) throw errorFunction('sender does not exist', 404);
      if (!receiverInstance) throw errorFunction('receiver does not exist', 404);

      return senderInstance.getContacts({
        where: {
          contactId: req.body.receiverId,
        }
      })
    })
    .then((foundContact) => {
      if(!foundContact.length) throw errorFunction('receiver is not yet a contact, please add as contact first!', 422);
      const { message, status, receiverId } = req.body;

      return req.senderInstance.createMessage({
        message, status, receiverId
      })
    })
    .then(() => res.status(200).json({
      message: 'message sent successfully!',
    }))
    .catch(error => next(error))
  }
}

export const getSentMessages = () => {
  return (req, res, next) => {
    return models.User.findOne({
      where: {
        id: req.params.senderId,
      },
    }).then((founduser) => {
      if (!founduser) throw errorFunction('user not found!', 404);

      return founduser.getMessages()
    })
    .then((messages) => res.status(200).json({
      messages,
      message: 'messages retrieved successfuly'
    }))
    .catch(error => next(error));

  }
}

export const getReceivedMessages = () => {
  return (req, res, next) => {
    return models.User.findOne({
      where: {
        id: req.params.receiverId,
      }
    }).then((founduser) => {
      if (!founduser) throw errorFunction('user not found!', 404);

      return models.Message.findAll({
        where: {
          receiverId: req.params.receiverId,
          status: {
            [Op.ne]: 'failed',
          }
        }
      })
    })
    .then((messages) => res.status(200).json({
      messages,
      message: 'messages retrieved successfuly'
    }))
    .catch(error => next(error));

  }
}

export const getContacts = () => {
  return (req, res, next) => {
    return models.User.findOne({
      where: {
        id: req.params.userId
      }
    }).then((founduser) => {
      if (!founduser) throw errorFunction('user not found!', 404);

      return founduser.getContacts({
        attributes: {
          exclude: ['contactId', 'userId']
        },
        include: [
          {
            model: models.User,
          }
        ]
      })
    })
    .then((contacts) => res.status(200).json({
      contacts,
      message: 'contacts successfully retrieved!'
    }))
    .catch(error => next(error))
  }
}

export const removeUser = () => {
  return (req, res, next) => {
    return models.User.findOne({
      where: {
        id: req.params.userId
      }
    })
    .then((foundUser) => {
      if (!foundUser) throw errorFunction('user not found!', 404);

      return foundUser.destroy();
    })
    .then(() => res.status(200).json({
      message: 'user deleted successfully',
    }))
    .catch(error => next(error));
  }
}
