var WeiboRegistry = artifacts.require("WeiboRegistry");
var WeiboAccount = artifacts.require("WeiboAccount");

module.exports = function(deployer) {
  deployer.deploy(WeiboRegistry);
}
