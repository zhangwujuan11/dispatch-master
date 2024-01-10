var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    password: "",
    rePassword:''
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        

      

        //判断信息
        chackInfo() {
            if (!this.password) {
                fn.showTip("新密码不能为空");
                return false;
            }
            if (!this.rePassword) {
                fn.showTip("确认新密码不能为空");
                return false;
            }
            if (this.password != this.rePassword) {
                fn.showTip("再次输入的密码不一致");
                return false;
            }
            
            return true;
        },
        changePassword(){
            if (!this.chackInfo()) {
                return false;
            }
            var params = {
                 "password": this.password,
                 "password1": this.rePassword
            }
            Service.changePassword('POST', JSON.stringify(params), (function callback(data) {
                //console.log("数据：", data)
                if (data.code == 200) {
                    fn.showTip("更改成功","shopInfo.html")
                }
            }))
        }
       

    },
    mounted: function() {
        var _self = this;
        

        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)


    }
})