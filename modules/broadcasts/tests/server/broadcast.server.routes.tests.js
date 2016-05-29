'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Broadcast = mongoose.model('Broadcast'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, broadcast;

/**
 * Broadcast routes tests
 */
describe('Broadcast CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Broadcast
    user.save(function () {
      broadcast = {
        name: 'Broadcast name'
      };

      done();
    });
  });

  it('should be able to save a Broadcast if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Broadcast
        agent.post('/api/broadcasts')
          .send(broadcast)
          .expect(200)
          .end(function (broadcastSaveErr, broadcastSaveRes) {
            // Handle Broadcast save error
            if (broadcastSaveErr) {
              return done(broadcastSaveErr);
            }

            // Get a list of Broadcasts
            agent.get('/api/broadcasts')
              .end(function (broadcastsGetErr, broadcastsGetRes) {
                // Handle Broadcast save error
                if (broadcastsGetErr) {
                  return done(broadcastsGetErr);
                }

                // Get Broadcasts list
                var broadcasts = broadcastsGetRes.body;

                // Set assertions
                (broadcasts[0].user._id).should.equal(userId);
                (broadcasts[0].name).should.match('Broadcast name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Broadcast if not logged in', function (done) {
    agent.post('/api/broadcasts')
      .send(broadcast)
      .expect(403)
      .end(function (broadcastSaveErr, broadcastSaveRes) {
        // Call the assertion callback
        done(broadcastSaveErr);
      });
  });

  it('should not be able to save an Broadcast if no name is provided', function (done) {
    // Invalidate name field
    broadcast.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Broadcast
        agent.post('/api/broadcasts')
          .send(broadcast)
          .expect(400)
          .end(function (broadcastSaveErr, broadcastSaveRes) {
            // Set message assertion
            (broadcastSaveRes.body.message).should.match('Please fill Broadcast name');

            // Handle Broadcast save error
            done(broadcastSaveErr);
          });
      });
  });

  it('should be able to update an Broadcast if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Broadcast
        agent.post('/api/broadcasts')
          .send(broadcast)
          .expect(200)
          .end(function (broadcastSaveErr, broadcastSaveRes) {
            // Handle Broadcast save error
            if (broadcastSaveErr) {
              return done(broadcastSaveErr);
            }

            // Update Broadcast name
            broadcast.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Broadcast
            agent.put('/api/broadcasts/' + broadcastSaveRes.body._id)
              .send(broadcast)
              .expect(200)
              .end(function (broadcastUpdateErr, broadcastUpdateRes) {
                // Handle Broadcast update error
                if (broadcastUpdateErr) {
                  return done(broadcastUpdateErr);
                }

                // Set assertions
                (broadcastUpdateRes.body._id).should.equal(broadcastSaveRes.body._id);
                (broadcastUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Broadcasts if not signed in', function (done) {
    // Create new Broadcast model instance
    var broadcastObj = new Broadcast(broadcast);

    // Save the broadcast
    broadcastObj.save(function () {
      // Request Broadcasts
      request(app).get('/api/broadcasts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Broadcast if not signed in', function (done) {
    // Create new Broadcast model instance
    var broadcastObj = new Broadcast(broadcast);

    // Save the Broadcast
    broadcastObj.save(function () {
      request(app).get('/api/broadcasts/' + broadcastObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', broadcast.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Broadcast with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/broadcasts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Broadcast is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Broadcast which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Broadcast
    request(app).get('/api/broadcasts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Broadcast with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Broadcast if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Broadcast
        agent.post('/api/broadcasts')
          .send(broadcast)
          .expect(200)
          .end(function (broadcastSaveErr, broadcastSaveRes) {
            // Handle Broadcast save error
            if (broadcastSaveErr) {
              return done(broadcastSaveErr);
            }

            // Delete an existing Broadcast
            agent.delete('/api/broadcasts/' + broadcastSaveRes.body._id)
              .send(broadcast)
              .expect(200)
              .end(function (broadcastDeleteErr, broadcastDeleteRes) {
                // Handle broadcast error error
                if (broadcastDeleteErr) {
                  return done(broadcastDeleteErr);
                }

                // Set assertions
                (broadcastDeleteRes.body._id).should.equal(broadcastSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Broadcast if not signed in', function (done) {
    // Set Broadcast user
    broadcast.user = user;

    // Create new Broadcast model instance
    var broadcastObj = new Broadcast(broadcast);

    // Save the Broadcast
    broadcastObj.save(function () {
      // Try deleting Broadcast
      request(app).delete('/api/broadcasts/' + broadcastObj._id)
        .expect(403)
        .end(function (broadcastDeleteErr, broadcastDeleteRes) {
          // Set message assertion
          (broadcastDeleteRes.body.message).should.match('User is not authorized');

          // Handle Broadcast error error
          done(broadcastDeleteErr);
        });

    });
  });

  it('should be able to get a single Broadcast that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Broadcast
          agent.post('/api/broadcasts')
            .send(broadcast)
            .expect(200)
            .end(function (broadcastSaveErr, broadcastSaveRes) {
              // Handle Broadcast save error
              if (broadcastSaveErr) {
                return done(broadcastSaveErr);
              }

              // Set assertions on new Broadcast
              (broadcastSaveRes.body.name).should.equal(broadcast.name);
              should.exist(broadcastSaveRes.body.user);
              should.equal(broadcastSaveRes.body.user._id, orphanId);

              // force the Broadcast to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Broadcast
                    agent.get('/api/broadcasts/' + broadcastSaveRes.body._id)
                      .expect(200)
                      .end(function (broadcastInfoErr, broadcastInfoRes) {
                        // Handle Broadcast error
                        if (broadcastInfoErr) {
                          return done(broadcastInfoErr);
                        }

                        // Set assertions
                        (broadcastInfoRes.body._id).should.equal(broadcastSaveRes.body._id);
                        (broadcastInfoRes.body.name).should.equal(broadcast.name);
                        should.equal(broadcastInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Broadcast.remove().exec(done);
    });
  });
});
