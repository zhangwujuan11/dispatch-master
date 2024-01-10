var HOST = "https://api.edows.cn/api/";
var Service = {
  /**
   * 获取验证码
   * option 请求方式（post或者get）
   * params 请求参数
   * callback 回调   下面接口这三个参数的意义相同
   */
  subPopular: function(option, params, callback) {
    var url = HOST + "popular/submit";
    this.commonMethod(url, option, params, callback);
  },
 
  commonMethod: function(url, option, params, callback) {
    $.ajax({
      url: url,
      type: option,
      data: params,
      contentType: "application/json;charset-UTF-8",
      dataType: "json"
    })
      .done(function(data) {
        if (data.code == 200) {
          callback(data);
        } else {
          callback(data);
          fn.showTip(data.message);
        }
      })
      .fail(function() {
        //fn.commonWindow("网络错误，请稍后再试")
      });
  }
};
