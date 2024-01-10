var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);


var vm = new Vue({
    el: '#app',
	data() {
		return{
			active:true,
			active2:false,
			active3:false,
			datas:[],
			closemenchen:false,
			choosedata:'1',
			codeinfo:{},
			menchen:false,
			thisdatainfo:{},
			status:'',
			applyPhone:''
		}
	},
    methods: {
		
		// 获取我的权益列表
		getdatalist(){
				var _self = this;
				let params={
					pageSize:10000,
					pageNo:1,
					status:_self.status,
					applyPhone:_self.applyPhone
				}
				Service.glassavelist('post',JSON.stringify(params) , (function callback(data) {
				    if (data.code == 200) {
				      _self.datas=data.data
				    }
				}))
		},
		utf16to8(str) {
		    var out, i, len, c;
		    out = "";
		    len = str.length;
		    for (i = 0; i < len; i++) {
		        c = str.charCodeAt(i);
		        if ((c >= 0x0001) && (c <= 0x007F)) {
		            out += str.charAt(i);
		        } else if (c > 0x07FF) {
		            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
		            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
		            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		        } else {
		            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
		            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		        }
		    }
		    return out;
		},
		showercored(i){
			let _self = this;
			_self.closemenchen=true
			_self.thisdatainfo=i
		},
		closssemenchen(){
			this.closemenchen=false
		},
		// 领取权益
		gopage(i,e){
			if(e == 0){
				window.location.href = "glassorder.html?ticketId=" + i;
			}else{
				console.log("券已经失效了")
			}
		}
    },
    mounted() {
		var _self = this;
		 setTimeout(function() {
			document.getElementById("appContent").style.display = "block";
			_self.getdatalist()
		 }, 1000);
    }
})