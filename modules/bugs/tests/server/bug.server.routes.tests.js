'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Bug = mongoose.model('Bug'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, bug;

/**
 * Bug routes tests
 */
describe('Bug CRUD tests', function () {

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

    // Save a user to the test db and create new Bug
    user.save(function () {
      bug = {
        name: 'Bug name'
      };

      done();
    });
  });

  it('should be able to save a Bug if logged in', function (done) {
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

        // Save a new Bug
        agent.post('/api/bugs')
          .send(bug)
          .expect(200)
          .end(function (bugSaveErr, bugSaveRes) {
            // Handle Bug save error
            if (bugSaveErr) {
              return done(bugSaveErr);
            }

            // Get a list of Bugs
            agent.get('/api/bugs')
              .end(function (bugsGetErr, bugsGetRes) {
                // Handle Bug save error
                if (bugsGetErr) {
                  return done(bugsGetErr);
                }

                // Get Bugs list
                var bugs = bugsGetRes.body;

                // Set assertions
                (bugs[0].user._id).should.equal(userId);
                (bugs[0].name).should.match('Bug name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Bug if not logged in', function (done) {
    agent.post('/api/bugs')
      .send(bug)
      .expect(403)
      .end(function (bugSaveErr, bugSaveRes) {
        // Call the assertion callback
        done(bugSaveErr);
      });
  });

  it('should not be able to save an Bug if no name is provided', function (done) {
    // Invalidate name field
    bug.name = '';

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

        // Save a new Bug
        agent.post('/api/bugs')
          .send(bug)
          .expect(400)
          .end(function (bugSaveErr, bugSaveRes) {
            // Set message assertion
            (bugSaveRes.body.message).should.match('Please fill Bug name');

            // Handle Bug save error
            done(bugSaveErr);
          });
      });
  });

  it('should be able to update an Bug if signed in', function (done) {
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

        // Save a new Bug
        agent.post('/api/bugs')
          .send(bug)
          .expect(200)
          .end(function (bugSaveErr, bugSaveRes) {
            // Handle Bug save error
            if (bugSaveErr) {
              return done(bugSaveErr);
            }

            // Update Bug name
            bug.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Bug
            agent.put('/api/bugs/' + bugSaveRes.body._id)
              .send(bug)
              .expect(200)
              .end(function (bugUpdateErr, bugUpdateRes) {
                // Handle Bug update error
                if (bugUpdateErr) {
                  return done(bugUpdateErr);
                }

                // Set assertions
                (bugUpdateRes.body._id).should.equal(bugSaveRes.body._id);
                (bugUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Bugs if not signed in', function (done) {
    // Create new Bug model instance
    var bugObj = new Bug(bug);

    // Save the bug
    bugObj.save(function () {
      // Request Bugs
      request(app).get('/api/bugs')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Bug if not signed in', function (done) {
    // Create new Bug model instance
    var bugObj = new Bug(bug);

    // Save the Bug
    bugObj.save(function () {
      request(app).get('/api/bugs/' + bugObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', bug.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Bug with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/bugs/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Bug is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Bug which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Bug
    request(app).get('/api/bugs/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Bug with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Bug if signed in', function (done) {
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

        // Save a new Bug
        agent.post('/api/bugs')
          .send(bug)
          .expect(200)
          .end(function (bugSaveErr, bugSaveRes) {
            // Handle Bug save error
            if (bugSaveErr) {
              return done(bugSaveErr);
            }

            // Delete an existing Bug
            agent.delete('/api/bugs/' + bugSaveRes.body._id)
              .send(bug)
              .expect(200)
              .end(function (bugDeleteErr, bugDeleteRes) {
                // Handle bug error error
                if (bugDeleteErr) {
                  return done(bugDeleteErr);
                }

                // Set assertions
                (bugDeleteRes.body._id).should.equal(bugSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Bug if not signed in', function (done) {
    // Set Bug user
    bug.user = user;

    // Create new Bug model instance
    var bugObj = new Bug(bug);

    // Save the Bug
    bugObj.save(function () {
      // Try deleting Bug
      request(app).delete('/api/bugs/' + bugObj._id)
        .expect(403)
        .end(function (bugDeleteErr, bugDeleteRes) {
          // Set message assertion
          (bugDeleteRes.body.message).should.match('User is not authorized');

          // Handle Bug error error
          done(bugDeleteErr);
        });

    });
  });

  it('should be able to get a single Bug that has an orphaned user reference', function (done) {
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

          // Save a new Bug
          agent.post('/api/bugs')
            .send(bug)
            .expect(200)
            .end(function (bugSaveErr, bugSaveRes) {
              // Handle Bug save error
              if (bugSaveErr) {
                return done(bugSaveErr);
              }

              // Set assertions on new Bug
              (bugSaveRes.body.name).should.equal(bug.name);
              should.exist(bugSaveRes.body.user);
              should.equal(bugSaveRes.body.user._id, orphanId);

              // force the Bug to have an orphaned user reference
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

                    // Get the Bug
                    agent.get('/api/bugs/' + bugSaveRes.body._id)
                      .expect(200)
                      .end(function (bugInfoErr, bugInfoRes) {
                        // Handle Bug error
                        if (bugInfoErr) {
                          return done(bugInfoErr);
                        }

                        // Set assertions
                        (bugInfoRes.body._id).should.equal(bugSaveRes.body._id);
                        (bugInfoRes.body.name).should.equal(bug.name);
                        should.equal(bugInfoRes.body.user, undefined);

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
      Bug.remove().exec(done);
    });
  });
});
