var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);
var data = {
  isShowMask: false,
  showSubUp: false,
  memberInfo: {
    bandType: "",
    birthday: "",
    carColor: "",
    carGlassId: 0,
    carInfoId: 0,
    carNo: "",
    mobile: "",
    name: "",
    sex: "",
    userId: 0,
    vin: "",
    fdjNo: "",
    address: ""
  },
  drivingPic: "",
  provSelected: "京",
  carNo: "",
  provList: ['京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑', '湘', '皖', '鲁', '新', '苏', '浙', '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '粤', '青', '藏', '川', '宁', '琼', '使', '领']
}


var vm = new Vue({
  el: '#app',
  data: data,
  methods: {

    //上传图片
    upImg() {
      var _self = this;
      //正式环境用
      wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        //sizeType: ['original'],
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        defaultCameraMode: "normal",
        success: function (res) {
          var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
          vm.showSubUp = true;
          wx.getLocalImgData({
            localId: localIds.toString(), // 图片的localID
            success: function (res) {
              var localData = res.localData; // localData是图片的base64数据，可以用img标签显示

              var base64 = "data:image/jgp;base64 || data:image/jgep;base64 || data:image/png;base64 || data:image/gif;base64";
              //alert(localData.split(",")[0])
              var base64Jpg = "data:image/jgp;base64";
              if (fn.versions.android) {
                if (localData.split(",")[0] != base64) {
                  localData = base64Jpg + "," + localData;
                  //$('.matchImg').attr("src", localData);
                }
              }
              var params = {
                base64Data: localData,
                bizType: 101
              }
              Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
                //console.log("数据：", data)
                if (data.code == 200) {
                  //alert(data.data.webPath);
                  _self.drivingPic = data.data.webPath;
                  var params = {
                    base64Data: _self.drivingPic,
                    //base64Data: _self.drivingPic,
                    bizType: 2
                  }
                  Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {
                    if (data.code == 200) {
                      console.log(data.data);
                      if (_self.memberInfo.carNo == data.data.carNo) {
                        _self.memberInfo.name = data.data.userName;
                        _self.memberInfo.carNo = data.data.carNo;
                        _self.memberInfo.vin = data.data.vin;
                        _self.memberInfo.address = data.data.address;
                        _self.memberInfo.fdjNo = data.data.fdjNo;
                        _self.carNo = data.data.carNo.substring(1);
                        _self.provSelected = data.data.carNo.substring(0, 1)
                      } else {
                        _self.drivingPic = "";
                        //fn.showTip('请上传与系统车牌号信息一致的行驶证!')
                        fn.showTip('识别的车牌号为：' + data.data.carNo + '，与系统车牌号信息不一致!')
                      }

                    }
                  }))
                }
              }))
            }
          });
        }
      });

    },
    authority(){
      if (navigator.userAgent.indexOf("Android") !== -1) { 
        $('.authority_mask').css('display','block');
      }
    },
    hideAuthorityMask(){
      $('.authority_mask').css('display','none');
    },
    //上传新版行驶证
    btnUploadDriveImg() {
      $('.authority_mask').css('display','none');
      var _self = this;
      let evt = window.event || e;
      let el = evt.currentTarget || evt.srcElement;
      //获取图片文件
      var imgFile = el.files[0];

      //异步读取文件
      var reader = new FileReader();
      reader.onloadstart = function (e) {
        _self.isShowMask = true;
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
                _self.drivingPic = data.data.webPath;
                var params = {
                  base64Data: _self.drivingPic,
                  //base64Data: _self.drivingPic,
                  bizType: 2
                }
                Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {
                  if (data.code == 200) {
                    if (_self.memberInfo.carNo == data.data.carNo) {
                      _self.memberInfo.name = data.data.userName;
                      _self.memberInfo.carNo = data.data.carNo;
                      _self.memberInfo.vin = data.data.vin;
                      _self.memberInfo.address = data.data.address;
                      _self.memberInfo.fdjNo = data.data.fdjNo;
                      _self.carNo = data.data.carNo.substring(1);
                      _self.provSelected = data.data.carNo.substring(0, 1)
                      _self.isShowMask = false;
                    } else {
                      if (_self.memberInfo.carNo == undefined) {
                        _self.memberInfo.name = data.data.userName;
                        _self.memberInfo.carNo = data.data.carNo;
                        _self.memberInfo.vin = data.data.vin;
                        _self.memberInfo.address = data.data.address;
                        _self.memberInfo.fdjNo = data.data.fdjNo;
                        _self.carNo = data.data.carNo.substring(1);
                        _self.provSelected = data.data.carNo.substring(0, 1)
                      } else {
                        _self.drivingPic = "";
                        fn.showTip('识别的车牌号为：' + data.data.carNo + '，与系统车牌号信息不一致!')
                      }
                    }
                  }

                }))
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

              _self.drivingPic = data.data.webPath;
              var params = {
                base64Data: _self.drivingPic,
                //base64Data: _self.drivingPic,
                bizType: 2
              }
              Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                  console.log(data.data);
                  if (_self.memberInfo.carNo == data.data.carNo) {
                    console.log(_self.memberInfo.carNo, 1111)
                    _self.memberInfo.name = data.data.userName;
                    _self.memberInfo.carNo = data.data.carNo;
                    _self.memberInfo.vin = data.data.vin;
                    _self.memberInfo.address = data.data.address;
                    _self.memberInfo.fdjNo = data.data.fdjNo;
                    _self.carNo = data.data.carNo.substring(1);
                    _self.provSelected = data.data.carNo.substring(0, 1)
                    _self.isShowMask = false;
                  } else {
                    if (_self.memberInfo.carNo == undefined) {
                      console.log(_self.memberInfo.carNo, 2222)
                      _self.memberInfo.name = data.data.userName;
                      _self.memberInfo.carNo = data.data.carNo;
                      _self.memberInfo.vin = data.data.vin;
                      _self.memberInfo.address = data.data.address;
                      _self.memberInfo.fdjNo = data.data.fdjNo;
                      _self.carNo = data.data.carNo.substring(1);
                      _self.provSelected = data.data.carNo.substring(0, 1)
                    } else {
                      _self.drivingPic = "";
                      fn.showTip('识别的车牌号为：' + data.data.carNo + '，与系统车牌号信息不一致!')
                    }
                  }
                }
              }))
            }
          }))
        }
        setTimeout(function () {
          _self.isShowMask = false;
        }, 10000)
      }
      reader.readAsDataURL(imgFile);
    },
    //获取驾驶证信息
    getDrivingPicInfo() {
      var _self = this;
      _self.drivingPic = tempJson.drivingPic ? tempJson.drivingPic : "";
      if (_self.drivingPic) {
        var params = {
          base64Data: _self.drivingPic,
          bizType: 2
        }
        Service.readDrivingLicense('POST', JSON.stringify(params), (function callback(data) {
          if (data.code == 200) {

            if (_self.memberInfo.carNo == data.data.carNo) {
              _self.memberInfo.name = data.data.userName;
              _self.memberInfo.carNo = data.data.carNo;
              _self.memberInfo.vin = data.data.vin;
              _self.memberInfo.address = data.data.address;
              _self.memberInfo.fdjNo = data.data.fdjNo;
              _self.carNo = data.data.carNo.substring(1);
              _self.provSelected = data.data.carNo.substring(0, 1)
            } else {
              if (_self.memberInfo.carNo == undefined) {
                _self.memberInfo.name = data.data.userName;
                _self.memberInfo.carNo = data.data.carNo;
                _self.memberInfo.vin = data.data.vin;
                _self.memberInfo.address = data.data.address;
                _self.memberInfo.fdjNo = data.data.fdjNo;
                _self.carNo = data.data.carNo.substring(1);
                _self.provSelected = data.data.carNo.substring(0, 1)
              } else {
                _self.drivingPic = "";
                fn.showTip('识别的车牌号为：' + data.data.carNo + '，与系统车牌号信息不一致!')
              }
            }
          }
        }))
      }

    },
    getProSelected() {
      //获取选中省份简称
      console.log(this.provSelected)
    },
    //小写转大写
    toUpperCase(e) {
      // console.log('e：',e.toUpperCase())
      this.carNo = e.toUpperCase();
    },
    //选择车型
    cngbandType() {
      //this.memberInfo.carNo = this.provSelected + this.carNo;
      var kw = tempJson.kw ? tempJson.kw : "";
      var userId = tempJson.userId ? tempJson.userId : 0;
      var backUrl = tempJson.backUrl ? tempJson.backUrl : "";
      window.location.href = "queryCar.html?kw=" + kw +
        "&drivingPic=" + this.drivingPic +
        "&backUrl=" + backUrl
      //+ "&memberInfo=" + JSON.stringify(this.memberInfo);
    },
    //判断信息
    chackInfo() {
      if (!this.memberInfo.bandType) {
        fn.showTip("车型不能为空");
        return false;
      }
      if (!this.memberInfo.carNo) {
        fn.showTip("车牌号不能为空");
        return false;
      }
      if (!this.memberInfo.vin) {
        fn.showTip("车架号不能为空");
        return false;
      }
      if (!this.memberInfo.name) {
        fn.showTip("姓名不能为空");
        return false;
      }
      if (!this.memberInfo.mobile) {
        fn.showTip("手机号不能为空");
        return false;
      }
      if (!fn.testRule.isTel(this.memberInfo.mobile)) {
        fn.showTip("请正确输入手机号");
        return false;
      }

      return true;
    },
    //确定编辑
    updateMember() {

      if (!this.memberInfo.carNo && !this.carNo) {} else {
        this.memberInfo.carNo = this.provSelected + this.carNo;
      }
      if (!this.chackInfo()) {
        return false;
      }
      var params = this.memberInfo
      var backUrl = tempJson.backUrl ? tempJson.backUrl : "";
      console.log(params)
      Service.updateMember('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          console.log(data.data);
          if (backUrl) {
            fn.showTip("编辑成功", backUrl);
          } else {
            fn.showTip("编辑成功", 'member.html?kw=' + (tempJson.kw ? tempJson.kw : ""));
          }
        }
      }))
    }

  },
  mounted() {
    //alert(fn.versions.ios)
    var _self = this;

    if (tempJson.userId) {
      var params = {
        userId: tempJson.userId ? tempJson.userId : ""
      }

      Service.getUser('GET', params, (function callback(data) {
        if (data.code == 200) {
          document.getElementById("appContent").style.display = "block";
          _self.memberInfo = data.data;
          _self.memberInfo.userId = data.data.id;

          if (_self.memberInfo.birthday) {
            _self.memberInfo.birthday = fn.formatTime(_self.memberInfo.birthday, 'Y-M-D');
          } else {
            _self.memberInfo.birthday = fn.formatTime(new Date(), 'Y-M-D');
          }
          if (_self.memberInfo.rightsSta) {
            _self.memberInfo.rightsSta = fn.formatTime(_self.memberInfo.rightsSta, 'Y-M-D');
            _self.memberInfo.rightsEnd = fn.formatTime(_self.memberInfo.rightsEnd, 'Y-M-D');
          }
          if (_self.memberInfo.carNo) {
            _self.provSelected = _self.memberInfo.carNo.substring(0, 1)
            _self.carNo = _self.memberInfo.carNo.substring(1);
          }
          _self.getDrivingPicInfo();
          for (var i = 0; i < $('.sex').length; i++) {
            if (_self.memberInfo.sex == $('.sex').eq(i).html()) {
              $('.sex').eq(i).parent().find('.iconRadio').addClass('iconOk')
            }
          }
          // 数据信息：
          if (tempJson.memberInfo) {
            _self.memberInfo = JSON.parse(tempJson.memberInfo)

            if (_self.memberInfo.carNo) {
              _self.carNo = _self.memberInfo.carNo.substring(1);
              _self.provSelected = _self.memberInfo.carNo.substring(0, 1)
            }
            if (_self.memberInfo.sex == '男') {
              $('.sexSelect li').eq(0).find('.iconRadio').addClass("iconOk")
            } else {
              $('.sexSelect li').eq(1).find('.iconRadio').addClass("iconOk")
            }
          }
          //车型选择
          if (tempJson.carType) {
            _self.memberInfo.bandType = tempJson.carType
          }
          //存在车型ID
          if (tempJson.carInfoId) {
            _self.memberInfo.carInfoId = tempJson.carInfoId
          }
        }
      }))
    } else {
      var params = {
        kw: tempJson.kw ? tempJson.kw : ""
      }
      Service.queryMember('POST', JSON.stringify(params), (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          document.getElementById("appContent").style.display = "block";
          _self.memberInfo = data.data;
          _self.memberInfo.userId = data.data.id;

          if (_self.memberInfo.birthday) {
            _self.memberInfo.birthday = fn.formatTime(_self.memberInfo.birthday, 'Y-M-D');
          } else {
            _self.memberInfo.birthday = fn.formatTime(new Date(), 'Y-M-D');
          }
          if (_self.memberInfo.rightsSta) {
            _self.memberInfo.rightsSta = fn.formatTime(_self.memberInfo.rightsSta, 'Y-M-D');
            _self.memberInfo.rightsEnd = fn.formatTime(_self.memberInfo.rightsEnd, 'Y-M-D');
          }
          if (_self.memberInfo.carNo) {
            _self.provSelected = _self.memberInfo.carNo.substring(0, 1)
            _self.carNo = _self.memberInfo.carNo.substring(1);
          }
          _self.getDrivingPicInfo();
          for (var i = 0; i < $('.sex').length; i++) {
            if (_self.memberInfo.sex == $('.sex').eq(i).html()) {
              $('.sex').eq(i).parent().find('.iconRadio').addClass('iconOk')
            }
          }

          // 数据信息：
          if (tempJson.memberInfo) {
            _self.memberInfo = JSON.parse(tempJson.memberInfo)

            if (_self.memberInfo.carNo) {
              _self.carNo = _self.memberInfo.carNo.substring(1);
              _self.provSelected = _self.memberInfo.carNo.substring(0, 1)
            }
            if (_self.memberInfo.sex == '男') {
              $('.sexSelect li').eq(0).find('.iconRadio').addClass("iconOk")
            } else {
              $('.sexSelect li').eq(1).find('.iconRadio').addClass("iconOk")
            }
          }

          //车型选择
          if (tempJson.carType) {
            _self.memberInfo.bandType = tempJson.carType
          }
          //存在车型ID
          if (tempJson.carInfoId) {
            _self.memberInfo.carInfoId = tempJson.carInfoId
          }
        }
      }))
    }
    //性别选择
    $('.sexSelect li').on('click', function () {
      $(this).find('.iconRadio').addClass("iconOk")
        .parent().siblings().find('.iconRadio').removeClass("iconOk");
      _self.memberInfo.sex = $(this).find('span').html();

    })
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      //document.getElementById("appContent").style.display = "block";
    }, 300)
  }
})