var http       = require('http');
var stack      = require('stack');
var redis      = require('redis');
var url        = require('url');
var PhotoAlbum = require('../../index');

module.exports = function() {
  this.Around(function(runScenario) {
    var client = redis.createClient(6379, 'localhost');

    var second = function(req, res, next) {
      var query = url.parse(req.url, true).query;
      if (Object.keys(query).length) {
        req.session = query;
        res.end();
        return;
      }
      res.end("<html><body><h1>" + req.session.name +
              "</h1><p>" + req.session.job +
              "</p></body></html>");
    };

    var first = (new PhotoAlbum(100, 'localhost', 6379)).middleware();
    var server = http.createServer(
      stack(
        first,
        second
      )
    );

    server.listen(9090);


    runScenario(function(callback) {
      client.flushall(function(err) {
        server.close();
        callback();
      });
    });
  });
};

