var Journeyman = require('journeyman');
var redis      = require('redis');
var url        = require('url');
var PhotoAlbum = require('../../index');

module.exports = function() {
  this.Around(function(runScenario) {

    var journeyman = new Journeyman(9090);
    journeyman.listen();

    journeyman.use(function(req, res, next) {
      var query = url.parse(req.url, true).query;
      if (Object.keys(query).length) {
        req.session = query;
        res.end();
        return;
      }
      res.end("<html><body><h1>" + req.session.name +
              "</h1><p>" + req.session.job +
              "</p></body></html>");
    });

    journeyman.use((new PhotoAlbum(100, 'localhost', 6379)).middleware());

    runScenario(function(callback) {
      journeyman.close();
      callback();
    });
  });
};

