var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  kw: "",
  memberInfo: {},
  useRecords: [],
  userRights: []
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {
    //新建勘验单
    add(e) {
      this.kw = tempJson.kw ? tempJson.kw : '';
      if (e.name && e.mobile && e.bandType) {
        window.location.href = "insDetail.html?kw=" + this.kw;
      } else {
        fn.showTip('客户信息不全，请先补全', 'editMember.html?kw=' + this.kw + '&backUrl=insDetail.html?kw=' + this.kw);
      }

    },
    //编辑会员信息
    edit() {
      this.kw = tempJson.kw ? tempJson.kw : '';
      window.location.href = "editMember.html?kw=" + this.kw;
    },
  },
  mounted: function () {
    var _self = this;
    var params = {
      kw: tempJson.kw ? tempJson.kw : "",
      type: 2
    }
    Service.queryMember('POST', JSON.stringify(params), (function callback(data) {
      console.log("=====数据：", data.data)
      if (data.code == 200) {
        _self.memberInfo = data.data;
        _self.useRecords = _self.memberInfo.useRecords || [];
        _self.userRights = _self.memberInfo.userRights || []
        if (_self.memberInfo.birthday) {
          _self.memberInfo.birthday = fn.formatTime(_self.memberInfo.birthday, 'Y-M-D');
        }

        if (_self.memberInfo.rightsSta) {
          _self.memberInfo.rightsSta = fn.formatTime(_self.memberInfo.rightsSta, 'Y-M-D');
          _self.memberInfo.rightsEnd = fn.formatTime(_self.memberInfo.rightsEnd, 'Y-M-D');
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
      }
    }))
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)
  }
})