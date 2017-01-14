var request = require('request');
const cache = require('memory-cache');
var autocaptcha = require("./autocaptcha");
var unirest = require('unirest');

function doLogin(details, callback) {
    autocaptcha.autofill(function (captcha, jar) {
        Request = unirest.post("https://vtop.vit.ac.in/student/stud_login_submit.asp")
            .form({
                regno: details.username,
                passwd: details.password,
                vrfcd: captcha,
                message: ''
            })
            .jar(jar)
            .timeout(26000)
            .end(function (res) {
                let cookie = cache.get('cookie')
                cache.put('cookie', jar.getCookieString('https://vtop.vit.ac.in/student/stud_login_submit.asp'), 10000)
                cookie = cache.get('cookie')
                cookie.split(';').forEach((x) => {
                    jar.setCookie(request.cookie(x), 'https://vtop.vit.ac.in/student/')
                })
                return callback(jar);
            });
    });

}
exports.doLogin = doLogin;
