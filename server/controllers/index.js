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
        fields: [...enums]
      })
    })
    .then(createdUser => res.status(200).json({
      createdUser,
      message: 'user created successfully!'
    }))
    .catch(error => next(error))
  }
}

export const addContact = () => {
  return (req, res, next) => {
    const enums = ['userId', 'contactId'];
    const { isValid, errors } = ValidatorClass.validateFieldsSync(enums, req.body)

    if(!isValid) return next(errors);

    return models.User.findAll({
      where: {
        id: [req.body.userId, req.body.contactId],
      }
    })
    .then((foundUsers) => {
      if (!foundUsers.length) throw errorFunction('user or contact does not exist', 404);

      const userInstance = foundUsers.find((instance) => instance.id === req.body.userId);
      const contactInstance = foundUsers.find((instance) => instance.id === req.body.contactId);

      if (!userInstance) throw errorFunction('user does not exist', 404);
      if (!contactInstance) throw errorFunction('contact does not exist', 404);

      return userInstance.createContact({ userId: userInstance.id, contactId: contactInstance.id })
    })
    .then(() => res.status(200).json({
      message: 'Contact added successfully!'
    }))
    .catch(error => next(error))
  }
}

export const addMessage = () => {
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

      if (!senderInstance) throw errorFunction('user does not exist', 404);
      if (!receiverInstance) throw errorFunction('contact does not exist', 404);

      return senderInstance.getContacts({
        where: {
          contactId: req.body.receiverId,
        }
      })
    })
    .then((foundContact) => {
      if(!foundContact) throw errorFunction('receiver is not yet a contact, please add as contact first!', 422);
      const { message, status, receiverId, senderId } = req.body;
      console.log({ contact: foundContact[0] })

      return foundContact[0].createMessage({
        message, status, receiverId, senderId,
      })
    })
    .then(() => res.status(200).json({
      message: req.body.status !== 'failed' ? 'message sent successfully!' : 'message not successfully sent!'
    }))
    .catch(error => next(error))
  }
}

export const getSentMessages = () => {
  return (req, res, next) => {
    return models.User.findOne({
      where: {
        id: req.body.senderId,
      }
    }).then((founduser) => {
      if (!founduser) throw errorFunction('user not found!', 404);

      return founduser.getMessages({
        where: {
          senderId: req.body.senderId,
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

export const getReceivedMessages = () => {
  return (req, res, next) => {
    return models.User.findOne({
      where: {
        id: req.body.receiverId,
      }
    }).then((founduser) => {
      if (!founduser) throw errorFunction('user not found!', 404);

      return founduser.getMessages({
        where: {
          receiverId: req.body.receiverId,
          status: {
            [Op.or]: 'failed',
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
