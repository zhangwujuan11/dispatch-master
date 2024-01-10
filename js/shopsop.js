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
    }
  },
  created() {


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
    toInstall() {
      window.location.href = "shopInstall.html"
    },
    //跳转详情
    toDetail(item) {
      window.location.href = "shopInstall.html?carg=" + item.carg;
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
          console.log("page.num=" + page.num + ", page.size=" + page.size + ", curPageData.length=" + curPageData.length + ", self.pdlist.length==" + self.pdlist.length);

          //方法一(推荐): 后台接口有返回列表的总页数 totalPage
          self.mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)
        })
      }, function () {
        self.$nextTick(() => {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
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
        pageNo: pageNum,
        pageSize: pageSize,
      }
      Service.sopMaterialList('POST', JSON.stringify(params), (function callback(data) {
        // console.log("=====数据：", data)
        if (data.code == 200) {
          self.totalPage = data.count;
          var listData = data.data;
          successCallback && successCallback(listData); //成功回调
        }
      }))
    }
  },

});

// var date = new Date("2018-1-21");
// alert(date.getDay());


//禁止PC浏览器拖拽图片,避免与下拉刷新冲突;如果仅在移动端使用,可删除此代码
document.ondragstart = function () {
  return false;
}