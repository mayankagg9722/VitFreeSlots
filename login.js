var request = require('request');
const cache = require('memory-cache');
require('dotenv').config();
var autocaptcha=require("./autocaptcha");

function doLogin(callback) {
    autocaptcha.autofill(function(captcha,jar){
        request.post({
                url: 'https://vtop.vit.ac.in/student/stud_login_submit.asp',
                form: {
                    regno: process.env.VIT_USERNAME,
                    passwd: process.env.VIT_PASSWORD,
                    vrfcd: captcha,
                    message: ''
                },
                jar: jar
            }, (err, res, body) => {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(res.body);
                    let cookie = cache.get('cookie')
                    cache.put('cookie', jar.getCookieString('https://vtop.vit.ac.in/student/stud_login_submit.asp'), 10000)
                    cookie = cache.get('cookie')
                    cookie.split(';').forEach((x) => {
                        jar.setCookie(request.cookie(x), 'https://vtop.vit.ac.in/student/')
                    })
                    // console.log(cookie);
                    // console.log(jar);
                    return callback(jar);
                }
            })
    });

}
exports.doLogin = doLogin;
