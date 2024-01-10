var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  showSubUp: false,
  openId: '',
  orderInfo: {
    productName: "",
    changePart: "",
    partSn: "",
    dealPrice: "",
    orderPrice: "",
    memberPrice: "",
    retailPrice: "",
    serviceType: "",
    userRights: [],
    orderAudits: [],
    giftService: "",
    shopPerson: "",
    personId: 0,
    traceSourceType: 1,
    traceSourceImg: '',
    confirmName: "",
    confirmStatus: 0,
    shopInfo:{
      name:''
    }
  },
  shopName: '',
  clientList: [{
      value: 1,
      text: "客户在4S店"
    },
    {
      value: 2,
      text: "客户指定修理厂"
    },
    {
      value: 3,
      text: "客户未接电话"
    },
    {
      value: 4,
      text: "客户同意到店"
    },
    {
      value: 5,
      text: "非玻案件"
    },
    {
      value: 6,
      text: "客户已销案"
    }
  ],
  serviceList: [{
      value: 1,
      text: "拆装"
    },
    {
      value: 2,
      text: "更换"
    },
    {
      value: 3,
      text: "修复"
    },
    {
      value: 4,
      text: "贴膜"
    },
    {
      value: 0,
      text: "其他"
    }
  ],
  operatorList: [
    {
      value: 82,
      text: "郭樟"
    },
    {
      value: 88,
      text: "梅杰"
    },
    {
      value: 91,
      text: "江豪"
    },
    {
      value: 18,
      text: "李丽清"
    },
    {
      value: 93,
      text: "吴书钊"
    },
    {
      value: 108,
      text: "曾仙"
    },
    {
      value: 97,
      text: "周兵"
    }
  ],
  banrdList: [],
  shopAllList: [],
  step4: false,
  step1: true,
  prolist: [],
  kw: '',
  searchType: 'proName',
  pageNo: 0,
  totalPage: 1,
  issue_content: "",
  serch_result_issue: false
}

var vm = new Vue({
  el: '#app',
  data: data,
  created() {
    var _self = this;

  },
  methods: {

    //订单详情数据
    getOrderDetail() {
      var _self = this;
      Service.glassBanrdList('GET', {}, (function callback(data) {
        if (data.code == 200) {
          data.data.map(item => {
            item.value = item.partsId
            item.text = item.partsName
          })
          _self.banrdList = data.data
        }
      }))
      Service.glassChangeParts('GET', {}, (function callback(data) {
        if (data.code == 200) {
          data.data.map(item => {
            item.value = item.partsId
            item.text = item.partsName
          })
          _self.regionList = data.data
        }
      }))


      var params = {
        orderSn: tempJson.orderSn ? tempJson.orderSn : ""
      }
      Service.claimOrderDetail('GET', params, (function callback(data) {
        if (data.code == 200) {
          _self.orderInfo = data.data;
          _self.orderInfo.appointmentTime = fn.formatTime(_self.orderInfo.accidentTime, 'Y-M-D h:m:s')
          _self.orderInfo.auditTime = fn.formatTime(_self.orderInfo.auditTime, 'Y-M-D h:m:s')
          switch (_self.orderInfo.bizType) {
            case 104:
              _self.orderInfo.bizName = "大地理赔"
              break;
            case 105:
              _self.orderInfo.bizName = "诚泰理赔"
              break;
            case 106:
              _self.orderInfo.bizName = "阳光理赔"
              break;
            case 107:
              _self.orderInfo.bizName = "国寿财险理赔"
              break;
            case 108:
              _self.orderInfo.bizName = "太保理赔"
              break;
            case 109:
              _self.orderInfo.bizName = "人保理赔"
              break;
            case 110:
              _self.orderInfo.bizName = "平安理赔"
              break;
          }
          switch (_self.orderInfo.serviceType) {
            case 1:
              _self.orderInfo.serviceName = "拆装";
              break;
            case 2:
              _self.orderInfo.serviceName = "更换";
              break;
            case 3:
              _self.orderInfo.serviceName = "修复"
              break;
            case 4:
              _self.orderInfo.serviceName = "贴膜"
              break;
            case 0:
              _self.orderInfo.serviceName = "其他"
              break;
          }
         
          if(_self.clientList.length > 0 && _self.orderInfo.trackStatus != undefined){
            _self.orderInfo.confirmName = _self.clientList.find(item => item.value == _self.orderInfo.trackStatus).text
          }else{
            _self.orderInfo.confirmName =""
          }
          if (_self.orderInfo.trackStatus == 4) {
            _self.showSubUp = true
          } else {
            _self.showSubUp = false
          }
          console.log()
          setTimeout(() => {
            if (_self.regionList.length > 0 && _self.orderInfo.partsId != undefined) {
              _self.orderInfo.parts = _self.regionList.find(item => item.partsId == _self.orderInfo.partsId).partsName
            }else {
              _self.orderInfo.parts =""
            }
          }, 1500)

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
                  _self.step4 = false;
                }
              }
            }
          });
        }
      }))
    },

    // 门店
    getAllShop() {
      var _self = this
      var params = {
        kw: _self.orderInfo.shopInfo.name,
        pageNo: 0,
        pageSize: 50
      }
      Service.shopQuery('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          _self.shopAllList = data.data;
        }
      }))
    },

    // 门店输入
    inputSelect() {
      let shopInfo = this.shopAllList.find(item => item.name = this.orderInfo.shopInfo.name)
      this.orderInfo.shopInfo.name = shopInfo.name
      this.orderInfo.shopInfo.id = shopInfo.id
      this.orderInfo.shopInfo.address = shopInfo.address
      this.orderInfo.shopInfo.chargeName = shopInfo.chargeName
      this.orderInfo.shopInfo.linktel = shopInfo.linktel
    },

    // 操作人
    toOperator() {
      let _self = this
      var cityPicker = new mui.PopPicker({
        layer: 1
      });
      cityPicker.setData(_self.operatorList);
      cityPicker.show(function (items) {
        $("#choose-operator").text(items[0].text);
        _self.orderInfo.operatorId = items[0].value;
      });
    },

    // 客户状态
    toLevel() {
      let _self = this
      var cityPicker = new mui.PopPicker({
        layer: 1
      });
      cityPicker.setData(_self.clientList);
      cityPicker.show(function (items) {
        $("#choose-level").text(items[0].text);
        _self.orderInfo.trackStatus = items[0].value;
        if (items[0].value == 4) {
          _self.showSubUp = true
        } else {
          _self.showSubUp = false
        }
      });
    },

    // 部位选择
    toRegion() {
      let _self = this
      var cityPicker = new mui.PopPicker({
        layer: 1
      });
      cityPicker.setData(_self.regionList);
      cityPicker.show(function (items) {
        $("#choose-region").text(items[0].text);
        _self.orderInfo.partsId = items[0].value;
        _self.orderInfo.parts = items[0].text
      });
    },

    // 选择时间
    toTime() {
      let _self = this
      var dtpicker = new mui.DtPicker({
        "type": "date"
      });
      dtpicker.show(function (items) {
        console.log(items)
        $("#choose-time").text(items.text);
        _self.orderInfo.appointmentTime = items
        dtpicker.dispose();
      });
    },

    // 服务类型
    toService() {
      let _self = this
      var cityPicker = new mui.PopPicker({
        layer: 1
      });

      cityPicker.setData(_self.serviceList);
      cityPicker.show(function (items) {
        $("#choose-service").text(items[0].text);
        _self.orderInfo.serviceType = items[0].value;

      });
    },

    // 玻璃品牌
    toGlass() {
      let _self = this
      var cityPicker = new mui.PopPicker({
        layer: 1
      });
      cityPicker.setData(_self.banrdList);
      cityPicker.show(function (items) {
        $("#choose-glass").text(items[0].text);
        _self.orderInfo.productBrand = items[0].text;
      });
    },

    // 选择商品
    toProName(searchType) {
      this.step1 = false;
      this.step4 = true;
      this.prolist = [];
      this.mescroll.resetUpScroll();
      this.mescroll.scrollTo(0, 300); //回到顶部
    },

    // 确认筛选
    surSrh(e) {
      this.orderInfo.productName = e.partsName;
      this.orderInfo.productId = e.id
      this.orderInfo.carg = e.garg
      this.orderInfo.partSn = e.partsSn
      this.orderInfo.retailPrice = e.retailPrice
      this.orderInfo.claimPrice = e.claimPrice
      this.step1 = true;
      this.step4 = false;
    },

    upCallback: function (page) {
      //联网加载数据
      var self = this;
      this.getListDataFromNet(page.num, page.size, function (curPageData) {
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
    getListDataFromNet: function (pageNum, pageSize, successCallback, errorCallback) {
      this.pageNo = pageNum;
      var params = {
        parts: this.orderInfo.parts,
        pageNo: pageNum, //页码
        pageSize: pageSize
      }
      Service.glassQuery('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          self.totalPage = data.total;
          var listData = data.data;
          successCallback && successCallback(listData); //成功回调  
        }
      }))
    },

    //判断信息
    chackInfo() {
      console.log(this.orderInfo)
      if (!this.orderInfo.operatorId) {
        fn.showTip("请选择操作人");
        return false;
      }
      if (!this.orderInfo.trackStatus) {
        fn.showTip("请选择客户状态");
        return false;
      }
      if (!this.orderInfo.trackRemark) {
        fn.showTip("请输入案件备注");
        return false;
      }
      if (this.orderInfo.trackStatus == 4) {
        if (!this.orderInfo.shopInfo.name) {
          fn.showTip("请输入门店名称");
          return false;
        }
        if (!this.orderInfo.shopInfo.address) {
          fn.showTip("请输入门店地址");
          return false;
        }
        if (!this.orderInfo.shopInfo.chargeName) {
          fn.showTip("请输入联系人");
          return false;
        }
        if (!this.orderInfo.shopInfo.linktel) {
          fn.showTip("请输入联系电话");
          return false;
        }
        if (!this.orderInfo.partsId) {
          fn.showTip("请选择部位");
          return false;
        }
        if (!this.orderInfo.serviceType) {
          fn.showTip("请选择服务类型");
          return false;
        }
        if (!this.orderInfo.productName) {
          fn.showTip("商品名称不能为空");
          return false;
        }
        if (!this.orderInfo.changePart) {
          fn.showTip("部位不能为空");
          return false;
        }
        if (!this.orderInfo.productBrand) {
          fn.showTip("请选择玻璃品牌");
          return false;
        }
      }
      return true;
    },
    //提交审核
    subAdd(index) {

      if (!this.chackInfo()) {
        return false;
      }

      var params = {
        appointmentTime: this.orderInfo.appointmentTime,
        carg: this.orderInfo.carg,
        claimPrice: this.orderInfo.claimPrice,
        openId: this.openId,
        operatorId: this.orderInfo.operatorId,
        orderSn: this.orderInfo.orderSn,
        partSn: this.orderInfo.partSn,
        partsId: this.orderInfo.partsId,
        productBrand: this.orderInfo.productBrand,
        productId: this.orderInfo.productId,
        productName: this.orderInfo.productName,
        retailPrice: this.orderInfo.retailPrice,
        serviceType: this.orderInfo.serviceType,
        trackRemark: this.orderInfo.trackRemark,
        trackStatus: this.orderInfo.trackStatus,
        shopId: this.orderInfo.shopId

      }
      console.log("参数请求=====：", params)
      if (index == 1) {
        Service.claimRefuse('POST', JSON.stringify(params), (function callback(data) {
          if (data.code == 200) {
            fn.showTip("提交成功", "claimList.html");
          }
        }))
      }
      if (index == 2) {
        Service.claimPass('POST', JSON.stringify(params), (function callback(data) {
          if (data.code == 200) {
            fn.showTip("提交成功", "claimList.html");
          }
        }))
      }
      if (index == 3 && this.orderInfo.trackStatus == 4) {
        Service.claimSendSurvey('POST', JSON.stringify(params), (function callback(data) {
          if (data.code == 200) {
            fn.showTip("提交成功", "claimList.html");
          }
        }))
      }
      if (index == 4 && this.orderInfo.trackStatus == 4) {
        Service.claimSendOrder('POST', JSON.stringify(params), (function callback(data) {
          if (data.code == 200) {
            fn.showTip("提交成功", "claimList.html");
          }
        }))
      }
    }
  },
  mounted: function () {
    var _self = this;
    this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
    this.getOrderDetail();
    this.getAllShop()

    $('.cropperModal').height(document.body.clientHeight + 'px')
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  }
})