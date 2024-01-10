var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
  el: "#app",
  data: {
    kw: "",
    flagPass: true,
    damageReasons: "",
    memberInfo: {},
    orderAudits: [],
    itemObj: {},
    userId: 0,
    orderType: 100,
    surveyOrderSn: "",
    sigParts: [],
    step4: false,
    step1: true,
    carInfoList: [],
    brandId: '',
    prolist: [],
    kw: '',
    searchType: 'proName',
    pageNo: 0,
    totalPage: 1,
    searchType: '',
    searchName: '服务信息'
  },
  methods: {
    //上传图片
    btnUploadFile(index) {

      $('.upLoadImgs').eq(index).find(".noPass").hide();
      //alert("上传的是第几张图片：" + (index+1))
      var _self = this;

      let evt = window.event || e;
      let el = evt.currentTarget || evt.srcElement;

      //获取图片文件
      var imgFile = el.files[0];
      //异步读取文件
      var reader = new FileReader();

      reader.onloadstart = function (e) {
        //alert("开始读取....")
        $('.maskUploadImg').eq(index).show();
        console.log("开始读取....", index);

        // _self.memberInfo.orderAuditList[index].isShowMask = true;
      }
      reader.onprogress = function (e) {
        //alert("正在读取中....")
        console.log("正在读取中....");
      }
      reader.onabort = function (e) {
        //alert("中断读取....")
        console.log("中断读取....");
      }
      reader.onerror = function (e) {
        //alert("读取异常....")
        console.log("读取异常....");
      }
      //reader.readAsDataURL(imgFile);
      reader.onload = async (evt) => {

        //alert("图片信息："+evt.target.result)
        //替换url
        if (imgFile.size / 1024 > 1024 * 1.2) {
          fn.dealImage(evt.target.result, {
            quality: 0.6
          }, function (base64Codes) {
            // console.log(base64Codes)
            var params = {
              base64Data: base64Codes,
              bizType: 101
            }
            Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
              //console.log("数据：", data)
              if (data.code == 200) {
                $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
                $('.maskUploadImg').eq(index).hide();
              }
            }))
          });
        } else {
          var params = {
            base64Data: evt.target.result,
            bizType: 101
          }
          Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
            //console.log("数据：", data)
            if (data.code == 200) {

              $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
              $('.maskUploadImg').eq(index).hide();
            }
          }))
        }


        // var params = {
        //     base64Data: evt.target.result,
        //     bizType: 101
        // }
        // Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
        //     //console.log("数据：", data)
        //     if (data.code == 200) {

        //         $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
        //         $('.maskUploadImg').eq(index).hide();
        //     } 
        // }))
        setTimeout(function () {
          $('.maskUploadImg').eq(index).hide();
        }, 10000)
      }
      reader.readAsDataURL(imgFile);
    },
    // 维修或更换部位
    toPosition() {
      let _self = this
      var cityPicker = new mui.PopPicker({
        layer: 1
      });

      cityPicker.setData(_self.sigParts);
      cityPicker.show(function (items) {
        $("#choose-position").text(items[0].text);
        _self.memberInfo.changePart = items[0].text;
      });
    },
    // 维修方案
    toRepair() {
      let _self = this
      var cityPicker = new mui.PopPicker({
        layer: 1
      });

      cityPicker.setData([{
          value: 100,
          text: "汽车玻璃修复"
        }, {
          value: 101,
          text: "汽车玻璃更换"
        },
        {
          value: 102,
          text: "玻璃拆装服务"
        }, {
          value: 103,
          text: "退回案件，属于车损案件"
        }
      ]);
      cityPicker.show(function (items) {
        $("#choose-repair").text(items[0].text);
        _self.memberInfo.suggestType = items[0].value;
      });
    },
    // 选择商品
    toGoods() {
      let _self = this
      var cityPicker = new mui.PopPicker({
        layer: 1
      });

      cityPicker.setData([{
        value: 1,
        text: "福耀玻璃"
      }, {
        value: 2,
        text: "进口玻璃"
      }, {
        value: 6,
        text: "其他"
      }]);
      cityPicker.show(function (items) {
        $("#choose-goods").text(items[0].text);
        _self.memberInfo.productBrand = items[0].text;
      });
    },
    //判断信息
    chackInfo() {
      if (!this.damageReasons) {
        fn.showTip("破损原因不能为空");
        return false;
      }
      if ((this.memberInfo.orderStatus == 100 || this.memberInfo.orderStatus == 101 || this.memberInfo.orderStatus == 106) && this.memberInfo.orderType != 100) {
        if (!this.memberInfo.suggestType) {
          fn.showTip("请选择维修方案");
          return false;
        }

        if (!this.memberInfo.changePart) {
          fn.showTip("请选择维修或更换部位");
          return false;
        }
        if (!this.memberInfo.productBrand) {
          fn.showTip("请选择商品品牌");
          return false;
        }
        if (!this.memberInfo.productName) {
          fn.showTip("请选择商品名称");
          return false;
        }
        if (!this.memberInfo.carg) {
          fn.showTip("请输入CARG码");
          return false;
        }
        if (!this.memberInfo.servicePrice) {
          fn.showTip("请输入服务金额");
          return false;
        }
      }

      for (var i = 0; i < $('.upLoadImgs').length; i++) {
        if ($('.upLoadImgs').eq(i).find(".picFullcar").attr('src') == "images/upload.jpg") {
          fn.showTip("破损照片必填");
          return false;
        }
      }
      return true;
    },
    toProName(searchType) {
      this.kw = "";
      this.searchType = searchType;
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
      if (this.searchType == 'proName') {
        this.memberInfo.productName = e.glassName;
        this.memberInfo.carg = e.carg
        this.memberInfo.servicePrice = e.price4s
      }
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
    },
    //提交勘验单
    add() {
      if (!this.chackInfo()) {
        return false;
      }
      // var checkItemId = $('.upLoadImgs').eq(index).attr('checkItemId');
      // var orderSn = $('.upLoadImgs').eq(index).attr('orderSn');
      var _self = this
      var orderAudits = [];
      for (var i = 0; i < $('.upLoadImgs').length; i++) {
        var obj = {};
        obj.checkItemId = $('.upLoadImgs').eq(i).attr('checkItemId');
        obj.orderSn = $('.upLoadImgs').eq(i).attr('orderSn');
        obj.checkItemImg = $('.upLoadImgs').eq(i).find(".picFullcar").attr('src');

        orderAudits.push(obj)
      }

      if ((typeof _self.memberInfo.suggestType == 'string') && _self.memberInfo.orderType != 100) {
        switch (_self.memberInfo.suggestType) {
          case "汽车玻璃修复":
            _self.memberInfo.suggestType = 100
            break;
          case "汽车玻璃更换":
            _self.memberInfo.suggestType = 101
            break;
          case "玻璃拆装服务":
            _self.memberInfo.suggestType = 102
            break;
          case "退回案件，属于车损案件":
            _self.memberInfo.suggestType = 103
            break;
        }
      }

      var params = {
        damageReasons: _self.damageReasons,
        orderAudits: orderAudits,
        userId: _self.userId,
        surveyOrderSn: _self.surveyOrderSn,
        carg: _self.memberInfo.carg,
        changePart: _self.memberInfo.changePart,
        partSn: _self.memberInfo.partSn,
        productBrand: _self.memberInfo.productBrand,
        productName: _self.memberInfo.productName,
        servicePrice: _self.memberInfo.servicePrice,
        suggestDes: _self.memberInfo.suggestDes,
        suggestType: _self.memberInfo.suggestType,
      }

      console.log("参数请求：", params)
      Service.editSurvey('POST', JSON.stringify(params), (function callback(data) {
        //console.log("数据：", data)
        if (data.code == 200) {
          fn.showTip("提交成功", "surveyList.html?searchType=" + tempJson.searchType);
        }
      }))
    }
  },
  mounted: function () {
    var _self = this;
    this.searchType = tempJson.searchType
    this.searchName = tempJson.searchType == 1 ? "服务信息" : "车辆报损信息"
    var params = {
      orderSn: tempJson.orderId ? tempJson.orderId : ""
    }
    Service.getSurveyDetail('GET', params, (function callback(data) {
      console.log("=====数据：", data.data.productName)
      if (data.code == 200) {
        for (var i in data.data.orderAuditList) {
          data.data.orderAuditList[i].isShowMask = false;
        }
        if (data.data.productName == undefined && data.data.orderType != 100) {
          data.data.productName = ''
        }
        if (data.data.productBrand == undefined && data.data.orderType != 100) {
          data.data.productBrand = '福耀玻璃'
        }
        if (data.data.suggestType == undefined && data.data.orderType != 100) {
          data.data.suggestType = ''
        }
        if (data.data.changePart == undefined && data.data.orderType != 100) {
          data.data.changePart = ''
        }
        _self.memberInfo = data.data;
        _self.userId = data.data.userId;
        _self.surveyOrderSn = data.data.orderSn;
        _self.orderType = data.data.orderType;
        if (data.data.damageReasons) {
          _self.damageReasons = data.data.damageReasons;
        } else {
          _self.damageReasons = '保险客户';
        }
        _self.memberInfo.birthday = fn.formatTime(_self.memberInfo.birthday, 'Y-M-D');
        _self.memberInfo.rightsSta = fn.formatTime(_self.memberInfo.rightsSta, 'Y-M-D');
        _self.memberInfo.rightsEnd = fn.formatTime(_self.memberInfo.rightsEnd, 'Y-M-D');
        // _self.memberInfo.appointmentTime = fn.formatTime(_self.memberInfo.appointmentTime, 'Y-M-D h:m:s')

        switch (data.data.serviceType) {
          case 1:
            _self.memberInfo.suggestType = "汽车玻璃修复"
            break;
          case 2:
            _self.memberInfo.suggestType = "汽车玻璃更换"
            break;
          case 3:
            _self.memberInfo.suggestType = "玻璃拆装服务"
            break;
          case 0:
            _self.memberInfo.suggestType = "退回案件，属于车损案件"
            break;
        }
        switch (data.data.suggestType) {
          case 100:
            _self.memberInfo.suggestType = "汽车玻璃修复"
            break;
          case 101:
            _self.memberInfo.suggestType = "汽车玻璃更换"
            break;
          case 102:
            _self.memberInfo.suggestType = "玻璃拆装服务"
            break;
          case 103:
            _self.memberInfo.suggestType = "退回案件，属于车损案件"
            break;
        }
        if (_self.memberInfo.userRights) {
          for (var i in _self.memberInfo.userRights) {
            _self.memberInfo.userRights[i].startTime = fn.formatTime(_self.memberInfo.userRights[i].startTime, 'Y-M-D');
            _self.memberInfo.userRights[i].endTime = fn.formatTime(_self.memberInfo.userRights[i].endTime, 'Y-M-D');
          }
        }
        if (_self.memberInfo.useRecords) {
          for (var i in _self.memberInfo.useRecords) {
            _self.memberInfo.useRecords[i].useTime = fn.formatTime(_self.memberInfo.useRecords[i].useTime, 'Y-M-D');
          }
        }
        for (var i in _self.memberInfo.orderAuditList) {
          if (_self.memberInfo.orderAuditList[i].auditStatus < 0) {
            _self.flagPass = false;
          }
        }
      }
    }))
    Service.sigParts('GET', '', (function callback(data) {
      console.log(data)
      if (data.code == 200) {
        data.data.map((item) => {
          item.value = item.partsId
          item.text = item.partsName
        })
        _self.sigParts = data.data
      }
    }))
    // $('.up-down').on('click', function() {
    //     if ($(this).find('.sBlue').html() == '收起') {
    //         $('.activeRegle').hide();
    //         $(this).find('.sBlue').html('查看详情');
    //         $(this).find('.arrDown').removeClass('arrUp');
    //         $('html,body').animate({ scrollTop: '0px' }, 800);
    //     } else {
    //         $('.activeRegle').show();
    //         $(this).find('.sBlue').html('收起');
    //         $(this).find('.arrDown').addClass('arrUp');

    //     }
    // })
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
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  },

  computed: {


  }
});