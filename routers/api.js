/**
 * Created by 郝梓淳 on 2017/8/22.
 */
var express = require('express')
var router = express.Router()
var superagent = require('superagent')
var cheerio = require("cheerio")
var crypto = require("crypto")

router.post('/jluscore', function (req, res, next) {
    var jluname = req.body.name;
    var jlupassword = req.body.password;
    var jlu = new jlucheck()
    jlu.getInfo(jluname,jlupassword).then((item)=>{
        if(item.errno==0){
            res.send(item)
        }else {
            res.send('账号密码错误')
        }
    })
});

router.post('/cetscore', function (req, res, next) {
    var userid = req.body.id;
    console.log(userid)
    var cet = new cet4check()
    if(userid){
        cet.getInfo(userid).then((info)=>{
            if(info.length>0){
                res.send(info)
            }else {
                res.send('身份证未查询到')
            }
        })
    }
    else{
        res.send("输入有误")
    }

});

var cetUrl = {
    jilin: 'http://cet.jlste.com.cn/cet/query/qry/',
    cet4: 'http://www.chsi.com.cn/cet/query',
}
var jluUrl = {
    log: 'http://cjcx.jlu.edu.cn/score/action/security_check.php',
    jlucheck: 'http://cjcx.jlu.edu.cn/score/action/service_res.php',
}
function cet4check() {

}
cet4check.prototype.getCard = function (userid) {
    return new Promise(function (resolve, reject) {
        superagent.get(cetUrl.jilin + userid).end(function (err, response) {
            if(!response.text){
                reject(response.text)
            }
            var $ = cheerio.load(response.text);
            try {
                var name = $("td").text().match(/考生姓名(.*?)身份证号/)[1];
                if( !$("td").text().match(/考生姓名(.*?)身份证号/)){
                    reject( $("td").text().match(/考生姓名(.*?)身份证号/))
                }
                name = name.slice(0,3)
                var cet4Card = $("td").text().match(/准考证号(\d+)/)[1]
                if (cet4Card.length == 15) {
                    var info = {
                        zkzh: cet4Card,
                        xm: name
                    }
                    resolve(info);
                }
                else {
                    reject(err)
                }
            }
            catch(err){
                resolve(err) // 可执行

                            }


        });
    });
}

cet4check.prototype.getScore = function (info) {
    return new Promise(function (resolve, reject) {
        superagent.get(cetUrl.cet4).set({
            "Host": "www.chsi.com.cn",
            "Referer": "http://www.chsi.com.cn/cet/"
        }).query(info).end(function (err, response) {
            var $ = cheerio.load(response.text)
            var cetInfo = $("tr").children("td").text()
            var userInfo = cetInfo.replace(/\s+/g, ",")
            userInfo = userInfo.split(",").splice(1)
            if(userInfo.length>5){
                resolve(userInfo)
            }
            else {
                reject("该身份证号信息不存在")
            }
        })
    })
}

cet4check.prototype.getInfo = function (id) {
    var that = this
    return new Promise(function (resolve, reject) {
        that.getCard(id).then(info => {
            that.getScore(info).then(info => {
                resolve(info)
            })
        })
    })
}




function jlucheck() {

}
jlucheck.prototype.getLoginCookie = function (userid, pwd) {
    return new Promise(function (resolve, reject) {
        superagent.post(jluUrl.log).type('form').send({
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
        superagent.post(jluUrl.jlucheck).set("Cookie", cookie).type('json').send(
            title
        ).redirects(0).end(function (err, response) {
            var item = JSON.parse(response.text);
            resolve(item)
        });
    });
}

jlucheck.prototype.getInfo = function (user, psw) {
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
                console.log(item.items[0].studName)
                resolve(item)
            })
        })
    })
};


var cet = new cet4check()

module.exports = router;
