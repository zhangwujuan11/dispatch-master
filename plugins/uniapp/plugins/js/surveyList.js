var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
    el: "#app",
    data: {
        token: userInfo.token ? userInfo.token : "",
        mescroll: null,
        status: 0,
        finishDate: "",
        startDate: "",
        endDate: "",
        // states: 1, //订单状态（1待付款6服务中7已完成）
        pdlist: [],
        userTypeList: [],
        totalPage: 1,
        search: {
                orderLevel: 0, //1 综合， 2： 年龄 ， 3：评分 ,  4:等级
                level:0,
                sex: 0
            },
        field: tempJson.field ? tempJson.field : 0, //0是待付款  1：服务中  2： 已完成 
        orederType: ["全部", " 待接单", "审核中", "已完成", "不通过"],
        arrLevel: [
                    { name: "全部", score: 1, status: 0 }, 
                    { name: "待接单", score: 2, status: 100 }, 
                    { name: "审核中", score: 3, status: 102 }, 
                    { name: "已完成", score: 4, status: 104 }, 
                    { name: "不通过", score: 5, status: 106 }
                ],
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
        self.getUserTypeList();
        //时间选择
        var subinvman_sel = $("#startDate")[0];
        if (subinvman_sel) {
            document.querySelector("#startDate").addEventListener("tap", function() {
                var dtpicker = new mui.DtPicker({
                    "type": "date"
                });
                // dtpicker.setSelectedValue("08:12");  
                dtpicker.show(function(items) {
                    console.log(items.text)
                    //$("#openb")[0].innerHTML = items.text;
                    self.startDate = items.text;
                    dtpicker.dispose();
                });
            });
        };

        var subinvman_sel = $("#endDate")[0];
        if (subinvman_sel) {
            document.querySelector("#endDate").addEventListener("tap", function() {
                var dtpicker = new mui.DtPicker({
                    "type": "date"
                });
                dtpicker.show(function(items) {
                    console.log(items.text)
                    //$("#opene")[0].innerHTML = items.text;
                    self.endDate = items.text;
                    if (self.endDate < self.startDate) {
                        fn.showTip('截止日期不能小于开始日期');
                        self.endDate = "";
                    }
                    dtpicker.dispose();
                });
            });
        };
        //初始化vue后,显示vue模板布局
        document.getElementById("dataList").style.display = "block";


    },
    methods: {
        //获取客户类型
        getUserTypeList() {
            var _self = this;
            var params = {};
            Service.getUserTypeList('GET', params, (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    _self.userTypeList = data.data;
                    var obj ={checkItemLists: [], delFlag: false, id: "", name: "全部", sort: 100}
                    _self.userTypeList.unshift(obj);
                }
            }))
        },
        //开始订单
        startOrder() {
            window.location.href = 'step1.html';
        },
        //隐藏或关闭弹框
        hideMask() {
            $('.query-select,.mask').hide();
        },
        //确定筛选结果
        querySur() {
            this.hideMask();
            this.pdlist = [];
            this.mescroll.resetUpScroll();
            this.mescroll.scrollTo(0, 300); //回到顶部
        },
        //订单状态筛选
        showNormal() {
           // $('.queryWarp').css('height','100%');
            $('.hock_query-select,.mask').show();
            $('.query-selectFull,.query-selectDate').hide();
        },
        //订单类型筛选
        showFull() {

            $('.query-selectFull').css('height', (window.innerHeight - 44) + 'px');
            $('.query-selectFull,.mask').show();
            $('.hock_query-select,.query-selectDate').hide();
        },
        //订单时间筛选
        showDate() {
            //$('.queryWarp').css('height','100%');
            $('.query-selectDate,.mask').show();
            $('.query-selectFull,.hock_query-select').hide();
        },
        //综合排序 
        searchLevel(index) {
            var el = event.currentTarget;
            var score = el.getAttribute('score');
            var relDate = el.getAttribute('relDate');
            var status = el.getAttribute('status');
            var ids = index;

            
            if (index == 0) {
                this.search.orderLevel = score;
                this.status = status;
            }
            if (index == 1) {
                this.search.level = score;
                this.userType = relDate;
            }
            this.hideMask();
            if (index == 2) {
                this.startDate = "";
                this.endDate = "";
                //$('.query-title').eq(ids).find('em').html(relDate).addClass('green');
            }

            this.pdlist = [];
            this.mescroll.resetUpScroll();
            this.mescroll.scrollTo(0, 300); //回到顶部
        },
        //勘验
        orderRecevie(e) {
            if (e.userName && e.mobile && e.carType) {
                window.location.href = "surveyDetail.html?orderId=" + e.orderSn;
            } else{
                fn.showTip('客户信息不全，请先补全', 'editMember.html?kw=' + e.carNo + '&backUrl=surveyDetail.html?orderId=' + e.orderSn);
            }
            // event.preventDefault();
            // event.stopPropagation();
            // var el = event.currentTarget;
            // var orderSn = $(el).attr('orderSn');
            // var orderStatus = $(el).attr('orderStatus');
            // window.location.href = "surveyDetail.html?orderId=" + orderSn;
        },
        //新建勘验单
        add(){
            window.location.href = "queryMember.html";
        },
        //去详情
        toDetail(e) {
            if (e.userName && e.mobile && e.carType ) {
                window.location.href = "surveyDetail.html?orderId=" + e.orderSn;
            } else{
                fn.showTip('客户信息不全，请先补全', 'editMember.html?kw=' + e.carNo + '&backUrl=surveyDetail.html?orderId=' + e.orderSn);
            }
            
            // if (orderStatus != 100 && orderStatus != 103) {
            //     window.location.href = "surveyDetail.html?orderId=" + orderSn;
            // }

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
        changType(index) {
            var el = event.currentTarget;
            this.field = index;
            this.pdlist = [];

            this.mescroll.resetUpScroll();
        },

        getListDataFromNet: function(pageNum, pageSize, successCallback, errorCallback) {
            //延时一秒,模拟联网
            var params = {
                startDate: this.startDate,
                pageNo: pageNum,
                pageSize: pageSize,
                status: this.status,
                endDate: this.endDate
            }
            Service.getSurveyList('POST', JSON.stringify(params), (function callback(data) {
                console.log("=====数据：", data)
                if (data.code == 200) {
                    self.totalPage = data.count;
                    var listData = data.data;
                    for (var i in listData) {
                        if (listData[i].orderStatus == 100) {
                            listData[i].orderStatusDes = "待接单"
                        }else if (listData[i].orderStatus == 101) {
                            listData[i].orderStatusDes = "已接单"
                        }else if (listData[i].orderStatus == 102) {
                            listData[i].orderStatusDes = "审核中"
                        } else if (listData[i].orderStatus == 103) {
                            listData[i].orderStatusDes = "已取消"
                        } else if (listData[i].orderStatus == 104) {
                            listData[i].orderStatusDes = "已完成"
                        } else if (listData[i].orderStatus == 106) {
                            listData[i].orderStatusDes = "不通过"
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