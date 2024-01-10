var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  form:{
	  bankName:'',
	  bankNo:'',
	  companyAddress:'',
	  email:'',
	  nsrsbh:'',
	  settlementName:'',
	  telephone:''
  }
}

var vm = new Vue({
  el: '#app',
  data: data,
  mounted: function () {
	  let that=this
	  if(tempJson.id){
		  let obg={
		   	id:tempJson.id
		   }
		    Service.getulistinfo('get',obg, (function callback(res) {
				that.form=res.data
		  }))
	  }
  },
  methods: {
	  goback(){
		   window.location.href = "unilist.html";
	  },
	  subforn(){
		  let that = this
		  if(!that.form.bankName){
			  mui.toast("开户行名称不能为空")
			  return false
		  }
		  if(!that.form.bankNo){
			  mui.toast("银行账户不能为空")
			  return false
		  }
		  if(!that.form.companyAddress){
			  mui.toast("企业地址不能为空")
			  return false
		  }
		  if(!that.form.nsrsbh){
			  mui.toast("纳税识别号不能为空")
			  return false
		  }
		  if(!that.form.telephone){
			  mui.toast("联系电话不能为空")
			  return false
		  }
		  if(tempJson.id){
			  Service.getulistupdata('POST', JSON.stringify(that.form), (function callback(res) {
			    if (res.code == 200) {
			 		mui.toast("修改成功")
					 setTimeout(() =>
						that.goback()
					 ,2000);
			    }else{
			 		mui.toast(res.message)
			 	 }
			 })) 
			  
		  }else{
			 Service.getulistadd('POST', JSON.stringify(that.form), (function callback(res) {
			    if (res.code == 200) {
			 		mui.toast("添加成功")
					 setTimeout(() =>
						that.goback()
					 ,2000);
			    }else{
			 			mui.toast(res.message)
			 	 }
			 })) 
		  }
	  }
  }
  
})