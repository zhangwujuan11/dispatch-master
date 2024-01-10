var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    kw: "",
    memberInfo: {},
    dateCode: "",
    cardInfo: {},
    yearPrice: "",
    rcpLists: [],
    id: "",
    isMember: true
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //获取今日码
        getDatecode() {
            var _self = this;
            var params = {};
            Service.getDatecode('GET', params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.dateCode = data.data;
                }
            }))
        },
        //获取权益卡详情
        getData() {
            var _self = this;
            var params = { id: tempJson.cardId ? tempJson.cardId : "" };
            Service.getRightCardDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.cardInfo = data.data;
                    _self.rcpLists = data.data.rcpLists;
                    _self.rcpLists.sort(fn.sortBy('year'));
                }
            }))
        },

        //判断信息
        chackInfo() {
            if (!this.yearPrice) {
                fn.showTip("请选择保障期限");
                return false;
            }

            return true;
        },
        //新建勘验单
        add() {
            if (!this.chackInfo()) {
                return false;
            }
            //this.kw = tempJson.kw ? tempJson.kw : '';
            var _self = this;
            console.log(this.yearPrice)
            //var price = this.yearPrice.split(',')[1];
            //alert(parseInt(price))
            var params = {
                "dateCode": this.dateCode,
                "price": this.yearPrice.split(',')[1],
                "rightCardId": tempJson.cardId ? tempJson.cardId : '',
                "userId": this.id,
                "year": this.yearPrice.split(',')[0]
            }
            Service.createRightCard('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据===：", data)

                if (data.code == 200) {
                     window.location.href = "cardOrder.html?orderSn=" + data.data;
                     
                }

            }))

            
        },

        //新增会员信息
        addBuy() {
            //this.kw = tempJson.kw ? tempJson.kw : '';
            window.location.href = "cardDemand.html";
        }
    },
    mounted: function() {
        var _self = this;
        this.getDatecode();
        this.getData();
        var params = {
            kw: tempJson.kw ? tempJson.kw : "",
            type:1
        }
        Service.queryMember('POST', JSON.stringify(params), (function callback(data) {
            console.log("=====数据2：", data)

            document.getElementById("appContent").style.display = "block";
            if (data.code == 200) {
                if (data.data) {
                    _self.memberInfo = data.data;
                    _self.id = data.data.userSn;
                    _self.isMember = true;
                    if (_self.memberInfo.birthday) {
                        _self.memberInfo.birthday = fn.formatTime(_self.memberInfo.birthday, 'Y-M-D');
                    }

                    if (_self.memberInfo.rightsSta) {
                        _self.memberInfo.rightsSta = fn.formatTime(_self.memberInfo.rightsSta, 'Y-M-D');
                        _self.memberInfo.rightsEnd = fn.formatTime(_self.memberInfo.rightsEnd, 'Y-M-D');
                    }

                    if (_self.memberInfo.userRights) {
                        for (var i in _self.memberInfo.userRights) {
                            _self.memberInfo.userRights[i].startTime = fn.formatTime(_self.memberInfo.userRights[i].startTime, 'Y-M-D');
                            _self.memberInfo.userRights[i].endTime = fn.formatTime(_self.memberInfo.userRights[i].endTime, 'Y-M-D');
                        }
                    }
                    if (_self.memberInfo.useRecords) {
                        for (var i in _self.memberInfo.useRecords) {
                            _self.memberInfo.useRecords[i].useTime = fn.formatTime(_self.memberInfo.useRecords[i].useTime, 'Y-M-D');
                        }
                    }
                }
            } else {
                _self.isMember = false;

            }
        }))
        //初始化vue后,显示vue模板布局
        // setTimeout(function() {
        //     document.getElementById("appContent").style.display = "block";
        // }, 200)
    }
})