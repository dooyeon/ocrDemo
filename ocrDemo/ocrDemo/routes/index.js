'use strict';
var express = require('express');
//
let https = require ('https');
//var replaceall = require("replaceall");
var convert = require('xml-js');

var request = require('request'),
    xmlbuilder = require('xmlbuilder'),
    wav = require('wav'),
    Speaker = require('speaker');

//var trans = require('./translator');
//
var router = express.Router();


/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', { title: 'Ocr Demo' });
});



router.post('/translator', async function (req, res) {
    
    var obj = req.body;
    var ocrArr = obj['ocrArr[]'];
    /*
    if (req.body['ocrArr'] != null ) {
        ocrArr = req.body['ocrArr'];
    }
    */
    let body = '';

    let subscriptionKey = '6f1dc9168f93481386135801377b1fb1';

    let host = 'api.microsofttranslator.com';
    let path = '/V2/Http.svc/GetTranslationsArray';
    
    let params = '';
    
    let from = "ko";
    let to = "en-us";
    
    let ns = "http://schemas.microsoft.com/2003/10/Serialization/Arrays";
    let content =
        "<GetTranslationsArrayRequest>" +
        "  <AppId />" +
        "  <From>" + from + "</From>" +
        '  <Texts>\n';
    for (var i=0; i<ocrArr.length; i++) {
        content += '    <string xmlns=\"' + ns + '\">' + ocrArr[i] + '</string>\n';
    }
    content += '  </Texts>\n' +
                '  <To>' + to + '</To>\n' +
                "  <MaxTranslations>10</MaxTranslations>" +
                '</GetTranslationsArrayRequest>\n';
    let GetTranslationsArray = function () {
        let request_params = {
            method : 'POST',
            hostname : host,
            path : path + params,
            headers : {
                'Content-Type' : 'text/html',
                'Ocp-Apim-Subscription-Key' : subscriptionKey,
            }
        };  

        let req = https.request (request_params, response_handler);
        req.write (content);
        req.end ();
    }

    let response_handler = function (response) {
        
        response.on ('data', function (d) {
            body += d;
        });
        response.on ('end', function () {

            var obj = '';//new Object();
            obj = convert.xml2json(body, {compact: true, spaces: 4});
            res.send({result:true, 'value':obj});

        });
        response.on ('error', function (e) {
            console.log ('Error: ' + e.message);
        });
    }


    try {
        await GetTranslationsArray();
        

    } catch(err) {
        console.log(err);
    } finally {

    }

});



/** speech api */
router.post('/bingSpeech', async function (req, res) {


    var obj = req.body;
    var resultArrEng = obj['resultArrEng[]'];

    var speakTxt = '';
    for (var i=0; i<resultArrEng.length; i++) {
        speakTxt += resultArrEng[i] + '. ';
    }

    // Note: The way to get api key:
    // Free: https://www.microsoft.com/cognitive-services/en-us/subscriptions?productId=/products/Bing.Speech.Preview
    // Paid: https://portal.azure.com/#create/Microsoft.CognitiveServices/apitype/Bing.Speech/pricingtier/S0
    var apiKey = "4acb8c980460468699d049f8152e896a";
    var ssml_doc = xmlbuilder.create('speak')
        .att('version', '1.0')
        .att('xml:lang', 'en-us')
        .ele('voice')
        .att('xml:lang', 'en-us')
        .att('xml:gender', 'Female')
        .att('name', 'Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)')
        //.txt('This is a demo to call Microsoft text to speech service.')
        .txt(speakTxt)
        .end();
    var post_speak_data = ssml_doc.toString();

    request.post({
    	url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
        headers: {
            'Ocp-Apim-Subscription-Key' : apiKey
        }
    }, function (err, resp, access_token) {
        if (err || resp.statusCode != 200) {
            console.log(err, resp.body);
        } else {
            try {
                request.post({
                    url: 'https://speech.platform.bing.com/synthesize',
                    body: post_speak_data,
                    headers: {
                        'content-type' : 'application/ssml+xml',
                        'X-Microsoft-OutputFormat' : 'riff-16khz-16bit-mono-pcm',
                        'Authorization': 'Bearer ' + access_token,
                        'X-Search-AppId': '07D3234E49CE426DAA29772419F436CA',
                        'X-Search-ClientID': '1ECFAE91408841A480F00935DC390960',
                        'User-Agent': 'TTSNodeJS'
                    },
                    encoding: null
                }, function (err, resp, speak_data) {
                    if (err || resp.statusCode != 200) {
                        console.log(err, resp.body);
                    } else {
                        try {
                            var reader = new wav.Reader();
                            reader.on('format', function (format) {
                                reader.pipe(new Speaker(format));
                            });
                            var Readable = require('stream').Readable;
                            var s = new Readable;
                            s.push(speak_data);
                            s.push(null);
                            s.pipe(reader);
                        } catch (e) {
                            console.log(e.message);
                        }
                    }
                });
            } catch (e) {
                console.log(e.message);
            }
        }
    });

});















module.exports = router;























/*
단순 array번역

router.post('/translator', async function (req, res) {


    let body = '';

    let subscriptionKey = '6f1dc9168f93481386135801377b1fb1';

    let host = 'api.microsofttranslator.com';
    let path = '/V2/Http.svc/TranslateArray';

    let target = 'en';
    let params = '';

    let ns = "http://schemas.microsoft.com/2003/10/Serialization/Arrays";
    let content =
        '<TranslateArrayRequest>\n' +
        // NOTE: AppId is required, but it can be empty because we are sending the Ocp-Apim-Subscription-Key header.
        '  <AppId />\n' +
        '  <Texts>\n' +
        '    <string xmlns=\"' + ns + '\">돼지</string>\n' +
        '    <string xmlns=\"' + ns + '\">소고기</string>\n' +
        '    <string xmlns=\"' + ns + '\">닭고기</string>\n' +
        '    <string xmlns=\"' + ns + '\">같은 제조시설</string>\n' +
        '  </Texts>\n' +
        '  <To>' + target + '</To>\n' +
        '</TranslateArrayRequest>\n';

    let GetTranslationsArray = function () {
        let request_params = {
            method : 'POST',
            hostname : host,
            path : path + params,
            headers : {
                'Content-Type' : 'text/html',
                'Ocp-Apim-Subscription-Key' : subscriptionKey,
            }
        };  

        let req = https.request (request_params, response_handler);
        req.write (content);
        req.end ();
    }

    let response_handler = function (response) {
        
        response.on ('data', function (d) {
            body += d;
        });
        response.on ('end', function () {

            var obj = '';//new Object();
            obj = convert.xml2json(body, {compact: true, spaces: 4});
            res.send({result:true, 'value':obj});

        });
        response.on ('error', function (e) {
            console.log ('Error: ' + e.message);
        });
    }


    try {
        await GetTranslationsArray();
        

    } catch(err) {
        console.log(err);
    } finally {

    }
    

});

module.exports = router;


 */