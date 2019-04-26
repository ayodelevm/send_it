export const createUser = [
  {
    id: 'd6463536-7328-4b8e-81a7-1b2f52b720e8',
    phoneNumber: '0811111111',
    firstName: 'test',
    lastName: 'name',
    createdAt: '2019-03-07 09:35:45.17+00',
    updatedAt: '2019-03-07 09:35:45.17+00',
  },
  {
    id: 'b931b16e-62c4-43ae-b1a1-29d68432b8c4',
    phoneNumber: '0811112111',
    firstName: 'test',
    lastName: 'name',
    createdAt: '2019-03-07 09:35:45.17+00',
    updatedAt: '2019-03-07 09:35:45.17+00',
  },
  {
    id: '84e1a5e2-97f2-409f-b342-991b1f967428',
    phoneNumber: '0811113111',
    firstName: 'test',
    lastName: 'name',
    createdAt: '2019-03-07 09:35:45.17+00',
    updatedAt: '2019-03-07 09:35:45.17+00',
  },
  {
    id: '1aeb7f73-572a-412a-8661-41ed62f1855d',
    phoneNumber: '',
    firstName: '',
    lastName: '',
    createdAt: '2019-03-07 09:35:45.17+00',
    updatedAt: '2019-03-07 09:35:45.17+00',
  }
]

export const createUserInitial = [{
  id: '1c3b6a4a-eeb8-4c61-864e-47496a2b3f4e',
  phoneNumber: '0901111511111',
  firstName: 'Smith',
  lastName: 'John',
  createdAt: '2019-03-07 09:35:45.17+00',
  updatedAt: '2019-03-07 09:35:45.17+00',
},
{
  id: 'd3b3cded-d2f3-4c79-96ef-5f74a6789e9e',
  phoneNumber: '0902226222222',
  firstName: 'Deb',
  lastName: 'Steve',
  createdAt: '2019-03-07 09:35:45.17+00',
  updatedAt: '2019-03-07 09:35:45.17+00',
}, 
{
  id: '9f3275d9-3af5-4b76-8260-75685ac7ca12',
  phoneNumber: '0811141111',
  firstName: 'test',
  lastName: 'name',
  createdAt: '2019-03-07 09:35:45.17+00',
  updatedAt: '2019-03-07 09:35:45.17+00',
}]

export const validContact = {
  ownerId: createUser[0].id,
  contactId: createUserInitial[0].id
}

export const sameContact = {
  ownerId: createUser[1].id,
  contactId: createUser[1].id
}


export const nonExistentUserAsContact = {
  ownerId: createUser[0].id,
  contactId: createUser[2].id
}

export const nonExistentUser = {
  ownerId: createUser[2].id,
  contactId: createUserInitial[2].id
}

export const validMessagepayload = {
  senderId: createUser[0].id,
  receiverId: createUserInitial[0].id,
  message: 'Test message initial...',
  status: 'pending'
}

export const invalidMessagepayload = {
  senderId: '',
  receiverId: '',
  message: '',
  status: ''
}

export const nonExistentReceiver = {
  senderId: createUser[0].id,
  receiverId: createUser[2].id,
  message: 'Test message initial...',
  status: 'pending'
}

export const nonExistentSender = {
  senderId: createUser[2].id,
  receiverId: createUserInitial[2].id,
  message: 'Test message initial...',
  status: 'pending'
}

export const notAContact = {
  senderId: createUser[0].id,
  receiverId: createUserInitial[2].id,
  message: 'Test message initial...',
  status: 'pending'
}
