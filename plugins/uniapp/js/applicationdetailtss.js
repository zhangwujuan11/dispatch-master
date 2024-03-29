var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);


var vm = new Vue({
    el: '#app',
    data(){
    	  return {
    		 active:true,
    		 active2:false,
    		 active3:false,
    		 datainfo:{},
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
		getData(){
			let that=this
			let url = location.search; //获取url中"?"符后的字串
			    var theRequest = new Object();
			    if (url.indexOf("?") != -1) {
			        var str = url.substr(1);
			        strs = str.split("&");
			        for(var i = 0; i < strs.length; i ++) {
			            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			        }
					let obj={
						openId:window.localStorage.getItem("openId"),//正式
						// openId:"oTx5O1I28MDb0w0jL30lWHJUoEX4",
						id:theRequest.id
					}
					Service.appldetails('get',obj,(function callback(data) {
						    if (data.code == 200) {
								 that.datainfo=data.data
						    }
						
						}))
					
			    }
			
		}
    },
    mounted: function() {
        this.getData()
		setTimeout(function() {
		    document.getElementById("appContent").style.display = "block";
		}, 500)
    }
})