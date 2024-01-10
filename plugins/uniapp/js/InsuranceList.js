var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  openId: "",
  totalPage: 1,
  usedlist: [],
  nouselist: [],
  Invalid: [],
  nosedShow: true,
  usedShow: false,
  invalidShow: false,
  stem1: true,
  stem2: false,
  showNav: false,
  isShow: false,
  subFlag: true,
  info: {},
  provSelected: "京",
  carNo: "",
  mobile: "",
  vin: "",
  provList: [{
      code: '京',
      province: '北京'
    },
    {
      code: '津',
      province: '天津'
    },
    {
      code: '沪',
      province: '上海'
    },
    {
      code: '渝',
      province: '重庆'
    },
    {
      code: '冀',
      province: '河北'
    },
    {
      code: '豫',
      province: '河南'
    },

    {
      code: '云',
      province: '云南'
    },
    {
      code: '辽',
      province: '辽宁'
    },
    {
      code: '黑',
      province: '黑龙江'
    },
    {
      code: '湘',
      province: '湖南'
    },
    {
      code: '皖',
      province: '安徽'
    },
    {
      code: '鲁',
      province: '山东'
    },

    {
      code: '新',
      province: '新疆'
    },
    {
      code: '苏',
      province: '江苏'
    },
    {
      code: '浙',
      province: '浙江'
    },
    {
      code: '赣',
      province: '江西'
    },
    {
      code: '鄂',
      province: '湖北'
    },
    {
      code: '桂',
      province: '广西'
    },

    {
      code: '甘',
      province: '甘肃'
    },
    {
      code: '晋',
      province: '山西'
    },
    {
      code: '蒙',
      province: '内蒙古'
    },
    {
      code: '陕',
      province: '陕西'
    },
    {
      code: '吉',
      province: '吉林'
    },
    {
      code: '闽',
      province: '福建'
    },
    {
      code: '贵',
      province: '贵州'
    },
    {
      code: '粤',
      province: '广东'
    },
    {
      code: '青',
      province: '青海'
    },
    {
      code: '藏',
      province: '西藏'
    },
    {
      code: '川',
      province: '四川'
    },
    {
      code: '宁',
      province: '宁夏'
    },
    {
      code: '琼',
      province: '海南'
    },
    {
      code: '使',
      province: '大使馆'
    },
    {
      code: '领',
      province: '领士馆'
    }
  ],
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {
    used() {
      this.nosedShow = false
      this.usedShow = true
      this.invalidShow = false
    },
    nouse() {
      this.nosedShow = true
      this.usedShow = false
      this.invalidShow = false
    },
    invalid() {
      this.nosedShow = false
      this.usedShow = false
      this.invalidShow = true
    },
    //获取荣誉信息
    getDataList() {
      var _self = this;
      var params = {
        openId: this.openId,
      }
      Service.myRight('GET', params, (function callback(data) {
        console.log("=====数据：", data)
        if (data.code == 200 && data.data.length > 0) {
          _self.stem1 = true
          _self.stem2 = false
          let data1 = [],
            data2 = []
            data.data.map(item => {
            if (item.canUse == 1) {
              data1.push(item)
            } else {
              data2.push(item)
            }
          })
          _self.nouselist = data1
          _self.usedlist = data2
          _self.Invalid = []

        } else {
          fn.showTip("暂无权益信息，请先领取");
          _self.stem1 = false
          _self.stem2 = true
        }
      }))
    },
    //小写转大写
    toUpperCase(e) {
      this.carNo = e.toUpperCase();
    },
    //判断信息
    chackInfo() {
      if (!this.carNo) {
        fn.showTip("请输入车牌号码");
        return false;
      }

      if (!this.mobile) {
        fn.showTip("联系电话不能为空");
        return false;
      }
      if (!fn.testRule.isTel(this.mobile)) {
        fn.showTip("请正确输入联系电话");
        return false;
      }
      if (!this.vin) {
        fn.showTip("请选择服务类型");
        return false;
      }
      return true;
    },
    add() {
      if (!this.chackInfo()) {
        return false;
      }
      var _self = this;

      var params = {
        carNo: this.provSelected + this.carNo,
        mobile: this.mobile,
        openId: this.openId, //this.openId,
        vin: this.vin
      }

      if (_self.subFlag) {
        _self.subFlag = false;
        Service.userCheck('POST', JSON.stringify(params), (function callback(data) {
          if (data.code == 200) {
            _self.subFlag = true;
            fn.showTip("提交成功");
            setTimeout(() => {
              _self.stem1 = true
              _self.stem2 = false
            }, 2000)
          }
        }))
        setTimeout(function () {
          _self.subFlag = true;
        }, 3000)
      }
    },
    receive() {
      window.location.href = "InsuranceReceive.html"
    }
  },
  mounted: function () {
    var _self = this;
    this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
    // fn.showTip(this.openId);
    this.getDataList()
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  }
})