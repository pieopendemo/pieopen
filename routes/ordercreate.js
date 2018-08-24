/**
 * Created by test on 18/8/9.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config');

/* GET home page. */
router.post('/', function(req, res, next) {
    var order_no = Math.floor(Math.random()*(9999999999-1+1)+1);
    var req_data = req.body;
    var coin_code = new String(req_data.coin_code).toLocaleUpperCase();
    var amount = req_data.amount;
    var token = req_data.token;
    console.log(token);
    var options = {
        url: config.host + "/api/v1/open/third/party/"+coin_code+"/pay/qr/create",
        headers: {
            'open-access-token':token
        },
        formData:{
            app_key:config.app_key,
            amount:amount,
            transfer_id:order_no,
            token:token
        }

    };
    try {
        request.post(options, function (error, data) {
            if (error) {
                return res.send({result:false,data:"network api post error"})
            }
            console.log(data.body);

            if(data.statusCode == 200 ) {
                return res.send({result: true, data: data.body})
            }else{
                return res.send({result: false, data: data.body})
            }
        })
    }catch(err){
        return res.send({result:false,data:"network api catch error"})
    }

});

module.exports = router;