var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    pdlist: []
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取付款码信息
        getShopPayMethodList() {
            var _self = this;
            var params = {};
            Service.getShopPayMethodList('GET', params, (function callback(data) {
                if (data.code == 200) {

                    _self.pdlist = data.data;
                    document.getElementById("appContent").style.display = "block";
                }
            }))
        },
        //编辑付款码信息
        edit(e) {
            window.location.href = "codePayAdd.html?realId=" + e;
        },
        //新建付款码信息
        add() {

            window.location.href = "codePayAdd.html";
        },
        //删除付款码信息
        del(e) {
            var realId = e;
            var _self = this;
            fn.commonWindowSur('确定删除此付款码？')
            $('.commonBtn_suc').on('click', function() {
                var params = { payMethodId: realId }
                Service.delShopPayMethod('GET', params, (function callback(data) {
                    if (data.code == 200) {
                        //console.log(data.data);
                        $('.workInfo, .mark, ._loading').remove();
                        _self.getShopPayMethodList();
                        fn.showTip("删除成功");
                    }
                }))
            })
        },

    },
    mounted: function() {
        this.getShopPayMethodList();
    }
})