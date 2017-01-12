var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// #######################################################################
var request = require('request');
var parser = require("./parser");
var cheerio = require('cheerio');
const cache = require('memory-cache');
let jar = request.jar();
var unirest = require('unirest');


request.get({ url: 'https://vtop.vit.ac.in/student/captcha.asp', jar: jar }, (err, res, body) => {
  let pixMap = parser.getPixelMapFromBuffer(new Buffer(res.body))
  let captcha = parser.getCaptcha(pixMap)
  if (err) {
    cb(err, null)
  } else {
    request.post({
      url: 'https://vtop.vit.ac.in/student/stud_login_submit.asp',
      form: {
        regno: "15BCE0751",
        passwd: "",
        vrfcd: captcha,
        message: ''
      },
      jar: jar
    }, (err, res, body) => {
      if (err) {
        cb(err, null)
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
        var Request = unirest.get('https://vtop.vit.ac.in/student/course_regular.asp?sem=WS')
          .jar(jar)
          .followRedirect(true)
          .timeout(28000)
          .end(function (res) {
            if (res.error) {
              // console.log('GET error', res.error)
            } else {
              console.log("///@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
              // console.log(res.cookies);
              // console.log(res.body);
              var Request = unirest.get('https://vtop.vit.ac.in/student/course_regular.asp?sem=WS')
                .jar(jar)
                .followRedirect(true)
                .timeout(28000)
                .end(function (res) {
                  // console.log(res.body);
                  var $ = cheerio.load(res.body);
                  tables = $('table');
                  table = $(tables[2]);

                  // console.log(table.text());

//$$$$$$$$$   learn to get table by td and tr      $$$$$$$$ /////////

                  //only theory subjects if condition


                  // for (var i = 0; i < table.find('tr').length; i++) {
                  //   for (var j = 0; j < table.find('tr').eq(i).find('td').length; j++) {
                  //     if(table.find('tr').eq(i).find('td').eq(7).text()=="CBL")
                  //   console.log(table.find('tr').eq(i).find('td').eq(j).text());
                  //   }
                  // }
                  
//##########    "FREE  SLOTS(BY Mayankagg_9722)!!!!!!"  ######################//
var free_slots=[];
                  for (var i = 2; i < 7; i++) {
                    var obj=new Object;
                    obj.day=table.find('tr').eq(i).find('td').eq(0).text();
                    //  console.log(table.find('tr').eq(i).find('td').eq(0).text());
                    var arr=[];
                    for (var j = 0; j < table.find('tr').eq(i).find('td').length; j++) {
                        if(table.find('tr').eq(i).find('td').eq(j).text().length<11){
                          if(j!=7 && !(table.find('tr').eq(0).find('td').eq(j).text()=="THEORY HOURS") ){
                            // console.log(table.find('tr').eq(0).find('td').eq(j).text());
                            if(table.find('tr').eq(0).find('td').eq(j).text().length>3){
                              arr.push(table.find('tr').eq(0).find('td').eq(j).text());
                            }else{
                              arr.push(table.find('tr').eq(1).find('td').eq(j).text());
                            }
                            
                          }
                          obj.free_slots=arr;
                        }
                    }
                    free_slots.push(obj);
                  }
                  console.log(free_slots);
//##########    "FREE  SLOTS(BY Mayankagg_9722)!!!!!!"  ######################//
                });
            }
          });
      }
    })
  }
});

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
