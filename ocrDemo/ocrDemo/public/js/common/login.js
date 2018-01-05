
$(document).ready(function () {

    $('#mLoginId').focus();

    $('#sendLoginBtn').click(function () {
        $('#loginfrm').submit();
    });

    $('#mLoginPass').keyup(function(e){
        if(e.keyCode == 13) {
            $('#sendLoginBtn').click();
        }
    });
})
