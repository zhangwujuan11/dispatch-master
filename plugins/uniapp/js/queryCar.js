var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    carList: [],
    arrWords: [],
    newCarList:[]
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        composeTree: function(list = []) {
            const data = JSON.parse(JSON.stringify(list)) // 深拷贝不改变源数据
            const result = []
            if (!Array.isArray(data)) {
                return result
            }
            data.forEach(item => {
                delete item.children
            })
            const map = {}
            data.forEach(item => {
                map[item.id] = item
            })
            data.forEach(item => {
                const parent = map[item.firstletter]
                if (parent) {
                    (parent.children || (parent.children = [])).push(item)
                } else {
                    result.push(item)
                }
            })
            return result
        }
    },
    mounted: function() {
        var _self = this;
        var params = {
            token: userInfo.token
        }
        Service.getBrandList('GET', params, (function callback(data) {
            console.log("=====数据：", data)
            if (data.code == 200) {
                _self.carList = data.data;
                if (data.data.length) {
                    var firstletter = []
                    for (var i = 0; i < data.data.length; i++) {
                        firstletter.push(data.data[i].firstletter)
                    }
                    _self.arrWords = fn.uniqArrs(firstletter);
                }
                console.log(_self.arrWords)
                // var tree = _self.composeTree(data.data);
                // console.log('树状结构：',tree)

               // let items = [];
                let datelist = {};
                for (let i = 0; i < data.data.length; i++) {
                    let element = data.data[i];
                    if (!datelist[element.firstletter]) {
                        _self.newCarList.push({
                            firstletter: element.firstletter,
                            subitems: [element]
                        })
                        datelist[element.firstletter] = element;
                    } else {
                        for (let j = 0; j < _self.newCarList.length; j++) {
                            let subment = _self.newCarList[j];
                            if (subment.firstletter == element.firstletter) {
                                subment.subitems.push(element)
                            }
                        }
                    }

                }
                console.log(_self.newCarList);

            }
        }))

        //初始化vue后,显示vue模板布局
        setTimeout(function() {

            document.getElementById("appContent").style.display = "block";
            $('body').on('click', '.letter a', function() {
                var s = $(this).html();
                $(window).scrollTop($('#' + s + '1').offset().top);
                // console.log($('#' + s + '1'));
                $("#showLetter span").html(s);
                $("#showLetter").show().delay(500).hide(0);
            });
            $('body').on('click', '.aui-flex', function() {
                var kw = tempJson.kw ? tempJson.kw : "";
                var cardId = tempJson.cardId ? tempJson.cardId : "";
                var returnUrl = tempJson.returnUrl ? tempJson.returnUrl : "";
                var drivingPic = tempJson.drivingPic ? tempJson.drivingPic : "";
                var memberInfo = tempJson.memberInfo ? tempJson.memberInfo : "";
                var backUrl = tempJson.backUrl ? tempJson.backUrl : "";
                window.location.href = "queryType.html?brandId=" +
                    $(this).attr('realId') +
                    "&kw=" + kw + "&returnUrl=" + returnUrl +
                    "&cardId=" + cardId +
                    "&backUrl=" + backUrl +
                    "&drivingPic=" + drivingPic +
                    "&memberInfo=" + memberInfo;
            })
        }, 300)

    }
})