


$(document).ready(function () {
    var fileTarget = $('.gallery_wrap .upload-hidden');

    // 파일선택버튼 클릭 후 (파일첨부)
    fileTarget.on('change', function () { // 값이 변경되면
        var chkExtStr = "jpg|png|gif";
        var thumbxet = $(this).val().slice($(this).val().indexOf(".") + 1).toLowerCase();    // ie10이하 버전 확장자 체크
        if (chkExtStr.indexOf(thumbxet) < 0) {
            alert("이미지 파일(jpg, png, gif, bmp)만 등록 가능합니다\.");
            return;
        } else {
            //용량 체크
            var fileSize = $(this)[0].files[0].size;
            //10MB이하
            var maxSize = 1024 * 1024 * 10;
            if (fileSize > maxSize) {
                alert("이미지 파일 크기는 10MB를 초과할 수 없습니다");
            } else {
                if (window.FileReader) {
                    var filename = $(this)[0].files[0].name;
                } else {
                    var filename = $(this).val().split('/').pop().split('\\').pop(); // 파일명만 추출
                }

                // 추출한 파일명 삽입
                $(this).siblings('#upload-name').text(filename);
                $('#btn_fileupload').removeAttr("disabled");
                $('#btn_fileupload').css('opacity', 1);
            }
        }
    });

    //미리보기 시작-----------
    $("#upload_file").change(function () {
        //alert(this.value); //선택한 이미지 경로 표시
        readURL(this);
    });
    //미리보기 처리함수
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader(); //파일을 읽기 위한 FileReader객체 생성
            reader.onload = function (e) {
                //파일 읽어들이기를 성공했을때 호출되는 이벤트 핸들러
                $('#previewPic').attr('src', e.target.result);
                //이미지 Tag의 SRC속성에 읽어들인 File내용을 지정
                //(아래 코드에서 읽어들인 dataURL형식)
            }
            reader.readAsDataURL(input.files[0]);
            //File내용을 읽어 dataURL형식의 문자열로 저장
        }
    }//readURL()--
    //미리보기 끝-------------

    // 저장 버튼 클릭 시
    $("#uploadForm").tiValidate({
        submitBtn: "btn_fileupload",
        callback: function ($el, e) {
            //파일업로드처리
            fn_fileUpload();
        }
    });




    //image rotation
    $('.floatLeft').mouseover(function () {
        if ($('#img').attr('src') != null) {
            $('#rotBtn').show();
        }
    }).mouseout(function () {
        $('#rotBtn').hide();
    });
    $('#rotBtn').click(function (e) {
        angleCnt++;
        var angle = 90 * (angleCnt % 4);
        $('#img').rotate(angle);
        $('#rotation').val(angle);

    });





    $('#btn_crte_insert2').click(function () {

        var aa = '';
        $.ajax({
            url: '/translator',                //주소
            dataType: 'json',                  //데이터 형식
            type: 'POST',                      //전송 타입
            data: {'test':'test'},      //데이터를 json 형식, 객체형식으로 전송

            success: function(result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
                

                if ( result['result'] == true ) {

                    var obj = JSON.parse(result['value']);
                    console.log(obj);
                    //$('#transTest').html(aa);
                    
                    
                }
            } //function끝

        }); // ------      ajax 끝-----------------


    });

    $('#btn_crte_insert3').click(function () {
        $.ajax({
            url: '/bingSpeech',                //주소
            dataType: 'json',                  //데이터 형식
            type: 'POST',                      //전송 타입
            data: {'test':'test'},      //데이터를 json 형식, 객체형식으로 전송

            success: function(result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
                console.log();
            } //function끝

        });
    });

    $('#btn_crte_insert4').click(function () {
        
        $("#chkTranVal").trigger("click");

    });


    //utter 체크박스 전체선택 
    $('#allCheck').parent().click(function() {
        if (typeof $('#allCheck').parent().attr('checked') != 'undefined') {
            $("input[name=ch1]").each(function() {
                if ( typeof $(this).parent().attr("checked") == 'undefined' ) {
                    $(this).parent().attr("checked", '');
                }
            });
        } else {
            $("input[name=ch1]").each(function() {
                if ( typeof $(this).parent().attr("checked") != 'undefined' ) {
                    $(this).parent().removeAttr('checked');
                }
            });
        }
    });



    $('#btn_ocrText').click(function() {

        var ocrArr = new Array();
        
        $("input[name=ch1]").each(function() {

            if ( typeof $(this).parent().attr("checked") != 'undefined' ) {
                ocrArr.push($(this).parents('tr').find('input[name=ocrSelText]').val());
            }
        
        });

        $.ajax({
            url: '/translator',                //주소
            dataType: 'json',                  //데이터 형식
            type: 'POST',                      //전송 타입
            data: {'ocrArr':ocrArr},      //데이터를 json 형식, 객체형식으로 전송

            success: function(result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
                

                if ( result['result'] == true ) {

                    var obj = JSON.parse(result['value']);
                    console.log(obj);
                    $('.js-modal-close').trigger('click');

                    var transList = obj['ArrayOfGetTranslationsResponse'].GetTranslationsResponse;
                    for (var i=0; i<transList.length; i++) {
                        resultArrEng.push(transList[i].Translations.TranslationMatch.TranslatedText._text);
                    }
                    
                }
            } //function끝
        });

    });

    $('#btn_speak').click(function () {
        $.ajax({
            url: '/bingSpeech',                //주소
            dataType: 'json',                  //데이터 형식
            type: 'POST',                      //전송 타입
            data: {'resultArrEng':resultArrEng},      //데이터를 json 형식, 객체형식으로 전송

            success: function(result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
                console.log();
            } //function끝

        });
    });

});

//checkbox 선택시 이벤트 $(this).attr("checked")
$(document).on('click','div[type=checkbox]',function(event){

    if (typeof $(this).attr("checked") == 'undefined') {
        $(this).attr("checked", "");
    } else {
        $(this).removeAttr('checked');
    }
    
});







function uploadDlgImg() {

    //파일입력초기화
    initFile();
    
    // 이미지 업로드 표시
    $("#btn_uploadDlgImg").trigger("click");
}

function initFile() {
    $('#upload-name').text('선택된 파일 없음');

    //파일객체 초기화
    if ($.browser.msie) {
        // ie 일때 input[type=file] init.
        $("input[name=uploadFile]").replaceWith( $("input[name=uploadFile]").clone(true) );
        $('.modal-body .upload-hidden').replaceWith( $('.modal-body .upload-hidden').clone(true) );
    } else {
        // other browser 일때 input[type=file] init.
        $("input[name=uploadFile]").val("");
        $('.modal-body .upload-hidden').val("");
    }
    $('#btn_fileupload').attr("disabled","disabled");
    $('#btn_fileupload').css('opacity', 0.5);
    //미리보기 초기화
    $('#previewPic').removeAttr('src');

    $('#ocrValidationDiv').html('<input type="text" name="ocrValidation" value="" /> ');
    
}

function fn_fileUpload() {
    //파일정보입력체크
    if ($.isEmptyObject($("input[name=uploadFile]").val())) {
        alert("파일 정보를 입력 해 주세요");
        return false;
    }


    processImage();
}


var validationArr = [ "주의", "포함", "제품" ]; 

var resultArr;
var resultArrEng = new Array();
function addTextOfLine(data) {
    resultArr = new Array();
    for (var i = 0; i < data.length; i++) {
        var lines = data[i].lines;
        for (var j = 0; j < lines.length; j++) {
            var words = lines[j].words;
            var textTmp = '';
            for (var k = 0; k < words.length; k++) {
                textTmp += words[k].text + (k == data[i].lines[j].words.length - 1 ? '' : ' ');
            }
            resultArr.push(textTmp);
        }
    }
}


function processImage() {
    $('#dataForm').html('');
    var subscriptionKey = "9edb0cb7e5ed417b84614a6a3f3988ab";
    var uriBase = "https://westus.api.cognitive.microsoft.com/vision/v1.0/ocr";


    // Request parameters.
    var params = {
        "language": "unk",//"language": "unk",zh-Hant
        "detectOrientation": "true",
    };

    // image url
    //var sourceImageUrl = 'http://hyjocr.azurewebsites.net/uploads/ocr01.jpg';
    var azureBaseUrl = 'http://hyjocr.azurewebsites.net/uploads/';
    var sourceImageUrl = 'ojinga-size.jpg';
    //var sourceImageUrl =  $("input[name=uploadFile]").val();//document.getElementById("inputImage").value;
    //var sourceImageUrl = 'http://hyjocr.azurewebsites.net/uploads/ocr01.jpg';

    // Perform the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Content-Type", "application/json");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + azureBaseUrl + sourceImageUrl + '"}',
    })

        .done(function (data) {
            //appendTable(data.regions);
            //appendForm(data.regions)
            //console.log(data);
            //$("#responseTextArea").val(JSON.stringify(data, null, 2));
            
            addTextOfLine(data.regions);
            $('#rotation').val('0');
            $('#img').attr('src', azureBaseUrl+sourceImageUrl);
            pushValidationArr();
            makeHtmlOcr();
            initCheckBox();
            $('#img_uploadV .js-modal-close').trigger('click');

            $("#chkTranVal").trigger("click");
            
    
        })

        .fail(function (jqXHR, textStatus, errorThrown) {
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
}

function pushValidationArr() {
    $('input[name=ocrValidation]').each( function() {

        if ( $(this).val() != '' ) {
            validationArr.push($(this).val());
            if($(this).val() == '돼지') {
                validationArr.push('고기');
            }
        }
    });
    
    
}


function makeHtmlOcr() {
    //$('#ocrTable')

    var ocrHtml = '';
    for (var i=0; i<resultArr.length; i++) {
        /*
        var ocrText = resultArr[i];
        if (ocrText.indexOf('고기') != -1 || ocrText.indexOf('주의') != -1 || ocrText.indexOf('돼지') != -1 
                                            || ocrText.indexOf('포함') != -1 ||  ocrText.indexOf('제품') != -1 ) {
            ocrHtml += '<tr> <td> <div class="check-radio-tweak-wrapper" type="checkbox" checked="">';
            ocrHtml += '<input name="ch1" class="tweak-input" type="checkbox"  onclick="" /> </div> </td>';
        } else {
            ocrHtml += '<tr> <td> <div class="check-radio-tweak-wrapper" type="checkbox">';
            ocrHtml += '<input name="ch1" class="tweak-input" type="checkbox"  onclick="" /> </div> </td>';
        }
        */
        ocrHtml += '<tr> <td> <div class="check-radio-tweak-wrapper" type="checkbox">';
        ocrHtml += '<input name="ch1" class="tweak-input" type="checkbox"  onclick="" /> </div> </td>';
        ocrHtml += '<td class="txt_left" > <input type="text" style="width: 90% !important;" name="ocrSelText" value="' + resultArr[i] + '" /> </td></tr>';
    }

    $('#ocrTableBody').html(ocrHtml);
}

function initCheckBox() {
    //validationArr
    $("input[name=ch1]").each(function() {
        for (var i=0; i< validationArr.length; i++ ){

            if ( $(this).parents('tr').find('input[name=ocrSelText]').val().indexOf( validationArr[i] ) != -1 ) {
                $(this).parent().attr("checked", '');
            }
        }
        
    });
}


function addValidation() {
    
    $('#ocrValidationDiv').append(
        '<input type="text" name="ocrValidation" value="" /> '
    );

}

/*
function translate() {
    var aa = '';
    $.ajax({
        url: '/index/translator',                //주소
        dataType: 'json',                  //데이터 형식
        type: 'POST',                      //전송 타입
        data: {'iptUtterance':'test'},      //데이터를 json 형식, 객체형식으로 전송

        success: function(result) {          //성공했을 때 함수 인자 값으로 결과 값 나옴
            

            if ( result['result'] == true ) {
                console.log('test');
            }
        } //function끝

    }); // ------      ajax 끝-----------------
}

*/


