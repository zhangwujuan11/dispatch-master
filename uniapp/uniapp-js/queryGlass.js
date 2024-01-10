var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

const currentYear = new Date().getFullYear();

let tempyear = [{text:'请选择年款',value:''}]
for (var i = 1950; i <= currentYear; i++) {
  tempyear.push({ text: i, value: (i.toString()).substring(i.toString().length - 2) })
}

var data = {
  step1: true,
  step2: false,
  step3: false,
  isShowWinMask: false,
  carType: '',
  parts: '',
  yearType: "",
  carList: [],
  arrWords: [],
  carTypeList: [],
  brandId: '',
  glassOptions: ['前挡', '后挡', '右后', '左后', '右前', '左前', '天窗'],
  year: tempyear
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {

    //打开部位选择弹框
    openWinMask() {
      this.isShowWinMask = true;
    },

    //选择部位
    cngGlass(e) {
      this.parts = e;
      this.isShowWinMask = false;
    },

    //关闭部位选择弹框
    closeWinMask() {
      this.isShowWinMask = false;
    },
    //选择车型
    cngCarType() {
      //this.getCarList();
      this.step1 = false;
      this.step2 = true;
      this.step3 = false;
    },

    //车辆列表
    getCarList() {
      var _self = this;
      var params = {
        token: userInfo.token
      }
      Service.getBrandList('GET', params, (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          _self.carList = data.data;
          if (data.data.length) {
            var firstletter = []
            for (var i = 0; i < data.data.length; i++) {
              firstletter.push(data.data[i].firstletter)
            }
            _self.arrWords = fn.uniqArrs(firstletter);
          }


          console.log(_self.arrWords)
        }
      }))
    },


    //得到车型
    getCarTypeList() {
      var _self = this;
      var params = {
        token: userInfo.token,
        brandId: this.brandId
      }
      Service.getCarSeriesList('GET', params, (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200) {
          _self.carTypeList = data.data;
          _self.step1 = false;
          _self.step2 = false;
          _self.step3 = true;
        }
      }))
    },

    //选择车辆
    cngCar(e) {
      this.brandId = e.id;
      this.getCarTypeList();

    },

    //确定车型
    surCarType(e) {
      this.carType = e.fullName;
      this.step1 = true;
      this.step2 = false;
      this.step3 = false;
    },

    //判断信息
    chackInfo() {
      // if (!this.carType && !this.parts && !this.yearType) {
      //     fn.showTip("至少填写其中一项");
      //     return false;
      // }
      if (!this.carType) {
        fn.showTip("车型不能为空！");
        return false;
      }
      return true;
    },
    //会员查询
    queryGlass() {
      if (!this.chackInfo()) {
        return false;
      }
      console.log("carType：", this.carType, " parts", this.parts, " yearType", this.yearType)
      window.location.href = "glassList.html?carType=" + this.carType + "&parts=" + this.parts + "&yearType=" + this.yearType;

    }
  },
  mounted: function () {
    var _self = this;
    this.getCarList();

    //_self.year = fn.formatTime(new Date(), 'Y-M-D');
    //初始化vue后,显示vue模板布局
    setTimeout(function () {

      //省市选择
      // var yearPicker = new mui.PopPicker();
      // yearPicker.setData(yearsData);
      // //yearPicker.pickers[0].setSelectedIndex('19', 2000);
      // yearPicker.pickers[0].setSelectedValue('19', 2000);
      // $("#choose-year").on("tap", function () {

      //   yearPicker.show(function (items) {

      //     console.log(items)
      //     _self.yearType = items[0].value;
      //   });
      // });

      $('body').on('click', '.letter a', function () {
        var s = $(this).html();
        $(window).scrollTop($('#' + s + '1').offset().top);
        $("#showLetter span").html(s);
        $("#showLetter").show().delay(500).hide(0);
      });


      document.getElementById("appContent").style.display = "block";
    }, 300)
  }
})