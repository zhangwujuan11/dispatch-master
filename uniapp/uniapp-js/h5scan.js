function H5Scan() {
    var selectedDeviceId = ''; //当前的摄像头
    var resultText = ''; //二维码内容
    var resultError = ''; //二维码报错信息
    var callback;

    //调用我们的scan.js里面的方法
    var codeReader = new ZXing.BrowserMultiFormatReader();


    this.callBack = function (fun) {
        callback = fun;
    };

    /**
     * 初始化摄像头
     */
    this.initFun = function () {
        var istemp = true;
        codeReader.listVideoInputDevices()
            .then((videoInputDevices) => {
                if (videoInputDevices.length >= 1) {
                    //获取最后一个摄像头
                    selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId
                    istemp = false
                }
            })
            .catch((err) => {
                console.error(err)
<<<<<<< HEAD
                alert("扫码失败:" + err);
=======
                dialogBox.showMessDialog("扫码失败:" + err);
>>>>>>> 2324c19fbec5444479b7ccadef91554927665e54
                // alert('扫码失败')
            })
            setTimeout(function () {
            if (istemp) {
                    fn.showTip('请前往应用授权管理打开易道大咖相机权限')
                    $('.modal').hide()
            }
        }, 1000)
    };
    /**
     * 打开摄像头
     */
    this.openCodeReader = function () {
        codeReader.decodeFromVideoDevice(selectedDeviceId, 'video', (result, err) => {
            if (result) {
                resultText = result.text;
                this.closeCodeReader('success', result.text); //关闭摄像
            }
            if (err && !(err instanceof ZXing.NotFoundException)) {
                resultError = err;
                this.closeCodeReader('error', err); //关闭摄像
            }
        })
    };

    /**
     *@关闭摄像头
     *  title = 成功/失败
     *  text = 二维码内容/报错信息
     *  resultText 扫码成功以后的内容
     *  resultError 扫码失败以后的报错信息
     * */
    this.closeCodeReader = function (title, text) {
        if (callback) {
            eval(callback(title,text));
        }
        codeReader.reset()
        $('.modal').hide() //关闭弹框
    };
    /**
     * 打开弹框
     */
    this.openScanFun = function () {
        this.openCodeReader()
        setTimeout(() => {
            $('.modal').show()
        }, 500)

    };
    /**
     * 初始化函数
     * @param callback 回调函数
     */
    this.init = function (callback) {
        this.callBack(callback);
        this.initFun();
        this.openScanFun();
    }
}
var H5Scan = new H5Scan();