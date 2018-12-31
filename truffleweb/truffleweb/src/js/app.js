var weiboRegistryAddress = "0xdef706841cca80c22fb08045338acfc4f0d757be"
var currentWeiboAddress;
var defaultGas = 4700000;

function register() {
  var weiboRegistryInstance;
  var name = $("#weiboname").val;
  var weiboAccountAddress;
  WeiboAccount.new({from: web3.eth.accounts[0], gas: defaultGas}).then(function(instance) {
    weiboAccountAddress = instance.address;
    currentWeiboAddress = weiboAccountAddress;
    $("#weiboAddress").val(weiboAccountAddress);
  }).then(function() {
    WeiboRegistry.at(weiboRegistryAddress).then(function(instance) {
      weiboRegistryInstance = instance;
      return weiboRegistryInstance.register(name, weiboAccountAddress, {from: web3.eth.accounts[0], gas: defaultGas});
    }).then(function(txReceipt) {
      console.info(txReceipt);
      showAllRegister();
    });
  });
}

function getRegisterUser(id) {
  var addr;
  var weiboRegistryInstance;
  return WeiboRegistry.at(weiboRegistryAddress).then(function(instance) {
    weiboRegistryInstance = instance;
    return weiboRegistryInstance.getAddressOfId.call(id).then(function(a) {
      addr = a;
      return weiboRegistryInstance.getNameOfAddress.call(addr);
    }).then(function(name) {
      return (id:id, name:name, addr:addr);
    });
  });
}

function getTotalRegisterUser() {
  return WeiboRegistry.at(weiboRegistryAddress).then(function(instance) {
    weiboRegistryInstance = instance;
    return weiboRegistryInstance.getNumberOfAccounts.call();
  }).then(function(total) {
    return total;
  });
}

async function getAllRegister() {
  let users = [];
  let total = await getTotalRegisterUser();
  for (let i = 0; i < total; i++) {
    let user = await getRegisterUser();
    users.push(user);
  }
  return users;
}

function showAllRegister() {
  getAllRegister().then(function(list) {
    $("#weiboList").html('');
    list.forEach(function(item, index) {
      $("#weiboList").append("<tr><td>" + item.id + "<tr><td>" + item.name + "</td><td>" + item.addr + "</td></tr>");
    });
    currentWeiboAddress = list[0].addr || "";
  })
}

function platformBalance() {
  let balance = web3.eth.getBalance(weiboRegistryAddress);
  balance = web3.fromWei(balance, 'ether');
  return balance.toString();
}

function getPlantformInfo() {
  $("#plantformAccount").html(weiboRegistryAddress);
  $("#plantformBalance").html(plantformBalance() + " ether");
}

function sendWeibo() {
  var weiboAccountInstance;
  var weiboContent = $("#weiboContent").val();
  WeiboAccount.at(currentWeiboAddress).then(function(instance) {
    weiboAccountInstance = instance;
    return weiboAccountInstance.weibo(weiboContent, {from: web3.eth.accounts[0], gas:defaultGas});
  }).then(function(txReceipt) {
    console.info(txReceipt);
    showWeibo();
    $("#weiboContent").val('');
  });
}

function getiWeibo(weiboAddress, id) {
  var weiboAccountInstance;
  return WeiboAccount.at(weiboAddress).then(function(instance) {
    weiboAccountInstance = instance;
    return weiboAccountInstance.getWeibo.call(id).then(function(w) {
      return (id:id, weiboContent:w[0], timestamp:w[1]);
    });
  });
}

function getTotalWeibo(weiboAddress) {
  var weiboAccountInstance;
  return WeiboAccount.at(weiboAddress).then(function(instance) {
    weiboAccountInstance = instance;
    return weiboAccountInstance.getNumberOfWeibos.call();
  }).then(function(total) {
    return total;
  });
}

async function getAllWeibo(weiboAddress) {
  let weibos = [];
  let total = await getTotalWeibo(weiboAddress);
  for (let i = 0; i < total; i++) {
    let weibo = await getWeibo(weiboAddress, i);
    weibos.push(weibo);
  }
  return weibos;
}

function showWeibo() {
  getAllWeibo(currentWeiboAddress).then(function(list) {
    $("#weiboContentList").html('');
    list.forEach(function(item, index) {
      $("#weiboContentList").append("<tr><td>" + item.id + "</td><td>" + item.weiboContent + "</td><td>" + item.timestamp + "</td></tr>");
    });
  });
}

function weiboBalance() {
  var balance = web3.eth.getBalance(currentWeiboAddress);
  balance = web3.fromWei(balance, "ether");
  return balance.toString();
}

function getNameOfAddress() {
  var weiboRegistryInstance;
  return WeiboRegistry.at(weiboRegistryAddress).then(function(instance) {
    weiboRegistryInstance = instance;
    return weiboRegistryInstance.getNameOfAddress.call(currentWeiboAddress);
  }).then(function(name) {
    $("#myName").html(name);
  });
}

function getWeiboInfo() {
  getNameOfAddress();
  $("#myAccount").html(currentWeiboAddress);
  $("#myBalance").html(weiboBalance + " ether");
}

window.onload = function() {
  getPlantformInfo();
  showAllRegister();
  $("#home_tab").click(function (e) {
    alert("click");
    e.preventDefault();
    getPlantformInfo();
    showAllRegister();
  });

  $("#weibo_tab").click(function(e) {
    alert("click");
    e.preventDefault();
    getWeiboInfo();
    showWeibo();
  });

  $("#registerBtn").click(function() {
    alert("click");
    register();
  });

  $("#sendweiboBtn").click(function() {
    alert("click");
    sendWeibo();
  });
};
