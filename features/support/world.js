var Zombie = require('zombie');

var url = "http://localhost:9090";

exports.World = function World(callback) {

  this.browser = new Zombie();

  this.visit = function(path, callback) {
    this.browser.visit(url + path, callback);
  };

  callback();
};
