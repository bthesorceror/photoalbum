var tape    = require('tape');
var Session = require('../lib/session.js');

tape('fetch by session id', function(t) {
  t.plan(1);

  var client = {
    get: function(id) {
      t.equal(id, 'boom!');
    }
  }

  var session =new Session('boom!', 20, client);

  session.get();
});

tape('parses resulting json', function(t) {
  t.plan(1);

  var stored = {name: 'brandon', value: 'boom!'};

  var client = {
    get: function(id, cb) {
      cb(null, JSON.stringify(stored));
    }
  }

  var session =new Session('boom!', 20, client);

  session.get(function(err, val) {
    t.deepEqual(val, stored);
  });
});


tape('returns empty object when no value has been stored', function(t) {
  t.plan(1);

  var client = {
    get: function(id, cb) {
      cb(null, null);
    }
  }

  var session =new Session('boom!', 20, client);

  session.get(function(err, val) {
    t.deepEqual(val, {});
  });
});

tape('passes on client error', function(t) {
  t.plan(1);

  var client = {
    get: function(id, cb) {
      cb("BAD ERROR", null);
    }
  }

  var session =new Session('boom!', 20, client);

  session.get(function(err, val) {
    t.equal(err, "BAD ERROR");
  });
});

tape('saves with the correct parameters', function(t) {
  t.plan(3);

  var stored = {name: 'brandon', value: 'boom!'};

  var client = {
    setex: function(key, ttl, val) {
      t.equal(key, 'boom!')
      t.equal(ttl, 20);
      t.equal(val, JSON.stringify(stored));
    }
  }

  var session =new Session('boom!', 20, client);

  session.save(stored);
});
