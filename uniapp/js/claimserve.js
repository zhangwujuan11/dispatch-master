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
		chekfobuy(){
			let flag=/^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/
			if(this.form.mobile == '' || this.form.mobile == null){
				
				 fn.showTip("请选输入手机号");
				 return false
			}else if(!flag.test(this.form.mobile)){
				fn.showTip("手机格式不正确");
			}else{
				this.menchen=true	
			}
		},
		
		
		// 申请权益
		checkling(){
			if(tempJson.havesn){
				let objs={
					"openId":window.localStorage.getItem("openId"),//正式
					"orderSn": tempJson.havesn, 
					"payType": "JSAPI" 
				}
				Service.gopay('post',JSON.stringify(objs),(function callback(ress) {
					WeixinJSBridge.invoke('getBrandWCPayRequest', {
					        "appId":ress.data.appId, //公众号名称,由商户传入     
					        "timeStamp":ress.data.timeStamp, //时间戳,自1970年以来的秒数     
					        "nonceStr":ress.data.nonceStr, //随机串     
					        "package":ress.data.packageValue,
					        "paySign":ress.data.paySign ,//微信签名 
							"signType": ress.data.signType, //微信签名方式：   
					    },
					    function(res) {
					        if (res.err_msg == "get_brand_wcpay_request:ok") {
					            fn.showTip('支付成功', 'myrights.html');
					            //支付成功后跳转的页面
					        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
					            fn.showTip('支付取消');
					        } else if (res.err_msg == "get_brand_wcpay_request:fail") {
					            fn.showTip('支付失败');
					            WeixinJSBridge.call('closeWindow');
					        } //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok,但并不保证它绝对可靠。
					    });
				}))
			}else{
				let params={
					"rightCardId":tempJson.cardId, 
					"openId":window.localStorage.getItem("openId"),//正式
					"orderId":this.form.id,
					"mobile":this.form.mobile
				}
				Service.buyvipserve('post',JSON.stringify(params),(function callback(data) {
				    if (data.code == 200) {
						console.log(data)
						let obj={
							"openId":window.localStorage.getItem("openId"),//正式
							"orderSn": data.data, 
							"payType": "JSAPI" 
						}
						Service.gopay('post',JSON.stringify(obj),(function callback(ress) {
							WeixinJSBridge.invoke('getBrandWCPayRequest', {
							        "appId":ress.data.appId, //公众号名称,由商户传入     
							        "timeStamp":ress.data.timeStamp, //时间戳,自1970年以来的秒数     
							        "nonceStr":ress.data.nonceStr, //随机串     
							        "package":ress.data.packageValue,
							        "paySign":ress.data.paySign ,//微信签名 
									"signType": ress.data.signType, //微信签名方式：   
							    },
							    function(res) {
							        if (res.err_msg == "get_brand_wcpay_request:ok") {
							
							            fn.showTip('支付成功', 'cardOrderList.html');
							            //支付成功后跳转的页面
							        } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
							            fn.showTip('支付取消');
							        } else if (res.err_msg == "get_brand_wcpay_request:fail") {
							            fn.showTip('支付失败');
							            WeixinJSBridge.call('closeWindow');
							        } //使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok,但并不保证它绝对可靠。
							    });
						}))
					}
				}))
			}
		},
    },
    mounted: function() {
        var _self = this;
		
		
		if(tempJson.havesn){
			let objs = {
			        "orderSn": tempJson.havesn, 
			        "openId":window.localStorage.getItem("openId")//正式
			    }
			Service.getorders('get', objs, (function callback(data) {
			    if (data.code == 200) {
			       _self.form=data.data
				    _self.form.mobile=''
			    }
			}))
			
		}else{
			let obj = {
			        carNo: tempJson.carNo,
			        "openId":window.localStorage.getItem("openId")//正式
			    }
			Service.queryserve('POST', JSON.stringify(obj), (function callback(data) {
			    if (data.code == 200) {
			       _self.form=data.data
				    _self.form.mobile=''
			    }
			}))
		}
		
		
		
		
		
		
		
		
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 500)
    },
})