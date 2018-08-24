/**
 * Created by test on 18/8/9.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config');

/* GET home page. */
router.get('/', function(req, res, next) {
    var app_key = config.app_key;
    var token = req.query.token;
    var transfer_id = req.query.transfer_id;
    var transfer_ids = [];
    //transfer_ids.push(order);
    var options = {
        url: config.host + "/api/v1/open/third/party/app/"+app_key+"/flow/"+transfer_id,
        headers: {
            'open-access-token':token
        },
        formData:{
        }

    };
    //console.log(options);
    try {
        request.get(options, function (error, data) {
            if (error) {
                return res.send({result:false,data:"network api post error"})
            }
           // console.log(data.body);
            if(data.statusCode == 200 ) {
                console.log(data.body);
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