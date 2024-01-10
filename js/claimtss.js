var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var vm = new Vue({
    el: '#app',
   data(){
	  return {
		  menchen:false,
		  tst:'',
		  loco:'1',
		  optionlist:["京","沪","浙","苏","粤","鲁","晋","冀",
		      "豫","川","渝","辽","吉","黑","皖","鄂",
		      "津","贵","云","桂","琼","青","新","藏",
		      "蒙","宁","甘","陕","赣","湘",'闽'],
		  	form:{},
			car:'闽',
			nosdat:'',
			infodata:{}
	  } 
   },
    methods: {
		
		// 确认领取
		slose(){
			let _self = this;
			// 临时数据
			// _self.nosdat="B946LL"
			// _self.form={
			// 	carNo:'粤B946LL',
			// 	orderNo:'LP20230513000129',
			// 	vin:'LFV3A23C3B3810583',
			// 	phoneNumber:18589067542
			// }
			// let reg = /^[A-Za-z0-9]{6}$/  //车牌号正则
			let phon =/^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/
			_self.form.carNo= _self.car + _self.nosdat
			// if(_self.form.orderNo == ''){
			// 	Service.showTip("保险工单不能为空")
			// 	return false
			// }else if(!reg.test(_self.nosdat)){
			// 	Service.showTip("车牌号填写错误")
			// 	return false}else 
			if(!phon.test(_self.form.phoneNumber) && _self.form.phoneNumber == null){
				Service.showTip("手机号填写错误")
				return false
			}else{
			 _self.menchen=true
			}
		},
		gopage(){
			window.location.href = "application.html";
		},
		// 申请权益
		checkling(){
			
			
			// $.ajax({
			//     url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=ACCESS_TOKEN',
			//     type: 'post',
			// 	contentType: "application/json;charset-UTF-8",
			// 	dataType: "json",
			//     data: {
			// 		 "touser":window.localStorage.getItem("openId"),
			// 		   "template_id":"r0oeQuMmMbyhyEFkI2yT0NwS-5BQCYiedFlBomKQnAE",
			// 		   "url":"https://api2.edows.cn/api2/myrights.html",  
			// 		   "data":{
			// 				   "keyword1":{
			// 					   "value":"巧克力"
			// 				   },
			// 				   "keyword2": {
			// 					   "value":"39.8元"
			// 				   },
			// 				   "keyword3": {
			// 					   "value":"2014年9月22日"
			// 				   }
			// 		   }
			// 	}
			//   }).done(function (data) {
			// 	  alert(data)
			//   })
			// window.open("https://mp.weixin.qq.com/mp/subscribemsg?action=get_confirm&appid=wx01214aa68d5370c0&scene=1000&template_id=KOAamSTXbkI3v2L1aOtJKUQuGaQ1Xc-qXrlx1DR5ru4&redirect_url=https://api2.edows.cn/api2/application.html&reserved=test#wechat_redirect")
			
			
			// this.form.openId="oTx5O1IqGA-HevFbATi6L1IW4kqg",
			this.form.openId= window.localStorage.getItem("openId")
			Service.applyCertificate('post',JSON.stringify(this.form),(function callback(data) {
			    if (data.code == 200) {
					window.location.href = 'https://mp.weixin.qq.com/mp/subscribemsg?action=get_confirm&appid=wx01214aa68d5370c0&scene=1000&template_id=KOAamSTXbkI3v2L1aOtJKUQuGaQ1Xc-qXrlx1DR5ru4&redirect_url=https://api2.edows.cn/api2/application.html&reserved=test#wechat_redirect';
				}
			}))
		},
		// 保险工单失去焦点
		texblur(val){
			
			let _self = this;
			this.form.openId= window.localStorage.getItem("openId")
			console.log(_self.form)
			Service.ifablesend('get',this.form,(function callback(data) {
			    if (data.code == 200) {
					if(data.data.couponCode != ""){
						 window.location.href = "myrights.html";
					}else{
						let date=_self.form.orderNo
						_self.infodata=data.data
						_self.car=data.data.carNo.slice(0, 1)
						_self.nosdat=data.data.carNo.slice(1, 7)
						_self.form=data.data
						_self.form.orderNo=date
					}
			    }
			}))
		}

    },
    mounted: function() {
        //alert(fn.versions.ios)
        var _self = this;
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";

        }, 500)
    },
	watch:{
		loco(val){
			alert(val)
		}
	}
})