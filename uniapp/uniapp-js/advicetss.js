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
			codeinfo:{}
		}
	},
    methods: {
        choose(i){
			if(i == "1"){
				this.choosedata="1"
				this.active=true
				this.active2=false
				this.active3=false
			}else if(i == '2'){
				this.choosedata="2"
				this.active=false
				this.active2=true
				this.active3=false
			}else if(i == '3'){
				this.choosedata="3"
				this.active=false
				this.active2=false
				this.active3=true
			}
			this.getdatalist()
		},
		
		// 获取我的权益列表
		getdatalist(){
			var _self = this;
			let params={
				openId:window.localStorage.getItem("openId"),//正式
				// openId:"oTx5O1I28MDb0w0jL30lWHJUoEX4",
				limit:1000,
				pageNo:1,
				status:Number(this.choosedata) 
			}
			Service.interestList('get', params, (function callback(data) {
			    if (data.code == 0) {
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
			_self.codeinfo=i
			if(i.status == 1){
				_self.closemenchen=true
				this.$nextTick(()=>{
					$("#Qrcode").qrcode({
						 render: 'table',
						 width: 200, //宽度 
						 height:200, //
						 text: i.couponCode,
						 typeNumber:-1,//计算模式
						 correctLevel:2,//二维码纠错级别
						foreground:"#000000"  //二维码颜色
						})
				})
			}else{
				_self.closemenchen=false
			}
			
		
			
		},
		closssemenchen(){
			this.closemenchen=false
		},
		// 领取权益
		gopage(){
			 window.location.href = "claim.html";
		}

    },
    mounted: function() {
		this.$nextTick(()=>{
			this.getdatalist()
		})
		setTimeout(function() {
		    document.getElementById("appContent").style.display = "block";
		}, 500)
		
    }
})