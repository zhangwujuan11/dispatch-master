var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    singleFlag: true,
    sexFlag: true,
    memberInfo: {
        bankName: "",
        bankNo: "",
        companyAddress : "",
        email : "",
        settlementId : "",
        nsrsbh : "",
        settlementName : "",
        telephone : "",
        settletmentMethod : 0
    }
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

        //单选筛选
        sinFlagTrue() {
            this.singleFlag = true;
            this.memberInfo.settletmentMethod  = 0;
        },
        sinFlagFalse() {
            this.singleFlag = false;
            this.memberInfo.settletmentMethod = 1;
        },

        //判断信息
        chackInfo() {
            if (!this.memberInfo.settlementName ) {
                fn.showTip("结算单位名称不能为空");
                return false;
            }
            if (!this.memberInfo.nsrsbh) {
                fn.showTip("纳税人识别号不能为空");
                return false;
            }
            if (!this.memberInfo.telephone) {
                fn.showTip("联系方式不能为空");
                return false;
            }
            if (!fn.testRule.isTel(this.memberInfo.telephone)) {
                fn.showTip("请正确输入联系方式");
                return false;
            }

            return true;
        },
        //确定编辑
        updateMember() {
            if (!this.chackInfo()) {
                return false;
            }
            var returnUrl = tempJson.returnUrl ? tempJson.returnUrl : '';
            var params = this.memberInfo;
            Service.editShopSettle('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    console.log(data.data);
                    fn.showTip("保存成功", "unitCharge.html");
                    // if (returnUrl) {
                    //     fn.showTip("保存成功", returnUrl);
                    // } else {
                    //     fn.showTip("保存成功", "unitCharge.html");
                    // }

                }
            }))
        }

    },
    mounted: function() {
        //alert(fn.versions.ios)
        var _self = this;
        var settlementId = tempJson.realId ? tempJson.realId : "";
        if (settlementId) {
            var params = {
                settlementId: settlementId
            }
            Service.getShopSettleDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.memberInfo = data.data;
                  
                    if (_self.memberInfo.settletmentMethod == 0) {
                        _self.singleFlag = true
                    } else {
                        _self.singleFlag = false
                    }
                   

                }
            }))
        }


        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";

        }, 300)
    }
})