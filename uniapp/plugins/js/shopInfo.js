var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
  shopInfo : {}
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取数据
        getShopDetail(){
            var _self = this;
            var params = {};
            Service.getShopDetail('GET',params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                  _self.shopInfo = data.data;  
                }
            }))
        },
        //跳转编辑门店页面
        editShopInfo(){
            window.location.href="editShopInfo.html";
        },
        //跳转修改密码页面
        changePwd(){
            window.location.href="resetPwd.html";
        },
        //注销用户
        logout(){
            var params = {
                token: userInfo.token
            }
            Service.logout('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    //window.localStorage.clear();
                    window.localStorage.setItem("userInfo", "");
                    window.location.href="login.html";
                }
            }))
        }
        

    },
    mounted: function() {
        var _self = this;
        this.getShopDetail();
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})