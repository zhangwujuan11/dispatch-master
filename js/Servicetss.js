var HOST = "https://api.edows.cn/api/"; //正式环境
 // var HOST = "http://192.168.110.161:8085/api/";
 var WebHost ="http://dispatch.edows.cn/"
 // var HOST = " https://api2.edows.cn/api/";


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
	  
	  // 申请列表
	  applylist:function(option, params, callback) {
	    var url = HOST + "insurable/interest/applyList";
	    this.commonMethod(url, option, params, callback);
	  },
	  // 确认申请权益
	  applyCertificate:function(option, params, callback) {
	    var url = HOST + "insurable/interest/applyCertificate";
	    this.commonMethod(url, option, params, callback);
	  },
	  
	  // 申请权益详情
	  appldetails:function(option, params, callback) {
	    var url = HOST + "insurable/interest/applyDel";
	    this.commonMethod(url, option, params, callback);
	  },
	  /**
	   * 意见反馈
	   */
	  addFeedBack: function (option, params, callback) {
	    var url = HOST + "feedBack/add"
	    this.commonMethod(url, option, params, callback);
	  },
	 
	 buyvipserve:function (option, params, callback){
	 	  var url = HOST + "memberCard/order/create"
	 	   this.commonMethod(url, option, params, callback);
	 },
	queryserve: function (option, params, callback) {
		var url = HOST + "memberCard/query"
		this.commonMethod(url, option, params, callback);
	  },
	  
	gopay: function (option, params, callback) {
	var url = HOST + "memberCard/order/pay"
	this.commonMethod(url, option, params, callback);
  },
  getRightCardserve: function (option, params, callback) {
    var url = HOST + "memberCard/carlist";
    this.commonMethod(url, option, params, callback);
  },
  queryserve: function (option, params, callback) {
    var url = HOST + "memberCard/query"
    this.commonMethod(url, option, params, callback);
  },
  getRightCardOrderserve: function (option, params, callback) {
    var url = HOST + "memberCard/order/list"
    this.commonMethod(url, option, params, callback);
  },
	  
	getRightCardDetail: function (option, params, callback) {
	  var url = HOST + "memberCard/detail"
	  this.commonMethod(url, option, params, callback);
	},  
	getorders:function(option, params, callback) {
	    var url = HOST + "memberCard/order/detail";
	    this.commonMethod(url, option, params, callback);
	  }
	 
	  
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
	  fn.showLoading();
	  $.ajax({
	      url: url,
	      type: option,
	      data: params,
	      contentType: "application/json;charset-UTF-8",
	      dataType: "json",
	      // headers: {
	      //   'token': userInfo ? userInfo.token : ""
	      // },
	    })
	    .done(function (data) {
	      if (data.code == 200) {
			  // window.localStorage.setItem("openId", "oTx5O1FrJpMq-L-X43J0KAgQMEU4");
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
	          // window.localStorage.setItem("userInfo", "");
	          // window.location.href = "login.html?returnUrl=" + window.location.href;
	        }, 100);
	      } else {
	        fn.closeLoading();
	        callback(data);
	        fn.showTip(data.message);
	      }
	    })
	}
}
