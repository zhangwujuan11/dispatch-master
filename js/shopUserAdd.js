var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  showSubUp: false,
  singleFlag: false,
  sexFlag: true,
  typeEdit:'',
  memberInfo: {
    bankName: "",
    bankNo: "",
    cardId: "",
    isTrain: 1,
    id: "",
    job: "",
    name: "",
    certificateDtoList: [],
    phone: "",
    name: "",
    sex: 0, //性别 0：男1：女
  },
  certificateDtoList: [],

}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {

    //添加证书
    addCert() {
      var obj = {
        name: "",
        grade: "",
        issueDate: "",
        certificateImg: "",
        icon: ""
      }
      this.certificateDtoList.push(obj);
    },
    //单选筛选
    sinFlagTrue() {
      this.singleFlag = true;
      this.memberInfo.isTrain = 1;
    },
    sinFlagFalse() {
      this.singleFlag = false;
      this.memberInfo.isTrain = 0;
    },
    //性别筛选
    sexFlagTrue() {
      this.sexFlag = true;
      this.memberInfo.sex = 0;
    },
    sexFlagFalse() {
      this.sexFlag = false;
      this.memberInfo.sex = 1;
    },
    //上传图片
    btnUploadFile(type, index) {
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
                if (type == 1) {
                  $('.upLoadImg').eq(index).find(".picFullcar").attr("src", data.data.webPath);
                  _self.memberInfo.icon = data.data.webPath;
                } else {
                  $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
                  _self.certificateDtoList[index].certificateImg = data.data.webPath;
                }
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
              if (type == 1) {
                $('.upLoadImg').eq(index).find(".picFullcar").attr("src", data.data.webPath);
                _self.memberInfo.icon = data.data.webPath;
              } else {
                $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
                _self.certificateDtoList[index].certificateImg = data.data.webPath;
              }
            }
          }))
        }
      }
      reader.readAsDataURL(imgFile);
    },
    //判断信息
    chackInfo() {
      if (!this.memberInfo.name) {
        fn.showTip("店员姓名不能为空");
        return false;
      }
      if (!this.memberInfo.phone) {
        fn.showTip("手机号码不能为空");
        return false;
      }
      if (!fn.testRule.isTel(this.memberInfo.phone)) {
        fn.showTip("请正确输入手机号码");
        return false;
      }
      if (!this.memberInfo.cardId) {
        fn.showTip("身份证号不能为空");
        return false;
      }
      if (!fn.testRule.isCard(this.memberInfo.cardId)) {
        fn.showTip("请正确输入身份证号");
        return false;
      }
      if (!this.memberInfo.job) {
        fn.showTip("所属岗位不能为空");
        return false;
      }

      if (!this.memberInfo.bankName) {
        fn.showTip("开户行名称不能为空");
        return false;
      }
      if (!this.memberInfo.bankNo) {
        fn.showTip("开户行卡号不能为空");
        return false;
      }
      if (this.singleFlag == true) {
        if (this.certificateDtoList.length > 0) {
          for (var i = 0; i < this.certificateDtoList.length; i++) {
            if (this.certificateDtoList[i].name == "") {
              fn.showTip("请输入证书名称");
              return false;
            }
            if (this.certificateDtoList[i].grade == "") {
              fn.showTip("请选择操作人");
              return false;
            }
            if (this.certificateDtoList[i].issueDate == "") {
              fn.showTip("请选择发证日期");
              return false;
            }
            if (this.certificateDtoList[i].certificateImg == "") {
              fn.showTip("请上传证书照片");
              return false;
            }
          }
        } else {
          fn.showTip("请添加证书");
          return false;
        }
      }

      return true;
    },
    //确定编辑
    updateMember() {
      if (!this.chackInfo()) {
        return false;
      }
      var returnUrl = tempJson.returnUrl ? tempJson.returnUrl : '';
      var params = {};
      if (this.singleFlag) {
        this.memberInfo.certificateDtoList = this.certificateDtoList;
        params = this.memberInfo
      } else {
        params = this.memberInfo
      }
      console.log(params)
      Service.addUpShopPersonList('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          if (returnUrl) {
            fn.showTip("保存成功", returnUrl);
          } else {
            fn.showTip("保存成功", "shopUserManager.html");
          }
        }
      }))
    },
    toGrade(index) {
      console.log(this.certificateDtoList)
      let _self = this
      var cityPicker = new mui.PopPicker({
        layer: 1
      });
      cityPicker.setData([{
          value: 1,
          text: "汽车玻璃维修技师三级"
        },
        {
          value: 2,
          text: "汽车玻璃维修工四级"
        },
        {
          value: 3,
          text: "汽车玻璃贴膜技师三级"
        },
      ]);
      cityPicker.show(function (items) {
        $("#choose-grade").text(items[0].text);
        _self.certificateDtoList[index].grade = items[0].text;
      });
    },

  },
  mounted: function () {
    //alert(fn.versions.ios)
    var _self = this;
    var shopPersonId = tempJson.realId ? tempJson.realId : "";
    this.typeEdit = tempJson.type ? tempJson.type : ""
    if (shopPersonId) {
      var params = {
        shopPersonId: shopPersonId
      }
      Service.getShopPersonDetail('GET', params, (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          _self.memberInfo = data.data;
          // if (_self.memberInfo.job == 10) {
          //     _self.memberInfo.jobName = "店长"
          // }
          // if (_self.memberInfo.job == 11) {
          //     _self.memberInfo.jobName = "技师"
          // }
          // if (_self.memberInfo.job == 12) {
          //     _self.memberInfo.jobName = "前台"
          // }
          console.log(data.data.isTrain == 1)
          if (_self.memberInfo.isTrain == 1) {
            _self.singleFlag = true
          } else {
            _self.singleFlag = false
          }
          if (_self.memberInfo.sex == 1) {
            _self.sexFlag = false
          } else {
            _self.sexFlag = true
          }
          if (_self.memberInfo.cerTificates) {
            _self.certificateDtoList = _self.memberInfo.cerTificates;
            for (var i in _self.certificateDtoList) {
              _self.certificateDtoList[i].issueDate = _self.certificateDtoList[i].issueDate ? fn.formatTime(_self.certificateDtoList[i].issueDate, 'Y-M-D') : "";
            }
          }
        }
      }))
    }
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";

    }, 300)
  }
})