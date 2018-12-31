var registry = artifacts.require("WeiboRegistry");
var accnt = artifacts.require("WeiboAccount");

contract('WeiboRegistry', function(accounts) {
  it("get numofaccounts", function() {
    var registryinstance;
    return registry.deployed().then(function (instance) {
      registryinstance = instance;
      return registryinstance.getNumberOfAccounts.call();
    }).then(function(numofaccounts) {
      assert.equal(numofaccounts, 0, "numofaccounts eqs 0");
    });
  });
  it("test register", function() {
    var registryinstance;
    return registry.deployed().then(function (instance) {
      registryinstance = instance;
      return registryinstance.register("abcd", accounts[1]);
    }).then(function() {
      return registryinstance.getNumberOfAccounts.call();
    }).then(function(numofaccounts) {
      assert.equal(numofaccounts, 1, "account added");
    });
  });
  it("test register another", function() {
    var registryinstance;
    return registry.deployed().then(function (instance) {
      registryinstance = instance;
      return registryinstance.register("abc", accounts[2]);
    }).then(function() {
      return registryinstance.getNumberOfAccounts.call();
    }).then(function(numofaccounts) {
      assert.equal(numofaccounts, 2, "account added");
    });
  });
  it ("test send weibo", function() {
    var accountinstance;
    return accnt.deployed().then(function(instance) {
      accountinstance = instance;
      return accountinstance.weibo("a new weibo");
    }).then(function() {
      return accountinstance.getNumberOfWeibos.call();
    }).then(function(numofweibos) {
      assert.equal(numofweibos, 1, "weibo added");
    });
  });
});
