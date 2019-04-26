import supertest from 'supertest';
import should from 'should';
import app from '../app';
import models from '../models';
import * as seeds from './../seeders';

const server = supertest.agent(app);

before((done) => {
  models.sequelize.sync({ force: true }).then(() => {
    return models.sequelize.queryInterface.bulkInsert('Users', seeds.createUserInitial)
  })
  .then(() => {
    done(null);
  })
  .catch((errors) => {
    done(errors);
  });
})

describe('Sms Management App', () => {
  let token;
  it('allows creation of a new user', (done) => {
    server
      .post('/api/v1/user')
      .send(seeds.createUser[0])
      .end((err, res) => {
        res.status.should.equal(201);
        res.body.message.should.equal('User created successfully!');
        done();
      });
  });

  it('ensures that phone number is unique', (done) => {
    server
      .post('/api/v1/user')
      .send(seeds.createUser[0])
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.errors.phoneNumber.should.equal('phoneNumber is not available');
        done();
      });
  });

  it('prevents adding a user with empty details', (done) => {
    server
      .post('/api/v1/user')
      .send(seeds.createUser[3])
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.errors.phoneNumber.should.equal('This field is required');
        res.body.errors.firstName.should.equal('This field is required');
        res.body.errors.lastName.should.equal('This field is required');
        done();
      });
  });

  it('allows a user to add new contact', (done) => {
    server
      .post('/api/v1/contact')
      .send(seeds.validContact)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('Contact added successfully!');
        done();
      });
  });

  it('prevents a user from adding itself as contact', (done) => {
    server
      .post('/api/v1/contact')
      .send(seeds.sameContact)
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.errors.contactId.should.equal('You can\'t add a user itself!');
        done();
      });
  });

  it('should prevent adding a user that does not exist as contact', (done) => {
    server
      .post('/api/v1/contact')
      .send(seeds.nonExistentUserAsContact)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('contact does not exist');
        done();
      });
  });

  it('should prevent adding contact to a user that does not exist', (done) => {
    server
      .post('/api/v1/contact')
      .send(seeds.nonExistentUser)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('user does not exist');
        done();
      });
  });

  it('allows a user to send message to a contact successfully', (done) => {
    server
      .post('/api/v1/message')
      .send(seeds.validMessagepayload)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('message sent successfully!');
        done();
      });
  });

  it('prevents sending a message with empty details', (done) => {
    server
      .post('/api/v1/message')
      .send(seeds.invalidMessagepayload)
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.errors.senderId.should.equal('This field is required');
        res.body.errors.receiverId.should.equal('This field is required');
        res.body.errors.message.should.equal('This field is required');
        res.body.errors.status.should.equal('This field is required');
        done();
      });
  });

  it('should prevent sending message to a user that does not exist', (done) => {
    server
      .post('/api/v1/message')
      .send(seeds.nonExistentReceiver)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('receiver does not exist');
        done();
      });
  });

  it('should prevents a user that does not exist from sending message', (done) => {
    server
      .post('/api/v1/message')
      .send(seeds.nonExistentSender)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('sender does not exist');
        done();
      });
  });

  it('should prevents a user from sending message to a user that\'s not a contact', (done) => {
    server
      .post('/api/v1/message')
      .send(seeds.notAContact)
      .end((err, res) => {
        res.status.should.equal(422);
        res.body.error.should.equal('receiver is not yet a contact, please add as contact first!');
        done();
      });
  });

  it('allows a user to retreive all his sent messages successfully', (done) => {
    server
      .get(`/api/v1/user/${seeds.createUser[0].id}/messages/sent`)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('messages retrieved successfuly');
        res.body.messages.length.should.equal(1);
        done();
      });
  });

  it('prevents a user that does not exist from retrieving sent messages', (done) => {
    server
      .get(`/api/v1/user/${seeds.createUser[1].id}/messages/sent`)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('user not found!');
        done();
      });
  });

  it('allows a user to retreive all his received messages successfully', (done) => {
    server
      .get(`/api/v1/user/${seeds.createUserInitial[0].id}/messages/received`)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('messages retrieved successfuly');
        res.body.messages.length.should.equal(1);
        done();
      });
  });

  it('prevents a user that does not exist from retrieving received messages', (done) => {
    server
      .get(`/api/v1/user/${seeds.createUser[1].id}/messages/received`)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('user not found!');
        done();
      });
  });

  it('allows a user to retreive all his contacts successfully', (done) => {
    server
      .get(`/api/v1/user/${seeds.createUser[0].id}/contacts`)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('contacts successfully retrieved!');
        res.body.contacts.length.should.equal(1);
        done();
      });
  });

  it('prevents a user that does not exist from retrieving contacts', (done) => {
    server
      .get(`/api/v1/user/${seeds.createUser[1].id}/contacts`)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('user not found!');
        done();
      });
  });

  it('allows a user to be deleted successfully', (done) => {
    server
      .delete(`/api/v1/user/${seeds.createUserInitial[1].id}/`)
      .end((err, res) => {
        res.status.should.equal(200);
        res.body.message.should.equal('user deleted successfully');
        done();
      });
  });

  it('prevents a user that does not exist from being deleted', (done) => {
    server
      .delete(`/api/v1/user/${seeds.createUser[1].id}/`)
      .end((err, res) => {
        res.status.should.equal(404);
        res.body.error.should.equal('user not found!');
        done();
      });
  });
});

