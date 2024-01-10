var HOST = "https://api2.edows.cn/api/"; //正式环境
var WebHost ="http://dispatch.edows.cn/"

var Service = {
	  //我的权益列表
	  interestList: function (option, params, callback) {
	    var url = HOST + "insurable/interest/list";
	    this.commonMethod(url, option, params, callback);
	  },
	  
	  // 是否可申请，返回工单部分信息
	  ifablesend:function(option, params, callback) {
	    var url = HOST + "insurable/interest/getOrderNo";
	    this.commonMethod(url, option, params, callback);
	  },
	  
	  // 确认申请权益
	  applyCertificate:function(option, params, callback) {
	    var url = HOST + "insurable/interest/applyCertificate";
	    this.commonMethod(url, option, params, callback);
	  },
	  
	  // 申请列表
	  applylist:function(option, params, callback) {
	    var url = HOST + "insurable/interest/applyList";
	    this.commonMethod(url, option, params, callback);
	  },
	  
	  // 申请权益详情
	  appldetails:function(option, params, callback) {
	    var url = HOST + "insurable/interest/applyDel";
	    this.commonMethod(url, option, params, callback);
	  },
	  
	 
	  
	  
	  
	  
	  
	// 操作提示
	showTip: function (msg, url) {
	  //console.log("url is "+ url) ;
	  msg = msg || '出错啦，请稍后再试～';
	  $('#tip-mes').html(msg);
	  if (url) {
	    $('#tip-box').show().delay(2000).hide(0);
	    setTimeout(function () {
	      window.location.href = url;
	    }, 1000);
	  } else {
	    $('#tip-box').show().delay(2000).hide(0);
	  }
	},
	// 请求封装
	commonMethod: function (url, option, params, callback) {
		var userInfo = ""
	  fn.showLoading();
	  $.ajax({
	      url: url,
	      type: option,
	      data: params,
	      contentType: "application/json;charset-UTF-8",
	      dataType: "json",
	      headers: {
	        'token': userInfo ? userInfo.token : ""
	      },
	    })
	    .done(function (data) {
	      if (data.code == 200) {
	        fn.closeLoading();
	        callback(data);
	      } else if (data.code == 401) {
	        fn.closeLoading();
	        //跳转登录页面
	        setTimeout(function () {
	          //window.localStorage.clear();
	          // window.localStorage.setItem("userInfo", "");
	          // window.location.href = "login.html?returnUrl=" + window.location.href;
	        }, 100);
	      } else if (data.code == 406) {
	        fn.closeLoading();
	        //跳转登录页面
	        setTimeout(function () {
	          console.log("没有token")
	        }, 100);
	      } else {
	        fn.closeLoading();
	        callback(data);
	        fn.showTip(data.message);
	      }
	    })
	
	}
}