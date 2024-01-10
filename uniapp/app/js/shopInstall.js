var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  accountType: "",
  shopInfo: {
    person: "",

  },
  shopMemberList: [],
  step4: false,
  step1: true,
  carInfoList: [],
  brandId: '',
  prolist: [],
  kw: '',
  searchType: 'proName',
  pageNo: 0,
  totalPage: 1,
  showShop: false,
  sopItemList: [],
  remarks: "",
  remaList: [],
  remaItem: '',
  styleItem: false,
  subFlag: true,
  MaterialList: []
}

var vm = new Vue({
  el: '#app',
  data: data,
  created() {
    fn.routeQuery(tempJson)
  },
  mounted: function () {
    var _self = this;
    this.accountType = userInfo.accountType ? userInfo.accountType : 0;
    // this.getopen()
    this.getCheckMaterialList()
    this.getsopMaterialItem()
    this.getShopMember()

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
  methods: {
    getCheckMaterialList() {
      let _self = this
      var params = {
        pageNo: 1, //页码
        pageSize: 100
      }
      Service.checkMaterialList('POST', JSON.stringify(params), (function callback(data) {
        console.log('data3:', data.data);
        if (data.code == 200) {
          data.data.map((item, index) => {
            item.text = item.remarks
            item.value = index
          })
          _self.MaterialList = data.data
        }
      }))
    },
    // getopen() {
    //   var link = window.location.href;
    //   $.ajax({
    //       url: HOST + 'wx/autoSignature',
    //       type: 'GET',
    //       dataType: 'json',
    //       data: {
    //         url: link
    //       }
    //     })
    //     .done((data) => {

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
    //             'chooseImage',
    //             'getLocalImgData'
    //           ]
    //         });
    //       } else {
    //         fn.showTip(data.message)
    //       }
    //     })
    // },
    //获取门店店员列表
    getShopMember() {
      var _self = this;
      var params = {
        pageNo: 1,
        pageSize: 100
      }
      Service.getShopPersonList('POST', JSON.stringify(params), (function callback(data) {
        console.log("=====数据：", data.data)
        if (data.code == 200) {
          data.data.map((item) => {
            item.text = item.name
            item.value = item.id
            item.imgPath = "https://img.txmaoyi.com/2021-04-30/order/101/cut/61523cd1-c294-4106-b0c7-b4fecf45d363.jpg"
          })
          _self.shopMemberList = data.data;
        }
      }))
    },
    toPerson() {
      let _self = this
      var cityPicker = new mui.PopPicker({
        layer: 1
      });
      cityPicker.setData(_self.shopMemberList);
      cityPicker.show(function (items) {
        $("#choose-person").text(items[0].text);
        _self.shopInfo.personId = items[0].value;
      });
    },
    getsopMaterialItem() {
      var _self = this
      let params = {
        carg: tempJson.carg || this.shopInfo.carg,
      }
      Service.sopMaterialItem('GET', params, (function callback(data) {
        console.log(data.data)
        if (data.code == 200) {
          data.data.materialItemList.map(item => {
            if (item.checkItemId == 72 && item.imgList.length > 0) {
              _self.remarks = item.imgList[0].remarks

            }
          })
          console.log(_self.MaterialList, 1111)

          _self.shopInfo = data.data
        }
      }))
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
        this.shopInfo.glassType = e.glassType
        this.shopInfo.partsName = e.partsName;
        this.shopInfo.carg = e.carg
        this.shopInfo.gysPartsSn = e.gysPartsSn
      }
      this.step1 = true;
      this.step4 = false;
    },
    upCallback: function (page) {
      //联网加载数据
      var self = this;
      this.getsopGlassList(page.num, page.size, function (curPageData) {
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
    getsopGlassList: function (pageNum, pageSize, successCallback, errorCallback) {
      this.pageNo = pageNum;
      if (this.searchType == 'proName') {
        var params = {
          kw: this.kw,
          pageNo: pageNum, //页码
          pageSize: pageSize
        }
        Service.sopGlassList('POST', JSON.stringify(params), (function callback(data) {
          if (data.code == 200) {
            self.totalPage = data.total;
            var listData = data.data;
            successCallback && successCallback(listData); //成功回调  
          }
        }))
      }
    },
    onMaterial(item, index, items, idx) {

      let _self = this
      if (_self.MaterialList.length > 0) {
        var cityPicker = new mui.PopPicker({
          layer: 1
        });
        cityPicker.setData(_self.MaterialList);
        cityPicker.show(function (list) {
          let imgList = _self.shopInfo.materialItemList[index].imgList
          let idx = _self.MaterialList.findIndex(fruit => fruit.text === list[0].text)
          _self.$delete(_self.MaterialList, idx)
          let images = []
          if (items == 1) {
            imgList.push({
              imgPath: list[0].imgPath,
              remarks: list[0].text
            })
            images.push({
              imgPath: list[0].imgPath,
              remarks: list[0].text
            })
          } else {
            imgList.map((obj) => {
              if (obj.imgId === items.imgId) {
                obj.imgPath = list[0].imgPath;
                obj.remarks = list[0].text
              }
            })
            images.push({
              imgId: items.imgId,
              imgPath: list[0].imgPath,
              remarks: list[0].text
            })
          }
          if (item.checkItemId == 72) {
            _self.shopInfo.materialItemList[index].imgList = imgList
          }
          if (items == 1) {
            _self.setSopAdd(item, images)
          } else {
            _self.setSopEdit(item, images)
          }

        });
      }
    },

    openPopover(item, index, items) {
      mui('#sheet1').popover('toggle');
      this.item = item;
      this.index = index;
      this.items = items;
    },
    hidePopover() {
      mui('#sheet1').popover('hide');
    },
    onOpenCamera() {
      const that = this;
      var u = navigator.userAgent;
      var isandroid = u.indexOf('Android') > 1 || u.indexOf('Adr') > -1
      if (isandroid) {
        window.H5page.openCamera(that.urls);
        window.toPhoto = function (data) {
          let list = data.data;
          that.uploadProductImg(list);
          mui('#sheet1').popover('hide');
        };
      }
    },
    // 相册选择
    onselecePhoto() {
      const that = this;
      var u = navigator.userAgent;
      var isandroid = u.indexOf('Android') > 1 || u.indexOf('Adr') > -1
      if (isandroid) {
        window.H5page.selectPhoto(that.urls);
        window.toPhoto = function (data) {
          let list = data.data;
          that.uploadProductImg(list);
          mui('#sheet1').popover('hide');
        };
      }
    },
    uploadProductImg(data) {
      var _self = this;
      this.sheetShow = false;
      let images = [];
      if (this.items == undefined) {
        images.push({
          imgPath: data.webPath,
          remarks: _self.remarks,
        });
      } else {
        images.push({
          imgId: this.items.imgId,
          imgPath: data.webPath,
          remarks: this.item.remarks,
        });
      }
      if (
        this.item.checkItemId == 67 ||
        this.item.checkItemId == 68 ||
        this.item.checkItemId == 69 ||
        this.item.checkItemId == 70 ||
        this.item.checkItemId == 71
      ) {
        _self.shopInfo.materialItemList[this.index].imgList = images;
      } else {
        _self.shopInfo.materialItemList[this.index].imgList =
          _self.shopInfo.materialItemList[this.index].imgList.concat(images);
      }
      if (this.items == undefined) {
        _self.setSopAdd(this.item, images);
      } else {
        _self.setSopEdit(this.item, images);
      }
    },
    setSopAdd(item, datas) {
      const that = this
      if (!this.shopInfo.carg || this.shopInfo.carg === " ") {
        fn.showTip("请先选择车型");
        return false;
      }
      if (!this.shopInfo.personId) {
        fn.showTip("请选择技师");
        return false;
      }
      let params = {
        carg: this.shopInfo.carg,
        checkItemId: item.checkItemId,
        imgPathList: datas,
        glassType: this.shopInfo.glassType,
        gysPartsSn: this.shopInfo.gysPartsSn,
        partsName: this.shopInfo.partsName,
        personId: this.shopInfo.personId
      }
      Service.sopAdd('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          // that.getsopMaterialItem()
          that.styleItem = false
          that.remarks = ""
        }
      }))
    },
    setSopEdit(item, datas) {
      const that = this
      if (!this.shopInfo.carg || this.shopInfo.carg === " ") {
        fn.showTip("请先选择车型");
        return false;
      }
      if (!this.shopInfo.personId) {
        fn.showTip("请选择技师");
        return false;
      }
      let params = {
        carg: this.shopInfo.carg,
        checkItemId: item.checkItemId,
        imgPathList: datas,
        glassType: this.shopInfo.glassType,
        gysPartsSn: this.shopInfo.gysPartsSn,
        partsName: this.shopInfo.partsName,
        personId: this.shopInfo.personId
      }
      Service.sopEdit('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200) {
          that.remarks = ""
          // that.getsopMaterialItem()
        }
      }))
    },
    onclose(id) {
      const that = this
      let params = {
        imgId: id
      }
      Service.sopDelete('GET', params, (function callback(data) {
        if (data.code == 200) {
          that.getsopMaterialItem()
        }
      }))
    },
    blurRemarks(item, index, items) {
      this.setSopEdit(item, items)
    },
    //判断信息
    chackInfo() {
      if (!this.shopInfo.carg || this.shopInfo.carg === " ") {
        fn.showTip("请选择车型");
        return false;
      }
      if (!this.shopInfo.personId) {
        fn.showTip("请选择店员");
        return false;
      }
      for (var i = 0; i < this.shopInfo.materialItemList.length; i++) {
        if (this.shopInfo.materialItemList[i].imgList.length <= 0) {
          fn.showTip("请添加" + this.shopInfo.materialItemList[i].checkItemName);
          return false;
        }
      }

      return true;
    },
    //提交勘验单
    addPay() {
      var _self = this;
      if (!this.chackInfo()) {
        return false;
      }
      var params = {
        carg: this.shopInfo.carg,
        glassType: this.shopInfo.glassType,
        gysPartsSn: this.shopInfo.gysPartsSn,
        partsName: this.shopInfo.partsName,
        imgPathList: this.shopInfo.materialItemList,
        personId: this.shopInfo.personId
      }
      fn.showTip("提交成功", "shopsop.html");
      // Service.sopAdd('POST', JSON.stringify(params), (function callback(data) {
      //   console.log(data.data)
      //   if (data.code == 200) {
      //     
      //   }
      // }))
    },
  }
})