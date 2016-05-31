'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Scramble = mongoose.model('Scramble'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, scramble;

/**
 * Scramble routes tests
 */
describe('Scramble CRUD tests', function () {

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

    // Save a user to the test db and create new Scramble
    user.save(function () {
      scramble = {
        name: 'Scramble name'
      };

      done();
    });
  });

  it('should be able to save a Scramble if logged in', function (done) {
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

        // Save a new Scramble
        agent.post('/api/scrambles')
          .send(scramble)
          .expect(200)
          .end(function (scrambleSaveErr, scrambleSaveRes) {
            // Handle Scramble save error
            if (scrambleSaveErr) {
              return done(scrambleSaveErr);
            }

            // Get a list of Scrambles
            agent.get('/api/scrambles')
              .end(function (scramblesGetErr, scramblesGetRes) {
                // Handle Scramble save error
                if (scramblesGetErr) {
                  return done(scramblesGetErr);
                }

                // Get Scrambles list
                var scrambles = scramblesGetRes.body;

                // Set assertions
                (scrambles[0].user._id).should.equal(userId);
                (scrambles[0].name).should.match('Scramble name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Scramble if not logged in', function (done) {
    agent.post('/api/scrambles')
      .send(scramble)
      .expect(403)
      .end(function (scrambleSaveErr, scrambleSaveRes) {
        // Call the assertion callback
        done(scrambleSaveErr);
      });
  });

  it('should not be able to save an Scramble if no name is provided', function (done) {
    // Invalidate name field
    scramble.name = '';

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

        // Save a new Scramble
        agent.post('/api/scrambles')
          .send(scramble)
          .expect(400)
          .end(function (scrambleSaveErr, scrambleSaveRes) {
            // Set message assertion
            (scrambleSaveRes.body.message).should.match('Please fill Scramble name');

            // Handle Scramble save error
            done(scrambleSaveErr);
          });
      });
  });

  it('should be able to update an Scramble if signed in', function (done) {
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

        // Save a new Scramble
        agent.post('/api/scrambles')
          .send(scramble)
          .expect(200)
          .end(function (scrambleSaveErr, scrambleSaveRes) {
            // Handle Scramble save error
            if (scrambleSaveErr) {
              return done(scrambleSaveErr);
            }

            // Update Scramble name
            scramble.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Scramble
            agent.put('/api/scrambles/' + scrambleSaveRes.body._id)
              .send(scramble)
              .expect(200)
              .end(function (scrambleUpdateErr, scrambleUpdateRes) {
                // Handle Scramble update error
                if (scrambleUpdateErr) {
                  return done(scrambleUpdateErr);
                }

                // Set assertions
                (scrambleUpdateRes.body._id).should.equal(scrambleSaveRes.body._id);
                (scrambleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Scrambles if not signed in', function (done) {
    // Create new Scramble model instance
    var scrambleObj = new Scramble(scramble);

    // Save the scramble
    scrambleObj.save(function () {
      // Request Scrambles
      request(app).get('/api/scrambles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Scramble if not signed in', function (done) {
    // Create new Scramble model instance
    var scrambleObj = new Scramble(scramble);

    // Save the Scramble
    scrambleObj.save(function () {
      request(app).get('/api/scrambles/' + scrambleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', scramble.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Scramble with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/scrambles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Scramble is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Scramble which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Scramble
    request(app).get('/api/scrambles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Scramble with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Scramble if signed in', function (done) {
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

        // Save a new Scramble
        agent.post('/api/scrambles')
          .send(scramble)
          .expect(200)
          .end(function (scrambleSaveErr, scrambleSaveRes) {
            // Handle Scramble save error
            if (scrambleSaveErr) {
              return done(scrambleSaveErr);
            }

            // Delete an existing Scramble
            agent.delete('/api/scrambles/' + scrambleSaveRes.body._id)
              .send(scramble)
              .expect(200)
              .end(function (scrambleDeleteErr, scrambleDeleteRes) {
                // Handle scramble error error
                if (scrambleDeleteErr) {
                  return done(scrambleDeleteErr);
                }

                // Set assertions
                (scrambleDeleteRes.body._id).should.equal(scrambleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Scramble if not signed in', function (done) {
    // Set Scramble user
    scramble.user = user;

    // Create new Scramble model instance
    var scrambleObj = new Scramble(scramble);

    // Save the Scramble
    scrambleObj.save(function () {
      // Try deleting Scramble
      request(app).delete('/api/scrambles/' + scrambleObj._id)
        .expect(403)
        .end(function (scrambleDeleteErr, scrambleDeleteRes) {
          // Set message assertion
          (scrambleDeleteRes.body.message).should.match('User is not authorized');

          // Handle Scramble error error
          done(scrambleDeleteErr);
        });

    });
  });

  it('should be able to get a single Scramble that has an orphaned user reference', function (done) {
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

          // Save a new Scramble
          agent.post('/api/scrambles')
            .send(scramble)
            .expect(200)
            .end(function (scrambleSaveErr, scrambleSaveRes) {
              // Handle Scramble save error
              if (scrambleSaveErr) {
                return done(scrambleSaveErr);
              }

              // Set assertions on new Scramble
              (scrambleSaveRes.body.name).should.equal(scramble.name);
              should.exist(scrambleSaveRes.body.user);
              should.equal(scrambleSaveRes.body.user._id, orphanId);

              // force the Scramble to have an orphaned user reference
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

                    // Get the Scramble
                    agent.get('/api/scrambles/' + scrambleSaveRes.body._id)
                      .expect(200)
                      .end(function (scrambleInfoErr, scrambleInfoRes) {
                        // Handle Scramble error
                        if (scrambleInfoErr) {
                          return done(scrambleInfoErr);
                        }

                        // Set assertions
                        (scrambleInfoRes.body._id).should.equal(scrambleSaveRes.body._id);
                        (scrambleInfoRes.body.name).should.equal(scramble.name);
                        should.equal(scrambleInfoRes.body.user, undefined);

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
      Scramble.remove().exec(done);
    });
  });
});
