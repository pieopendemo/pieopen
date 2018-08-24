/**
 * Created by test on 18/8/9.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config');

/* GET home page. */
router.get('/', function(req, res, next) {
    var hkey = req.query.hkey;
    var options = {
        url: config.host + "/api/v1/open/third/party/login/query/"+hkey,
    };
    try {
        request.get(options, function (error, data) {
            if (error) {
                return res.send({result:false,data:"network api post error"})
            }
           // console.log(data);
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