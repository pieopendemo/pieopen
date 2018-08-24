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
    console.log(JSON.stringify(req.body));
    var stringmd5 = "";
    var data = req.body;
    var keys = []
    for(var key in data) {
        keys.push(key)
    }
    keys.sort()
    data.key = config.secret_key;
    keys.push('key');
    keys.forEach(function(v){
         if(v != "sign_string"){
             stringmd5 += v+"="+data[v]+"&";
         }

    })
    //console.log(stringmd5);
    stringmd5 = stringmd5.substr(0,stringmd5.length - 1);
    console.log("stringmd5",stringmd5);
    var validation = crypto.createHash('sha256').update(stringmd5).digest("hex");
    if(validation == data.sign_string){
        console.log("true");
        return res.send({result: true})
    }else{
        console.log("false");
        return res.send({result: false})
    }



});

module.exports = router;
