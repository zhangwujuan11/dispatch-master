var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);
const plus = window.plus;
var data = {
  showNav: false,
  isShow: false,
  openId: "",
  info: {},
  longClick: 0,
  timeOutEvent: 0,
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {

    start() {
      var that = this;
      this.longClick = 0;
      this.timeOutEvent = setTimeout(function () {
        that.longClick = 1;
        that.savePicture()
      }, 500);
    },
    savePicture() { // 创建下载任务
      console.log(111)
      let picurl = "http://www.txsofts.com/dispatch/images/sale/10.png";
      //图片保存到手机后的路径
      let picname = "_downloads/erwei.png";
      var dtask = plus.downloader.createDownload(picurl, {}, function (d, status) {
        // 下载完成
        if (status == 200) {
          alert("Download success: " + d.filename);
          plus.gallery.save(picname, function () { //保存到相册方法
            fn.showTip("已保存到手机相册");
          }, function () {
            fn.showTip("保存失败，请重试！");
          });
        } else {
          alert("Download failed: " + status);
        }
      });
      //dtask.addEventListener( "statechanged", onStateChanged, false );
      dtask.start(); //开始下载
    }


  },
  mounted: function () {
    var _self = this;
    //初始化vue后,显示vue模板布局
    $('.Insurance').height(innerHeight + 'px');
    $('.Insurance').width(innerWidth + 'px')
  }
})