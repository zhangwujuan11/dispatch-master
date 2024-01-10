var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);
var userInfo = { token : ""};
//创建vue对象
var vm = new Vue({
    el: "#app",
    data: {
        

    },
    methods: {


    },
    mounted: function() {
        var _self = this;
        
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
            
        }, 10)
    },

    computed: {


    }
});