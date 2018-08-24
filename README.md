# 说明文档

1、下载测试项目

```
//环境说明 Node 版本最好大于 6.0.0 

git clone https://github.com/pieopendemo/pieopen.git

cd pieopen

```

2、修改配置

```
config/default.json
//填写对应的 host、app_key、secret_key
```

3、修改本地访问地址

```
public/javascripts/app.js

//填写remote_host(这个是测试项目的app地址) app_name

```


4、启动程序

```
DEBUG=myapp npm start
```


5、测试步骤

1. 通过比特派注册 PIEOPEN key 
2. 开启 Node.js Demo
3. 通过比特派 app 扫一扫
4. 待登录按钮变成已登录之后点击获取用户信息
5. 输入amount,coin_code 点击获取支付二维码
6. 通过比特派二维码支付
7. 支付成功之后，获取订单信息即可。