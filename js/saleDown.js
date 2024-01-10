var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
//创建vue对象
var vm = new Vue({
    el: "#app",
    data: {
        token: userInfo.token ? userInfo.token : "",
        startDate: "",
        endDate: "",
        userType:""
    },
    mounted: function() {
        var self = this;
        //时间选择
        var subinvman_sel = $("#startDate")[0];
        if (subinvman_sel) {
            document.querySelector("#startDate").addEventListener("tap", function() {
                var dtpicker = new mui.DtPicker({
                    "type": "date"
                    //endDate: new Date(new Date().getFullYear(), new Date().getMonth()),
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
        document.getElementById("appContent").style.display = "block";


    },
    methods: {
        //判断信息
        chackInfo() {
            // if (!this.userType) {
            //     fn.showTip("客户类型不能为空！");
            //     return false;
            // }

            if (!this.startDate) {
                fn.showTip("销售起始时间不能为空！");
                return false;
            }

            if (!this.endDate) {
                fn.showTip("销售截止时间不能为空！");
                return false;
            }

           

            return true;
        },
        //销售单下载
       search(){
            var _self = this;
            if (!this.chackInfo()) {
                return false;
            }
            var params = {
                "endDate": this.endDate,
                "startDate": this.startDate,
                "userType": this.userType
            }
            console.log('params：', params)
            Service.downOrderSale('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    console.log(data.data);
                    if(data.data){
                       window.location.href= data.data;
                   }else{
                    fn.showTip('暂无数据')
                   }
                    
                   // fn.showTip('提交成功！','saleList.html');
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