var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    annonceInfo: {},
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取详情
        getDetail() {
            var _self = this;
            var params = {
                id: tempJson.id ? tempJson.id : ""
            }
            Service.getNoteDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.annonceInfo = data.data;
                    _self.annonceInfo.createDate = fn.formatTime(_self.annonceInfo.createDate,"Y-M-D");
                    _self.annonceInfo.describe = _self.annonceInfo.describe ? fn.replaceStr(_self.annonceInfo.describe) : '暂无详情';
                   
                    setTimeout(function() {
                      var title = _self.annonceInfo.title,
                          //desc = _self.info.content ? fn.replaceStr(_self.info.content) : '暂无详情',
                          desc = $(".newsCont").text(),
                          link = window.location.href,
                          imgUrl = _self.annonceInfo.imagePath ? _self.annonceInfo.imagePath : WebHost +'images/logo.png';
                          desc = desc.replace(/<!--[^>]*-->/gi, "");
                          toShare(title, desc, link, imgUrl)
                  }, 30)
                }
            }))
        },

    },
    mounted: function() {
        this.getDetail();
        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 300)
    }
})