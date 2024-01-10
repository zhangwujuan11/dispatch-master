//var HOST = "http://edows.txsofts.com/api/";

var HOST ="https://api.edows.cn/api/";
//var HOST = "http://192.168.199.159:8080/api/";
var Service = {
    /**
     * 用户登录接口
     * option 请求方式（post或者get）
     * params 请求参数
     * callback 回调   下面接口这三个参数的意义相同
     */
    login: function(option, params, callback) {
        var url = HOST + "member/login";
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 用户登出接口
     */
    logout: function(option, params, callback) {
        var url = HOST + "member/logout?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 微信授权API
     */
    autoSignature: function(option, params, callback) {
        var url = HOST + "wx/autoSignature";
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 微信授权登录
     */
    wxOauth: function(option, params, callback) {
        var url = HOST + "wx/oauth";
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 获取客户类型
     */
    getUserTypeList: function(option, params, callback) {
        var url = HOST + "userType/list?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 读取行驶证信息
     */
    readDrivingLicense: function(option, params, callback) {
        var url = HOST + "order/readDrivingLicense?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 获取所有车辆品牌
     */
    getBrandList: function(option, params, callback) {
        var url = HOST + "car/brand/list";
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 获取品牌下的车系
     */
    getCarSeriesList: function(option, params, callback) {
        var url = HOST + "car/series/list";
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 获取车系下的车型
     */
    getCarSeries: function(option, params, callback) {
        var url = HOST + "car/info/list";
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 获取订单列表 
     */
    getOrderList: function(option, params, callback) {
        var url = HOST + "order/list?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 获取订单详情
     */
    getOrderDetail: function(option, params, callback) {
        var url = HOST + "order/detail?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 开始订单提交审核 
     */
    updataOrder: function(option, params, callback) {
        var url = HOST + "order/edit?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 取消订单
     */
    cancelOrder: function(option, params, callback) {
        var url = HOST + "order/cancel?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 门店接单
     */
    orderRecevie: function(option, params, callback) {
        var url = HOST + "order/recevie?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 门店拒绝接单
     */
    orderRefuse: function(option, params, callback) {
        var url = HOST + "order/refuse?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 会员查询
     */
    queryMember: function(option, params, callback) {
        var url = HOST + "member/query?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 会员编辑
     */
    updateMember: function(option, params, callback) {
        var url = HOST + "member/updateUser?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },


    /**
     * 上传图片
     */
    uploadPic: function(option, params, callback) {
        var url = HOST + "order/upload?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 勘验单列表
     */
    getSurveyList: function(option, params, callback) {
        var url = HOST + "order/survey/list?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 勘验单详情
     */
    getSurveyDetail: function(option, params, callback) {
        var url = HOST + "order/survey/detail?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 新增勘验单
     */
    addSurvey: function(option, params, callback) {
        var url = HOST + "order/survey/add?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 更新勘验单
     */
    editSurvey: function(option, params, callback) {
        var url = HOST + "order/survey/edit?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 查询玻璃
     */
    queryGlass: function(option, params, callback) {
        var url = HOST + "glass/query?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },



    /**
     * 获取今日码
     */
    getDatecode: function(option, params, callback) {
        var url = HOST + "datecode/today?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 获取我的门店信息
     */
    getShopDetail: function(option, params, callback) {
        var url = HOST + "shop/detail?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 更新门店信息
     */
    editShop: function(option, params, callback) {
        var url = HOST + "shop/edit?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 修改密码
     */
    changePassword: function(option, params, callback) {
        var url = HOST + "shop/changePassword?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 意见反馈
     */
    addFeedBack: function(option, params, callback) {
        var url = HOST + "feedBack/add?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 店员列表展示
     */
    getShopPersonList: function(option, params, callback) {
        var url = HOST + "shopPerson/list?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 店员新增接口
     */
    addUpShopPersonList: function(option, params, callback) {
        var url = HOST + "shopPerson/add?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 店员详情接口
     */
    getShopPersonDetail: function(option, params, callback) {
        var url = HOST + "shopPerson/detail?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 删除店员接口
     */
    delShopPerson: function(option, params, callback) {
        var url = HOST + "shopPerson/delete?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 活动列表接口
     */
    getActiveList: function(option, params, callback) {
        var url = HOST + "activities/list?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 活动列表接口
     */
    getActiveDetail: function(option, params, callback) {
        var url = HOST + "activities/detail?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 活动用户列表接口
     */
    getActivePersonList: function(option, params, callback) {
        var url = HOST + "activities/personList?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 活动报名接口
     */
    joinActive: function(option, params, callback) {
        var url = HOST + "activities/join?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 取消报名接口
     */
    cancelActive: function(option, params, callback) {
        var url = HOST + "activities/cancel?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 消息列表
     */
    getNotesList: function(option, params, callback) {
        var url = HOST + "notes/list?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 消息详情
     */
    getNoteDetail: function(option, params, callback) {
        var url = HOST + "notes/getInfoById?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 店铺可售卖的权益卡列表
     */
    getRightCardList: function(option, params, callback) {
        var url = HOST + "rightCard/list?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 获取权益卡详情
     */
    getRightCardDetail: function(option, params, callback) {
        var url = HOST + "rightCard/detail?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 购买权益
     */
    createRightCard: function(option, params, callback) {
        var url = HOST + "rightCard/order/create?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 更新会员创建订单
     */
    addUserRightCardOrder: function(option, params, callback) {
        var url = HOST + "member/addUserOrder?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 权益卡订单列表
     */
    getRightCardOrderList: function(option, params, callback) {
        var url = HOST + "rightCard/order/list?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 权益卡订单详情
     */
    getRightCardOrderDetail: function(option, params, callback) {
        var url = HOST + "rightCard/order/detail?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 权益订单审核项处理
     */
    auditRightCardOrder: function(option, params, callback) {
        var url = HOST + "rightCard/order/audit?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 镀膜认证审核项列表
     */
    getPlatingOrderChekItemList: function(option, params, callback) {
        var url = HOST + "platingOrder/chekItemList?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 镀膜补贴申请
     */
    updatePlatingOrderApply: function(option, params, callback) {
        var url = HOST + "platingOrder/platingApply?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 镀膜申请列表
     */
    getPlatingOrderList: function(option, params, callback) {
        var url = HOST + "platingOrder/List?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    /**
     * 镀膜认证详情
     */
    getPlatingOrderDetail: function(option, params, callback) {
        var url = HOST + "platingOrder/detail?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },

    /**
     * 订单支付
     */
    payRightCard: function(option, params, callback) {
        var url = HOST + "rightCard/order/pay?token=" + userInfo.token;
        this.commonMethod(url, option, params, callback);
    },
    // 操作提示
    showTip: function(msg, url) {
        //console.log("url is "+ url) ;
        msg = msg || '出错啦，请稍后再试～';
        $('#tip-mes').html(msg);
        if (url) {
            $('#tip-box').show().delay(2000).hide(0);
            setTimeout(function() {
                window.location.href = url;
            }, 1000);
        } else {
            $('#tip-box').show().delay(2000).hide(0);
        }
    },
    commonMethod: function(url, option, params, callback) {
        $.ajax({
                url: url,
                type: option,
                data: params,
                contentType: "application/json;charset-UTF-8",
                dataType: "json",
                headers: { 'token': userInfo ? userInfo.token : "" },
            })
            .done(function(data) {
                if (data.code == 200) {
                    callback(data);
                } else if (data.code == 401) {
                    //跳转登录页面
                    setTimeout(function() {
                        console.log(">>>>>>" + window.location.href);
                        //window.localStorage.clear();
                        window.localStorage.setItem("userInfo", "");
                        window.location.href = "login.html?returnUrl=" + window.location.href;
                    }, 100);
                } else if (data.code == 406) {
                    //跳转登录页面
                    setTimeout(function() {
                        console.log(">>>>>>" + window.location.href);
                        //window.localStorage.clear();
                        window.localStorage.setItem("userInfo", "");
                        window.location.href = "login.html?returnUrl=" + window.location.href;
                    }, 100);
                } else {
                    callback(data);
                    fn.showTip(data.message);
                }
            })

    }
};
$(function() {
var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var code = tempJson.code ? tempJson.code : '';
//window.localStorage.setItem("openId", "oO8Dv01Y4SE7r9nLrLJ8U-el7Kzk");
// 微信登录授权开始
if (window.localStorage.getItem("openId")) {
} else {
    if (code) {
        var params = { code: code };
        console.log(params)
        
        $.ajax({
                url: HOST + "wx/oauth",
                type: "GET",
                data: params,
                contentType: "application/json;charset-UTF-8",
                dataType: "json"
            })
            .done(function(data) {
                console.log(data)
                if (data.code == 200) {
                    window.localStorage.setItem("openId", data.data.openId);
                } else {
                    window.location.href = "wxOath.html?redirectUrl=" + window.location.href;
                }
            })
    } else {
        window.location.href = "wxOath.html?redirectUrl=" + window.location.href;
    }
}
// 微信登录授权结束
});