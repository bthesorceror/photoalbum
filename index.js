var Runner5       = require('runner5');
var CookieMonster = require('./lib/cookie_monster');
var Session       = require('./lib/session');

function PhotoAlbum(ttl, host, port, options) {
  this.options = options || {};
  this.ttl     = ttl;
  this.host    = host;
  this.port    = port;
}

PhotoAlbum.prototype._cookieMonster = function() {
  this._cookieMonster = this._cookieMonster || new CookieMonster(option['session_key'] || 'session_id');
  return this._cookieMonster;
}

PhotoAlbum.prototype._client = function() {
  this._client = this._client || (require('redis')).createClient(this.port, this.host, this.options);
  return this._client;
}

PhotoAlbum.prototype.buildSession = function(req, res) {
  return new Session(this._cookieMonster().getSessionId(req, res), this.ttl, this._client());
}

PhotoAlbum.prototype.middleware = function() {
  var self = this;
  return function(req, res, next) {
    var session = self.buildSession(req, res);

    var runner = new Runner5(session, session.get);

    runner.on('failure', this.handleError.bind(this, req, res, "Failure with your session"));

    runner.on('success', function(mySession) {
      req.session = mySession;
      res.on('finish', session.save.bind(session, req.session));
      next();
    });

    runner.run();
  };
}

module.exports = PhotoAlbum;
