var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo = { token: "" };
var vm = new Vue({
    el: '#app',
    data() {
        return {
            showImgCode: false,
            token: userInfo.token ? userInfo.token : "",
            mescroll: null,
            voteInfo: {},
            pdlist: [],
            totalPage: 1,
            activitId: 15,
            openId: '',
            name: '',
            isPremier: true,
            codePath: "",
            number: 0
        }
    },
    methods: {
        //查询关键字
        srhName(e) {
            // this.name = e;
            this.pdlist = [];
            this.mescroll.resetUpScroll();

            this.mescroll.scrollTo(0, 300); //回到顶部
            // setTimeout(function() {
            //     var $items = $('.vote-item').html()
            //     console.log("$items：", $items)
            //     var $grid = $('.vote-dataList').masonry({
            //         itemSelector: '.vote-item',
            //         columnWidth: 0 //每两列之间的间隙为5像素

            //     });
            //     //  $grid.masonry('layout')

            // }, 20)
        },
        //查看排名
        toRank() {
            window.location.href = "voteRank.html?id=" + this.voteInfo.id
        },

        //查看个人详情
        toDetail(item){
            window.location.href = "voteDetail.html?id=" + item.voteId
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
        cheakOutTree(e, index) {
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
                let obj = _self.pdlist[index];
                if (data.code == 200) {
                    //延时一秒,模拟联网
                    var params = {
                        "voteId": e.voteId,
                        "openId": _self.openId
                    };
                    
                    if (obj.isCanVote) {
                        // e.isCanVote = false;
                        obj.isCanVote = false;
                        _self.$set(_self.pdlist, index, obj);
                        //$('.vote-item').eq(index).find('.vote-opts').addClass('vote-disable')
                        Service.voteActive('POST', JSON.stringify(params), (function callback(data) {
                            console.log("=====数据：", data.data)
                            if (data.code == 200) {
                                e.voteNum = _self.pdlist[index].voteNum + 1;
                                // e.isCanVote = !e.isCanVote
                                fn.showTip('投票成功');

                            }
                            setTimeout(() => {
                                _self.getCodeTree();
                                _self.number = 0;
                                _self.showImgCode = false;
                                obj.isCanVote = !obj.isCanVote;
                                _self.$set(_self.pdlist, index, obj);
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
                        _self.$set(_self.pdlist, index, obj);
                    }, 3000);
                }

            }))


        },
        //投票
        toVote(e, index) {
            // this.number = 0;
            // this.showImgCode = true;
            var _self = this;
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
            //         _self.cheakOutTree(e, index);
            //     }

            // });
            //延时一秒,模拟联网
            var params = {
                "voteId": e.voteId,
                "openId": this.openId
            };
            let obj = _self.pdlist[index];
            if (obj.isCanVote) {
                // e.isCanVote = false;
                obj.isCanVote = false;
                _self.$set(_self.pdlist, index, obj);
                //$('.vote-item').eq(index).find('.vote-opts').addClass('vote-disable')
                Service.voteActive('POST', JSON.stringify(params), (function callback(data) {
                    console.log("=====数据：", data.data)
                    if (data.code == 200) {
                        e.voteNum = _self.pdlist[index].voteNum + 1;
                        // e.isCanVote = !e.isCanVote
                        fn.showTip('投票成功');
                        // _self.pdlist[index].isCanVote = true;
                        // _self.pdlist = [];
                        // _self.mescroll.resetUpScroll();
                        // _self.mescroll.scrollTo(0, 300); //回到顶部
                    }
                    setTimeout(() => {
                        obj.isCanVote = !obj.isCanVote;
                        _self.$set(_self.pdlist, index, obj);
                        // $('.vote-item').eq(index).find('.vote-opts').removeClass('vote-disable')
                    }, 3000);
                }))
            }

        },
        //上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
        upCallback: function(page) {
            //联网加载数据
            var self = this;
            this.getListDataFromNet(page.num, page.size, function(curPageData) {
                // curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置
                self.$nextTick(() => {
                    //如果是第一页需手动制空列表
                    if (page.num == 1) self.pdlist = [];

                    //更新列表数据
                    self.pdlist = self.pdlist.concat(curPageData);

                    //联网成功的回调,隐藏下拉刷新和上拉加载的状态;
                    //mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
                    console.log("page.num=" + page.num + ", page.size=" + page.size + ", curPageData.length=" + curPageData.length + ", self.pdlist.length==" + self.pdlist.length);

                    //方法一(推荐): 后台接口有返回列表的总页数 totalPage
                    self.mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)

                    //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
                    //self.mescroll.endBySize(curPageData.length, totalSize); //必传参数(当前页的数据个数, 总数据量)

                    //方法三(推荐): 您有其他方式知道是否有下一页 hasNext
                    //self.mescroll.endSuccess(curPageData.length, hasNext); //必传参数(当前页的数据个数, 是否有下一页true/false)

                    //方法四 (不推荐),会存在一个小问题:比如列表共有20条数据,每页加载10条,共2页.如果只根据当前页的数据个数判断,则需翻到第三页才会知道无更多数据,如果传了hasNext,则翻到第二页即可显示无更多数据.
                    //self.mescroll.endSuccess(curPageData.length);
                    setTimeout(function() {
                        var $grid = $('.vote-dataList');
                        $grid.imagesLoaded(function() {
                            $grid.masonry({
                                itemSelector: '.vote-item',
                                columnWidth: 0 //每两列之间的间隙为5像素
                            });
                        })
                        if (!self.isPremier) {
                            $grid.masonry('reload');
                        }
                        self.isPremier = false;

                        //console.log('vote-item：', $('.vote-item').html())
                    }, 30)
                })
            }, function() {
                self.$nextTick(() => {
                    //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                    self.mescroll.endErr();
                })
            });
        },
        getListDataFromNet: function(pageNum, pageSize, successCallback, errorCallback) {
            var _self = this;
            //延时一秒,模拟联网
            var params = {
                "activitId": this.activitId,
                "openId": this.openId,
                "pageNo": pageNum,
                "pageSize": pageSize,
                "name": this.name
            };

            Service.getActiveVoteInfo('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    _self.voteInfo = data.data;
                    self.totalPage = data.data.layerData.count;
                    var listData = data.data.layerData.data;
                    // var newList = [].concat(...(Array.from(oldList.reduce((total, cur, index) => {
                    //     total[index % 2].push(cur)
                    //     return total
                    // }, { 0: [], 1: [], length: 2 }))))

                    // console.log(newList)
                    for (var i in listData) {
                        listData[i].isCanVote = true;
                    }
                    successCallback && successCallback(listData); //成功回调

                    document.getElementById("appContent").style.display = "block";

                    setTimeout(function() {

                        var title = "2020福耀玻璃安装技能大赛-有投票",
                            //desc = _self.info.content ? fn.replaceStr(_self.info.content) : '暂无详情',
                            desc = '由福耀集团发起、以“福耀精神、福耀天下”为主题的CARG 大活动，于2020年10月在福清举办，活动中的“汽车玻璃技能大赛”（简称：技师大赛）由福建易道大咖商业管理有限公司承办，现将报名和参赛的相关事项通知如下：',
                            link = window.location.href,
                            imgUrl = WebHost + 'images/logo.png';
                        // desc = desc.replace(/<!--[^>]*-->/gi, "");
                        // console.log(desc)
                        // console.log(imgUrl)
                        toShare(title, desc, link, imgUrl)
                    }, 30)
                }

            }))
        }

    },
    mounted: function() {

        //创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
        //解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
        var self = this;
        this.openId = window.localStorage.getItem("openId") ? window.localStorage.getItem("openId") : "";
        this.codePath = HOST + "code3?openId=" + this.openId + "&flag=" + Math.random();
        self.mescroll = new MeScroll("mescroll", {
            up: {

                callback: self.upCallback, //上拉回调
                //以下参数可删除,不配置
                page: { size: 999 }, //可配置每页8条数据,默认10
                toTop: { //配置回到顶部按钮
                    src: "images/mescroll/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                    //offset : 1000
                },
                empty: { //配置列表无任何数据的提示
                    warpId: "dataList",
                    icon: "images/mescroll/mescroll-empty.png"
                    //tip: "亲,暂无相关数据哦~"
                    // btntext: "去逛逛 >",
                    // btnClick: function() {
                    //     window.location.href = "index.html"
                    // }
                }
            }
        });

        // 倒计时
        var _ordertimer = null;
        var data = new Date();
        var txt = $('.js_time_txt');
        var buyTime = '2020/08/30 23:59:59'; //开抢时间
        var nowTime = new Date(); //接口返回当前时间

        var dateDiff = new Date(nowTime) - new Date(getnow()); //请求时间戳与本地时间戳
        if (dateDiff < 0) {
            dateDiff = Math.abs(dateDiff);
        }

        if (new Date(nowTime) > new Date(buyTime)) {
            $('.time-range').hide(); //已开枪
            return;
        } else {
            leftTimer(buyTime);
            _ordertimer = setInterval(function() { leftTimer(buyTime) }, 1000);
        }

        // 获取当前时间 xxxx/xx/xx 00:00:00
        function getnow() {
            var year = data.getFullYear();
            var month = parseInt(data.getMonth() + 1) >= 10 ? parseInt(data.getMonth() + 1) : '0' + parseInt(data.getMonth() + 1);
            var day = data.getDate();
            var hours = data.getHours();
            var minutes = data.getMinutes();
            var seconds = data.getSeconds();
            var now = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
            return now;
        }

        function leftTimer(enddate) {

            var leftTime = (new Date(enddate)) - new Date + dateDiff;

            var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
            var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
            var minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
            var seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数
            days = checkTime(days);
            hours = checkTime(hours);
            minutes = checkTime(minutes);
            seconds = checkTime(seconds);

            if (days >= 0 || hours >= 0 || minutes >= 0 || seconds >= 0)
                txt.html('<em class="v-yellow">' + days + '</em>' + " 天 " +
                    '<em class="v-yellow">' + hours + '</em>' + " 小时 " +
                    '<em class="v-yellow">' + minutes + '</em>' + " 分 " +
                    '<em class="v-yellow">' + seconds + '</em>' + " 秒 ");
            if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
                window.clearInterval(_ordertimer);
                _ordertimer = null;
            }
        }

        function checkTime(i) { //将0-9的数字前面加上0，例1变为01
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
        //this.getShopDetail();
        //初始化vue后,显示vue模板布局
        // setTimeout(function() {
        //     document.getElementById("appContent").style.display = "block";

        // }, 300)


    }
})