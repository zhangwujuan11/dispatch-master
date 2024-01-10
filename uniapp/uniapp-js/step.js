var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  showSubUp: false,
  showStepTwo: false,
  flagPass: true,
  userRights: [],
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
    traceSeqCode: ''
  },
  dateCode: "",
  goodsName: "",
  cngPart: "",
  partNo: "",
  realPrice: "",
  orderAuditList: [],
  vinNo: "",
  shopPersonList: [],
  base64Codes: "",
  cropperUrl: '',
  cropperShow: false,
  sequence: '',
  subFlag: true,
  traceText: '',
  traceSeqCode: '',
  step4: false,
  step1: true,
  carInfoList: [],
  brandId: '',
  prolist: [],
  kw: '',
  searchType: 'proName',
  pageNo: 0,
  totalPage: 1,
  TraceabilityList: [
    {
      value: 0,
      text: '请选择溯源类型'
    },
    {
    value: 1,
    text: '溯源二维码'
  }, {
    value: 2,
    text: '13位防伪码'
  }, {
    value: 3,
    text: '16位防伪码'
  }, {
    value: 4,
    text: '其他玻璃防伪'
  }]
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {
    //获取今日码
    getDatecode() {
      var _self = this;
      var params = {};
      Service.getDatecode('GET', params, (function callback(data) {
        console.log("=====数据：", data.data)
        if (data.code == 200) {
          _self.dateCode = data.data;
        }
      }))
    },

    //订单详情数据
    getOrderDetail() {
      var _self = this;
      var params = {
        orderSn: tempJson.orderId ? tempJson.orderId : ""
      }
      Service.getOrderDetail('GET', params, (function callback(data) {
        console.log("=====数据====：", data)
        if (data.code == 200) {
          if (data.data.orderAuditList) {
            for (var i in data.data.orderAuditList) {
              data.data.orderAuditList[i].isShowMask = false;
            }
          }
          if (data.data.personName == undefined) {
            data.data.personName = ""
          }
          if (data.data.traceSourceType === undefined) {
            data.data.traceSourceType = 0
            data.data.traceSeqCode = ''
            data.data.traceSourceImg = ''
            _self.traceSeqCode = ''
          } else {

            switch (data.data.traceSourceType) {
              case 1:
                _self.traceText = '溯源二维码'
                break;
              case 2:
                _self.traceText = '13位防伪码'
                break;
              case 3:
                _self.traceText = '16位防伪码'
                break;
              case 4:
                _self.traceText = '其他玻璃防伪'
                break;
            }
            _self.traceSeqCode = data.data.traceSeqCode
          }

          _self.orderInfo = data.data;
          _self.orderAuditList = data.data.orderAuditList;

          if (_self.orderInfo.userRights) {
            _self.userRights = _self.orderInfo.userRights
          }

          if (_self.orderInfo.serviceType == 1) {
            _self.orderInfo.serviceTypeStauts = '拆装'
          }
          if (_self.orderInfo.serviceType == 2) {
            _self.orderInfo.serviceTypeStauts = '更换'
          }
          if (_self.orderInfo.serviceType == 3) {
            _self.orderInfo.serviceTypeStauts = '修复'
          }
          if (_self.orderInfo.orderAuditList) {
            for (var i in _self.orderInfo.orderAuditList) {
              if (_self.orderInfo.orderAuditList[i].auditStatus < 0) {
                _self.flagPass = false;
              }
            }
          }

        }
      }))
    },
    //判断信息
    chackInfo() {
      if (!this.orderInfo.productName) {
        fn.showTip("商品名称不能为空");
        return false;
      }
      // if (!this.orderInfo.changePart) {
      //     fn.showTip("部位不能为空");
      //     return false;
      // }
      if (!this.orderInfo.partSn) {
        fn.showTip("零件编码不能为空");
        return false;
      }
      if (this.orderInfo.userType == 18 && this.orderInfo.dealPrice <= 0) {
        fn.showTip("请填写实际服务金额");
        return false;
      }
      return true;
    },
    //增加
    addNum(index) {
      if (this.orderInfo.userRights[index].useNum < this.orderInfo.userRights[index].residualNum) {
        this.orderInfo.userRights[index].useNum = parseInt(this.orderInfo.userRights[index].useNum) + 1;
      }

    },
    //减法
    reduNum(index) {
      if (this.orderInfo.userRights[index].useNum > 1) {
        this.orderInfo.userRights[index].useNum = parseInt(this.orderInfo.userRights[index].useNum) - 1;
      }
    },
    //判断输入超出
    showMaxNum(index) {
      if (this.orderInfo.userRights[index].useNum > this.orderInfo.userRights[index].residualNum) {
        this.orderInfo.userRights[index].useNum = this.orderInfo.userRights[index].residualNum
      }
    },
    //下一步
    next() {
      console.log("orderInfo：", this.orderInfo)
      if (!this.chackInfo()) {
        return false;
      }
      this.showStepTwo = true;
    },
    glassUploadFile() {
      $('.authority_mask').css('display','none');
      var _self = this;
      let evt = window.event || e;
      let el = evt.currentTarget || evt.srcElement;
      //获取图片文件
      var imgFile = el.files[0];
      //后缀选取
      // if (!/\/(?:jpeg|jpg|png|gif|JPG|PNG)/i.test(imgFile.type)) {
      //     console.log(图片格式不支持);
      //     return;
      // }
      //异步读取文件
      var reader = new FileReader();
      reader.onloadstart = function (e) {
        console.log("开始读取....");
      }
      reader.onprogress = function (e) {
        console.log("正在读取中....");
      }
      reader.onabort = function (e) {
        console.log("中断读取....");
      }
      reader.onerror = function (e) {
        console.log("读取异常....");
      }
      //reader.readAsDataURL(imgFile);
      reader.onload = async (evt) => {

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
              if (data.code == 200) {
                _self.orderInfo.traceSourceImg = data.data.webPath
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
              _self.orderInfo.traceSourceImg = data.data.webPath
            }
          }))
        }
      }
      reader.readAsDataURL(imgFile);
    },
    authority(){
      if (navigator.userAgent.indexOf("Android") !== -1) { 
        $('.authority_mask').css('display','block');
      }
    },
    hideAuthorityMask(){
      $('.authority_mask').css('display','none');
    },
    //上传图片
    btnUploadFile(index) {
      $('.authority_mask').css('display','none');
      $('.upLoadImgs').eq(index).find(".noPass").hide();
      var _self = this;
      let evt = window.event || e;
      let el = evt.currentTarget || evt.srcElement;
      //获取图片文件
      var imgFile = el.files[0];

      //后缀选取
      // if (!/\/(?:jpeg|jpg|png|gif|JPG|PNG)/i.test(imgFile.type)) {
      //     console.log(图片格式不支持);
      //     return;
      // }
      //异步读取文件
      var reader = new FileReader();
      reader.onloadstart = function (e) {
        _self.orderInfo.orderAuditList[index].isShowMask = true;
        console.log("开始读取....");
      }
      reader.onprogress = function (e) {
        console.log("正在读取中....");
      }
      reader.onabort = function (e) {
        console.log("中断读取....");
      }
      reader.onerror = function (e) {
        console.log("读取异常....");
      }
      //reader.readAsDataURL(imgFile);
      reader.onload = async (evt) => {

        //alert(evt.target.result)
        //替换url
        console.log(evt, 'evt')
        console.log(evt.target.result, 'evt11')
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
                _self.orderInfo.orderAuditList[index].checkItemImg = data.data.webPath;
                _self.orderInfo.orderAuditList[index].isShowMask = false;
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
              _self.orderInfo.orderAuditList[index].checkItemImg = data.data.webPath;
              _self.orderInfo.orderAuditList[index].isShowMask = false;
            }
          }))
        }
        setTimeout(function () {
          _self.orderInfo.orderAuditList[index].isShowMask = true;
        }, 10000)
      }
      reader.readAsDataURL(imgFile);
    },
    //上一步
    pre() {
      this.showStepTwo = false;
    },
    //getShopPersonList
    getMechanic() {
      const that = this
      let params = {
        pageNo: 0,
        pageSize: 999
      }
      Service.getShopPersonList('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          var listData = data.data;
          let shopPersonList = []
          listData.map((item) => {
            item.value = item.id
            item.text = item.name
            if (item.job == 11) {
              item.jobName = "技师"
              shopPersonList.push(item)
            }
          })
          that.shopPersonList = shopPersonList
        }
      }))
    },
    // 选择技师
    optMechanic() {
      let _self = this
      if (this.shopPersonList.length >= 1) {
        var cityPicker = new mui.PopPicker({
          layer: 1
        });

        cityPicker.setData(this.shopPersonList);
        cityPicker.show(function (items) {
          $("#choose-opt").text(items[0].text);
          _self.orderInfo.personId = items[0].value;
        });
      } else {
        fn.showTip("暂未添加店员，请先行添加!",
          "shopUserManager.html?returnUrl=step.html?orderId=" + tempJson.orderId
        );
      }

    },
    //添加店员
    toAddShopUser() {
      window.location.href = 'shopUserAdd.html?returnUrl=step.html'
    },
    // 玻璃溯源
    onGlassType() {
      let _self = this
      _self.traceSeqCode = '';
      var cityPicker = new mui.PopPicker({
        layer: 1
      });
      cityPicker.setData([{
        value: 1,
        text: '溯源二维码'
      }, {
        value: 2,
        text: '13位防伪码'
      }, {
        value: 3,
        text: '16位防伪码'
      }, {
        value: 4,
        text: '其他玻璃防伪'
      }]);

      cityPicker.show(function (items) {
        $("#choose-glass").text(items[0].text);
        _self.orderInfo.traceSourceType = items[0].value;
      });
    },

    //小写转大写
    toUpperCase(e) {
      this.traceSeqCode = e.toUpperCase();
    },
    // vin扫描
    vinUploadFile() {
      $('.authority_mask').css('display','none');
      var _self = this;
      let evt = window.event || e;
      let el = evt.currentTarget || evt.srcElement;
      //获取图片文件
      var imgFile = el.files[0];
      //异步读取文件
      var reader = new FileReader();
      reader.onloadstart = function (e) {
        console.log("开始读取....");
      }
      reader.onprogress = function (e) {
        console.log("正在读取中....");
      }
      reader.onabort = function (e) {
        console.log("中断读取....");
      }
      reader.onerror = function (e) {
        console.log("读取异常....");
      }
      //reader.readAsDataURL(imgFile);
      reader.onload = async (evt) => {

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
                _self.orderInfo.traceSourceImg = data.data.webPath
                _self.cropperUrl = base64Codes
                _self.cropperShow = true
                _self.getCropper()
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
              _self.orderInfo.traceSourceImg = data.data.webPath
              _self.cropperUrl = evt.target.result
              _self.cropperShow = true
              _self.getCropper()
            }
          }))
        }

      }
      reader.readAsDataURL(imgFile);
    },
    // 扫二维码
   async onQrCode() {
    var that = this
      openH5Scan(function(res,result){
        if(res=='success'){
          that.subFlag = true;
          if (result.length > 20) {
            that.traceSeqCode = 111111
          } else {
            that.traceSeqCode = result
          }
        }else{
          that.subFlag = true;
        }
      })

      // var link = window.location.href;
      // if (that.subFlag) {
      //   that.subFlag = false;
      //   $.ajax({
      //       url: HOST + 'wx/autoSignature',
      //       type: 'GET',
      //       dataType: 'json',
      //       data: {
      //         url: link
      //       }
      //     })
      //     .done((data) => {
      //       console.log('data3:', data);
      //       if (data.code == 200) {
      //         var appId = data.data.appId;
      //         var timestamp = data.data.timestamp;
      //         var nonceStr = data.data.nonceStr;
      //         var signature = data.data.signature;
      //         //alert( signature)
      //         wx.config({
      //           debug: false, //调式模式，设置为ture后会直接在网页上弹出调试信息，用于排查问题
      //           appId: appId,
      //           timestamp: timestamp,
      //           nonceStr: nonceStr,
      //           signature: signature,
      //           jsApiList: [ //需要使用的网页服务接口
      //             'scanQRCode'
      //           ]
      //         });
      //       } else {
      //         fn.showTip(data.message)
      //       }
      //     })
      //   wx.ready(function () {
      //     wx.scanQRCode({
      //       needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
      //       scanType: ['qrCode'], // 可以指定扫二维码还是一维码，默认二者都有
      //       success: function (res) {
      //         var result = res.resultStr // 当needResult 为 1 时，扫码返回的结果
      //         that.subFlag = true;
      //         // fn.showTip(fn.parseURLS(result).segments[1]);
      //         if (fn.parseURLS(result).segments[1].length > 20) {
      //           that.traceSeqCode = 111111
      //         } else {
      //           that.traceSeqCode = fn.parseURLS(result).segments[1]
      //         }
      //       },
      //       fail: function (res) {
      //         that.subFlag = true;
      //       }
      //     })
      //   })
      // }
    },
    getCropper() {
      var _self = this
      var $image = $('.img-container > img'),
        $dataX = $('#dataX'),
        $dataY = $('#dataY'),
        $dataHeight = $('#dataHeight'),
        $dataWidth = $('#dataWidth'),
        $dataRotate = $('#dataRotate'),
        times,
        options = {
          aspectRatio: 5 / 5,
          preview: '.img-preview',
          crop: function (data) {
            $dataX.val(Math.round(data.x));
            $dataY.val(Math.round(data.y));
            $dataHeight.val(Math.round(data.height));
            $dataWidth.val(Math.round(data.width));
            $dataRotate.val(Math.round(data.rotate));
          }
        };
      times = setInterval(() => {
        if ($image[0].src.split('.').indexOf('html') == -1) {
          clearTimeout(times)
          $image.on({
            'build.cropper': function (e) {
              console.log(e.type);
            },
            'built.cropper': function (e) {
              console.log(e.type);
            },
            'dragstart.cropper': function (e) {
              console.log(e.type, e.dragType);
            },
            'dragmove.cropper': function (e) {
              console.log(e.type, e.dragType);
            },
            'dragend.cropper': function (e) {
              console.log(e.type, e.dragType);
            },
            'zoomin.cropper': function (e) {
              console.log(e.type);
            },
            'zoomout.cropper': function (e) {
              console.log(e.type);
            }
          }).cropper(options);
        }
      }, 1000)
      $(document.body).on('click', '[data-method]', function () {
        var data = $(this).data(),
          $target,
          result;
        if (data.method) {
          data = $.extend({}, data); // Clone a new one
          if (typeof data.target !== 'undefined') {
            $target = $(data.target);
            if (typeof data.option === 'undefined') {
              try {
                data.option = JSON.parse($target.val());
              } catch (e) {
                console.log(e.message);
              }
            }
          }


          result = $image.cropper(data.method, data.option);
          result.className = "canvasResult"
          if (data.method === 'getCroppedCanvas') {
            $('.docs-preview').html(result);
            setTimeout(() => {
              var canvas = $('.canvasResult')
              _self.base64Codes = canvas[0].toDataURL("image/jpeg")
              var params = {
                base64Data: canvas[0].toDataURL("image/jpeg"),
                bizType: 101
              }

              _self.cropperUrl = ''
              _self.cropperShow = false;
              _self.getImages()
              // Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
              //   if (data.code == 200) {
              //     
              //     _self.cropperUrl = ''
              //     _self.cropperShow = false;
              //     _self.getImages()
              //   }
              // }))
            }, 300)
          }

          if ($.isPlainObject(result) && $target) {
            try {
              $target.val(JSON.stringify(result));
            } catch (e) {
              console.log(e.message);
            }
          }
        }
      }).on('keydown', function (e) {
        switch (e.which) {
          case 37:
            e.preventDefault();
            $image.cropper('move', -1, 0);
            break;
          case 38:
            e.preventDefault();
            $image.cropper('move', 0, -1);
            break;
          case 39:
            e.preventDefault();
            $image.cropper('move', 1, 0);
            break;
          case 40:
            e.preventDefault();
            $image.cropper('move', 0, 1);
            break;
        }
      });
    },
    getImages() {
      var _self = this
      var params = {
        base64Data: this.base64Codes,
        bizType: 1
      }
      Service.generalBasic('POST', JSON.stringify(params), (function callback(data) {
       
        if (data.code === 200) {
          if (_self.orderInfo.traceSourceType == 2) {
            if (data.data.words <= 13) {
              _self.traceSeqCode = data.data.words
              _self.cropperUrl = ''
              _self.cropperShow = false;
            } else {
              _self.cropperUrl = ''
              _self.cropperShow = false;
              fn.showTip("请填写正确的防伪码");
            }

          } else if (_self.orderInfo.traceSourceType == 3) {
            if (data.data.words <= 16) {
              _self.traceSeqCode = data.data.words
              _self.cropperUrl = ''
              _self.cropperShow = false;
            } else {
              _self.cropperUrl = ''
              _self.cropperShow = false;
              fn.showTip("请填写正确的防伪码");
            }
          } else {
            _self.traceSeqCode = data.data.words
            _self.cropperUrl = ''
            _self.cropperShow = false;
          }



        }
      }))
    },
    setClos() {
      this.cropperUrl = ''
      this.cropperShow = false
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
        this.orderInfo.productName = e.glassName;

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
    //判断信息
    chackPicInfo() {
      if ((this.orderInfo.parentTypeId == 1 || this.orderInfo.parentTypeId == 2 || this.orderInfo.parentTypeId == 36 || this.orderInfo.parentTypeId == 61) && this.orderInfo.changePart == "前挡" && this.orderInfo.serviceType == 2) {
        if (!this.traceSeqCode && this.orderInfo.traceSourceType == 1) {
          fn.showTip("请填写防伪标上的防伪码");
          return false;
        }
        if (!this.orderInfo.traceSourceImg && this.orderInfo.traceSourceType != 1) {
          fn.showTip("请上传防伪图片");
          return false;
        }
      }
      for (var i = 0; i < this.orderInfo.orderAuditList.length; i++) {
        if (this.orderInfo.productBrand == "进口玻璃") {
          if (this.orderInfo.orderAuditList[i].checkItemImg == "") {
            fn.showTip("安装照片必填");
            return false;
          }
        } else {
          if (this.orderInfo.orderAuditList[i].checkItemId != 77 || this.orderInfo.orderAuditList[i].checkItemId != 78 || this.orderInfo.orderAuditList[i].checkItemId != 83 || this.orderInfo.orderAuditList[i].checkItemId != 84) {
            if (this.orderInfo.orderAuditList[i].checkItemImg == "") {
              fn.showTip("安装照片必填");
              return false;
            }
          }
        }
      }
      // for (var i = 0; i < $('.upLoadImgs').length; i++) {
      //   if ($('.upLoadImgs').eq(i).find(".picFullcar").attr('src') == "images/upload.jpg") {
      //     fn.showTip("安装照片必填");
      //     return false;
      //   }
      // }
      return true;
    },
    //提交审核
    subAdd() {

      // if (!this.chackInfo()) {
      //     return false;
      // }
      if (!this.chackPicInfo()) {
        return false;
      }

      var orderAudits = [];
      for (var i = 0; i < $('.upLoadImgs').length; i++) {
        var obj = {};
        obj.checkItemId = $('.upLoadImgs').eq(i).attr('checkItemId');
        obj.checkItemImg = $('.upLoadImgs').eq(i).find(".picFullcar").attr('src');
        orderAudits.push(obj)
      }
      var orderRights = [];
      for (var i = 0; i < $('.option_number').length; i++) {
        var obj = {};
        obj.useNum = $('.option_number').eq(i).attr('useNum');
        obj.userRightId = $('.option_number').eq(i).attr("userRightId");
        orderRights.push(obj)
      }

      var params = {
        changePart: this.orderInfo.changePart,
        dealPrice: this.orderInfo.dealPrice,
        orderPrice: this.orderInfo.orderPrice,
        memberPrice: this.orderInfo.memberPrice,
        retailPrice: this.orderInfo.retailPrice,
        serviceType: this.orderInfo.serviceType,
        orderAudits: orderAudits,
        orderRights: orderRights,
        orderSn: this.orderInfo.orderSn,
        partSn: this.orderInfo.partSn,
        giftService: this.orderInfo.giftService,
        productName: this.orderInfo.productName,
        traceSourceType: this.orderInfo.traceSourceType,
        traceSourceImg: this.orderInfo.traceSourceImg,
        traceSeqCode: this.traceSeqCode,
        personId: this.orderInfo.personId
      }
      console.log("参数请求=====：", params)
      fn.showTip(this.traceSeqCode)
      Service.updataOrder('POST', JSON.stringify(params), (function callback(data) {
        //console.log("数据：", data)
        if (data.code == 200) {
          fn.showTip("提交成功", "orderList.html");
        }
      }))
    }
  },
  mounted: function () {
    var _self = this;
    this.getOrderDetail();
    this.getDatecode();
    this.getMechanic();
    this.cropperUrl = '';
    this.cropperShow = false;
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
    $('.cropperModal').height(document.body.clientHeight + 'px')
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  }
})