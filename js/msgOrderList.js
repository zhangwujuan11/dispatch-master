var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
  el: "#app",
  data() {
    return {
      token: userInfo.token ? userInfo.token : "",
      mescroll: null,
      status: 0,
      selDate: "",
      startDate: "",
      endDate: "",
      finishDate: "",
      // states: 1, //订单状态（1待付款6服务中7已完成）
      pdlist: [],

      totalPage: 1,
      search: {
        orderLevel: 0, //1 综合， 2： 年龄 ， 3：评分 ,  4:等级
        level: 0,
        sex: 0
      },
      arrLevel: [{
          name: "全部",
          score: 1,
          status: 0
        },
        {
          name: "待接单",
          score: 2,
          status: 100
        },
        {
          name: "已接单",
          score: 3,
          status: 101
        },
        {
          name: "已拒绝",
          score: 4,
          status: 102
        },
        {
          name: "已取消",
          score: 5,
          status: 103
        },
        {
          name: "已完成",
          score: 6,
          status: 104
        }
      ],
      userType: "",
      refuseMsg: "",
      orderSn: 0,
      orderStatus: 0
    }
  },
  created() {},
  mounted: function () {
    //创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
    //解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
    var self = this;

    self.mescroll = new MeScroll("mescroll", {
      up: {
        callback: self.upCallback, //上拉回调
        //以下参数可删除,不配置
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
        }
      }
    });
    //时间选择
    var subinvman_sel = $("#startDate")[0];
    if (subinvman_sel) {
      document.querySelector("#startDate").addEventListener("tap", function () {
        var dtpicker = new mui.DtPicker({
          "type": "date"
        });
        // dtpicker.setSelectedValue("08:12");  
        dtpicker.show(function (items) {
          self.startDate = items.text;
          dtpicker.dispose();
        });
      });
    };

    var subinvman_sel = $("#endDate")[0];
    if (subinvman_sel) {
      document.querySelector("#endDate").addEventListener("tap", function () {
        var dtpicker = new mui.DtPicker({
          "type": "date"
        });
        dtpicker.show(function (items) {
          self.endDate = items.text;
          if (self.endDate < self.startDate) {
            fn.showTip('截止日期不能小于开始日期');
            self.endDate = "";
          }
          dtpicker.dispose();
        });
      });
    };
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  },
  methods: {


    //开始订单
    startOrder(event) {
      event.preventDefault();
      event.stopPropagation();
      var el = event.currentTarget;
      var orderSn = $(el).attr('orderSn');

      window.location.href = 'step.html?orderId=' + orderSn;
    },
    //隐藏或关闭弹框
    hideMask() {
      // $('.queryWarp').css('height','44px')
      $('.query-select,.mask').hide();
    },
    //综合排序 
    searchLevel(index) {
      var el = event.currentTarget;
      var score = el.getAttribute('score');
      var relDate = el.getAttribute('relDate');
      var status = el.getAttribute('status');
      var ids = index;


      if (index == 0) {
        this.search.orderLevel = score;
        this.status = status;
      }
      if (index == 1) {
        this.search.level = score;
        this.userType = relDate;
      }
      this.hideMask();
      if (index == 2) {
        this.startDate = "";
        this.endDate = "";
        //$('.query-title').eq(ids).find('em').html(relDate).addClass('green');
      }

      this.pdlist = [];
      this.mescroll.resetUpScroll();
      this.mescroll.scrollTo(0, 300); //回到顶部
    },
    //门店接单
    orderRecevie(event) {
      var _self = this;
      event.preventDefault();
      event.stopPropagation();
      var el = event.currentTarget;
      var orderSn = $(el).attr('orderSn');
      var params = {
        orderSn: orderSn
      }

      Service.msgOrderRecevie('POST', JSON.stringify(params), (function callback(data) {
        console.log(data)
        if (data.code == 200) {
          fn.showTip("接单成功");
          _self.pdlist = [];
          _self.mescroll.resetUpScroll();
          _self.mescroll.scrollTo(0, 300); //回到顶部
        }
      }))
    },

    //订单状态筛选
    showNormal() {
      // $('.queryWarp').css('height','100%');
      $('.hock_query-select,.mask').show();
      $('.query-selectFull,.query-selectDate').hide();
    },
    //订单时间筛选
    showDate() {
      //$('.queryWarp').css('height','100%');
      $('.query-selectDate,.mask').show();
      $('.query-selectFull,.hock_query-select').hide();
    },
    //跳转详情
    toDetail(event) {
      event.preventDefault();
      event.stopPropagation();
      var el = event.currentTarget;
      var orderSn = $(el).attr('orderSn');
      var orderStatus = $(el).attr('orderStatus');
      if (orderStatus == 101) {
        window.location.href = "msgOrderDetail.html?orderId=" + orderSn;
      }
    },

    //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback: function (page) {
      //联网加载数据
      var self = this;
      this.getListDataFromNet(page.num, page.size, function (curPageData) {
        // curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置
        self.$nextTick(() => {
          //如果是第一页需手动制空列表
          if (page.num == 1) self.pdlist = [];
          //更新列表数据
          self.pdlist = self.pdlist.concat(curPageData);
          self.mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)
        })
      }, function () {
        self.$nextTick(() => {
          self.mescroll.endErr();
        })
      });
    },
    changType(index) {
      var el = event.currentTarget;
      this.field = index;
      this.pdlist = [];
      this.mescroll.resetUpScroll();
    },

    getListDataFromNet: function (pageNum, pageSize, successCallback, errorCallback) {
      var _self = this;
      //延时一秒,模拟联网
      var params = {
        startDate: this.startDate,
        pageNo: pageNum,
        pageSize: pageSize,
        status: this.status,
        endDate: this.endDate,
      }

      Service.msgOrderList('POST', JSON.stringify(params), (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          self.totalPage = data.count;

          var listData = data.data;
          for (var i in listData) {
            if (listData[i].orderStatus == 100) {
              listData[i].orderStatusDes = "待接单"
            } else if (listData[i].orderStatus == 101) {
              listData[i].orderStatusDes = "已接单"
            } else if (listData[i].orderStatus == 102) {
              listData[i].orderStatusDes = "拒绝接单"
            } else if (listData[i].orderStatus == 103) {
              listData[i].orderStatusDes = "已取消"
            } else if (listData[i].orderStatus == 104) {
              listData[i].orderStatusDes = "已完成"
            }

            if (listData[i].settleStatus == 0) {
              listData[i].settlementStatusName = "待结算"
            } else if (listData[i].settleStatus == 1) {
              listData[i].settlementStatusName = "结算中"
            } else if (listData[i].settleStatus == 2) {
              listData[i].settlementStatusName = "已结算"
            }
          }
          successCallback && successCallback(listData); //成功回调
        }
      }))
    }
  },
  watch: {

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