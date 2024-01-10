var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showSubUp: false,
    singleFlag: true,
    sexFlag: true,
    memberInfo: {
        bankName: "",
        bankNo: "",
        cardId: "",
        isTrain: 1,
        id:"",
        job: "",
        name: "",
        certificateDtoList: [],
        phone: "",
        name: "",
        sex: 0  //性别 0：男1：女
    },
    certificateDtoList: []

}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

        //添加证书
        addCert() {
            var obj = {
                name : "",
                grade : "",
                issueDate : ""
            }
            this.certificateDtoList.push(obj);
        },
        //单选筛选
        sinFlagTrue() {
            this.singleFlag = true;
            this.memberInfo.isTrain = 1;
        },
        sinFlagFalse() {
            this.singleFlag = false;
            this.memberInfo.isTrain = 0;
        },
        //性别筛选
        sexFlagTrue(){
            this.sexFlag = true;
            this.memberInfo.sex = 0;
        },
        sexFlagFalse(){
            this.sexFlag = false;
            this.memberInfo.sex = 1;
        },

        //判断信息
        chackInfo() {
            if (!this.memberInfo.name) {
                fn.showTip("店员姓名不能为空");
                return false;
            }
            if (!this.memberInfo.phone) {
                fn.showTip("手机号码不能为空");
                return false;
            }
            if (!fn.testRule.isTel(this.memberInfo.phone)) {
                fn.showTip("请正确输入手机号码");
                return false;
            }
            if (!this.memberInfo.cardId) {
                fn.showTip("身份证号不能为空");
                return false;
            }
            if (!fn.testRule.isCard(this.memberInfo.cardId)) {
                fn.showTip("请正确输入身份证号");
                return false;
            }
            if (!this.memberInfo.job) {
                fn.showTip("所属岗位不能为空");
                return false;
            }

            return true;
        },
        //确定编辑
        updateMember() {
            if (!this.chackInfo()) {
                return false;
            }
            var returnUrl = tempJson.returnUrl ? tempJson.returnUrl : '';
            var params = {};
            if( this.singleFlag ){
                this.memberInfo.certificateDtoList = this.certificateDtoList;
                params = this.memberInfo
            }else {
                params = this.memberInfo
            }
            Service.addUpShopPersonList('POST', JSON.stringify(params), (function callback(data) {
                if (data.code == 200) {
                    console.log(data.data);
                    if(returnUrl){
                        fn.showTip("保存成功",returnUrl);
                    }else{
                      fn.showTip("保存成功","shopUserManager.html");  
                    }
                    
                }
            }))
        }

    },
    mounted: function() {
        //alert(fn.versions.ios)
        var _self = this;
        var params = {
            shopPersonId: tempJson.realId ? tempJson.realId : ""
        }
        Service.getShopPersonDetail('GET', params, (function callback(data) {
            console.log("=====数据：", data)
            if (data.code == 200) {
                _self.memberInfo = data.data;
                if( _self.memberInfo.job==10){
                    _self.memberInfo.jobName ="店长"
                }
                if( _self.memberInfo.job==11){
                    _self.memberInfo.jobName ="技师"
                }
                if( _self.memberInfo.job==12){
                    _self.memberInfo.jobName ="前台"
                }
                if(_self.memberInfo.isTrain == 1){
                    _self.singleFlag = true
                }else{
                    _self.singleFlag = false
                }
                if(_self.memberInfo.sex == 1){
                    _self.sexFlag = false
                }else{
                    _self.singleFlag = true
                }
                if(_self.memberInfo.cerTificates){
                    _self.certificateDtoList = _self.memberInfo.cerTificates;
                    for(var i in _self.certificateDtoList ){
                        _self.certificateDtoList[i].issueDate = _self.certificateDtoList[i].issueDate ? fn.formatTime(_self.certificateDtoList[i].issueDate,'Y-M-D') : "";
                    }
                }
                //_self.singleFlag = _self.memberInfo.isTrain
                //_self.sexFlag
            }
        }))

        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
            
        }, 300)
    }
})