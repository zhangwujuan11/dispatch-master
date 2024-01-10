var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

// var map = new BMap.Map("container");
// var localSearch = new BMap.LocalSearch(map);

var data = {
	positiondata:[],//部位数据
	customerdata:{},//客户数据
	form:{
		repair:0,
		changePart:'',
		reason:'',
		items:'',
		productName:'',
		carg:'',
		ticketId:'',
		img:'',
		img2:'',
		imgVin:''
	},
	reason:'',
	qita:false,
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
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
      this.step4 = false;
      this.step5 = false;
    },



    //得到车型
    getCarTypeList() {
      var _self = this;
      var params = {
        token: userInfo.token,
        brandId: this.brandId
      }
      Service.getCarSeriesList('GET', params, (function callback(data) {
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
      this.kw = item;
      this.prolist = [];
      this.mescroll.resetUpScroll();
      this.mescroll.scrollTo(0, 300); //回到顶部
    },
    //确认筛选
    surSrh(e) {
		this.form.productName = e.glassName;
		this.form.carg = e.carg;
		this.form.productId = e.id;
		this.form.productBrand = e.id;
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
        self.$nextTick(() => {
          if (page.num == 1) self.prolist = [];
          self.prolist = self.prolist.concat(curPageData);
          self.mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)
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
	
	//上传图片1
	btnUploadFile() {
	  var _self = this;
	  let evt = window.event || e;
	  let el = evt.currentTarget || evt.srcElement;
	  //获取图片文件
	  var imgFile = el.files[0];
	//   //异步读取文件
	  var reader = new FileReader();
	  reader.onload = async (evt) => {
	    //替换url
	    if (imgFile.size / 1024 > 1024 * 1.2) {
	      fn.dealImage(evt.target.result, {
	        quality: 0.6
	      }, function (base64Codes) {
	        var params = {
	          base64Data: base64Codes,
	          bizType: 101
	        }
	        Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
	          if (data.code == 200) {
	            _self.form.img = data.data.webPath
	          }
	        }))
	      });
	    } else {
	      var params = {
	        base64Data: evt.target.result,
	        bizType: 101
	      }
	      Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
	        if (data.code == 200) {
	         _self.form.img = data.data.webPath
	        }
	      }))
	    }
	  }
	   reader.readAsDataURL(imgFile);
	},
	//上传图片1
	btnUploadFiletwo() {
	  var _self = this;
	  let evt = window.event || e;
	  let el = evt.currentTarget || evt.srcElement;
	  //获取图片文件
	  var imgFile = el.files[0];
	//   //异步读取文件
	  var reader = new FileReader();
	  reader.onload = async (evt) => {
	    //替换url
	    if (imgFile.size / 1024 > 1024 * 1.2) {
	      fn.dealImage(evt.target.result, {
	        quality: 0.6
	      }, function (base64Codes) {
	        var params = {
	          base64Data: base64Codes,
	          bizType: 101
	        }
	        Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
	          if (data.code == 200) {
	            _self.form.img2 = data.data.webPath
	          }
	        }))
	      });
	    } else {
	      var params = {
	        base64Data: evt.target.result,
	        bizType: 101
	      }
	      Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
	        if (data.code == 200) {
	         _self.form.img2 = data.data.webPath
	        }
	      }))
	    }
	  }
	   reader.readAsDataURL(imgFile);
	},
	//上传图片3
	btnUploadFilethree() {
	  var _self = this;
	  let evt = window.event || e;
	  let el = evt.currentTarget || evt.srcElement;
	  //获取图片文件
	  var imgFile = el.files[0];
	//   //异步读取文件
	  var reader = new FileReader();
	  reader.onload = async (evt) => {
	    //替换url
	    if (imgFile.size / 1024 > 1024 * 1.2) {
	      fn.dealImage(evt.target.result, {
	        quality: 0.6
	      }, function (base64Codes) {
	        var params = {
	          base64Data: base64Codes,
	          bizType: 101
	        }
	        Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
	          if (data.code == 200) {
	            _self.form.imgVin = data.data.webPath
	          }
	        }))
	      });
	    } else {
	      var params = {
	        base64Data: evt.target.result,
	        bizType: 101
	      }
	      Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
	        if (data.code == 200) {
	         _self.form.imgVin = data.data.webPath
	        }
	      }))
	    }
	  }
	   reader.readAsDataURL(imgFile);
	},
    //判断信息
    chackInfo() {
      if (this.form.repair == '0' && !this.form.changePart) {
        fn.showTip("部位不能为空！");
        return false;
      }
	  if (this.form.repair == '1' &&!this.form.reason) {
	    fn.showTip("不可修复原因不能为空！");
	    return false;
	  }
	  if (this.qita && !this.reason) {
	    fn.showTip("不可修复原因不能为空！");
	    return false;
	  }
	  if(this.form.repair == '1' && !this.form.items){
		  fn.showTip("增加勾选项目不能为空！");
		  return false;
	  }
	  if(this.form.items == '0' && this.form.productName == ''){
		  fn.showTip("请选择商品！");
		  return false;
	  }
	  if(this.form.items == '0' && !this.form.changePart){
	  		  fn.showTip("部位不能为空！");
	  		  return false;
	  }
	if(this.form.repair == '1' && !this.form.img){
	  		  fn.showTip("请上传破损全车照！");
	  		  return false;
	  }
	  if(this.form.repair == '1' && !this.form.img2){
	    		  fn.showTip("请上传破损点特写！");
	    		  return false;
	    }
		if(this.form.repair == '1' && !this.form.imgVin){
		  		  fn.showTip("请上传VIN码！");
		  		  return false;
		  }
      return true;
    },
	getpisitiondata(){
		let obj={
			"ticketId":tempJson.ticketId
		}
		var _self = this;
		_self.form.ticketId=tempJson.ticketId
		Service.glasssbuwei('POST','', (function callback(data) {
		  if (data.code == 200) {
			  _self.positiondata=data.data
		  }
		}))
		Service.glassdetail('POST',JSON.stringify(obj), (function callback(data) {
		  if (data.code == 200) {
			  _self.customerdata=data.data
		  }
		}))
	},
    add() {
      var _self = this;
      if (!this.chackInfo()) {
        return false;
      }
	  if(this.form.reason == '其他'){
		  this.form.reason=this.reason
	  }
      Service.glassadd('POST', JSON.stringify(this.form), (function callback(data) {
        if (data.code == 200) {
          fn.showTip('提交成功！', 'orderList.html');
        }
      }))
    }

  },
  watch:{
	  'form.reason'(val){
		  if(val == '其他'){
			  this.qita =true
			   this.reason=''
		  }else{
			  this.qita =false
		  }
	  },
	  'form.repair'(val){
		 this.form.reason=''
		 this.form.items=''
		 this.form.productName=''
		 this.form.carg=''
		  this.reason=''
	  }
  },
  mounted: function () {
    var _self = this;
	_self.getpisitiondata()
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
	  // 部位获取
    }, 300)


  }
})