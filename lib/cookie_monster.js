var uuid    = require('uuid');
var Cookies = require('cookies');

function CookieMonster(key) {
  this.key = key;
}

CookieMonster.prototype.buildCookies = function(req, res) {
  return new Cookies(req, res);
}

CookieMonster.prototype.createId = function() {
  return uuid.v1();
}

CookieMonster.prototype.getSessionId = function(req, res) {
  var cookies = this.buildCookies(req, res);
  var session_id = cookies.get(this.key);

  if (!session_id) { session_id = this.createId(); }

  cookies.set(this.key, session_id);
  return session_id;
}

module.exports = CookieMonster;
