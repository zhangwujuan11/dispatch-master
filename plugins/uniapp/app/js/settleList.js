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
    subFlag: true,
    shopInfo: {}
  },
  created() {
    fn.routeQuery(tempJson)
  },
  mounted: function () {
    //创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
    //解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
    var self = this;
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
    this.getShopSettleList();
    this.getShopDetail()
    //初始化vue后,显示vue模板布局
    document.getElementById("appContent").style.display = "block";


  },
  methods: {
    getShopDetail() {
      var _self = this;
      var params = {};
      Service.getShopDetail('GET', params, (function callback(data) {
        console.log("=====数据：", data.data)
        if (data.code == 200) {
          _self.shopInfo = data.data;
        }
      }))
    },
    //结算中
    toSettleListIng() {
      window.location.href = "settleListIng.html";
    },

    //已结算
    toSettleListEnd() {
      window.location.href = "settleListEnd.html";
    },

    //选择
    selSet(e) {
      if (e.bargainSucc != 1) {
        e.flagSel = !e.flagSel;
        // var len = this.pdlist.length ;
        // const list = this.pdlist;
        // const newList = [];
        // list.forEach(item => {
        //     if (item.isBargain == 0) {
        //         newList.push(item)
        //     }
        // })
        let list = this.pdlist.filter((item) => {
          return item.bargainSucc != 1
        });
        var len = list.length;
        var sumLen = 0;
        for (var i = 0; i < len; i++) {
          if (list[i].flagSel) {
            sumLen += 1;
          }
        }
        console.log('订单长度：', len, ' 选中长度：', sumLen)
        if (len == sumLen) {
          this.allSelect = true;
        } else {
          this.allSelect = false;
        }
        this.calcTotal();
      }

    },

    //全选
    allSel() {
      //this.allSelect = !this.allSelect;

      if (this.allSelect) {
        for (var i in this.pdlist) {
          if (this.pdlist[i].bargainSucc != 1) {
            this.pdlist[i].flagSel = false;
          }

        }
        this.allSelect = false;
      } else {
        for (var i in this.pdlist) {
          if (this.pdlist[i].bargainSucc != 1) {
            this.pdlist[i].flagSel = true;
          }
        }
        this.allSelect = true;
      }
      this.calcTotal();
    },

    //计算总价
    calcTotal() {
      this.orderSnList = [];
      let list = this.pdlist;
      if (list.length === 0) {
        return;
      }
      let total = 0;
      list.forEach(item => {
        if (item.flagSel === true) {
          total += parseFloat(item.settlePrice);
          this.orderSnList.push(item.orderSn);
        }
      })
      this.totalPrice = total.toFixed(2);
      console.log("订单序号：", this.orderSnList)
    },
    //获取结算单位列表
    getShopSettleList() {
      var _self = this;
      var params = {
        pageNo: 1,
        pageSize: 999
      }
      Service.getShopSettleList('POST', JSON.stringify(params), (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          for (var i in data.data) {
            data.data[i].selFlag = false;
          }
          _self.settleList = data.data;
        }
      }))
    },
    //显示结算单位
    toNext() {
      if (!this.orderSnList.length) {
        fn.showTip('请先选择结算订单号！');
        return false;
      }
      if (this.shopInfo.id == 1016 || this.shopInfo.id == 1015) {
        if ((new Date().getDate() >= 5 && new Date().getDate() <= 10) || (new Date().getDate() >= 20 && new Date().getDate() <= 23)) {

        } else {
          fn.showTip("结算日期为每月的5号到10号,20号到23号");
          return false;
        }
      } else {
        if (new Date().getDate() < 5 || new Date().getDate() > 10) {
          fn.showTip("结算日期为每月的5号到10号");
          return false;
        }
      }

      this.showUnitCharge = true;
    },
    //返回
    cancelSettleSel() {
      this.showUnitCharge = false;
    },

    //选择结算单位 
    getSelectSettle(e) {
      for (var i in this.settleList) {
        this.settleList[i].selFlag = false;
      }
      e.selFlag = true;
      this.settlementCompanyId = e.settlementId
    },

    // 弹框开关
    toggleService(e) {
      if (this.seviceClass === 'show') {
        this.seviceClass = 'hide';
        setTimeout(() => {
          this.seviceClass = 'none';
        }, 250);
      } else if (this.seviceClass === 'none') {
        this.seviceClass = 'show';
        this.orderPrice = e.orderPrice;
        this.orderSn = e.orderSn
      }
    },

    stopPrevent() {},




    //判断争议信息
    chackPrixInfo() {
      if (!this.bargain) {
        fn.showTip("争议价格不能为空！");
        return false;
      }
      return true;
    },

    //争议提交 
    surPrixSettle() {
      var _self = this;
      if (!this.chackPrixInfo()) {
        return false;
      }
      var params = {
        bargain: this.bargain,
        bargainDes: this.bargainDes,
        orderPrice: this.orderPrice,
        orderSn: this.orderSn
      }
      Service.bargainOrder('POST', JSON.stringify(params), (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          fn.showTip('价格争议提交成功，请耐心等待审核！');
          _self.toggleService();
          _self.mescroll.resetUpScroll();
        }
      }))
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
          self.allSelect = false;
          //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
          console.log("page.num=" + page.num + ", page.size=" + page.size + ", curPageData.length=" + curPageData.length + ", self.pdlist.length==" + self.pdlist.length);

          //方法一(推荐): 后台接口有返回列表的总页数 totalPage
          self.mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

          //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
          //self.mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

          //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
          //self.mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

          //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
          //self.mescroll.endSuccess(curPageData.length);
        })
      }, function () {
        self.$nextTick(() => {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      });
    },

    getListDataFromNet: function (pageNum, pageSize, successCallback, errorCallback) {
      //延时一秒,模拟联网
      var params = {
        pageNo: pageNum,
        pageSize: pageSize
      }
      Service.getOrderSettleDjsList('POST', JSON.stringify(params), (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          self.totalPage = data.count;

          var listData = data.data;
          for (var i in listData) {
            listData[i].flagSel = false;

          }
          successCallback && successCallback(listData); //成功回调
        }
      }))


    },

    //判断信息
    chackInfo() {
      if (!this.orderSnList.length) {
        fn.showTip("请先选择结算订单号！");
        return false;
      }
      if (!this.settlementCompanyId) {
        fn.showTip("请先选择结算单位！");
        return false;
      }
      return true;
    },

    //确认结算
    surSettle() {
      var _self = this;
      if (!this.chackInfo()) {
        return false;
      }

      var params = {
        orderSnList: this.orderSnList,
        settlementCompanyId: this.settlementCompanyId,
        settlementPrice: this.totalPrice
      }
      if (_self.subFlag) {
        _self.subFlag = false;

        console.log("结算参数：", params)
        Service.applyOrderSettle('POST', JSON.stringify(params), (function callback(data) {
          console.log("=====数据：", data)
          if (data.code == 200) {
            fn.showTip('结算申请成功', 'settleListIng.html');
          }
          _self.subFlag = true;
        }))
      }
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