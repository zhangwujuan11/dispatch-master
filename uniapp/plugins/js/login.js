var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var returnUrl = tempJson.returnUrl ? tempJson.returnUrl : 'index.html';
var data = {
    agreeFlag: true,
    userName: "",
    password: "",
    openId : '',
    errMsg: ""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //是否同意
        cngAgree(){
            this.agreeFlag = !this.agreeFlag;
        },
        //去注册
        toReg(){
            window.location.href = "register.html";
        },
        //判断信息
        chackInfo() {
            if (!this.userName) {
                fn.showTip("登录账号不能为空");
                return false;
            }
            if (!this.password) {
                fn.showTip("密码不能为空");
                return false;
            }
            if (!this.agreeFlag) {
                fn.showTip("您还未阅读并同意此协议");
                return false;
            }
            return true;
        },
        //登录
        login() {
            if (!this.chackInfo()) {
                return false;
            }
            var params = {
                userName: this.userName,
                redirectUrl: "",
                openId : this.openId,
                password: this.password
            }
            // Service.login('POST', JSON.stringify(params), (function callback(data) {
            //     //console.log("数据：", data)
            //     if (data.code == 200) {
            //         storageUserInfo(data.data);
            //     }
            // }))

            $.ajax({
                    url: HOST + "member/login",
                    type: "POST",
                    data: JSON.stringify(params),
                    contentType: "application/json;charset-UTF-8",
                    dataType: "json"
                })
                .done(function(data) {
                    console.log(data)
                    if (data.code == 200) {
                        storageUserInfo(data.data);
                    } else {
                        fn.showTip(data.message);
                    }
                })

            // 存储cookie
            function storageUserInfo(data) {
                var token = data.token
                //console.log("token",token);
                var userInfo = {
                    token: token
                };

                if (window.localStorage) {
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                } else {
                    Cookie.write("userInfo", JSON.stringify(userInfo));
                }
                window.location.href = returnUrl;
            }
        }
    },
    computed: {

    },
    mounted: function() { //在这里写ajax方法。
        //fn.showTip(window.localStorage.getItem("openId"));
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})