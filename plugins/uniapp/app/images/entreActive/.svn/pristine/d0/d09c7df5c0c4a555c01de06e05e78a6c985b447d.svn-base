var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo = { token: "" };
var data = {
    feedBackType: "",
    shopList: []
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        getShoplist() {
            const that = this
            let params = {
                "pageNo": 1,
                "pageSize": 999
            }
            Service.getExcellentShopList('POST', JSON.stringify(params), (function callback(data) {
                if (data.code === 200) {
                    that.shopList = data.data
                }
            }))
        },
        toDetail(item) {
            window.location.href = "shopDetail.html?id=" + item.id
        },

    },
    mounted: function () {
        this.getShoplist()
    }
})