var serDomaine = 'http://dispatch.edows.cn/'; //QQ腾讯地图返回地址

var temp_url = decodeURI(window.location.href),
  tempJson = unEscapeToJson(temp_url);


function unEscapeToJson(url) {
  var postData = url.substring(url.indexOf("?") + 1, url.length).split("&");
  var temp_json = {};
  for (var i = 0; i < postData.length; i++) {
    var temp_text = postData[i];
    var key = temp_text.substring(0, temp_text.indexOf("="));
    var val = temp_text.substring(temp_text.indexOf("=") + 1, temp_text.length);
    temp_json[key] = val;
  }
  return temp_json;
}

var userInfo = JSON.parse(window.localStorage.getItem("userInfo"))

if (userInfo) {
  console.log(1)
  if (tempJson.token) {
    if (userInfo.token != tempJson.token) {
      userInfo = {
        token: tempJson.token.split("?")[0],
        accountType: tempJson.accountType != undefined ? tempJson.accountType.split("?")[0] : ''
      }
      window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
    }
  }
} else {
  console.log(2)
  if (tempJson.token) {
    userInfo = {
      token: tempJson.token.split("?")[0],
      accountType: tempJson.accountType != undefined ? tempJson.accountType.split("?")[0] : ''
    }
    window.localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }
}


// const linkTo = "index.html";
// if (window.localStorage) {
//   userInfo = window.localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : "";
// } else {
//   userInfo = JSON.parse(Cookie.read("userInfo")) ? JSON.parse(Cookie.read("userInfo")) : "";
// }

// console.log("用户信息：", userInfo)

// if (!userInfo) {
//   // window.location.href = "login.html?returnUrl=" + window.location.href;
// }