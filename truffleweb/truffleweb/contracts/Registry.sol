pragma solidity ^0.4.25;

contract WeiboRegistry {

  mapping (address => string) _addressToAccountName;//地址到用户名
  mapping (uint => address) _accountIdToAccountAddress;//id到用户地址
  mapping (string => address) _accountNameToAddress;//用户名到地址
  uint _numberOfAccounts;//用户数量
  address _registryAdmin;//管理者用户

  modifier onlyRegistryAdmin {//管理者权限
    require(msg.sender == _registryAdmin);
    _;
  }

  constructor() public {
    _registryAdmin = msg.sender;
    _numberOfAccounts = 0;
  }

  function register(string name, address accountAddress) public {//注册
    //确保信息未注册
    require(_accountNameToAddress[name] == address(0));
    require(bytes(_addressToAccountName[accountAddress]).length == 0);
    require(bytes(name).length < 64);

    //添加信息
    _addressToAccountName[accountAddress] = name;
    _accountNameToAddress[name] = accountAddress;
    _accountIdToAccountAddress[_numberOfAccounts] = accountAddress;
    _numberOfAccounts++;
  }

  function getNumberOfAccounts() public constant returns (uint numberOfAccounts) {
    numberOfAccounts = _numberOfAccounts;
  }

  function getAddressOfName(string name) public constant returns (address addr) {
    addr = _accountNameToAddress[name];
  }

  function getNameOfAddress(address addr) public constant returns (string name) {
    name = _addressToAccountName[addr];
  }

  function getAddressOfId(uint id) public constant returns (address addr) {
    addr = _accountIdToAccountAddress[id];
  }

  //管理员取得打赏
  function adminRetrieveDonations() public onlyRegistryAdmin {
    assert(_registryAdmin.send(address(this).balance));
  }

  //管理员删除
  function adminDeleteRegistry() public onlyRegistryAdmin {
    selfdestruct(_registryAdmin);
  }

  //记录捐献的用户和数量
  event LogDonate(address indexed from, uint _amount);

  function() public payable {
    emit LogDonate(msg.sender, msg.value);
  }

}
