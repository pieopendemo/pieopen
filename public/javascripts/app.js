/**
 * Created by test on 18/8/9.
 */


//请求api地址
var remote_host = ""

var app_name = "";
var open = true;
var datenumber = 0;
var start = 0;

function whichClient() {
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return 'ios'
    } else if ((navigator.userAgent.match(/Chrome\/([\d.]+)/) || navigator.userAgent.match(/CriOS\/([\d.]+)/)) &&
        (/(Android)/i.test(navigator.userAgent)) &&
        !(/(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/.test(navigator.userAgent) ||
        /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/.test(navigator.userAgent))) {
        return 'android-chrome'
    } else if (/(Android)/i.test(navigator.userAgent)) {
        return 'android'
    } else {
        return 'pc'
    }
}

//检验比特派
function openBitpie(hrefStr) {

    if (whichClient() != 'pc') {
        var iframe = document.createElement('iframe');
        var aLink = document.createElement('a');
        var body = document.body;
        var loadTimer = null;

        aLink.style.cssText = iframe.style.cssText =
            'display:none;width:0px;height:0px;'

        if (whichClient() == 'ios') {
            aLink.href = hrefStr
            body.appendChild(aLink)
            aLink.click()
        } else if (whichClient() == 'android-chrome') {
            aLink.href = hrefStr
            body.appendChild(aLink)
            aLink.click()
        } else if (whichClient() == 'android') {
            body.appendChild(iframe)
            iframe.src = hrefStr
        }

        start = Date.now()
        console.log("date");
        console.log("visibilitychange",document.visibilityState)
        console.log("ddd",document.hidden);
        loadTimer = setTimeout(function() {
            if (document.hidden || document.webkitHidden) {
                return
            }
            console.log(Date.now() - start)
            console.log("test")
            if (Date.now() - start <= 1300) {
                //todo not found bitpie
                console.log('====')
                if(whichClient().indexOf("and") > -1){
                    window.location = 'https://bitpie.com';
                }else if(whichClient().indexOf("ios")> -1){
                    window.location.href = 'https://itunes.apple.com/us/app/bitpie-bitcoin-wallet/id1168568820'
                }else{
                    window.location = "https://bitpie.com"
                }
            }
        }, 1200)
        console.log("setTimeout");
        var visibilitychange = function() {
            open = false;
            datenumber = Date.now();
            console.log("visibilitychange");
            var tag = document.hidden || document.webkitHidden
            tag && clearTimeout(loadTimer)
            if(document.hidden){
                clearTimeout(loadTimer);
                loadTimer = null;
            }
            console.log(loadTimer);

        }
        console.log("addEventListener")

        document.addEventListener('visibilitychange', visibilitychange, false)
        document.addEventListener(
            'webkitvisibilitychange',
            visibilitychange,
            false
        )
        window.addEventListener(
            'pagehide',
            function() {
                console.log('=====pianpianpianpian')
                clearTimeout(loadTimer)
            },
            false
        )
        window.addEventListener(

            'pageshow',
            function() {
                //no bitpie
                clearTimeout(loadTimer)
            },
            false
        )


    }
}

//登录
$("#btn").on("click",function(){
    $.ajax({
        type: "GET",
        url:remote_host+'/login',
        data:{},
        error: function(request) {
           console.log("err");
        },
        success: function(data) {
            if(data.result){
                var obj = JSON.parse(data.data);
                $("#qr").css({width:"100px",height:"100px"});
                $("#qr").attr("src",obj.qr_url);
                //console.log(obj);
                var hkey = obj.hkey;
                var id = setInterval(function(){
                    $.ajax({
                        type: "GET",
                        url:remote_host+"/query?hkey="+hkey,
                        data:{},
                        error: function(request) {
                            //alert("Connection error");
                        },
                        success: function(data) {
                            if(data.result){
                                var obj = JSON.parse(data.data);
                                //console.log(obj);

                                if(obj.status == 2){
                                    clearInterval(id);
                                    console.log(obj);
                                    $("#btn").html("已登录");
                                    $("#get").attr("title",obj.hkey);
                                    $("#bitpie_login").attr("title",obj.hkey);
                                    $("#order_search").attr("hkey",obj.hkey);


                                }else if(obj.status == 3){
                                    $("#btn").html("请重新点击登录");
                                    $("#qr").attr("src","");
                                    clearInterval(id);
                                }
                            }
                        }
                    });
                },5000)


            }
        }
    });
})

//获得用户信息
$("#get").on("click",function(){
    if(!$("#get").attr("title")){
        alert("请先登录");
    }else{
        console.log(remote_host);
        $.ajax({
            type: "GET",
            url:remote_host+'/getuserinfo?hkey='+$("#get").attr("title"),
            data:{},
            error: function(request) {
                alert("Connection error");
            },
            success: function(data) {

                if(data.result){
                    var obj = JSON.parse(data.data);
                   // console.log(obj);
                    $("#userinfo").html(JSON.stringify(obj));
                    $("#create_order").attr("title",obj.token);
                    $("#order_search").attr("alt",obj.token);
                    $("#transfer").attr("title",obj.token);
                    $("#transferquery").attr("title",obj.token);



                }else{
                    return alert("获取失败");
                }
            }
        });

    }
})

//唤起比特派
$("#bitpie_login").on("click",function(){
    $.ajax({
        type: "GET",
        url:remote_host+'/login',
        data:{},
        error: function(request) {
            console.log("err");
        },
        success: function(data) {
            if(data.result){
                var obj = JSON.parse(data.data);
                $("#qr").css({width:"100px",height:"100px"});
                $("#qr").attr("src",obj.qr_url);
                //console.log(obj);
                var hkey = obj.hkey;
                var scheme ="bitpie://piebank/login?app_name="+app_name+"&app_key="+hkey;
                openBitpie(scheme);
                var id = setInterval(function(){
                    $.ajax({
                        type: "GET",
                        url:remote_host+"/query?hkey="+hkey,
                        data:{},
                        error: function(request) {
                            //alert("Connection error");
                        },
                        success: function(data) {
                            if(data.result){
                                var obj = JSON.parse(data.data);
                                //console.log(obj);

                                if(obj.status == 2){
                                    clearInterval(id);
                                    $("#btn").html("已登录");
                                    $("#get").attr("title",obj.hkey);
                                    $("#bitpie_login").attr("title",obj.hkey);
                                    $("#order_search").attr("hkey",obj.hkey);


                                }else if(obj.status == 3){
                                    $("#btn").html("请重新点击登录");
                                    $("#qr").attr("src","");
                                    clearInterval(id);
                                }
                            }
                        }
                    });
                },1000)




            }
        }
    });



})

//创建订单
$("#create_order").on("click",function(){
    var coin_code = $("#coin").val();
    var amount = $("#amount").val();
    var token = $("#create_order").attr("title");
    if(!coin_code||!amount ){
        return alert("请输入有效参数");
    }else{
        $.ajax({
            type: "POST",
            url:remote_host+"/ordercreate",
            data:{coin_code:coin_code,amount:amount,token:token},
            error: function(request) {
                //alert("Connection error");
            },
            success: function(data) {
                if(data.result){
                    var obj = JSON.parse(data.data);
                    $("#pay_qr").css({width:"100px",height:"100px"});
                    $("#pay_qr").attr("src",obj.qr_url);
                    $("#order_info").html(obj.qr_info);
                    var order = obj.qr_info.split(":");
                   //console.log(order[4]);
                    $("#openbitpietransfer").attr("coin_code",order[2]);
                    $("#openbitpietransfer").attr("amount",order[3]);
                    $("#openbitpietransfer").attr("transfer_id",order[4]);
                    $("#order_search").attr("title",order[4]);
                }else{
                    alert("重新失败");
                }
            }
        });
    }
})

//订单查询
$("#order_search").on("click",function(){
    var transfer_id = $("#order_search").attr("title");
    var token = $("#order_search").attr("alt");
    var hkey = $("#order_search").attr("hkey");
    if(!transfer_id){
        return alert("请输入有效参数");
    }else{
        $.ajax({
            type: "GET",
            url:remote_host+"/queryorder",
            data:{transfer_id:transfer_id,token:token,hkey:hkey},
            error: function(request) {
                //alert("Connection error");
            },
            success: function(data) {
                if(data.result){
                    var obj = JSON.parse(data.data);

                    $("#orderinfo").html(JSON.stringify(obj));

                }else{
                    alert("重新查询");
                }
            }
        });
    }
})


//转账
$("#transfer").on("click",function(){
    var token = $("#transfer").attr("title");
        $.ajax({
            type: "POST",
            url:remote_host+"/transfer",
            data:{token:token},
            error: function(request) {
                //alert("Connection error");
            },
            success: function(data) {
                console.log(data);
                if(data.result){
                    var obj = JSON.parse(data.data);

                    $("#transferinfo").html(JSON.stringify(obj));
                    //transfer_ids
                    $("#transferquery").attr("transfer_id",data.transfer_id);
                    //{"status":"00000","coin_code":"BTC","balance":1136390113,"user_asset_flow_id":138226}

                }else{
                    alert("");
                }
            }
        });

})

//转账查询
$("#transferquery").on("click",function(){
    var token = $("#transferquery").attr("title");
    var transfer_id = $("#transferquery").attr("transfer_id");
    $.ajax({
        type: "GET",
        url:remote_host+"/transferquery",
        data:{token:token,transfer_id:transfer_id},
        error: function(request) {
            //alert("Connection error");
        },
        success: function(data) {
            console.log(data);
            if(data.result){
                var obj = JSON.parse(data.data);

                $("#transferqueryinfo").html(JSON.stringify(obj));
                //[{"balance_before_str":"0","coin_code":"BTC","fee":0,"user_id":102310,"flow_type":101,"flow_detail":{"vendor_app_id":"4","flow_detail":"{\"coin_code\": \"BTC\", \"app_key_id\": 4, \"from_flow_id\": 138236, \"timestamp\": \"1534922603727\", \"to_flow_id\": 138237, \"amount\": 1, \"from_user_id\": 102310, \"to_user_id\": 100615}","flow":null,"user_asset_flow_id":138236,"vendor_flow_id":"2846906243","user_asset_flow_detail_id":60298},"balance_after_str":"0","create_at":"2018-08-22T07:23:24","fee_str":"0","balance_before":1136390111,"amount":1,"action_object_id":100615,"amount_str":"0","user_asset_flow_id":138236,"balance_after":1136390110,"fee_type":0}]

            }else{
                alert("");
            }
        }
    });

})


//唤起支付
$("#openbitpietransfer").on("click",function(){
    var transfer_id = $("#openbitpietransfer").attr("transfer_id");
    var coin_code = $("#openbitpietransfer").attr("coin_code");
    var amount = $("#openbitpietransfer").attr("amount");
    var scheme = "bitpie://piebank/pay?order_id="+transfer_id+"&amount="+amount+"&coin_code="+coin_code+"&app_name="+app_name;
    openBitpie(scheme);

})






