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
			let reg = /^[A-Za-z0-9]{6}$/  //车牌号正则
			let phon =/^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/
			_self.form.carNo= _self.car + _self.nosdat
			if(!reg.test(_self.nosdat)){
				Service.showTip("车牌号填写错误")
				return false
			}else if(_self.form.orderNo == ''){
				Service.showTip("保险工单不能为空")
				return false
			}else if(_self.form.vin == ''){
				Service.showTip("车架号不能为空")
				return false
			}else if(!phon.test(_self.form.phoneNumber)){
				Service.showTip("手机号填写错误")
				return false
			}else{
				Service.ifablesend('get',_self.form,(function callback(data) {
			    if (data.code == 200) {
					 _self.infodata=data.data
					 _self.menchen=true
			    }
			
			}))
			}
		},
		gopage(){
			window.location.href = "application.html";
		},
		// 申请权益
		checkling(){
			//this.form.openId= openId:window.localStorage.getItem("openId")
			this.form.openId= "openId"
			console.log(this.form)
			Service.applyCertificate('post',JSON.stringify(this.form),(function callback(data) {
			    if (data.code == 200) {
					window.location.href = "application.html";
			    }
			
			}))
		}

    },
    mounted: function() {
        //alert(fn.versions.ios)
        var _self = this;
        //初始化vue后,显示vue模板布局
        // setTimeout(function() {
        //     document.getElementById("appContent").style.display = "block";

        // }, 300)
    },
	watch:{
		loco(val){
			alert(val)
		}
	}
})