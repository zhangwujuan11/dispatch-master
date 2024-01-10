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
        // $uList.hover(function() {
        //     clearInterval(timer);
        // },
        // function() { //离开启动定时器
        //     timer = setInterval(function() {
        //         scrollList($uList);
        //     },
        //     1000);
        // }).trigger("mouseleave"); //自动触发触摸事件
        var len = $(".scroll-box ul li").length;
        if (len > 5) {
            autoS();
        }

        function autoS() {
            timer = setInterval(function() {
                scrollList($uList);
            }, 1200);
        }

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
            }, 　　
            {
                id: 2,
                pid: 1,
                name: '一级1'
            }, 　　
            {
                id: 3,
                pid: 1,
                name: '一级2'
            }, 　　
            {
                id: 4,
                pid: 2,
                name: '一级1-1'
            }
        ]
        let tree = fn.composeTree(list)
        console.log("结构树形式：", tree)


        //浅拷贝
        const obj1 = {
            name: 'mengft',
            family: ['父亲', '母亲', '妹妹']
        }

        function shallowCopy(o) {
            let object2 = {}
            for (let i in o) {
                if (o.hasOwnProperty(i)) {
                    object2[i] = o[i]
                }
            }
            return object2
        }

        console.dir(shallowCopy(obj1))
        //深拷贝
        function deepCopy(o, c) {
            c = c || {}
            for (let i in o) {
                if (typeof o[i] === 'object') {
                    // 需要深拷贝
                    if (o[i].constructor === Array) {
                        // 数组
                        console.log('是数组')
                        c[i] = []
                    } else {
                        // 对象
                        console.log('是对象')
                        c[i] = {}
                    }
                    deepCopy(o[i], c[i])
                } else {
                    c[i] = o[i]
                }
            }
            return c
        }

        console.dir(deepCopy(obj1, { school: '天津科技大学' }))



        //深复制，要想达到深复制就需要用递归
        function deepCopy(o, c) {
            var c = c || {}
            for (var i in o) {
                if (typeof o[i] === 'object') {
                    //要考虑深复制问题了
                    if (o[i].constructor === Array) {
                        //这是数组
                        c[i] = []
                    } else {
                        //这是对象
                        c[i] = {}
                    }
                    deepCopy(o[i], c[i])
                } else {
                    c[i] = o[i]
                }
            }
            return c
        }
        var china = {
            nation: '中国',
            birthplaces: ['北京', '上海', '广州'],
            skincolr: 'yellow',
            friends: ['sk', 'ls']
        }
        var result = { name: 'result' }
        result = deepCopy(china, result)
        console.dir(result)

        //第二种方法
        var test = {
            name: {
                xing: {
                    first: '张',
                    second: '李'
                },
                ming: '老头'
            },
            age: 40,
            friend: ['隔壁老王', '宋经纪', '同事']
        }
        var result = JSON.parse(JSON.stringify(test))
        result.age = 30
        result.name.xing.first = '往'
        result.friend.push('fdagldf;ghad')
        console.dir(test)
        console.dir(result)

        var arr1 = [1,3,5,8,9,11,12];
        var arr2 = [3,8,5,9, 11]
        var newArr = [];
        for(var i in arr1){
            for(var j in arr2){
                if(arr1[i] == arr2[j]){
                    newArr.push(i)
                }
            }
        }
        console.log("newArr：",newArr)

    }
})