// 파일첨부
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
}

function fn_fileUpload() {
    //파일정보입력체크
    if ($.isEmptyObject($("input[name=uploadFile]").val())) {
        alert("파일 정보를 입력 해 주세요");
        return false;
    }


    processImage();
}







function processImage() {
    $('#dataForm').html('');
    var subscriptionKey = "f2f4e2ebe5fb476e8b806b64ce383832";
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
            if ($('#rotation').val() == '') {
                //addTextOfLine(data.regions);
                $('#rotation').val('0');
                $('#img').attr('src', azureBaseUrl+sourceImageUrl);

                
                
            } else {
                $('#rotation').val('');
                appendDataForm(data.regions);
            }           
        })

        .fail(function (jqXHR, textStatus, errorThrown) {
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
}


