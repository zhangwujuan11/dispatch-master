var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
    el: "#app",
    data: {
        showUnitCharge: false,
        settlementCompanyId: "",
        token: userInfo.token ? userInfo.token : "",
        mescroll: null,
        status: 0,
        // states: 1, //订单状态（1待付款6服务中7已完成）
        pdlist: [],
        totalPage: 1,
        allSelect: false,
        totalPrice: 0,
        orderSnList: [],
        settleList: []
    },
    created() {
        fn.routeQuery(tempJson)
    },
    mounted: function() {
        //创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
        //解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
        var self = this;
        self.mescroll = new MeScroll("mescroll", {
            up: {

                callback: self.upCallback, //上拉回调
                //以下参数可删除,不配置
                page: { size: 10 }, //可配置每页8条数据,默认10
                toTop: { //配置回到顶部按钮
                    src: "images/mescroll/mescroll-totop.png", //默认滚动到1000px显示,可配置offset修改
                    //offset : 1000
                },
                empty: { //配置列表无任何数据的提示
                    warpId: "dataList",
                    icon: "images/mescroll/mescroll-empty.png",
                    tip: "亲,暂无相关数据哦~",
                    // btntext: "去逛逛 >",
                    // btnClick: function() {
                    //     alert("点击了去逛逛按钮");
                    // }
                }
            }
        });
        //初始化vue后,显示vue模板布局
        document.getElementById("dataList").style.display = "block";


    },
    methods: {
         //待结算
        toSettleList(){
            window.location.href="settleList.html";
        },

        //已结算
        toSettleListEnd(){
            window.location.href="settleListEnd.html";
        },

        //发票信息
        toSettleSend(e){
            window.location.href="settleSend.html?realId=" + e.settlementSn;
        },
        //结算详情
        toView(item){
            window.location.href="settleDetail.html?realId=" + item.settlementSn;
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
                    self.allSelect = false;
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
                })
            }, function() {
                self.$nextTick(() => {
                    //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                    self.mescroll.endErr();
                })
            });
        },

        getListDataFromNet: function(pageNum, pageSize, successCallback, errorCallback) {
            //延时一秒,模拟联网
            var params = {
                pageNo: pageNum,
                pageSize: pageSize
            }
            Service.getOrderSettleJszList('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    self.totalPage = data.count;

                    var listData = data.data;
                    for (var i in listData) {
                        listData[i].flagSel = false;

                    }
                    successCallback && successCallback(listData); //成功回调
                }
            }))


        },

        //判断信息
        chackInfo() {
            if ( !this.orderSnList.length) {
                fn.showTip("请先选择结算订单号！");
                return false;
            }
            if ( !this.settlementCompanyId) {
                fn.showTip("请先选择结算单位！");
                return false;
            }
            return true;
        },

        //确认结算
        surSettle(){
            var _self = this;
            if (!this.chackInfo()) {
                return false;
            }
            var params = {
                orderSnList: this.orderSnList,
                settlementCompanyId: this.settlementCompanyId,
                settlementPrice: this.totalPrice
            }
            Service.applyOrderSettle('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {

                }
            }))
        }


    },
    computed: {


    },
});

// var date = new Date("2018-1-21");
// alert(date.getDay());


//禁止PC浏览器拖拽图片,避免与下拉刷新冲突;如果仅在移动端使用,可删除此代码
document.ondragstart = function() { return false; }