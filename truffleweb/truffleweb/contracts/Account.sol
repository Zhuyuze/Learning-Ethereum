pragma solidity ^0.4.25;

contract WeiboAccount {

  struct Weibo {
    uint timestamp;
    string weiboString;
  }

  mapping (uint => Weibo) _weibos;

  uint _numberOfWeibos;

  address _adminAddress;

  modifier onlyAdmin {
    require(msg.sender == _adminAddress);
    _;
  }

  constructor() public {
    _numberOfWeibos = 0;
    _adminAddress = msg.sender;
  }

  function weibo(string weiboString) public onlyAdmin {
    require (bytes(weiboString).length <= 160);
    _weibos[_numberOfWeibos].timestamp = now;
    _weibos[_numberOfWeibos].weiboString = weiboString;
    _numberOfWeibos++;
  }

  function getWeibo(uint weiboId) public constant returns (string weiboString, uint timestamp) {
    weiboString = _weibos[weiboId].weiboString;
    timestamp = _weibos[weiboId].timestamp;
  }

  function getLatestWeibo() public constant returns (string weiboString, uint timestamp, uint numberOfWeibos) {
    weiboString = _weibos[_numberOfWeibos-1].weiboString;
    timestamp = _weibos[_numberOfWeibos-1].timestamp;
    numberOfWeibos = _numberOfWeibos;
  }

  function getOwnerAddress() public constant returns (address adminAddress) {
    return _adminAddress;
  }

  function getNumberOfWeibos() public constant returns (uint numberOfWeibos) {
    return _numberOfWeibos;
  }

  function adminRetrieveDonations(address receiver) public onlyAdmin {
    assert(receiver.send(address(this).balance));
  }

  function adminDeleteAccount() public onlyAdmin {
    selfdestruct(_adminAddress);
  }

  event LogDonate(address indexed from, uint _amount);

  function() public payable {
    emit LogDonate(msg.sender, msg.value);
  }

}
