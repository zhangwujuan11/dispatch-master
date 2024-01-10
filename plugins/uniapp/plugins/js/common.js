/**
 * @移动端公共JS类
 * @author xiaodi Zhang 2016-3-11
 * @version 1.0.0
 */

var fn = {
    winH: window.innerHeight,
    winW: window.innerWidth,
    //url: "https://carpro.jd.com/",
    //apiUrl: 'http://101.201.141.221:8038/',

    hasClass: function(el, className) {
        var reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
        return reg.test(el.className)
    },

    addClass: function(el, className) {
        if (fn.hasClass(el, className)) {
            return
        }
        var newClass = el.className.split(' ')
        newClass.push(className)
        el.className = newClass.join(' ')
    },

    removeClass: function(ele, cls) {
        if (fn.hasClass(ele, cls)) {
            var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
            ele.className = ele.className.replace(reg, " ");
        }
    },
    versions: function() {
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
    removeAllClass: function(el, className) {
        var els = el.parentNode.children; // 所有同级
        for (var i = 0; i < els.length; i++) {
            fn.removeClass(els[i], className)
        }
    },

    // 保存当前状态 
    activeState: function(el, className) {
        var els = el.parentNode.children; // 所有同级
        for (var i = 0; i < els.length; i++) {
            fn.removeClass(els[i], className)
        }
        fn.addClass(el, className)
    },

    //字符替换
    replaceStr: function(str) {
        return str = str.replace(/style\=".+?"|style\=\'.+?\'/g, '');
    },
    //三位数字加个‘，’
    format_number: function(n) {
        var b = parseInt(n).toString();
        var len = b.length;
        if (len <= 3) { return b; }
        var r = len % 3;
        return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
    },
    //文本框换行、空格保存
    textareaTo: function(str) {
        var reg = new RegExp("\n", "g");
        var regSpace = new RegExp(" ", "g");
        str = str.replace(reg, "<br>");
        str = str.replace(regSpace, "&nbsp;");
        return str;
    },
    //数组去重
    uniqArrs: function(array) {
        var temp = []; //一个新的临时数组
        for (var i = 0; i < array.length; i++) {
            if (temp.indexOf(array[i]) == -1) {
                temp.push(array[i]);
            }
        }
        return temp;
    },

    //数组单个字段排序
    sortBy(field) {
        return function(a, b) {
            return a[field] - b[field];
        }
    },
    

    commonWindow: function(msg, text) {
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
        $('.work_btns').on('click', function() {
            $('.workInfo, .mark, ._loading').remove();
        })
    },

    commonWindowSur: function(msg, txtSur, txtAnnuler) {
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
        $('.commonBtn_cancel').on('click', function() {
            $('.workInfo, .mark, ._loading').remove();
            return;
        });
    },
    versions: function() {
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
    showTip: function(msg, url) {
        //console.log("url is "+ url) ;
        msg = msg || '出错啦，请稍后再试～';
        $('#tip-mes').html(msg);
        if (url) {
            $('#tip-box').show().delay(3000).hide(0);
            setTimeout(function() {
                window.location.href = url;
            }, 1000);
        } else {
            $('#tip-box').show().delay(3000).hide(0);
        }
    },
    //随机生成不同的随机数
    rdms: function(arrs, num) {
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
        arrs = arrs.sort(function(a, b) {
            return a - b
        })
    },

    /** 
     * 时间戳转化为年 月 日 时 分 秒 
     * number: 传入时间戳 
     * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
     * fn.formatTime('1350052653','Y-M-D h:m:s')
     */
    formatTime: function(number, format) {

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
    formatNumber: function(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    },
    //正则判断大全
    testRule: {

        //邮箱正则判断
        isEmail: function(str) {
            var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            return reg.test(str);
        },

        //不能输入汉字
        isWord: function(str) {
            var reg = /[\W]/;
            return reg.test(str);
        },

        //手机号正则判断
        isTel: function(str) {
            var reg = /^(0|86|17951)?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/;
            return reg.test(str);
        },

        //身份证正则判断
        isCard: function(str) {
            var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
            return reg.test(str);
        },

        //邮政编号正则判断
        isPostal: function(str) {
            var reg = /^[1-9]\d{5}(?!\d)$/;
            return reg.test(str);
        },

        //URl正则判断
        isUrl: function(str) {
            var reg = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
            return reg.test(str);
        },

        //只能输入数字正则判断
        isNum: function(str) {
            var reg = /^\d+$/;
            return reg.test(str);
        },

        //日期正则判断
        isDate: function(str) {
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
    unEscapeToJson: function(url) {
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

    /*时间差比较：
          interval ：D表示查询精确到天数的之差
          interval ：H表示查询精确到小时之差
          interval ：M表示查询精确到分钟之差
          interval ：S表示查询精确到秒之差
          interval ：T表示查询精确到毫秒之差
          */
    dateDiff: function(interval, date1, date2) {
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
    }

}