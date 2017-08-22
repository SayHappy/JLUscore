var express = require('express')
var app = express()
var superagent = require('superagent')
var crypto = require('crypto')
var quetystring = require('querystring');
var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var url = {
    log: 'http://cjcx.jlu.edu.cn/score/action/security_check.php',
    jlucheck: 'http://cjcx.jlu.edu.cn/score/action/service_res.php',
}

function jlucheck() {
}
jlucheck.prototype.getLoginCookie = function (userid, pwd) {
    return new Promise(function (resolve, reject) {
        superagent.post(url.log).type('form').send({
            j_username: userid,
            j_password: pwd,
        }).redirects(0).end(function (err, response) {
            //获取cookie
            var cookie = response.headers["set-cookie"];
            resolve(cookie);
        });
    });
}

jlucheck.prototype.getData = function (cookie, title) {
    var that = this
    return new Promise(function (resolve, reject) {
        //传入cookie
        superagent.post(url.jlucheck).set("Cookie", cookie).type('json').send(
            title
        ).redirects(0).end(function (err, response) {
            var item = JSON.parse(response.text);
            resolve(item)
        });
    });
}

jlucheck.prototype.totly = function (user, psw,res) {
    var md5 = new crypto.createHash('md5')
    md5.update('UIMS'+user+psw);
    var r_hex = md5.digest('hex');
    // console.log(r_hex);
    // return r_hex;
    var that = this
    var title = {"tag": "lessonSelectResult@oldStudScore", "params": {"xh": user, "termId": 132}}
    return new Promise((resolve, reject) => {
        that.getLoginCookie(user, r_hex).then((cookie) => {
            that.getData(cookie, title).then((item) => {
                resolve(item)
            })
        })
    })
};



app.post('/', function (req, res, next) {
    var jluname = req.body.name;
    var jlupassword = req.body.password;
    var jlu = new jlucheck()
    jlu.totly(jluname,jlupassword).then((item)=>{
        if(item.errno==0){
            res.send(item)
        }else {
            res.send('账号密码错误')
        }
    })



});
app.listen(8002);
