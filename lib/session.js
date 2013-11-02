var Runner5 = require('runner5');

function Session(id, ttl, client) {
  this.id     = id;
  this.ttl    = ttl;
  this.client = client;
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

  getter.run(this.id);
}

Session.prototype.save = function(doc) {
  this.client.setex(this.id, this.ttl, JSON.stringify(doc), function(){});
}

module.exports = Session;
