var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);

var data = {
  tablelist:[],
  queryform:{
	  page:1,
	  limit:100000
  }
}

var vm = new Vue({
  el: '#app',
  data: data,
  filters:{
	settletmentType(e){
		if(e == 1){
			return "自开"
		}else{
			return "一级代开"
		}
	}
	
  },
  mounted: function () {
  		this.getlist()
  },
  methods: {
	  getlist(){
		  let that=this
		  Service.getulist('POST', JSON.stringify(this.queryform), (function callback(res) {
				that.tablelist=res.data
		 }))
	  },
	  adddata(){
		   window.location.href = "unilistadd.html";
	  },
	  // 修改
	  changedata(i){
		  window.location.href = "unilistadd.html?id=" + i.id;
	  },
	  // 删除
	  deteldaat(i){
		  let that=this
		  let obj={
			  id:i.id
		  }
		  Service.getulistdetel('POST', JSON.stringify(obj),  (function callback(res) {
		  		if(res.code == 200){
					 fn.showTip("删除成功")
					 Service.getulist('POST', JSON.stringify(this.queryform), (function callback(res) {
						that.tablelist=res.data
					}))
				}else{
					 fn.showTip(res.message)
				}
		  }))
	  }
	  
  }
  
})