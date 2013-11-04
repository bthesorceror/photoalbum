var tape         = require('tape');
var PhotoAlbum   = require('../index');
var EventEmitter = require('events').EventEmitter;

tape("handles error correctly", function(t) {
  t.plan(4);

  var res = "response", req = "request";

  var server = {
    handleError: function(request, response, err) {
      t.equal(this, server);
      t.equal(request, req);
      t.equal(response, res);
      t.equal(err, "Failure with your session");
    }
  };

  var session = {
    get: function(cb) {
      cb("ERROR", null);
    }
  }

  var album = new PhotoAlbum(20, 'localhost', 6489);
  var middleware = album.middleware();

  album.buildSession = function(req, res) {
    return session;
  }

  middleware.call(server, req, res);
});

tape("sets session correctly", function(t) {
  t.plan(3);

  var res = new EventEmitter(), req = {};

  var sess = { fname: 'brandon', lname: 'farmer' };

  var session = {
    get: function(cb) {
      cb(null, sess);
    },
    save: function(doc) {
      t.equal(this, session, 'context is correct');
      t.deepEqual(doc, { fname: 'katy', lname: 'farmer' }, 'session is updated');
    }
  }

  var next = function() {
    t.equal(req.session, sess, 'req.session is correct');
    req.session.fname = 'katy';
    res.emit('finish');
  }

  var album = new PhotoAlbum(20, 'localhost', 6489);
  var middleware = album.middleware();

  album.buildSession = function(req, res) {
    return session;
  }

  middleware.call({handleError: function(){}}, req, res, next);
});
