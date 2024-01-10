var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo = { token: "" };
var data = {
    feedBackType: "",
    shopData: { comment: '', prizeName: '', shopImgs: [], shopName: '' }
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        getShopDetails() {
            const that = this
            let params = {
                excellentShopId: tempJson.id ? tempJson.id : 0,
            }
            Service.getExcellentShopInfo('GET', params, (function callback(data) {
                if (data.code === 200) {
                    that.shopData = data.data
                }
            }))
        },

    },
    mounted: function () {
        this.getShopDetails()
        var swiper = new Swiper('.shop_swiper', {
            direction: 'horizontal',
            loop: true,
            observer: true,
            observeParents: true,
            pagination: {
                el: '.swiper-pagination',
            },
        });
    }
})