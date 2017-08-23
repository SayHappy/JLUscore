/**
 * Created by 郝梓淳 on 2017/8/22.
 */
// var api = require("./api")
var express = require('express');
var router = express.Router();
// var cet4check =new api.cet4check()
// var jlucheck = new api.jlucheck()

router.get('/score', function (req, res, next) {
    //从浏览器读取
    res.render('score/index');
});

module.exports=router