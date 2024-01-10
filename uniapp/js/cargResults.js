var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    classNative: 1,
    carList: [],
    carInfoList: [],
    carType: tempJson.carType ? tempJson.carType : "",
    parts: tempJson.parts ? tempJson.parts : "",
    yearType: tempJson.yearType ? tempJson.yearType : "",
    vinSearch: tempJson.vin ? tempJson.vin : "",
    navLists: [
        // {
        //     text: "生成采购单"
        // },
        {
            text: "生成销售单"
        }

    ],
    changeRed: 0,
    cargData: {},
    isShow: false,
    accountType: 0,
    cargValue: tempJson.carg
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        onIconSearch() {
            this.getVinQuery()
        },
        reds() {
            window.location.href = "saleAdd.html";
        },
        getVinQuery() {
            const that = this
            let params = {
                carg: that.cargValue
            }
            Service.cargQuery('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200 && Object.keys(data.data).length > 0) {
                    that.cargData = data.data;
                    that.isShow = false
                } else {
                    console.log(123);
                    that.isShow = true
                }
            }))
        },
    },
    mounted: function () {
        this.accountType = userInfo && userInfo.accountType ? userInfo.accountType : 0;
        this.getVinQuery()
    }
})