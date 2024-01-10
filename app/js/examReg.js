var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    openId: '',
    shopInfo: {},
    shopPersonList: [],
    personId: "",
    subjectId: "",
    examInfo: {},
    examVOList: [],
    currentDate: '',
    cerName: "",
    cerGrade: ""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取门店认证信息
        getShopAuditDetail() {
            var _self = this;
            var params = {};
            Service.getShopAuditDetail('GET', params, (function callback(data) {
                if (data.code == 200) {
                    document.getElementById("appContent").style.display = "block";
                    _self.shopInfo = data.data;
                    _self.shopPersonList = data.data.shopPersonList;
                    _self.currentDate = fn.formatTime(data.tradeTime, 'Y-M-D');
                }
            }))
        },

        //切换店员
        cngPerson(e) {
            for (var i in this.shopPersonList) {
                if (this.shopPersonList[i].personId == e) {
                    if (this.shopPersonList[i].cerTificates.length) {
                        this.cerName = this.shopPersonList[i].cerTificates[0].name;
                        this.cerGrade = this.shopPersonList[i].cerTificates[0].grade
                    } else {
                        this.cerName = "";
                        this.cerGrade = ""
                    }
                }
            }
        },

        //去考试 
        toExam() {
            if (!this.personId) {
                fn.showTip("请选择店员！");
                return false;
            }
            if (this.currentDate >= this.examInfo.startTime && this.currentDate <= this.examInfo.endTime) {
                if (this.examVOList.length) {
                    for (var i in this.examVOList) {
                        if (this.personId == this.examVOList[i].personId && this.examVOList[i].isPass) {
                            fn.showTip("您选择的店员已经通过考核，请重新选择！");
                            return false;
                        }
                    }
                }
                window.location.href = "exam.html?id=" + this.subjectId + "&personId=" + this.personId;
            } else {
                fn.showTip('不在考试测评时间范围内！')
            }
        },
        // 认证级别
        toLevel() {
            let _self = this
            var cityPicker = new mui.PopPicker({
                layer: 1
            });

            cityPicker.setData([{
                value: 0,
                text: "A类认证"
            },

            ]);
            cityPicker.show(function (items) {
                $("#choose-level").text(items[0].text);
                _self.shopInfo.level = items[0].value;
            });
        },
    },
    created() {
        fn.routeQuery(tempJson)
    },
    mounted: function () {
        var _self = this;
        this.getShopAuditDetail();
        this.examInfo = JSON.parse(tempJson.examInfo.split("?")[0]) ? JSON.parse(tempJson.examInfo.split("?")[0]) : {}
        this.examVOList = this.examInfo.examVOList ? this.examInfo.examVOList : [];
        this.subjectId = this.examInfo.subjectId ? this.examInfo.subjectId : '';
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        //初始化vue后,显示vue模板布局
        setTimeout(function () {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})