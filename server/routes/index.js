import express from 'express';
import * as Controllers from '../controllers';

const routers = express.Router();

routers.post('/api/v1/user', Controllers.createUser());

routers.post('/api/v1/contact', Controllers.addContact());

routers.post('/api/v1/message', Controllers.addMessage());

export default routers;
