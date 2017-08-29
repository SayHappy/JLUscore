var express = require('express')
var app = express()
var swig = require('swig');
var superagent = require('superagent')
var crypto = require('crypto')
var quetystring = require('querystring');
var bodyParser=require('body-parser');
swig.setDefaults({cache:false});
//取消模板缓存 上线时取消！
app.use('/public',express.static(__dirname+'/public')); //相对地址返回文件
//静态文件托管
app.engine('html',swig.renderFile);
//设置模板目录
app.set('views','./views');
//注册模板引擎
app.set('view engine','html')
//处理接收请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
var port = 8080

app.use('/api',require('./routers/api'));
app.use('/main',require('./routers/main'));
app.all('*', function(req, res, next) { //处理跨域
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.listen(port);
