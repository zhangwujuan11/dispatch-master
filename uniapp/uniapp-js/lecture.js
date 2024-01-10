var temp_url = decodeURI(window.location.href),
    tempJson = fn.unEscapeToJson(temp_url);

var data = {
    showNav: false,
    isShow: false,
    openId: ""
}

var vm = new Vue({
    el: '#app',
    data: data,
    methods: {
        //显示菜单 menu
        toShowNav() {
            this.showNav = !this.showNav
        },

        //跳转详情页
        toDetail() {
            window.location.href ="detail.html"
        }

        

    },
    mounted: function() {
        var _self = this;

        //初始化vue后,显示vue模板布局
        setTimeout(function() {
            document.getElementById("appContent").style.display = "block";
            var mySwiper = new Swiper('.swiper-container', {
                effect: 'coverflow',
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false
                },
                grabCursor: true,
                centeredSlides: true,
                slidesPerView: 'auto',
                coverflowEffect: {
                    rotate: 50,
                    stretch: 0,
                    depth: 100,
                    modifier: 1,
                    slideShadows: true,
                },
                pagination: {
                    el: '.swiper-pagination',
                },
            });
            $('.swiper-container, .lecture-swiper').css("height", parseInt((300 * 100 * (window.innerWidth > 750 ? 750 : window.innerWidth)) / (640 * 100)) + 'px');
        }, 300)
        $(window).resize(function() {
            
            $('.swiper-container, .lecture-swiper').css("height", parseInt((300 * 100 * (window.innerWidth > 750 ? 750 : window.innerWidth)) / (640 * 100)) + 'px');
        });

    }
})