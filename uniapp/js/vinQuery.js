var temp_url = decodeURI(window.location.href),
  tempJson = fn.unEscapeToJson(temp_url);
var data = {
  classNative: 4,
  carList: [],
  carInfoList: [],
  vinSearch: '',
  parts: "",
  carType: "",
  glassOptions: ['左后', '左前', '后档', '天窗', '前挡', '右后', '右前'],
  lokShow: false,
  cropperShow: false,
  cropperUrl: '',
  base64Codes: '',

}

var vm = new Vue({
  el: '#app',
  data: data,
  methods: {
    look: function () {
      this.lokShow = !this.lokShow
    },
    clickGlass(index) {
      this.parts = this.glassOptions[index]
      this.classNative = index
    },

    collect() {
      var _self = this
      if (this.vinSearch === '') {
        alert('请输入VIN码')
      } else {
        window.location.href = "vinResults.html?vin=" + _self.vinSearch + "&parts=" + _self.parts + "&carType=" + _self.carType;
        _self.cropperUrl = ''
        _self.cropperShow = false;
      }

    },
    authority(){
      if (navigator.userAgent.indexOf("Android") !== -1) { 
        $('.authority_mask').css('display','block');
      }
    },
    hideAuthorityMask(){
      $('.authority_mask').css('display','none');
    },
    //识别VIN码
    btnUploadFile(index) {
      $('.authority_mask').css('display','none');
      console.log(index)
      var _self = this;
      let es = window.event || e;
      let el = es.currentTarget || es.srcElement;
      //获取图片文件
      var imgFile = el.files[0];

      var reader = new FileReader();
      reader.onloadstart = function (e) {
        _self.isShowMask = true;
        console.log("开始读取....");
      }
      reader.onprogress = function (e) {
        console.log("正在读取中....");
      }
      reader.onabort = function (e) {
        console.log("中断读取....");
      }
      reader.onerror = function (e) {
        console.log("读取异常....");
      }
      reader.onload = async (evt) => {
        if (imgFile.size / 1024 > 1024 * 1.2) {
          fn.dealImage(evt.target.result, {
            quality: 0.4
          }, function (base64Codes) {
            _self.cropperUrl = base64Codes
            _self.cropperShow = true
            _self.getCropper()
          })
        } else {
          _self.cropperUrl = evt.target.result
          _self.cropperShow = true
          _self.getCropper()
        }
      }
      reader.readAsDataURL(imgFile);
    },
    //小写转大写
    toUpperCase(e) {
      this.vinSearch = e.toUpperCase();
    },

    getVin() {
      var _self = this
      var params = {
        base64Data: this.base64Codes,
        bizType: 1
      }
      Service.vinCode('POST', JSON.stringify(params), (function callback(data) {
        console.log("数据：", data)
        if (data.code === 200) {
          let vinSearchs = JSON.parse(data.data.words_result)[0].words
          _self.vinSearch = vinSearchs
          _self.cropperUrl = ''
          _self.cropperShow = false;
          window.location.href = "vinResults.html?vin=" + _self.vinSearch + "&parts=" + _self.parts + "&carType=" + _self.carType;
        }
      }))
    },
    getCropper() {
      const that = this
      var $image = $('.img-container > img'),
        $dataX = $('#dataX'),
        $dataY = $('#dataY'),
        $dataHeight = $('#dataHeight'),
        $dataWidth = $('#dataWidth'),
        $dataRotate = $('#dataRotate'),
        times,
        options = {
          aspectRatio: 15 / 3,
          preview: '.img-preview',
          crop: function (data) {
            $dataX.val(Math.round(data.x));
            $dataY.val(Math.round(data.y));
            $dataHeight.val(Math.round(data.height));
            $dataWidth.val(Math.round(data.width));
            $dataRotate.val(Math.round(data.rotate));
          }
        };
      times = setInterval(() => {
        if ($image[0].src.split('.').indexOf('html') == -1) {
          clearTimeout(times)
          $image.on({
            'build.cropper': function (e) {
              console.log(e.type);
            },
            'built.cropper': function (e) {
              console.log(e.type);
            },
            'dragstart.cropper': function (e) {
              console.log(e.type, e.dragType);
            },
            'dragmove.cropper': function (e) {
              console.log(e.type, e.dragType);
            },
            'dragend.cropper': function (e) {
              console.log(e.type, e.dragType);
            },
            'zoomin.cropper': function (e) {
              console.log(e.type);
            },
            'zoomout.cropper': function (e) {
              console.log(e.type);
            }
          }).cropper(options);
        }
      }, 1000)
      $(document.body).on('click', '[data-method]', function () {
        var data = $(this).data(),
          $target,
          result;
        if (data.method) {
          data = $.extend({}, data); // Clone a new one
          if (typeof data.target !== 'undefined') {
            $target = $(data.target);
            if (typeof data.option === 'undefined') {
              try {
                data.option = JSON.parse($target.val());
              } catch (e) {
                console.log(e.message);
              }
            }
          }

          result = $image.cropper(data.method, data.option);
          result.className = "canvasResult"
          if (data.method === 'getCroppedCanvas') {
            $('.docs-preview').html(result);
            setTimeout(() => {
              var canvas = $('.canvasResult')
              that.base64Codes = canvas[0].toDataURL("image/jpeg")
              that.cropperUrl = ''
              that.cropperShow = false;
              that.getVin()
            }, 300)
          }

          if ($.isPlainObject(result) && $target) {
            try {
              $target.val(JSON.stringify(result));
            } catch (e) {
              console.log(e.message);
            }
          }
        }
      }).on('keydown', function (e) {
        switch (e.which) {
          case 37:
            e.preventDefault();
            $image.cropper('move', -1, 0);
            break;
          case 38:
            e.preventDefault();
            $image.cropper('move', 0, -1);
            break;
          case 39:
            e.preventDefault();
            $image.cropper('move', 1, 0);
            break;
          case 40:
            e.preventDefault();
            $image.cropper('move', 0, 1);
            break;
        }
      });
    },
    clos() {
      this.cropperUrl = ''
      this.cropperShow = false
    }
  },
  mounted: function () {
    this.vinSearch = ''
    this.parts = this.glassOptions[this.classNative]
    this.cropperUrl = '';
    this.cropperShow = false;
    $('.cropperModal').height(document.body.clientHeight + 'px')
    //初始化vue后,显示vue模板布局
    setTimeout(function () {
      document.getElementById("appContent").style.display = "block";
    }, 300)

  }
})