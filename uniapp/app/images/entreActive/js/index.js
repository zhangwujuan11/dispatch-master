var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo = { token: "" };
var vm = new Vue({
    el: '#app',
    data() {
        return {
            timeImg: '',
            timeShow: true
        }
    },
    methods: {
        navTo(url) {
            window.location.href = url
        },
        countdown: function () {
            // 定义结束时间戳
            const end = Date.parse(new Date('2020-11-12 23:59:59'))
            // 定义当前时间戳
            const now = Date.parse(new Date())
            // 做判断当倒计时结束时都为0
            if (now >= end) {
                this.day = 0
                this.hr = 0
                this.min = 0
                this.sec = 0
                return
            }
            // 用结束时间减去当前时间获得倒计时时间戳
            const msec = end - now
            let day = parseInt(msec / 1000 / 60 / 60 / 24) //算出天数
            let hr = parseInt(msec / 1000 / 60 / 60 % 24)//算出小时数
            let min = parseInt(msec / 1000 / 60 % 60)//算出分钟数
            let sec = parseInt(msec / 1000 % 60)//算出秒数
            //给数据赋值
            this.day = day
            this.hr = hr > 9 ? hr : '0' + hr
            this.min = min > 9 ? min : '0' + min
            this.sec = sec > 9 ? sec : '0' + sec
            if (hr == 00) {
                this.timeShow = false
            }
            this.timeImg = `images/active/${day + 1}.png`

            //定义this指向
            const that = this
            // 使用定时器 然后使用递归 让每一次函数能调用自己达到倒计时效果
            setTimeout(function () {
                that.countdown()
            }, 1000)
        },
        cosnt() {
            var _ordertimer = null;
            var data = new Date();
            var buyTime = '2020/11/12 23:59:59'; //开抢时间
            var nowTime = new Date(); //接口返回当前时间

            var dateDiff = new Date(nowTime) - new Date(getnow()); //请求时间戳与本地时间戳
            if (dateDiff < 0) {
                dateDiff = Math.abs(dateDiff);
            }

            if (new Date(nowTime) > new Date(buyTime)) {
                $('.time-range').hide(); //已开枪
                return;
            } else {
                this.timeImg = `images/active/${leftTimer(buyTime) + 1}.png`
                _ordertimer = setInterval(function () { leftTimer(buyTime) }, 1000);
            }

            // 获取当前时间 xxxx/xx/xx 00:00:00
            function getnow() {
                var year = data.getFullYear();
                var month = parseInt(data.getMonth() + 1) >= 10 ? parseInt(data.getMonth() + 1) : '0' + parseInt(data.getMonth() + 1);
                var day = data.getDate();
                var hours = data.getHours();
                var minutes = data.getMinutes();
                var seconds = data.getSeconds();
                var now = year + '/' + month + '/' + day + ' ' + hours + ':' + minutes + ':' + seconds;
                return now;
            }

            function leftTimer(enddate) {
                var leftTime = (new Date(enddate)) - new Date + dateDiff;
                var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); //计算剩余的天数
                var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
                var minutes = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟
                var seconds = parseInt(leftTime / 1000 % 60, 10); //计算剩余的秒数
                return days
            }
        },
    },
    mounted: function () {
        $('.item-list').css("height", $('.item-list').width() + 'px');
        $('.item-list img').css("margin-top", parseInt(($('.item-list').width() - 66) / 2) + 'px');
        $(window).resize(function () {
            $('.item-list').css("height", $('.item-list').width() + 'px');
            $('.item-list img').css("margin-top", parseInt(($('.item-list').width() - 66) / 2) + 'px');
        });
        this.cosnt()
    }
})