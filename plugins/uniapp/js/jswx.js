//分享

function toShare(title, desc, links, imgUrl) {
  //alert(111)
  var link = window.location.href;
  $.ajax({
      url: HOST + 'wx/autoSignature',
      type: 'GET',
      dataType: 'json',
      data: {
        url: link
      }
    })
    .done((data) => {
      console.log('data3:', data);
      if (data.code == 200) {
        var appId = data.data.appId;
        var timestamp = data.data.timestamp;
        var nonceStr = data.data.nonceStr;
        var signature = data.data.signature;
        //alert( signature)
        wx.config({
          debug: false, //调式模式，设置为ture后会直接在网页上弹出调试信息，用于排查问题
          appId: appId,
          timestamp: timestamp,
          nonceStr: nonceStr,
          signature: signature,
          jsApiList: [ //需要使用的网页服务接口
            'onMenuShareTimeline', //分享给好友
            'onMenuShareAppMessage', //分享到朋友圈
            'chooseImage', //拍照或从手机相册中选图接口
            'previewImage', //预览图片接口
            'uploadImage', //上传图片接口
            'downloadImage', //下载图片接口
          ]
        });
      } else {
        //alert(333)
        fn.showTip(data.message)
      }

    })
  //alert(imgUrl);
  wx.ready(function () {
    wx.onMenuShareTimeline({ //例如分享到朋友圈的API  
      title: title, // 分享标题
      desc: desc,
      link: links, // 分享链接
      imgUrl: imgUrl, // 分享图标
      success: function () {
        //alert('1111')
      },
      cancel: function () {
        //alert('222')
      }
    });

    wx.onMenuShareAppMessage({
      title: title, // 分享标题
      desc: desc,
      link: links, // 分享链接
      imgUrl: imgUrl, // 分享图标
      trigger: function (res) {
        // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
        //alert('用户点击发送给朋友');
      },
      success: function (res) {
        // alert('已分享');
      },
      cancel: function (res) {
        //alert('已取消');
      },
      fail: function (res) {
        //alert(JSON.stringify(res));
      }
    });
    // alert('已注册获取“发送给朋友”状态事件');
  });
  wx.error(function (res) {
    alert(res.errMsg); //打印错误消息。及把 debug:false,设置为debug:ture就可以直接在网页上看到弹出的错误提示
  });
}
// $(function () {
//   document.onkeydown = function () {
//     if (window.event && window.event.keyCode == 123) {
//       alert("F12被禁用");
//       event.keyCode = 0;
//       event.returnValue = false;
//     }
//     if (window.event && window.event.keyCode == 13) {
//       window.event.keyCode = 505;
//     }
//     if (window.event && window.event.keyCode == 8) {
//       alert(str + "\n请使用Del键进行字符的删除操作！");
//       window.event.returnValue = false;
//     }
//   }

// })