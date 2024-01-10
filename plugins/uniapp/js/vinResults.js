var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);
console.log(temp_url);

var data = {
  classNative: 1,
  carList: [],
  carInfoList: [],
  carType: tempJson.carType ? tempJson.carType : "",
  parts: tempJson.parts ? tempJson.parts : "",
  yearType: tempJson.yearType ? tempJson.yearType : "",
  vinSearch: tempJson.vin ? tempJson.vin : "",
  navLists: [
    // {
    //     text: "生成采购单"
    // },
    {
      text: "生成销售单"
    }
    
  ],
  changeRed: 0,
  vinData: {},
  accountType: 0,
  isShow:false
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {
    clickGlass: function (ev, index) {
      console.log(ev, index)
    },
    onIconSearch() {
      this.getVinQuery()
    },
    reds() {
      window.location.href = "saleAdd.html";
    },
    clickRecovery() {
      window.location.href = "vinRecovery.html"
    },
    //识别VIN码
    btnUploadFile(index) {
      var _self = this;
      let es = window.event || e;
      let el = es.currentTarget || es.srcElement;
      //获取图片文件
      var imgFile = el.files[0];

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
      reader.onload = async (evt) => {
        if (imgFile.size / 1024 > 1024 * 1.2) {
          fn.dealImage(evt.target.result, {
            quality: 0.4
          }, function (base64Codes) {
            var params = {
              base64Data: base64Codes,
              bizType: 1
            }
            Service.vinCode('POST', JSON.stringify(params), (function callback(data) {
              console.log("数据：", data)
              if (data.code === 200) {
                this.data.vinSearch = JSON.parse(data.data.words_result)[0].words
              }
            }))
          });
        } else {
          var params = {
            base64Data: evt.target.result,
            bizType: 1
          }
          Service.vinCode('POST', JSON.stringify(params), (function callback(data) {
            if (data.code === 200) {
              this.data.vinSearch = JSON.parse(data.data.words_result)[0].words
            }
          }))
        }
      }
      reader.readAsDataURL(imgFile);
    },
    getVinQuery() {
      const that = this
      let params = {
        carType: that.carType,
        pageNo: 1,
        pageSize: 10,
        parts: that.parts,
        vin: that.vinSearch,
        yearType: that.yearType
      }
      Service.vinQuery('POST', JSON.stringify(params), (function callback(data) {
        if (data.code == 200 && data.data.records.length>0) {
          that.vinData = data.data.records;
          that.isShow = false
        }else{
          that.isShow = true
        }
      }))
    },
    //小写转大写
    toUpperCase(e) {
      this.vinSearch = e.toUpperCase();
    }
  },
  mounted: function () {
    this.accountType = userInfo.accountType ? userInfo.accountType : 0;
    this.getVinQuery()
  }
})