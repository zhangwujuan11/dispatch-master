var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var map = new BMap.Map("container");
var localSearch = new BMap.LocalSearch(map);

var data = {
  isFy: true,
  step1: true,
  step2: false,
  step3: false,
  step4: false,
  step5: false,
  isShowWinMask: false,
  saleInfo: {},
  carType: '',
  carInfoId: "",
  parts: '',
  yearType: "",
  carList: [],
  arrWords: [],
  carTypeList: [],
  brandId: '',
  provSelected: "京",
  carNo: "",

  //provList: ['京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑', '湘', '皖', '鲁', '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '粤', '青', '藏', '川', '宁', '琼', '使', '领'],
  provList: [{
      code: '京',
      province: '北京'
    },
    {
      code: '津',
      province: '天津'
    },
    {
      code: '沪',
      province: '上海'
    },
    {
      code: '渝',
      province: '重庆'
    },
    {
      code: '冀',
      province: '河北'
    },
    {
      code: '豫',
      province: '河南'
    },

    {
      code: '云',
      province: '云南'
    },
    {
      code: '辽',
      province: '辽宁'
    },
    {
      code: '黑',
      province: '黑龙江'
    },
    {
      code: '湘',
      province: '湖南'
    },
    {
      code: '皖',
      province: '安徽'
    },
    {
      code: '鲁',
      province: '山东'
    },

    {
      code: '新',
      province: '新疆'
    },
    {
      code: '苏',
      province: '江苏'
    },
    {
      code: '浙',
      province: '浙江'
    },
    {
      code: '赣',
      province: '江西'
    },
    {
      code: '鄂',
      province: '湖北'
    },
    {
      code: '桂',
      province: '广西'
    },

    {
      code: '甘',
      province: '甘肃'
    },
    {
      code: '晋',
      province: '山西'
    },
    {
      code: '蒙',
      province: '内蒙古'
    },
    {
      code: '陕',
      province: '陕西'
    },
    {
      code: '吉',
      province: '吉林'
    },
    {
      code: '闽',
      province: '福建'
    },
    {
      code: '贵',
      province: '贵州'
    },
    {
      code: '粤',
      province: '广东'
    },
    {
      code: '青',
      province: '青海'
    },
    {
      code: '藏',
      province: '西藏'
    },
    {
      code: '川',
      province: '四川'
    },
    {
      code: '宁',
      province: '宁夏'
    },
    {
      code: '琼',
      province: '海南'
    },
    {
      code: '使',
      province: '大使馆'
    },
    {
      code: '领',
      province: '领士馆'
    }

  ],
  carInfoList: [],
  pdlist: [],
  personId: "",
  mobile: "",
  payMethod: "",
  productFl: "", //辅料
  securityCode: "", //太阳膜防伪编码
  keepYears: "", //质保年限
  productName: "", //商品名称
  productSn: "",
  remarks: "",
  salesPerson: "",
  retailPrice: "",
  totalPrice: "",
  totalSum: 1,
  userName: "",
  userType: "",
  orderSn: "",
  mescroll: null,
  prolist: [],
  pageNo: 0,
  totalPage: 1,
  kw: '',
  productAttr: '',
  productFlOption: [{
      name: '太阳膜'
    },
    {
      name: '车衣'
    },
    {
      name: '改色膜'
    },
    {
      name: '玻璃'
    },
    {
      name: '其他'
    },
  ],
  searchType: 'proName'
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {

    //订单详情数据
    getOrderSaleDetail() {
      var _self = this;
      var params = {
        orderSn: tempJson.orderId ? tempJson.orderId : ""
      }
      Service.getOrderSaleDetail('GET', params, (function callback(data) {
        console.log("=====数据====：", data)
        if (data.code == 200) {
          _self.saleInfo = data.data;
          _self.saleInfo.saleDate = fn.formatTime(_self.saleInfo.saleDate, 'Y-M-D')
          _self.carInfoId = _self.saleInfo.carInfoId;
          //"carNo": this.provSelected + this.carNo,
          _self.provSelected = _self.saleInfo.carNo.substring(0, 1)
          _self.carNo = _self.saleInfo.carNo.substr(1)
          _self.carType = _self.saleInfo.carType;
          _self.mobile = _self.saleInfo.mobile;
          _self.payMethod = _self.saleInfo.payMethod;
          _self.personId = _self.saleInfo.personId;
          _self.productFl = _self.saleInfo.productFl;
          _self.productName = _self.saleInfo.productName;
          _self.productSn = _self.saleInfo.productSn;
          _self.remarks = _self.saleInfo.remarks;
          _self.salesPerson = _self.saleInfo.salesPerson;
          _self.totalPrice = _self.saleInfo.totalPrice;
          _self.totalSum = _self.saleInfo.totalSum;
          _self.userName = _self.saleInfo.userName;
          _self.userType = _self.saleInfo.userType;
          _self.orderSn = _self.saleInfo.orderSn;

        }
      }))
    },
    //获取辅料信息
    getProductMateria() {
      var _self = this;
      var params = {}
      Service.getProductMateria('GET', params, (function callback(data) {
        if (data.code == 200) {
          _self.productFlOption = data.data;
        }
      }))
    },

    cngproductFl() {
      console.log(this.productFl)
    },

    // navigator.geolocation.getCurrentPosition(function(position) {
    //     var lat = position.coords.latitude;
    //     var lon = position.coords.longitude;
    //     var point = new BMap.Point(lon, lat); // 创建坐标点
    //     // 根据坐标得到地址描述
    //     var myGeo = new BMap.Geocoder();
    //     myGeo.getLocation(point, function(result) {
    //         var city = result.addressComponents.city;
    //         $('body').html(city);
    //     });
    // }),

    //小写转大写
    toUpperCase(e) {
      // console.log('e：',e.toUpperCase())
      this.carNo = e.toUpperCase();
    },

    //获取店员信息
    getShopMemberInfo() {
      var _self = this;
      var params = {
        pageNo: 1,
        pageSize: 999,
      }
      Service.getShopPersonList('POST', JSON.stringify(params), (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          _self.pdlist = data.data;
          console.log("=====数据：", _self.pdlist)

        }

      }))
    },

    //商品信息切换
    toCngProName(e) {
      var oldIsFy = this.isFy;
      if (e == "isFy") {
        this.isFy = true;
        this.productName = "";
        this.productSn = "";
        this.carType = "";
      }
      if (e == "isNoFy") {
        this.isFy = false;
        this.productName = '非玻产品'
        this.productSn = new Date().getTime()
      }
    },

    //添加店员
    toAddShopUser() {
      window.location.href = 'shopUserAdd.html?returnUrl=saleAdd.html'
    },

    //选择车型
    cngCarType() {
      //this.getCarList();
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    },

    //车辆列表
    getCarList() {
      var _self = this;
      var params = {
        token: userInfo.token
      }
      Service.getBrandList('GET', params, (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          _self.carList = data.data;
          if (data.data.length) {
            var firstletter = []
            for (var i = 0; i < data.data.length; i++) {
              firstletter.push(data.data[i].firstletter)
            }
            _self.arrWords = fn.uniqArrs(firstletter);
          }
          console.log(_self.arrWords)
        }
      }))
    },


    //得到车型
    getCarTypeList() {
      var _self = this;
      var params = {
        token: userInfo.token,
        brandId: this.brandId
      }
      Service.getCarSeriesList('GET', params, (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          _self.carTypeList = data.data;
          _self.step1 = false;
          _self.step2 = false;
          _self.step3 = true;
          _self.step4 = false;
          _self.step5 = false;
        }
      }))
    },

    //选择车辆
    cngCar(e) {
      this.brandId = e.id;
      this.getCarTypeList();
    },
    //隐藏
    hideMask() {
      $('.mask').hide();
      $('.showCarType').hide();
      $('.showCarType').css({
        "left": "100%"
      });
    },

    //选择车型
    surCarType(e) {
      var _self = this;
      $('.mask').show();
      var serId = e.id;
      var params = {
        token: userInfo.token,
        seriesId: serId
      }
      Service.getCarSeries('GET', params, (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          _self.carInfoList = data.data;
        }
      }))
      $('.showCarType').show().animate({
        "left": "40%"
      }, 300);

    },

    //选择车型车辆
    selCarType(e) {
      console.log(e);
      this.carType = e.fullName;
      this.carInfoId = e.id;
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    },
    //选择商品名称
    toProName(searchType) {
      this.kw = "";
      this.searchType = searchType;
      this.step1 = false;
      this.step2 = false;
      this.step3 = false;
      this.step4 = true;
      this.step5 = false;
      this.prolist = [];
      this.mescroll.resetUpScroll();
      this.mescroll.scrollTo(0, 300); //回到顶部
    },

    //得到商品名称搜索
    search(item) {
      console.log(item)
      this.kw = item;
      this.prolist = [];
      this.mescroll.resetUpScroll();
      this.mescroll.scrollTo(0, 300); //回到顶部
    },
    //确认筛选
    surSrh(e) {
      if (this.searchType == 'proName') {
        this.productName = e.glassName;
        this.productSn = e.carg;
        this.carType = e.carInfoName;
        this.retailPrice = e.retailPrice;
      }
      if (this.searchType == 'securityCode') {
        this.securityCode = e.securityCode;
        this.productAttr = e.productName;
        console.log("规格信息：", this.productAttr);
        this.searchType = 'proName';

      }

      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    },

    //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback: function (page) {
      //联网加载数据
      var self = this;
      this.getListDataFromNet(page.num, page.size, function (curPageData) {
        //curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置
        self.$nextTick(() => {
          //如果是第一页需手动制空列表
          if (page.num == 1) self.prolist = [];

          //更新列表数据
          self.prolist = self.prolist.concat(curPageData);

          //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
          //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
          console.log("page.num=" + page.num + ", page.size=" + page.size + ", curPageData.length=" + curPageData.length + ", self.prolist.length==" + self.prolist.length);

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
      // setTimeout(function() {
      this.pageNo = pageNum;

      //console.log(this.searchType == 'proName')

      if (this.searchType == 'proName') {
        var params = {
          kw: this.kw,
          pageNo: pageNum, //页码
          pageSize: pageSize
        }
        Service.queryGlassByKw('POST', JSON.stringify(params), (function callback(data) {
          if (data.code == 200) {
            self.totalPage = data.total;
            var listData = data.data.records;
            successCallback && successCallback(listData); //成功回调  
          }
        }))
      }
      if (this.searchType == 'securityCode') {
        var params = {
          securityCode: this.kw,
          saleStatus: 100,
          pageNo: pageNum, //页码
          pageSize: pageSize
        }
        Service.getSecurityCodeList('POST', JSON.stringify(params), (function callback(data) {
          if (data.code == 200) {
            self.totalPage = data.count;
            var listData = data.data;
            successCallback && successCallback(listData); //成功回调  
          }
        }))
      }




    },

    //判断信息
    chackInfo() {
      if (!this.userType) {
        fn.showTip("客户类型不能为空！");
        return false;
      }

      if (!this.userName) {
        fn.showTip("客户名称不能为空！");
        return false;
      }

      if (!this.carNo) {
        fn.showTip("车牌号码不能为空！");
        return false;
      }

      if (!this.mobile) {
        fn.showTip("联系电话不能为空");
        return false;
      }
      if (!fn.testRule.isTel(this.mobile)) {
        fn.showTip("请正确输入联系电话");
        return false;
      }

      if (!this.productSn) {
        fn.showTip("商品编码不能为空！");
        return false;
      }
      if (!this.productName) {
        fn.showTip("商品名称不能为空！");
        return false;
      }
      if (!this.carType && !this.isFy) {
        fn.showTip("商品品牌不能为空！");
        return false;
      }

      if (!this.totalSum) {
        fn.showTip("数量不能为空！");
        return false;
      }

      if (!this.productFl) {
        fn.showTip("辅料不能为空！");
        return false;
      }

      if (this.productFl == '太阳膜' && !this.securityCode) {
        fn.showTip("太阳膜防伪编号不能为空！");
        return false;
      }

      if (this.productFl == '太阳膜' && !this.keepYears) {
        fn.showTip("太阳膜质保年限不能为空！");
        return false;
      }


      if (!this.totalPrice) {
        fn.showTip("商品金额不能为空！");
        return false;
      }
      // if (!this.salesPerson) {
      //     fn.showTip("业务员不能为空！");
      //     return false;
      // }
      if (!this.payMethod) {
        fn.showTip("付款方式不能为空！");
        return false;
      }

      return true;
    },

    add() {
      var _self = this;
      if (!this.chackInfo()) {
        return false;
      }

      //this.memberInfo.dateCode = this.dateCode;
      // this.memberInfo.price = this.yearPrice.split(',')[1],
      //     this.memberInfo.rightCardId = tempJson.cardId ? tempJson.cardId : '',
      //     this.memberInfo.year = this.yearPrice.split(',')[0]

      var params = {
        // "carInfoId": this.carInfoId,
        "carNo": this.provSelected + this.carNo,
        "carType": this.carType,
        "mobile": this.mobile,
        "payMethod": this.payMethod,
        "personId": this.personId,
        "productBrand": this.isFy ? 1 : 2, //1是福耀  2是其他
        "productFl": this.productFl,
        "securityCode": this.securityCode,
        "productAttr": this.productAttr,
        "keepYears": this.keepYears,
        "productName": this.productName,
        "productSn": this.productSn,
        "remarks": this.remarks,
        "retailPrice": this.retailPrice,
        "salesPerson": this.salesPerson,
        "totalPrice": this.totalPrice,
        "totalSum": this.totalSum,
        "userName": this.userName,
        "userType": this.userType,
        "orderSn": this.orderSn
      }
      console.log('params：', params)
      Service.editOrderSale('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          console.log(data.data);
          fn.showTip('提交成功！', 'saleCode.html?orderId=' + data.data);
        }
      }))
    }

  },
  mounted: function () {
    var _self = this;
    // this.getProductMateria();
    // 根据省份定位，获取车牌首字母  provSelected
    var geolocation = new BMap.Geolocation();
    geolocation.getCurrentPosition(function (r) {
      if (this.getStatus() == BMAP_STATUS_SUCCESS) {
        var lat = r.address.lat //当前经度
        var lng = r.address.lng //当前纬度
        var province = r.address.province //返回当前省份
        var city = r.address.city //返回当前城市
        console.log('省份：', province)
        for (var i in _self.provList) {
          if (province.indexOf(_self.provList[i].province) != -1) {
            _self.provSelected = _self.provList[i].code
          }
        }
      }
    })

    this.orderSn = tempJson.orderId ? tempJson.orderId : ""

    this.getCarList();
    this.getShopMemberInfo();
    if (this.orderSn) {
      this.getOrderSaleDetail();
    }
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
          tip: "亲,暂无相关数据哦~",
          btntext: "返回 >",
          btnClick: function () {
            _self.step1 = true;
            _self.step2 = false;
            _self.step3 = false;
            _self.step4 = false;
            _self.step5 = false;
          }
        }
      }
    });

    //_self.year = fn.formatTime(new Date(), 'Y-M-D');
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      $('body').on('click', '.letter a', function () {
        var s = $(this).html();
        $(window).scrollTop($('#' + s + '1').offset().top);
        $("#showLetter span").html(s);
        $("#showLetter").show().delay(500).hide(0);
      });
      document.getElementById("appContent").style.display = "block";

    }, 300)


  }
})