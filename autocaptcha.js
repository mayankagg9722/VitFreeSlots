var parser = require("./parser");
var unirest = require('unirest');
var CookieJar = unirest.jar();

function autofill(callback){
   function requestCaptcha(res){
     let pixMap = parser.getPixelMapFromBuffer(new Buffer(res.body));
        let captcha = parser.getCaptcha(pixMap);
        callback(captcha,CookieJar);
 }
 Request = unirest.get("https://vtop.vit.ac.in/student/captcha.asp")
         .encoding(null)
         .jar(CookieJar)
        .timeout(26000)
        .end(requestCaptcha); 
}


 
exports.autofill=autofill;
