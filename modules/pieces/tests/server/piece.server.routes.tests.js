'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Piece = mongoose.model('Piece'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, piece;

/**
 * Piece routes tests
 */
describe('Piece CRUD tests', function () {

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

    // Save a user to the test db and create new Piece
    user.save(function () {
      piece = {
        name: 'Piece name'
      };

      done();
    });
  });

  it('should be able to save a Piece if logged in', function (done) {
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

        // Save a new Piece
        agent.post('/api/pieces')
          .send(piece)
          .expect(200)
          .end(function (pieceSaveErr, pieceSaveRes) {
            // Handle Piece save error
            if (pieceSaveErr) {
              return done(pieceSaveErr);
            }

            // Get a list of Pieces
            agent.get('/api/pieces')
              .end(function (piecesGetErr, piecesGetRes) {
                // Handle Piece save error
                if (piecesGetErr) {
                  return done(piecesGetErr);
                }

                // Get Pieces list
                var pieces = piecesGetRes.body;

                // Set assertions
                (pieces[0].user._id).should.equal(userId);
                (pieces[0].name).should.match('Piece name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Piece if not logged in', function (done) {
    agent.post('/api/pieces')
      .send(piece)
      .expect(403)
      .end(function (pieceSaveErr, pieceSaveRes) {
        // Call the assertion callback
        done(pieceSaveErr);
      });
  });

  it('should not be able to save an Piece if no name is provided', function (done) {
    // Invalidate name field
    piece.name = '';

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

        // Save a new Piece
        agent.post('/api/pieces')
          .send(piece)
          .expect(400)
          .end(function (pieceSaveErr, pieceSaveRes) {
            // Set message assertion
            (pieceSaveRes.body.message).should.match('Please fill Piece name');

            // Handle Piece save error
            done(pieceSaveErr);
          });
      });
  });

  it('should be able to update an Piece if signed in', function (done) {
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

        // Save a new Piece
        agent.post('/api/pieces')
          .send(piece)
          .expect(200)
          .end(function (pieceSaveErr, pieceSaveRes) {
            // Handle Piece save error
            if (pieceSaveErr) {
              return done(pieceSaveErr);
            }

            // Update Piece name
            piece.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Piece
            agent.put('/api/pieces/' + pieceSaveRes.body._id)
              .send(piece)
              .expect(200)
              .end(function (pieceUpdateErr, pieceUpdateRes) {
                // Handle Piece update error
                if (pieceUpdateErr) {
                  return done(pieceUpdateErr);
                }

                // Set assertions
                (pieceUpdateRes.body._id).should.equal(pieceSaveRes.body._id);
                (pieceUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Pieces if not signed in', function (done) {
    // Create new Piece model instance
    var pieceObj = new Piece(piece);

    // Save the piece
    pieceObj.save(function () {
      // Request Pieces
      request(app).get('/api/pieces')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Piece if not signed in', function (done) {
    // Create new Piece model instance
    var pieceObj = new Piece(piece);

    // Save the Piece
    pieceObj.save(function () {
      request(app).get('/api/pieces/' + pieceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', piece.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Piece with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/pieces/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Piece is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Piece which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Piece
    request(app).get('/api/pieces/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Piece with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Piece if signed in', function (done) {
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

        // Save a new Piece
        agent.post('/api/pieces')
          .send(piece)
          .expect(200)
          .end(function (pieceSaveErr, pieceSaveRes) {
            // Handle Piece save error
            if (pieceSaveErr) {
              return done(pieceSaveErr);
            }

            // Delete an existing Piece
            agent.delete('/api/pieces/' + pieceSaveRes.body._id)
              .send(piece)
              .expect(200)
              .end(function (pieceDeleteErr, pieceDeleteRes) {
                // Handle piece error error
                if (pieceDeleteErr) {
                  return done(pieceDeleteErr);
                }

                // Set assertions
                (pieceDeleteRes.body._id).should.equal(pieceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Piece if not signed in', function (done) {
    // Set Piece user
    piece.user = user;

    // Create new Piece model instance
    var pieceObj = new Piece(piece);

    // Save the Piece
    pieceObj.save(function () {
      // Try deleting Piece
      request(app).delete('/api/pieces/' + pieceObj._id)
        .expect(403)
        .end(function (pieceDeleteErr, pieceDeleteRes) {
          // Set message assertion
          (pieceDeleteRes.body.message).should.match('User is not authorized');

          // Handle Piece error error
          done(pieceDeleteErr);
        });

    });
  });

  it('should be able to get a single Piece that has an orphaned user reference', function (done) {
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

          // Save a new Piece
          agent.post('/api/pieces')
            .send(piece)
            .expect(200)
            .end(function (pieceSaveErr, pieceSaveRes) {
              // Handle Piece save error
              if (pieceSaveErr) {
                return done(pieceSaveErr);
              }

              // Set assertions on new Piece
              (pieceSaveRes.body.name).should.equal(piece.name);
              should.exist(pieceSaveRes.body.user);
              should.equal(pieceSaveRes.body.user._id, orphanId);

              // force the Piece to have an orphaned user reference
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

                    // Get the Piece
                    agent.get('/api/pieces/' + pieceSaveRes.body._id)
                      .expect(200)
                      .end(function (pieceInfoErr, pieceInfoRes) {
                        // Handle Piece error
                        if (pieceInfoErr) {
                          return done(pieceInfoErr);
                        }

                        // Set assertions
                        (pieceInfoRes.body._id).should.equal(pieceSaveRes.body._id);
                        (pieceInfoRes.body.name).should.equal(piece.name);
                        should.equal(pieceInfoRes.body.user, undefined);

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
      Piece.remove().exec(done);
    });
  });
});
