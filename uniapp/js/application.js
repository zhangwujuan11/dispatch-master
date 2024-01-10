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
    		 datainfo:{
    		 	title:'免费修复券',status:'1',juan:'CJA8911290125',time:'2023-06-03  21:32:56',phone:'12345678912',remarke:'2021-06-01 至 2025-08-01'
    		 },
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
				//openId= openId:window.localStorage.getItem("openId")
				openId:"openId21",
				pageNo:1,
				limit:1000
			}
			Service.applylist('get',obj,(function callback(data) {
				console.log(data)
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