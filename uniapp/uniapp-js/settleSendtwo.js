var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    isShowMask: false,
    singleFlag: true,
    sexFlag: true,
    expressList: [],
    expressCompany: "",
    expressDate: "",
    expressImg: "",
    expressSn: "",
    settlementSn: "",
	senbuy:'快递'
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取快递信息
        getExpressList() {
            var _self = this;
            var params = {};
            Service.getExpressList('GET', params, (function callback(data) {
                if (data.code == 200) {
                    //console.log(data.data);
                    _self.expressList = data.data;

                }
            }))
        },

        //上传新版行驶证
        btnUploadDriveImg() {
            var _self = this;
            let evt = window.event || e;
            let el = evt.currentTarget || evt.srcElement;
            //获取图片文件
            var imgFile = el.files[0];

            //后缀选取
            // if (!/\/(?:jpeg|jpg|png|gif|JPG|PNG)/i.test(imgFile.type)) {
            //     console.log(图片格式不支持);
            //     return;
            // }
            //异步读取文件
            var reader = new FileReader();
            reader.onloadstart = function(e) {
                _self.isShowMask = true;
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
            //reader.readAsDataURL(imgFile);
            reader.onload = async(evt) => {
                if (imgFile.size / 1024 > 1024 * 1.2) {
                    fn.dealImage(evt.target.result, {
                        quality: 0.6
                    }, function(base64Codes) {
                        // console.log(base64Codes)
                        var params = {
                            base64Data: base64Codes,
                            bizType: 101
                        }
                        Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
                            //console.log("数据：", data)
                            if (data.code == 200) {
                                _self.expressImg = data.data.webPath;
                                _self.isShowMask = false;
                            }
                        }))
                    });
                } else {

                    var params = {
                        base64Data: evt.target.result,
                        bizType: 101
                    }
                    Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
                        //console.log("数据：", data)
                        if (data.code == 200) {
                            _self.expressImg = data.data.webPath;
                            _self.isShowMask = false;
                        }
                    }))

                }

                setTimeout(function() {
                    _self.isShowMask = false;
                }, 10000)
            }
            reader.readAsDataURL(imgFile);
        },
		btnUploadDriveImgtwo(){
			var _self = this;
			let evt = window.event || e;
			let el = evt.currentTarget || evt.srcElement;
			//获取图片文件
			var imgFile = el.files[0];
			
			//后缀选取
			// if (!/\/(?:jpeg|jpg|png|gif|JPG|PNG)/i.test(imgFile.type)) {
			//     console.log(图片格式不支持);
			//     return;
			// }
			//异步读取文件
			var reader = new FileReader();
			reader.onloadstart = function(e) {
			    _self.isShowMask = true;
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
			//reader.readAsDataURL(imgFile);
			reader.onload = async(evt) => {
			    if (imgFile.size / 1024 > 1024 * 1.2) {
			        fn.dealImage(evt.target.result, {
			            quality: 0.6
			        }, function(base64Codes) {
			            // console.log(base64Codes)
			            var params = {
			                base64Data: base64Codes,
			                bizType: 101
			            }
			            Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
			                //console.log("数据：", data)
			                if (data.code == 200) {
			                    _self.expressImg = data.data.webPath;
			                    _self.isShowMask = false;
			                }
			            }))
			        });
			    } else {
			
			        var params = {
			            base64Data: evt.target.result,
			            bizType: 101
			        }
			        Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
			            //console.log("数据：", data)
			            if (data.code == 200) {
			                _self.expressImg = data.data.webPath;
			                _self.isShowMask = false;
			            }
			        }))
			
			    }
			    setTimeout(function() {
			        _self.isShowMask = false;
			    }, 10000)
			}
			reader.readAsDataURL(imgFile);
		},
        //判断信息
        chackInfo() {
            if (!this.expressCompany) {
                fn.showTip("快递公司不能为空");
                return false;
            }
            if (!this.expressSn) {
                fn.showTip("快递单号不能为空");
                return false;
            }
            if (!this.expressDate) {
                fn.showTip("快递日期不能为空");
                return false;
            }
            if (!this.expressImg) {
                fn.showTip("快递凭据 不能为空");
                return false;
            }

            return true;
        },
        //确定编辑
        updateExpress() {
			if(this.senbuy == '快递'){
				if (!this.chackInfo()) {
				    return false;
				}
				var params = {
				    "expressCompany": this.expressCompany,
				    "expressDate": this.expressDate,
				    "expressImg": this.expressImg,
				    "expressSn": this.expressSn,
				    "settlementSn": this.settlementSn.split(',')
				};
				Service.expressOrderSettle('POST', JSON.stringify(params), (function callback(data) {
				    if (data.code == 200) {
				        console.log(data.data);
				        fn.showTip("提交成功", "chargeEndtwo.html");
				    }
				}))
			}else if(this.senbuy == '发票'){
				if (!this.expressImg) {
				    fn.showTip("快递凭据 不能为空");
				    return false;
				}else{
					var params = {
					    "expressImg": this.expressImg,
					    "expressSn": this.expressSn,
					    "settlementSn": this.settlementSn.split(',')
					};
					Service.expressOrderSettle('POST', JSON.stringify(params), (function callback(data) {
					    if (data.code == 200) {
					        console.log(data.data);
					        fn.showTip("提交成功", "chargeEndtwo.html");
					    }
					}))
				}
			}
           
        }

    },
    mounted: function() {
        //alert(fn.versions.ios)
        var _self = this;
        this.getExpressList();
        this.settlementSn = tempJson.realId ? tempJson.realId : "";
        this.expressDate = fn.formatTime(new Date().getTime(), 'Y-M-D');


        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";

        }, 300)
    },
	watch:{
		 senbuy(val){
			this.expressImg=''
		}
	}
})