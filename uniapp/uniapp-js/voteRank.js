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
            pdlist: [],
            totalPage: 1,
            activitId: 14,
            openId: '',
            name: '',
            isPremier: true,
            codePath: "",
            number: 0,
            date:''

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
                activityId: tempJson.id ? tempJson.id : "",
                type: 0
            };

            Service.voteResultActive('GET', params, (function callback(data) {
                console.log("=====数据：", data.data)
                if (data.code == 200) {
                    self.totalPage = 1;
                    var listData = data.data;
                    // var newList = [].concat(...(Array.from(oldList.reduce((total, cur, index) => {
                    //     total[index % 2].push(cur)
                    //     return total
                    // }, { 0: [], 1: [], length: 2 }))))

                    // console.log(newList)
                    // for (var i in listData) {
                    //     alert(listData[i].personName);
                    // }
                    successCallback && successCallback(listData); //成功回调
                    _self.date = fn.formatTime(data.tradeTime,'Y-M-D');
                    
                    document.getElementById("appContent").style.display = "block";

                    setTimeout(function() {
                        $('.memWeight2').css({ 'height': parseInt(17 * window.innerWidth / 100) + 'px' })
                        $('.memWeight1').css({ 'height': parseInt(15 * window.innerWidth / 100) + 'px' })
                        $('.memWeight3').css({ 'height': parseInt(13 * window.innerWidth / 100) + 'px' })
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

        $('.vote-top').css('height', parseInt(678 * window.innerWidth / 750) + 'px')

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

        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
        }, 1000)

    }
})