var Runner5 = require('runner5');

function Session(id, ttl, client, options) {
  options        = options || {};
  this.id        = id;
  this.ttl       = ttl;
  this.client    = client;
  this.namespace = options.namespace;
}

Session.prototype.get = function(cb) {
  var getter = new Runner5(this.client, this.client.get);

  getter.on('success', function(json) {
    var obj = json ? JSON.parse(json) : {};
    cb(null, obj);
  }.bind(this));

  getter.on('failure', function(err) {
    cb(err, null);
  });

  getter.run(this._fullId());
}

Session.prototype._fullId = function() {
  if (this.namespace)
    return [this.namespace, this.id].join('::');
  return this.id;
}

Session.prototype.save = function(doc) {
  this.client.setex(this._fullId(), this.ttl, JSON.stringify(doc), function(){});
}

module.exports = Session;
