var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  dateCode: "",
  noteList: [],
  openId: "",
  accountType: "",
  priseList: []
}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {
    //微信授权登录
    wxOauth() {
      var _self = this;
      var code = tempJson.code ? tempJson.code : '';
      var params = {
        code: code
      };
      Service.wxOauth('GET', params, (function callback(data) {
        console.log("=====数据：", data.data)
        if (data.code == 200) {
          window.localStorage.setItem("openId", data.data.openId);


        } else {
          window.localStorage.setItem("openId", "");
          window.location.href = "wxOath.html?redirectUrl=" + window.location.href;
        }
      }))
    },

    //获取今日码
    getDatecode() {
      var _self = this;
      var params = {};
      Service.getDatecode('GET', params, (function callback(data) {
        if (data.code == 200) {
          _self.dateCode = data.data;

        }
      }))
    },
    //获取消息列表
    getNotesList() {
      var _self = this;
      var params = {
        "pageNo": 1,
        "pageSize": 5,
        "type": 1 //消息类型（默认值：1），1：通知，2：提醒
      };
      Service.getNotesList('POST', JSON.stringify(params), (function callback(data) {
        console.log("=====数据：", data.data)
        if (data.code == 200) {
          _self.noteList = data.data.records;
          for (var i in _self.noteList) {
            _self.noteList[i].createDate = fn.formatTime(_self.noteList[i].createDate, 'Y-M-D')
          }

        }
      }))
    },
    //获取龙膜获奖信息列表
    getSaleActiveList() {
      var _self = this;
      var scrollFlag = true;
      var params = {
        "isPrize": "",
        "pageNo": 1,
        "pageSize": 9999,
        "phase": 2
      };
      Service.getSaleActiveList('POST', JSON.stringify(params), (function callback(data) {
        console.log("=====数据：", data.data)
        if (data.code == 200) {
          _self.priseList = data.data;
          for (var i in _self.priseList) {
            _self.priseList[i].saleDate = fn.formatTime(_self.priseList[i].saleDate, 'Y-M-D h:m')
            _self.priseList[i].id = fn.formatZero(_self.priseList[i].id, 4);
          }
          setTimeout(function () {
            document.getElementById("appContent").style.display = "block";
            //alert($('.scroll-box').offset().top)
            //alert(document.body.clientHeight)

            // var scrollH = 0;
            // $(document).scroll(function() {
            //     if ($('.scroll-box').offset().top > document.body.clientHeight) {
            //         scrollH = $('.scroll-box').offset().top - document.body.clientHeight + 120;
            //         if ($(document).scrollTop() >= scrollH && scrollFlag) {
            //            // alert(scrollH)
            //             scrollFlag = !scrollFlag
            //             $("div.scroll-box").myScroll({
            //                 speed: 20, //数值越大，速度越慢
            //                 rowHeight: 42 //li的高度
            //             });
            //         }
            //     } else {
            //         if ($(document).scrollTop() >= 70 && scrollFlag) {
            //             scrollFlag = !scrollFlag
            //             $("div.scroll-box").myScroll({
            //                 speed: 20, //数值越大，速度越慢
            //                 rowHeight: 42 //li的高度
            //             });
            //         }
            //     }

            // })


          }, 10)

          var scrollH = 0;
          $(document).scroll(function () {
            if ($('.scroll-box').offset().top > document.body.clientHeight) {
              scrollH = $('.scroll-box').offset().top - document.body.clientHeight + 120;
              if ($(document).scrollTop() >= scrollH && scrollFlag) {
                // alert(scrollH)
                scrollFlag = !scrollFlag
                setTimeout(function () {
                  $("div.scroll-box").myScroll({
                    speed: 20, //数值越大，速度越慢
                    rowHeight: 42 //li的高度
                  });
                }, 800)

              }
            } else {
              if ($(document).scrollTop() >= 70 && scrollFlag) {
                scrollFlag = !scrollFlag
                $("div.scroll-box").myScroll({
                  speed: 20, //数值越大，速度越慢
                  rowHeight: 42 //li的高度
                });
              }
            }

          })
        }
      }))
    },

    //获取门店类型
    getCheckShopType() {
      var _self = this;
      var params = {};
      Service.getCheckShopType('GET', params, (function callback(data) {
        console.log("=====数据：", data.data)
        if (data.code == 200) {
          if (data.data == 102) { //102：认证门店 100：协作门店 101：服务门店
            window.location.href = "coatList.html";
          } else {
            fn.showTip('只有认证门店才有此权限哦~');
          }
        }
      }))
    },
    //跳转权益服务
    toBuyService() {
      window.location.href = "rightService.html";
    },
    //跳转订单中心
    toOrder() {
      window.location.href = "orderList.html";
    },
    //跳转会员中心
    toMember() {
      window.location.href = "queryMember.html";
    },
    //跳转查勘定损
    toSurvey() {
      window.location.href = "surveyList.html?searchType=1";
    },
    //跳转消息中心
    toAnnonce() {
      window.location.href = "annonce.html";
    },
    //跳转详情页
    toDetail(e) {
      window.location.href = "annonceDetail.html?id=" + e;
    },
    //跳转玻璃查询
    toQueryGlass() {
      window.location.href = "glassQuery.html";
    },
    //跳转镀膜补贴
    toCoatList() {
      this.getCheckShopType();

    },
    //跳转认证申请
    toShopQualCert() {
      window.location.href = "shopQualApply.html";
    },
    //跳转我的门店
    toShop() {
      window.location.href = "shop.html";
    },
	//跳转玻璃修复
	toglassave(){
		 window.location.href = "glassave.html";
	},
    //跳转添加店员页面
    toShopUser() {
      window.location.href = "shopUserManager.html";
    },
    //跳转最新活动页面
    toActive() {
      window.location.href = "activeList.html";
    },
    //跳转销售单列表页面
    toSale() {
      //window.location.href = "saleMenu.html"; 
      window.location.href = "saleList.html";
    },

    //跳转销售单开单页面
    toAddSale() {
      window.location.href = "saleAdd.html";
    },

    //跳转结算管理页面
    toQuality() {
      window.location.href = "qualityQuery.html";
    },
    toQuality1() {
      window.location.href = "shopsop.html";
    },
    toGuidance() {
      window.location.href = "shopGuidance.html";
    },
    //跳转结算管理页面
    toSettle() {
      window.location.href = "settleSel.html";
    },

    //获奖详情页
    toPrise() {
      window.location.href = "prise.html?v=1";
    },
    // 保险查勘
    toRepair() {
      window.location.href = "surveyList.html?searchType=2";
    },
	
	
	
	// 跳转结算单位
	tojiesuan(){
		window.location.href = "unilist.html";
	},
	// 跳转转账证明
	toprove(i){
		if(i == 1){
			window.location.href = "provelist.html";
		}else{
			window.location.href = "provelisttwo.html";
		}
	},
	//跳转结算管理页面
	toSettletwo(){
	    window.location.href = "chargeIngtwo.html";
	}
  },
  mounted: function () {
    this.accountType = userInfo.accountType ? userInfo.accountType : 0;
    if (this.accountType == 4) {
      window.location.href = "setManage.html";
    }
    if (this.accountType > 100 || this.accountType == 7) {
      window.location.href = "claimIndex.html";
    }
    var _self = this;
    // this.wxOauth();
    // window.localStorage.clear();
    this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
    this.getDatecode();
    this.getNotesList();
    this.getSaleActiveList();

    //fn.showTip(this.openId)
    //fn.showTip(window.localStorage.getItem("openId"));
    //初始化vue后,显示vue模板布局
    // setTimeout(function() {

    //     document.getElementById("appContent").style.display = "block";

    // }, 300)
  }
})