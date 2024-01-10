/**
 * @移动端公共JS类
 * @author xiaodi Zhang 2016-3-11
 * @version 1.0.0
 */

var fn = {
    winH: window.innerHeight,
    winW: window.innerWidth,
    hasClass: function (el, className) {
        var reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
        return reg.test(el.className)
    },

    addClass: function (el, className) {
        if (fn.hasClass(el, className)) {
            return
        }
        var newClass = el.className.split(' ')
        newClass.push(className)
        el.className = newClass.join(' ')
    },

    removeClass: function (ele, cls) {
        if (fn.hasClass(ele, cls)) {
            var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
            ele.className = ele.className.replace(reg, " ");
        }
    },

    versions: function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核               
            presto: u.indexOf('Presto') > -1, //opera内核               
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核               
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile/) || !!u.match(/Windows Phone/) || !!u.match(/Android/) || !!u.match(/MQQBrowser/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端               
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器               
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器               
            iPad: u.indexOf('iPad') > -1, //是否iPad               
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部           
        };
    }(),

    //清除所有的样式
    removeAllClass: function (el, className) {
        var els = el.parentNode.children; // 所有同级
        for (var i = 0; i < els.length; i++) {
            fn.removeClass(els[i], className)
        }
    },

    // 保存当前状态 
    activeState: function (el, className) {
        var els = el.parentNode.children; // 所有同级
        for (var i = 0; i < els.length; i++) {
            fn.removeClass(els[i], className)
        }
        fn.addClass(el, className)
    },

    //字符替换
    replaceStr: function (str) {
        //return str = str.replace(/style\=".+?"|style\=\'.+?\'/g, '');
        return str = str.replace(/style\s*?=\s*?(['"])[\s\S]*?\1/g, '');

    },
    //三位数字加个‘，’
    format_number: function (n) {
        var b = parseInt(n).toString();
        var len = b.length;
        if (len <= 3) { return b; }
        var r = len % 3;
        return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
    },
    /** * 数字位数不够，前面位数补零
        * 自定义函数名：formatZero
        * @param num： 需要补零的数值  
        * @param len： 补零后的总位数
    */
    formatZero: function (num, len) {
        if (String(num).length > len) return num;
        return (Array(len).join(0) + num).slice(-len);
    },
    //文本框换行、空格保存
    textareaTo: function (str) {
        var reg = new RegExp("\n", "g");
        var regSpace = new RegExp(" ", "g");
        str = str.replace(reg, "<br>");
        str = str.replace(regSpace, "&nbsp;");
        return str;
    },
    //数组去重
    uniqArrs: function (array) {
        var temp = []; //一个新的临时数组
        for (var i = 0; i < array.length; i++) {
            if (temp.indexOf(array[i]) == -1) {
                temp.push(array[i]);
            }
        }
        return temp;
    },

    //判断数组中所有元素都不同
    isRepeat: function (arr) {
        var hash = {};
        for (var i in arr) {
            if (hash[arr[i]]) //hash 哈希
                return true;
            hash[arr[i]] = true;
        }
        return false;
    },
    //获取数组中相同元素的个数
    getSameNum: function (val, arr) {
        var processArr = arr.filter(function (value) {
            return value == val;
        })
        return processArr.length;
    },
    //判断两个数组相同的元素
    getArrEqual: function (arr1, arr2) {
        var newArr = [];
        for (var i = 0; i < arr2.length; i++) {
            for (var j = 0; j < arr1.length; j++) {
                if (arr1[j] === arr2[i]) {
                    newArr.push(arr1[j]);
                }
            }
        }
        return newArr;
    },

    //判断两个数组不同的元素
    getArrDifference: function (arr1, arr2) {
        return arr1.concat(arr2).filter(function (v, i, arr) {
            return arr.indexOf(v) === arr.lastIndexOf(v);
        });
    },

    //数组单个字段排序
    sortBy(field) {
        return function (a, b) {
            return a[field] - b[field];
        }
    },

    watermark(settings) {
        //debugger;
        //默认设置
        var defaultSettings = {
            watermark_txt: "text",
            watermark_x: 20, //水印起始位置x轴坐标
            watermark_y: 20, //水印起始位置Y轴坐标
            watermark_rows: 7, //水印行数
            watermark_cols: 2, //水印列数
            watermark_x_space: 90, //水印x轴间隔
            watermark_y_space: 30, //水印y轴间隔
            watermark_color: '#c1c1c1', //水印字体颜色
            watermark_alpha: 0.4, //水印透明度
            watermark_fontsize: '15px', //水印字体大小
            watermark_font: '微软雅黑', //水印字体
            watermark_width: 100, //水印宽度
            watermark_height: 80, //水印长度
            watermark_angle: 15 //水印倾斜度数
        };
        //采用配置项替换默认值，作用类似jquery.extend
        if (arguments.length === 1 && typeof arguments[0] === "object") {
            var src = arguments[0] || {};
            for (key in src) {
                if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key])
                    continue;
                else if (src[key])
                    defaultSettings[key] = src[key];
            }
        }

        var oTemp = document.createDocumentFragment();

        //获取页面最大宽度
        var page_width = Math.max(document.body.scrollWidth, document.body.clientWidth);
        var cutWidth = page_width * 0.0150;
        var page_width = page_width - cutWidth;
        //获取页面最大高度
        var page_height = Math.max(document.body.scrollHeight, document.body.clientHeight) + 450;
        // var page_height = document.body.scrollHeight+document.body.scrollTop;
        //如果将水印列数设置为0，或水印列数设置过大，超过页面最大宽度，则重新计算水印列数和水印x轴间隔
        if (defaultSettings.watermark_cols == 0 || (parseInt(defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)) > page_width)) {
            defaultSettings.watermark_cols = parseInt((page_width - defaultSettings.watermark_x + defaultSettings.watermark_x_space) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space));
            defaultSettings.watermark_x_space = parseInt((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols - 1));
        }
        //如果将水印行数设置为0，或水印行数设置过大，超过页面最大长度，则重新计算水印行数和水印y轴间隔
        if (defaultSettings.watermark_rows == 0 || (parseInt(defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)) > page_height)) {
            defaultSettings.watermark_rows = parseInt((defaultSettings.watermark_y_space + page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space));
            defaultSettings.watermark_y_space = parseInt(((page_height - defaultSettings.watermark_y) - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows - 1));
        }
        var x;
        var y;
        for (var i = 0; i < defaultSettings.watermark_rows; i++) {
            y = defaultSettings.watermark_y + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i;
            for (var j = 0; j < defaultSettings.watermark_cols; j++) {
                x = defaultSettings.watermark_x + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j;

                var mask_div = document.createElement('div');
                mask_div.id = 'mask_div' + i + j;
                mask_div.className = 'mask_div';
                mask_div.appendChild(document.createTextNode(defaultSettings.watermark_txt));
                //设置水印div倾斜显示
                mask_div.style.webkitTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.MozTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.msTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.OTransform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.transform = "rotate(-" + defaultSettings.watermark_angle + "deg)";
                mask_div.style.visibility = "";
                mask_div.style.position = "fixed";
                mask_div.style.left = x + 'px';
                mask_div.style.top = y + 'px';
                mask_div.style.overflow = "hidden";
                mask_div.style.zIndex = "9999";
                mask_div.style.pointerEvents = 'none'; //pointer-events:none  让水印不遮挡页面的点击事件
                //mask_div.style.border="solid #eee 1px";
                mask_div.style.opacity = defaultSettings.watermark_alpha;
                mask_div.style.fontSize = defaultSettings.watermark_fontsize;
                mask_div.style.fontFamily = defaultSettings.watermark_font;
                mask_div.style.color = defaultSettings.watermark_color;
                mask_div.style.textAlign = "center";
                mask_div.style.width = defaultSettings.watermark_width + 'px';
                mask_div.style.height = defaultSettings.watermark_height + 'px';
                mask_div.style.display = "block";
                oTemp.appendChild(mask_div);
            };
        };
        document.body.appendChild(oTemp);
    },

    /**
     * 图片压缩（利用canvas）
     * @param  path     图片路径
     * @param  obj      压缩配置width,height,quality，不传则按比例压缩
     * @param  callback  回调函数
     */
    dealImage(path, obj, callback) {
        var img = new Image();
        img.src = path;
        img.onload = function () {
            var that = this;
            // 默认按比例压缩
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || (w / scale);

            //生成canvas
            var canvas = document.createElement('canvas'),
                ctx = canvas.getContext('2d');
            canvas.width = w;
            canvas.height = h;
            ctx.drawImage(that, 0, 0, w, h);

            // 默认图片质量为0.7
            var quality = 0.7;
            if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                quality = obj.quality;
            }

            // 回调函数返回base64的值
            var base64 = canvas.toDataURL('image/jpeg', quality);
            callback(base64);
        }
    },

    showLoading: function () {
        // var result = "<div class='mark' id='mark'></div>" +
        var result = "<div class='loading'>" +
            "<img src='images/loading.gif' />"
        "</div>"
        $('body').append(result);
    },
    closeLoading: function () {
        $('.loading').remove();
    },

    commonWindow: function (msg, text) {
        var text = text ? text : '返回'
        var result = "<div class='mark' id='mark'></div>" +
            "<div class='workInfo' > " +
            // "<h3>温馨提示</h3>" +
            "<div class='workContext p14'>" +
            "<ul class='error_message'>" + msg + "</ul>" +
            "</div>" +
            "<div class='work_btns'>" +
            "<button class='work_suc p16'>" + text + "</button>" +
            // "<button class='work_cancel p16'>取消</button>" +
            "</div>" +
            "</div>";
        $('body').append(result);
        $('.work_btns').on('click', function () {
            $('.workInfo, .mark, ._loading').remove();
        })
    },

    commonWindowSur: function (msg, txtSur, txtAnnuler) {
        var txtSur = txtSur ? txtSur : '是',
            txtAnnuler = txtAnnuler ? txtAnnuler : '否';
        var result = "<div class='mark' id='mark'></div>" +
            "<div class='workInfo' > " +
            // "<h3>温馨提示</h3>" +
            "<div class='workContext p14'>" +
            "<ul class='error_message'>" + msg + "</ul>" +
            "</div>" +
            "<div class='work_btns'>" +
            "<button class='commonBtn_suc p16'>" + txtSur + "</button>" +
            "<button class='commonBtn_cancel p16'>" + txtAnnuler + "</button>" +
            "</div>" +
            "</div>";
        $('body').append(result);
        $('.commonBtn_cancel').on('click', function () {
            $('.workInfo, .mark, ._loading').remove();
            return;
        });
    },
    versions: function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核               
            presto: u.indexOf('Presto') > -1, //opera内核               
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核               
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile/) || !!u.match(/Windows Phone/) || !!u.match(/Android/) || !!u.match(/MQQBrowser/),
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端               
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器               
            iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器               
            iPad: u.indexOf('iPad') > -1, //是否iPad               
            webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部           
        };
    }(),

    // 操作提示
    showTip: function (msg, url) {
        //console.log("url is "+ url) ;
        msg = msg || '出错啦，请稍后再试～';
        $('#tip-mes').html(msg);
        if (url) {
            $('#tip-box').show().delay(3000).hide(0);
            setTimeout(function () {
                window.location.href = url;
            }, 2000);
        } else {
            $('#tip-box').show().delay(3000).hide(0);
        }
    },
    //随机生成不同的随机数
    rdms: function (arrs, num) {
        while (true) {
            var isExists = false;
            var random = parseInt(num * (Math.random()))
            // 判断当前随机数是否已经存在
            for (var i = 0; i < arrs.length; i++) {
                if (random === arrs[i]) {
                    isExists = true;
                    break;
                }
            }
            if (!isExists)
                arrs.push(random);
            // 如果有5位随机数了，就跳出
            if (arrs.length === 5)
                break;
        }
        arrs = arrs.sort(function (a, b) {
            return a - b
        })
    },

    /** 
     * 时间戳转化为年 月 日 时 分 秒 
     * number: 传入时间戳 
     * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
     * fn.formatTime('1350052653','Y-M-D h:m:s')
     */
    formatTime: function (number, format) {

        var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
        var returnArr = [];

        var date = new Date(number);
        returnArr.push(date.getFullYear());
        returnArr.push(this.formatNumber(date.getMonth() + 1));
        returnArr.push(this.formatNumber(date.getDate()));

        returnArr.push(this.formatNumber(date.getHours()));
        returnArr.push(this.formatNumber(date.getMinutes()));
        returnArr.push(this.formatNumber(date.getSeconds()));

        for (var i in returnArr) {
            format = format.replace(formateArr[i], returnArr[i]);
        }
        return format;
    },

    //数据转化  
    formatNumber: function (n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    },
    //正则判断大全
    testRule: {

        //邮箱正则判断
        isEmail: function (str) {
            var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            return reg.test(str);
        },

        //不能输入汉字
        isWord: function (str) {
            var reg = /[\W]/;
            return reg.test(str);
        },

        //手机号正则判断
        isTel: function (str) {
            var reg = /^(0|86|17951)?(13[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9]|14[57])[0-9]{8}$/;
            return reg.test(str);
        },

        //身份证正则判断
        isCard: function (str) {
            var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
            return reg.test(str);
        },

        //邮政编号正则判断
        isPostal: function (str) {
            var reg = /^[1-9]\d{5}(?!\d)$/;
            return reg.test(str);
        },

        //URl正则判断
        isUrl: function (str) {
            var reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
            return reg.test(str);
        },

        //只能输入数字正则判断
        isNum: function (str) {
            var reg = /^\d+$/;
            return reg.test(str);
        },

        //日期正则判断
        isDate: function (str) {
            var reg = /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/;
            return reg.test(str);
        }
    },

    /**
           * 将页面地址的url后面所带的参数列表获取到，并且转换为json格式
           * @name    unEscapeToJson
           * @param   {String} url地址
           * @return  {json}  
           * 常用：var temp_url = decodeURI(window.location.href);
                   var tempJson = fn.unEscapeToJson(temp_url);  
           */
    unEscapeToJson: function (url) {
        var postData = url.substring(url.indexOf("?") + 1, url.length).split("&");
        var temp_json = {};
        for (var i = 0; i < postData.length; i++) {
            var temp_text = postData[i];
            var key = temp_text.substring(0, temp_text.indexOf("="));
            var val = temp_text.substring(temp_text.indexOf("=") + 1, temp_text.length);
            temp_json[key] = val;
        }
        return temp_json;
    },

    /**
       * 数组转化为树结构
       * @name    composeTree
       * @param   {Array} 数组
       * @return  {Array}  
       * 常用：var list = [
                      {id:1,pid:0,name:'一级'},
                      {id:2,pid:1,name:'一级1'},
                      {id:3,pid:1,name:'一级2'},
                      {id:4,pid:2,name:'一级1-1'}
                    ]
            let tree = composeTree(list)
            console.log(tree)
       */
    composeTree: function (list = []) {
        const data = JSON.parse(JSON.stringify(list)) // 深拷贝不改变源数据
        const result = []
        if (!Array.isArray(data)) {
            return result
        }
        data.forEach(item => {
            delete item.children
        })
        const map = {}
        data.forEach(item => {
            map[item.id] = item
        })
        data.forEach(item => {
            const parent = map[item.pid]
            if (parent) {
                (parent.children || (parent.children = [])).push(item)
            } else {
                result.push(item)
            }
        })
        return result
    },

    /*时间差比较：
          interval ：D表示查询精确到天数的之差
          interval ：H表示查询精确到小时之差
          interval ：M表示查询精确到分钟之差
          interval ：S表示查询精确到秒之差
          interval ：T表示查询精确到毫秒之差
          */
    dateDiff: function (interval, date1, date2) {
        var objInterval = { 'D': 1000 * 60 * 60 * 24, 'H': 1000 * 60 * 60, 'M': 1000 * 60, 'S': 1000, 'T': 1 };
        interval = interval.toUpperCase();
        //var dt1 = new  Date(Date.parse(date1.replace(/-/g, '/')));
        //var dt2 = new  Date(Date.parse(date2.replace(/-/g, '/')));
        var dt1 = new Date(Date.parse(date1.replace(/-/g, '/')));
        var dt2 = new Date(Date.parse(date2.replace(/-/g, '/')));
        try {
            return Math.round((dt2.getTime() - dt1.getTime()) / eval('objInterval.' + interval));
        } catch (e) {
            return e.message;
        }
    },

    // 深度解析url
    parseURLS: (url) => {
        var a = document.createElement('a');
        a.href = url;
        return {
            source: url,
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            port: a.port,
            query: a.search,
            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
            hash: a.hash.replace('#', ''),
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
            segments: a.pathname.replace(/^\//, '').split('/'),
            params: (function () {
                var ret = {};
                var seg = a.search.replace(/^\?/, '').split('&').filter(function (v, i) {
                    if (v !== '' && v.indexOf('=')) {
                        return true;
                    }
                });
                seg.forEach(function (element, index) {
                    var idx = element.indexOf('=');
                    var key = element.substring(0, idx);
                    var val = element.substring(idx + 1);
                    ret[key] = val;
                });
                return ret;
            })()
        };
    },
    routeQuery: function (tempJson) {
        let userInfo = window.localStorage.getItem("userInfo")
        console.log(tempJson.accountType)
        if (userInfo) {
            if (tempJson.token) {
                if (JSON.parse(userInfo).token != tempJson.token) {
                    window.localStorage.setItem('userInfo', JSON.stringify({
                        token: tempJson.token.split("?")[0],
                        accountType: tempJson.accountType != undefined ? tempJson.accountType.split("?")[0] : ''
                    }))
                }
            }
        } else {
            if (tempJson.token) {
                window.localStorage.setItem('userInfo', JSON.stringify({
                    token: tempJson.token.split("?")[0],
                    accountType: tempJson.accountType != undefined ? tempJson.accountType.split("?")[0] : ''
                }))
            }
        }
    }
}