var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    isShowMask: false

}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {

        btnUploadFile() {
            var _self = this;
            let evt = window.event || e;
            let el = evt.currentTarget || evt.srcElement;
            //获取图片文件
            var imgFile = el.files[0];

            //后缀选取
            // if (!/\/(?:jpeg|jpg|png|gif|JPG|PNG)/i.test(imgFile.type)) {
            //     console.log(图片格式不支持);
            //     return;
            // }
            //异步读取文件
            var reader = new FileReader();
            reader.onloadstart = function(e) {
                _self.isShowMask = true;
                console.log("开始读取....");
            }
            reader.onprogress = function(e) {
                console.log("正在读取中....");
            }
            reader.onabort = function(e) {
                console.log("中断读取....");
            }
            reader.onerror = function(e) {
                console.log("读取异常....");
            }
            //reader.readAsDataURL(imgFile);
            reader.onload = async(evt) => {
                //图片压缩上传，大于1.2M压缩图片
                if (imgFile.size / 1024 > 1024 * 1.2) {
                    fn.dealImage(evt.target.result, {
                        quality: 0.6
                    }, function(base64Codes) {
                        // console.log(base64Codes)
                        var params = {
                            base64Data: base64Codes,
                            bizType: 101
                        }
                        Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
                            //console.log("数据：", data)
                            if (data.code == 200) {
                                $("#showImg").attr("src", data.data.webPath);
                                _self.isShowMask = false;
                            }
                        }))
                    });
                } else {
                    var params = {
                        base64Data: evt.target.result,
                        bizType: 101
                    }
                    Service.uploadPic('POST', JSON.stringify(params), (function callback(data) {
                        //console.log("数据：", data)
                        if (data.code == 200) {

                            //alert(data.data.webPath);
                            $("#showImg").attr("src", data.data.webPath);
                            _self.isShowMask = false;
                            //alert(data.data.webPath)
                        }
                    }))
                }


            }
            reader.readAsDataURL(imgFile);
        }
    },
    mounted: function() {
        //获得当前<ul>
    var $uList = $(".scroll-box ul");
    var timer = null;
    //触摸清空定时器
    $uList.hover(function() {
        clearInterval(timer);
    },
    function() { //离开启动定时器
        timer = setInterval(function() {
            scrollList($uList);
        },
        1000);
    }).trigger("mouseleave"); //自动触发触摸事件
    
    //滚动动画
    function scrollList(obj) {
        //获得当前<li>的高度
        var scrollHeight = $("ul li:first").height();
        //滚动出一个<li>的高度
        $uList.stop().animate({
            marginTop: -scrollHeight
        },
        600,
        function() {
            //动画结束后，将当前<ul>marginTop置为初始值0状态，再将第一个<li>拼接到末尾。
            $uList.css({
                marginTop: 0
            }).find("li:first").appendTo($uList);
        });
    }

        var list = [{
            id: 1,
            pid: 0,
            name: '一级'
        }, 　　 { id: 2, pid: 1, name: '一级1' }, 　　 { id: 3, pid: 1, name: '一级2' }, 　　 { id: 4, pid: 2, name: '一级1-1' }]
        let tree = fn.composeTree(list)
        console.log("结构树形式：", tree)
    }
})