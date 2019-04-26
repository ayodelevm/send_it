import express from 'express';
import * as Controllers from '../controllers';

const routers = express.Router();

routers.post('/api/v1/user', Controllers.createUser());

routers.post('/api/v1/contact', Controllers.addContact());

routers.post('/api/v1/message', Controllers.sendMessage());

routers.get('/api/v1/user/:senderId/messages/sent', Controllers.getSentMessages());

routers.get('/api/v1/user/:receiverId/messages/received', Controllers.getReceivedMessages());

routers.get('/api/v1/user/:userId/contacts', Controllers.getContacts());

routers.delete('/api/v1/user/:userId/', Controllers.removeUser());

export default routers;
