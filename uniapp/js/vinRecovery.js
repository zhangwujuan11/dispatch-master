// var temp_url = decodeURI(window.location.href),
//     tempJson = fn.unEscapeToJson(temp_url);


var data = {
    counterShow: false,
    counterNative: 0,
    counter: [
        {
            name: '请选择错误信息',
            show: false
        }
    ],
    glassList: [
        {
            name: '主机厂'
        }, {
            name: '厂商指导价'
        }, {
            name: '车型'
        }, {
            name: '年款'
        }, {
            name: '地盘号'
        }, {
            name: '零件号'
        }, {
            name: '供应商编码'
        }, {
            name: '本场编码'
        }, {
            name: '通用件'
        }
    ],
    carInfoList: [],
    vinSearch: '',
    changeRed: 0
}


var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        selectGlass(idx) {
            this.counter[this.counterNative].show = false
            this.counter[this.counterNative].name = this.glassList[idx].name
        },
        search(idx) {
            this.counterNative = idx
            this.counter[this.counterNative].show = !this.counter[this.counterNative].show
        },
        reds: function (index) {
            this.changeRed = index;
        },
        addNews() {
            this.counter.map(item => item.show = false)
            this.counter.push({ name: '请选择错误信息', show: false }) 
        },
    },
    mounted: function () {
       
    }
})