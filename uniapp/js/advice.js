var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
        feedBackType: "",
        content: "",
		phone:'',
		shopName:''
    }

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

        //选择意见类型
        cngType(){
            //this.feedBackType = e;
            console.log(this.feedBackType)
        },
        //返回首页
        backTo() {
            window.location.href = "index.html"
        },
        //判断信息
        chackInfo() {
            if (!this.feedBackType) {
                fn.showTip("意见类型不能为空");
                return false;
            }
            if (!this.content) {
                fn.showTip("反馈内容不能为空");
                return false;
            }
            
            return true;
        },
        //确定编辑
        addFeedBack() {
            var _self = this;
            if (!this.chackInfo()) {
                return false;
            }
            var params = {
                "feedBackType": this.feedBackType,
                "content": this.content,
				"shopName": this.shopName,
				"phone": this.phone,
				"openId":window.localStorage.getItem("openId")//正式
            }
            Service.addFeedBack('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    console.log(data.data);
                    _self.feedBackType = "",
                    _self.content ="",
                    fn.showTip("感谢您的反馈，我们会及时进行处理！");

                }
            }))
        }

    },
    mounted: function() {
        //alert(fn.versions.ios)
        var _self = this;
        var params = {
            kw: tempJson.kw ? tempJson.kw : ""
        }
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})