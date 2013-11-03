var tape = require('tape');
var CookieMonster = require('../lib/cookie_monster');

tape('returns saved session id', function(t) {
  t.plan(7);

  var request  = 'request';
  var response = 'response';
  var monster  = new CookieMonster('keyedcar');

  var cookies = {
    get: function(key) {
      t.equal(key, 'keyedcar');
      return 'savedvalue';
    }, set: function(key, id) {
      t.equal(key, 'keyedcar');
      t.equal(id, 'savedvalue');
    }
  }

  t.equal((typeof monster.buildCookies), 'function');
  monster.buildCookies = function(req, res) {
    t.equal(req, request);
    t.equal(res, response);
    return cookies;
  };

  var id = monster.getSessionId(request, response);
  t.equal(id, 'savedvalue');
});

tape('returns saved session id', function(t) {
  t.plan(8);

  var request  = 'request';
  var response = 'response';
  var monster  = new CookieMonster('keyedcar');

  var cookies = {
    get: function(key) {
      t.equal(key, 'keyedcar');
      return;
    }, set: function(key, id) {
      t.equal(key, 'keyedcar');
      t.equal(id, 'newvalue');
    }
  }

  t.equal((typeof monster.createId), 'function');
  monster.createId = function() {
    return 'newvalue';
  }

  t.equal((typeof monster.buildCookies), 'function');
  monster.buildCookies = function(req, res) {
    t.equal(req, request);
    t.equal(res, response);
    return cookies;
  };

  var id = monster.getSessionId(request, response);
  t.equal(id, 'newvalue');
});
