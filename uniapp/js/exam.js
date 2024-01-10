$(function() {
    //生成试题 
    var temp_url = decodeURI(window.location.href);
    var tempJson = fn.unEscapeToJson(temp_url);
    var realId = tempJson.id ? tempJson.id : "";
    var personId = tempJson.personId ? tempJson.personId : "";
    var timer=null;
    clearInterval(timer);
    //var url = 'http://wenji.zgjtb.com:4455/' + 'api/subject/' + realId;
    // var url = HOST + 'shop/exam/subject/detail';
    var params = {
        subjectId: realId
    }
    Service.getExamDetail('GET', params, (function callback(data) {

        if (data.code == 200) {
            $('.question_tit').html(data.data.subjectName);
            $('.postion').val(data.data.postion);
            $('.answerStartTime').val(data.data.answerStartTime)
            $('.restMin').html(data.data.answerTime);
            //30分钟倒计时
            //var countdown = document.getElementById("countdown");

            var time = data.data.answerTime * 60; //30分钟换算成1800秒
           //var time = 10;
           timer = setInterval(function() {
                time = time - 1;
                var minute = parseInt(time / 60);
                var second = parseInt(time % 60);
                $('.restMin').html(minute);
                $('.restSec').html(second);
                $('.time').html(time);
                if(time < 301 && time > 299){
                    fn.showTip('剩余5分钟，请尽快作答！')
                }else if(time<1){
                    fn.showTip("考试时间结束，请重新作答！");
                    setTimeout(function(){
                        window.location.href = "shopUserQualCert.html"
                    },2000)
                    clearInterval(timer);
                }
            }, 1000);

            var dataRst = data.data.qContentVos;
            var result = '';
            $('.totalNum').html(dataRst.length)
            for (var i = 0; i < dataRst.length; i++) {

                if (dataRst[i].qType == 'ONE_CHOICE') {
                    result += '<dl class="question singleAnswer" realId="' + dataRst[i].contentId + '">' +
                        '<dt>' + (i + 1) + '、' + dataRst[i].examTitle + '</dt>';
                    var childRst = '';
                    for (var j = 0; j < dataRst[i].qItems.length; j++) {
                        if (dataRst[i].qItems[j].qItemType == 'PLAIN_TEXT') {
                            childRst += '<dd class="p_iconRadio">' +
                                '<i class="iconRadio"></i>' +
                                '<p><em class="test">' + dataRst[i].qItems[j].choice + '</em>.' + dataRst[i].qItems[j].content + '</p>' +
                                '<div class="subInner">';
                            var subItem = '';

                            if (dataRst[i].qItems[j].subItems) {
                                var sublen = dataRst[i].qItems[j].subItems.length;
                                for (var k = 0; k < sublen; k++) {
                                    subItem += dataRst[i].qItems[j].subItems[k].content + '，';
                                }
                                subItem = subItem.substring(0, subItem.length - 1);
                            }
                            childRst += subItem +
                                '</div>' +


                                '</dd>';
                        } else if (dataRst[i].qItems[j].qItemType == 'INPUT') {
                            childRst += '<dd class="p_iconRadio">' +
                                '<i class="iconRadio"></i>' +
                                '<p><em class="test">' + dataRst[i].qItems[j].choice + '</em>.' + dataRst[i].qItems[j].content +
                                '<input type="text" class="unKnowInput" value="" />' +
                                //'<textarea type="text" class="unKnowInput" value="" /></textarea>' +
                                '</p>' +
                                '</dd>'
                        }
                    }
                    result += childRst +
                        '</dl>'
                } else if (dataRst[i].qType == 'MULTI_CHOICE') {

                    result += '<dl class="question mulAnswer" realId="' + dataRst[i].contentId + '" maxAnswer="' + dataRst[i].maxAnswer + '" >' +
                        '<dt>' + dataRst[i].qTitle + '</dt>';
                    var mulchildRst = '';
                    for (var j = 0; j < dataRst[i].qItems.length; j++) {
                        if (dataRst[i].qItems[j].qItemType == 'PLAIN_TEXT') {
                            mulchildRst += '<dd class="p_iconRadio">' +
                                '<i class="iconRadio"></i>' +
                                '<p><em class="test">' + dataRst[i].qItems[j].choice + '</em>.' + dataRst[i].qItems[j].content + '</p>' +
                                '<div class="subInner">';
                            var subItem = '';

                            if (dataRst[i].qItems[j].subItems) {
                                var sublen = dataRst[i].qItems[j].subItems.length;
                                for (var k = 0; k < sublen; k++) {
                                    subItem += dataRst[i].qItems[j].subItems[k].content + "，";
                                }
                                subItem = subItem.substring(0, subItem.length - 1);
                            }
                            mulchildRst += subItem +
                                '</div>' +
                                '</dd>'
                        } else if (dataRst[i].qItems[j].qItemType == 'INPUT') {
                            mulchildRst += '<dd class="p_iconRadio">' +
                                '<i class="iconRadio"></i>' +
                                '<p><em class="test">' + dataRst[i].qItems[j].choice + '</em>.' + dataRst[i].qItems[j].content +
                                '<input type="text" class="unKnowInput" value="" />' +
                                //'<textarea type="text" class="unKnowInput" value="" /></textarea>' +
                                '</p>' +
                                '</dd>'
                        }
                    }

                    result += mulchildRst + '</dl>'
                } else if (dataRst[i].qType == 'TEXT') {
                    result += '<dl class="question mulAnswer" realId="' + dataRst[i].contentId + '" maxAnswer="' + dataRst[i].maxAnswer + '" >' +
                        '<dt>' + dataRst[i].qTitle + '</dt>';
                    var mulchildRst = '';
                    result += mulchildRst + '</dl>'
                }


            }
            //console.log('单选结果：', result)
            $('.questionList').html(result);
            //题目选中
            setTimeout(function() {
                optionQustion();

            }, 200)

        }



    }))

    function optionQustion() {
        $('.questionBot').show();
        $('.p_iconRadio').on('click', function(event) {
            event.preventDefault();
            event.stopPropagation();

            if ($(this).parents('.question').hasClass("singleAnswer")) {
                $(this).find('.iconRadio').addClass("iconOk")
                    .parent().siblings().find('.iconRadio').removeClass("iconOk");

            } else if ($(this).parents('.question').hasClass("mulAnswer")) {
                //$(this).find('.iconRadio').addClass("iconOk");
                var maxLen = $(this).parents('.question').attr('maxAnswer');
                // console.log('最多选项：',maxLen);
                var reaLen = 0;
                if ($(this).find('.iconRadio').hasClass("iconOk")) {
                    $(this).find('.iconRadio').removeClass("iconOk");
                } else {
                    $(this).find('.iconRadio').addClass("iconOk");
                    reaLen = $(this).parents('dl').find('.iconOk').length;
                    if (reaLen > maxLen) {
                        fn.commonWindowSur('最多选三项!');
                        $('.subOk').addClass("warnError");
                        $(this).find('.iconRadio').removeClass("iconOk");
                    }
                }
            }
            var currentNum = 0;
            for (var i = 0; i < $('.question').length; i++) {
                if ($('.question').eq(i).find(".iconRadio").hasClass("iconOk")) {
                    currentNum += 1;
                }
            }
            $('.currentNum').html(currentNum);



        })

        //题目重置
        $('.queView').on('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            if ($('.iconRadio').hasClass("iconOk")) {
                $('.iconRadio').removeClass("iconOk");
            }
            $('.code').val('');
        })

        //题目提交
        $('.queSub').on('click', function() {
            if (parseInt($('.time').html())<1) {
                fn.showTip("考试时间结束，请重新作答！");
                setTimeout(function(){
                    window.location.reload();
                },1000)
                return false;
            }

            var singlen = $('.singleAnswer').length;
            var mulLen = $('.mulAnswer').length;
            var queLen = $('.question').length;

            var obj = new Object();
            obj.answerContents = new Array();

            //单选
            for (var i = 0; i < queLen; i++) {
                var secObj = {};
                var iconChecked = $('.question').eq(i).find(".iconOk");

                if ($('.question').eq(i).find(".iconRadio").hasClass("iconOk")) {
                    var testLen = iconChecked.length;
                    secObj.answerItem = [];

                    for (var j = 0; j < testLen; j++) {
                        var subObj = {};
                        if (iconChecked.eq(j).parent().find('input').hasClass("unKnowInput")) {

                            subObj.answer = iconChecked.eq(j).parent().find('.test').html();
                            subObj.content = iconChecked.eq(j).parent().find('.unKnowInput').val();

                        } else {
                            subObj.answer = iconChecked.eq(j).parent().find('.test').html();
                            subObj.content = '';

                        }
                        secObj.answerItem.push(subObj);
                    }
                    //console.log(secObj.answerItem);
                    secObj.qcontentId = $('.question').eq(i).attr('realId');
                    //  console.log('qcontentId:',secObj.qcontentId)
                    obj.answerContents.push(secObj);
                }

            }
            obj.subjectId = realId;
            obj.postion = $('.postion').val();
            obj.answerStartTime = $('.answerStartTime').val();
            obj.personId = personId;
            console.log("题目答案数据：", obj)
            //alert(obj.answerContents.length)
            if (queLen != obj.answerContents.length) {
                fn.showTip("所有题目请全部作答！");
                return false;
            }
            var params = obj;
            Service.answerExam('POST', JSON.stringify(params), (function callback(data) {
                //console.log("数据：", data)
                if (data.code == 200) {

                    fn.showTip('提交成功，感谢您的回答！');
                    setTimeout(function() {
                        window.location.href = "shopUserQualCert.html";
                    }, 2000)
                }
            }))
            //   console.log('提交内容：',obj.subjectId)
        })
    }
})