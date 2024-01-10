var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
  el: "#app",
  data: {
    showUnitCharge: false,
    settlementCompanyId: "",
    token: userInfo.token ? userInfo.token : "",
    mescroll: null,
    status: 0,
    // states: 1, //订单状态（1待付款6服务中7已完成）
    pdlist: [],
    totalPage: 1,
    allSelect: false,
    totalPrice: 0,
    orderSnList: [],
    settleList: [],
    seviceClass: 'none',
    settlementSn: "",
    orderPrice: "",
    orderSn: "",
    bargain: "",
    bargainDes: "",
    subFlag: true
  },
  created() {


  },
  mounted: function () {
    var self = this;
    self.mescroll = new MeScroll("mescroll", {
      up: {

        callback: self.upCallback,
        page: {
          size: 10
        },
        toTop: { //配置回到顶部按钮
          src: "images/mescroll/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
          //offset : 1000
        },
        empty: { //配置列表无任何数据的提示
          warpId: "dataList",
          icon: "images/mescroll/mescroll-empty.png",
          tip: "亲,暂无相关数据哦~",
        }
      }
    });
    //初始化vue后,显示vue模板布局
    document.getElementById("appContent").style.display = "block";

  },
  methods: {
    //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback: function (page) {
      //联网加载数据
      var self = this;
      this.getListDataFromNet(page.num, page.size, function (curPageData) {
        self.$nextTick(() => {
          //如果是第一页需手动制空列表
          if (page.num == 1) self.pdlist = [];
          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.allSelect = false;
          self.mescroll.endByPage(curPageData.length, totalPage);
        })
      }, function () {
        self.$nextTick(() => {
          self.mescroll.endErr();
        })
      });
    },

    getListDataFromNet: function (pageNum, pageSize, successCallback, errorCallback) {
      var params = {
        pageNo: pageNum,
        pageSize: pageSize
      }
      Service.consumeHistory('POST', JSON.stringify(params), (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          self.totalPage = data.count;
          var listData = data.data;
          for (var i in listData) {
            listData[i].createDate = fn.formatTime(listData[i].createDate, 'Y-M-D h:m:s');;
          }
          successCallback && successCallback(listData); //成功回调
        }
      }))
    },

  },
  computed: {


  },
});
//禁止PC浏览器拖拽图片,避免与下拉刷新冲突;如果仅在移动端使用,可删除此代码
document.ondragstart = function () {
  return false;
}