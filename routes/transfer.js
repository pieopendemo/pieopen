/**
 * Created by test on 18/8/9.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config');
var crypto = require('crypto');
var uuid = require('uuid');


/* GET home page. */
router.post('/', function(req, res, next) {
    var token = req.body.token;
    var coin_code = "BTC",
        amount = 1,
        transfer_id = Math.floor(Math.random()*(9999999999-1+1)+1),
        nonce_string = uuid.v1(),
        timestamp = Date.parse(new Date()),
        user_id = "100615";
    //这里的md5Arr的对象的 KEY 顺序是ASCII从小到大。如果不是这个顺序签名信息会验证不通过。
    var md5Arr = [{amount:amount},{app_key:config.app_key},{coin_code:coin_code},{nonce_string:nonce_string},{timestamp:timestamp},{transfer_id:transfer_id},{user_id:user_id},{key:config.secret_key}];
    var stringmd5 = "";
    var arr = [];
    for(var i= 0,l=md5Arr.length;i<l;i++){
        for(var a in md5Arr[i]){
            stringmd5+= a + "=" +md5Arr[i][a]+"&";
        }
    }

    stringmd5 = stringmd5.substr(0,stringmd5.length - 1);
    console.log(stringmd5);
    var sign_string = crypto.createHash('sha256').update(stringmd5).digest("hex");
    console.log(sign_string);
    var options = {
        url: config.host + "/api/v1/open/third/party/transfer",
        headers: {
            'open-access-token':token
        },
        formData:{
            app_key: config.app_key,
            user_id: user_id,
            coin_code: coin_code,
            amount: amount,
            transfer_id: transfer_id,
            sign_string: sign_string,
            nonce_string: nonce_string,
            timestamp: timestamp
        }

    };
    //console.log(options.formData);
    try {
        request.post(options, function (error, data) {
            if (error) {
                return res.send({result:false,data:"network api post error"})
            }

            if(data.statusCode == 200 ) {
                //console.log(data.body);
                return res.send({result: true, data: data.body,transfer_id:transfer_id})
            }else{

                return res.send({result: false, data: data.body})
            }
        })
    }catch(err){
        return res.send({result:false,data:"network api catch error"})
    }

});

module.exports = router;
