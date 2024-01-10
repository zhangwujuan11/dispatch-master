var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
    el: "#app",
    data: {
        token: userInfo.token ? userInfo.token : "",
        mescroll: null,
        payStatus: 0,//支付状态
        pdlist: [],
        totalPage: 1,
        field: tempJson.field ? tempJson.field : 0, //0是待付款  1：服务中  2： 已完成 
        orederType: ["全部", " 待支付", "已支付"],
        refuseMsg:""

    },
    created() {


    },
    mounted: function() {


        //创建MeScroll对象,down可以不用配置,因为内部已默认开启下拉刷新,重置列表数据为第一页
        //解析: 下拉回调默认调用mescroll.resetUpScroll(); 而resetUpScroll会将page.num=1,再执行up.callback,从而实现刷新列表数据为第一页;
        var self = this;
        self.mescroll = new MeScroll("mescroll", {
            up: {

                callback: self.upCallback, //上拉回调
                //以下参数可删除,不配置
                page: { size: 5 }, //可配置每页8条数据,默认10
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

        //开始订单
        startOrder() {
            window.location.href = 'step1.html';
        },
        //隐藏或关闭弹框
        hideMask() {
            $('.query-select,.mask').hide();
        },

        //门店接单
        orderRecevie(event) {
            event.preventDefault();
            event.stopPropagation();
            var el = event.currentTarget;
            var orderSn = $(el).attr('orderSn');
            var orderStatus = $(el).attr('orderStatus');
            window.location.href = "surveyDetail.html?orderId=" + orderSn;
        },
        //新建勘验单
        add(){
            window.location.href = "queryMember.html";
        },
        //去详情
        toDetail(e) {
            window.location.href = "cardOrder.html?orderSn=" + e;
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
                })
            }, function() {
                self.$nextTick(() => {
                    //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
                    self.mescroll.endErr();
                })
            });
        },
        // changType(index) {
        //     var el = event.currentTarget;
        //     this.field = index;
        //     if(this.field == 0){
        //         this.payStatus = ""
        //     }else  if(this.field == 1){
        //         this.payStatus = 0
        //     }else  if(this.field == 2){
        //         this.payStatus = 1
        //     }
        //     this.pdlist = [];

        //     this.mescroll.resetUpScroll();
        // },

        getListDataFromNet: function(pageNum, pageSize, successCallback, errorCallback) {
            //延时一秒,模拟联网
            var params = {
                startDate: "",
                endDate: "",
                pageNo: pageNum,
                pageSize: pageSize,
                payStatus: this.payStatus
            }
            Service.getRightCardOrderList('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    self.totalPage = data.count;
                    var listData = data.data;
                    for (var i in listData) {
                        if (listData[i].payStatus == 0) {
                            listData[i].payStatusDes = "待支付"
                        }else if (listData[i].payStatus == 1) {
                            listData[i].payStatusDes = "已支付"
                        }

                        if (listData[i].orderStatus == 0) {
                            listData[i].orderStatusDes = "待审核"
                            listData[i].colorStauts = 'blue'
                        }else if (listData[i].orderStatus == 1) {
                            listData[i].orderStatusDes = "已通过";
                            listData[i].colorStauts = 'state'
                        }else if (listData[i].orderStatus == 2) {
                            listData[i].orderStatusDes = "取消"
                            listData[i].colorStauts = 'red'
                        } else if (listData[i].orderStatus == 3) {
                            listData[i].orderStatusDes = "退款中"
                            listData[i].colorStauts = 'blue'
                        } else if (listData[i].orderStatus == 4) {
                            listData[i].orderStatusDes = "退款完成"
                            listData[i].colorStauts = 'state'
                        } else if (listData[i].orderStatus == -1) {
                            listData[i].orderStatusDes = "驳回"
                            listData[i].colorStauts = 'red'
                        } else if (listData[i].orderStatus == -2) {
                            listData[i].orderStatusDes = "过期"
                            listData[i].colorStauts = 'red'
                        } else if (listData[i].orderStatus == -3) {
                            listData[i].orderStatusDes = "退款失败"
                            listData[i].colorStauts = 'red'
                        }

                    }
                    successCallback && successCallback(listData); //成功回调
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