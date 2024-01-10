var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  userRights: [],
  joinInfo: {
    azjlImg1: "",
    azjlImg2: "",
    itemId: "",
    joinId: "",
    worksPws1: "",
    worksPws2: "",
    worksUrl1: "",
    worksUrl2: "",
    carg1: "",
    carg2: "",
  },
  itemName: tempJson.itemName,
  personName: tempJson.personName,
  worksA: 0,
  glassIndex: 1,
  sheetVisible: false,
  openShow: false,
  markImgShow: false,
  azIndex: 0
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {
    onOpenSheets(type, open) {
      this.sheetVisible = true;
      $('.seemark').show()
      this.openShow = open
      this.glassIndex = type;
    },
    onSheets(type, open, index) {
      console.log(type, open, index)
      this.sheetVisible = true;
      $('.seemark').show()
      this.openShow = open
      this.glassIndex = type;
      this.azIndex = index

    },
    cancel() {
      $('.seemark').hide()
      this.sheetVisible = false
      this.openShow = false
    },
    seeImg() {
      this.markImgShow = true
      this.markImg = this.glassIndex == 1 ? this.joinInfo.azjlImg1 : this.joinInfo.checkList[that.azIndex].checkItemImg
    },
    classopen() {
      $('.seemark').show()
      this.sheetVisible = true
      this.markImgShow = true
      this.markImg = this.itemName == '2022年CARG/AGTS安装大赛' ? 'images/az.jpg' : 'images/xf.jpg'
    },

    // 打开相机
    onOpenCamera() {
      const that = this;
      var u = navigator.userAgent;
      var isandroid = u.indexOf('Android') > 1 || u.indexOf('Adr') > -1
      if (isandroid) {
        // this.sheetVisible = false;
        let urls = HOST + "image/upload"
        $('.seemark').hide()
        window.H5page.openCamera(urls);
        window.toPhoto = function (data) {
          let list = data.data;
          if (data.code = 200) {
            if (that.glassIndex == 1) {
              that.$nextTick(() => {
                that.joinInfo.azjlImg1 = list.webPath;
              });
            } else {
              that.$nextTick(() => {

                that.joinInfo.checkList.map((item, index) => {
                  if (index == that.azIndex) {
                    item.checkItemImg = list.webPath
                  }
                })
              });
            }
          }
        };
      }
    },
    // 相册选择
    onselecePhoto() {
      const that = this;
      var u = navigator.userAgent;
      var isandroid = u.indexOf('Android') > 1 || u.indexOf('Adr') > -1
      if (isandroid) {
        let urls = HOST + "image/upload"
        // this.sheetVisible = false;
        $('.seemark').hide()
        window.H5page.selectPhoto(urls);
        window.toPhoto = function (data) {
          let list = data.data;
          if (data.code = 200) {
            if (that.glassIndex == 1) {
              that.$nextTick(() => {
                that.joinInfo.azjlImg1 = list.webPath;
              });
            } else {
              that.$nextTick(() => {
                that.joinInfo.checkList.map((item, index) => {
                  if (index == that.azIndex) {
                    item.checkItemImg = list.webPath
                  }
                })
              });
            }
          }
        };
      }
    },

    //小写转大写
    toUpperCase(e) {
      this.joinInfo.carg1 = e.toUpperCase();
    },
    //小写转大写
    toUpper(e) {
      this.joinInfo.carg2 = e.toUpperCase();
    },

    //判断信息
    chackPicInfo() {
      let joinInfo = this.joinInfo;

      if (!joinInfo.carg1) {
        fn.showTip("请输入CARG码");
        return false;
      }
      if (!joinInfo.worksUrl1) {
        fn.showTip("请输入作品地址A");
        return false;
      }
      if (!joinInfo.worksPws1) {
        fn.showTip("请输入作品A 提取码");
        return false;
      }
      if (!joinInfo.azjlImg1) {
        fn.showTip("请上传安装记录表");
        return false;
      }
      // for (var i = 0; i < this.joinInfo.checkList.length; i++) {
      //   if (this.joinInfo.checkList[i].checkItemImg == undefined) {
      //     fn.showTip(this.joinInfo.checkList[i].name + "照片必填");
      //     return false;
      //   }
      // }
      return true;
    },
    //提交审核
    onSubmit() {
      let that = this
      if (!this.chackPicInfo()) {
        return false;
      }
      var params = this.joinInfo
      Service.uploadWorks('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          fn.showTip(data.data);
          setTimeout(() => {
            window.history.back()
          }, 3500);
        }
      }))
    },
    getWorksDetail() {
      const that = this
      let params = {
        joinId: tempJson.joinId
      }
      Service.worksDetail('GET', params, (function callback(data) {
        console.log(data.data)
        if (data.code == 200 && data.data) {
          let workData = data.data
          if (data.data.carg1 != undefined && data.data.carg1) {
            that.worksA = 1;
          }
          if (tempJson.itemName == "2022年CARG/AGTS修复大赛" && data.data.carg1 == undefined) {
            workData.azjlImg1 = ""
            workData.worksPws1 = ""
            workData.worksUrl1 = ""
            workData.carg1 = ""
          }

          that.joinInfo = workData
        }
      }))
    },
  },
  created() {
    // fn.routeQuery(tempJson)
  },
  mounted: function () {
    this.getWorksDetail()

    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  }
})