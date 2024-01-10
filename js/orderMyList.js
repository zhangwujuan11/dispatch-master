var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
  el: "#app",
  data() {
    return {
      token: userInfo.token ? userInfo.token : "",
      kw: "",
      mescroll: null,
      status: 0,
      // states: 1, //订单状态（1待付款6服务中7已完成）
      pdlist: [],
      totalPage: 1,
      arrLevel: [{
          name: "全部",
          score: 1,
          status: ''
        },
        {
          name: "待接单",
          score: 2,
          status: 100
        },
        {
          name: "处理中",
          score: 3,
          status: 102
        },
        {
          name: "已处理",
          score: 4,
          status: 104
        },
        {
          name: "已取消",
          score: 5,
          status: 103
        }
      ],
      orderSn: 0,
      orderStatus: ''
    }
  },
  mounted: function () {
    var self = this;
    self.mescroll = new MeScroll("mescroll", {
      up: {
        callback: self.upCallback, //上拉回调
        page: {
          size: 5
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
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  },
  methods: {
    showNormal(item) {
      this.orderStatus = item.status
      this.pdlist = [];
      this.mescroll.resetUpScroll();
      this.mescroll.scrollTo(0, 300); //回到顶部
    },
    //跳转详情
    toDetail(event) {
      event.preventDefault();
      event.stopPropagation();
      var el = event.currentTarget;
      var orderSn = $(el).attr('orderSn');
      var orderStatus = $(el).attr('orderStatus');
      if (orderStatus != 100 && orderStatus != 103) {
        // window.location.href = "orderDetail.html?orderId=" + orderSn;
      }
    },
    //上拉回调
    upCallback: function (page) {
      var self = this;
      this.getListDataFromNet(page.num, page.size, function (curPageData) {
        self.$nextTick(() => {
          if (page.num == 1) self.pdlist = [];
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endByPage(curPageData.length, totalPage);
        })
      }, function () {
        self.$nextTick(() => {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      });
    },
    getListDataFromNet: function (pageNum, pageSize, successCallback, errorCallback) {
      var _self = this;
      //延时一秒,模拟联网
      var params = {
        kw: tempJson.kw,
        orderStatus: _self.orderStatus,
        pageNo: pageNum,
        pageSize: pageSize,
      }
      Service.myOrderInfo('POST', JSON.stringify(params), (function callback(data) {
        // console.log("=====数据：", data)
        if (data.code == 200) {
          self.totalPage = data.count;
          var listData = data.data;
          for (var i in listData) {
            if (listData[i].orderStatus == 100) {
              listData[i].orderStatusDes = "待处理"
            } else if (listData[i].orderStatus == 103) {
              listData[i].orderStatusDes = "已取消"
            } else if (listData[i].orderStatus == 104) {
              listData[i].orderStatusDes = "已完成"
            } else {
              listData[i].orderStatusDes = "处理中"
            }

          }
          successCallback && successCallback(listData); //成功回调
        }
      }))
    }
  },

  computed: {


  },
});

// var date = new Date("2018-1-21");
// alert(date.getDay());


//禁止PC浏览器拖拽图片,避免与下拉刷新冲突;如果仅在移动端使用,可删除此代码
document.ondragstart = function () {
  return false;
}