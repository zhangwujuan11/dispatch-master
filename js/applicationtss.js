var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);


var vm = new Vue({
    el: '#app',
    data(){
    	  return {
    		 active:true,
    		 active2:false,
    		 active3:false,
    		 datas:[],
    		 datainfo:{},
    		 closemenchen:false,
    	  } 
    },
	filters:{
		status(e){
			if(e == 0){
				return '待审核'
			}else if(e == 1){
				return '审核通过'
			}else if(e == 2){
				return '审核不通过'
			}
			 
		}
	},
    methods: {
		// list
		getDatalist(){
			let that=this
			let obj={
				openId:window.localStorage.getItem("openId"),//正式
				// openId:"oTx5O1I28MDb0w0jL30lWHJUoEX4",
				pageNo:1,
				limit:1000
			}
			Service.applylist('get',obj,(function callback(data) {
				    if (data.code == 0) {
						 that.datas=data.data
				    }
				
				}))
		},
	
		// 详情
		godetail(i){
			 window.location.href = "applicationdetail.html?id=" + i;
		}

    },
    mounted: function() {
        this.getDatalist()
		setTimeout(function() {
		    document.getElementById("appContent").style.display = "block";
		}, 300)
    }
})