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

// var url = {
//     log: 'http://cjcx.jlu.edu.cn/score/action/security_check.php',
//     jlucheck: 'http://cjcx.jlu.edu.cn/score/action/service_res.php',
// }
//
// function jlucheck() {
// }
// jlucheck.prototype.getLoginCookie = function (userid, pwd) {
//     return new Promise(function (resolve, reject) {
//         superagent.post(url.log).type('form').send({
//             j_username: userid,
//             j_password: pwd,
//         }).redirects(0).end(function (err, response) {
//             //获取cookie
//             var cookie = response.headers["set-cookie"];
//             resolve(cookie);
//         });
//     });
// }
//
// jlucheck.prototype.getData = function (cookie, title) {
//     var that = this
//     return new Promise(function (resolve, reject) {
//         //传入cookie
//         superagent.post(url.jlucheck).set("Cookie", cookie).type('json').send(
//             title
//         ).redirects(0).end(function (err, response) {
//             var item = JSON.parse(response.text);
//             resolve(item)
//         });
//     });
// }
//
// jlucheck.prototype.totly = function (user, psw,res) {
//     var md5 = new crypto.createHash('md5')
//     md5.update('UIMS'+user+psw);
//     var r_hex = md5.digest('hex');
//     // console.log(r_hex);
//     // return r_hex;
//     var that = this
//     var title = {"tag": "lessonSelectResult@oldStudScore", "params": {"xh": user, "termId": 132}}
//     return new Promise((resolve, reject) => {
//         that.getLoginCookie(user, r_hex).then((cookie) => {
//             that.getData(cookie, title).then((item) => {
//                 resolve(item)
//             })
//         })
//     })
// };
app.listen(port);
