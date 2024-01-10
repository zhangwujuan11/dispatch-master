var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo = { token: "" };
var vm = new Vue({
    el: '#app',
    data() {
        return {
            showImgCode: false,
            token: userInfo.token ? userInfo.token : "",
            info: {},
            openId: '',
            isPremier: true,
            codePath: "",
            number: 0

        }
    },
    methods: {
        //获取详情
        getDetail() {
            var _self = this;
            this.codePath = HOST + "code3?openId=" + this.openId + "&flag=" + Math.random();
            var params = {
                voteId: tempJson.id ? tempJson.id : ""
            }
            Service.getVoteDetail('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    data.data.isCanVote = true;
                    _self.info = data.data;

                    document.getElementById("appContent").style.display = "block";
                    setTimeout(function() {
                        var title = _self.info.personName + '邀你来投票！',
                            //desc = _self.info.content ? fn.replaceStr(_self.info.content) : '暂无详情',
                            desc = _self.info.personIntro,
                            link = window.location.href,
                            imgUrl = _self.info.personImg ? _self.info.personImg : WebHost + 'images/logo.png';
                        toShare(title, desc, link, imgUrl)
                    }, 30)
                }
            }))
        },

        toShare() {
            fn.showTip('点击右上角分享！')
        },

        toBack() {
            window.location.href = "vote.html"
        },
        getCodeTree() {
            this.number = 0;
            $("#codeT3").unbind().bind("click");
            $(".zhezhao").remove();
            document.getElementById("codeSelect").options.length = 0;
            this.codePath = HOST + "code3?openId=" + this.openId + "&flag=" + Math.random();
        },

        getNodePosition(node) {
            var top = left = 0;
            while (node) {
                if (node.tagName) {
                    top = top + node.offsetTop;
                    left = left + node.offsetLeft;
                    node = node.offsetParent;
                } else {
                    node = node.parentNode;
                }
            }
            return [left, top];
        },
        //校验验证码
        cheakOutTree(e) {
            var txt = "";
            var _self = this;
            $("#codeSelect option").each(function() {
                var text = $(this).text();
                if (txt == "") {
                    txt = text;
                } else {
                    txt = txt + "," + text;
                }
            });
            console.log("txt：", txt);
            var paramsData = {
                "code": txt,
                "openId": _self.openId
            };
            Service.verifyImgCode('POST', JSON.stringify(paramsData), (function callback(data) {
                console.log("数据：", data);
                let obj = _self.info;
                if (data.code == 200) {
                    //延时一秒,模拟联网
                    var params = {
                        "voteId": e.voteId,
                        "openId": _self.openId
                    };

                    if (obj.isCanVote) {
                        // e.isCanVote = false;
                        obj.isCanVote = false;
                        //$('.vote-item').eq(index).find('.vote-opts').addClass('vote-disable')
                        Service.voteActive('POST', JSON.stringify(params), (function callback(data) {
                            console.log("=====数据：", data.data)
                            if (data.code == 200) {
                                e.voteNum = _self.info.voteNum + 1;
                                // e.isCanVote = !e.isCanVote
                                fn.showTip('投票成功');

                            }
                            setTimeout(() => {
                                _self.getCodeTree();
                                _self.number = 0;
                                _self.showImgCode = false;
                                obj.isCanVote = !obj.isCanVote;
                                // $('.vote-item').eq(index).find('.vote-opts').removeClass('vote-disable')
                            }, 3000);
                        }))


                    }
                } else {
                    setTimeout(() => {
                        _self.getCodeTree();
                        _self.number = 0;
                        _self.showImgCode = false;
                        obj.isCanVote = !obj.isCanVote;
                    }, 3000);
                }

            }))


        },
        //投票
        toVote(e) {
            // this.number = 0;
            // this.showImgCode = true;
            var _self = this;

            var params = {
                "voteId": e.voteId,
                "openId": _self.openId
            };
            let obj = _self.info;
            if (obj.isCanVote) {
                // e.isCanVote = false;
                obj.isCanVote = false;
                //$('.vote-item').eq(index).find('.vote-opts').addClass('vote-disable')
                Service.voteActive('POST', JSON.stringify(params), (function callback(data) {
                    console.log("=====数据：", data.data)
                    if (data.code == 200) {
                        e.voteNum = _self.info.voteNum + 1;
                        // e.isCanVote = !e.isCanVote
                        fn.showTip('投票成功');

                    }
                    setTimeout(() => {
                        _self.getCodeTree();
                        _self.number = 0;
                        _self.showImgCode = false;
                        obj.isCanVote = !obj.isCanVote;
                        // $('.vote-item').eq(index).find('.vote-opts').removeClass('vote-disable')
                    }, 3000);
                }))


            }
            // $("#codeT3").bind("click", function(ev) {
            //     ev.preventDefault();
            //     ev.stopPropagation();

            //     var oEvent = ev || event;

            //     //var number = $("#codeSelect option").length;
            //     _self.number++;
            //     if (_self.number > 4) {
            //         return;
            //     }

            //     var x = oEvent.pageX;
            //     var y = oEvent.pageY;
            //     var img = document.getElementById('codeT3'); //获取图片的原点
            //     var nodex = _self.getNodePosition(img)[0]; //原点x 与原点y
            //     var nodey = _self.getNodePosition(img)[1];

            //     var xserver = parseInt(x) - parseInt(nodex);
            //     var yserver = parseInt(y) - parseInt(nodey);

            //     $("#codeSelect").append(
            //         "<option value='" + (parseInt(_self.number) + 1) + "'>" + xserver + "_" + yserver +
            //         "</option>");
            //     var oDiv = document.createElement('span');
            //     oDiv.style.left = (parseInt(x) - 15) + 'px'; // 指定创建的DIV在文档中距离左侧的位置    图片大小30 左右移动5
            //     oDiv.style.top = (parseInt(y) - 15) + 'px'; // 指定创建的DIV在文档中距离顶部的位置
            //     oDiv.style.display = 'block';
            //     oDiv.style.background = "#1a88f8";
            //     oDiv.style.zIndex = '1001';
            //     oDiv.style.border = '1px solid #1a88f8'; // 设置边框
            //     oDiv.style.position = 'absolute'; // 为新创建的DIV指定绝对定位
            //     oDiv.style.width = '30px'; // 指定宽度
            //     oDiv.style.height = '30px'; // 指定高度
            //     //oDiv.src = 'select.png';
            //     oDiv.style.opacity = '0.5'; //透明度
            //     oDiv.className = 'zhezhao'; //加class 点刷新后删除遮罩
            //     document.body.appendChild(oDiv);

            //     //第四次点击后自动提交
            //     if (_self.number == 4) {
            //         _self.cheakOutTree(e);
            //     }

            // });


        },


    },
    mounted: function() {
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        this.getDetail();
    }
})