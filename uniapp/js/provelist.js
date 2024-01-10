var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  	 form:{
  	 	  img:['','']
  	 }
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
		auditor(e){
			if(e == 0){
				return '待审核'
			}else if(e == 1){
				return '已通过'
			}else if(e == 2){
				return "不通过"
			}
		},
	  getlist(){
		  let that=this
		  let obj={
			  type:1
		  }
	  Service.provelist('get',obj, (function callback(res) {
			that.form=res.data
				console.log(that.form)
			if(res.data){
				that.form.img=res.data.img.split(',')
			}else{
				that.form={
					type:1,
					img:['','']
				}
			}
		
	 }))
	  },
	  downlode(){
		  window.open('https://img.edows.cn/public.docx')
	  },
	  authority(){
		if (navigator.userAgent.indexOf("Android") !== -1) { 
		  $('.authority_mask').css('display','block');
		}
	  },
	  hideAuthorityMask(){
		$('.authority_mask').css('display','none');
	  },
	 //上传图片
	 btnUploadFile(index, type) {
		$('.authority_mask').css('display','none');
	     $('.active-user').eq(index).find(".noPass").hide();
	     var _self = this;
	     let evt = window.event || e;
	     let el = evt.currentTarget || evt.srcElement;
	     //获取图片文件
	     var imgFile = el.files[0];
	     //异步读取文件
	     var reader = new FileReader();
	     reader.onloadstart = function(e) {
	         console.log("开始读取....");
	     }
	     reader.onprogress = function(e) {
	         console.log("正在读取中....");
	     }
	     reader.onabort = function(e) {
	         console.log("中断读取....");
	     }
	     reader.onerror = function(e) {
	         console.log("读取异常....");
	     }
	     reader.onload = async(evt) => {
	         //替换url
	         if (imgFile.size / 1024 > 1024 * 1.2) {
	             fn.dealImage(evt.target.result, {
	                 quality: 0.6
	             }, function(base64Codes) {
	                 var params = {
	                     base64Data: base64Codes,
	                     bizType: 101
	                 }
	                 Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
	                     if (data.code == 200) {
	                         $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
							 _self.form.img[index]= data.data.webPath
	                     }
	                 }))
	             });
	         } else {
	             var params = {
	                 base64Data: evt.target.result,
	                 bizType: 101
	             }
	             Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
	                 if (data.code == 200) {
	                     $('.upLoadImgs').eq(index).find(".picFullcar").attr("src", data.data.webPath);
						 _self.form.img[index]= data.data.webPath
	                 }
	             }))
	         }
	     }
	     reader.readAsDataURL(imgFile);
	 },
	 gosub(){
		 let that=this
		 if(this.form.img[0] == '' && this.form.img[1] == ''){
			 fn.showTip("请上传证明")
		 }else{
			 this.form.img=this.form.img.toString()
			 Service.provelistupdata('POST', JSON.stringify(this.form), (function callback(data) {
	                 if (data.code == 200) {
	                     fn.showTip("上传成功")
						 that.getlist()
	                 }
	             }))
		 }
		
	 }
  },
  mounted: function () {
  		this.getlist()
  }
})