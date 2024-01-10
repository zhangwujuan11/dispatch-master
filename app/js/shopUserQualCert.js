var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  currentIndex: 0,
  isShowSelUser: false,
  accountType: "",
  isExtendFlag: true,
  openId: '',
  optionPics: [],


  postlist: [{
    name: "前台",
    job: 12,
    flagPass: false
  },
  {
    name: "技师",
    job: 11,
    flagPass: false
  },
  {
    name: "店长",
    job: 10,
    flagPass: false
  },
  {
    name: "贴膜",
    job: 14,
    flagPass: false
  }, {
    name: "裁判员",
    job: 15,
    flagPass: false
  }, {
    name: "讲师",
    job: 34,
    flagPass: false
  }
  ],
  selArrs: [],
  memberList: [],
  shopImgList: [],
  itemObj: {},
  shopInfo: {},
  shopType: 102,
  knowList: [],
  personInfo: {},
  personId: '',
  examInfo: {},
  optionInfo: {},
  shopPersonList: [],
  examVOList: [],
  examSucPersonList: [],
  currentDate: ''
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {
    onstandard() {
      // window.location.href = "http://www.txsofts.com/dispatch/images/玻璃更换流程20210324_01.jpg"
      window.location.href = "http://dispatch.edows.cn/images/玻璃更换流程20210324.jpg"
    },

    //门店认证
    toShopCert() {
      window.location.href = "shopQualApply.html";
    },
    //门店问题改进
    toQuestionCert() {
      window.location.href = "shopQuestionCert.html";
    },
    //知识列表显示
    getKnowledgeList() {
      var _self = this;

      var params = {
        "job": this.postlist[this.currentIndex].job,
        "pageNo": 1,
        "pageSize": 999
      };
      Service.getKnowledgeList('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          // document.getElementById("appContent").style.display = "block";
          _self.knowList = data.data ? data.data : [];
          for (var i in _self.knowList) {
            _self.knowList[i].publishTime = fn.formatTime(_self.knowList[i].publishTime, 'Y-M-D')
          }
        }

      }))
    },
    //知识详情
    toLearn(item) {
      window.location.href = "learningDetail.html?id=" + item.id;
    },

    //切换职位
    cngPost(index) {
      this.currentIndex = index;
      this.knowList = [];
      this.examVOList = [];
      this.getKnowledgeList();
      this.getPersonAuditInfo();
    },
    //获取门店认证信息
    getShopAuditDetail() {
      var _self = this;

      var params = {};
      Service.getShopAuditDetail('GET', params, (function callback(data) {
        if (data.code == 200) {
          document.getElementById("appContent").style.display = "block";
          _self.shopInfo = data.data;
          _self.shopPersonList = data.data.shopPersonList;
        }
      }))
    },
    //获取门店店员认证信息
    getPersonAuditInfo() {
      var _self = this;

      var params = {
        "job": this.postlist[this.currentIndex].job
      };
      Service.getPersonAuditInfo('GET', params, (function callback(data) {
        if (data.code == 200) {

          _self.personInfo = data.data;
          _self.optionInfo = data.data.operationVO;
          _self.optionPics = data.data.operationVO.imgVOList;
          _self.personId = data.data.operationVO.personId;
          _self.examInfo = data.data.examInfoVO;
          if (data.data.examSucPersonList) {
            _self.examSucPersonList = data.data.examSucPersonList;
          }

          _self.currentDate = fn.formatTime(data.tradeTime, 'Y-M-D')
          if (data.data.examInfoVO.examVOList) {
            _self.examVOList = data.data.examInfoVO.examVOList;
          }
          console.log(_self.examInfo)
        }

      }))
    },
    //上传图片
    btnUploadFile(index) {
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
        $('.maskUploadImg').eq(index).show();
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
    //去考试 
    toExam(e) {
      if (this.currentDate >= e.startTime && this.currentDate <= e.endTime) {
        window.location.href = 'examReg.html?examInfo=' + JSON.stringify(e);
      } else {
        fn.showTip('不在考试测评时间范围内！')
      }

    },
    //判断信息
    chackInfo() {
      if (!this.personId) {
        fn.showTip("店员姓名不能为空");
        return false;
      }

      // for(var i=0; i<$('.upLoadImgs').length; i++){
      //     if ($('.upLoadImgs').eq(i).find(".picFullcar").attr('src')=="images/upload.jpg") {
      //         fn.showTip("破损照片必填");
      //         return false;
      //     }

      // }
      return true;
    },

    //提交店员实操认证
    add() {
      if (!this.chackInfo()) {
        return false;
      }
      // var checkItemId = $('.upLoadImgs').eq(index).attr('checkItemId');
      // var orderSn = $('.upLoadImgs').eq(index).attr('orderSn');

      var imgLists = [];
      for (var i = 0; i < $('.upLoadImgs').length; i++) {
        var obj = {};
        if ($('.upLoadImgs').eq(i).find(".picFullcar").attr('src') != "images/upload.jpg") {
          obj.imgId = $('.upLoadImgs').eq(i).attr('checkItemId');
          obj.imgPath = $('.upLoadImgs').eq(i).find(".picFullcar").attr('src');
          imgLists.push(obj)
        }

      }
      console.log(imgLists)
      if (!imgLists.length) {
        fn.showTip("实操图片不能都为空");
        return false;
      }
      var params = {
        personId: this.personId,
        imgLists: imgLists,
        job: this.postlist[this.currentIndex].job
      }
      console.log("参数请求：", params)
      Service.applyPersonAudit('POST', JSON.stringify(params), (function callback(data) {
        //console.log("数据：", data)
        if (data.code == 200) {
          fn.showTip("提交成功", "shopUserQualCert.html");
        }
      }))

    }

  },
  created() {
    fn.routeQuery(tempJson)
  },
  mounted: function () {
    fn.routeQuery(tempJson)
    this.accountType = userInfo.accountType ? userInfo.accountType : 0;
    var _self = this;
    this.getShopAuditDetail();
    this.getPersonAuditInfo();
    this.getKnowledgeList();
    this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  }
})