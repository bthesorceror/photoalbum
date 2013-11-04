var assert = require('assert');

module.exports = function() {
  this.World = require('../support/world').World;

  this.Given(/^I visit the server with new parameters$/, function(callback) {
    var self = this;
    this.visit("/?name=brandon&job=programmer", function() {
      assert.equal(self.browser.text(), "");
      callback();
    });
  });

  this.When(/^I visit the server again$/, function(callback) {
    this.visit("/", callback);
  });

  this.Then(/^I see those parameters on the page$/, function(callback) {
    assert.equal(this.browser.text("h1"), "brandon");
    assert.equal(this.browser.text("p"), "programmer");
    callback();
  });
}
