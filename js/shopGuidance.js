var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  accountType: "",
  shopInfo: {

  },

  carInfoList: [],
  brandId: '',
  prolist: [],
  kw: '',
  pageNo: 0,
  totalPage: 1,
  showShop: false,
  sopItemList: []
}

var vm = new Vue({
  el: '#app',
  data: data,
  mounted: function () {
    var _self = this;
    this.accountType = userInfo.accountType ? userInfo.accountType : 0;

    //得到商品名称列表
    _self.mescroll = new MeScroll("mescroll", {
      up: {
        callback: _self.upCallback, //上拉回调
        //以下参数可删除,不配置
        page: {
          size: 20
        }, //可配置每页8条数据,默认10
        toTop: { //配置回到顶部按钮
          src: "images/mescroll/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
          //offset : 1000
        },
        isBounce: false,
        empty: { //配置列表无任何数据的提示
          warpId: "dataList",
          icon: "images/mescroll/mescroll-empty.png",
          // tip: "亲,暂无相关数据哦~",
          // btntext: "返回 >",
          // btnClick: function () {
          //   _self.step1 = true;
          //   _self.step4 = false;
          // }
        }
      }
    });
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  },
  methods: {
    toProName(searchType) {
      this.kw = "";

      this.step1 = false;
      this.step4 = true;
      this.prolist = [];
      this.mescroll.resetUpScroll();
      this.mescroll.scrollTo(0, 300); //回到顶部
    },
    //得到商品名称搜索
    search(item) {
      this.kw = item;
      this.prolist = [];
      this.mescroll.resetUpScroll();
      this.mescroll.scrollTo(0, 300); //回到顶部
    },
    //确认筛选
    surSrh(e) {

      // this.shopInfo.glassType = e.glassType
      // this.shopInfo.partsName = e.partsName;
      // this.shopInfo.carg = e.carg
      // this.shopInfo.gysPartsSn = e.gysPartsSn

      console.log()
      let cergs = encodeURIComponent(HOST + "sop/preview?carg=" + e.carg)
      // window.location.href = 
      window.location.href = "./plugins/pdfjs/web/viewer.html?file=" + cergs

    },
    upCallback: function (page) {
      //联网加载数据
      var self = this;
      this.getsopGlassList(page.num, page.size, function (curPageData) {
        self.$nextTick(() => {
          if (page.num == 1) self.prolist = [];
          self.prolist = self.prolist.concat(curPageData);
          self.mescroll.endByPage(curPageData.length, totalPage);
        })
      }, function () {
        self.$nextTick(() => {
          self.mescroll.endErr();
        })
      });
    },
    getsopGlassList: function (pageNum, pageSize, successCallback, errorCallback) {
      this.pageNo = pageNum;

      var params = {
        carg: "",
        pageNo: pageNum, //页码
        pageSize: pageSize
      }
      Service.sopList('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          self.totalPage = data.total;
          var listData = data.data;
          successCallback && successCallback(listData); //成功回调  
        }
      }))

    },

  }
})