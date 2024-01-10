var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  annonceInfo: {},
  pdlist: [],
  mescroll: null,
  pdlist: [],
  totalPage: 1,
  allSelect: false,

}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {
    //获取详情
    startOrder(item) {
      window.location.href = "artificerUpload.html?joinId=" + item.joinId + "&activId=" + item.activId + "&itemId=" + item.itemId + "&personName=" + item.personName + "&itemName=" + item.itemName
    },
    orderRefuse(item) {
      window.location.href = "artificerUpload.html?joinId=" + item.joinId + "&activId=" + item.activId + "&itemId=" + item.itemId + "&personName=" + item.personName + "&itemName=" + item.itemName
    },

    getJoinList() {
      //延时一秒,模拟联网

      Service.joinList('POST', tempJson.activId, (function callback(data) {
        if (data.code == 200) {
          this.pdlist = data.data;
        } else {
          fn.showTip(data.message);
        }
      }))
    },
    upCallback: function (page) {
      //联网加载数据
      var self = this;
      console.log(page, 1111)
      this.getListDataFromNet(page.num, page.size, function (curPageData) {
        self.$nextTick(() => {
          console.log(curPageData, 1111)
          if (page.num == 1) self.pdlist = [];

          self.pdlist = self.pdlist.concat(curPageData);
          self.allSelect = false;
          self.mescroll.endByPage(curPageData.length);
        })
      }, function () {
        self.$nextTick(() => {
          self.mescroll.endErr();
        })
      });
    },

    getListDataFromNet: function (pageNum, pageSize, successCallback, errorCallback) {
      Service.joinList('POST', tempJson.activId, (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {

          successCallback && successCallback(data.data); //成功回调
        }
      }))
    },

  },
  created() {
    // fn.routeQuery(tempJson)
    console.log(tempJson)
    console.log(userInfo)
  },
  mounted: function () {

    let self = this
    self.mescroll = new MeScroll("mescroll", {
      up: {

        callback: self.upCallback, //上拉回调
        //以下参数可删除,不配置
        page: {
          size: 10
        }, //可配置每页8条数据,默认10
        toTop: { //配置回到顶部按钮
          src: "images/mescroll/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
          //offset : 1000
        },
        empty: { //配置列表无任何数据的提示
          warpId: "dataList",
          icon: "images/mescroll/mescroll-empty.png",
          tip: "亲,暂无相关数据哦~",
          // btntext: "去逛逛 >",
          // btnClick: function() {
          //     alert("点击了去逛逛按钮");
          // }
        }
      }
    });

    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  }
})