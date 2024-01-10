var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
    el: "#app",
    data: {
        matchInfo:{},
        matchPics: [{
                name: "安装过程技师施工照",
                symType: "installProcessImg",
                remarks: "照片中需包含（日期码，经纬度、与地点日期）",
                imgurl: "images/match/1.jpg"
            },
            {
                name: "SUNLESS太阳膜商标",
                symType: "trademarkImg",
                remarks: "照片中需包含（日期码，经纬度、与地点日期）",
                imgurl: "images/match/2.jpg"
            },
            {
                name: "安装技师与车辆合照",
                symType: "finishImg",
                remarks: "照片中需包含（日期码，经纬度、与地点日期）",
                imgurl: "images/match/3.jpg"
            }
        ]
    },
    methods: {
        //获取详情
        getDetail() {
            var _self = this;
            var params = {
                id: tempJson.realId ? tempJson.realId : ""
            }
            Service.getCompetitionDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    document.getElementById("appContent").style.display = "block";
                    _self.matchInfo = data.data;
                    for(var i in _self.matchPics){
                        if(_self.matchPics[i].symType == "installProcessImg"){
                            _self.matchPics[i].matchUrl = _self.matchInfo.installProcessImg
                        }
                        if(_self.matchPics[i].symType == "trademarkImg"){
                            _self.matchPics[i].matchUrl = _self.matchInfo.trademarkImg
                        }
                        if(_self.matchPics[i].symType == "finishImg"){
                            _self.matchPics[i].matchUrl = _self.matchInfo.finishImg
                        }
                    }
                    
                }
            }))
        }

        
    },
    mounted: function() {
        var _self = this;
        this.getDetail();
        //初始化vue后,显示vue模板布局
        // setTimeout(function() {
        //     document.getElementById("appContent").style.display = "block";
        // }, 300)
    },

    computed: {


    }
});